import axios from 'axios'


const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000
})


export const getProducts = () => API.get('/products').then(r => r.data)
export const getCart = () => API.get('/cart').then(r => r.data)
export const addToCart = (productId, qty = 1) => API.post('/cart', { productId, qty }).then(r => r.data)
export const removeCartItem = (id) => API.delete(`/cart/${id}`).then(r => r.data)
export const checkout = (payload) => API.post('/checkout', payload).then(r => r.data)


export default API