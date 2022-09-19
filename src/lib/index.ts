import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import IDB from "./idb";

interface IDBStore<T> extends Writable<T> {
  clear: () => void;
}

type IDBStoreOptions = {
  index?: string;
};

export default <T>(name: string, value: any, {index}: IDBStoreOptions = {}): IDBStore<T> => {
  try {
    const store = writable(value);

    const idb = new IDB(name, index, val => {
      store.set(val);
      store.subscribe(s => {
        if (s) {
          if (Array.isArray(s)) {
            idb.get((val: any[]) => {
              val.filter(ve => !s.find(se => (index ? se[index] === ve[index] : se === ve))).forEach(r => idb.remove(index ? r[index] : r));
            });
            idb.setAll(s);
          } else {
            idb.set(s);
          }
        }
      });
    });

    return {
      ...store,
      clear: () => idb.removeAll(() => store.set(value))
    };
  } catch (err) {
    return {
      ...writable(),
      clear: () => {}
    };
  }
};
