<script>
  export let label;
  export let count = 0;
</script>

<button data-testid="counter-increment" on:click={() => count++}>
  <span data-cy="counter-label">{label}</span>
</button>
