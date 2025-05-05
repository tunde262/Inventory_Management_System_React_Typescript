import { Fragment, useState, useEffect, useRef } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { fetchAuthStatus, useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import Papa from 'papaparse';

// Backend Actions
import { createProduct } from '../../utils/productActions';

// Backend Actions
import { deleteProduct } from '../../utils/productActions';

// Components
import TableRow from '@/components/ProductsTable/TableRow';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const categories = ['All', 'Sedan', 'Coupe', 'SUV', 'Truck', 'Minivan'];

export const Route = createFileRoute('/products/')({
  beforeLoad: async () => {
    const { isAuthenticated } = await fetchAuthStatus();
      if(!isAuthenticated) {
        throw redirect({
          to: "/login",
        });
      }
  },
  component: Products,
})

function Products() {

  // const { data, isLoading, isError } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter Data 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [priceFilter, setPriceFilter] = useState('All');

  // Search Data
  const [searchTerm, setSearchTerm] = useState('');
  const [triggeredSearchTerm, setTriggeredSearchTerm] = useState('');

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Bulk Delete Logic
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);  
  const [loading, setLoading] = useState(false);  

  // Buld Add Logic
  const [uploading, setUploading] = useState(false);

  // User Data
  const { data: userData, isLoading: userLoading } = useAuth();


  // Product Data
  const { data, isLoading, isError } = useProducts(triggeredSearchTerm);

  useEffect(() => {
    if (isError) {
      // Trigger Alert
      toast.error("Failed to load products. Please try again later.");
    }
  }, [isError]);

  if (isLoading) return <p className="text-center">Loading products...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load products.</p>;

  const allProducts = data?.products || [];

  const filteredProducts = selectedCategory === 'All'
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory);

  let filteredByPrice = filteredProducts.filter(product => {
    if (priceFilter === 'under-50') return product.price < 50;
    if (priceFilter === 'under-100') return product.price < 100;
    if (priceFilter === 'under-200') return product.price < 200;
    return true;
  });

    // Sort the filtered products
  let sortedProducts = [...filteredByPrice].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
    if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // -- Bulk Delete Logic --- 

  // Toggle individual row
  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle all rows
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const currentPageIds = filteredByPrice.map(p => p.productId);
      setSelectedProducts(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    setLoading(true);

    try {
        // Use Promise.all to delete in parallel
        await Promise.all(
          selectedProducts.map((id) =>
                deleteProduct({ product_id: parseInt(id) })
            )
        );

        // Clear selection after delete
        setSelectedProducts([]);

        // Trigger Alert
        toast.success(`Bulk delete successful.`);
    } catch (error) {
        console.error("Bulk delete failed:", error);

        toast.error(`Bulk delete failed.`);
    } finally {
        setLoading(false);
    }
  };

  // -- Bulk Delete Logic

  // -- Bulk Add Logic

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    console.log("user data: ", userData?.user);

    const user_id = userData?.user?.userId;

    // Check if user is an admin
    if (userData?.user?.role !== 'admin') {
      toast.error("Must be an admin to create stuff.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedItems = results.data as any[];
        try {

          let successCount = 0;

          for (const item of parsedItems) {
            // Optionally validate/convert fields
            const productData = {
              title: item.title,
              description: item.description,
              category: item.category,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              img: item.img,
              user_id: user_id,
            };

            await createProduct(productData);
            successCount++;
          }
  
          toast.success(`Uploaded ${successCount} products from CSV`);
        } catch (err: any) {
          console.error('Bulk Create Products failed', err);

          // Get specific error message from response
          const errorMessage =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to process CSV file.";

          // Trigger alert
          toast.error(errorMessage);
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        toast.error("CSV parsing failed.");
        setUploading(false);
      }
    });
  };  

  // -- END: Bulk Add Logic
    
  return (
    <Fragment>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Inventory</h1>

          {/* Search Input */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
            <input
              type="search"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setTriggeredSearchTerm(searchTerm);
                  setCurrentPage(1);
                }
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
            />
          </div>

          {/* Filters Row */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Filter by Category */}
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1 text-sm font-medium text-gray-700">Sort</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 w-full"
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

            {/* Filter by Price */}
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="under-50">Under $50</option>
                <option value="under-100">Under $100</option>
                <option value="under-200">Under $200</option>
              </select>
            </div>
          </div>


          {/* Product Table */}
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="flex items-center justify-between mb-4">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleCsvUpload}
            />
            <Button
              variant="outline"
              className="ml-2"
              disabled={uploading}
              onClick={handleClick}
            >
              {uploading && (
                <span>Loading...</span>
              )}
              {uploading ? "Uploading..." : "Upload CSV"}
            </Button>

              <div>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="mr-2"
                />
                <label>Select All</label>
              </div>

              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : `Delete ${selectedProducts.length} selected`}
                </button>
              )}
            </div>

            {/* Table Rows */}
            {paginatedProducts.map(product => (
              <div key={product.productId}>
                <TableRow product={product} isSelected={selectedProducts.includes(product.productId)} onToggleSelect={() => toggleSelectProduct(product.productId)} />
              </div>
            ))}

            {/* If Empty table show this content */}
            {paginatedProducts.length === 0 && (
              <p className="p-4 text-center text-gray-500">No products found.</p>
            )}

            {sortedProducts.length > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <button
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === index + 1
                              ? "bg-gray-800 text-white cursor-pointer"
                              : "bg-white text-gray-700 border border-gray-300 cursor-pointer"
                          }`}
                        >
                          {index + 1}
                        </button>
                      </PaginationItem>
                    ))}
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationContent>
                </Pagination>
              </div>
            )}

          </div>
        </div>
      </div>
    </Fragment>
  );
}
