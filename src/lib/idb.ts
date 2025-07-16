import {openDB, type IDBPDatabase} from "idb";

const storeName = "data";

export default abstract class<T, Key extends string> {
  db!: IDBPDatabase;

  name?: string;
  key?: Key;
  version?: number;
  initialValue?: T;
  callback?: (creating: boolean) => void;

  abstract get(): Promise<T>;
  abstract set(val: T): Promise<T>;

  private isBrowser: boolean = typeof window !== "undefined" && "indexedDB" in window;

  constructor(name: string, key?: Key, version?: number, initialValue?: T, callback?: (creating: boolean) => void) {
    if (!this.isBrowser) return;

    this.name = name;
    this.key = key;
    this.version = version;
    this.initialValue = initialValue;
    this.callback = callback;

    this.Initialize();
  }

  store = async () => {
    if (!this.db) await this.Initialize();

    return this.db.transaction(storeName, "readwrite").objectStore(storeName);
  };

  index = async () => (await this.store()).index(this.key || "");

  private Initialize = async (): Promise<boolean> => {
    let creating: boolean = false;

    this.db = await openDB(this.name!, this.version, {
      upgrade: async (db, _, __, transaction) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {autoIncrement: true});
          creating = true;
        }

        if (this.key) {
          Array.from(transaction.objectStore(storeName).indexNames).forEach(index => transaction.objectStore(storeName).deleteIndex(index));
          transaction.objectStore(storeName).createIndex(this.key, this.key, {unique: true});
        }
      }
    });

    if (creating && this.initialValue) {
      await this.set(this.initialValue);
    }

    this.callback?.(creating);

    return creating;
  };
}
