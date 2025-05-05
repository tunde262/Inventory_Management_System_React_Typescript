import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { deleteProduct } from '../../utils/productActions';
import { useAuth } from '@/hooks/useAuth';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

type Product = {
    productId: string;
    title: string;
    description: string;
    category: string;
    img: string;
    quantity: Number,
    price: Number;
    // Add other fields as needed
};

type TableRowProps = {
    product: Product;
    isSelected: boolean;
    onToggleSelect: () => void;
};

const TableRow = ({
    product,
    isSelected, 
    onToggleSelect
} : TableRowProps) => {

    // Hide component if deleted
    const [visible, setVisible] = useState(true);

    // Confirmation Modal Logic
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useAuth();

    const handleDelete = async () => {
        setLoading(true);
        await deleteProduct({ product_id: parseInt(product.productId) });
        setLoading(false);
        setOpen(false);
        setVisible(false);
    };

    return (
        // <Link
        //     to="/products/$productId" 
        //     params={{
        //         productId: product.productId
        //     }}
        //     key={product.productId}
        //     className="flex items-center gap-4 p-4 hover:bg-gray-100 transition"
        //     >
            <div
                key={product.productId}
                className="flex items-center justify-between gap-4 w-full p-4 hover:bg-gray-100 transition"
                style={!visible ? {display: 'none'} : {}}
            >
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className="accent-blue-600"
                    />

                    <div onClick={() => window.location.href = `/products/${product.productId}`} className="flex items-center gap-4">
                        <img
                            src={product.img}
                            alt={product.title}
                            className="w-20 h-20 object-cover rounded-md cursor-pointer"
                        />
                        <div className="cursor-pointer">
                            <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                            <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                    </div>
                </div>

                {data?.user?.role === 'admin' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.location.href = `/products/${product.productId}/edit`}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                        >
                            Edit
                        </button>
                        {/* Delete Button Triggers Dialog */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                >
                                Delete
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                </DialogHeader>
                                <p>This action cannot be undone. This will permanently delete the product <strong>{product.title}</strong>.</p>
                                <DialogFooter className="mt-4">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        {loading ? "Deleting..." : "Confirm Delete"}
                                    </button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        // </Link>
    ) 
}

export default TableRow;
