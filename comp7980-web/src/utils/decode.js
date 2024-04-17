import { jwtDecode } from 'jwt-decode'

export const decodeToken = (token) => {
  console.log(token)
  const user = {}
  // const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage
  if (token) {
    const decoded = jwtDecode(token);
    user.username = decoded.username;
    user.role = decoded.role;
    user._id = decoded._id;
    user.email = decoded.email ? decoded.email : null;
    user.phoneNumber = decoded.phoneNumber ? decoded.phoneNumber : null;

  }
  return user
}