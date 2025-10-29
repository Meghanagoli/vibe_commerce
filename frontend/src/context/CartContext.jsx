import React, { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../api/api'


const CartContext = createContext()


export function CartProvider({ children }) {
    const [cart, setCart] = useState({ cartItems: [], total: 0 })
    const [loading, setLoading] = useState(false)


    async function loadCart() {
        setLoading(true)
        try {
            const res = await api.getCart()
            if (res.success) setCart({ cartItems: res.cartItems, total: res.total })
        } catch (err) {
            console.error('Load cart error', err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => { loadCart() }, [])


    async function add(productId, qty = 1) {
        try {
            const res = await api.addToCart(productId, qty)
            await loadCart()
            return res
        } catch (err) {
            console.error('Add to cart error', err)
            throw err
        }
    }


    async function remove(id) {
        try {
            await api.removeCartItem(id)
            await loadCart()
        } catch (err) {
            console.error('Remove cart item err', err)
            throw err
        }
    }


    async function doCheckout(payload) {
        try {
            const res = await api.checkout(payload)
            await loadCart()
            return res
        } catch (err) {
            console.error('Checkout err', err)
            throw err
        }
    }


    return (
        <CartContext.Provider value={{ cart, loading, add, remove, loadCart, doCheckout }}>
            {children}
        </CartContext.Provider>
    )
}


export const useCart = () => useContext(CartContext)