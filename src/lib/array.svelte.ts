import IDB from "./idb";

interface IDBStoreArray<T extends Record<string, any>> {
  value: T[];
  getItem: (id: string) => Promise<T>;
  setItem: (val: T) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

interface OptionsArray<T> {
  name: string;
  key: Extract<keyof T, string>;
  version?: number;
  initialValue?: T[];
  onLoad?: () => void;
  onCreate?: () => void;
}

export class IDBArray<T extends Record<string, any>> extends IDB<T[], Extract<keyof T, string>> {
  get = async (): Promise<T[]> => (await this.store()).getAll();

  set = async (val: T[]): Promise<T[]> => {
    await (await this.store()).clear();
    await Promise.all(val.map(async (value, i) => (await this.store()).put(JSON.parse(JSON.stringify(value)), i)));

    return val;
  };

  getItem = async (id: string): Promise<T> => (await this.index()).get(id);

  setItem = async (val: T): Promise<T[]> => {
    const key = this.key && (await (await this.index()).getKey(val[this.key]));
    await (await this.store()).put(JSON.parse(JSON.stringify(val)), key);

    return this.get();
  };

  removeItem = async (id: string): Promise<T[]> => {
    const key = this.key && (await (await this.index()).getKey(id));
    if (key !== undefined) {
      await (await this.store()).delete(key);
    }

    return this.get();
  };

  clear = async (): Promise<T[]> => {
    await (await this.store()).clear();

    return [];
  };
}

export default <T extends Record<string, any>>({name, key, version, initialValue = [], onLoad, onCreate}: OptionsArray<T>): IDBStoreArray<T> => {
  let s: T[] = $state(initialValue);

  const idb = new IDBArray<T>(name, key, version, initialValue, async creating => {
    s = await idb.get();

    creating && onCreate?.();
    onLoad?.();
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
