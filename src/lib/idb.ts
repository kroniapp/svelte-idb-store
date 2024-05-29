import {openDB, deleteDB, type IDBPDatabase} from "idb";

abstract class IDB<T, Key extends string> {
  db!: IDBPDatabase;
  name: string;
  store: string = "data";
  index: string = "id";
  key?: Key;
  initialValue?: T;

  abstract get(): Promise<T>;
  abstract set(val: T): Promise<T>;

  private isBrowser: boolean = typeof window !== "undefined" && "indexedDB" in window;

  constructor(name: string, key?: Key, initialValue?: T, callback?: (creating: boolean) => void) {
    this.name = name;
    this.key = key;
    this.initialValue = initialValue;

    if (!this.isBrowser) return;

    this.open().then(creating => callback && callback(creating));
  }

  open = async (): Promise<boolean> => {
    let creating: boolean = false;

    this.db = await openDB(this.name, undefined, {
      upgrade: db => {
        if (!db.objectStoreNames.contains(this.store)) {
          const store = db.createObjectStore(this.store, {autoIncrement: true});

          if (this.key) {
            store.createIndex(this.index, this.key as string, {unique: true});
          }

          creating = true;
        }
      }
    });

    if (creating && this.initialValue) {
      await this.set(this.initialValue);
    }

    return creating;
  };
}

export class IDBArray<T extends Record<string, any>> extends IDB<T[], Extract<keyof T, string>> {
  get = (): Promise<T[]> => this.db.getAll(this.store);

  set = async (val: T[]): Promise<T[]> => {
    await this.db.clear(this.store);
    const tx = this.db.transaction(this.store, "readwrite");
    await Promise.all(val.map((value, i) => tx.store.put(JSON.parse(JSON.stringify(value)), i)));
    await tx.done;

    return val;
  };

  getItem = (id: string): Promise<T> => this.db.getFromIndex(this.store, this.index, id);

  setItem = async (val: T): Promise<T[]> => {
    const key = this.key && (await this.db.getKeyFromIndex(this.store, this.index, val[this.key]));
    await this.db.put(this.store, JSON.parse(JSON.stringify(val)), key);

    return this.get();
  };

  removeItem = async (id: string): Promise<T[]> => {
    const key = this.key && (await this.db.getKeyFromIndex(this.store, this.index, id));
    if (key !== undefined) {
      await this.db.delete(this.store, key);
    }

    return this.get();
  };

  clear = async (): Promise<T[]> => {
    await this.db.clear(this.store);

    return [];
  };
}

export class IDBObject<T extends Record<string, any>> extends IDB<T, Extract<keyof T, string>> {
  get = async (): Promise<T> => {
    let res: T = {} as T;
    let cursor = await this.db.transaction(this.store).store.openCursor();

    while (cursor) {
      res[cursor.key.toString() as keyof T] = cursor.value;
      cursor = await cursor.continue();
    }

    return res;
  };

  set = async (val: T): Promise<T> => {
    const tx = this.db.transaction(this.store, "readwrite");
    await Promise.all(Object.entries(val).map(([key, value]) => tx.store.put(JSON.parse(JSON.stringify(value)), key)));
    await tx.done;

    return val;
  };

  getItem = <K extends Extract<keyof T, string>>(id: K): Promise<T[K]> => this.db.get(this.store, id);

  setItem = async <K extends Extract<keyof T, string>>(id: K, val: T[K]): Promise<T> => {
    await this.db.put(this.store, JSON.parse(JSON.stringify(val)), id);

    return this.get();
  };

  removeItem = async (id: Extract<keyof T, string>): Promise<T> => {
    await this.db.delete(this.store, id);

    return this.get();
  };

  clear = async (): Promise<T> => {
    await this.db.clear(this.store);

    return {} as T;
  };
}

export const exists = async (name: string): Promise<boolean> => (await indexedDB.databases()).some(db => db.name === name);

export const remove = deleteDB;
