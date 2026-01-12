# ⚖️ Counsyl AI – The Legal Operating System

> **Transform legal complexity into actionable intelligence.** Counsyl AI is a production-ready Legal Operating System designed for modern law firms, combining verified AI research, deep contract intelligence, and robust practice management.

---

## 🏛️ Essential Intelligence for Modern Counsel

![Hero Banner](/public/dashboard-hero.png)

### 🔍 Verified Legal Research
Harness the power of Gemini 2.5 Flash to search across global and local regulations. Get cited, neutral, and accurate answers with a dedicated AI assistant tailored for law firms.

### 📜 Digital Contract Vault & Intelligence
Upload **PDF, DOCX, or Excel** files. Counsyl AI reads every word, identifies high-severity risks, detects missing clauses, and provides executive summaries in seconds.

---

## 🔥 Key Features

| Feature | Description | Visual |
| :--- | :--- | :--- |
| **Research AI** | Contextual search with web-access and citation support. | ![Research](/public/legal-research.png) |
| **Contract Review** | Instant heatmaps of risks, liabilities, and missing protections. | ![Review](/public/contract-review.png) |
| **Comparative Analysis**| Side-by-side tabular comparison of complex clauses. | ![Compare](/public/tabular-comparison.png) |
| **Client & Matter Mgmt** | Centralized hub for managing clients, cases, and documents. | ![Clients](/public/client-management.png) |
| **Document Vault** | Secure, versioned storage for all firm assets. | ![Vault](/public/document-vault.png) |
| **Audit Compliance** | Full transparency logs for every AI interaction. | ![Audit](/public/audit-logs.png) |

---

## ⚙️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **AI Engine**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Auth**: [Clerk](https://clerk.com/)
- **Database**: [PostgreSQL (Prisma ORM)](https://www.prisma.io/)
- **Search**: [Serper.dev](https://serper.dev/)
- **Parsing**: `Mammoth` (Docx), `XLSX` (Excel), `pdf2json` (PDF)
- **Styling**: Tailwind CSS & Lucide Icons

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/counsyl-ai.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with the following:
   ```env
   DATABASE_URL="your-postgres-url"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-pk"
   CLERK_SECRET_KEY="your-clerk-sk"
   GEMINI_API_KEY="your-gemini-key"
   SERPER_API_KEY="your-serper-key"
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 🛡️ Security & Privacy
Counsyl AI treats legal data with the highest sensitivity. Every AI response is logged for auditability, and data is isolated per firm using professional multitenancy patterns.

---

> [!IMPORTANT]
> **Counsyl AI** is an assistant and does not provide legal advice. All AI-generated content should be reviewed by a licensed professional.

---
© 2026 Counsyl AI. All Rights Reserved. For support, contact [support@counsyl.ai](mailto:support@counsyl.ai)
