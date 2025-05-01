import { Fragment } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {

    return (
      <Fragment> 
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to my app</h1>

            <div className="flex flex-col space-y-4">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </Fragment>

    )
}

export default RouteComponent;