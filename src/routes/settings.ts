import idbStoreObject from "$lib/object.svelte";

export type Settings = {
  theme: "light" | "dark" | null;
  animations?: boolean;
};

export default idbStoreObject<Settings>({
  name: "settings",
  initialValue: {
    theme: "dark",
    animations: true,
  }
});
