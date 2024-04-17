import request from '@/utils/request'

export const getAllProducts = () => {
  return request.get('/shop/products')
}

export const delProduct = (id) => {
  return request.delete(`/shop/products/${id}`)
}

export const addProduct = (data) => {
  return request.post('/shop/products', {
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    category: data.category
  })
}

export const updateProduct = (data) => {
  return request.put(`/shop/products/${data._id}`, {
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    category: data.category
  })
}

export const getProductPaginate = (params) => {
  return request.get('/shop/products/paginate/filter', { params })
}

export const addCart = (params) => {
  return request.post('/cart/add',{
    "userId": params.userId,
    "productId": params.productId 
  })
}
