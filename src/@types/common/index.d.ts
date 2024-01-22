interface IDBStore {
  clear: () => Promise<void>;
}

interface IDBStoreArray<T> extends IDBStore {
  getItem: (id: string) => Promise<T>;
  setItem: (val: T) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

interface IDBStoreObject<T extends Record<string, any>> extends IDBStore {
  getItem: <K extends Extract<keyof T, string>>(id: K) => Promise<T[K]>;
  setItem: <K extends Extract<keyof T, string>>(id: K, val: T[K]) => void;
  removeItem: <K extends Extract<keyof T, string>>(id: K) => Promise<void>;
}

declare type OptionsArray<T> = {
  name: string;
  key: Extract<keyof T, string>;
  initialValue?: T[];
  callback?: (creating: boolean) => void;
};

declare type OptionsObject<T> = {
  name: string;
  initialValue?: T;
  callback?: (creating: boolean) => void;
};
