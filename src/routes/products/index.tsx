import { Fragment, useState } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { fetchAuthStatus, useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';

const categories = ['All', 'Electronics', 'Home'];

export const Route = createFileRoute('/products/')({
  beforeLoad: async () => {
    const { isAuthenticated } = await fetchAuthStatus();
      if(!isAuthenticated) {
        throw redirect({
          to: "/",
        });
      }
  },
  component: Products,
})

function Products() {

  // const { data, isLoading, isError } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading, isError } = useProducts();

  if (isLoading) return <p className="text-center">Loading products...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load products.</p>;

  const allProducts = data?.products || [];

  const filteredProducts = selectedCategory === 'All'
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory);

  // if (isError || !data?.isAuthenticated) {
  //   // If not authenticated, redirect to home page or login
  //   window.location.href = '/'; // Or navigate('/login') depending on your flow
  //   return null; // Don't render anything else
  // }
    
  return (
    <Fragment>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Inventory</h1>

          {/* Filter Dropdown */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Category</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Sort by</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">None</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {/* Product List */}
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <Link
                to="/products/$productId" 
                params={{
                  productId: product.productId
                }}
                key={product.productId}
                className="flex items-center gap-4 p-4 hover:bg-gray-100 transition"
              >
                <div
                  key={product.productId}
                  className="flex items-center justify-between gap-4 w-full p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                    />
                    <div className="cursor-pointer">
                      <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
      
                  <div className="flex gap-2">
                    <button
                      // onClick={() => navigate(`/products/edit/${product.productId}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      // onClick={() => handleDelete(product.productId)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            {filteredProducts.length === 0 && (
              <p className="p-4 text-center text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
