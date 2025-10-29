import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'


export default function Header() {
    const { cart } = useCart()
    const count = cart.cartItems.reduce((s, i) => s + i.qty, 0)


    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-xl font-semibold">Vibe Commerce</Link>
                <nav className="flex items-center gap-4">
                    <Link to="/" className="hover:underline">Products</Link>
                    <Link to="/cart" className="relative">
                        Cart
                        <span className="ml-2 inline-block bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}