import { bracket } from "./utils";

export enum Sqlite3Collate {
  BINARY = "BINARY",
  NOCASE = "NOCASE",
  RTRIM = "RTRIM"
}

export enum Sqlite3DataTypes {
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
 * Check whether an object is a `ColumnDefinition`.
 * @param obj object to check.
 */
function isColumnDefinition(
  obj: IColumnDefinition | ColumnDefinition
): obj is ColumnDefinition {
  return !!(obj as ColumnDefinition).def;
}

/**
 * Render the string expression for the column definition.
 * @param obj `ColumnDefinition` object or a JSON object describing the column.
 */
function renderColumnDefinition(obj: IColumnDefinition | ColumnDefinition) {
  return isColumnDefinition(obj)
    ? obj.toString()
    : new ColumnDefinition(obj).toString();
}

/**
 *
 * See: https://www.sqlite.org/syntax/column-constraint.html
 */
export class ColumnDefinition {
  constructor(public readonly def: IColumnDefinition) {}

  static create(name: string, type: Sqlite3DataTypes) {
    return new ColumnDefinition({ name, type });
  }

  get name() {
    return this.def.name;
  }

  primary(
    flag: boolean | "asc" | "desc" = true,
    autoincrement: boolean = false
  ) {
    this.def.primary = flag;
    this.def.autoincrement = autoincrement;
    return this;
  }

  notNull(flag = true) {
    this.def.notNull = flag;
    return this;
  }

  unique(flag = true) {
    this.def.unique = flag;
    return this;
  }

  check(expr: string) {
    this.def.check = expr;
    return this;
  }

  default(value: any) {
    this.def.defaultValue = value;
    return this;
  }

  collate(collation: Sqlite3Collate) {
    this.def.collate = collation;
    return this;
  }

  /** TODO */
  foreignKey() {
    return this;
  }

  toString() {
    const {
      name,
      type,
      defaultValue,
      collate,
      primary,
      unique,
      notNull,
      autoincrement,
      check
    } = this.def;

    return [
      name,
      type,
      !!primary &&
        `PRIMARY KEY ${primary === "desc" ? "DESC" : "ASC"} ${
          !!autoincrement ? "AUTOINCREMENT" : ""
        }`,
      !!notNull && "NOT NULL",
      !!unique && "UNIQUE",
      !!check && `CHECK ${bracket(check)}`,
      !!defaultValue && `DEFAULT ${defaultValue}`,
      !!collate && `COLLATE ${collate}`
    ]
      .filter(str => !!str)
      .join(" ");
  }
}

export class CreateTableStatement {
  constructor(public readonly def: ICreateTableDefinition) {}

  static create(tablename: string) {
    var [schema, name] = tablename.split(".");
    if (!name) {
      return new CreateTableStatement({ name: tablename, columns: [] });
    }
    return new CreateTableStatement({ name, schema, columns: [] });
  }

  temp(flag: boolean = true) {
    this.def.temp = flag;
    return this;
  }

  ifNotExists(flag: boolean = true) {
    this.def.ifNotExists = flag;
    return this;
  }

  column(columnDefinition: ColumnDefinition | IColumnDefinition) {
    this.def.columns.push(columnDefinition);
    return this;
  }

  columns(columnDefinitions: (ColumnDefinition | IColumnDefinition)[]) {
    this.def.columns = [...this.def.columns, ...columnDefinitions];
    return this;
  }

  withoutRowId(flag: boolean = true) {
    this.def.withoutRowId = flag;
    return this;
  }

  primaryKey(...columnNames: string[]) {
    this.def.primaryKey = columnNames;
    return this;
  }

  unique(...columnNames: string[]) {
    this.def.unique = columnNames;
    return this;
  }

  check(expr: string) {
    this.def.check = expr;
    return this;
  }

  toString() {
    const {
      temp,
      ifNotExists,
      schema,
      name,
      columns,
      primaryKey,
      unique,
      check,
      withoutRowId
    } = this.def;

    const renderStringArray = (value: string | string[]) =>
      Array.isArray(value) ? value.join(", ") : value;

    // render only distinct columns (always use the latest).
    const distinctCols = new Map<string, string>();
    columns.forEach(item => {
      distinctCols.set(item.name, renderColumnDefinition(item));
    });

    const tableConstraints = [
      !!primaryKey && `PRIMARY KEY (${renderStringArray(primaryKey)})`,
      !!unique && `UNIQUE (${renderStringArray(unique)})`,
      !!check && `CHECK (${bracket(check)})`
    ].filter(str => !!str);

    return [
      "CREATE",
      temp && "TEMP",
      "TABLE",
      ifNotExists && "IF NOT EXISTS",
      !!schema ? `${schema}.${name}` : name,
      `(${[...distinctCols.values(), ...tableConstraints].join(",")})`,
      withoutRowId && "WITHOUT ROWID"
    ]
      .filter(str => !!str)
      .join(" ");
  }
}

export const table = CreateTableStatement.create;
export const col = ColumnDefinition.create;
