import { createFileRoute } from '@tanstack/react-router';
import { useFindById } from '../../../hooks/useFindById';
import { deleteProduct } from '../../../utils/productActions';

export const Route = createFileRoute('/products/$productId/')({
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

  const { data, isLoading, isError } = useFindById(productId);

  if (isLoading) return <p className="text-center">Loading product...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load product.</p>;

  const product = data?.product || null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Product Card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border">
        {/* Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover"
        />

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-2xl font-semibold">{product.title}</h2>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={() => window.location.href = `/products/${product.productId}/edit`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
              Edit
            </button>
            <button onClick={async () => {
              alert("This product will be deleted.");
              await deleteProduct({product_id: parseInt(productId)})
            }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
