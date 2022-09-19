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

  const lists = idbStore<any[]>("lists", [], {
    index: "_id"
  });

  const people = [
    {
      _id: "a",
      name: "Test1"
    },
    {
      _id: "b",
      name: "Test2"
    },
    {
      _id: "c",
      name: "Test3"
    }
  ];
</script>
