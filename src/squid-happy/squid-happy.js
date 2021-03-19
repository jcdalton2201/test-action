
import {LitElement, html} from 'lit-element';
import { defineSquidElement } from '../utils/defineSquidElement.js';
import styles from './squid-happy.scss';
export class SquidHappy extends LitElement {
    static get styles() {
        return [styles];
    }
    static get properties() {
        return {};
    }
    render(){
        return html`<h1>Happy</h1>`;
    }
}
defineSquidElement('squid-happy',SquidHappy);
