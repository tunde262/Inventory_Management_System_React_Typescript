import { useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';

// Hooks
import { useFindById } from '../../../hooks/useFindById';
import { fetchAuthStatus, useAuth } from '@/hooks/useAuth';

// Backend Actions
import { deleteProduct } from '../../../utils/productActions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute('/products/$productId/')({
  beforeLoad: async () => {
    // Get auth status
    const { isAuthenticated } = await fetchAuthStatus();

    // Check auth status
    if(!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      productId: params.productId,
    }
  }
})

function RouteComponent() {

  // Get props
  const { productId } = Route.useLoaderData();

  // Product Data
  const { data, isLoading, isError } = useFindById(productId);

  // User Data
  const { data: userData, isLoading: userLoading } = useAuth();

  // Confirmation Modal Logic
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoading) return <p className="text-center">Loading product...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load product.</p>;

  const product = data?.product || null;

  const handleDelete = async () => {
    setLoading(true);
    await deleteProduct({ product_id: parseInt(productId) });
    setLoading(false);
    window.location.href = '/products';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Product Card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border">
        {/* Image */}
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-64 object-cover"
        />

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-2xl font-semibold">{product.title}</h2>

          {/* Product Details */}
          <div className="text-gray-700 space-y-2">
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>Price:</strong> ${product.price}</p>
          </div>

          {/* Actions */}
          {userData?.user?.role === 'admin' && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => window.location.href = `/products/${product.productId}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
              >
                Edit
              </button>

              {/* Delete Button Triggers Dialog */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
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
      </div>
    </div>
  );
}
