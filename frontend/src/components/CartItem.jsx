export default function CartItem({ item, onRemove }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm">
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="object-contain h-full w-full"
                />
            </div>

            <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.product.name}</div>
                <div className="text-sm text-gray-600">
                    ₹{item.product.price} × {item.qty} = ₹{item.subtotal}
                </div>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                className="text-red-600 font-medium hover:underline"
            >
                Remove
            </button>
        </div>
    )
}
