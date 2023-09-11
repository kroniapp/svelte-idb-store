import {writable, type Writable} from "svelte/store";
import {IDBArray, IDBObject} from "./idb";

interface IDBStore<T> extends Writable<T> {
  clear: () => Promise<void>;
}

export interface IDBStoreArray<T = any> extends IDBStore<T[]> {
  getOne: (id: string) => Promise<T>;
  setOne: (val: T) => Promise<void>;
}

export interface IDBStoreObject<T extends Record<string, any> = Record<string, any>> extends IDBStore<T> {
  getOne: <K extends Extract<keyof T, string>>(id: K) => Promise<T[K]>;
  setOne: <K extends Extract<keyof T, string>>(id: K, val: T[K]) => void;
}

export const idbStoreArray = <T extends Record<string, any> = Record<string, any>>({
  name,
  key,
  initialValue = []
}: {
  name: string;
  key: Extract<keyof T, string>;
  initialValue?: T[];
}): IDBStoreArray<T> => {
  const s = writable<T[]>(initialValue);
  let idb: IDBArray<T>;
  try {
    idb = new IDBArray<T>(name, key, initialValue, val => s.set(val));
  } catch {}

  const getOne = (id: string): Promise<T> => idb.get(id);

  const set = async (val: T[]): Promise<void> => {
    await idb.setAll(val);
    s.set(await idb.getAll());
  };

  const setOne = async (val: T): Promise<void> => {
    await idb.set(val);
    s.set(await idb.getAll());
  };

  const clear = async (): Promise<void> => {
    await idb.removeAll();
    s.set([]);
  };

  return {
    ...s,
    getOne,
    set,
    setOne,
    clear
  };
};

export const idbStoreObject = <T extends Record<string, any> = Record<string, any>>({
  name,
  initialValue
}: {
  name: string;
  initialValue?: T;
}): IDBStoreObject<T> => {
  const s = writable<T>(initialValue);
  let idb: IDBObject<T>;
  try {
    idb = new IDBObject<T>(name, undefined, initialValue, val => s.set(val));
  } catch {}

  const getOne = <K extends Extract<keyof T, string>>(id: K): Promise<T[K]> => idb.get(id);

  const set = async (val: T): Promise<void> => {
    await idb.setAll(val);
    s.set(await idb.getAll());
  };

  const setOne = async <K extends Extract<keyof T, string>>(id: K, val: T[K]): Promise<void> => {
    await idb.set(id, val);
    s.set(await idb.getAll());
  };

  const clear = async (): Promise<void> => {
    await idb.removeAll();
    s.set({} as T);
  };

  return {
    ...s,
    getOne,
    set,
    setOne,
    clear
  };
};
