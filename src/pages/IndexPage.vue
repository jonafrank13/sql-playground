<template>
  <q-page class="row items-center justify-evenly">
    <q-input v-model="textareaModel" filled type="textarea" />
    <SQLEditor :code="textareaModel" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SQLEditor from 'components/SQLEditor.vue';

defineOptions({
  name: 'IndexPage',
});

const textareaModel = ref('');
</script>
