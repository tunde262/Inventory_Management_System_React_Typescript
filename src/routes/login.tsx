import { Fragment, useState } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { isAuthenticated, signIn } from '../utils/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if(isAuthenticated()) {
      throw redirect({
        to: "/products",
      });
    }
  },
  component: RouteComponent,
})

// Initial State
const initialState = {
  email: '',
  password: ''
}

function RouteComponent() {
  // State for form data
  const [formData, setFormData] = useState(initialState);

  // Destructure the email value from form data
  const { email, password } = formData;

  // Function to handle input change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value});

  return (
    <Fragment>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Log In
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button onClick={() => signIn()} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
            Log In
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create an account →
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
