import { IItem } from "./app/classes";

export class Util {
    static server = 'http://localhost:8001';

    static itemsDbTable = [
        {id: '1', name: 'Item 1', category_id: null} as IItem,
        {id: '2', name: 'Item 2', category_id: null} as IItem,
        {id: '3', name: 'Item 3', category_id: null} as IItem
    ];
    
    static get = async (path) => {

        console.log(`sending get: ${this.server}${path}`)
        const res = await fetch(`${this.server}${path}`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Failed to get data: ${this.server}${path}`);
        }

        const json = await res.json();

        console.log('get result:' + json)

        return json;
    }

    static post = async (path, data) => {

        const res = await fetch(`${this.server}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error('Failed to post data');
        }

        const json = await res.json();

        console.log('post result:' + json)

        return json;
    }

    static put = async (path, data) => {

        const res = await fetch(`${this.server}${path}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error('Failed to put data');
        }

        const json = await res.json();

        console.log('put result:' + json)

        return json;
    }

    static delete = async (path) => {

        const res = await fetch(`${this.server}${path}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error('Failed to put data');
        }

        const json = await res.json();

        console.log('delete result:' + json)

        return json;
    }
}
