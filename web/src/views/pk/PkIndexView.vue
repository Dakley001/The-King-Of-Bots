<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'"></PlayGround>
    <MatchGround v-if="$store.state.pk.status === 'matching'"></MatchGround>
    <ResultBoard v-if="$store.state.pk.loser != 'none'"></ResultBoard>
    <div class="user-color"
        v-if="$store.state.pk.status === 'playing' && parseInt($store.state.user.id) === parseInt($store.state.pk.a_id)">
        您是蓝方
    </div>
    <div class="user-color"
        v-if="$store.state.pk.status === 'playing' && parseInt($store.state.user.id) === parseInt($store.state.pk.b_id)">
        您是红方
    </div>
</template>

<script>
import PlayGround from '@/components/PlayGround.vue';
import MatchGround from '@/components/MatchGround.vue';
import ResultBoard from '@/components/ResultBoard.vue';
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
    name: "PkIndexView",
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();
        const socketUrl = `wss://www.buugame.top/websocket/${store.state.user.token}/`;

        store.commit("updateIsRecord", false);

        let socket = null;
        // let heartbeatInterval = null;
        // const sendHeartbeat = () => {
        //     if (socket && socket.readyState === WebSocket.OPEN) {
        //         socket.send(JSON.stringify({ event: 'heartbeat' }));
        //     }
        // };
 
        onMounted(() => {
            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            })
            socket = new WebSocket(socketUrl);

            socket.onopen = () => {
                console.log("Connected to the WebSocketServer！");
                store.commit("updateSocket", socket);
                // heartbeatInterval = setInterval(sendHeartbeat, 5000); // 5秒发送一次心跳
            }

            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                if (data.event === "start-matching") {  // 匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                    }, 200);  // 200ms转为实时游戏对战界面
                    store.commit("updateGame", data.game);
                } else if (data.event === "move") {
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                } else if (data.event === "result") {
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;

                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    }
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
                }
            }

            socket.onclose = () => {
                console.log("Disconnected！");
                // clearInterval(heartbeatInterval);
            }
        });

        onUnmounted(() => {
            socket.close();
            // clearInterval(heartbeatInterval);
            store.commit("updateStatus", "matching");
            store.commit("updateLoser", "none");
        })
    }
}
</script>

<style scoped>
div.user-color {
    text-align: center;
    color: white;
    font-size: 30px;
    font-weight: 600;
}
</style>