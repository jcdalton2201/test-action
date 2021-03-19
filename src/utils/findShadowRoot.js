/**
 * find a nodes shdow root
 * @param {HTMLElement} node the nodd to find the shadow root
 * @returns {HTMLElement | false}
 */
export const findSahdowRoot = node => {
    let parent = node.parentNode;
    while(parent && parent.toString() !== '[object DocumentFragment]') {
        parent = parent.parentNode;
    }
    if(parent && parent.toString() === '[object DocumentFragment]'){
        return parent.firstElementChild;
    }
    return parent;
};