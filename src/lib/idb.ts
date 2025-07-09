import {openDB, type IDBPDatabase} from "idb";

const storeName = "data";
const indexName = "id";

export default abstract class<T, Key extends string> {
  db!: IDBPDatabase;

  name?: string;
  key?: Key;
  initialValue?: T;
  callback?: (creating: boolean) => void;

  abstract get(): Promise<T>;
  abstract set(val: T): Promise<T>;

  private isBrowser: boolean = typeof window !== "undefined" && "indexedDB" in window;

  constructor(name: string, key?: Key, initialValue?: T, callback?: (creating: boolean) => void) {
    if (!this.isBrowser) return;

    this.name = name;
    this.key = key;
    this.initialValue = initialValue;
    this.callback = callback;

    this.Initialize();
  }

  Initialize = async () => {
    const creating = await this.open(this.name!, this.initialValue);
    this.callback?.(creating);
  };

  store = async () => {
    if (!this.db) await this.Initialize();

    return this.db.transaction(storeName, "readwrite").objectStore(storeName);
  };

  index = async () => (await this.store()).index(indexName);

  private open = async (name: string, initialValue?: T): Promise<boolean> => {
    let creating: boolean = false;

    this.db = await openDB(name, undefined, {
      upgrade: db => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {autoIncrement: true});

          if (this.key) {
            store.createIndex(indexName, this.key as string, {unique: true});
          }

          creating = true;
        }
      }
    });

    if (creating && initialValue) {
      await this.set(initialValue);
    }

    return creating;
  };
}
