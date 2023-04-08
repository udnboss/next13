export interface IItemQuery {
    sortby: string;
    sortdir: string;
    search: string;
    category_id: string;
    page: number;
}

export interface IItem {
    id: string;
    name: string;
    category_id: string;
}