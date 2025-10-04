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

function Vaccines() {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingVaccine, setEditingVaccine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        vaccineName: "",
        manufacturer: "",
        description: "",
        price: "",
        dosesRequired: 1,
    });

    useEffect(() => {
        fetchVaccines();
    }, [currentPage, searchTerm]);

    const fetchVaccines = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/vaccines?page=${currentPage}&search=${searchTerm}`
            );
            setVaccines(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            setError("Failed to fetch vaccines");
            console.error("Error fetching vaccines:", error);
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
                price: parseFloat(formData.price),
                dosesRequired: parseInt(formData.dosesRequired),
            };

            if (editingVaccine) {
                await axios.put(
                    `/api/vaccines/${editingVaccine._id}`,
                    submitData
                );
            } else {
                await axios.post("/api/vaccines", submitData);
            }
            setShowModal(false);
            resetForm();
            fetchVaccines();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save vaccine");
        }
    };

    const handleEdit = (vaccine) => {
        setEditingVaccine(vaccine);
        setFormData({
            vaccineName: vaccine.vaccineName,
            manufacturer: vaccine.manufacturer,
            description: vaccine.description,
            price: vaccine.price.toString(),
            dosesRequired: vaccine.dosesRequired,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vaccine?")) {
            try {
                await axios.delete(`/api/vaccines/${id}`);
                fetchVaccines();
            } catch (error) {
                setError("Failed to delete vaccine");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            vaccineName: "",
            manufacturer: "",
            description: "",
            price: "",
            dosesRequired: 1,
        });
        setEditingVaccine(null);
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
                                <h1 className="h3 mb-1">Vaccine Management</h1>
                                <p className="text-muted">
                                    Manage vaccine catalog and information
                                </p>
                            </div>
                            <Button variant="primary" onClick={handleShowModal}>
                                <i className="bi bi-shield-plus me-2"></i>
                                Add Vaccine
                            </Button>
                        </div>
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Vaccine Catalog</h5>
                                <InputGroup style={{ width: "300px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search vaccines..."
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
                                                        <th>Vaccine Name</th>
                                                        <th>Manufacturer</th>
                                                        <th>Description</th>
                                                        <th>Price</th>
                                                        <th>Doses Required</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vaccines.map((vaccine) => (
                                                        <tr key={vaccine._id}>
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        vaccine.vaccineName
                                                                    }
                                                                </strong>
                                                            </td>
                                                            <td>
                                                                {
                                                                    vaccine.manufacturer
                                                                }
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    {vaccine
                                                                        .description
                                                                        .length >
                                                                    50
                                                                        ? `${vaccine.description.substring(
                                                                              0,
                                                                              50
                                                                          )}...`
                                                                        : vaccine.description}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <Badge
                                                                    bg="success"
                                                                    className="fs-6"
                                                                >
                                                                    $
                                                                    {
                                                                        vaccine.price
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Badge bg="info">
                                                                    {
                                                                        vaccine.dosesRequired
                                                                    }{" "}
                                                                    dose
                                                                    {vaccine.dosesRequired >
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Badge
                                                                    bg={
                                                                        vaccine.isActive
                                                                            ? "success"
                                                                            : "secondary"
                                                                    }
                                                                >
                                                                    {vaccine.isActive
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
                                                                            vaccine
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
                                                                            vaccine._id
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
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
                            {editingVaccine
                                ? "Edit Vaccine"
                                : "Add New Vaccine"}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Vaccine Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.vaccineName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    vaccineName: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Manufacturer *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.manufacturer}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    manufacturer:
                                                        e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Description *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price ($) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Doses Required *
                                        </Form.Label>
                                        <Form.Select
                                            value={formData.dosesRequired}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    dosesRequired:
                                                        e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} dose
                                                    {num > 1 ? "s" : ""}
                                                </option>
                                            ))}
                                        </Form.Select>
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
                                {editingVaccine
                                    ? "Update Vaccine"
                                    : "Add Vaccine"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Layout>
    );
}

export default Vaccines;
