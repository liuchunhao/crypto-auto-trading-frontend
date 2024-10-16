const store = {
    state: {
        // 放數據
        sarr: [10, 20, 30]
    },
    actions: {
        // 放方法
        sarrpush(newState: { sarr: number[] }, action: { type: string, val: number }) {
            newState.sarr.push(action.val)
        },
    },
    // sarrpush: "sarrpush",
    actionNames: {
        // sarrpush:"sarrpush"
    }
}

const actionNames = {}    // global variable
for (const key in store.actions) {
    actionNames[key] = key
}
store.actionNames = actionNames

export default store