import {IDBArray, IDBObject, exists, remove} from "./idb";
import type {IDBStoreArray, IDBStoreObject, OptionsArray, OptionsObject} from "./types";

interface IDBStoreArrayV5<T> extends IDBStoreArray<T> {
  value: T[];
}

interface IDBStoreObjectV5<T extends Record<string, any>> extends IDBStoreObject<T> {
  value: T;
}

export const idbStoreArrayV5 = <T extends Record<string, any>>({name, key, initialValue = [], onLoad, onCreate}: OptionsArray<T>): IDBStoreArrayV5<T> => {
  let s: T[] = $state(initialValue);

  let idb: IDBArray<T> = new IDBArray<T>(name, key, initialValue, async creating => {
    s = await idb.get();

    if (creating && onCreate) {
      onCreate();
    }

    onLoad && onLoad();
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

export const idbStoreObjectV5 = <T extends Record<string, any>>({name, initialValue, onLoad, onCreate}: OptionsObject<T>): IDBStoreObjectV5<T> => {
  let idb: IDBObject<T> = new IDBObject<T>(name, undefined, initialValue, async creating => {
    s = await idb.get();

    if (creating && onCreate) {
      onCreate();
    }

    onLoad && onLoad();
  });

  let s: T | undefined = $state(initialValue);

  return {
    get value(): T {
      return s || ({} as T);
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

export const existsDB = exists;

export const deleteDB = remove;
