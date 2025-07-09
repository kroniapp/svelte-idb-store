<h2>LISTS</h2>

<button onclick={() => (_lists.value = people)}>SET</button>
<button
  onclick={() =>
    _lists.setItem({
      _id: "a",
      name: "Test4"
    })}
>
  UPDATE
</button>
<button
  onclick={() =>
    _lists.setItem({
      _id: "d",
      name: "Test5"
    })}
>
  ADD
</button>
<button onclick={() => _lists.removeItem("d")}>REMOVE</button>
<button onclick={() => _lists.clear()}>CLEAR</button>

{#if _lists.value}
  {#each _lists.value as person}
    <div>
      {person._id}
      {person.name}
    </div>
  {/each}
{/if}

<h2>SETTINGS</h2>

<button onclick={() => (_settings.value = settings)}>SET</button>
<button onclick={() => _settings.setItem("theme", "light")}>LIGHT</button>
<button onclick={() => _settings.setItem("theme", "dark")}>DARK</button>
<button onclick={() => _settings.setItem("theme", null)}>AUTO</button>
<button onclick={() => _settings.clear()}>CLEAR</button>

<pre>
  {JSON.stringify(_settings.value, null, 2)}
</pre>

<script lang="ts">
  import _lists, {type Person} from "./lists";
  import _settings, {type Settings} from "./settings";

  const people: Person[] = [
    {
      _id: "a",
      name: "Test3"
    },
    {
      _id: "c",
      name: "Test1"
    },
    {
      _id: "b",
      name: "Test2"
    }
  ];

  const settings: Settings = {
    theme: "dark",
    animations: true
  };
</script>
