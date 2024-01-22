import {IDBArray, IDBObject, remove} from "./idb";

interface IDBStoreArrayV5<T> extends IDBStoreArray<T> {
  value: T[];
}

interface IDBStoreObjectV5<T extends Record<string, any>> extends IDBStoreObject<T> {
  value: Partial<T>;
}

export const idbStoreArrayV5 = <T extends Record<string, any>>({name, key, initialValue = [], callback}: OptionsArray<T>): IDBStoreArrayV5<T> => {
  let s: T[] = $state(initialValue);

  let idb: IDBArray<T> = new IDBArray<T>(name, key, initialValue, async creating => {
    s = await idb.get();
    callback && callback(creating);
  });

  return {
    get value(): T[] {
      return s;
    },
    set value(val: T[]) {
      idb.set(val).then(res => (s = res));
    },
    getItem: idb.getItem,
    setItem: async (val: T) => {
      s = await idb.setItem(val);
    },
    removeItem: async (id: string) => {
      s = await idb.removeItem(id);
    },
    clear: async () => {
      s = await idb.clear();
    }
  };
};

export const idbStoreObjectV5 = <T extends Record<string, any>>({name, initialValue, callback}: OptionsObject<T>): IDBStoreObjectV5<T> => {
  let idb: IDBObject<T> = new IDBObject<T>(name, undefined, initialValue, async creating => {
    s = await idb.get();
    callback && callback(creating);
  });

  let s: Partial<T> | undefined = $state(initialValue);

  return {
    get value(): Partial<T> {
      return s || {};
    },
    set value(val: T) {
      idb.set(val).then(res => (s = res));
    },
    getItem: idb.getItem,
    setItem: async <K extends Extract<keyof T, string>>(id: K, val: T[K]) => {
      s = await idb.setItem(id, val);
    },
    removeItem: async <K extends Extract<keyof T, string>>(id: K) => {
      s = await idb.removeItem(id);
    },
    clear: async () => {
      s = await idb.clear();
    }
  };
};

export const deleteDB = remove;
