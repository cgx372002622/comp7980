async function chatWithGPT(messages) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('api-key', '93373955-cd86-47e7-95f6-c06376d6bb02')
  myHeaders.append('Content-Type', 'application/json')

  console.log(messages)
  const raw = JSON.stringify({
    messages: messages,
    temperature: 0,
    max_tokens: 50 // 限制生成的最大令牌数
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  const url = '/chatgpt'

  console.log(raw)
  return await fetch(url, requestOptions)
    .then((response) => {
      
      console.log(response)
      return response.json()
    }) // Assuming the response is JSON
    .catch((error) => console.error('Error:', error))
}

export default chatWithGPT
