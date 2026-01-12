# Supabase Setup Guide for Legora

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: Legora Legal Platform
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to Bangladesh (Singapore recommended)
4. Click "Create new project" and wait ~2 minutes

## Step 2: Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy these values to your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 3: Create Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Paste and run this SQL:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Research Queries Table
CREATE TABLE research_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  organization_id TEXT,
  query TEXT NOT NULL,
  jurisdiction TEXT,
  answer TEXT,
  sources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract Analyses Table
CREATE TABLE contract_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  organization_id TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT,
  risks JSONB,
  missing_clauses JSONB,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients Table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matters Table
CREATE TABLE matters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT NOT NULL,
  matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_research_user ON research_queries(user_id);
CREATE INDEX idx_research_org ON research_queries(organization_id);
CREATE INDEX idx_contracts_user ON contract_analyses(user_id);
CREATE INDEX idx_contracts_org ON contract_analyses(organization_id);
CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_matters_org ON matters(organization_id);
CREATE INDEX idx_matters_client ON matters(client_id);
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_matter ON documents(matter_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE research_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Allow authenticated users to access their org's data)
CREATE POLICY "Users can view their org's research" ON research_queries
  FOR SELECT USING (auth.jwt() ->> 'org_id' = organization_id);

CREATE POLICY "Users can insert their org's research" ON research_queries
  FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id' = organization_id);

-- Repeat similar policies for other tables as needed
\`\`\`

## Step 4: Set Up Storage (Optional)

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name it `documents`
4. Set it to **Private**
5. Create RLS policies for document access

## Step 5: Test Connection

Run the test script:
\`\`\`bash
node --env-file=.env.local scripts/test-supabase.mjs
\`\`\`

## Next Steps

Once Supabase is set up, we'll integrate it into:
- Research queries (save/load history)
- Contract analyses (store results)
- Client management (CRUD operations)
- Document vault (file metadata)
- Audit logs (activity tracking)
