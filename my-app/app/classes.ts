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

export interface ICategoryQuery {
    sortby: string;
    sortdir: string;
    search: string;
    category_id: string;
    page: number;
}

export interface ICategory {
    id: string;
    name: string;
    category_id: string;
}