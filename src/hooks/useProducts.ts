// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchProducts = async (): Promise<{ products: any[] }> => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No token found. Returning empty product list.");
        return { products: [] };
    }

    console.log("FETCHING PRODUCTS");
    try {
        const res = await axios.get('http://localhost:8080/api/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        console.log("GOT PRODUCTS: ", res.data);
        return {
            products: res.data, // Assuming it's an array
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
        };
    }
};

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // avoid refetching every time the user switches tabs
  });
}
