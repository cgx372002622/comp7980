<script setup>
import moment from 'moment'

defineProps({
  time: Date,
  money: Number,
  products: [
    {
      productName: String,
      productPrice: Number,
      count: Number,
    },
  ]
})

</script>

<template>
  <el-card :header="moment(time).format('YYYY-MM-DD HH:mm:ss')" :footer="`Total Price $${money}`">
    <slot name="userName"></slot>
    <el-row :gutter="20" v-for="product in products" :key="product._id">
      <el-col :span="8">
        <div class="grid-content">{{ product.productName }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">${{ product.productPrice }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">{{ product.count }}</div>
      </el-col>
      <el-divider />
    </el-row>
    <slot name="status"></slot>
  </el-card>
</template>

<style scoped>
.grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-card {
  margin-bottom: 2vh
}
</style>