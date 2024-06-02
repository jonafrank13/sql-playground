<template>
  <div>
    <CodePrism :lang="props.lang" :code="props.code" />
  </div>
</template>

<script setup lang="ts">
import CodePrism from './CodePrism';

const props = defineProps({
  code: String,

  lang: {
    type: String,
    default: 'sql',
  },
});
</script>
