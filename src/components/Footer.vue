<template>
  <q-toolbar>
    <q-toolbar-title>{{ store.status }}</q-toolbar-title>
    <q-btn flat label="Export History" @click="exportAllHistory" />
  </q-toolbar>
</template>

<script lang="ts" setup>
import { exportFile } from 'quasar';
import { useAppStore } from '../stores/appStore';

const store = useAppStore();

const exportAllHistory = () => {
  const content = JSON.stringify(store.history);
  exportFile('query_history.json', content, 'application/json');
};
</script>
