import request from '@/utils/request'

export const getPageOrder = (current, pageSize) => {
  return request.get(`/order/pagination?current=${current}&pageSize=${pageSize}`)
}

export const getPageOrderM = (current, pageSize) => {
  return request.get(`/order/paginationM?current=${current}&pageSize=${pageSize}`)
}

export const sendOrder = (id) => {
  return request.put(`/order/send/${id}`)
}
