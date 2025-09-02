<template>
  <q-scroll-area style="height: 100%">
    <q-list>
      <q-item-section>
        <q-item-label header>Query History</q-item-label>
        <q-item
          v-for="(query, index) in filteredHistory"
          :key="index"
          clickable
          @click="loadQuery(query)"
        >
          {{ query.substring(0, 50) + '...' }}
        </q-item>
      </q-item-section>
      <q-item-section>
        <q-item-label header>
          <div class="row justify-between items-center">
            <div>Favorites</div>
            <q-btn size="12px" @click="addFavorite" flat dense round icon="favorite" label="add" />
          </div>
        </q-item-label>
        <q-item
          v-for="(query, index) in store.favorites"
          :key="index"
          clickable
          @click="loadQuery(query)"
        >
          {{ query.substring(0, 50) + '...' }}
        </q-item>
      </q-item-section>
      <q-item-section>
        <q-item-label header>Audit Log</q-item-label>
        <q-item v-for="(entry, index) in store.auditLog" :key="index">
          {{ entry }}
        </q-item>
      </q-item-section>
    </q-list>
  </q-scroll-area>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAppStore } from '../stores/appStore';

const store = useAppStore();
const historySearch = ref(''); // Bind from header if needed, or prop

const filteredHistory = computed(() => {
  return store.history.filter((q: string) =>
    q.toLowerCase().includes(historySearch.value.toLowerCase()),
  );
});

const loadQuery = (query: string) => {
  store.currentQuery = query;
};

const addFavorite = () => {
  store.addToFavorites();
};
</script>
