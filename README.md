<div align="center">

# ⚡ Code-It-Up

**A Modern, High-Performance Competitive Programming & Algorithmic Contest Platform**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![C++](https://img.shields.io/badge/Judge-GCC_%2F_G%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://gcc.gnu.org/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<br/>

<p align="center">
  <b>In-Browser Code Editor</b> • <b>Local Sandboxed Judge</b> • <b>Real-Time ICPC Standings</b> • <b>AI Code Analysis (Gemini)</b> • <b>Retro-Brutalist Blueprint UI</b>
</p>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
  - [High-Level Architecture](#1-high-level-architecture)
  - [Online Judge & Execution Pipeline](#2-online-judge--execution-pipeline)
  - [AI Code Analysis & Optimization Pipeline (Gemini)](#3-ai-code-analysis--optimization-pipeline-gemini)
  - [Contest State Machine](#4-contest-state-machine)
  - [ICPC Standings Aggregation Engine](#5-icpc-standings-aggregation-engine)
  - [Relational Data Architecture](#6-relational-data-architecture)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Technology Stack](#-technology-stack)
- [Local Development Setup](#-local-development-setup)
- [Contributing & License](#-contributing--license)

---

## 📌 Overview

**Code-It-Up** is a full-featured competitive programming platform designed for problem setters, contest organizers, and competitive coders. Engineered with inspiration from industry standards such as Codeforces and AtCoder, the platform pairs an automated local judge engine with a tactile, technical **Blueprint / Retro-Brutalist** design aesthetic and Google Gemini AI assistance.

Users can browse categorized algorithmic challenges, test solutions against custom testcases in an integrated Monaco code editor, analyze code with AI for time complexity and algorithmic optimization, compete in scheduled rounds with countdown synchronization, and track live standings calculated via international ICPC rules.

---

## 🚀 Key Features

- **⚡ In-Browser Monaco Code Editor**: Syntax highlighting, auto-indentation, and multi-language foundations.
- **🤖 AI-Driven Code Analysis & Optimization**: Integrated Google Gemini API delivers structured verdict diagnosis, time & space asymptotic evaluation, edge-case warning checklists, and fully commented optimal code.
- **🛡️ Sandboxed Online Judge**: Automatic compilation, process supervision with timeout monitoring, and batch testcase validation on native disk storage.
- **⏱️ Contest Lifecycle Automation**: Three-stage progression (Upcoming, Live, Past) with automated problem release timers and problem locking.
- **🏆 ICPC-Standard Standings**: Real-time rank calculation combining problem solves with minute-based penalties and wrong-attempt multipliers.
- **🔄 Live Auto-Syncing**: 60-second polling intervals during active rounds plus on-demand manual sync for instant leaderboard refresh.
- **🔒 Browser Credential Integration**: Native `autocomplete` attributes support browser password managers alongside persistent "Remember Me" credentials.
- **🎯 Rated & Unrated Tracks**: Flexible participation enrollment allowing competitive users to track rating changes while casual participants upsolve without rating pressure.
- **📊 Comprehensive Submission Auditing**: Transparent execution telemetry recording language, execution time, memory usage, and precise OS signal-level verdicts.

---

## 🏛️ System Architecture

The platform separates concerns across four distinct architectural tiers: the client presentation tier, the application routing & business logic tier, the local sandboxed judge tier, and the cloud relational & AI intelligence tier.

### 1. High-Level Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client (React 19 + Vite)"]
        UI["Blueprint UI & Monaco Editor"]
        State["Auth Context & Router State"]
        Poller["Live Standings Poller & Timers"]
        AiModal["AI Analysis & Optimization Modal"]
    end

    subgraph ServiceLayer["Application Server (Node.js / Express)"]
        AuthSvc["Authentication & Session Manager"]
        ContestSvc["Contest & Registration Orchestrator"]
        JudgeSvc["Code Execution & Submission Pipeline"]
        StandingsEngine["ICPC Standings Aggregation Engine"]
        AiEngine["Gemini Code Optimization Service"]
    end

    subgraph ExternalAI["Intelligence Tier"]
        GeminiAPI[("Google Gemini 2.5 / 3 API")]
    end

    subgraph SandboxLayer["Execution Sandbox (Local Environment)"]
        Compiler["GNU C++ Compiler (g++)"]
        ProcessRunner["Process Execution & Limits Monitor"]
        TestVerifier["Testcase Batch Verifier"]
        VerdictClassifier["Verdict Classifier & Signals"]
    end

    subgraph DataLayer["Persistence Layer (Supabase / PostgreSQL)"]
        UsersDB[("Profiles & Credentials")]
        ProblemsDB[("Problems & Specifications")]
        ContestsDB[("Contests & Registrations")]
        SubmissionsDB[("Submissions Log")]
    end

    UI -->|"State & Actions"| AuthSvc
    UI -->|"Contest Actions"| ContestSvc
    UI -->|"Submit Solution"| JudgeSvc
    UI -->|"Trigger AI Evaluation"| AiEngine
    Poller -->|"Fetch Leaderboard"| StandingsEngine

    AiEngine -->|"Structured Prompt & JSON Schema"| GeminiAPI
    GeminiAPI -->|"Verified JSON Analysis"| AiEngine

    AuthSvc -->|"User Profiles"| UsersDB
    ContestSvc -->|"Contests & Enrollments"| ContestsDB
    JudgeSvc -->|"Verdicts & Metadata"| SubmissionsDB
    JudgeSvc -->|"Limits & Specs"| ProblemsDB
    AiEngine -->|"Fetch Problem Specs & Submission"| ProblemsDB
    AiEngine -->|"Fetch Submission Context"| SubmissionsDB
    StandingsEngine -->|"Registrations"| ContestsDB
    StandingsEngine -->|"Submissions in Window"| SubmissionsDB

    JudgeSvc -->|"Spawn Isolated Sandbox"| Compiler
    Compiler -->|"Output Executable"| ProcessRunner
    ProcessRunner -->|"Feed Testcase Inputs"| TestVerifier
    TestVerifier -->|"Signals & Output Diff"| VerdictClassifier
    VerdictClassifier -->|"Return Verdict to Service"| JudgeSvc
```

---

### 2. Online Judge & Execution Pipeline

When a user submits code, the submission pipeline creates an ephemeral directory, compiles the source code, and feeds inputs from disk into the running process while monitoring time limits and operating system signals.

```mermaid
flowchart TD
    Start["User Submits Code"] --> Validate["Validate Input & Language"]
    Validate --> TempDir["Create UUID Working Directory"]
    TempDir --> WriteSrc["Write Source File"]
    WriteSrc --> Compile["Compile with g++"]
    
    Compile -->|"Compilation Failed"| RecordCE["Record Verdict: CE"]
    Compile -->|"Compilation Succeeded"| LoadTC["Load Problem Testcases"]
    
    subgraph ExecutionLoop["Batch Testcase Verification"]
        RunExec["Execute Binary with Stdin & Timeout Monitor"]
        RunExec -->|"Timeout Exceeded"| SigTLE["Kill Process: TLE"]
        RunExec -->|"Segmentation Fault"| SigRTE["Kill Process: RTE"]
        RunExec -->|"Floating Point Error"| SigRTE
        RunExec -->|"Non-Zero Exit"| SigRTE
        RunExec -->|"Exit Code 0"| Compare["Diff Actual vs Expected Output"]
        Compare -->|"Mismatch Found"| SigWA["Verdict: WA"]
        Compare -->|"Match & Remaining Tests Exist"| RunExec
        Compare -->|"All Testcases Match"| SigAC["Verdict: AC"]
    end

    LoadTC --> ExecutionLoop
    RecordCE --> Cleanup["Purge Working Directory"]
    SigTLE --> Cleanup
    SigRTE --> Cleanup
    SigWA --> Cleanup
    SigAC --> Cleanup
    Cleanup --> Persist["Persist Submission in Database"]
    Persist --> Response["Return Verdict & Metrics to Client"]
```

#### Verdict Classification Reference

| Verdict | Meaning | Underlying Cause |
|---|---|---|
| **AC** | Accepted | Solution executed within time limit and output matched all canonical outputs byte-for-byte. |
| **WA** | Wrong Answer | Solution terminated normally but produced incorrect output on one or more testcases. |
| **TLE** | Time Limit Exceeded | Execution duration exceeded the problem's time limit threshold; process terminated by judge. |
| **CE** | Compilation Error | The GNU C++ compiler emitted non-zero exit code due to syntax or linking errors. |
| **RTE** | Runtime Error | Process terminated abnormally (`SIGSEGV` segmentation fault, `SIGFPE` arithmetic fault, `SIGABRT`). |

---

### 3. AI Code Analysis & Optimization Pipeline (Gemini)

The AI engine analyzes submitted solutions and code snippets using Google's Gemini models through `@google/genai` structured outputs, providing deterministic, parseable algorithmic feedback:

```mermaid
flowchart TD
    Trigger["User Triggers AI Analysis (Editor / Submission Log)"] --> Assemble["Assemble Context: Code + Problem Spec + Verdict + Limits"]
    Assemble --> SchemaPrompt["Construct Structured Prompt with Target JSON Schema"]
    SchemaPrompt --> GeminiCall["Dispatch to Gemini API (gemini-2.5-flash / gemini-3)"]
    
    subgraph OutputSynthesis["Structured Intelligence Output"]
        Summary["Executive Summary & Correctness Review"]
        Diagnosis["Verdict Diagnosis (Root Cause for WA, TLE, CE, RTE)"]
        Complexity["Asymptotic Comparison (Current vs Target Optimal)"]
        Pitfalls["Edge Case & Overflow Warning Checklist"]
        Optimizations["Actionable Algorithmic Techniques"]
        CanonicalCode["Commented Optimal Implementation"]
    end

    GeminiCall --> OutputSynthesis
    OutputSynthesis --> RenderModal["Present in Blueprint Tactical Modal with 1-Click Code Insert"]
```

---

### 4. Contest State Machine

Contest progression is governed by strict wall-clock time boundaries. The frontend and backend synchronize on UTC timestamps to manage registrations, problem visibility, and standings finalization.

```mermaid
stateDiagram-v2
    [*] --> Upcoming: Contest Created & Scheduled
    
    state Upcoming {
        [*] --> RegistrationOpen
        RegistrationOpen --> RegisteredRated: Register as Rated
        RegistrationOpen --> RegisteredUnrated: Register as Unrated
        RegisteredRated --> CountdownActive
        RegisteredUnrated --> CountdownActive
    }
    
    Upcoming --> Live: Clock Hits Start Time (Problems Unlock)
    
    state Live {
        [*] --> SubmissionsOpen
        SubmissionsOpen --> RealtimeStandings: Submissions Processed
        RealtimeStandings --> SubmissionsOpen: Auto-Poll Leaderboard (60s)
    }
    
    Live --> Past: Clock Hits Start Time + Duration
    
    state Past {
        [*] --> FinalStandings: Official Results Finalized
        FinalStandings --> ArchivePractice: Practice & Upsolving Active
    }
```

---

### 5. ICPC Standings Aggregation Engine

The standings service processes all activity within the contest window, enforcing fair competition rules:

```mermaid
flowchart LR
    subgraph InputData["Contest Data"]
        Registrations["Contest Registrations"]
        TimeBounds["Contest Window: T_start to T_end"]
        Submissions["Contest Submissions"]
    end

    subgraph EvaluationPipeline["Standings Engine"]
        Filter["Filter Submissions to Contest Window"]
        UserGroup["Group Submissions by Registered User"]
        ProblemEval["Detect First AC & Count Pre-AC Wrongs"]
        ScoreCalc["Calculate Penalty: Time + 20m x Wrongs"]
        SortRanks["Sort: Solved Descending, Penalty Ascending"]
        AssignRanks["Assign Ranks with Duplicate-Score Ties"]
    end

    subgraph OutputView["Leaderboard"]
        Table["Render Standings Table & Podium Medals"]
    end

    InputData --> Filter
    Filter --> UserGroup
    UserGroup --> ProblemEval
    ProblemEval --> ScoreCalc
    ScoreCalc --> SortRanks
    SortRanks --> AssignRanks
    AssignRanks --> OutputView
```

$$\text{Problem Penalty} = \text{Solve Time (minutes from start)} + (20 \times \text{Wrong Submissions Before First AC})$$

$$\text{Total Contest Penalty} = \sum_{p \in \text{Solved Problems}} \text{Penalty}(p)$$

- **Registration Gate:** Only registered contestants appear in the official leaderboard; users with zero solves remain listed.
- **Time Boundary Enforcement:** Submissions before the official start or after the contest duration expires are ignored in the calculation.
- **Tie Resolution:** Participants with identical solve counts and identical penalties share the same rank.

---

### 6. Relational Data Architecture

The underlying PostgreSQL database hosted on Supabase enforces referential integrity across the contest platform:

```mermaid
erDiagram
    PROFILES ||--o{ SUBMISSIONS : submits
    PROFILES ||--o{ CONTEST_REGISTRATIONS : enters
    PROBLEMS ||--o{ SUBMISSIONS : receives
    PROBLEMS ||--o{ CONTEST_PROBLEMS : mapped_in
    CONTESTS ||--o{ CONTEST_PROBLEMS : contains
    CONTESTS ||--o{ CONTEST_REGISTRATIONS : enrolls

    PROFILES {
        uuid id PK
        string username
        string email
        string full_name
        string affiliation
        string profile_photo
        timestamp created_at
    }

    PROBLEMS {
        uuid id PK
        string prob_name
        string prob_code
        text prob_desc
        int prob_rating
        int time_limit
        int memory_limit
        timestamp created_at
    }

    CONTESTS {
        uuid id PK
        string contest_name
        string contest_code
        timestamp start_time
        int duration
        boolean rated
        array setters
        array testers
    }

    CONTEST_PROBLEMS {
        uuid id PK
        uuid contest_id FK
        uuid problem_id FK
        string index_code
    }

    CONTEST_REGISTRATIONS {
        uuid id PK
        uuid contest_id FK
        uuid user_id FK
        boolean is_rated
        timestamp created_at
    }

    SUBMISSIONS {
        uuid id PK
        uuid user_id FK
        string username
        uuid problem_id FK
        string problem_code
        string language
        text code
        string verdict
        int time_taken
        int memory_used
        timestamp created_at
    }
```

---

## 🎨 Design System & Aesthetics

Code-It-Up adopts an intentional **Technical Blueprint & Retro-Brutalist** visual system:

- **Warm Paper Canvas**: `#EDE8DC` background paired with `#FAF7F0` card surfaces, evoking an annotated engineering drawing.
- **Architectural Borders**: Confident `2px solid #17181A` ink strokes on all interactive cards, inputs, and tables with zero blurry drop shadows.
- **Hard-Offset Accents**: Hard-offset solid blocks (`4px 4px 0px 0px #17181A`) provide tactile depth on button clicks and hover states.
- **Technical Typography**: Monospace fonts (`Space Mono`, `JetBrains Mono`) dominate data headers, stats, code snippets, and button actions, supported by clean sans-serif for reading comfort.
- **Annotation Markers**: Grid intersection anchors and connector lines signify live metrics and layout sections.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Core** | React 19, Vite | Single-page application rendering with optimized module bundling. |
| **Routing** | React Router DOM v7 | Dynamic client-side routing and tab coordination. |
| **Styling** | Tailwind CSS v4, Lucide React | Utility-first styling with custom blueprint color tokens and iconography. |
| **Editor** | Monaco Editor | In-browser C++ code authoring environment. |
| **AI Integration** | Google GenAI SDK (`@google/genai`) | Code complexity evaluation, root-cause diagnosis & optimization suggestions. |
| **Backend Core** | Node.js, Express (ESM) | Non-blocking API server and process coordinator. |
| **Compiler & Judge** | GCC / G++ (C++20) | Native machine code compilation and sandboxed execution. |
| **Database** | Supabase (PostgreSQL) | Relational database with ACID transactions and schema integrity. |
| **Auth & Security** | JWT, bcrypt, Cookie Parser | Stateless token issuance with secure cookie storage. |

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** (v18.0.0 or later)
- **C++ Compiler** (`g++`) installed and added to your system environment variables (`PATH`)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Master-Bruce-Wayne/Code-It-Up.git
cd Code-It-Up
```

### 2. Configure & Run Backend
```bash
cd backend
npm install
```
Configure your environment variables in `backend/.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET_KEY=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini AI API Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```
Launch the backend server:
```bash
npm run dev
```

### 3. Configure & Run Frontend
In a new terminal window:
```bash
cd frontend
npm install
```
Configure your client environment in `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```
Start the frontend development server:
```bash
npm run dev
```

---

## 📄 License

This project is licensed under the **ISC License**.
