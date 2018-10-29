import { table, col, Sqlite3DataTypes as T } from "../src/index";

test("create table", () => {
  const expected =
    "CREATE TABLE IF NOT EXISTS db.table1 (x INTEGER PRIMARY KEY ASC  NOT NULL,y INTEGER NOT NULL) WITHOUT ROWID";

  const def = table("db.table1")
    .column(
      col("x", T.INTEGER)
        .default(0)
        .primary()
        .notNull()
    )
    .column(col("y", T.INTEGER).notNull())
    .withoutRowId()
    .ifNotExists();
  expect(def.toString()).toBe(expected);
});
