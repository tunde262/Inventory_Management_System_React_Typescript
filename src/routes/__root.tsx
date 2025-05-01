import { Fragment } from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { isAuthenticated, signOut } from '../utils/auth';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        {!isAuthenticated() ? (
            <Link to="/" className="[&.active]:font-bold">
                Home
            </Link>
        ) : (
            <div onClick={() => signOut()} className="cursor-pointer">
                Logout
            </div>
        )}{' '}
        {isAuthenticated() && (
            <Fragment>
                <Link to="/products" className="[&.active]:font-bold">
                    Products
                </Link>
                <Link to="/create" className="[&.active]:font-bold">
                    Create
                </Link>
            </Fragment>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})