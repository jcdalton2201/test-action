/**
 * Makes sure an element is defined only once
 * @param {String} tagName
 * @param {String} elementClass
 */
export const defineSquidElement = (tagName, elementClass, config) => {
    if (!customElements.get(tagName)) {
        customElements.define(tagName, elementClass, config);
    } else {
        console.warn(`${tagName} has already been defined`);
    }
};