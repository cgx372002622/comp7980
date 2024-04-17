<script setup>
import {
    HomeFilled,
    Menu,
    Management,
    Promotion,
    UserFilled,
    User,
    DataAnalysis,
    EditPen,
    SwitchButton,
    CaretBottom,
    ChatDotSquare,
    ShoppingCartFull
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import avatar from '@/assets/favicon.ico'
import { ref } from 'vue'
const router = useRouter()
const userStore = useUserStore()

const userRole = userStore.user.role

const isSidebarVisible = ref(false) // 控制侧边栏显示的响应式变量

const toggleSidebar = () => {
    isSidebarVisible.value = !isSidebarVisible.value
}

const handleCommand = async (key) => {
    if (key === 'logout') {
        await ElMessageBox.confirm('Are you confirm log out?', 'Log Out', {
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        })
        userStore.removeToken()
        // userStore.setUser({})
        router.push('/login')
    } else {
        router.push(`/user/${key}`)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <el-aside class="sidebar" width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" :default-active="$route.path"
                text-color="#fff" router>
                <el-menu-item v-if="userRole === 'user'" index="/home/shop">
                    <el-icon>
                        <HomeFilled />
                    </el-icon>
                    <span>Shop</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'user'" index="/home/cart">
                    <el-icon>
                        <ShoppingCartFull />
                    </el-icon>
                    <span>Cart</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'admin'" index="/home/manage">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>Manage Shop</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'user'" index="/home/order">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>Order</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'admin'" index="/home/orderM">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>Manage Order</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'admin'" index="/home/analysis">
                    <el-icon>
                        <DataAnalysis />
                    </el-icon>
                    <span>Analysis</span>
                </el-menu-item>
                <el-sub-menu index="/user">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>Personal center</span>
                    </template>
                    <el-menu-item index="/user/profile">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>Basic information</span>
                    </el-menu-item>

                    <el-menu-item index="/user/password">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>Reset Password</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/home/chatbot">
                    <el-icon>
                        <ChatDotSquare />
                    </el-icon>
                    <span>AI Assistant</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 移动端抽屉 -->
        <el-drawer v-model="isSidebarVisible" title="I am the title" :with-header="false" direction="ltr" size="200px">
            <el-menu active-text-color="#409EFF" background-color="#ffffff" :default-active="$route.path"
                text-color="#000" router>
                <el-menu-item v-if="userRole === 'user'" index="/home/shop">
                    <el-icon>
                        <HomeFilled />
                    </el-icon>
                    <span>Shop</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'user'" index="/home/cart">
                    <el-icon>
                        <ShoppingCartFull />
                    </el-icon>
                    <span>Cart</span>
                </el-menu-item>
                <el-menu-item v-else index="/home/manage">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>Manage Shop</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'user'" index="/home/order">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>Order</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'admin'" index="/home/orderM">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>Manage Order</span>
                </el-menu-item>
                <el-menu-item v-if="userRole === 'admin'" index="/home/analysis">
                    <el-icon>
                        <DataAnalysis />
                    </el-icon>
                    <span>Analysis</span>
                </el-menu-item>
                <el-sub-menu index="/user">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>Personal center</span>
                    </template>
                    <el-menu-item index="/user/profile">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>Basic information</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>Reset Password</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/home/chatbot">
                    <el-icon>
                        <ChatDotSquare />
                    </el-icon>
                    <span>AI Assistant</span>
                </el-menu-item>
            </el-menu>
        </el-drawer>

        <el-container>
            <el-header>
                <div>
                    <el-button @click="toggleSidebar" class="sidebar-button">
                        <el-icon>
                            <Menu />
                        </el-icon>
                    </el-button>
                    Hello：<strong>{{ userStore.user.nickname || userStore.user.username }}</strong>
                </div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userStore.user.user_pic || avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User">Basic information</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">Reset Password</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">Log out</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer>Online Shopping</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
//外部容器
.layout-container {
    height: 100vh;

    //左侧边栏
    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        //左侧边栏菜单
        .el-menu {
            border-right: none;
        }
    }

    //header
    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        //下拉菜单
        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }

    :deep .el-drawer__body {
        padding: 0;
    }
}

@media (max-width: 400px) {
    .el-aside {
        display: none; // 默认隐藏侧边栏
    }

    .sidebar-button {
        display: inline;
    }
}

@media (min-width: 400px) {
    .sidebar-button {
        display: none;
    }
}
</style>
