Occamy – Field Force Intelligence Platform

Occamy is a field activity tracking and analytics platform designed for agri-distribution and rural sales operations.
It enables distributors to log real-world field activities (meetings, samples, sales, GPS pings) with location proof, while providing admins with data-driven dashboards, CSV exports, and AI-powered summaries.

This project is built to demonstrate production-grade system design, not just UI.

🚀 Core Features
👨‍🌾 Distributor App

Start / end daily field shifts

Live GPS tracking with reverse geocoding

Log field activities:

One-on-one meetings

Group meetings

Sample distribution

Sales

Location checkpoints

Photo uploads as activity proof

Automatic day closure if previous day was not ended

Offline-safe, mobile-first UX

Multilingual UI (English, Hindi, Marathi)

🧑‍💼 Admin Dashboard

View aggregated distributor activity

Filter by:

Date range (Today / Month / Year)

State

District

Download filtered data as CSV

Generate AI summaries of field performance

Real-time operational intelligence

🧠 Domain Model Overview
User Roles
Role	Description
ADMIN	Full access to dashboards, analytics & exports
DISTRIBUTOR	Logs field activities
FARMER	Contact entity (no login)
Distributor Day

Represents one working day for a distributor.

Tracks:

Start / end time

Start / end location

Total distance travelled

Prevents duplicate days

Auto-closes previous unfinished days

Activity (Core Entity)

Single source of truth for all field actions.

Supported types:

MEETING_ONE_ON_ONE

MEETING_GROUP

SAMPLE_DISTRIBUTION

SALE

LOCATION_PING

Each activity includes:

GPS coordinates

Reverse-geocoded location

Optional photos

Notes

Contextual metadata based on activity type

🧩 Tech Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

next-intl for i18n

Lucide Icons

Mobile-first design

Backend

Next.js API Routes

MongoDB + Mongoose

JWT authentication

Role-based access control

Cloudinary for image uploads

External reverse-geocoding API

AI & Analytics

AI summaries via free-tier LLM APIs

Fallback-safe prompt construction

CSV generation server-side

🌍 Internationalization (i18n)

Supported languages:

English (en)

Hindi (hi)

Marathi (mr)

Design principles:

All user-facing text comes from JSON

Enum values stored in DB remain language-agnostic

UI translations mapped via keys (e.g. meetingKind.ONE_ON_ONE)

🔐 Authentication & Authorization

Cookie-based JWT auth

Secure HTTP-only cookies

Middleware role checks

Admin-only routes enforced server-side

Distributor routes isolated

📦 Data Seeding

A dedicated scripts/seed folder is used to generate realistic demo data:

6+ distributors

Multiple working days

Dense activity logs across states/districts

Mixed activity types

Realistic geolocation spread

This allows dashboards, maps, and analytics to appear production-real, not empty.

🗺️ Location Handling (Important)
How location works

Frontend captures:

lat, lng

Backend:

Performs reverse geocoding

Stores structured geo (state, district, village)

Stores human-readable address separately

Why backend reverse-geocoding?

Prevents client spoofing

Ensures consistent location format

Avoids UI language affecting stored data

📊 CSV Export

Server-side generation

Respects applied filters

Admin-only

Optimized for Excel / Sheets import

🤖 AI Analytics

Admins can generate summaries such as:

Distributor productivity trends

Sales intensity by region

High-potential meetings

Operational gaps

AI is non-blocking:

If AI fails → app still works

No hard dependency on paid APIs

⚖️ Assumptions & Trade-offs
1. Accuracy vs Cost

Used free reverse-geocoding APIs

Trade-off: occasional naming inconsistency

Mitigation: raw coordinates always stored

2. No real-time map streaming

Location stored per activity, not live tracking

Chosen to reduce battery drain and backend load

3. AI summaries are advisory

Not used for decision automation

Avoids over-reliance on LLM output

4. OTP login skipped in demo

SMS providers impose verification/paywalls

JWT login retained for stability

5. Enums over dynamic configs

Product & activity enums hard-coded

Trade-off: less flexibility

Benefit: data integrity & simpler analytics

🧪 Production Readiness Notes

Defensive backend validation

Server-side geo verification

Graceful failures

Mobile network tolerant UX

Scalable schema design

📌 Future Improvements

Real-time map playback

Offline queue sync

Supervisor roles

OTP-based auth with verified SMS provider

Advanced AI insights with historical comparison

👨‍💻 Author Notes

This project was intentionally built to reflect:

Real-world constraints

Field conditions

Backend-first correctness

Resume & interview readiness
