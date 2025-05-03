import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFindById } from '../../../hooks/useFindById';
import { editProduct } from '../../../utils/productActions';
import { useQueryClient } from '@tanstack/react-query';

// Initial State
const initialState = {
  title: '',
  description: '',
  category: '',
  price: 0,
  quantity: 0,
  img: ''
}

export const Route = createFileRoute('/products/$productId/edit')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      productId: params.productId,
    }
  }
})

function RouteComponent() {

  // State for form data
    const [formData, setFormData] = useState(initialState);

  // Get props
    const { productId } = Route.useLoaderData();
  
    const { data, isLoading, isError } = useFindById(productId);

    const queryClient = useQueryClient();

    useEffect(() => {

      // Load user data
      if (!isLoading && data && data?.product) {

          // Create a copy of the initial form data with user values
          const userData = { ...initialState };
          for (const key in data.product) {
              if (key in userData) userData[key] = data.product[key];
          }

          setFormData(userData);
      }

  }, [data?.product]);

  // Destructure the email value from form data
    const { 
      title,
      description,
      category,
      price,
      quantity,
      img
    } = formData;
    
  // Function to handle input change
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value});
    
    // Handle form submit
    const onSubmit = async (e:any) => {
      e.preventDefault();
  
      console.log("product data: ", data?.product);
      
      try {
        console.log("form input: ", formData);
        await editProduct({ ...formData, product_id: parseInt(productId) });

        // Invalidate old cahced data for this product
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
      } catch (err) {
        console.error('Edit Product failed', err);
      }
    };
  
    if (isLoading) return <p className="text-center">Loading product...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load product.</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Product</h1>

      <form onSubmit={onSubmit} className="bg-white p-6 shadow-md rounded-lg">
        {/* Product Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Product Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Enter product title"
            className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Enter product description"
            rows={4}
            className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Home">Home</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={price}
            onChange={onChange}
            placeholder="Enter product price"
            className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            name="quantity"
            value={quantity}
            onChange={onChange}
            placeholder="Enter quantity"
            className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Product Image */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            value={img}
            name="img"
            onChange={onChange}
            className="mt-2 w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Save
        </button>
      </form>
    </div>
  )
}
