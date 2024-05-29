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

<button onclick={() => _settings.setItem("theme", "light")}>LIGHT</button>
<button onclick={() => _settings.setItem("theme", "dark")}>DARK</button>
<button onclick={() => _settings.setItem("theme", null)}>AUTO</button>

<h4>LISTS</h4>
{#if _lists.value}
  {#each _lists.value as person}
    <div>
      {person._id}
      {person.name}
    </div>
  {/each}
{/if}

<h4>SETTINGS</h4>
<pre>
  {JSON.stringify(_settings.value)}
</pre>

<script lang="ts">
  import _lists, {type Person} from "./lists";
  import _settings from "./settings";

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
</script>
