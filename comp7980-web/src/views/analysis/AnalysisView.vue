<script setup>
import { ref, onMounted } from "vue";
import { getSalesAnalysis, getRevenueAnalysis } from '@/api/analysis'

const options1 = ref({});
const series1 = ref([]);

const options2 = ref({});
const series2 = ref([]);

onMounted(async () => {
  const data1 = await getSalesAnalysis()
  options1.value = {
    xaxis: {
      categories: data1.map(item => item._id)
    },
    title: {
      text: 'Top Product Sales'
    }
  }
  series1.value = [{
    data: data1.map(item => item.total)
  }]
  const data2 = await getRevenueAnalysis()
  options2.value = {
    xaxis: {
      categories: data2.map(item => item._id)
    },
    title: {
      text: 'Top Product Revenue'
    }
  }
  series2.value = [{
    data: data2.map(item => item.total)
  }]
})

</script>

<template>
  <div>
    <apexchart type="bar" :options="options1" :series="series1" />
  </div>
  <div>
    <apexchart type="bar" :options="options2" :series="series2" />
  </div>
</template>

<style scoped></style>