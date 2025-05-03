import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <input
        type="text"
        placeholder="Search by name or description..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
      />

      <div className="flex gap-4 mb-6">
        <select
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="az">Sort: A-Z</option>
          <option value="za">Z-A</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

        <ul className="space-y-4">
            <li
     
              className="border p-4 rounded-md shadow-sm hover:shadow transition"
            >
              <h3 className="text-lg font-semibold">Title</h3>
              <p className="text-sm text-gray-400 mt-1">Category: Food</p>
            </li>
        </ul>
    </div>
  )
}
