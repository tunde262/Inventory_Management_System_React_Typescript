// src/utils/auth.ts
import axios from 'axios';

export async function signIn({ email, password }: { email: string; password: string }) {
    console.log("SIGNING IN")
  try {
    const res = await axios.post('http://localhost:8080/api/users/login', { email, password });
    console.log("GOT TOKEN: ", res.data.token);
    localStorage.setItem('token', res.data.token);
    window.location.href = '/products';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export async function register({ userName, email, password }: { userName: string; email: string; password: string }) {
    console.log("SIGNING UP")
  try {
    const res = await axios.post('http://localhost:8080/api/users/register', { userName, email, password });
    console.log("GOT TOKEN: ", res.data.token);
    localStorage.setItem('token', res.data.token);
    window.location.href = '/products';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export function signOut() {
  localStorage.removeItem('token');
  window.location.href = '/';
}
