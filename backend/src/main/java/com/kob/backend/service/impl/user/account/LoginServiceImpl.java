package com.kob.backend.service.impl.user.account;

import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.account.LoginService;
import com.kob.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Map<String, String> getToken(String username, String password) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        try {
            Authentication authenticate = authenticationManager.authenticate(authenticationToken);  // 登录失败会自动处理

            System.out.println("test1" + " " + username + " " + password);  // 测试1

            UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
            User user = loginUser.getUser();
            String jwt = JwtUtil.createJWT(user.getId().toString());

            Map<String, String> map = new HashMap<>();
            map.put("error_message", "success");
            map.put("token", jwt);

            System.out.println("test2" + " " + username + " " + password);  //测试2
            System.out.println(map);  // 测试三

            return map;
        } catch (Exception e) {
            Map<String, String> map = new HashMap<>();
            map.put("error_message", "账号不存在，请先注册一个账号");

            return map;
        }
    }
}
