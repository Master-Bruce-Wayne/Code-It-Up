import { supabase } from "../config/supabase.js";

// Helper function to map Supabase database columns to frontend camelCase properties
const mapProblemToFrontend = (p) => {
    if (!p) return null;
    return {
        _id: p.id,
        probName: p.prob_name,
        probCode: p.prob_code,
        timeLimit: p.time_limit,
        memoryLimit: p.memory_limit,
        probTags: p.prob_tags || [],
        probStatement: p.prob_statement,
        inputFormat: p.input_format,
        outputFormat: p.output_format,
        constraints: p.constraints,
        probRating: p.prob_rating,
        samples: p.samples || [],
        createdBy: p.created_by
    };
};

// Helper function to get IDs of problems associated with upcoming contests
const getRestrictedProblemIds = async () => {
    try {
        // Find all contests that have not started yet
        const { data: upcomingContests, error } = await supabase
            .from('contests')
            .select('id')
            .gt('start_time', new Date().toISOString());

        if (error || !upcomingContests || upcomingContests.length === 0) {
            return [];
        }

        const upcomingIds = upcomingContests.map(c => c.id);

        // Find all problems linked to these upcoming contests
        const { data: contestProblems, error: cpError } = await supabase
            .from('contest_problems')
            .select('problem_id')
            .in('contest_id', upcomingIds);

        if (cpError || !contestProblems) {
            return [];
        }

        return contestProblems.map(cp => cp.problem_id);
    } catch (err) {
        console.error("Error fetching restricted problem IDs:", err);
        return [];
    }
};

export const createProblem = async(req,res) =>{
    try {
        const {
            probName,
            probCode,
            timeLimit,
            memoryLimit,
            probTags,
            probStatement,
            inputFormat,
            outputFormat,
            constraints,
            probRating,
            samples,
            userId
        } = req.body;

        if (
            !probName ||
            !probCode ||
            !probTags ||
            !probStatement ||
            !inputFormat ||
            !outputFormat ||
            !constraints ||
            !probRating ||
            !samples ||
            !userId
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Check for duplicates in Supabase
        const { data: dupProb, error: findError } = await supabase
            .from('problems')
            .select('id')
            .or(`prob_name.eq.${probName},prob_code.eq.${probCode}`)
            .maybeSingle();

        if (findError) {
            return res.status(500).json({ success: false, message: findError.message });
        }

        if(dupProb) {
            return res.status(409).json({
                success: false,
                message: "Problem with same name or code already exists"
            });
        }
        
        const { data: problem, error: insertError } = await supabase
            .from('problems')
            .insert([{
                prob_name: probName,
                prob_code: probCode,
                time_limit: timeLimit || 2000,
                memory_limit: memoryLimit || 512,
                prob_tags: probTags,
                prob_statement: probStatement,
                input_format: inputFormat,
                output_format: outputFormat,
                constraints: constraints,
                prob_rating: probRating,
                samples: samples,
                created_by: userId
            }])
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ success: false, message: insertError.message });
        }

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: mapProblemToFrontend(problem)
        });

    } catch(err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const getAllProblems = async(req,res) => {
    try {
        const { data: problems, error } = await supabase
            .from('problems')
            .select('*');

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        const restrictedIds = await getRestrictedProblemIds();
        const filteredProblems = (problems || []).filter(p => !restrictedIds.includes(p.id));
        const formattedProblems = filteredProblems.map(mapProblemToFrontend);

        return res.status(200).json({
            success: true,
            message:"Problems fetched successfully",
            problems: formattedProblems
        });
    } catch(err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const getProblemByCode = async(req,res) => {
    try {
        const {probCode} = req.params;
        if(!probCode)  {
            return res.status(400).json({
                success:false,
                message: "Problem code is not provided"
            })
        }
        
        const { data: problem, error } = await supabase
            .from('problems')
            .select('*')
            .eq('prob_code', probCode)
            .maybeSingle();

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        // Access control: prevent leaks if linked to upcoming contests
        const restrictedIds = await getRestrictedProblemIds();
        if (restrictedIds.includes(problem.id)) {
            return res.status(403).json({
                success: false,
                message: "This problem is part of an upcoming contest and cannot be accessed yet."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem found",
            problem: mapProblemToFrontend(problem)
        });
    } catch(err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const getProblemById = async(req,res) => {
    try {
        const {id} = req.params;
        if(!id)  {
            return res.status(400).json({
                success:false,
                message: "Problem id is not provided"
            })
        }
        
        const { data: problem, error } = await supabase
            .from('problems')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        // Access control: prevent leaks if linked to upcoming contests
        const restrictedIds = await getRestrictedProblemIds();
        if (restrictedIds.includes(problem.id)) {
            return res.status(403).json({
                success: false,
                message: "This problem is part of an upcoming contest and cannot be accessed yet."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem found",
            problem: mapProblemToFrontend(problem)
        });
    } catch(err) {
        return res.status(400).json({
            success:false,
            message:err.message
        });
    }
}