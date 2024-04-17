<script setup>
import orderItem from '@/components/orderItem.vue'
import { ref, onMounted } from 'vue'
import { getPageOrder } from '@/api/order';
import { Ship, TakeawayBox } from '@element-plus/icons-vue'

const orders = ref([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(5)

const pagination = async (current, pageSize) => {
  const res = await getPageOrder(current, pageSize)
  total.value = res.total
  orders.value = res.data
}

onMounted(() => {
  pagination(current.value, pageSize.value)
})

const handleChange = value => {
  current.value = value
  pagination(current.value, pageSize.value)
}

</script>

<template>
  <div v-if="orders.length === 0" class="warning">
    <el-empty description="There are no orders" />
  </div>
  <order-item v-for="order in orders" :key="order._id" :time="order.time" :money="order.money"
    :products="order.products">
    <template #status>
      <el-row>
        <div v-if="order.status"><el-icon>
            <Ship />
          </el-icon>Shipped</div>
        <div v-if="!order.status"><el-icon>
            <TakeawayBox />
          </el-icon>Unshipped</div>
      </el-row>
    </template>
  </order-item>
  <div class="el-pagination-container">
    <el-pagination v-if="orders.length !== 0" background layout="pre, pager, next" :total="total" :pageSize="pageSize"
      @current-change="handleChange" />
  </div>
</template>

<style scoped>
.el-pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-icon {
  margin-right: 1vh;
}
</style>