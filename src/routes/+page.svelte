<button on:click={() => ($lists = people)}>UPDATE</button>
<button on:click={() => lists.clear()}>CLEAR</button>

{#if $lists}
  {#each $lists as person}
    <div>
      {person._id}
      {person.name}
    </div>
  {/each}
{/if}

<script lang="ts">
  import idbStore from "$lib";

  const lists = idbStore<any[]>("lists", []);

  const people = [
    {
      _id: "a",
      name: "Test3",
      order: 2
    },
    {
      _id: "b",
      name: "Test2",
      order: 1
    },
    {
      _id: "c",
      name: "Test1",
      order: 0
    }
  ];
</script>
