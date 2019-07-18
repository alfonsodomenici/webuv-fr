export default class ApBreadcrumb extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        document.addEventListener('ap-navigation', e => this.onNavigation(e));
    }

    onNavigation(e){
        const {link} = e.detail;
        this.innerText = `> ${link}`;
    }
}
customElements.define('ap-breadcrumb', ApBreadcrumb);