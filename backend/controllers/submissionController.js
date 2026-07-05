import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { supabase } from "../config/supabase.js";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to map submission db row to frontend camelCase format
const mapSubmissionToFrontend = (s) => {
    if (!s) return null;
    return {
        _id: s.id,
        user: s.profiles ? {
            _id: s.user_id,
            username: s.profiles.username,
            email: s.profiles.email
        } : s.user_id,
        username: s.username,
        problem: s.problems ? {
            _id: s.problem_id,
            probName: s.problems.prob_name,
            probCode: s.problems.prob_code
        } : s.problem_id,
        problemCode: s.problem_code,
        language: s.language,
        code: s.code,
        verdict: s.verdict,
        timeTaken: s.time_taken,
        memoryUsed: s.memory_used,
        createdAt: s.created_at
    };
};

// Util functions
const runCommand = (cmd, options = {}) =>
    new Promise((resolve, reject) => {
        exec(cmd, options, (err, stdout, stderr) => {
            if (err) return reject(stderr || stdout || "Execution Error");
            resolve(stdout);
        });
    });

function mapRuntimeVerdict(err) {
    if (!err) return null;

    if (err.killed && err.signal === "SIGKILL") {
        return "TLE";
    }

    if (err.signal === "SIGSEGV") {
        return "SIGSEGV";
    }

    if (err.signal === "SIGABRT") {
        return "RTE";
    }

    if (err.signal === "SIGFPE") {
        return "RTE";
    }

    if (err.code !== 0) {
        return "RTE";
    }

    return "RTE";
}

// running judge     
export const runCode = async (req, res) => {
    try {
        const { code, language, input } = req.body;

        if (!code || !language) {
            return res.json({ success: false, message: "Missing fields" });
        }

        const tempDir = path.join(__dirname, "../temp", uuid());
        fs.mkdirSync(tempDir, { recursive: true });

        if (language !== "cpp") {
            return res.json({ success: false, message: "Language not supported yet" });
        }

        const sourceFile = path.join(tempDir, "main.cpp");
        const execFile = path.join(tempDir, "main.exe");

        fs.writeFileSync(sourceFile, code);

        try {
            await runCommand(`g++ "${sourceFile}" -o "${execFile}"`);
        } catch {
            return res.json({
                success: true,
                verdict: "CE",
                output: "Compilation Error"
            });
        }

        try {
            const output = await new Promise((resolve, reject) => {
                const child = exec(
                    `"${execFile}"`,
                    { timeout: 2000 },
                    (err, stdout, stderr) => {
                        if (err) {
                            return reject(mapRuntimeVerdict(err));
                        }
                        resolve(stdout);
                    }
                );

                if (input) {
                    child.stdin.write(input);
                }
                child.stdin.end();
            });

            return res.json({
                success: true,
                verdict: "AC",
                output
            });

        } catch (verdict) {
            return res.json({
                success: true,
                verdict,
                output: verdict === "TLE" ? "Time Limit Exceeded" : "Runtime Error"
            });
        }

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// Submitting Judge
export const submitSolution = async (req, res) => {
    try {
        const { code, language, probCode, username, userId } = req.body;

        if (!code || !language || !probCode || !username || !userId)
            return res.json({ success: false, message: "Missing fields" });

        if (language !== "cpp") {
            return res.json({ success: false, message: "Language not supported yet" });
        }

        // Fetch problem from Supabase
        const { data: problem, error: pError } = await supabase
            .from('problems')
            .select('*')
            .eq('prob_code', probCode)
            .maybeSingle();

        if (pError || !problem) {
            return res.json({ success: false, message: "Problem not found" });
        }

        // unique dir for each submission
        const tempDir = path.join(__dirname, "../temp", uuid());
        fs.mkdirSync(tempDir, {recursive: true});

        let sourceFile = path.join(tempDir,"main.cpp");
        let execFile = path.join(tempDir,"main.exe");

        fs.writeFileSync(sourceFile,code);

        try {
            await runCommand(`g++ "${sourceFile}" -o "${execFile}"`);
        } catch(err) {
            // Save CE submission in Supabase
            await supabase.from('submissions').insert([{
                user_id: userId,
                username,
                problem_id: problem.id,
                problem_code: probCode,
                language,
                code,
                verdict: "CE"
            }]);

            return res.json({ success:false, message:"Code compiled with errors." ,verdict:"CE"})
        }
        
        // finding test cases
        const tcFolder = path.join(
            __dirname,
            `../assets/judge_data/${probCode}`
        );
        if(!fs.existsSync(tcFolder)){
            return res.json({
                success: false,
                message: "Test cases folder does not exist for the problem"
            })
        };

        const inputs = fs.readdirSync(tcFolder).filter((f) => f.startsWith("input"));

        let verdict = "AC";

        for(let file of inputs) {
            const tcNum = file.match(/\d+/)[0];
            const input = fs.readFileSync(
                path.join(tcFolder, `input${tcNum}.txt`), 
                "utf8"
            );
            const expected = fs.readFileSync(
                path.join(tcFolder, `output${tcNum}.txt`),
                "utf8"
            );

            try {
                const output = await new Promise((resolve, reject) => {
                    const process = exec(`"${execFile}"`, { timeout: problem.time_limit }, (err, stdout) => {
                        if (err) {
                            const v = mapRuntimeVerdict(err);
                            return reject(v);
                        }
                        resolve(stdout);
                    });

                    process.stdin.write(input);
                    process.stdin.end();
                });

                if (output.trim() !== expected.trim()) {
                    verdict = "WA";
                    break;
                }
            } catch(v) {
                verdict = v; break;
            }
        }

        // Insert final submission in Supabase
        await supabase.from('submissions').insert([{
            user_id: userId,
            username,
            problem_id: problem.id,
            problem_code: probCode,
            language,
            code,
            verdict
        }]);

        return res.json({
            success: true,
            message: "Submitted code successfully compiled!",
            verdict
        })

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// User All Submissions
export const getUserSubmissions = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username)
            return res.json({ success: false, message: "User ID required" });

        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*, problems(prob_name, prob_code)')
            .eq('username', username)
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, message: error.message });
        }

        const formattedSubmissions = (submissions || []).map(mapSubmissionToFrontend);

        return res.json({
            success: true,
            count: formattedSubmissions.length,
            submissions: formattedSubmissions
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// A specific Problem Submissions
export const getProblemSubmissionsById = async (req, res) => {
    try {
        const { problemId } = req.params;

        if (!problemId)
            return res.json({ success: false, message: "Problem ID required" });

        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*, profiles(username, email)')
            .eq('problem_id', problemId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, message: error.message });
        }

        const formattedSubmissions = (submissions || []).map(mapSubmissionToFrontend);

        return res.json({
            success: true,
            count: formattedSubmissions.length,
            submissions: formattedSubmissions
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export const getProblemSubmissionsByCode = async (req, res) => {
    try {
        const { problemCode } = req.params;

        if (!problemCode)
            return res.json({ success: false, message: "Problem Code required" });

        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*, profiles(username, email)')
            .eq('problem_code', problemCode)
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, message: error.message });
        }

        const formattedSubmissions = (submissions || []).map(mapSubmissionToFrontend);

        return res.json({
            success: true,
            count: formattedSubmissions.length,
            submissions: formattedSubmissions
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// User submissions for problem
export const getUserProblemSubmissions = async (req, res) => {
    try {
        const { problemCode,username } = req.params;

        if (!problemCode || !username)
            return res.json({ success: false, message: "Problem Code and username required" });

        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*, profiles(username, email)')
            .eq('username', username)
            .eq('problem_code', problemCode)
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, message: error.message });
        }

        const formattedSubmissions = (submissions || []).map(mapSubmissionToFrontend);

        return res.json({
            success: true,
            count: formattedSubmissions.length,
            submissions: formattedSubmissions
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// Contest All Submissions
export const getContestSubmissions = async(req,res) => {
    try {
        const {contestCode} =req.params;

        if(!contestCode) {
            return res.status(400).json({
                success: false,
                message:"Contest Code not provided!"
            })
        }

        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*')
            .like('problem_code', `${contestCode}%`);

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        const grouped = {};
        for (const s of submissions || []) {
            const formatted = {
                _id: s.id,
                user: s.user_id,
                username: s.username,
                problem: s.problem_id,
                problemCode: s.problem_code,
                language: s.language,
                code: s.code,
                verdict: s.verdict,
                timeTaken: s.time_taken,
                memoryUsed: s.memory_used,
                createdAt: s.created_at
            };
            if (!grouped[s.problem_code]) {
                grouped[s.problem_code] = [];
            }
            grouped[s.problem_code].push(formatted);
        }

        const result = [];
        for (let i = 0; i < 26; i++) {
            const ch = String.fromCharCode(65 + i);
            const pCode = contestCode + ch;
            if (grouped[pCode] && grouped[pCode].length > 0) {
                grouped[pCode].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                result.push(grouped[pCode]);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Contest Submissions fetched successfully!",
            result
        })
    } catch(err) {
        return res.status(400).json({ success:false, message:err.message})
    }
}

// User submissions on contest
export const getUserContestSubmissions = async(req,res) => {
    try {
        const {contestCode,username} =req.params;

        if(!contestCode || !username) {
            return res.status(400).json({
                success: false,
                message:"Contest Code or username not provided!"
            })
        }

        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('username', username)
            .like('problem_code', `${contestCode}%`)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        const result = (submissions || []).map(s => ({
            _id: s.id,
            user: s.user_id,
            username: s.username,
            problem: s.problem_id,
            problemCode: s.problem_code,
            language: s.language,
            code: s.code,
            verdict: s.verdict,
            timeTaken: s.time_taken,
            memoryUsed: s.memory_used,
            createdAt: s.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "User's Contest Submissions fetched successfully!",
            result
        })
    } catch(err) {
        return res.status(400).json({ success:false, message:err.message})
    }
}