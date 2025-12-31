import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { Submission } from "../models/submissionModel.js";
import { Problem } from "../models/problemModel.js";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- UTIL -----------

const runCommand = (cmd, options = {}) =>
    new Promise((resolve, reject) => {
        exec(cmd, options, (err, stdout, stderr) => {
        if (err) return reject(stderr || stdout || "Execution Error");
        resolve(stdout);
        });
    });

// ---------- RUN (Custom Input) ----------

export const runCode = async (req, res) => {
    try {
        const { code, language, input } = req.body;

        if (!code || !language)
        return res.json({ success: false, message: "Missing fields" });

        const tempDir = path.join(__dirname, "../temp", uuid());
        fs.mkdirSync(tempDir, { recursive: true });

        let runFile = "";
        let execFile = "";

        if (language === "cpp") {
        runFile = path.join(tempDir, "main.cpp");
        execFile = path.join(tempDir, "main.exe");

        fs.writeFileSync(runFile, code);

        try {
            await runCommand(`g++ "${runFile}" -o "${execFile}"`);
        } catch {
            return res.json({ success: false, output: "Compilation Error" });
        }

        try {
            const result = await runCommand(`"${execFile}"`, {
            timeout: 2000,
            });

            const process = exec(`"${execFile}"`, { timeout: 2000 }, () => {});
            if (input) {
            process.stdin.write(input);
            process.stdin.end();
            }

            return res.json({ success: true, output: result });
        } catch {
            return res.json({ success: false, output: "Runtime Error / TLE" });
        }
        }

        return res.json({ success: false, message: "Language not supported yet" });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// ---------- SUBMIT (Judge) ----------

export const submitSolution = async (req, res) => {
    try {
        const { code, language, problemId, userId } = req.body;

        if (!code || !language || !problemId || !userId)
        return res.json({ success: false, message: "Missing fields" });

        const problem = await Problem.findById(problemId);
        if (!problem)
        return res.json({ success: false, message: "Problem not found" });

        const tempDir = path.join(__dirname, "../temp", uuid());
        fs.mkdirSync(tempDir, { recursive: true });

        let sourceFile = path.join(tempDir, "main.cpp");
        let execFile = path.join(tempDir, "main.exe");

        // ---- build ----
        fs.writeFileSync(sourceFile, code);

        try {
            await runCommand(`g++ "${sourceFile}" -o "${execFile}"`);
        } catch {
            await Submission.create({
                user: userId,
                problem: problemId,
                language,
                code,
                verdict: "CE",
            });
            return res.json({ success: true, verdict: "CE" });
        }

        // ---- judge ----
        const tcFolder = path.join(
            __dirname,
            `../assets/judge_data/${problem.probCode}`
        );

        if (!fs.existsSync(tcFolder))
        return res.json({
            success: false,
            message: "Judge data not found for this problem",
        });

        const inputs = fs
        .readdirSync(tcFolder)
        .filter((f) => f.startsWith("input"));

        let verdict = "AC";

        for (let file of inputs) {
        const num = file.match(/\d+/)[0];

        const input = fs.readFileSync(
            path.join(tcFolder, `input${num}.txt`),
            "utf8"
        );
        const expected = fs.readFileSync(
            path.join(tcFolder, `output${num}.txt`),
            "utf8"
        );

        try {
            const output = await new Promise((resolve, reject) => {
            const process = exec(`"${execFile}"`, { timeout: 2000 }, (err, stdout) => {
                if (err) return reject("TLE");
                resolve(stdout);
            });

            process.stdin.write(input);
            process.stdin.end();
            });

            if (output.trim() !== expected.trim()) {
                verdict = "WA";
                break;
            }
        } catch {
            verdict = "TLE";
            break;
        }
        }

        await Submission.create({
            user: userId,
            problem: problemId,
            language,
            code,
            verdict,
        });

        return res.json({ success: true, verdict });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

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

export const getContestSubmissions = async(req,res) => {

}