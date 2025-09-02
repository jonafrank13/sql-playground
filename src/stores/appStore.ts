// src/stores/appStore.ts
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import alasql from 'alasql';
import type { Ref } from 'vue';
import { foodNutritionData } from './dummyData';

interface Schema {
  [table: string]: string[];
}

interface ResultRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface Column {
  name: string;
  label: string;
  field: string;
  sortable: boolean;
}

export const useAppStore = defineStore('app', () => {
  // State
  const currentQuery: Ref<string> = ref('SELECT * FROM food;');
  const history: Ref<string[]> = ref(JSON.parse(localStorage.getItem('queryHistory') || '[]'));
  const favorites: Ref<string[]> = ref(JSON.parse(localStorage.getItem('favorites') || '[]'));
  const auditLog: Ref<string[]> = ref([]);
  const results: Ref<ResultRow[]> = ref([]);
  const columns: Ref<Column[]> = ref([]);
  const metrics: Ref<string> = ref('');
  const error: Ref<string> = ref('');
  const loading: Ref<boolean> = ref(false);
  const currentDB: Ref<string> = ref('food');
  const currentSchema: Ref<Schema> = ref({});
  const status: Ref<string> = ref('Connection: Active (In-Memory DB)');
  const leftDrawerOpen: Ref<boolean> = ref(true);

  // Sample Schemas
  const schemas: { [key: string]: Schema } = {
    employees: { employees: ['id', 'name', 'salary', 'department'] },
    products: { products: ['id', 'name', 'price', 'stock'] },
    food: {
      food: ['id', 'name', 'calories', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron'],
    },
  };

  // Init DB
  const initDB = (dbName: string): void => {
    alasql('DROP TABLE IF EXISTS employees');
    alasql('DROP TABLE IF EXISTS products');
    alasql('DROP TABLE IF EXISTS food');
    if (dbName === 'employees') {
      alasql('CREATE TABLE employees (id INT, name STRING, salary INT, department STRING)');
      alasql("INSERT INTO employees VALUES (1, 'John Doe', 60000, 'IT')");
      alasql("INSERT INTO employees VALUES (2, 'Jane Smith', 75000, 'HR')");
    } else if (dbName === 'products') {
      alasql('CREATE TABLE products (id INT, name STRING, price INT, stock INT)');
      alasql("INSERT INTO products VALUES (1, 'Laptop', 1000, 50)");
      alasql("INSERT INTO products VALUES (2, 'Phone', 500, 100)");
    } else {
      alasql(
        'CREATE TABLE food (id INT, name STRING, calories INT, fat FLOAT, carbs INT, protien INT, sodium INT, calcium STRING, iron STRING)',
      );

      for (const food of foodNutritionData) {
        alasql(
          `INSERT INTO food VALUES (${food.id}, '${food.name}', ${food.calories}, ${food.fat}, ${food.carbs}, ${food.protein}, ${food.sodium}, '${food.calcium}', '${food.iron}')`,
        );
      }
    }
    currentSchema.value = schemas[dbName] ?? {};
    status.value = `Connection: Active (${dbName} DB)`;
  };
  initDB(currentDB.value);

  // Watch DB change
  watch(currentDB, (newDB: string) => initDB(newDB));

  // Actions
  const runQuery = (): void => {
    loading.value = true;
    error.value = '';
    metrics.value = '';
    results.value = [];
    columns.value = [];

    // Params (simple prompt for demo)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [];
    if (currentQuery.value.includes('?')) {
      const paramCount: number = (currentQuery.value.match(/\?/g) || []).length;
      for (let i = 0; i < paramCount; i++) {
        params.push(prompt(`Enter value for parameter ${i + 1}:`)); // Use Quasar dialog in real app
      }
    }

    try {
      const start: number = performance.now();
      const res: ResultRow[] = alasql(currentQuery.value, params);
      const time: number = performance.now() - start;

      if (res.length) {
        const firstRes = res[0] || {};
        columns.value = Object.keys(firstRes).map((key) => ({
          name: key,
          label: key.toUpperCase(),
          field: key,
          sortable: true,
        }));
        results.value = res;
      }

      metrics.value = `Execution Time: ${time.toFixed(2)}ms | Rows: ${res.length}`;
      addToHistory(currentQuery.value);
      addToAuditLog(`Executed: ${currentQuery.value} at ${new Date().toLocaleTimeString()}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      error.value = `Error: ${e.message}`;
    } finally {
      loading.value = false;
    }
  };

  const addToHistory = (query: string): void => {
    history.value.push(query);
    localStorage.setItem('queryHistory', JSON.stringify(history.value));
  };

  const addToFavorites = (): void => {
    favorites.value.push(currentQuery.value);
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  };

  const addToAuditLog = (entry: string): void => {
    auditLog.value.push(entry);
  };

  return {
    currentQuery,
    history,
    favorites,
    auditLog,
    results,
    columns,
    metrics,
    error,
    loading,
    currentDB,
    currentSchema,
    status,
    leftDrawerOpen,
    runQuery,
    addToHistory,
    addToFavorites,
    addToAuditLog,
  };
});
