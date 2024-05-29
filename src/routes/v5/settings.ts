import {idbStoreObject} from "$lib/v5.svelte";

export type Settings = {
  theme: "light" | "dark" | null;
  animations?: boolean;
};

export default idbStoreObject<Settings>({
  name: "settings",
  initialValue: {
    theme: "dark"
  }
});
