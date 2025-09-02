<template>
  <q-toolbar>
    <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />
    <q-toolbar-title>SQL Query Runner</q-toolbar-title>
    <q-select
      v-model="store.currentDB"
      emit-value
      class="q-mr-sm"
      :options="dbOptions"
      label="Database"
      outlined
      dense
      color="black"
    />
    <q-input
      v-model="historySearch"
      color="black"
      placeholder="Search Query History"
      dense
      outlined
    />
    <q-btn
      flat
      :icon="$q.dark.isActive ? 'nightlight' : 'brightness_7'"
      round
      class="q-mx-sm"
      @click="toggleDarkMode"
    />
  </q-toolbar>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useAppStore } from '../stores/appStore';
import { ref } from 'vue';

const $q = useQuasar();
const store = useAppStore();
const historySearch = ref('');

const dbOptions = [
  { value: 'employees', label: 'Employees DB' },
  { value: 'products', label: 'Products DB' },
];

const toggleLeftDrawer = () => {
  store.leftDrawerOpen = !store.leftDrawerOpen;
};

const toggleDarkMode = () => {
  $q.dark.toggle();
};

// Watch historySearch for filtering (implement in Sidebar)
</script>
