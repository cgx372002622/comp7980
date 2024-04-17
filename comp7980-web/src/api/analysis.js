import request from '@/utils/request'

export const getSalesAnalysis = () => {
  return request.get(`/order/salesAnalysis`)
}

export const getRevenueAnalysis = () => {
  return request.get(`/order/revenueAnalysis`)
}
