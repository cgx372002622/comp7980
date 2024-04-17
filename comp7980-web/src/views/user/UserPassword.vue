<template>
    <el-card header="USER PROFILE">
        <!-- Password reset fields -->
        <el-form :model="userProfile" label-position="top" style="width: 250px; margin: auto;">
            <el-form-item label="Old Password">
                <el-input type="password" v-model="userProfile.oldPassword" autocomplete="off" />
            </el-form-item>
            <el-form-item label="New Password">
                <el-input type="password" v-model="userProfile.newPassword" autocomplete="new-password" />
            </el-form-item>
            <el-form-item label="Confirm New Password">
                <el-input type="password" v-model="userProfile.confirmPassword" autocomplete="new-password" />
            </el-form-item>
            <el-row>
                <el-button type="success" @click="resetPassword">RESET PASSWORD</el-button>
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

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores';
import { userChangePwd } from '@/api/user';

const userStore = useUserStore();
const userProfile = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const resetPassword = async () => {
    if (userProfile.value.newPassword !== userProfile.value.confirmPassword) {
        ElMessage.error('The passwords do not match.');
        return;
    }
    if (!userProfile.value.oldPassword || !userProfile.value.newPassword) {
        ElMessage.error('Passwords cannot be empty.');
        return;
    }

    try {
        const response = await userChangePwd(userProfile.value, userStore.user._id)

        if (response.data.message) {
            ElMessage.success(response.data.message);
            userProfile.value.oldPassword = '';
            userProfile.value.newPassword = '';
            userProfile.value.confirmPassword = '';
        }
    } catch (error) {
        // Handling errors properly
        if (error.response && error.response.data && error.response.data.message) {
            ElMessage.error(error.response.data.message);
            console.log(error)
        } else if (error.message) {
            ElMessage.error(error.message);
            console.log(error)
        } else {
            ElMessage.error('An unknown error occurred.');
        }
    }
};
</script>