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
import { format } from "date-fns";

function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [persons, setPersons] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [filters, setFilters] = useState({
        person: "",
        vaccine: "",
        location: "",
        status: "",
        date: "",
    });
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        person: "",
        vaccine: "",
        location: "",
        vaccinationDate: "",
        vaccinationTime: "",
        doseNumber: 1,
        status: "scheduled",
        notes: "",
    });

    useEffect(() => {
        fetchSessions();
        fetchDropdownData();
    }, [currentPage, filters]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                ...filters,
            });
            const response = await axios.get(`/api/sessions?${params}`);
            setSessions(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            setError("Failed to fetch sessions");
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [personsRes, vaccinesRes, locationsRes] = await Promise.all([
                axios.get("/api/persons"),
                axios.get("/api/vaccines"),
                axios.get("/api/locations"),
            ]);
            setPersons(personsRes.data.data);
            setVaccines(vaccinesRes.data.data);
            setLocations(locationsRes.data.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const submitData = {
                ...formData,
                doseNumber: parseInt(formData.doseNumber),
            };

            if (editingSession) {
                await axios.put(
                    `/api/sessions/${editingSession._id}`,
                    submitData
                );
            } else {
                await axios.post("/api/sessions", submitData);
            }
            setShowModal(false);
            resetForm();
            fetchSessions();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save session");
        }
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setFormData({
            person: session.person._id,
            vaccine: session.vaccine._id,
            location: session.location._id,
            vaccinationDate: format(
                new Date(session.vaccinationDate),
                "yyyy-MM-dd"
            ),
            vaccinationTime: session.vaccinationTime,
            doseNumber: session.doseNumber,
            status: session.status,
            notes: session.notes || "",
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            try {
                await axios.delete(`/api/sessions/${id}`);
                fetchSessions();
            } catch (error) {
                setError("Failed to delete session");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            person: "",
            vaccine: "",
            location: "",
            vaccinationDate: "",
            vaccinationTime: "",
            doseNumber: 1,
            status: "scheduled",
            notes: "",
        });
        setEditingSession(null);
    };

    const handleShowModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            person: "",
            vaccine: "",
            location: "",
            status: "",
            date: "",
        });
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "completed":
                return "success";
            case "scheduled":
                return "primary";
            case "cancelled":
                return "danger";
            case "no-show":
                return "warning";
            default:
                return "secondary";
        }
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
                                <h1 className="h3 mb-1">
                                    Vaccination Sessions
                                </h1>
                                <p className="text-muted">
                                    Schedule and track vaccination sessions
                                </p>
                            </div>
                            <Button variant="primary" onClick={handleShowModal}>
                                <i className="bi bi-calendar-plus me-2"></i>
                                Schedule Session
                            </Button>
                        </div>
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Filters */}
                <Row className="mb-4">
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white">
                                <h6 className="mb-0">Filters</h6>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Person</Form.Label>
                                            <Form.Select
                                                value={filters.person}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "person",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    All Persons
                                                </option>
                                                {persons.map((person) => (
                                                    <option
                                                        key={person._id}
                                                        value={person._id}
                                                    >
                                                        {person.fullName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Vaccine</Form.Label>
                                            <Form.Select
                                                value={filters.vaccine}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "vaccine",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    All Vaccines
                                                </option>
                                                {vaccines.map((vaccine) => (
                                                    <option
                                                        key={vaccine._id}
                                                        value={vaccine._id}
                                                    >
                                                        {vaccine.vaccineName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Location</Form.Label>
                                            <Form.Select
                                                value={filters.location}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    All Locations
                                                </option>
                                                {locations.map((location) => (
                                                    <option
                                                        key={location._id}
                                                        value={location._id}
                                                    >
                                                        {location.locationName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select
                                                value={filters.status}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    All Status
                                                </option>
                                                <option value="scheduled">
                                                    Scheduled
                                                </option>
                                                <option value="completed">
                                                    Completed
                                                </option>
                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                                <option value="no-show">
                                                    No Show
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={filters.date}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "date",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col
                                        md={1}
                                        className="d-flex align-items-end"
                                    >
                                        <Button
                                            variant="outline-secondary"
                                            onClick={clearFilters}
                                        >
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0">Vaccination Sessions</h5>
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
                                                        <th>Person</th>
                                                        <th>Vaccine</th>
                                                        <th>Location</th>
                                                        <th>Date & Time</th>
                                                        <th>Dose</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sessions.map((session) => (
                                                        <tr key={session._id}>
                                                            <td>
                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            session
                                                                                .person
                                                                                .fullName
                                                                        }
                                                                    </strong>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {
                                                                            session
                                                                                .person
                                                                                .email
                                                                        }
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            session
                                                                                .vaccine
                                                                                .vaccineName
                                                                        }
                                                                    </strong>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {
                                                                            session
                                                                                .vaccine
                                                                                .manufacturer
                                                                        }
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            session
                                                                                .location
                                                                                .locationName
                                                                        }
                                                                    </strong>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {
                                                                            session
                                                                                .location
                                                                                .address
                                                                                .city
                                                                        }
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <strong>
                                                                        {format(
                                                                            new Date(
                                                                                session.vaccinationDate
                                                                            ),
                                                                            "MMM dd, yyyy"
                                                                        )}
                                                                    </strong>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {
                                                                            session.vaccinationTime
                                                                        }
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Badge bg="info">
                                                                    Dose{" "}
                                                                    {
                                                                        session.doseNumber
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Badge
                                                                    bg={getStatusVariant(
                                                                        session.status
                                                                    )}
                                                                >
                                                                    {session.status
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        session.status.slice(
                                                                            1
                                                                        )}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    className="me-1"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            session
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
                                                                            session._id
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
                            {editingSession
                                ? "Edit Session"
                                : "Schedule New Session"}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Person *</Form.Label>
                                        <Form.Select
                                            value={formData.person}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    person: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Person
                                            </option>
                                            {persons.map((person) => (
                                                <option
                                                    key={person._id}
                                                    value={person._id}
                                                >
                                                    {person.fullName} (
                                                    {person.email})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Vaccine *</Form.Label>
                                        <Form.Select
                                            value={formData.vaccine}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    vaccine: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Vaccine
                                            </option>
                                            {vaccines.map((vaccine) => (
                                                <option
                                                    key={vaccine._id}
                                                    value={vaccine._id}
                                                >
                                                    {vaccine.vaccineName} (
                                                    {vaccine.manufacturer})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Location *</Form.Label>
                                        <Form.Select
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    location: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Location
                                            </option>
                                            {locations.map((location) => (
                                                <option
                                                    key={location._id}
                                                    value={location._id}
                                                >
                                                    {location.locationName} -{" "}
                                                    {location.address.city}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dose Number *</Form.Label>
                                        <Form.Select
                                            value={formData.doseNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    doseNumber: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    Dose {num}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Vaccination Date *
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.vaccinationDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    vaccinationDate:
                                                        e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Vaccination Time *
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.vaccinationTime}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    vaccinationTime:
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
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="scheduled">
                                                Scheduled
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                            <option value="no-show">
                                                No Show
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Additional notes about this session..."
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editingSession
                                    ? "Update Session"
                                    : "Schedule Session"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Layout>
    );
}

export default Sessions;
