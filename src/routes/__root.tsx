import { Fragment, useEffect, useState } from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { signOut } from '../utils/auth';
import { fetchAuthStatus } from '../hooks/useAuth';

type AuthState = {
    isAuthenticated: boolean;
    user: any | null;
};

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

    const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const res = await fetchAuthStatus();
                setAuth(res);
            } catch (err) {
                console.error(err);
                setAuth({ isAuthenticated: false, user: null });
            }
        };

        loadAuth();
    }, []);

    return (
        <>
        <div className="p-2 flex gap-2">
            {!auth.isAuthenticated ? (
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>
            ) : (
                <div onClick={() => signOut()} className="cursor-pointer">
                    Logout
                </div>
            )}{' '}
            {auth.isAuthenticated && (
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
    )
}
