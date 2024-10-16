import handleNum from "./index"

const defaultState = {
    ...handleNum.state,     // spread operator (...) is used to copy all properties of an object to another object
}

// let reducer = (state = defaultState, action: { type: string, val: number }) => {
const reducer = (state = defaultState, action: { type: string }) => {  // val is not needed

    console.log("reducer.ts: action.type = " + action.type);

    const newState = JSON.parse(JSON.stringify(state)) // deep copy

    for (const key in handleNum.actionNames){
        if(action.type === handleNum.actionNames[key]){
            handleNum.actions[key](newState, action);
            break;
        }
    }
    return newState
}

export default reducer