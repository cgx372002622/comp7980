import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useChatLogStore = defineStore(
    'chatlog',
    () => {
        const chatlog = ref([{
            role: "system",
            content: "You are a shopping assistant,please help me choose the product!"
        }])

        const pushChatLog = (log)=>{
            chatlog.value.push(log)
            console.log(chatlog.value)
        }

        return {
            chatlog,
            pushChatLog
        }
    },
    // {
    //     persist: true
    // }
)
