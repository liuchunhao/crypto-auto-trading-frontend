// data management
import handleNum from "./index"

const defaultState = {
    // num: 20
    // num: NumStatus.state.num   // too verbose if there are many states
    ...handleNum.state,     // spread operator (...) is used to copy all properties of an object to another object
}

// let reducer = (state = defaultState, action: { type: string, val: number }) => {
const reducer = (state = defaultState, action: { type: string }) => {  // val is not needed

    // dispatch() will call this function ; action is an object with a type property
    console.log("reducer.ts: action.type = " + action.type);

    const newState = JSON.parse(JSON.stringify(state)) // deep copy

    // switch (action.type) {
    //     case handleNum.add1:
    //         // newState.num += 1
    //         handleNum.actions.add1(newState, action)
    //         break
    //     case handleNum.add:
    //         // newState.num += action.val
    //         // handleNum.actions.add(newState, action)
    //         handleNum.actions[handleNum.add](newState, action)
    //         break
    //     case handleNum.sub:
    //         // newState.num -= action.val
    //         handleNum.actions.sub(newState, action)
    //         break
    //     default:
    //         break;
    // }

    for (const key in handleNum.actionNames){
        if(action.type === handleNum.actionNames[key]){
            handleNum.actions[key](newState, action);
            break;
        }
    }
    return newState
}

export default reducer