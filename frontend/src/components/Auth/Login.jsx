import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    Form,
    Button,
    Card,
    Container,
    Row,
    Col,
    Alert,
    Spinner,
} from "react-bootstrap";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <Container
            fluid
            className="bg-light min-vh-100 d-flex align-items-center"
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="shadow border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">
                                    Vaccine Tracker
                                </h2>
                                <p className="text-muted">
                                    Sign in to your account
                                </p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="text-muted">
                                    Don't have an account?{" "}
                                    <Link to="/register">Sign up</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
