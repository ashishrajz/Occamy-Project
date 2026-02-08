🧭 AgriTrack
Field Force Intelligence & Analytics Platform

Occamy is a field activity tracking and analytics platform built for agri-distribution and rural sales teams.
It replaces unstructured, error-prone WhatsApp workflows with GPS-verified activity logging, analytics dashboards, and AI-driven insights.

Distributors record real-world activities with location proof, while admins gain clear visibility, exports, and summaries for faster decision-making.

✨ Key Highlights

📍 GPS-verified activity logging

🧑‍🌾 Distributor-first mobile UX

📊 Admin analytics dashboards

🤖 AI-generated summaries

🌐 Multi-language support (English / Hindi / Marathi)

🔐 Role-based access control

📱 Fully responsive (mobile & desktop)

📱 Application Overview

Occamy is a fully responsive web application, optimized for low-end Android devices and rural connectivity conditions.
It is designed to be simple, fast, and usable by low-tech users such as farmers and field distributors.

Authentication & Roles

Secure login and registration using JWT authentication, with three roles:

ADMIN

DISTRIBUTOR

FARMER

Each role has access only to relevant features.

🌐 Language Support (i18n)

Users can select their preferred language during login/registration via the navbar.

Supported languages:

English (en)

Hindi (hi)

Marathi (mr)

Design Principles

UI text loaded from JSON files

Database stores enums, not translated strings

Safe fallbacks for missing keys

Language-agnostic backend

🧑‍🌾 Distributor Application
What Distributors Can Do

Start and end daily field shifts

Track live GPS-verified locations

Log activities:

One-on-one meetings

Group meetings

Sample distribution

Sales

GPS checkpoints

Upload photos as proof

Auto-close unfinished previous days

Work reliably in low-connectivity environments

Distributor Workflow
1. Start Day

Distributor clicks “Start Day”

Attendance is marked

Live GPS location is captured

Exact location (road, locality, district) is stored and viewable later on the map

2. Daily Reporting

Log reports for:

Meetings

Sales

Samples

Product data (sample set) is sourced from the official Occamy website

Designed to be more structured and efficient than WhatsApp-based reporting

3. Checkpoints

Mark checkpoints during the day

Submit survey reports and farmer feedback

Location is auto-detected

4. End Day & Summary

Click “End Day” to finish work

View detailed daily summary in Profile

Calendar view:

Green dates = active workdays

Click a date to explore location-wise and activity-wise details

🧑‍💼 Admin Dashboard

The Admin Dashboard provides complete organizational visibility using numbers, charts, and AI summaries.

Admin Capabilities

View organization-wide metrics

Filter by:

Date range (Today / Month / Year)

State

District

Visualize:

Meetings, samples, sales

B2B vs B2C split

Product performance

Distributor efficiency

Export filtered data as CSV / Excel

Generate AI-based summaries to save review time

Visual dashboards significantly reduce manual workload compared to WhatsApp flows.

🤖 AI Analytics

Admins can generate AI-assisted summaries such as:

Productivity summaries

Regional performance insights

Distributor behavior trends

AI is advisory only — it provides insights, not automated decisions.

🧠 Core Domain Models
User

Roles:

ADMIN

DISTRIBUTOR

FARMER

Includes:

Language preference

Region (state, district)

DistributorDay

Represents one working day for a distributor.

Tracks:

Start / end time

Start / end location

Total distance travelled

Ensures:

No duplicate active days

Activity (Single Source of Truth)

Types:

MEETING_ONE_ON_ONE

MEETING_GROUP

SAMPLE_DISTRIBUTION

SALE

LOCATION_PING

Stores:

Distributor & day reference

GPS coordinates

Structured geo (state, district, village)

Human-readable address

Photos & notes

Type-specific metadata

🌍 Location & Geo Handling
How Location Is Stored

Frontend captures raw GPS (lat, lng)

Backend performs reverse geocoding

Structured geo and readable address stored separately

Why Backend Reverse Geocoding

Prevents client-side spoofing

Ensures consistent DB structure

Language-agnostic storage

Reliable map rendering

🧑‍🌾 Farmer Experience

Farmers can view all products with detailed information

Language selection available

Product pages show:

Sample pricing

Dealer contact details (sourced from Occamy website)

Feedback & review form collects farmer insights

⚖️ Assumptions & Trade-Offs
Accuracy vs Cost

Free reverse-geocoding APIs used

Raw GPS always stored as fallback

No Live Tracking

Activity-based GPS capture

Saves battery and backend cost

AI Is Non-Authoritative

Insight only, no automation

OTP Login Deferred

SMS providers require verification/payment

JWT retained for reliability

Enums Over Dynamic Config

Strong data integrity

Simpler analytics and queries

🚀 Future Improvements

Offline sync queue

Route replay on maps

Supervisor roles

OTP-based login

Advanced AI comparisons

PDF exports
