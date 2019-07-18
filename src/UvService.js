import { keycloak } from "./app.js";

export default class UvService {

    constructor() {
        this.url = 'http://localhost:8080/web_uv/resources';
    }

    async postazioni() {
        return await fetch(`${this.url}/postazioni`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(response => response.json());
    }

    async countAll({ idPostazione, dal, al, flag10 }) {
        var misure12 = flag10 == true ? "misure" : "misure12"
        return await fetch(`${this.url}/postazioni/${idPostazione}/${misure12}-count?dal=${dal}&al=${al}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(response => response.text());
    }

    async searchAll({ idPostazione, dal, al, flag10 }) {
        var misure12 = flag10 == true ? "misure" : "misure12"

        return await fetch(`${this.url}/postazioni/${idPostazione}/${misure12}?dal=${dal}&al=${al}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(response => response.json());
    }

    async search({ idPostazione, dal, al, flag10, start, pageSize }) {
        var misure12 = flag10 == true ? "misure" : "misure12"
        const resp = await fetch(`${this.url}/postazioni/${idPostazione}/${misure12}?dal=${dal}&al=${al}&start=${start}&page=${pageSize}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const searchPromise = await resp.json();
        return searchPromise;
    }

    save(todo) {
        console.log(todo);
        fetch(this.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(todo)
        })
            .then(response => response.json())
            .then(json => console.log(JSON.stringify(json)))
            .catch(error => console.log(error));
    }

    async save1(todo) {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + keycloak.token
            },
            body: JSON.stringify(todo)
        }).catch(error => console.log(error));
        const content = await response.json();
        console.log(content);
    }

    onExportCsv(criteria) {
        this.searchAll(criteria)
            .then(data => {
                const fields = [Object.keys(data[0]).join(';')]
                let csv = data
                    .map(p => this.createCSVElement(p, ";"))
                csv = fields.concat(csv);
                this.downloadCSV(csv.join('\r\n'), "posts.csv")
            })
    }

    createCSVElement(json, sep) {
        return `${Reflect.ownKeys(json).map(key => {
            if (key != "data_solare") {
                return `${Reflect.get(json, key)} ${sep}`
            } else {
                return `${Reflect.get(json, key).dayOfMonth}/${Reflect.get(json, key).monthValue}/${Reflect.get(json, key).year} ${Reflect.get(json, key).hour}:${Reflect.get(json, key).minute} ${sep}`
            }
        }).join('')}`;
    }

    downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;

        if (window.Blob == undefined || window.URL == undefined || window.URL.createObjectURL == undefined) {
            alert("Your browser doesn't support Blobs");
            return;
        }

        csvFile = new Blob([csv], { type: "text/csv" });
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
}