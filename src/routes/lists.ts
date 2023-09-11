import {idbStoreArray} from "$lib";

export type Person = {
  _id: string;
  name: string;
};

export default idbStoreArray<Person>({
  name: "lists",
  key: "_id",
  initialValue: [
    {
      _id: "b",
      name: "Test2"
    }
  ]
});
