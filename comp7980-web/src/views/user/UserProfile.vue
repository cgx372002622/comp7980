<!-- Template -->
<template>
    <el-card header="USER PROFILE">
        <el-form :model="userProfile" label-position="top" style="width: 250px; margin: auto;">
            <el-form-item label="Username">
                <el-input v-model="userProfile.username" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item label="Email">
                <el-input v-model="userProfile.email" placeholder="Email"></el-input>
            </el-form-item>
            <el-form-item label="Phone Number">
                <el-input v-model="userProfile.phoneNumber" placeholder="Phone Number"></el-input>
            </el-form-item>
            <el-row>
                <el-button type="primary" @click="updateProfile">UPDATE PROFILE</el-button>
            </el-row>
        </el-form>
    </el-card>
</template>

<style scoped>
.el-row {
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>

<!-- Script Setup -->
<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores';

const userStore = useUserStore();

console.log(userStore.user)
const userProfile = ref({
    username: '',
    email: '',
    phoneNumber: ''
});
userProfile.value = userStore.user

// 更新用户信息
const updateProfile = async () => {
    console.log(userProfile.value)
    try {
        const response = await fetch(`/api/users/${userStore.user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userStore.token}`, // 携带JWT认证信息
            },
            body: JSON.stringify(userProfile.value),
        });
        if (response.ok) {
            const updatedData = await response.json();
            ElMessage.success(updatedData.message);
            // 若后端返回更新后的token则更新token
            if (updatedData.token) {
                // userStore.setToken(updatedData.token);
            }
        } else {
            throw new Error('Update failed.');
        }
    } catch (error) {
        ElMessage.error(error.message);
    }
};
</script>