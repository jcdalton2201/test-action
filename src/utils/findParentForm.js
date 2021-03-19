/**
 * Function to find a form element in the parent nodes.
 * @param {HTMLElement} elem 
 * @returns {HTMLElement || null} 
 */
export const findParentForm = elem => {
    let parent = elem.parentNode;
    if(parent && parent.tagName !== 'FORM') {
        parent = findParentForm(parent);
    } else {
        if(!parent && elem.toString() === '[object ShadowRoot]') {
            parent = findParentForm(elem.host);
        }
    }
    return parent;
};