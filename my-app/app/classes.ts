export enum Operator {
    Equals,
    NotEquals,
    GreaterThan,
    LessThan,    
    IsNull,
    IsNotNull,
    IsIn,
    IsNotIn,
    StartsWith,
    EndsWith,
    Contains
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export interface ISort {
    column: string;
    direction: SortDirection;
}

export interface ICondition {
    column: string;
    operator: Operator;
    value: string|number|boolean|string[]|number[];
}

export interface IQuery {
    sortby: string;
    sortdir: string;
    search: string;
    page: number;
    pageSize: number;
}

export interface IQueryResult<Q,T> {
    query: Q;
    count: number;
    total: number;
    result: T[]    
}

export interface IItemQuery extends IQuery {
    category_id: string;
}

export interface IEntity {
    id: string;
}

export interface IItem extends IEntity {
    name: string;
    category_id: string | null;
    category?:ICategory | null;
}

export interface ICategoryQuery extends IQuery {
    category_id: string;
}

export interface ICategory extends IEntity {
    name: string;
    category_id: string | null;
    items?: IItem[];
}

export interface ICustomerQuery extends IQuery {

}

export interface ICustomer extends IEntity {
    name: string;
    address: string;
    contact: string;
    currency: string;
    sales?: ISale[];
}

export interface ISaleQuery extends IQuery {
    customer_id: string;
    number: number;
    date_from: string;
    date_to: string;
    reference: string; 
}

export interface ISale extends IEntity {    
    company_id: string | null;
    account_id: string | null;
    customer_id: string | null;
    place: string;
    number: number;
    date: string;
    reference: string | null;    
    confirmed: boolean;
    customer?: ICustomer | null;
    account?: IAccount | null;
    company?: ICompany | null;
    total: number;
    items?: ISaleItem[];
}

export interface ISaleItemQuery extends IQuery {
    sale_id: string;
}

export interface ISaleItem extends IEntity {
    sale_id: string | null;
    item_id: string | null;
    description: string;
    quantity: number;
    price: number;    
    sale?: ISale | null;
    item?: IItem | null;
}

export interface ICompany extends IEntity {
    name: string;
    address: string;
    crn: string;
    trn: string;
    contact: string;
    mobile: string;
    email: string;

}

export interface IAccount extends IEntity {
    label: string;
    bank_name: string;
    bank_address: string;
    bank_swift: string;
    account_name: string;
    account_iban: string;
    account_address: string;
}