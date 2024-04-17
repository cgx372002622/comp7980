<script setup>
defineProps({
  productName: String,
  productPrice: Number,
  description: String,
  category: String,
  count: Number
})
</script>

<template>
  <el-row>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4"
          ><div class="grid-content">{{ productName }}</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content">${{ productPrice }}</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content">{{ description }}</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content">{{ category }}</div></el-col
        >
        <el-col :span="4">
          <div class="grid-content">
            <slot name="count"></slot>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <slot name="delete"></slot>
          </div>
        </el-col>
      </el-row> </el-card
  ></el-row>
</template>

<style scoped>
.grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-row {
  width: 100%;
}

.el-card {
  width: 100%;
}
</style>
