<script setup>
import { Delete, Money } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { getPageCart, deleteItem, checkCart } from '@/api/cart'

const cartItems = ref([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(5)

const totalPrice = computed(() => {
  return cartItems.value.reduce((pre, cur) => {
    return pre + cur.productPrice * cur.count
  }, 0)
})

const pagination = async (current, pageSize) => {
  const res = await getPageCart(current, pageSize)
  total.value = res.total
  const postData = res.data.map((item) => {
    return {
      _id: item._id,
      category: item.product[0].category,
      description: item.product[0].description,
      productName: item.product[0].name,
      productPrice: item.product[0].price,
      count: item.count
    }
  })
  cartItems.value = postData
}

onMounted(() => {
  pagination(current.value, pageSize.value)
})

const handleChange = (value) => {
  current.value = value
  pagination(current.value, pageSize.value)
}

const handleDeleteItem = async (id) => {
  await deleteItem(id)
  pagination(current.value, pageSize.value)
}

const handleCheck = async () => {
  await checkCart({
    money: totalPrice.value,
    products: cartItems.value.map((item) => ({
      productName: item.productName,
      productPrice: item.productPrice,
      count: item.count
    }))
  })
  pagination(current.value, pageSize.value)
}
</script>

<template>
  <div v-if="cartItems.length === 0" class="warning">
    <el-empty description="You have no products in your cart" />
  </div>
  <el-table v-if="cartItems.length !== 0" :data="cartItems" style="width: 100%" max-height="75vh">
    <el-table-column fixed prop="productName" label="Name" width="160" />
    <el-table-column prop="productPrice" label="Price" width="120" />
    <el-table-column prop="category" label="Category" width="" />
    <el-table-column prop="description" label="Description" width="" />
    <el-table-column prop="count" label="Count" width="200">
      <template #default="scope">
        <el-input-number :min="1" v-model="scope.row.count" />
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" width="100">
      <template #default="scope">
        <el-button type="danger" :icon="Delete" @click="handleDeleteItem(scope.row._id)" size="small" />
      </template>
    </el-table-column>
  </el-table>
  <!-- <el-space direction="vertical">
    <good-item v-for="cartItem in cartItems" :key="cartItem._id" :category="cartItem.category"
      :description="cartItem.description" :productName="cartItem.productName" :productPrice="cartItem.productPrice">
      <template #count>
        <el-input-number :min="1" v-model="cartItem.count" />
      </template>
<template #delete>
        <el-button type="danger" :icon="Delete" @click="handleDeleteItem(cartItem._id)" />
      </template> </good-item></el-space> -->
  <div class="el-pagination-container">
    <el-pagination v-if="cartItems.length !== 0" background layout="pre, pager, next" :total="total"
      :pageSize="pageSize" @current-change="handleChange" />
  </div>
  <div v-if="cartItems.length !== 0" class="price">Total Price: ${{ totalPrice }}</div>
  <el-button v-if="cartItems.length !== 0" type="primary" :icon="Money" @click="handleCheck"
    class="checkBtn">Check</el-button>
</template>

<style scoped>
.el-space {
  width: 100%;
}

.el-pagination {
  margin: 2vh auto 0;
}

.el-pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.price,
.checkBtn {
  margin-top: 2vh
}
</style>
