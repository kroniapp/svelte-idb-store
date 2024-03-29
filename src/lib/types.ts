export interface IDBStore {
  clear: () => Promise<void>;
}

export interface IDBStoreArray<T> extends IDBStore {
  getItem: (id: string) => Promise<T>;
  setItem: (val: T) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export interface IDBStoreObject<T extends Record<string, any>> extends IDBStore {
  getItem: <K extends Extract<keyof T, string>>(id: K) => Promise<T[K]>;
  setItem: <K extends Extract<keyof T, string>>(id: K, val: T[K]) => Promise<void>;
  removeItem: <K extends Extract<keyof T, string>>(id: K) => Promise<void>;
}

export interface OptionsArray<T> {
  name: string;
  key: Extract<keyof T, string>;
  initialValue?: T[];
  onLoad?: () => void;
  onCreate?: () => void;
}

export interface OptionsObject<T> {
  name: string;
  initialValue?: T;
  onLoad?: () => void;
  onCreate?: () => void;
}
