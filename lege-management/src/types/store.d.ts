// 類型聲明文件中不要直接使用 import store from "@/store"，而是使用 typeof import("@/store")，這樣就可以避免循環引用的問題。
// import store from "@/store" // Not recommended to import 'store' globally , you should import above instead.
type RootState = ReturnType<typeof import("@/store").getstate>

// all these *.d.ts files are for TypeScript compiler to check the types of the imported modules

// To fix the error in the store/index.ts : Property '__REDUX_DEVTOOLS_EXTENSION__' does not exist on type 'Window & typeof globalThis'.
// you need to globally declare the property '__REDUX_DEVTOOLS_EXTENSION__' on the Window interface
interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: function;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: function;  // redux-thunk supported devtools
}