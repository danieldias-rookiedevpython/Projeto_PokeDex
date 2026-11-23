import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
}