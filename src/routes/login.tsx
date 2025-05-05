import { Fragment, useState } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { signIn } from '../utils/auth';
import { fetchAuthStatus } from '../hooks/useAuth';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { isAuthenticated } = await fetchAuthStatus();
    if(isAuthenticated) {
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

  // Handle form submit
  const onSubmit = async () => {

    console.log("About to attempt Log In");

    // -- Form validation for required input fields --
    const requiredFields = [
      { name: "email", value: email, label: "Email" },
      { name: "password", value: password, label: "Password" },
    ];
  
    for (let field of requiredFields) {
      if (field.value === '') {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    // -- END: Form validation for required input fields --

    try {
      await signIn({ email, password });
      // Redirected inside signIn() after token is saved

      // Trigger alert
      toast.success("Redirecting...");
    } catch (err: any) {
      console.error('Registration failed', err);

      // Get specific error message from response
      const errorMessage =
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong trying to Log In.";

      // Trigger alert
      toast.error(errorMessage);
    }
  };

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

          <button onClick={() => onSubmit()} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
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
