import {writable, type Writable} from "svelte/store";
import {exists, IDBArray, IDBObject, remove} from "./idb";
import type {IDBStoreArray, IDBStoreObject, OptionsArray, OptionsObject} from "./types";

interface IDBStoreArrayV4<T> extends Writable<T[]>, IDBStoreArray<T> {}

interface IDBStoreObjectV4<T extends Record<string, any>> extends Writable<T>, IDBStoreObject<T> {}

export const idbStoreArray = <T extends Record<string, any>>({name, key, initialValue = [], callback}: OptionsArray<T>): IDBStoreArrayV4<T> => {
  const s = writable<T[]>(initialValue);

  const idb: IDBArray<T> = new IDBArray<T>(name, key, initialValue, async creating => {
    s.set(await idb.get());

    if (creating && callback) {
      callback();
    }
  });

  return {
    ...s,
    set: async (val: T[]) => {
      s.set(await idb.set(val));
    },
    getItem: idb.getItem,
    setItem: async (val: T) => {
      s.set(await idb.setItem(val));
    },
    removeItem: async (id: string) => {
      s.set(await idb.removeItem(id));
    },
    clear: async () => {
      s.set(await idb.clear());
    }
  };
};

export const idbStoreObject = <T extends Record<string, any>>({name, initialValue, callback}: OptionsObject<T>): IDBStoreObjectV4<T> => {
  const s = writable<T>(initialValue);

  const idb: IDBObject<T> = new IDBObject<T>(name, undefined, initialValue, async creating => {
    s.set(await idb.get());

    if (creating && callback) {
      callback();
    }
  });

  return {
    ...s,
    set: async (val: T) => {
      s.set(await idb.set(val));
    },
    getItem: idb.getItem,
    setItem: async <K extends Extract<keyof T, string>>(id: K, val: T[K]) => {
      s.set(await idb.setItem(id, val));
    },
    removeItem: async <K extends Extract<keyof T, string>>(id: K) => {
      s.set(await idb.removeItem(id));
    },
    clear: async () => {
      s.set(await idb.clear());
    }
  };
};

export const existsDB = exists;

export const deleteDB = remove;
