import { keycloak } from "./app.js";

export default class PostService {

    constructor() {
        this.url = 'https://jsonplaceholder.typicode.com/posts';
    }

    async all() {
        const resp = await fetch(this.url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const todosPromise = await resp.json();
        return todosPromise;
    }

    async find(id) {
        const resp = await fetch(this.url + `/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const todosPromise = await resp.json();
        return todosPromise;
    }

}