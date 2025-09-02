<template>
  <div class="editor-container">
    <Codemirror
      v-model:value="store.currentQuery"
      :options="cmOptions"
      :height="height"
      border
      @change="onChange"
      @ready="onReady"
    />
    <q-btn class="run-button" color="primary" label="Run Query (Ctrl+Enter)" @click="runQuery" />
  </div>
</template>

<script setup lang="ts">
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/theme/dracula.css';
import { useAppStore } from '../stores/appStore';

const store = useAppStore();
const height: string = '400px'; // Adjust as needed

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onChange = (value: string, cm: any): void => {
  // Handle change if needed
  console.info(value, cm);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onReady = (cm: any): void => {
  // Editor ready
  console.info(cm);
};

const runQuery = (): void => {
  store.runQuery();
};

const cmOptions = {
  mode: 'text/x-sql',
  theme: 'dracula', // Or dynamic based on dark mode
  lineNumbers: true,
  smartIndent: true,
  matchBrackets: true,
  autofocus: true,
  extraKeys: { 'Ctrl-Enter': runQuery, 'Ctrl-Space': 'autocomplete' },
  hintOptions: { tables: store.currentSchema },
};
</script>

<style scoped>
.editor-container {
  position: relative;
  height: 100%;
}
.run-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
