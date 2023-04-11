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
    value: string|number|boolean;
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
    category_id: string;
}

export interface ICategoryQuery extends IQuery {
    category_id: string;
}

export interface ICategory extends IEntity {
    name: string;
    category_id: string;
}