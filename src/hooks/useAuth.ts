// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchAuthStatus = async (): Promise<{ isAuthenticated: boolean; user: any | null }> => {
    const token = localStorage.getItem('token');
    if (!token) return { isAuthenticated: false, user: null };

    console.log("CHECKING AUTH STATUS");
    try {
        const res = await axios.get('http://localhost:8080/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true 
        });

        console.log("GOT USER DATA: ", res.data);

        return {
            isAuthenticated: true,
            user: res.data,
        };
    } catch (error) {

        // Clear token
        localStorage.removeItem('token');

        return {
            isAuthenticated: false,
            user: null,
        };
    }
};

export function useAuth() {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: fetchAuthStatus,
    staleTime: 1000 * 60 * 5,
    retry: false, // Avoid retrying on 401 (unauthorized) errors
    refetchOnWindowFocus: false, // avoid refetching every time the user switches tabs
  });
}
