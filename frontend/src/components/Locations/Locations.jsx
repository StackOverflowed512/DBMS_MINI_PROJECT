import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Form,
    Modal,
    Alert,
    Spinner,
    InputGroup,
    Pagination,
    Badge,
} from "react-bootstrap";
import axios from "axios";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        locationName: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "United States",
        },
        capacity: "",
        contactNumber: "",
        operatingHours: {
            open: "",
            close: "",
        },
    });

    useEffect(() => {
        fetchLocations();
    }, [currentPage, searchTerm]);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/locations?page=${currentPage}&search=${searchTerm}`
            );
            setLocations(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            setError("Failed to fetch locations");
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const submitData = {
                ...formData,
                capacity: parseInt(formData.capacity),
            };

            if (editingLocation) {
                await axios.put(
                    `/api/locations/${editingLocation._id}`,
                    submitData
                );
            } else {
                await axios.post("/api/locations", submitData);
            }
            setShowModal(false);
            resetForm();
            fetchLocations();
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to save location"
            );
        }
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setFormData({
            locationName: location.locationName,
            address: location.address,
            capacity: location.capacity.toString(),
            contactNumber: location.contactNumber,
            operatingHours: location.operatingHours,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this location?")) {
            try {
                await axios.delete(`/api/locations/${id}`);
                fetchLocations();
            } catch (error) {
                setError("Failed to delete location");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            locationName: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "United States",
            },
            capacity: "",
            contactNumber: "",
            operatingHours: {
                open: "",
                close: "",
            },
        });
        setEditingLocation(null);
    };

    const handleShowModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const renderPagination = () => {
        if (!pagination.pages || pagination.pages <= 1) return null;

        let items = [];
        for (let number = 1; number <= pagination.pages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => setCurrentPage(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {items}
                    <Pagination.Next
                        disabled={currentPage === pagination.pages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    />
                </Pagination>
            </div>
        );
    };

    return (
        <Layout>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="h3 mb-1">Location Management</h1>
                                <p className="text-muted">
                                    Manage vaccination locations and venues
                                </p>
                            </div>
                            <Button variant="primary" onClick={handleShowModal}>
                                <i className="bi bi-geo-alt-plus me-2"></i>
                                Add Location
                            </Button>
                        </div>
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Vaccination Locations</h5>
                                <InputGroup style={{ width: "300px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search locations..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="search-box"
                                    />
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="loading-spinner">
                                        <Spinner
                                            animation="border"
                                            variant="primary"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <Table hover>
                                                <thead>
                                                    <tr>
                                                        <th>Location Name</th>
                                                        <th>Address</th>
                                                        <th>Capacity</th>
                                                        <th>Contact</th>
                                                        <th>Operating Hours</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {locations.map(
                                                        (location) => (
                                                            <tr
                                                                key={
                                                                    location._id
                                                                }
                                                            >
                                                                <td>
                                                                    <strong>
                                                                        {
                                                                            location.locationName
                                                                        }
                                                                    </strong>
                                                                </td>
                                                                <td>
                                                                    <small>
                                                                        {
                                                                            location
                                                                                .address
                                                                                .street
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            location
                                                                                .address
                                                                                .city
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            location
                                                                                .address
                                                                                .state
                                                                        }{" "}
                                                                        {
                                                                            location
                                                                                .address
                                                                                .zipCode
                                                                        }
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <Badge bg="info">
                                                                        {
                                                                            location.capacity
                                                                        }{" "}
                                                                        people
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        location.contactNumber
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <small>
                                                                        {
                                                                            location
                                                                                .operatingHours
                                                                                .open
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            location
                                                                                .operatingHours
                                                                                .close
                                                                        }
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <Badge
                                                                        bg={
                                                                            location.isActive
                                                                                ? "success"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {location.isActive
                                                                            ? "Active"
                                                                            : "Inactive"}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        className="me-1"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                location
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                location._id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                        {renderPagination()}
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Add/Edit Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editingLocation
                                ? "Edit Location"
                                : "Add New Location"}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Location Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.locationName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            locationName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>

                            <h6 className="mt-4 mb-3">Address Information</h6>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Street Address *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.address.street}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        street: e.target.value,
                                                    },
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.address.city}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        city: e.target.value,
                                                    },
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.address.state}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        state: e.target.value,
                                                    },
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Zip Code *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.address.zipCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        zipCode: e.target.value,
                                                    },
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.address.country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        country: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h6 className="mt-4 mb-3">Location Details</h6>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Capacity *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={formData.capacity}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    capacity: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Contact Number *
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={formData.contactNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    contactNumber:
                                                        e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Opening Time *</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.operatingHours.open}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    operatingHours: {
                                                        ...formData.operatingHours,
                                                        open: e.target.value,
                                                    },
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Closing Time *</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={
                                                formData.operatingHours.close
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    operatingHours: {
                                                        ...formData.operatingHours,
                                                        close: e.target.value,
                                                    },
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editingLocation
                                    ? "Update Location"
                                    : "Add Location"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Layout>
    );
}

export default Locations;
