export const emitEvent = (name, detail, element) => {
    const customEvent = new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true
    });
    element.dispatchEvent(customEvent);
};