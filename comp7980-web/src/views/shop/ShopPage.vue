<script setup>
import { ref } from 'vue'
import { getProductPaginate, addCart } from '@/api/product'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const tableData = ref([])
const loading = ref(false)
const pagerCount = ref(5)
// const getTableData = async () => {
//     console.log("get product data")
//     const res = await getAllProducts()
//     tableData.value = res.map(product => ({
//         ...product,
//         buy: false // 在每个对象中添加 buy 属性
//     }));
//     console.log(tableData.value)
// }

const pageSize = ref(10)
const currentPage = ref(1)
const totalCount = ref(0)

const getPaginateData = async () => {
  loading.value = true
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value
  }
  const res = await getProductPaginate(params)
  currentPage.value = res.currentPage
  pageSize.value = res.pageSize
  totalCount.value = res.total
  tableData.value = res.products.map((product) => ({
    ...product,
    buy: false // 在每个对象中添加 buy 属性
  }))
  loading.value = false
  console.log(res)
}

getPaginateData()

const handler = async (row) => {
  var data = {}
  data.userId = userStore.user._id
  data.productId = row._id
  const res = await addCart(data)
  row.buy = !row.buy
  console.log(res)
}

// const onBuy = () => {
//     var buyList = tableData.value.filter(e => e.buy === true);
//     console.log(buyList)
// }

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  getPaginateData()
}
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  getPaginateData()
}
</script>
<template>
  <el-table :data="tableData" style="width: 100%" max-height="75vh" v-loading="loading">
    <el-table-column fixed prop="name" label="Name" width="150" />
    <el-table-column prop="price" label="Price" width="120" />
    <el-table-column prop="stock" label="Stock" width="120" />
    <el-table-column prop="description" label="Description" width="" />
    <el-table-column prop="category" label="Category" width="" />
    <el-table-column fixed="right" label="Operations" width="">
      <template #default="scope">
        <el-button v-if="true" size="small" type="success" @click="handler(scope.row)"
          >Add
        </el-button>
        <!-- <el-button v-else type="danger" size="small" @click.prevent="handler(scope.row)">
                    Remove
                </el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <!-- <el-button class="mt-4" style="width: 100%" @click="onBuy">Buy</el-button> -->
  <div class="web-pagination-block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :disabled="false"
      :background="true"
    />
  </div>
  <div class="mobile-pagination-block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout=" prev, pager,next"
      :total="totalCount"
      class="mt-4"
      :disabled="false"
      :background="true"
      :pager-count="pagerCount"
    />
  </div>
</template>

<style scoped>
.el-pagination {
  margin-top: 2vh;
}
@media (max-width: 400px) {
  .web-pagination-block {
    display: none;
  }

  .el-pagination {
    /* display: block; */
  }
  .btn-prev .btn-next {
    display: inline;
  }
  /* :deep .el-table__inner-wrapper{
        height: 100%
    } */
}
@media (min-width: 400px) {
  .mobile-pagination-block {
    display: none;
  }
}
</style>
