import {idbStoreArrayV5} from "$lib/v5.svelte";

export type Person = {
  _id: string;
  name: string;
};

export default idbStoreArrayV5<Person>({
  name: "lists",
  key: "_id",
  initialValue: [
    {
      _id: "b",
      name: "Test2"
    }
  ]
});
