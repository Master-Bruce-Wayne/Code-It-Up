import { Contest } from "../models/contestModel.js";

export const createNewContest = async (req, res) => {
    try {
        const {
        contestName,
        contestCode,
        startTime,
        duration,
        rated,
        problems,
        setters,
        testers
        } = req.body;

        if (!contestName || !contestCode || !startTime || !duration || !problems) {
            return res.status(400).json({
                success: false,
                message: "Fields are required"
            });
        }

        const existingContest = await Contest.findOne({ contestCode });
        if (existingContest) {
            return res.status(409).json({
                success: false,
                message: "Contest with this code already exists"
            });
        }

        const contest = await Contest.create({
        contestName,
        contestCode,
        startTime,
        duration,
        rated,
        problems,
        setters,
        testers
        });

        return res.status(201).json({
            success: true,
            message: "Contest created successfully",
            contest
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
        const contests = await Contest.find({});

        return res.status(200).json({
            success: true,
            count: contests.length,
            contests
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

        const contest = await Contest.findOne({ contestCode });
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        return res.status(200).json({
            success: true,
            contest
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};