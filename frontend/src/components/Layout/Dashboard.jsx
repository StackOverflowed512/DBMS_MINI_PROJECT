import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Layout from "./Layout";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Dashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: "Total Persons",
            value: "1,234",
            color: "primary",
            icon: "bi-people",
            link: "/persons",
        },
        {
            title: "Vaccines Available",
            value: "15",
            color: "success",
            icon: "bi-shield-plus",
            link: "/vaccines",
        },
        {
            title: "Locations",
            value: "8",
            color: "info",
            icon: "bi-geo-alt",
            link: "/locations",
        },
        {
            title: "Sessions Today",
            value: "45",
            color: "warning",
            icon: "bi-calendar-check",
            link: "/sessions",
        },
    ];

    return (
        <Layout>
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 mb-1">Dashboard</h1>
                        <p className="text-muted">
                            Welcome back, {user?.username}!
                        </p>
                    </div>
                </div>

                <Row className="g-4 mb-4">
                    {stats.map((stat, index) => (
                        <Col xs={12} sm={6} lg={3} key={index}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="d-flex align-items-center">
                                    <div
                                        className={`bg-${stat.color} bg-opacity-10 rounded p-3 me-3`}
                                    >
                                        <i
                                            className={`${stat.icon} text-${stat.color} fs-4`}
                                        ></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-1">
                                            {stat.title}
                                        </h5>
                                        <h2
                                            className={`text-${stat.color} mb-0`}
                                        >
                                            {stat.value}
                                        </h2>
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-transparent border-0">
                                    <Button
                                        as={Link}
                                        to={stat.link}
                                        variant="outline-primary"
                                        size="sm"
                                        className="w-100"
                                    >
                                        View Details
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="g-4">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0">
                                    Recent Vaccination Sessions
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Person</th>
                                                <th>Vaccine</th>
                                                <th>Location</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>John Doe</td>
                                                <td>COVID-19 Vaccine</td>
                                                <td>City Health Center</td>
                                                <td>2023-10-15</td>
                                                <td>
                                                    <span className="badge bg-success">
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Jane Smith</td>
                                                <td>Flu Vaccine</td>
                                                <td>Community Hospital</td>
                                                <td>2023-10-16</td>
                                                <td>
                                                    <span className="badge bg-warning">
                                                        Scheduled
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0">Quick Actions</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-grid gap-2">
                                    <Button
                                        as={Link}
                                        to="/persons/new"
                                        variant="primary"
                                        className="text-start"
                                    >
                                        <i className="bi bi-person-plus me-2"></i>
                                        Add New Person
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/sessions/new"
                                        variant="success"
                                        className="text-start"
                                    >
                                        <i className="bi bi-calendar-plus me-2"></i>
                                        Schedule Session
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/vaccines"
                                        variant="info"
                                        className="text-start"
                                    >
                                        <i className="bi bi-shield-plus me-2"></i>
                                        Manage Vaccines
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/locations"
                                        variant="warning"
                                        className="text-start"
                                    >
                                        <i className="bi bi-geo-alt me-2"></i>
                                        View Locations
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export default Dashboard;
