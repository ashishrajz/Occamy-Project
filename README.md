🧭 Occamy
Field Force Intelligence & Analytics Platform

Occamy is a field activity tracking and analytics platform designed for agri-distribution and rural sales teams.
It enables distributors to log real-world field activities with location proof, while giving admins powerful dashboards, exports, and AI-driven insights.

This project focuses on production realism, not just UI polish.

✨ Key Highlights

📍 GPS-verified field activity logging

🧑‍🌾 Distributor-first mobile UX

📊 Admin dashboards with filters & exports

🤖 AI-powered performance summaries

🌐 Multi-language support (EN / HI / MR)

🔐 Role-based access control

🧑‍🌾 Distributor Application
What Distributors Can Do

Start and end daily field shifts

Track live GPS location

Log field activities:

One-on-one meetings

Group meetings

Sample distribution

Sales

GPS checkpoints

Upload photos as proof of activity

Automatically close unfinished previous days

Use the app in low-connectivity environments

Work in their preferred language

UX Design Goals

Mobile-first

Minimal typing

Large touch targets

Works reliably on low-end devices

🧑‍💼 Admin Dashboard
Admin Capabilities

View organization-wide activity data

Filter by:

Date range (Today / Month / Year)

State

District

Visualize:

Meetings, samples, sales

B2B vs B2C split

Product performance

Distributor efficiency

Download filtered data as CSV

Generate AI-based summaries for quick insights

🧠 Core Domain Models
1. User

Roles supported:

ADMIN – full access

DISTRIBUTOR – field operations

FARMER – contact entity (no login)

Includes:

Language preference

Region (state, district)

2. DistributorDay

Represents one working day for a distributor.

Tracks:

Start time & location

End time & location

Total distance travelled

Prevents duplicate active days

Auto-closes previous unfinished days

3. Activity (Single Source of Truth)

Supported activity types:

MEETING_ONE_ON_ONE

MEETING_GROUP

SAMPLE_DISTRIBUTION

SALE

LOCATION_PING

Each activity stores:

Distributor & day reference

GPS coordinates

Reverse-geocoded location (state/district/village)

Human-readable address

Photos (optional)

Notes

Type-specific metadata (meeting / sale / sample)

🌍 Location & Geo Handling
How Location Is Captured

Frontend captures raw GPS (lat, lng)

Backend performs reverse geocoding

Structured geo is stored:

state

district

village

Human-readable address stored separately

Why Backend Reverse-Geocoding?

Prevents client spoofing

Ensures consistent data format

Keeps DB independent of UI language

Guarantees map compatibility

🌐 Internationalization (i18n)

Supported languages:

English (en)

Hindi (hi)

Marathi (mr)

Design principles:

All UI text comes from JSON files

Database stores language-neutral enums

Translation keys map enums → readable labels

Safe fallbacks for missing translations

🤖 AI Analytics

Admins can generate AI summaries such as:

Distributor productivity trends

High-potential meetings

Sales intensity by region

Operational gaps

AI Design Philosophy

AI is assistive, not authoritative

System works even if AI fails

Uses free-tier APIs where possible

No hard dependency on paid services

📦 CSV Export

Server-side generation

Respects all applied filters

Admin-only access

Excel / Google Sheets friendly

Designed for reporting & audits

🛠 Tech Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

next-intl (i18n)

Lucide Icons

Backend

Next.js API Routes

MongoDB + Mongoose

JWT authentication

Role-based authorization

Integrations

Cloudinary (image uploads)

Reverse-geocoding API

Free-tier LLM APIs

🌱 Data Seeding (Demo-Ready)

A dedicated seeding system generates realistic demo data:

6+ distributors

Multiple working days per distributor

Dense activity logs

Multiple states & districts

Mixed activity types

Purpose:

Dashboards look realistic

Maps render correctly

AI summaries have meaningful input

🔐 Authentication & Security

Cookie-based JWT auth

HTTP-only secure cookies

Server-side role enforcement

Admin-only protected routes

Distributor routes fully isolated

⚖️ Assumptions & Trade-offs
1. Accuracy vs Cost

Used free reverse-geocoding APIs

Trade-off: occasional naming inconsistencies

Mitigation: raw GPS always stored

2. No Real-Time Live Tracking

Location stored per activity, not streamed

Reduces battery drain & backend load

Better suited for rural field conditions

3. AI Is Advisory Only

No automation based on AI output

Prevents incorrect business decisions

Keeps system deterministic

4. OTP Login Not Enforced

SMS providers require verification/payments

JWT login retained for reliability

OTP planned for future production use

5. Enums Over Dynamic Config

Products & activity types are enums

Trade-off: less runtime flexibility

Benefit: strong data integrity & simpler analytics

🚀 Future Improvements

Offline queue sync

Route replay on maps

Supervisor roles

Verified OTP login

Advanced AI trend comparisons

Exportable PDF reports

🧠 Author Notes

This project was intentionally designed to demonstrate:

Real-world backend correctness

Field constraints (GPS, network, devices)

Clean schema design

Production-oriented thinking

It is resume-ready, interview-ready, and demo-ready.
