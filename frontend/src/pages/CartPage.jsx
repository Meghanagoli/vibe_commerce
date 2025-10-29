import React, { useState } from 'react'
import Header from '../components/Header'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function CartPage() {
    const { cart, loading, remove } = useCart()
    const [removing, setRemoving] = useState(false)

    async function handleRemove(id) {
        setRemoving(true)
        try {
            await remove(id)
        } catch (err) {
            console.error(err)
        } finally {
            setRemoving(false)
        }
    }


    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header />
            <main className="flex-1 flex justify-center items-center p-4">
                <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold mb-4 text-center">Your Cart</h1>

                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <>
                            {cart.cartItems.length === 0 ? (
                                <div className="p-6 bg-gray-100 rounded text-center">
                                    Your cart is empty. <Link to="/" className="text-blue-600">Browse products</Link>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {cart.cartItems.map(item => (
                                            <CartItem key={item.id} item={item} onRemove={handleRemove} />
                                        ))}
                                    </div>

                                    <div className="mt-6 bg-gray-100 p-4 rounded flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-gray-500">Total</div>
                                            <div className="text-xl font-semibold">₹{cart.total}</div>
                                        </div>
                                        <Link
                                            to="/checkout"
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                                        >
                                            Checkout
                                        </Link>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}