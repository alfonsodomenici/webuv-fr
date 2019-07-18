import DateFunction from "../DateFunction.js";
import UvService from "../UvService.js";
import { html, render } from "./../../node_modules/lit-html/lit-html.js";

export default class SearchUv extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.service = new UvService();
        this.oldSearch = {};
    }

    connectedCallback() {
        this.service.postazioni()
            .then(json => {
                this.postazioni = json;
                render(this.createView(), this.root);
            }
            );
    }

    createView() {
        return html`
                <style> al
                    @import url(./../pure.css);
                    :host{
                        all: initial;
                        display:block;
                    }
                </style>
                <form method="POST" @submit=${e => this.onsearch(e)} class='pure-form'>
                    <legend>Parametri Ricerca</legend>
                    <label>Postazione    
                        <select name="postazione">
                        ${this.postazioni.map(p => html`<option value="${p.id}">${p.descrizione}</option value>`)}                        
                        </select>
                    </label>
                    <label>Dal    
                        <input name="dal" type="date" placeholder="dal" value=${DateFunction.standard(new Date("2018/05/01"))}></input>
                    </label>
                    <label>Al
                        <input name="al" type="date" placeholder="al" value=${DateFunction.standard(new Date("2018/05/09"))}></input>
                    </label>
                    <label>
                        <input name="flag10" type="checkbox"/>Valori ogni 10 minuti
                    </label>
                    <input type="submit" class='pure-button pure-button-primary' value="Cerca" />
                </form>
        `;
    }

    onsearch(e) {
        e.preventDefault();
        const { postazione, dal, al, flag10 } = e.target.elements;
        if (this.isChange(postazione, dal, al, flag10)) {
            this.dispatchEvent(new CustomEvent('search', {
                bubbles: true,
                composed: true,
                detail: {
                    idPostazione: postazione.value,
                    dal: dal.value,
                    al: al.value,
                    flag10: flag10.checked
                }
            }));
        }
    }

    isChange(postazione, dal, al, flag10) {
        const search = {
            idPostazione: postazione.value,
            dal: dal.value,
            al: al.value,
            flag10: flag10.checked
        };
        const change = JSON.stringify(this.oldSearch) !== JSON.stringify(search);
        this.oldSearch = search;
        return change;
    }
}
customElements.define('search-uv', SearchUv);