import PostService from "./../PostService.js";
import { html, render } from "./../../node_modules/lit-html/lit-html.js"

export default class ListPost extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.service = new PostService();
    }

    connectedCallback() {
        this.loadPosts();
    }

    loadPosts() {
        this.service.all()
            .then(data => {
                this.data = data;
                render(this.createView(), this.root)
            });
    }

    createView() {
        return html`
            <style> 
                @import url(./../pure.css);
                :host{
                    all: initial;
                    display:block;
                }
                ul{
                    list-style: none;
                }
                div{
                    margin: .2em;
                    padding: .5em;
                    border: 1px solid black;
                }
                div:hover{
                    background: lightgreen;
                }
            </style>
            <h1>Elenco Post</h1>
            <button @click=${e => this.onExportPdf()}
                        class='pure-button pure-button-primary'>Export</button>
            <a href="#" id="exportLink" target="_blank" >...</a>
            <ul>
                ${this.data.map(post => this.createPostView(post))}
            </ul>
        `;
    }

    /*
    onExportPdf() {
        const doc = new jsPDF()
        doc.text('Hello world!', 10, 10)
        doc.save('a4.pdf')
    }
    */

    onExportPdf() {
        var dd = {
            content: [
                'First paragraph',
                'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
            ]
            
        }
        pdfMake.createPdf(dd).download();

    }
    onExportXml(hrefId) {
        const el = this.root.querySelector(`#${hrefId}`);
        const doc = document.implementation.createDocument("", "", null);
        const posts = doc.createElement("posts");
        this.data.map(p => this.createXMLElement(p, doc, "post"))
            .filter(p => p.id < 20)
            .forEach(p => posts.appendChild(p));
        doc.appendChild(posts);

        const oSerializer = new XMLSerializer();
        const sXML = oSerializer.serializeToString(doc);
        el.href = `data:text/plain;charset=utf-8, ${sXML}`;
        el.innerHTML = `download ready...`
        el.download = `posts.xml`;
    }

    createXMLElement(json, doc, elName) {
        var el = doc.createElement(elName);
        Reflect.ownKeys(json).forEach(key => {
            el.setAttribute(key, Reflect.get(json, key));
        })
        return el;
    }

    onExportCsv(hrefId) {
        const el = this.root.querySelector(`#${hrefId}`);
        const csv = this.data
            .filter(p => p.id < 20)
            .map(p => this.createCSVElement(p, ";"))
            .join('\r\n');
        console.log(csv);
        el.href = `data:text/plain;charset=utf-8, ${csv}`;
        el.innerHTML = `download ready...`
        el.download = `posts.csv`;
    }
    
    createCSVElement(json, sep) {
        return `${Reflect.ownKeys(json).map(key => `${Reflect.get(json, key)} ${sep}`).join('')}`;
    }

    createPostView(post) {
        return html`
            <li>
                <div>
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <button 
                        @click=${e => this.onEditPost(e, post.id)}
                        class='pure-button pure-button-primary'>Edit</button>
                </div>
            </li>
        `;
    }

    onEditPost(e, id) {
        e.preventDefault();
        this.service.find(id)
            .then(post => render(this.createPostEditView(post), this.root));
    }

    createPostEditView(post) {
        return html`
            <style> 
                @import url(./../pure.css);
                :host{
                    all: initial;
                    display:block;
                }
            </style>
            <form @submit=${e => this.onSave(e)} class='pure-form pure-form-stacked'>
                <legend>Modifica Post</legend>
                <label>Titolo    
                    <textArea name="titolo" rows=3 cols=80 placeholder="titolo">${post.title}</textArea>
                </label>
                <label>Testo
                    <textArea name="body" rows=10 cols=80  >${post.body}</textArea>
                </label>
                <input type="submit" class='pure-button pure-button-primary' value="Save" />
                <button @click=${e => this.onAnnulla(e)} class='pure-button pure-button-primary'>Annulla</button>
            </form>
        `;
    }

    onSave(e) {
        e.preventDefault();
        console.log(`modifico i dati del post e ritorno all'elenco`);
        const { titolo, body } = e.target.elements;
        console.dir(titolo.value);
        this.loadPosts();
    }

    onAnnulla(e) {
        e.preventDefault();
        console.log(`edit annullato, ritorno all'elenco`);
        this.loadPosts();
    }
}

customElements.define('list-post', ListPost);

