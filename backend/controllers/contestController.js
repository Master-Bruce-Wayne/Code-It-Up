import { supabase } from "../config/supabase.js";

// Helper function to map a single contest from Supabase database columns + joined relation to camelCase format
const mapContestToFrontend = (c) => {
    if (!c) return null;
    return {
        _id: c.id,
        contestName: c.contest_name,
        contestCode: c.contest_code,
        startTime: c.start_time,
        duration: c.duration,
        rated: c.rated,
        setters: c.setters || [],
        testers: c.testers || [],
        problems: (c.contest_problems || []).map(cp => ({
            problemId: cp.problem_id,
            index: cp.index_code
        }))
    };
};

export const createNewContest = async (req, res) => {
    try {
        const {
            contestName,
            contestCode,
            startTime,
            duration,
            rated,
            problems, // Array of { problemId, index }
            setters,
            testers
        } = req.body;

        if (!contestName || !contestCode || !startTime || !duration || !problems) {
            return res.status(400).json({
                success: false,
                message: "Fields are required"
            });
        }

        // Check if contest code already exists
        const { data: existingContest, error: findError } = await supabase
            .from('contests')
            .select('id')
            .eq('contest_code', contestCode)
            .maybeSingle();

        if (findError) {
            return res.status(500).json({ success: false, message: findError.message });
        }

        if (existingContest) {
            return res.status(409).json({
                success: false,
                message: "Contest with this code already exists"
            });
        }

        // Insert contest record
        const { data: contest, error: insertError } = await supabase
            .from('contests')
            .insert([{
                contest_name: contestName,
                contest_code: contestCode,
                start_time: startTime,
                duration: duration,
                rated: rated !== undefined ? rated : true,
                setters: setters || [],
                testers: testers || []
            }])
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ success: false, message: insertError.message });
        }

        // Insert problems relations into junction table
        if (problems && problems.length > 0) {
            const contestProblemsData = problems.map(p => ({
                contest_id: contest.id,
                problem_id: p.problemId,
                index_code: p.index
            }));

            const { error: relationError } = await supabase
                .from('contest_problems')
                .insert(contestProblemsData);

            if (relationError) {
                return res.status(500).json({ success: false, message: relationError.message });
            }
        }

        // Return created contest structure
        // Since we inserted problems, let's fetch the full object again with relations
        const { data: fullContest, error: fetchError } = await supabase
            .from('contests')
            .select('*, contest_problems(problem_id, index_code)')
            .eq('id', contest.id)
            .single();

        if (fetchError) {
            return res.status(500).json({ success: false, message: fetchError.message });
        }

        return res.status(201).json({
            success: true,
            message: "Contest created successfully",
            contest: mapContestToFrontend(fullContest)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllContests = async (req, res) => {
    try {
        const { data: contests, error } = await supabase
            .from('contests')
            .select('*, contest_problems(problem_id, index_code)');

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        const formattedContests = (contests || []).map(c => {
            const mapped = mapContestToFrontend(c);
            const upcoming = new Date(c.start_time) > new Date();
            if (upcoming) {
                mapped.problems = []; // Hide problem details for upcoming contests
            }
            return mapped;
        });

        return res.status(200).json({
            success: true,
            count: formattedContests.length,
            contests: formattedContests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getContestByCode = async (req, res) => {
    try {
        const { contestCode } = req.params;

        const { data: contest, error } = await supabase
            .from('contests')
            .select('*, contest_problems(problem_id, index_code)')
            .eq('contest_code', contestCode)
            .maybeSingle();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        const mapped = mapContestToFrontend(contest);
        const upcoming = new Date(contest.start_time) > new Date();
        if (upcoming) {
            mapped.problems = []; // Clear problems array for upcoming contests
        }

        return res.status(200).json({
            success: true,
            contest: mapped
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const registerForContest = async (req, res) => {
    try {
        const { contestCode } = req.params;
        const { userId, isRated } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Find contest first
        const { data: contest, error: findError } = await supabase
            .from('contests')
            .select('id')
            .eq('contest_code', contestCode)
            .maybeSingle();

        if (findError || !contest) {
            return res.status(404).json({ success: false, message: "Contest not found" });
        }

        // Insert into contest_registrations
        const { error: registerError } = await supabase
            .from('contest_registrations')
            .insert([{
                contest_id: contest.id,
                user_id: userId,
                is_rated: isRated !== undefined ? isRated : true
            }]);

        if (registerError) {
            // Check if user is already registered (unique constraint violation)
            if (registerError.code === '23505') {
                return res.status(409).json({ success: false, message: "You are already registered for this contest." });
            }
            return res.status(500).json({ success: false, message: registerError.message });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully registered for the contest!"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRegistrationStatus = async (req, res) => {
    try {
        const { contestCode, userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Find contest first
        const { data: contest, error: findError } = await supabase
            .from('contests')
            .select('id')
            .eq('contest_code', contestCode)
            .maybeSingle();

        if (findError || !contest) {
            return res.status(404).json({ success: false, message: "Contest not found" });
        }

        // Query registration
        const { data: registration, error: regError } = await supabase
            .from('contest_registrations')
            .select('is_rated')
            .eq('contest_id', contest.id)
            .eq('user_id', userId)
            .maybeSingle();

        if (regError) {
            return res.status(500).json({ success: false, message: regError.message });
        }

        return res.status(200).json({
            success: true,
            registered: !!registration,
            isRated: registration ? registration.is_rated : false
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ---------------------------------------------------------------------------
// GET /contest/:contestCode/standings
// ICPC-style standings: rank by solved desc, then penalty asc.
// Penalty = solve_time_in_minutes + 20min × wrong_attempts_before_AC per problem.
// Only submissions within the contest window count.
// Only registered participants appear in the table.
// ---------------------------------------------------------------------------
export const getContestStandings = async (req, res) => {
    try {
        const { contestCode } = req.params;

        // 1. Fetch contest metadata + its problem list
        const { data: contest, error: contestError } = await supabase
            .from('contests')
            .select('id, contest_name, start_time, duration, contest_problems(problem_id, index_code)')
            .eq('contest_code', contestCode)
            .maybeSingle();

        if (contestError || !contest) {
            return res.status(404).json({ success: false, message: 'Contest not found' });
        }

        const contestStart = new Date(contest.start_time);
        const contestEnd   = new Date(contestStart.getTime() + contest.duration * 60 * 1000);

        // Build ordered list of problem index letters  e.g. ['A','B','C']
        const problemIndices = (contest.contest_problems || [])
            .map(cp => cp.index_code)
            .sort();

        // 2. Fetch all registered participants
        const { data: registrations, error: regError } = await supabase
            .from('contest_registrations')
            .select('user_id, is_rated, profiles(username)')
            .eq('contest_id', contest.id);

        if (regError) {
            return res.status(500).json({ success: false, message: regError.message });
        }

        if (!registrations || registrations.length === 0) {
            return res.status(200).json({
                success: true,
                contestName: contest.contest_name,
                contestCode,
                duration: contest.duration,
                problemIndices,
                contestStart: contestStart.toISOString(),
                contestEnd: contestEnd.toISOString(),
                standings: []
            });
        }

        // Map userId → { username, is_rated }
        const participantMap = {};
        for (const reg of registrations) {
            const username = reg.profiles?.username || reg.user_id;
            participantMap[reg.user_id] = { username, isRated: reg.is_rated };
        }

        // 3. Fetch all submissions for this contest within the contest window
        const { data: submissions, error: subError } = await supabase
            .from('submissions')
            .select('user_id, username, problem_code, verdict, created_at')
            .like('problem_code', `${contestCode}%`)
            .gte('created_at', contestStart.toISOString())
            .lte('created_at', contestEnd.toISOString())
            .order('created_at', { ascending: true });

        if (subError) {
            return res.status(500).json({ success: false, message: subError.message });
        }

        // 4. Build per-user, per-problem submission state
        //    Seed every registered user so they appear even with 0 solves
        const userData = {};
        for (const [userId, info] of Object.entries(participantMap)) {
            userData[userId] = { username: info.username, isRated: info.isRated, problems: {} };
            for (const idx of problemIndices) {
                userData[userId].problems[idx] = { attempts: 0, firstAcTime: null, verdict: null };
            }
        }

        // Process submissions (already ordered ascending by time)
        for (const sub of submissions || []) {
            const userId = sub.user_id;
            if (!userData[userId]) continue; // skip non-registered submitters

            // Derive index letter: 'CODEFORCE2026A' - 'CODEFORCE2026' = 'A'
            const index = sub.problem_code.replace(contestCode, '');
            if (!problemIndices.includes(index)) continue;

            const cell = userData[userId].problems[index];
            if (cell.firstAcTime !== null) continue; // already solved; ignore further subs

            if (sub.verdict === 'AC') {
                const solveMs  = new Date(sub.created_at) - contestStart;
                cell.firstAcTime = Math.floor(solveMs / 60000);
                cell.verdict     = 'AC';
            } else {
                cell.attempts += 1;
                cell.verdict   = sub.verdict;
            }
        }

        // 5. Compute scores and build rows
        const rows = [];
        for (const [userId, info] of Object.entries(userData)) {
            let solved  = 0;
            let penalty = 0;
            const problemCells = {};

            for (const idx of problemIndices) {
                const cell = info.problems[idx];
                if (cell.firstAcTime !== null) {
                    const probPenalty = cell.firstAcTime + cell.attempts * 20;
                    solved  += 1;
                    penalty += probPenalty;
                    problemCells[idx] = {
                        verdict:  'AC',
                        attempts: cell.attempts + 1, // includes the AC attempt
                        time:     cell.firstAcTime,
                        penalty:  probPenalty,
                    };
                } else {
                    problemCells[idx] = {
                        verdict:  cell.attempts > 0 ? (cell.verdict || 'WA') : null,
                        attempts: cell.attempts,
                        time:     null,
                        penalty:  0,
                    };
                }
            }

            rows.push({ userId, username: info.username, isRated: info.isRated, solved, penalty, problems: problemCells });
        }

        // 6. Sort: solved desc → penalty asc
        rows.sort((a, b) => b.solved !== a.solved ? b.solved - a.solved : a.penalty - b.penalty);

        // 7. Assign ranks (ties share the same rank)
        let rank = 1;
        for (let i = 0; i < rows.length; i++) {
            if (i > 0 && (rows[i].solved !== rows[i - 1].solved || rows[i].penalty !== rows[i - 1].penalty)) {
                rank = i + 1;
            }
            rows[i].rank = rank;
        }

        return res.status(200).json({
            success: true,
            contestName: contest.contest_name,
            contestCode,
            duration: contest.duration,
            problemIndices,
            contestStart: contestStart.toISOString(),
            contestEnd:   contestEnd.toISOString(),
            standings: rows,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
