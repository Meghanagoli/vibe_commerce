import React, { useState } from 'react'
import Header from '../components/Header'
import { useCart } from '../context/CartContext'
import ReceiptModal from '../components/ReceiptModal'


export default function CheckoutPage() {
    const { cart, doCheckout } = useCart()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [receipt, setReceipt] = useState(null)


    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            // send cart items in the backend format
            const payload = {
                cartItems: cart.cartItems.map(ci => ({ productId: ci.product.id || ci.product._id, qty: ci.qty })),
                customerName: name,
                customerEmail: email
            }
            const res = await doCheckout(payload)
            if (res.success) setReceipt(res.receipt)
        } catch (err) {
            console.error(err)
            alert('Checkout failed')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Header />
            <main className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="p-3 rounded border" required />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="p-3 rounded border" required />


                    <div className="bg-white p-4 rounded shadow">
                        <div className="text-sm text-gray-500">Order total</div>
                        <div className="text-xl font-semibold">₹{cart.total}</div>
                    </div>


                    <button disabled={loading} type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Processing...' : 'Pay'}</button>
                </form>


                <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
            </main>
        </div>
    )
}