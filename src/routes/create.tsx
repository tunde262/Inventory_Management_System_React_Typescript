import { useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { fetchAuthStatus, useAuth } from '../hooks/useAuth';
import { createProduct } from '../utils/productActions';
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

export const Route = createFileRoute('/create')({
  beforeLoad: async () => {
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
        to: "/products",
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {

  // State for form data
  const [formData, setFormData] = useState(initialState);

  // User Data
  const { data, isLoading } = useAuth();

  // Cache data
  const queryClient = useQueryClient();
  
  // Destructure the email value from form data
  const { 
    title,
    description,
    category,
    price,
    quantity,
  } = formData;
  
// Function to handle input change
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
  
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Save base64 string as img
          setFormData(prev => ({ ...prev, img: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle form submit
  const onSubmit = async (e:any) => {
    e.preventDefault();

    console.log("user data: ", data?.user);

    const user_id = data?.user?.userId;

    // Check if user is an admin
    if (data?.user?.role !== 'admin') {
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
      if (!user_id) {
        throw new Error('User not authenticated');
      }
      console.log("form input: ", formData);
      await createProduct({ ...formData, user_id });

      // Clear form on success
      setFormData(initialState);

      // Trigger alert
      toast.success("Product updated successfully!");

      // Invalidate old cahced product list data
      queryClient.invalidateQueries({ queryKey: ['products'] });

    } catch (err: any) {
      console.error('Create Product failed', err);

      // Get specific error message from response
      const errorMessage =
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong trying to Create.";

      // Trigger alert
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Create New Product</h1>

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
            min="0"
            name="quantity"
            value={quantity}
            onChange={onChange}
            placeholder="Enter quantity"
            className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Product Image */}
        <div className="mb-6">
          <label htmlFor="img" className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            id="img"
            type="file"
            accept=".jpeg, .jpg, .png, .webp"
            name="img"
            onChange={onChange}
            className="mt-2 w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 cursor-pointer"
          />
        </div>

        {formData.img && (
          <img src={formData.img} alt="Preview" className="w-full max-h-64 object-contain mt-4 rounded-md" />
        )}


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
