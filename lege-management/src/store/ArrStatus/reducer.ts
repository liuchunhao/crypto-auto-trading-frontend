// data management
// import { act } from "react-dom/test-utils";
import handleArr from "./index"

const defaultState = {
    ...handleArr.state,     // spread operator (...) is used to copy all properties of an object to another object
}

// let reducer = (state = defaultState, action: { type: string, val: number }) => {
const reducer = (state = defaultState, action: { type: string }) => {   // val is not needed

    // dispatch() will call this function ; action is an object with a type property
    console.log("reducer.ts: action.type = " + action.type);

    const newState = JSON.parse(JSON.stringify(state)) // deep copy

    // switch (action.type) {
    //     case handleArr.sarrpush:
    //         // newState.num += 1
    //         // handleArr.actions[handleArr.sarrpush](newState, action)
    //         handleArr.actions.sarrpush(newState, action)
    //         break
    //     default:
    //         break;
    // }
    // optimization: if the state is not changed, return the original state

    for (const key in handleArr.actionNames){
        if(action.type === handleArr.actionNames[key]){
            handleArr.actions[key](newState, action);
            break;
        }
    }

    return newState
}

export default reducer