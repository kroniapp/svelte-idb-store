import {idbStoreObjectV5} from "$lib/v5.svelte";

export type Settings = {
  theme: "light" | "dark" | null;
  animations: boolean;
};

export default idbStoreObjectV5<Partial<Settings>>({
  name: "settings",
  initialValue: {
    theme: "dark"
  }
});
