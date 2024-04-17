// import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { decodeToken } from '@/utils/decode'

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref('')
        const user = ref({
        })
        const setToken = (newToken) => {
            const userObj = decodeToken(newToken)     //解码复制到user
            user.value = userObj
            token.value = newToken
        }
        const removeToken = () => {
            token.value = ''
        }


        // const getUser = async () => {
        //     const res = await userGetInfoService()
        //     user.value = res.data.data
        // }

        const setUser = (obj) => {
            user.value = obj
        }

        return {
            token,
            setToken,
            setUser,
            removeToken,
            user,
        }
    },
    {
        persist: true
    }
)
