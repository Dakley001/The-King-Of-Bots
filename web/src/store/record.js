const ModuleRecord = {
    state: {
        is_record: false,  // 是否为录像
        a_steps: "",  // 蓝方的步数
        b_steps: "",  // 红方的步数
        record_loser: "",  // 录像的败方
    },
    getters: {
    },
    mutations: {
        updateIsRecord(state, is_record) {
            state.is_record = is_record;
        },
        updateSteps(state, data) {
            state.a_steps = data.a_steps;
            state.b_steps = data.b_steps;
        },
        updateRecordLoser(state, loser) {
            state.record_loser = loser;
        }
    },
    actions: {
    },
    modules: {
    }
}

export default ModuleRecord