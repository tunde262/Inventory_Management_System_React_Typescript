import { Fragment } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { isAuthenticated } from '../../utils/auth';

export const Route = createFileRoute('/products/')({
  beforeLoad: () => {
    if(!isAuthenticated()) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Products,
})

function Products() {
  return (
    <Fragment>
      {/* Page Wrapper */}
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        {/* Centered Container */}
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Inventory</h1>
          
          {/* Product List Container */}
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            
            {/* === Product 1 === */}
            <Link
              to="/products/$productId" 
              params={{
                productId: "product-1"
              }}
              className="flex items-center gap-4 p-4 hover:bg-gray-100 transition"
            >
              {/* Product Image */}
              <img
                src="https://iso.500px.com/wp-content/uploads/2015/03/business_cover.jpeg"
                alt="Product 1"
                className="w-20 h-20 object-cover rounded-md"
              />
              {/* Product Title */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Wireless Mouse</h2>
              </div>
            </Link>

            {/* === Product 2 === */}
            <Link
              to="/products/$productId" 
              params={{
                productId: "product-2"
              }}
              className="flex items-center gap-4 p-4 hover:bg-gray-100 transition"
            >
              {/* Product Image */}
              <img
                src="https://iso.500px.com/wp-content/uploads/2015/03/business_cover.jpeg"
                alt="Product 2"
                className="w-20 h-20 object-cover rounded-md"
              />
              {/* Product Title */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Mechanical Keyboard</h2>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </Fragment>
  );
}
