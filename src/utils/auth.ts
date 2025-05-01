export function isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true";
}

export function signIn() {
    localStorage.setItem("isAuthenticated", "true");
    window.location.href = "/products";
}

export function signOut() {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
}

