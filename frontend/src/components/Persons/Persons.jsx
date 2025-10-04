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
} from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";

function Persons() {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        dob: "",
        gender: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "United States",
        },
    });

    useEffect(() => {
        fetchPersons();
    }, [currentPage, searchTerm]);

    const fetchPersons = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/persons?page=${currentPage}&search=${searchTerm}`
            );
            setPersons(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            setError("Failed to fetch persons");
            console.error("Error fetching persons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingPerson) {
                await axios.put(`/api/persons/${editingPerson._id}`, formData);
            } else {
                await axios.post("/api/persons", formData);
            }
            setShowModal(false);
            resetForm();
            fetchPersons();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save person");
        }
    };

    const handleEdit = (person) => {
        setEditingPerson(person);
        setFormData({
            fullName: person.fullName,
            email: person.email,
            contactNumber: person.contactNumber,
            dob: format(new Date(person.dob), "yyyy-MM-dd"),
            gender: person.gender,
            address: person.address,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this person?")) {
            try {
                await axios.delete(`/api/persons/${id}`);
                fetchPersons();
            } catch (error) {
                setError("Failed to delete person");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            email: "",
            contactNumber: "",
            dob: "",
            gender: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "United States",
            },
        });
        setEditingPerson(null);
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
                                <h1 className="h3 mb-1">Person Management</h1>
                                <p className="text-muted">
                                    Manage person information and details
                                </p>
                            </div>
                            <Button variant="primary" onClick={handleShowModal}>
                                <i className="bi bi-person-plus me-2"></i>
                                Add Person
                            </Button>
                        </div>
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">All Persons</h5>
                                <InputGroup style={{ width: "300px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search persons..."
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
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Contact</th>
                                                        <th>Date of Birth</th>
                                                        <th>Gender</th>
                                                        <th>Address</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {persons.map((person) => (
                                                        <tr key={person._id}>
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        person.fullName
                                                                    }
                                                                </strong>
                                                            </td>
                                                            <td>
                                                                {person.email}
                                                            </td>
                                                            <td>
                                                                {
                                                                    person.contactNumber
                                                                }
                                                            </td>
                                                            <td>
                                                                {format(
                                                                    new Date(
                                                                        person.dob
                                                                    ),
                                                                    "MMM dd, yyyy"
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge bg-${
                                                                        person.gender ===
                                                                        "Male"
                                                                            ? "primary"
                                                                            : person.gender ===
                                                                              "Female"
                                                                            ? "success"
                                                                            : "secondary"
                                                                    }`}
                                                                >
                                                                    {
                                                                        person.gender
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {
                                                                    person
                                                                        .address
                                                                        .street
                                                                }
                                                                ,{" "}
                                                                {
                                                                    person
                                                                        .address
                                                                        .city
                                                                }
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    className="me-1"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            person
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
                                                                            person._id
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
                            {editingPerson ? "Edit Person" : "Add New Person"}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    fullName: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email *</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
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
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date of Birth *</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    dob: e.target.value,
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
                                        <Form.Label>Gender *</Form.Label>
                                        <Form.Select
                                            value={formData.gender}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    gender: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                                Female
                                            </option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editingPerson ? "Update Person" : "Add Person"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Layout>
    );
}

export default Persons;
