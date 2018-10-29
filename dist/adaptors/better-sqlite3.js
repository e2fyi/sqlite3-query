"use strict";
// import Database from "better-sqlite3";
// export interface ISqliteData {
//   filename: string;
//   opts?: ISqliteOptions;
// }
// export interface ISqliteOptions {
//   memory?: boolean;
//   readonly?: boolean;
//   fileMustExist?: boolean;
//   timeout?: number;
// }
// export interface ISqliteEnv {
//   SQLITE_FILE: string;
//   SQLITE_FILEMUSTEXIST?: string;
//   SQLITE_READONLY: string;
//   SQLITE_MEMORY?: string;
//   SQLITE_TIMEOUT?: string;
// }
// export class SqliteData {
//   protected db!: Database;
//   constructor(readonly filename: string, protected opts: ISqliteOptions) {
//     this.db = new Database(filename, opts);
//   }
//   close() {
//     this.db.close();
//   }
//   /** Create class from environment variable. */
//   static createFromEnv(env: ISqliteEnv = process.env as any) {
//     const {
//       SQLITE_FILE,
//       SQLITE_FILEMUSTEXIST,
//       SQLITE_READONLY,
//       SQLITE_MEMORY,
//       SQLITE_TIMEOUT
//     } = env;
//     return new SqliteData(SQLITE_FILE, {
//       memory: !!SQLITE_MEMORY,
//       readonly: !!SQLITE_READONLY,
//       fileMustExist: !!SQLITE_FILEMUSTEXIST,
//       timeout: SQLITE_TIMEOUT ? parseInt(SQLITE_TIMEOUT, 10) : undefined
//     });
//   }
// }
//# sourceMappingURL=better-sqlite3.js.map