import axios from 'axios';

export async function createProduct({ 
    title,
    description,
    category,
    price,
    quantity,
    user_id,
    img
  }: { 
    title: string; 
    description: string; 
    category: string; 
    price: number; 
    quantity: number;
    user_id?: number; // if needed
    img: string;
}) {
    console.log("ABOUT TO CREATE PRODUCT")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    const res = await axios.post('http://localhost:8080/api/products', { 
        title,
        description,
        category,
        price,
        quantity, 
        user_id,
        img
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("PRODUCT DATA: ", res.data);
    // window.location.href = '/products';

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export async function editProduct({ 
    title,
    description,
    category,
    price,
    quantity,
    product_id,
  }: { 
    title: string; 
    description: string; 
    category: string; 
    price: number; 
    quantity: number;
    product_id?: number; // if needed
}) {
    console.log("ABOUT TO EDIT PRODUCT")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    const res = await axios.put(`http://localhost:8080/api/products/${product_id}`, { 
        title,
        description,
        category,
        price,
        quantity
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("PRODUCT UPDATED, DATA: ", res.data);
    // window.location.href = '/products';

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export async function deleteProduct({ 
    product_id,
  }: { 
    product_id?: number; // if needed
}) {
    console.log("ABOUT TO DELETE PRODUCT")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    const res = await axios.delete(`http://localhost:8080/api/products/${product_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("PRODUCT DELETED, DATA: ", res.data);
    // window.location.href = '/products';

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Request failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}
