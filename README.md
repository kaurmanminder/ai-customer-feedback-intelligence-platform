# Project LOOP - AI Customer-Feedback Intelligence Platform
### 🚀 Zidio Internship Capstone Project Submission

Welcome to **Project LOOP**, a state-of-the-art enterprise-grade AI Customer-Feedback Intelligence Platform built as the official Zidio Internship Capstone project. Project LOOP is designed to centralize, process, classify, and visualize multi-channel user reviews in real-time, leveraging modern AI and transaction-safe relational database synchronization.

---

## 💡 System Architecture

```mermaid
graph TD
    A[Multi-Channel Ingestion: Web, Email, Slack, Intercom, Mobile] -->|POST Raw Feedback| B[Next.js API Gateway: route.ts]
    B -->|Session Guard: loop_session Cookie verification| B
    B -->|Official @google/generative-ai SDK call| C[Google Gemini 1.5 Flash AI Processing]
    C -->|Return Sentiment, Score, Summary & Tags JSON| B
    B -->|Multi-Tenant Transaction Write| D[MySQL / PostgreSQL Database via Prisma Client]
    D -->|Real-time state broadcast| E[Tailwind UI & Recharts Dashboard Client]
```

1. **Ingestion Layer**: Aggregates customer text reviews from web interfaces or external integrations.
2. **Next.js API Guard**: Safe Route Handler (`/api/analyze`) validates base64 session security credentials, extracts dynamic client contexts, and ensures strict multi-tenant workspace isolation.
3. **Google Gemini 1.5 Flash**: Processes raw customer voice contents via the official Google Generative AI SDK, parsing categories, sentiment classifications ('Positive', 'Neutral', 'Negative'), and one-line summaries.
4. **Prisma Relational Storage**: Stores analysis results securely in database tables using MySQL/PostgreSQL relational schema rules, ensuring zero data loss and flawless integrity.

---

## 🛠️ Tech Stack Specification

- **Frontend**: Next.js 14 App Router, TypeScript, React 18, Recharts.
- **Styling**: Tailwind CSS with custom premium `#deff9a` neon-green themes and responsive layouts (`flex-col md:flex-row`, `overflow-x-hidden`).
- **Database & ORM**: Prisma ORM with MySQL/PostgreSQL support.
- **AI Integration**: Official `@google/generative-ai` SDK wrapper using model `gemini-1.5-flash`.
- **Security**: Cookie-based custom encryption session (`loop_session`).

---

## ⚙️ Step-by-Step Local Setup & Setup Instructions

Prepare your local database (e.g. MySQL) and configure `.env` database URLs and Gemini key values. Then, execute these setup scripts in your terminal:

```bash
# 1. Install project dependencies
npm install

# 2. Synchronize Prisma schemas to create database tables
npx prisma db push --force-reset

# 3. Seed mock workspaces, customized user roles, and reviews
npx prisma db seed

# 4. Start Next.js development server
npm run dev
```

After launching, go to [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🔐 Environment Variables Guide

Create a `.env` file in the root directory of the project. It must contain the database connection string and your Google Gemini API Key:
```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/loop_db"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

---

## 👥 Grading & Evaluation Credentials Checklist

Authenticate seamlessly using these pre-seeded roles to evaluate all multi-tenant layout rights. The default password is `password123`:

### 1. ADMIN ROLE (Full settings, profiles, and dashboard analysis write access)
* **Email**: `admin@example.com`
* **Password**: `password123`
* **Phone Number**: `+15555551234`

### 2. ANALYST ROLE (Analysis and review summary access)
* **Email**: `analyst@example.com`
* **Password**: `password123`
* **Phone Number**: `+15555555678`

### 3. VIEWER ROLE (Read-only insights lookup)
* **Email**: `viewer@example.com`
* **Password**: `password123`
* **Phone Number**: `+15555559012`
