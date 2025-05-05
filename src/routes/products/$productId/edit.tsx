import { useEffect, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

// Hooks
import { useFindById } from '../../../hooks/useFindById';
import { fetchAuthStatus, useAuth } from '../../../hooks/useAuth';

// Backend Actions
import { editProduct } from '../../../utils/productActions';

// Components
import { toast } from 'sonner';

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
  beforeLoad: async ({ params }) => {
    // Get auth status
    const { isAuthenticated, user } = await fetchAuthStatus();

    // Check auth status
    if(!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }

    // Check user role permissions
    if (user.role !== 'admin') {
      throw redirect({
        to: "/products/" + params.productId,
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

  // State for form data
    const [formData, setFormData] = useState(initialState);

  // Get props
    const { productId } = Route.useLoaderData();
  
    const { data, isLoading, isError } = useFindById(productId);

    // Cache data
    const queryClient = useQueryClient();

    // User Data 
    const { data: userData } = useAuth();

    useEffect(() => {

      // Load product data
      if (!isLoading && data && data?.product) {

          // Create a copy of the initial form data with user values
          const productData = { ...initialState };
          for (const key in data.product) {
              if (key in productData) productData[key] = data.product[key];
          }

          setFormData(productData);
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
  
      console.log("form data: ", formData);

      // Check if user is an admin
      if (userData?.user?.role !== 'admin') {
        toast.error("Must be an admin to create stuff.");
        return;
      }

      // -- Form validation for required input fields --
      const requiredFields = [
        { name: "title", value: title, label: "Product Title" },
        { name: "description", value: description, label: "Description" },
        { name: "category", value: category, label: "Category" },
        { name: "price", value: price, label: "Price" },
        { name: "quantity", value: quantity, label: "Quantity" },
      ];
    
      for (let field of requiredFields) {
        if (
          field.value === '' || 
          (typeof field.value === 'number' && field.value <= 0)
        ) {
          toast.error(`${field.label} is required.`);
          return;
        }
      }

      if (quantity < 1) {
        toast.error(`Quantity must be greater than 0.`);
          return;
      }

      if (price < 1) {
        toast.error(`Price must be greater than 0.`);
          return;
      }
      
      // -- END: Form validation for required input fields --
      
      try {
        console.log("form input: ", formData);
        await editProduct({ ...formData, product_id: parseInt(productId) });

        // Invalidate old cahced data for this product
        queryClient.invalidateQueries({ queryKey: ['product', productId] });

        // Trigger alert
        toast.success("Product updated successfully!");
      } catch (err: any) {
        console.error('Edit Product failed', err);

        // Get specific error message from response
        const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong trying to Log In.";

        // Trigger alert
        toast.error(errorMessage);
      }
    };
  
    if (isLoading) return <p className="text-center">Loading product...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load product.</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Product Info</h1>

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
        {/* <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            name="img"
            onChange={onChange}
            className="mt-2 w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 cursor-pointer"
          />
        </div> */}

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
