import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import IDB from "./idb";

interface IDBStore<T> extends Writable<T> {
  clear: () => void;
}

export default <T>(name: string, initialValue?: any): IDBStore<T> => {
  const store = writable(initialValue);
  let idb: IDB;

  idb = new IDB(name);

  idb.initialize().then(val => store.set(val));

  const set = async (val: any) => {
    await idb.set(val);
    store.set(val);
  };

  const clear = async () => {
    await idb.remove();
    store.set(initialValue);
  };

  return {
    ...store,
    set,
    clear
  };
};
