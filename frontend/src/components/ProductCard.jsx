import React, { useState } from "react";

export default function ProductCard({ product, onAdd }) {
    const [qty, setQty] = useState(0);

    const handleAdd = () => {
        const newQty = qty + 1;
        setQty(newQty);
        onAdd(product._id, 1);
    };

    const handleRemove = () => {
        if (qty > 0) {
            const newQty = qty - 1;
            setQty(newQty);
            onAdd(product._id, -1); // decrement by 1
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col p-5">
            {/* Product Image */}
            <div className="h-52 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-auto object-contain"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                )}
            </div>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {product.name}
            </h3>

            {/* Product Description */}
            <p
                className="text-gray-600 text-sm leading-relaxed mb-4 overflow-hidden"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {product.description}
            </p>

            {/* Price + Button/Counter */}
            <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800">
                    ₹{product.price}
                </span>

                {qty === 0 ? (
                    <button
                        onClick={handleAdd}
                        className="px-5 py-2 !bg-green-600 hover:!bg-green-700 text-white font-medium rounded-md shadow-md transition-colors"
                        style={{ backgroundColor: "#16A34A" }}
                    >
                        Add
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRemove}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-lg font-bold hover:bg-red-600"
                        >
                            -
                        </button>
                        <span className="text-lg font-semibold">{qty}</span>
                        <button
                            onClick={handleAdd}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-lg font-bold hover:bg-green-700"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
