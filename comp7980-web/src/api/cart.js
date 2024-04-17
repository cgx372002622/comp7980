import request from '@/utils/request'

export const getPageCart = (current, pageSize) => {
  return request.get(`/cart/pagination?current=${current}&pageSize=${pageSize}`)
}

export const deleteItem = (id) => {
  return request.delete(`/cart/delete/${id}`)
}

export const checkCart = (body) => {
  console.log('body==>', body)
  return request.post('/cart/check', body)
}
