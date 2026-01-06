import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { Submission } from "../models/submissionModel.js";
import { Problem } from "../models/problemModel.js";
import { v4 as uuid } from "uuid";
import { timeStamp } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        const problem = await Problem.findOne({ probCode });
        if (!problem)
        return res.json({ success: false, message: "Problem not found" });

        // unique dir for each submission
        const tempDir = path.join(__dirname, "../temp", uuid());
        fs.mkdirSync(tempDir, {recursive: true});

        let sourceFile = path.join(tempDir,"main.cpp");
        let execFile = path.join(tempDir,"main.exe");

        fs.writeFileSync(sourceFile,code);

        try {
            await runCommand(`g++ "${sourceFile}" -o "${execFile}"`);
        } catch(err) {
            await Submission.create({
                user: userId, username, 
                problem: problem._id, problemCode: probCode,
                language, code, 
                verdict: "CE"
            })

            return res.json({ success:false, message:"Code Compiled successfully!" ,verdict:"CE"})
        }
        
        // finding test cases
        const tcFolder = path.join(
            __dirname,
            `../assets/judge_data/${probCode}`
        );
        if(!fs.existsSync(tcFolder)){
            return res.json({
                success: false,
                message: "Test cases folder does not exists for the problem"
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
                const process = exec(`"${execFile}"`, { timeout: problem.timeLimit }, (err, stdout) => {
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

        await Submission.create({
            user:userId, username, problem: problem._id,
            problemCode:probCode, language, code, verdict
        })
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

        const submissions = await Submission
        .find({ username: username })
        .populate("problem", "probName probCode")
        .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: submissions.length,
            submissions
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

        const submissions = await Submission
        .find({ problem: problemId })
        .populate("user", "username email")
        .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: submissions.length,
            submissions
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

        const submissions = await Submission
        .find({ problemCode: problemCode })
        .populate("user", "username email")
        .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: submissions.length,
            submissions
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

        const submissions = await Submission
        .find({ username, problemCode })
        .populate("user", "username email")
        .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: submissions.length,
            submissions
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

        const result = []
        for(let i=0; i<26; i++) {
            const ch= String.fromCharCode(65+i);
            const problemCode = contestCode+ch;
            const probSub = await Submission.find({problemCode})
            
            if(probSub.length)  result.push(probSub)
        }
        result.sort((a, b) => b.createdAt - a.createdAt);

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

        const result = []
        for(let i=0; i<26; i++) {
            const ch= String.fromCharCode(65+i)
            const problemCode = contestCode+ch;
            const probSub = await Submission.find({username:username, problemCode:problemCode})

            if(probSub.length)  result.push(...probSub)
        }
        result.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({
            success: true,
            message: "User's Contest Submissions fetched successfully!",
            result
        })
    } catch(err) {
        return res.status(400).json({ success:false, message:err.message})
    }
}