export default class IDB {
  db!: IDBDatabase;
  name: string;

  constructor(name: string, key: string, callback: (val: any[]) => void) {
    this.name = name;

    const conn = window.indexedDB.open("data", 1);

    conn.onsuccess = () => {
      this.db = conn.result;

      this.get(callback);
    };

    conn.onupgradeneeded = event => {
      this.db = conn.result;

      this.db.createObjectStore(this.name, {keyPath: key});

      if(conn.transaction) conn.transaction.oncomplete = () => this.get(callback);
    };
  }

  private createTransaction() {
    const transaction = this.db.transaction(this.name, "readwrite");

    return transaction.objectStore(this.name);
  }

  get(callback: (val: any[]) => void) {
    const data = this.createTransaction();
    const val = data.getAll();
    val.onsuccess = () => callback(val.result);
  }

  set(val: any) {
    const data = this.createTransaction();
    return data.put(val);
  }

  remove(id: any) {
    const data = this.createTransaction();
    return data.delete(id);
  }
}
