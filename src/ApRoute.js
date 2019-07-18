export default class ApRoute extends HTMLElement {

    constructor() {
        super();
        this.oldChild = null;
        this.root = this.attachShadow({mode: 'open'});
        this.root.innerHTML=`
            <style> 
            :host{
                all: initial;
            }
            </style>
        `
    }

    connectedCallback() {
        document.addEventListener('ap-navigation', e => this.onNavigation(e));
    }

    onNavigation(e) {
        const { detail } = e;
        const link = detail.link;
        this.loadView(link);
    }

    async loadView(link){
        const {default: View} = await import(`./views/${link}.js`)
        let newChild = new View();
        if (this.oldChild) {
            this.root.replaceChild(newChild, this.oldChild);
        } else {
            this.root.appendChild(newChild);
        }
        this.oldChild = newChild;
    }
}
customElements.define('ap-route', ApRoute);