# Code-It-Up: 50 Core System Architecture & Engineering Questions

> **Target:** System Architects, Backend Engineers, Online Judge Designers, and Technical Interviewers  
> **Coverage:** Full-Stack Architecture, Sandboxed Execution, Contest Lifecycle, ICPC Standings, Gemini AI Integration, Security, and Scalability  

---

### Part 1: High-Level Architecture & System Design (Questions 1–10)

#### 1. What is the overarching architectural pattern of Code-It-Up, and how are boundaries maintained between the frontend, backend, judge engine, and persistence tier?
**Answer:** Code-It-Up employs a decoupled multi-tier architecture:
- **Client Tier:** A React 19 Single Page Application (SPA) bundled with Vite, responsible for UI rendering, Monaco Editor interaction, and client-side routing.
- **Service Tier:** A stateless Node.js / Express 5 API gateway coordinating business logic, authentication, contest timers, and AI prompts.
- **Judge Sandbox:** A local execution environment on the host running GNU C++ (`g++`) with ephemeral UUID directories and process-level timeouts.
- **Data Tier:** Supabase PostgreSQL providing relational data integrity, foreign key cascading, and ACID transaction semantics.
Communication across tiers is strictly mediated via JSON REST over HTTP, keeping the gateway stateless and horizontally scalable.

#### 2. Why was PostgreSQL (via Supabase) chosen over a NoSQL database (such as MongoDB) for this platform?
**Answer:** Competitive programming platforms require strict transactional guarantees and relational integrity:
- Problem sets within contests require strict foreign keys (`contest_problems` linking `contests` and `problems`).
- Contest enrollment requires composite unique constraints (`(contest_id, user_id)`) to eliminate duplicate registrations.
- Standings aggregation requires relational joins between registrations, profiles, and chronological submissions filtered by foreign keys and timestamps. A document store would risk partial writes, dangling references, or complex client-side join logic.

#### 3. How does the system prevent Express route shadowing between `/:contestCode` and `/:contestCode/standings`?
**Answer:** Express evaluates routes in the exact order they are registered on the router. In `backend/routes/contestRouter.js`, the explicit route `/:contestCode/standings` is registered **before** the parameterized route `/:contestCode`. If declared in reverse, Express matches the token `"standings"` as a `:contestCode` value, routing the request to `getContestByCode` instead of `getContestStandings`.

#### 4. How does the frontend achieve smooth, client-side tab switching across contest sections without full-page browser refreshes?
**Answer:** The contest navigation bar uses React Router DOM v7's `<Link>` component instead of standard anchor (`<a href>`) tags. Anchor tags trigger a full HTML document reload, re-mounting the React root, wiping memory state, and forcing re-authentication checks. `<Link>` intercepts the click event, updates the browser history via the HTML5 History API, and performs an in-memory route swap.

#### 5. What role does the ES6 Proxy in `backend/config/supabase.js` play during startup?
**Answer:** If Supabase credentials (`SUPABASE_URL` or keys) are absent or placeholders, `backend/config/supabase.js` wraps the client in an ES6 `Proxy`. This intercepts method access (such as `.from().select()`) and returns mock promises that reject cleanly with informative errors upon actual query invocation, rather than throwing uncaught initialization exceptions that crash the Express server on boot.

#### 6. What are the trade-offs of hosting the judge engine on the same server as the Express API rather than a distributed message queue worker pool?
**Answer:**
- **Advantages:** Zero network overhead for dispatching code, no need for RabbitMQ/Redis/BullMQ brokers, immediate synchronous HTTP response to the client, simplified local development.
- **Disadvantages:** High CPU and memory contention during contests; a batch of simultaneous submissions can starve Express event-loop threads; potential security risks if malicious C++ code escapes process bounds on the host server.

#### 7. How does the system isolate concurrent submissions from clashing with each other on disk?
**Answer:** For every submission, `submissionController.js` generates a cryptographically random UUID using the `uuid` v4 package and creates an isolated temporary directory `temp/<UUID>/`. The source file is written to `temp/<UUID>/main.cpp` and compiled to `temp/<UUID>/main.exe`. This ensures that even if 100 users submit code simultaneously for the same problem, their source files, object files, and binaries never collide.

#### 8. How does the frontend synchronize authentication state across reloads?
**Answer:** On initial user login, the user profile (`_id`, `username`, `email`, etc.) is stored in `localStorage` under `"userData"`, while the HTTP-only cookie holds the JWT. In `UserProvider` (`frontend/src/context/User.jsx`), an effect checks `localStorage` during initialization and populates React Context state. If a user manually clears local storage, routes redirect to `/login`.

#### 9. Why does `ContestPage.jsx` hide problems for upcoming contests on both the client and server?
**Answer:** Security in depth. If the server only hid problems on the UI, any user could inspect the JSON network payload in DevTools and read problem descriptions and test inputs before the contest starts. `contestController.js` actively clears the array (`mapped.problems = []`) on the server if `start_time > now()`, guaranteeing zero data leakage over the wire.

#### 10. How does the system handle CORS between the Vite frontend and Express backend?
**Answer:** `backend/index.js` configures the `cors` middleware with `origin: process.env.FRONTEND_URL` and `credentials: true`. This allows the browser to send and receive secure HTTP-only session cookies (`token`) across origins during API requests.

---

### Part 2: Sandboxed Online Judge & Execution Engine (Questions 11–20)

#### 11. Walk through the complete lifecycle of a code submission from the instant a user clicks "Submit" to receiving a verdict.
**Answer:**
1. Client POSTs code, language, problem code, and user ID to `/api/v1/submission/submit`.
2. Controller validates fields and queries Supabase for problem constraints (`time_limit`).
3. An isolated directory `temp/<UUID>/` is created, and source code is written to `main.cpp`.
4. `g++ "main.cpp" -o "main.exe"` is invoked via child process. If it fails, a `"CE"` record is saved and returned.
5. The judge opens `assets/judge_data/<probCode>/` and reads test inputs and expected outputs sequentially.
6. For each testcase, `main.exe` is spawned with standard input piped and `timeout: problem.time_limit`.
7. Exit codes, signals, and execution times are captured. If an error occurs (TLE, SIGSEGV, WA), testing halts immediately.
8. A final row is inserted into the `submissions` table in PostgreSQL.
9. Ephemeral files are removed and a JSON response with the verdict is returned to the client.

#### 12. How does the judge detect and enforce Time Limit Exceeded (TLE)?
**Answer:** In `backend/controllers/submissionController.js`, `child_process.exec` is passed `{ timeout: problem.time_limit }` (in milliseconds). If the running executable exceeds this threshold, the Node OS process runner sends a `SIGKILL` signal to the child process. The controller checks `err.killed && err.signal === "SIGKILL"` and maps the verdict to `"TLE"`.

#### 13. What is the difference between `SIGSEGV`, `SIGFPE`, and `SIGABRT` in C++ execution?
**Answer:**
- `SIGSEGV` (Segmentation Fault): The process attempted to access memory that does not belong to it (e.g. dereferencing null pointers, index out of bounds, stack overflow).
- `SIGFPE` (Floating Point Exception): An illegal arithmetic operation occurred, most commonly integer division by zero (`x / 0`) or modulo by zero (`x % 0`).
- `SIGABRT` (Abort): The program aborted abnormally, triggered by a failed assertion (`assert(false)`) or an uncaught exception (`throw std::runtime_error()`).

#### 14. How does Code-It-Up ensure white-space tolerance during output comparison?
**Answer:** Both the child process output and the expected canonical output from disk are normalized using `.trim()`. This eliminates trailing spaces, trailing carriage returns (`\r\n` vs `\n`), and extraneous blank lines from triggering false `WA` verdicts.

#### 15. What is the exact difference between the `/submission/run` and `/submission/submit` endpoints?
**Answer:**
- `/submission/run`: Compiles and executes code against a single custom user-provided string via standard input. It returns raw `stdout` / `stderr` and does **not** persist anything in the database or affect contest standings.
- `/submission/submit`: Judges the code sequentially against all test files in `assets/judge_data/<probCode>/`, records the permanent submission row in Supabase, and updates contest leaderboards.

#### 16. Why does the judge break out of the testcase loop on the very first failing testcase?
**Answer:** This implements the standard "Short-Circuit Judging" optimization. If a solution fails testcase 3 with Wrong Answer or TLE, running the remaining 50 testcases consumes server CPU without changing the final outcome. Short-circuiting keeps the judge responsive under high contest loads.

#### 17. How are compilation errors (CE) handled without crashing the server?
**Answer:** The compilation step is wrapped in a `try / catch` block around `await runCommand("g++ ...")`. If `g++` exits with a non-zero exit code, the catch block intercepts `stderr`, inserts a submission with verdict `"CE"` into Supabase, and returns an HTTP 200 response `{ success: true, verdict: "CE", message: "Code compiled with errors." }`.

#### 18. What security risks exist when compiling and running untrusted C++ code directly via `child_process.exec` on the host?
**Answer:** Without Linux containerization (Docker, cgroups, nsjail, isolate), untrusted C++ code can:
1. Access the host filesystem (e.g. read `.env` or delete files).
2. Spawn fork bombs (`while(1) fork();`) to exhaust OS process limits.
3. Open network sockets to launch port scans or outbound DDoS attacks.
4. Consume all available server RAM.
*Production Recommendation:* Move execution to ephemeral Docker containers or an isolated sandboxing framework like `isolate`.

#### 19. How are problem testcases organized on disk, and how does the judge discover them?
**Answer:** Testcases are stored under `backend/assets/judge_data/<problemCode>/`. The judge uses `fs.readdirSync(tcFolder).filter(f => f.startsWith("input"))` to dynamically discover all input files (e.g. `input1.txt`, `input2.txt`), extracts the test index via regular expression `/\d+/`, and pairs each with its corresponding `output<num>.txt`.

#### 20. Why is standard C++ fast I/O significant in competitive programming judges?
**Answer:** Standard C++ streams (`std::cin` and `std::cout`) synchronize with C stdio by default. For inputs with $10^5$ to $10^6$ lines, I/O overhead can exceed 500ms, triggering false TLE verdicts. Adding `ios_base::sync_with_stdio(false); cin.tie(NULL);` decouples the streams, reducing I/O latency to near-C speeds.

---

### Part 3: Contest Lifecycle & ICPC Standings Engine (Questions 21–30)

#### 21. How is the official ICPC penalty score calculated in Code-It-Up?
**Answer:** For each problem solved with an Accepted (AC) verdict, the penalty is:
$$\text{Penalty} = \text{Elapsed Minutes from Contest Start} + (20 \times \text{Wrong Submissions Before First AC})$$
Total contest penalty is the sum of penalties across all solved problems. Problems that are never solved do not add any penalty, regardless of how many failed attempts were made.

#### 22. What happens to submissions made after a user has already achieved an Accepted (AC) verdict on that problem?
**Answer:** In `getContestStandings`, once a user has an AC recorded for a problem, any subsequent submissions on that problem are ignored (`if (cell.firstAcTime !== null) continue;`). They do not increase the penalty or alter the recorded solve time.

#### 23. How does the standings engine resolve rank ties between two participants?
**Answer:** Participants are sorted primarily by `solved` count descending, and secondarily by `penalty` ascending:
```javascript
rows.sort((a, b) => b.solved !== a.solved ? b.solved - a.solved : a.penalty - b.penalty);
```
During rank assignment, if two consecutive users have both identical `solved` count and identical `penalty`, they receive the exact same rank number.

#### 24. How are unrated participants treated in the standings table?
**Answer:** Unrated participants are scored using the identical ICPC algorithm and appear on the leaderboard to monitor their practice performance, but they are visually distinguished with an `UNRATED` badge so that rating calculation scripts can filter them out.

#### 25. Why are users with zero solves included in the standings table?
**Answer:** In `getContestStandings`, the system first queries `contest_registrations` and seeds every registered user into the in-memory map with `solved = 0`, `penalty = 0`, and empty problem cells. This ensures accurate turnout reporting on the leaderboard even if users have not yet solved a problem.

#### 26. How does the system restrict submissions counted in standings to the exact contest window?
**Answer:** The query to the `submissions` table applies strict database timestamp filters:
```javascript
.gte('created_at', contestStart.toISOString())
.lte('created_at', contestEnd.toISOString())
```
Where `contestEnd = contestStart + duration * 60 * 1000`. Any solution submitted before the contest starts or after the final second is excluded from the ranking calculation.

#### 27. How does the frontend handle real-time leaderboard updates during an ongoing contest?
**Answer:** In `StandingsPage.jsx`, an effect checks if `isLive()` is true (`new Date() < contestEnd`). If live, it registers a `setInterval` that fires every 60 seconds to silently fetch fresh standings without re-triggering loading spinners, supplemented with a manual "Refresh" button.

#### 28. How does `ContestPage.jsx` trigger the transition from "Upcoming" to "Live" without requiring manual page reloads?
**Answer:** When a contest is upcoming, `ContestPage.jsx` computes remaining milliseconds and starts a 1-second interval timer. When the remaining difference reaches zero, it calls `clearInterval` and triggers `window.location.reload()`, which re-fetches contest data. Since `startTime` is now in the past, the backend returns the unlocked problems array.

#### 29. What is the database schema relationship between contests and problems?
**Answer:** A Many-to-Many relationship resolved via the junction table `contest_problems`, which stores `(id, contest_id, problem_id, index_code)`. This allows the same problem to be reused across different contests or practice archives under different index letters (e.g. Problem A in Div. 3 vs. Problem C in Div. 4).

#### 30. How are problem index letters (A, B, C...) derived from submissions in the standings calculation?
**Answer:** In Code-It-Up, contest problem codes follow the convention `<contestCode><index>` (e.g., `START26A`). The standings controller extracts the index letter using `sub.problem_code.replace(contestCode, '')`, matching it against the contest's registered problem index list.

---

### Part 4: Google Gemini AI Integration (Questions 31–40)

#### 31. Which Google Gemini SDK is used in Code-It-Up, and why was the legacy `@google/generative-ai` avoided?
**Answer:** Code-It-Up uses the current official `@google/genai` SDK (`GoogleGenAI` class). The older `@google/generative-ai` package is deprecated by Google and targets legacy endpoints, whereas `@google/genai` provides native support for Gemini 2.5 and 3 models, structured JSON outputs, and unified authentication.

#### 32. How does the platform force Gemini to return valid, parseable JSON every time?
**Answer:** By configuring the call with `responseMimeType: "application/json"` and supplying a typed `responseSchema` constructed with `Type.OBJECT`, `Type.STRING`, and `Type.ARRAY` in `backend/config/gemini.js`. This constrains the model at the decoding level to produce tokens that conform strictly to the specified schema.

#### 33. What specific fields are enforced in the Gemini analysis schema?
**Answer:**
1. `summary` (String): High-level analysis of approach and correctness.
2. `verdictDiagnosis` (String): Explanation of why the code achieved its verdict (AC, WA, TLE, etc.).
3. `complexity` (Object): Current vs. optimal time and space complexity with explanations.
4. `issuesAndEdgeCases` (Array of Strings): Logic errors, overflow risks, and boundary conditions.
5. `optimizations` (Array of Objects): Actionable titles and descriptions of algorithmic improvements.
6. `suggestedCode` (String): Formatted C++ implementation.
7. `suggestedCodeExplanation` (String): Breakdown of the suggested implementation.

#### 34. How does the AI diagnosis differ when analyzing an Accepted (AC) versus a Wrong Answer (WA) submission?
**Answer:**
- **For AC:** Gemini evaluates whether the solution is asymptotically optimal or simply passed weak testcases, highlights unnecessary memory allocations, and suggests clean-code idiom improvements.
- **For WA:** Gemini identifies typical competitive programming bugs: integer overflow (using 32-bit `int` instead of 64-bit `long long`), off-by-one errors in loops, unhandled boundary cases (like $N=1$ or empty sets), or incorrect greedy choices.

#### 35. How does the frontend code editor interact with the AI-suggested code?
**Answer:** `CodeEditorPage.jsx` passes a callback `onApplyCode={(suggestedCode) => setCode(suggestedCode)}` to `AiAnalysisModal`. When the user clicks the "Insert in Editor" button inside the modal, the suggested code replaces the contents of the Monaco Editor, closes the modal, and displays a toast notification.

#### 36. What context is provided to the Gemini model to ensure its analysis is accurate?
**Answer:** The prompt context includes:
- Problem Code & Title.
- Problem Statement & Constraints (e.g. $1 \le N \le 10^5$, Time Limit: 2.0s).
- User's complete source code.
- Execution results: Verdict, execution time in ms, and memory consumption in KB.

#### 37. How does the backend prevent unhandled server crashes if `GEMINI_API_KEY` is missing?
**Answer:** In `backend/config/gemini.js`, the SDK client initialization is wrapped in a check. If `GEMINI_API_KEY` is absent or a placeholder, it logs a warning without throwing an error. When an analysis endpoint is hit, it throws a caught error and returns HTTP 500 with a descriptive JSON message, preventing server termination.

#### 38. How does the frontend prevent race conditions when a user requests multiple AI analyses?
**Answer:** When an analysis is initiated, `aiLoading` is set to `true`, which disables the "AI Analysis" button and displays a loading spinner in the modal. Previous errors and analyses are cleared until the active request settles.

#### 39. Why is asymptotic complexity comparison (Current vs. Optimal) crucial for competitive programmers?
**Answer:** A solution might pass with an $O(N \log N)$ algorithm within a 2-second time limit, but an $O(N)$ linear solution may be optimal. Conversely, a solution might TLE with $O(N^2)$ on $N=10^5$. Comparing current vs. target complexity clearly demonstrates why the solution exceeded the allotted clock cycles.

#### 40. How can Gemini analysis be triggered from both the code editor and the submissions history page?
**Answer:**
- In `CodeEditorPage.jsx`: Sends the current editor buffer and problem code to `POST /api/v1/submission/analyze`.
- In `SubmissionsPage.jsx`: Each row has an "Analyze" button that passes the historical submission details to the same endpoint, diagnosing the historical verdict.

---

### Part 5: Security, Performance, Database & Reliability (Questions 41–50)

#### 41. How are user passwords secured in Code-It-Up?
**Answer:** In `backend/controllers/userController.js`, passwords are never stored in plaintext. They are hashed using `bcrypt.hash(password, 10)` with 10 salt rounds before insertion into the `profiles` table. On login, `bcrypt.compare` verifies the submitted password against the stored hash.

#### 42. How does the platform comply with browser credential managers while protecting passwords in client storage?
**Answer:**
- Forms declare `autoComplete="on"`, `autoComplete="username"`, and `autoComplete="current-password"` / `autoComplete="new-password"`.
- The "Remember My Username" checkbox saves **only the username** in `localStorage`. Passwords are never placed in client-accessible storage (`localStorage` / `sessionStorage`), preventing credential theft via XSS.

#### 43. What happens if a user submits an infinite loop (`while(true)`) in C++?
**Answer:** The process runs until `problem.time_limit` expires. Node's `child_process.exec` kills the child process via `SIGKILL`, the error handler catches `err.killed`, maps the verdict to `"TLE"`, deletes the temporary working directory, and returns a TLE response without blocking the Express event loop.

#### 44. What happens if a user's code consumes excessive memory (e.g. allocating `int arr[100000000]`)?
**Answer:** If the allocation exceeds available OS stack or heap limits, the operating system kernel terminates the process with a `SIGSEGV` or `SIGABRT` signal. The judge captures the signal, maps it to `"RTE"` or `"SIGSEGV"`, and records a Runtime Error verdict.

#### 45. How does the database prevent duplicate registrations for the same contest?
**Answer:** The `contest_registrations` table enforces a composite unique constraint on `(contest_id, user_id)`. If a user attempts to register twice, PostgreSQL throws a unique violation (`error.code === '23505'`), which the controller catches and maps to HTTP 409 Conflict: `"You are already registered for this contest."`

#### 46. What indices should be added to the Supabase database to optimize standings generation under high contest load?
**Answer:**
1. `submissions(problem_code, created_at)`: Composite index to rapidly filter contest submissions within the time window.
2. `submissions(username)`: Index to accelerate user submission lookups.
3. `contest_registrations(contest_id, user_id)`: Index for membership checks.
4. `contests(contest_code)`: Unique index for contest lookups.

#### 47. How does the platform handle JWT expiration and invalid tokens?
**Answer:** JWT tokens are signed with an expiration window (`expiresIn: "1d"`). On protected operations, if a token has expired or the signature fails verification, `jwt.verify` throws a `TokenExpiredError` or `JsonWebTokenError`, returning HTTP 401 Unauthorized and prompting the client to redirect to `/login`.

#### 48. How does the system ensure cleanup of compiled binaries and source code in the `temp/` folder?
**Answer:** After testcase execution completes or when compilation fails, the temporary UUID directory is deleted using `fs.rmSync(tempDir, { recursive: true, force: true })` inside a `finally` block or completion callback. This prevents disk exhaustion from accumulated binary files.

#### 49. How could the system be scaled horizontally to support 25,000 simultaneous contest participants?
**Answer:**
1. **Decouple Judging via Queue:** Replace direct child-process execution with a distributed task broker (Redis + BullMQ or Celery) routing to an auto-scaling fleet of dedicated, core-pinned Linux judge sandboxes running `isolate`.
2. **Caching Standings:** Compute contest standings asynchronously on a 5-to-10-second interval worker and cache the resulting JSON in Redis, preventing repeated queries to PostgreSQL.
3. **Edge Asset Delivery:** Place problem statements and static assets behind a CDN (CloudFront / Cloudflare).

#### 50. Why does Code-It-Up enforce an explicit time window for contest submissions instead of relying on client-reported timestamps?
**Answer:** Client-reported timestamps are untrusted and can be manipulated by altering the operating system clock or falsifying request payloads. The server validates submissions exclusively against server-side UTC timestamps (`new Date()` and `submissions.created_at` generated by PostgreSQL `DEFAULT NOW()`), ensuring that no competitor can backdate a submission.

---
*End of 50 Architecture & System Questions.*
