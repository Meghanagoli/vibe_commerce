

export default function ReceiptModal({ receipt, onClose }) {
    if (!receipt) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold">Receipt</h2>
                <p className="text-sm text-gray-500 mt-2">Order ID: {receipt.orderId}</p>
                <p className="mt-2">Total: ₹{receipt.total}</p>
                <p className="text-sm text-gray-500">Time: {new Date(receipt.timestamp).toLocaleString()}</p>
                <ul className="mt-4 space-y-2">
                    {receipt.items.map((it, idx) => (
                        <li key={idx} className="text-sm">{it.qty} × {it.product} @ ₹{it.priceAtPurchase}</li>
                    ))}
                </ul>
                <div className="mt-4 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded">Close</button>
                </div>
            </div>
        </div>
    )
}