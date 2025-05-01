import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Create New Product</h1>

      <form onSubmit={() => null} className="bg-white p-6 shadow-md rounded-lg">
        {/* Product Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Product Title
          </label>
          <input
            id="title"
            type="text"
            // value={title}
            onChange={() => null}
            placeholder="Enter product title"
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
            onChange={() => null}
            className="mt-2 w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 cursor-pointer"
          />
        </div>

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
