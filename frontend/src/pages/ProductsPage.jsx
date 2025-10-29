import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import { getProducts } from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { add } = useCart();

    useEffect(() => {
        setLoading(true);
        getProducts()
            .then((res) => {
                if (res.success) setProducts(res.products);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="flex-grow flex flex-col items-center justify-start py-10 px-6">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                    Our Products
                </h1>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : (
                    <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onAdd={(id) => add(id, 1)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
