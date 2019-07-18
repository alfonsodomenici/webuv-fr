import UvService from "../UvService.js";
import { html, render } from "./../../node_modules/lit-html/lit-html.js";
import SearchUv from "../views/SearchUv.js";
import Paginator from "./Paginator.js";
import DateFunction from "./../DateFunction.js"

export default class ListUv extends HTMLElement {

    constructor() {
        super();
        this.service = new UvService();
        this.root = this.attachShadow({ mode: 'open' });
        this.pageSize = 10;
    }

    connectedCallback() {
        render(this.createSearch(), this.root);
    }

    createSearch() {
        return html`
       <style>
           @import url("./../pure.css");
           tbody > tr:hover{
               cursor: pointer;
               background: var(--hover-backgound-color,lightblue); 
           }
       </style>
       <search-uv @search=${e => this.onSearch(e)}></search-uv>
       <div id="container"></div>`;
    }

    createView(data) {
        return html`
       <h1>Elenco UV</h1>
       <button 
            @click=${e => this.service.onExportCsv(this.criteria)}
            class='pure-button pure-button-primary'>Export dati
        </button>

        <table  class="pure-table pure-table-bordered">
            <thead>
                <th>data solare</th>
                <th>uvi previsto</th>
                <th>uvi misurato</th>
                <th>o3 previsto</th>
                <th>sza</th>
            </thead>
            <tbody>
                ${data.map(row => this.createRow(row))}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <paginator-uv count="${this.count}" 
                            page="${this.pageSize}"
                            @paginator=${e => this.onPageChange(e)}>
                        </paginator-uv>
                    </td>
                </tr>
            </tfoot>
        </table>
        `;
    }

    createRow({ data_solare, uvi_previsto, uvi_misurato, ozono_previsto, sza }) {
        return html`
            <tr>
                <td>${data_solare.dayOfMonth}/${data_solare.monthValue}/${data_solare.year} ${data_solare.hour}:${DateFunction.numbers(data_solare.minute)}</td>
                <td>${uvi_previsto.toFixed(2)}</td>
                <td>${uvi_misurato.toFixed(2)}</td>
                <td>${ozono_previsto.toFixed(2)}</td>
                <td>${sza.toFixed(2)}</td>
            </tr>
       `;
    }

    onSearch(e) {
        console.log("onSearch()..");
        this.detail = e.detail
        this.criteria = e.detail;
        this.criteria.start = 0;
        this.criteria.pageSize = this.pageSize;
        this.loadData();
    }

    onPageChange(e) {
        let currentPage = e.detail.cur;
        this.criteria.start = this.criteria.pageSize * currentPage;
        this.loadData();
    }

    loadData(){
        Promise.all(
            [this.service.countAll(this.criteria),
            this.service.search(this.criteria)]
            ).then(values => {
                console.log(values);
                this.count = values[0];
                render(this.createView(values[1]), this.root.getElementById('container'));
            })
        }
}
customElements.define('list-uv', ListUv);