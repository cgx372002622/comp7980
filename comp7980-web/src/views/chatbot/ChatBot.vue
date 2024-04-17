<script setup>
import { ref ,nextTick} from 'vue';
import chatWithGPT from '@/utils/chatgpt';
import { useChatLogStore } from '@/stores'
// import 'element-ui/lib/theme-chalk/icon.css';    
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);  // 新增状态引用
const messageContainer = ref(null); // 新增，用于引用消息容器
const chatLogStore = useChatLogStore()

console.log(chatLogStore.chatlog)
messages.value = chatLogStore.chatlog.slice(1).map((msg, index) => {
    return { id: index + 1, text: msg.content, sender: msg.role };
  });
console.log(messages.value)


const sendMessage = async () => {
    if (!userInput.value.trim()) return;
    const userMessage = {
        role: "user",
        content: userInput.value
    };


    chatLogStore.pushChatLog(userMessage);
    const id = messages.value.length + 1;
    messages.value.push({ id, text: userInput.value, sender: 'user' });
    isLoading.value = true; // 开始加载

    try {
        const response = await chatWithGPT(chatLogStore.chatlog);
        chatLogStore.pushChatLog({
            role: "assistant",
            content: response.choices[0].message.content
        });
        console.log("Chat response:", response);
        messages.value.push({ id: messages.value.length + 1, text: response.choices[0].message.content, sender: 'assistant' });
    } catch (error) {
        console.error("Failed to chat:", error);
        messages.value.push({ id: messages.value.length + 1, text: "Failed to get response from the server.", sender: 'assistant' });
    } finally {
        isLoading.value = false; // 结束加载
        await nextTick();
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }

    userInput.value = '';
};

</script>

<template>
    <div class="chat-container">
        <el-card class="chat-box" v-loading="isLoading">
            <div class="messages" ref="messageContainer">
                <div v-for="message in messages" :key="message.id" class="message"
                    :class="{ 'user': message.sender === 'user', 'assistant': message.sender === 'assistant' }">
                    {{ message.text }}
                </div>
            </div>
        </el-card>
        <div class="input-area">
            <el-input v-model="userInput" placeholder="Type a message..." @keyup.enter="sendMessage" />
            <el-button type="primary" icon="el-icon-send" @click="sendMessage">Send</el-button>
        </div>
    </div>
</template>



<style scoped>
.chat-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
}

.chat-box {
    height: 500px;
    /* 确定聊天盒子的高度 */
    display: flex;
    flex-direction: column;
}

.messages {
    flex-grow: 1;
    overflow-y: auto;
    /* 启用垂直滚动 */
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 10px;
    max-height: 440px;
    /* 设置最大高度，根据需要调整 */
}

.message {
    margin: 5px;
    padding: 10px;
    border-radius: 10px;
    color: white;
}

.user {
    background-color: #409eff;
    text-align: right;
}

.assistant {
    background-color: #67c23a;
    text-align: left;
}

.input-area {
    display: flex;
    padding-top: 10px;
}

.input-area>.el-input {
    flex-grow: 1;
}

.input-area>.el-button {
    margin-left: 10px;
}
.loading {
    display: flex;
    justify-content: center;
    padding: 10px;
}

</style>
