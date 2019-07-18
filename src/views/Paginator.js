import { html, render } from "./../../node_modules/lit-html/lit-html.js";

export default class Paginator extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.bindings();
    }

    connectedCallback() {
        render(this.createView(), this.root);
        this.loadButtons();
        this.init();
    }

    init() {
        this.current = 0;
        this.lastPage = this.calcLastPage();
        console.log(`init paginator ${this.lastPage}`)
        this.check();
    }

    static get observedAttributes() {
        return ['count', 'page'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`attributeChangedCallback() ${name} ${oldValue} ${newValue}`);
        if (name === 'count' && oldValue !== null) {
            this.init();
        }
    }

    bindings() {
        this.onFirst = this.onFirst.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onLast = this.onLast.bind(this);
        this.check = this.check.bind(this);
        this.fireEvent = this.fireEvent.bind(this);
    }

    createView() {
        return html`
            <style>
                @import url("./../pure.css");
            </style>
            <button id="btnFirst" class="pure-button" @click=${this.onFirst}>First</button>
            <button id="btnPrev"  class="pure-button" @click=${this.onPrev}>Prev</button>
            <button id="btnNext"  class="pure-button" @click=${this.onNext}>Next</button>
            <button id="btnLast"  class="pure-button" @click=${this.onLast}>Last</button>
            <span id="lblPageInfo">${this.current}/${this.count}</span>
            `
    }

    loadButtons() {
        this.first = this.root.querySelector("#btnFirst");
        this.prev = this.root.querySelector("#btnPrev");
        this.next = this.root.querySelector("#btnNext");
        this.last = this.root.querySelector("#btnLast");
        this.pageInfo = this.root.querySelector("#lblPageInfo");
    }
    
    check() {
        this.first.classList.toggle("pure-button-disabled", this.current == 0);
        this.prev.classList.toggle("pure-button-disabled", this.current == 0);
        this.next.classList.toggle("pure-button-disabled", this.current == this.lastPage);
        this.last.classList.toggle("pure-button-disabled", this.current == this.lastPage);
        this.pageInfo.innerText = `${this.current} - ${this.lastPage}`;
    }

    onFirst() {
        this.current = 0;
        this.check();
        this.fireEvent();
    }

    onPrev(e) {
        this.current--;
        this.check();
        this.fireEvent();
    }

    onNext(e) {
        this.current++;
        this.check();
        this.fireEvent();
    }

    onLast(e) {
        this.current = this.lastPage;
        this.check();
        this.fireEvent();
    }

    fireEvent() {
        this.dispatchEvent(new CustomEvent('paginator', {
            bubbles: true,
            composed: true,
            detail: {
                cur: this.current
            }
        }));
    }

    calcLastPage() {
        let p = Math.floor(this.getAttribute("count") / this.getAttribute("page"));
        return this.getAttribute("count") % this.getAttribute("page") !== 0 ? p : p -1 ;
    }
}
customElements.define('paginator-uv', Paginator);