import request from '@/utils/request'

export const userLogin = (form) => {
  return request.post('/users/login', {
    username: form.username,
    password: form.password
  })
}

export const userRegister = (form) => {
  return request.post('/users/register', {
    username: form.username,
    password: form.password
  })
}

export const userChangePwd = (data,userId) => {
  console.log(data.username)
  return request.put(`/users/change-password/${userId}`, {
    oldPassword: data.oldPassword,
    newPassword: data.newPassword
  })
}


// export const userLoginService = ({ username, password }) =>
//   request.post('/api/login', {
//     username,
//     password
//   })

// export const userGetInfoService = () => {
//   return request.get('/my/userinfo')
// }
