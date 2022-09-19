import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import IDB from "./idb";

export default <T>(name: string, key: string, value: any): Writable<T> => {
  try {
    const store = writable(value);

    const idb = new IDB(name, key, val => {
      store.set(val);
      store.subscribe(s => {
        if (s) {
          if (Array.isArray(s)) {
            idb.get((val: any[]) => {
              val.filter(ve => !s.find(se => se[key] === ve[key])).forEach(r => idb.remove(r[key]));
            });
            s.forEach(e => idb.set(e));
          } else {
            idb.set(s);
          }
        }
      });
    });

    return store;
  } catch (err) {
    return writable();
  }
};
