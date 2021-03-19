import {LitElement} from 'lit-element';
export class BaseElement extends LitElement {
    constructor() {
        super();
        this.refs ={};
        this.uuid = this.uuidv4();
    }
    /**
     * bind this to the method
     * @param {String} methodName 
     * @returns void
     */
    bindMethod(methodName) {
        this[methodName] = this[methodName].bind(this);
    }
    /**
     * binds the array of methods with this.
     * @param {Array<String>} methods
     * @returns void 
     */
    bindMethods(methods =[]) {
        methods.forEach(method => this.bindMethod(method));
    }
    /**
     * Return any renderRoot element with [data-ref]
     * equal to the first argument
     * @param {string} ref
     * @return {HTMLElement}
     */
    ref(ref = '') {
        return this.renderRoot ? this.renderRoot.querySelector(`[data-ref="${ref}"]`) : null;
    }

    buildRefs(){
        if(this.renderRoot){
            this.renderRoot.querySelectorAll('[data-ref]').forEach(ref =>(this.refs[ref.dataset.ref] = ref));
        }
    }
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}