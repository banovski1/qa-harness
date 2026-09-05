<template>
  <div class="thing-list">
    <h1 data-testid="thing-list-title">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  props: ['title', 'rows'],
};
</script>
