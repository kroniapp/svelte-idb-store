<button on:click={() => ($_lists = people)}>SET</button>
<button
  on:click={() =>
    _lists.setOne({
      _id: "a",
      name: "Test4"
    })}
>
  UPDATE
</button>
<button on:click={() => _lists.clear()}>CLEAR</button>

<button on:click={() => _settings.setOne("theme", "light")}>LIGHT</button>
<button on:click={() => _settings.setOne("theme", "dark")}>DARK</button>
<button on:click={() => _settings.setOne("theme", null)}>AUTO</button>

<h4>LISTS</h4>
{#if $_lists}
  {#each $_lists as person}
    <div>
      {person._id}
      {person.name}
    </div>
  {/each}
{/if}

<h4>THEME</h4>
{JSON.stringify($_settings)}

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
    },
  ];
</script>
