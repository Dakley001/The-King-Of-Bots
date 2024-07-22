const ModulePk = {
    state: {
        status: "matching",  // matching表示匹配界面、playing表示对战界面
        socket: null,  // WebSocket对象
        opponent_username: "",  // 对手用户名
        opponent_photo: "",  // 对手头像
        gamemap: null,  // 地图信息
        a_id: 0,  // 蓝方id
        a_sx: 0,  // 蓝方初始位置x
        a_sy: 0,  // 蓝方初始位置y
        b_id: 0,  // 红方id
        b_sx: 0,  // 红方初始位置x
        b_sy: 0,  // 红方初始位置y
        gameObject: null,  // 地图对象
        loser: "none",  // none, all, A, B
    },
    getters: {
    },
    mutations: {
        updateStatus(state, status) {
            state.status = status;
        },
        updateSocket(state, socket) {
            state.socket = socket;
        },
        updateOpponent(state, opponent) {
            state.opponent_username = opponent.username;
            state.opponent_photo = opponent.photo;
        },
        updateGame(state, game) {
            state.gamemap = game.map;
            state.a_id = game.a_id;
            state.a_sx = game.a_sx;
            state.a_sy = game.a_sy;
            state.b_id = game.b_id;
            state.b_sx = game.b_sx;
            state.b_sy = game.b_sy;
        },
        updateGameObject(state, gameObject) {
            state.gameObject = gameObject;
        },
        updateLoser(state, loser) {
            state.loser = loser;
        }
    },
    actions: {
    },
    modules: {
    }
};

export default ModulePk;