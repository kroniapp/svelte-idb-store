import IDB from "./idb";

interface IDBStoreObject<T extends Record<string, any>> {
  value: T;
  getItem: <K extends Extract<keyof T, string>>(id: K) => Promise<T[K]>;
  setItem: <K extends Extract<keyof T, string>>(id: K, val: T[K]) => Promise<void>;
  removeItem: <K extends Extract<keyof T, string>>(id: K) => Promise<void>;
  clear: () => Promise<void>;
}

interface OptionsObject<T> {
  name: string;
  initialValue?: T;
  onLoad?: () => void;
  onCreate?: () => void;
}

export class IDBObject<T extends Record<string, any>> extends IDB<T, Extract<keyof T, string>> {
  get = async (): Promise<T> => {
    let res: T = {} as T;
    let cursor = await (await this.store()).openCursor();

    while (cursor) {
      res[cursor.key.toString() as keyof T] = cursor.value;
      cursor = await cursor.continue();
    }

    return res;
  };

  set = async (val: T): Promise<T> => {
    await Promise.all(Object.entries(val).map(async ([key, value]) => (await this.store()).put(JSON.parse(JSON.stringify(value)), key)));

    return val;
  };

  getItem = async <K extends Extract<keyof T, string>>(id: K): Promise<T[K]> => (await this.store()).get(id);

  setItem = async <K extends Extract<keyof T, string>>(id: K, val: T[K]): Promise<T> => {
    await (await this.store()).put(JSON.parse(JSON.stringify(val)), id);

    return this.get();
  };

  removeItem = async (id: Extract<keyof T, string>): Promise<T> => {
    await (await this.store()).delete(id);

    return this.get();
  };

  clear = async (): Promise<T> => {
    await (await this.store()).clear();

    return {} as T;
  };
}

export default <T extends Record<string, any>>({name, initialValue, onLoad, onCreate}: OptionsObject<T>): IDBStoreObject<T> => {
  let s: T | undefined = $state(initialValue);

  const idb = new IDBObject<T>(name, undefined, initialValue, async creating => {
    s = await idb.get();

    creating && onCreate?.();
    onLoad?.();
  });

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
