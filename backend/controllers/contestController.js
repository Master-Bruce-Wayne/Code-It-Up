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

        const formattedContests = (contests || []).map(mapContestToFrontend);

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

        return res.status(200).json({
            success: true,
            contest: mapContestToFrontend(contest)
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};