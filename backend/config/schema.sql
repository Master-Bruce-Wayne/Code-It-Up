-- Enable uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Custom Auth User profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    profile_photo TEXT,
    affiliation VARCHAR(255),
    current_rating INTEGER DEFAULT 0,
    max_rating INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prob_name VARCHAR(255) NOT NULL UNIQUE,
    prob_code VARCHAR(100) NOT NULL UNIQUE,
    time_limit INTEGER DEFAULT 2000, -- in ms
    memory_limit INTEGER DEFAULT 512, -- in MB
    prob_tags TEXT[] DEFAULT '{}',
    prob_statement TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL,
    constraints TEXT NOT NULL,
    prob_rating INTEGER NOT NULL,
    samples JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contests Table
CREATE TABLE IF NOT EXISTS contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_name VARCHAR(255) NOT NULL,
    contest_code VARCHAR(100) NOT NULL UNIQUE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- duration in minutes
    rated BOOLEAN DEFAULT TRUE,
    setters UUID[] DEFAULT '{}',
    testers UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Contest Problems Junction Table
CREATE TABLE IF NOT EXISTS contest_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    index_code VARCHAR(10) NOT NULL, -- e.g., 'A', 'B', 'C'
    UNIQUE(contest_id, problem_id),
    UNIQUE(contest_id, index_code)
);

-- 5. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    problem_code VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    verdict VARCHAR(50) DEFAULT 'Pending', -- AC, WA, TLE, RTE, CE, SIGSEGV, Pending
    time_taken INTEGER, -- in ms
    memory_used INTEGER, -- in MB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Contest Registrations Table
CREATE TABLE IF NOT EXISTS contest_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_rated BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contest_id, user_id)
);

-- Trigger function to automatically update 'updated_at' columns on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach update triggers
CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_contests_updated_at BEFORE UPDATE ON contests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
