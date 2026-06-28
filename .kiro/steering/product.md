# Product: Vaccine Tracker System

A full-stack web application for managing vaccination records. It allows administrators to track persons, vaccines, vaccination locations, and schedule/manage vaccination sessions.

## Core Entities

- **Persons** – individuals registered for vaccination (with contact and address info)
- **Vaccines** – available vaccines (name, manufacturer, dose count, price, active status)
- **Locations** – vaccination centers/clinics
- **Sessions** – vaccination appointments linking a person, vaccine, location, date, dose number, and status

## Session Statuses
`scheduled` | `completed` | `cancelled` | `no-show`

## Access Model
All data management routes require authentication. Users register/login to receive a JWT token. The dashboard provides an overview with stats and quick-action shortcuts.
