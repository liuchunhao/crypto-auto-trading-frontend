const store = {
    state: {
        // 放數據
        num: 20
    },
    actions: {  //  只放同步的方法
        // 放方法
        add1(newState: { num: number }, action: { type: string, val: number }) {
            console.log("add1:", action);
            newState.num++
        },
        add(newState: { num: number }, action: { type: string, val: number }) {
            setTimeout(() => {
                console.log("add", action);
                newState.num += action.val
            }, 1000);
        },
        sub(newState: { num: number }, action: { type: string, val: number }) {
            console.log("sub", action);
            newState.num -= action.val
        }
    },

    // 優化redux-thunk的寫法 模仿vuex的寫法
    asyncActions: {
        // 放異步的方法
        asyncAdd(dispatch: Function) {
            setTimeout(() => {
                dispatch({ type: "add", val: 10 })
            }, 1000)
        }
    },

    // as a convention, the name of the mutation is the same as the name of the action
    // add: "add",
    // sub: "sub",
    // add1: "add1",
    actionNames: {

    }
}

const actionNames = {}    // global variable
for (const key in store.actions) {
    actionNames[key] = key
}
store.actionNames = actionNames

export default store