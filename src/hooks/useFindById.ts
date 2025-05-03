// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchProductById = async (product_id: String): Promise<{ product: any }> => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No token found. Returning empty product list.");
        return { product: null };
    }

    console.log("FETCHING PRODUCT BY ID");
    try {
        const res = await axios.get(`http://localhost:8080/api/products/${product_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        console.log("GOT PRODUCT DATA : ", res.data);
        return {
            product: res.data, // Assuming it's an array
        };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return {
            product: null,
        };
    }
};

export function useFindById(product_id: String) {
  return useQuery({
    queryKey: ['product', product_id], // Make sure cache is specific to each product
    queryFn: () => fetchProductById(product_id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // avoid refetching every time the user switches tabs
  });
}
