import {openDB, type IDBPDatabase} from "idb";

export default class IDB {
  db!: IDBPDatabase;
  name: string;
  index: string;

  constructor(name: string) {
    this.name = name;
    this.index = "value";
  }

  isBrowser() {
    return typeof window !== "undefined" && "indexedDB" in window;
  }

  async initialize() {
    if (this.isBrowser()) {
      try {
        this.db = await openDB("data", undefined, {
          upgrade: db => !db.objectStoreNames.contains(this.name) && db.createObjectStore(this.name)
        });

        return await this.get();
      } catch (err) {
        console.log(err);
      }
    }
  }

  async get() {
    if (!this.isBrowser()) return;
    return await this.db.get(this.name, this.index);
  }

  async set(val: any) {
    if (!this.isBrowser()) return;
    return await this.db.put(this.name, JSON.parse(JSON.stringify(val)), this.index);
  }

  async remove() {
    if (!this.isBrowser()) return;
    return await this.db.delete(this.name, this.index);
  }
}
