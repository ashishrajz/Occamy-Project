🧭 Occamy
Field Force Intelligence & Analytics Platform

Occamy is a field activity tracking and analytics platform designed for agri-distribution and rural sales teams.

It enables distributors to log real-world activities with GPS proof, while admins get dashboards, exports, and AI-driven insights.

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
✨ KEY HIGHLIGHTS
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛

📍 GPS-verified activity logging

🧑‍🌾 Distributor-first mobile UX

📊 Admin analytics dashboards

🤖 AI-generated summaries

🌐 Multi-language support (EN / HI / MR)

🔐 Role-based access control

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🧑‍🌾 DISTRIBUTOR APPLICATION
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
What Distributors Can Do

Start / end daily field shifts

Track live GPS coordinates

Log activities:

One-on-one meetings

Group meetings

Sample distribution

Sales

GPS checkpoints

Upload photos as proof

Auto-close unfinished previous days

Work in low-connectivity environments

UX Design Goals

Mobile-first

Minimal typing

Large touch targets

Reliable on low-end Android devices

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🧑‍💼 ADMIN DASHBOARD
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
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

Export filtered data as CSV

Generate AI-based summaries

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🧠 CORE DOMAIN MODELS
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
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

Prevents duplicate active days

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

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🌍 LOCATION & GEO HANDLING
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
How Location Is Stored

Frontend captures raw GPS (lat, lng)

Backend performs reverse-geocoding

Structured geo saved separately

Address stored independently

Why Backend Reverse-Geocoding

Prevents client spoofing

Consistent DB structure

Language-agnostic storage

Reliable map rendering

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🌐 INTERNATIONALIZATION (i18n)
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛

Supported languages:

English (en)

Hindi (hi)

Marathi (mr)

Principles:

UI text only via JSON files

DB stores enums, not translated text

Safe fallbacks for missing keys

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🤖 AI ANALYTICS
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛

Admins can generate:

Productivity summaries

Regional performance insights

Distributor behavior trends

AI is advisory only — no automation or hard dependency.

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⚖️ ASSUMPTIONS & TRADE-OFFS
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
Accuracy vs Cost

Free reverse-geocoding APIs

Raw GPS always stored as fallback

No Live Tracking

Activity-based location capture

Saves battery & backend load

AI Is Non-Authoritative

Insights only, no decisions

OTP Login Deferred

SMS providers require verification/payment

JWT retained for reliability

Enums Over Dynamic Config

Strong data integrity

Simpler analytics & queries

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🚀 FUTURE IMPROVEMENTS
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛

Offline sync queue

Route replay on maps

Supervisor roles

Verified OTP login

Advanced AI comparisons

PDF exports

⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🧠 AUTHOR NOTES
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛

This project demonstrates:

Production-grade backend design

Field-ready GPS handling

Clean schema modeling

Practical trade-offs

Resume-ready. Demo-ready. Interview-ready.
