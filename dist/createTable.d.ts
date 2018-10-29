export declare enum Sqlite3Collate {
    BINARY = "BINARY",
    NOCASE = "NOCASE",
    RTRIM = "RTRIM"
}
export declare enum Sqlite3DataTypes {
    NULL = "NULL",
    INTEGER = "INTEGER",
    REAL = "REAL",
    TEXT = "TEXT",
    BLOB = "BLOB"
}
/**
 * Inputs to define a `Column` in a `CREATE TABLE` statement.
 */
export interface IColumnDefinition {
    name: string;
    type: Sqlite3DataTypes;
    defaultValue?: any;
    collate?: Sqlite3Collate;
    primary?: boolean | "asc" | "desc";
    unique?: boolean;
    notNull?: boolean;
    autoincrement?: boolean;
    check?: string;
}
/**
 * Inputs for a `CREATE TABLE` statement.
 */
export interface ICreateTableDefinition {
    name: string;
    schema?: string;
    columns: (IColumnDefinition | ColumnDefinition)[];
    primaryKey?: string | string[];
    unique?: string | string[];
    check?: string;
    withoutRowId?: boolean;
    ifNotExists?: boolean;
    temp?: boolean;
}
/**
 *
 * See: https://www.sqlite.org/syntax/column-constraint.html
 */
export declare class ColumnDefinition {
    readonly def: IColumnDefinition;
    constructor(def: IColumnDefinition);
    static create(name: string, type: Sqlite3DataTypes): ColumnDefinition;
    readonly name: string;
    primary(flag?: boolean | "asc" | "desc", autoincrement?: boolean): this;
    notNull(flag?: boolean): this;
    unique(flag?: boolean): this;
    check(expr: string): this;
    default(value: any): this;
    collate(collation: Sqlite3Collate): this;
    /** TODO */
    foreignKey(): this;
    toString(): string;
}
export declare class CreateTableStatement {
    readonly def: ICreateTableDefinition;
    constructor(def: ICreateTableDefinition);
    static create(tablename: string): CreateTableStatement;
    temp(flag?: boolean): this;
    ifNotExists(flag?: boolean): this;
    column(columnDefinition: ColumnDefinition | IColumnDefinition): this;
    columns(columnDefinitions: (ColumnDefinition | IColumnDefinition)[]): this;
    withoutRowId(flag?: boolean): this;
    primaryKey(...columnNames: string[]): this;
    unique(...columnNames: string[]): this;
    check(expr: string): this;
    toString(): string;
}
