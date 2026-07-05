import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { Trophy, Calendar, Clock, PlusCircle, Trash, Users, BookOpen, Sparkles } from "lucide-react";

const AddContest = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      contestName: "",
      contestCode: "",
      startTime: "",
      duration: "",
      rated: true,
      problems: [],
      setters: [],
      testers: []
    }
  });

  // field array for problems
  const { fields, append, remove } = useFieldArray({
    control,
    name: "problems"
  });

  // Data Lists
  const [problemList, setProblemList] = useState([]);
  const [userList, setUserList] = useState([]);

  // Fetch problems + users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await fetch(`${apiUrl}/problem/getAll`);
        const pData = await p.json();
        if (pData.success) setProblemList(pData.problems);

        const u = await fetch(`${apiUrl}/user/getAll`);
        const uData = await u.json();
        if (uData.success) setUserList(uData.users);
      } catch (err) {
        console.error("Fetching data failed", err);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/contest/create-new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          duration: Number(data.duration)
        })
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Failed to create contest");
      } else {
        toast.success("Contest created successfully 🎉");
        reset();
      }
    } catch (error) {
      toast.error("Server error while creating contest");
    }
  };

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-12 bg-slate-950 min-h-screen">
      <div className="mb-8 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
          <Trophy className="size-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create New Contest</h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
            Setup competitive coding rounds and bind problem lists
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-900/60 border border-slate-800 backdrop-blur-md p-8 rounded-3xl space-y-6 shadow-xl animate-scale-in"
      >
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Contest Title</label>
          <input
            placeholder="e.g., Starters Round #1"
            className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
            {...register("contestName", { required: "Contest name required" })}
          />
          {errors.contestName && (
            <p className="text-red-500 text-xs font-semibold mt-0.5">{errors.contestName.message}</p>
          )}
        </div>

        {/* Code, StartTime, Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Contest Code</label>
            <input
              placeholder="e.g., START1"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm uppercase"
              {...register("contestCode", { required: "Contest code required" })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Start Time</label>
            <input
              type="datetime-local"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              {...register("startTime", { required: "Start time required" })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 120"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              {...register("duration", { required: "Duration required" })}
            />
          </div>
        </div>

        {/* Rated Checkbox */}
        <div className="flex items-center gap-2 border border-slate-850 bg-slate-950/40 p-4 rounded-xl">
          <input 
            type="checkbox" 
            id="rated"
            className="size-4 text-indigo-600 border-slate-800 rounded bg-slate-950 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
            {...register("rated")} 
          />
          <label htmlFor="rated" className="text-sm font-semibold text-gray-300 cursor-pointer">
            Rated Contest (results will influence participant leaderboard points)
          </label>
        </div>

        {/* ---------- PROBLEMS SECTION ---------- */}
        <div className="border border-slate-850 bg-slate-955/40 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              <BookOpen className="size-4.5 text-indigo-400" />
              Linked Problems
            </h2>

            <button
              type="button"
              onClick={() => append({ index: "", problemId: "" })}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl btn-animate font-bold text-xs cursor-target shadow-md shadow-indigo-600/10"
            >
              <PlusCircle className="size-3.5" />
              Add Problem
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-gray-500 text-xs py-4 text-center">No problems added to this contest yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row gap-3 items-center border border-slate-850 p-4 rounded-xl bg-slate-900/30"
                >
                  <input
                    placeholder="Index (e.g., A)"
                    className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 w-full md:w-32 focus:outline-none focus:border-indigo-500 transition-all font-bold text-sm text-center uppercase"
                    {...register(`problems.${idx}.index`, { required: "Index required" })}
                  />

                  <select
                    className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white w-full focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                    {...register(`problems.${idx}.problemId`, { required: "Select problem" })}
                  >
                    <option value="">Select Problem from Registry</option>
                    {problemList?.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.probCode} — {p.probName} (Difficulty: {p.probRating})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="flex items-center justify-center p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all cursor-target flex-shrink-0"
                    title="Remove problem"
                  >
                    <Trash className="size-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- SETTERS & TESTERS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-850 bg-slate-955/40 p-6 rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <Users className="size-4.5 text-indigo-400" />
              Contest Setters
            </h2>
            <select
              multiple
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 h-32 focus:outline-none focus:border-indigo-500 text-sm text-gray-300 font-medium"
              {...register("setters")}
            >
              {userList?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-slate-850 bg-slate-955/40 p-6 rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <Users className="size-4.5 text-purple-400" />
              Contest Testers
            </h2>
            <select
              multiple
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 h-32 focus:outline-none focus:border-indigo-500 text-sm text-gray-300 font-medium"
              {...register("testers")}
            >
              {userList?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------- SUBMIT ---------- */}
        <button
          disabled={isSubmitting}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5 active:translate-y-0 cursor-target text-sm mt-4"
        >
          <Sparkles className="size-4" />
          {isSubmitting ? "Creating contest..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
};

export default AddContest;
