export {default as idbStoreArray} from "./array.svelte";

export {default as idbStoreObject} from "./object.svelte";

export {deleteDB} from "idb";

export const existsDB = async (name: string): Promise<boolean> => (await indexedDB.databases()).some(db => db.name === name);
