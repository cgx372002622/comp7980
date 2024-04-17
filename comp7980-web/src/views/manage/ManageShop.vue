<script setup>
import { ref } from 'vue'
import { delProduct, addProduct, updateProduct, getProductPaginate } from '@/api/product';


const tableData = ref([])
const dialogVisible = ref(false)
const formLabelWidth = ref('120px')
const dialogTitle = ref('')
const flag = ref('')
const loading = ref(false)


const editForm = ref({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
})


const pageSize = ref(10)
const currentPage = ref(1)
const totalCount = ref(0)
const pagerCount = ref(5)
const getPaginateData = async () => {
    loading.value = true
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value
    };
    const res = await getProductPaginate(params)
    currentPage.value = res.currentPage
    pageSize.value = res.pageSize
    totalCount.value = res.total
    tableData.value = res.products

    loading.value = false
    console.log(res)
}

getPaginateData()

const onAddItem = () => {
    dialogTitle.value = "Add Product"
    flag.value = "add"
    var data = {
        "name": "",
        "description": "",
        "price": null,
        "stock": null,
        "category": "",
    }
    editForm.value = data
    dialogVisible.value = true

}

const onRemove = async (row) => {
    await delProduct(row._id)
    getPaginateData()
}

const onEdit = (row) => {
    dialogTitle.value = "Edit Product"
    flag.value = "edit"
    Object.assign(editForm.value, row);
    dialogVisible.value = true
}
const handleClose = () => {
    dialogVisible.value = false
}

const onDialogConfirm = async () => {
    if (flag.value === 'edit') {
        await updateProduct(editForm.value)
    } else {
        await addProduct(editForm.value)
    }

    getPaginateData()
    dialogVisible.value = false
}



const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    getPaginateData()
}
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getPaginateData()
}

window.onresize = () => {
    return (() => {
        setDialogWidth()
    })()
}

const dialogWidth = ref(500)
const labelPosition = ref("")
const setDialogWidth = () => {
    // console.log(document.body.clientWidth)
    var val = document.body.clientWidth
    const def = 400 // 默认宽度 formLabelWidth = '120px'
    if (val < def) {
        labelPosition.value = 'left'
        dialogWidth.value = '70%'
        formLabelWidth.value = '70px'
    } else {
        labelPosition.value = 'right'
        dialogWidth.value = def + 'px'
        formLabelWidth.value = '120px'
    }
    // console.log(dialogWidth.value)
}

</script>
<template>
    <el-button class="mt-4" style="width: 100%"></el-button>
    <el-table :data="tableData" style="width: 100%" max-height="75vh" class="el-table" v-loading="loading">
        <el-table-column fixed prop="name" label="Name" width="100vw" id="el-column" />
        <el-table-column prop="price" label="Price" width="120" id="el-column" />
        <el-table-column prop="stock" label="Stock" width="120" id="el-column" />
        <el-table-column prop="category" label="Category" width="100%" id="el-column" />
        <el-table-column prop="description" label="Description" id="el-column" />
        <el-table-column prop="category" label="Category" width="" />
        <el-table-column fixed="right" label="Operations" width="auto" id="el-column" :show-overflow-tooltip="true">
            <template #default="scope">
                <div style="display: flex; flex-wrap: nowrap;  ">

                    <el-button type="primary" size="small" @click.prevent="onEdit(scope.row)">
                        Edit
                    </el-button>
                    <el-button type="danger" size="small" @click.prevent="onRemove(scope.row)">
                        Remove
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-button class="mt-4" style="width: 100%" @click="onAddItem">Add Item</el-button>
    <!-- <el-button class="mt-4" style="width: 100%" @click="onEdit">Buy</el-button> -->

    <div class="web-pagination-block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount" :disabled="false" :background="true" />
    </div>
    <div class="mobile-pagination-block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout=" prev, pager,next" :total="totalCount"
            class="mt-4" :disabled="false" :background="true" :pager-count="pagerCount" />
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth" :before-close="handleClose"
        customClass="dialogwidth">
        <el-form :model="editForm"   :label-position="labelPosition">
            <el-form-item label="Name" :label-width="formLabelWidth" width="0px">
                <el-input v-model="editForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Description" :label-width="formLabelWidth">
                <el-input v-model="editForm.description" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Price" :label-width="formLabelWidth">
                <el-input v-model="editForm.price" autocomplete="off" />
            </el-form-item>
            <el-form-item label="stock" :label-width="formLabelWidth">
                <el-input v-model="editForm.stock" autocomplete="off" />
            </el-form-item>
            <el-form-item label="category" :label-width="formLabelWidth">
                <el-input v-model="editForm.category" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="onDialogConfirm">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.el-talbe #el-column {
    white-space: nowrap;

}

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
        display: none
    }

}
</style>