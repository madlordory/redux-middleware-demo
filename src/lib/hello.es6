/**
 * Created by madlord on 16/5/4.
 */
import Toast from "@cortex/wepp-module-toast";
export default class HelloWorld {
    static sayHelloWorld () {
        Toast(window.store.info);
    }
}
