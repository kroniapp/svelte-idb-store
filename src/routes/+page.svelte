<button on:click={() => ($_lists = people)}>SET</button>
<button
  on:click={() =>
    _lists.setItem({
      _id: "a",
      name: "Test4"
    })}
>
  UPDATE
</button>
<button
  on:click={() =>
    _lists.setItem({
      _id: "d",
      name: "Test5"
    })}
>
  ADD
</button>
<button on:click={async () => alert(JSON.stringify(await _lists.getItem("a")))}>GET</button>
<button on:click={() => _lists.clear()}>CLEAR</button>

<button on:click={() => _settings.setItem("theme", "light")}>LIGHT</button>
<button on:click={() => _settings.setItem("theme", "dark")}>DARK</button>
<button on:click={() => _settings.setItem("theme", null)}>AUTO</button>

<h4>LISTS</h4>
{#if $_lists}
  {#each $_lists as person}
    <div>
      {person._id}
      {person.name}
    </div>
  {/each}
{/if}

<h4>SETTINGS</h4>
<pre>
  {JSON.stringify($_settings)}
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
