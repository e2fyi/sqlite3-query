"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
var Sqlite3Collate;
(function (Sqlite3Collate) {
    Sqlite3Collate["BINARY"] = "BINARY";
    Sqlite3Collate["NOCASE"] = "NOCASE";
    Sqlite3Collate["RTRIM"] = "RTRIM";
})(Sqlite3Collate = exports.Sqlite3Collate || (exports.Sqlite3Collate = {}));
var Sqlite3DataTypes;
(function (Sqlite3DataTypes) {
    Sqlite3DataTypes["NULL"] = "NULL";
    Sqlite3DataTypes["INTEGER"] = "INTEGER";
    Sqlite3DataTypes["REAL"] = "REAL";
    Sqlite3DataTypes["TEXT"] = "TEXT";
    Sqlite3DataTypes["BLOB"] = "BLOB";
})(Sqlite3DataTypes = exports.Sqlite3DataTypes || (exports.Sqlite3DataTypes = {}));
/**
 * Check whether an object is a `ColumnDefinition`.
 * @param obj object to check.
 */
function isColumnDefinition(obj) {
    return !!obj.def;
}
/**
 * Render the string expression for the column definition.
 * @param obj `ColumnDefinition` object or a JSON object describing the column.
 */
function renderColumnDefinition(obj) {
    return isColumnDefinition(obj)
        ? obj.toString()
        : new ColumnDefinition(obj).toString();
}
/**
 *
 * See: https://www.sqlite.org/syntax/column-constraint.html
 */
class ColumnDefinition {
    constructor(def) {
        this.def = def;
    }
    static create(name, type) {
        return new ColumnDefinition({ name, type });
    }
    get name() {
        return this.def.name;
    }
    primary(flag = true, autoincrement = false) {
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
    check(expr) {
        this.def.check = expr;
        return this;
    }
    default(value) {
        this.def.defaultValue = value;
        return this;
    }
    collate(collation) {
        this.def.collate = collation;
        return this;
    }
    /** TODO */
    foreignKey() {
        return this;
    }
    toString() {
        const { name, type, defaultValue, collate, primary, unique, notNull, autoincrement, check } = this.def;
        return [
            name,
            type,
            !!primary &&
                `PRIMARY KEY ${primary === "desc" ? "DESC" : "ASC"} ${!!autoincrement ? "AUTOINCREMENT" : ""}`,
            !!notNull && "NOT NULL",
            !!unique && "UNIQUE",
            !!check && `CHECK ${utils_1.bracket(check)}`,
            !!defaultValue && `DEFAULT ${defaultValue}`,
            !!collate && `COLLATE ${collate}`
        ]
            .filter(str => !!str)
            .join(" ");
    }
}
exports.ColumnDefinition = ColumnDefinition;
class CreateTableStatement {
    constructor(def) {
        this.def = def;
    }
    static create(tablename) {
        var [schema, name] = tablename.split(".");
        if (!name) {
            return new CreateTableStatement({ name: tablename, columns: [] });
        }
        return new CreateTableStatement({ name, schema, columns: [] });
    }
    temp(flag = true) {
        this.def.temp = flag;
        return this;
    }
    ifNotExists(flag = true) {
        this.def.ifNotExists = flag;
        return this;
    }
    column(columnDefinition) {
        this.def.columns.push(columnDefinition);
        return this;
    }
    columns(columnDefinitions) {
        this.def.columns = [...this.def.columns, ...columnDefinitions];
        return this;
    }
    withoutRowId(flag = true) {
        this.def.withoutRowId = flag;
        return this;
    }
    primaryKey(...columnNames) {
        this.def.primaryKey = columnNames;
        return this;
    }
    unique(...columnNames) {
        this.def.unique = columnNames;
        return this;
    }
    check(expr) {
        this.def.check = expr;
        return this;
    }
    toString() {
        const { temp, ifNotExists, schema, name, columns, primaryKey, unique, check, withoutRowId } = this.def;
        const renderStringArray = (value) => Array.isArray(value) ? value.join(", ") : value;
        // render only distinct columns (always use the latest).
        const distinctCols = new Map();
        columns.forEach(item => {
            distinctCols.set(item.name, renderColumnDefinition(item));
        });
        const tableConstraints = [
            !!primaryKey && `PRIMARY KEY (${renderStringArray(primaryKey)})`,
            !!unique && `UNIQUE (${renderStringArray(unique)})`,
            !!check && `CHECK (${utils_1.bracket(check)})`
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
exports.CreateTableStatement = CreateTableStatement;
//# sourceMappingURL=createTable.js.map