<template>
  <div class="results">
    <q-table
      :rows="store.results"
      :columns="store.columns"
      row-key="id"
      :loading="store.loading"
      :pagination="pagination"
      :filter="filter"
      title="Query Results"
      dense
      flat
    >
      <template v-slot:top-right>
        <q-input v-model="filter" placeholder="Search" dense />
      </template>
    </q-table>
    <q-separator spaced />
    <q-card v-if="store.metrics" flat bordered>
      <q-card-section>{{ store.metrics }}</q-card-section>
    </q-card>
    <q-card flat bordered v-if="store.error">
      <q-card-section class="text-negative">{{ store.error }}</q-card-section>
    </q-card>
    <q-separator v-if="store.metrics || store.error" spaced />
    <q-btn-group outline>
      <q-btn color="primary" label="Visualize as Chart" @click="visualizeResults" />
      <q-btn color="secondary" label="Export as CSV" @click="exportCSV" />
    </q-btn-group>
    <Bar v-if="showChart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { exportFile } from 'quasar';
import { useAppStore } from '../stores/appStore';
import type { QTableProps } from 'quasar';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const store = useAppStore();
const filter = ref<string>('');
const pagination = ref<QTableProps['pagination']>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const showChart = ref<boolean>(false);

const chartData = computed<ChartData<'bar'>>(() => {
  if (!store.results.length) return { labels: [], datasets: [] };
  const labels: string[] = store.results.map((row) => row[Object.keys(row)[0] ?? 0] as string);
  const data: number[] = store.results.map((row) => row[Object.keys(row)[1] ?? 0] as number);
  return {
    labels,
    datasets: [{ label: 'Results', data, backgroundColor: 'rgba(75,192,192,0.4)' }],
  };
});

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
};

const visualizeResults = (): void => {
  showChart.value = !showChart.value;
};

const exportCSV = (): void => {
  const content: string = store.results.map((row) => Object.values(row).join(',')).join('\n');
  exportFile('results.csv', content, 'text/csv');
};
</script>

<style scoped>
.results {
  height: 100%;
  overflow: auto;
}
</style>
