<template>
  <form><input data-qa="username" /><button data-qa="submit">Go</button></form>
</template>
<script setup>
defineProps({redirectTo: String, compact: Boolean});
</script>
