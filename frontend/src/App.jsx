import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Layout/Dashboard";
import Persons from "./components/Persons/Persons";
import Vaccines from "./components/Vaccines/Vaccines";
import Locations from "./components/Locations/Locations";
import Sessions from "./components/Sessions/Sessions";
import "./index.css";

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/persons"
                            element={
                                <ProtectedRoute>
                                    <Persons />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/persons/new"
                            element={
                                <ProtectedRoute>
                                    <Persons />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vaccines"
                            element={
                                <ProtectedRoute>
                                    <Vaccines />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/locations"
                            element={
                                <ProtectedRoute>
                                    <Locations />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/sessions"
                            element={
                                <ProtectedRoute>
                                    <Sessions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/sessions/new"
                            element={
                                <ProtectedRoute>
                                    <Sessions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" />}
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
