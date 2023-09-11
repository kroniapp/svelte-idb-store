import {openDB, type IDBPDatabase} from "idb";

abstract class IDB<T, Key> {
  db!: IDBPDatabase;
  name: string;
  store: string = "data";
  index: string = "id";
  key?: Key;
  initialValue?: T;

  abstract getAll(): Promise<T>;
  abstract setAll(val: T): Promise<T>;

  private isBrowser: boolean = typeof window !== "undefined" && "indexedDB" in window;

  constructor(name: string, key?: Key, initialValue?: T, callback?: (val: T) => void) {
    if (!this.isBrowser) throw new Error("not_browser");

    this.name = name;
    this.key = key;
    this.initialValue = initialValue;

    this.open().then(val => callback && callback(val));
  }

  open = async (): Promise<T> => {
    let firstVersion: boolean = false;

    this.db = await openDB(this.name, undefined, {
      upgrade: db => {
        if (!db.objectStoreNames.contains(this.store)) {
          const store = db.createObjectStore(this.store);

          if (this.key) {
            store.createIndex(this.index, this.key as string, {unique: true});
          }

          firstVersion = true;
        }
      }
    });

    if (this.initialValue && firstVersion) {
      return await this.setAll(this.initialValue);
    }

    return await this.getAll();
  };
}

export class IDBArray<T extends Record<string, any> = Record<string, any>> extends IDB<T[], Extract<keyof T, string>> {
  get = (id: string): Promise<T> => this.db.getFromIndex(this.store, this.index, id);

  getAll = (): Promise<T[]> => this.db.getAll(this.store);

  remove = (id: string): Promise<void> => this.db.delete(this.store, id);

  removeAll = (): Promise<void> => this.db.clear(this.store);

  set = async (val: T): Promise<void> => {
    const key = this.key && (await this.db.getKeyFromIndex(this.store, this.index, val[this.key]));
    await this.db.put(this.store, val, key);
  };

  setAll = async (val: T[]): Promise<T[]> => {
    await this.removeAll();
    const tx = this.db.transaction(this.store, "readwrite");
    await Promise.all(val.map((val, i) => tx.store.put(val, i)));
    await tx.done;

    return val;
  };
}

export class IDBObject<T extends Record<string, any> = Record<string, any>> extends IDB<T, Extract<keyof T, string>> {
  get = <K extends Extract<keyof T, string>>(id: K): Promise<T[K]> => this.db.get(this.store, id);

  getAll = async (): Promise<T> => {
    let res: T = {} as T;
    let cursor = await this.db.transaction(this.store).store.openCursor();

    while (cursor) {
      res[cursor.key.toString() as keyof T] = cursor.value;
      cursor = await cursor.continue();
    }

    return res;
  };

  remove = (id: Extract<keyof T, string>): Promise<void> => this.db.delete(this.store, id);

  removeAll = (): Promise<void> => this.db.clear(this.store);

  set = async <K extends Extract<keyof T, string>>(id: K, val: T[K]): Promise<void> => {
    await this.db.put(this.store, val, id);
  };

  setAll = async (val: T): Promise<T> => {
    const tx = this.db.transaction(this.store, "readwrite");
    await Promise.all(Object.entries(val).map(([key, value]) => tx.store.put(value, key)));
    await tx.done;

    return val;
  };
}
