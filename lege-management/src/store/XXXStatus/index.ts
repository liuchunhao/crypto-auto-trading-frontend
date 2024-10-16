const store = {
    state: {
        // 放數據

    },
    actions: {
        // 放同步方法

    },
    asyncActions: {
        // 放異步方法

    },
    actionNames: {}
}

const actionNames = {}
for (const key in store.actions) {
    actionNames[key] = key
    store.actionNames = actionNames;
}

export default store
