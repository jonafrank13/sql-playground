<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Header />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <Sidebar />
    </q-drawer>

    <q-page-container>
      <q-page padding :style-fn="pageHeighCalculator">
        <q-splitter v-model="splitterModel" horizontal height="100%">
          <template v-slot:before>
            <Editor />
          </template>
          <template v-slot:after>
            <Results />
          </template>
        </q-splitter>
      </q-page>
    </q-page-container>

    <q-footer elevated>
      <Footer />
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Editor from './components/Editor.vue';
import Results from './components/Results.vue';
import Footer from './components/Footer.vue';

const leftDrawerOpen = ref(true); // Toggle for sidebar
const splitterModel = ref(50); // Initial split at 50%

const pageHeighCalculator = (offset: number) => ({
  minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
});
</script>
