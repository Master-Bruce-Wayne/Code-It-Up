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