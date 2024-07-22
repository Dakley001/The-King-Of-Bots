package com.kob.botrunningsystem.service.impl.utils;

//import com.kob.botrunningsystem.utils.BotInterface;
import org.joor.Reflect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.UUID;
import java.util.function.Supplier;

@Component
public class Consumer extends Thread {
    private Bot bot;
    private static RestTemplate restTemplate;
    private final static String receiveBotMoveUrl = "http://127.0.0.1:3000/pk/receive/bot/move/";

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        Consumer.restTemplate = restTemplate;
    }


    // 启动Bot
    public void startTimeout(long timeout, Bot bot) {
        this.bot = bot;  // 设置当前Consumer线程中的Bot实例
        this.start();  // 启动当前Consumer线程，新线程开始执行run方法

        try {
            this.join(timeout);  // 当前线程等待新线程执行结束，最多等待timeout毫秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            this.interrupt();  // 无论新线程是否超时，最终都中断新线程
        }
    }

    // 在给定的代码字符串code中的类名后添加一个唯一标识符uuid
    private String addUid(String code, String uid) {  // 在code中的Bot类名后添加uid
        // int k = code.indexOf(" implements com.kob.botrunningsystem.utils.BotInterface");
        int k = code.indexOf(" implements java.util.function.Supplier<Integer>");
        return code.substring(0, k) + uid + code.substring(k);
    }

    // 解析并执行Bot代码
    @Override
    public void run() {
        UUID uuid = UUID.randomUUID();
        String uid = uuid.toString().substring(0, 8);

//        BotInterface botInterface = Reflect.compile(
//                "com.kob.botrunningsystem.utils.Bot" + uid,
//                addUid(bot.getBotCode(), uid)
//        ).create().get();

        Supplier<Integer> botInterface = Reflect.compile(
                "com.kob.botrunningsystem.utils.Bot" + uid,
                addUid(bot.getBotCode(), uid)
        ).create().get();

        // docker常用文件传参，灵活性高、可扩展至多语言通信
        File file = new File("input.txt");
        try (PrintWriter fout = new PrintWriter(file)) {
            fout.println(bot.getInput());
            fout.flush();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

//        Integer direction = botInterface.nextMove(bot.getInput());
        Integer direction = botInterface.get();
        System.out.println("Move-direction: " + bot.getUserId() + " " + direction);

        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", bot.getUserId().toString());
        data.add("direction", direction.toString());

        restTemplate.postForObject(receiveBotMoveUrl, data, String.class);
    }
}
