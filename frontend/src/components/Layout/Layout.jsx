import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
        { path: "/persons", label: "Persons", icon: "bi-people" },
        { path: "/vaccines", label: "Vaccines", icon: "bi-shield-plus" },
        { path: "/locations", label: "Locations", icon: "bi-geo-alt" },
        { path: "/sessions", label: "Sessions", icon: "bi-calendar-check" },
    ];

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar" style={{ width: "250px" }}>
                <div className="p-3">
                    <h5 className="text-white mb-0">Vaccine Tracker</h5>
                    <small className="text-white-50">Management System</small>
                </div>
                <Nav className="flex-column p-3">
                    {navItems.map((item) => (
                        <Nav.Link
                            key={item.path}
                            href={item.path}
                            className={`text-white mb-2 ${
                                location.pathname === item.path ? "active" : ""
                            }`}
                        >
                            <i className={item.icon}></i>
                            {item.label}
                        </Nav.Link>
                    ))}
                </Nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1">
                {/* Top Navigation */}
                <Navbar bg="white" expand="lg" className="shadow-sm">
                    <Container fluid>
                        <Navbar.Brand href="#">
                            <h4 className="mb-0 text-primary">
                                {navItems.find(
                                    (item) => item.path === location.pathname
                                )?.label || "Dashboard"}
                            </h4>
                        </Navbar.Brand>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text className="me-3">
                                Signed in as: <strong>{user?.username}</strong>
                            </Navbar.Text>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Page Content */}
                <main className="p-4">{children}</main>
            </div>
        </div>
    );
}

export default Layout;
