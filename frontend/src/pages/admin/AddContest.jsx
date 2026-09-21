import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { Trophy, Calendar, Clock, PlusCircle, Trash, Users, BookOpen, Sparkles } from "lucide-react";
import AnnotationMarker from "../../components/AnnotationMarker.jsx";

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
        toast.success("Contest created successfully");
        reset();
      }
    } catch (error) {
      toast.error("Server error while creating contest");
    }
  };

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 bg-canvas blueprint-grid min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 border-2 border-ink bg-surface shadow-[2px_2px_0_0_#17181A]">
            <Trophy className="size-6 text-ink" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-mono text-ink tracking-tight uppercase">Create New Contest</h1>
            <p className="text-xs text-ink/60 font-mono font-bold uppercase tracking-wider mt-1">
              Setup competitive coding rounds and bind problem lists
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface border-2 border-ink p-8 space-y-8 shadow-[4px_4px_0_0_#17181A] relative"
        >
          <AnnotationMarker top left />
          <AnnotationMarker top right />
          <AnnotationMarker bottom left />
          <AnnotationMarker bottom right />

          {/* Name */}
          <div className="flex flex-col gap-1.5 relative z-10">
            <label className="text-xs font-mono font-bold text-ink uppercase">Contest Title</label>
            <input
              placeholder="e.g., Starters Round #1"
              className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
              {...register("contestName", { required: "Contest name required" })}
            />
            {errors.contestName && (
              <p className="text-red-600 text-xs font-mono font-bold mt-0.5">{errors.contestName.message}</p>
            )}
          </div>

          {/* Code, StartTime, Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Contest Code</label>
              <input
                placeholder="e.g., START1"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm uppercase"
                {...register("contestCode", { required: "Contest code required" })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Start Time</label>
              <input
                type="datetime-local"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("startTime", { required: "Start time required" })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 120"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("duration", { required: "Duration required" })}
              />
            </div>
          </div>

          {/* Rated Checkbox */}
          <div className="flex items-center gap-3 border-2 border-ink/20 bg-canvas p-4 relative z-10">
            <input 
              type="checkbox" 
              id="rated"
              className="size-4 accent-ink cursor-pointer"
              {...register("rated")} 
            />
            <label htmlFor="rated" className="text-xs font-mono font-bold text-ink uppercase cursor-pointer">
              Rated Contest (results will influence participant leaderboard points)
            </label>
          </div>

          {/* ---------- PROBLEMS SECTION ---------- */}
          <div className="border-2 border-ink/20 bg-canvas p-6 space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b-2 border-ink/10 pb-4">
              <h2 className="text-sm font-mono font-bold text-ink uppercase flex items-center gap-2">
                <BookOpen className="size-4" />
                Linked Problems
              </h2>

              <button
                type="button"
                onClick={() => append({ index: "", problemId: "" })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-canvas hover:bg-ink/90 font-mono font-bold text-xs uppercase cursor-pointer transition-colors border-2 border-transparent hover:border-ink hover:text-ink hover:bg-canvas"
              >
                <PlusCircle className="size-3.5" />
                Add Problem
              </button>
            </div>

            {fields.length === 0 ? (
              <p className="text-ink/50 text-xs font-mono py-4 text-center uppercase">No problems added to this contest yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex flex-col md:flex-row gap-3 items-center border-2 border-ink/20 p-4 bg-surface"
                  >
                    <input
                      placeholder="Index (A)"
                      className="p-2.5 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 w-full md:w-32 focus:outline-none focus:border-ink transition-colors font-mono font-bold text-sm text-center uppercase"
                      {...register(`problems.${idx}.index`, { required: "Index required" })}
                    />

                    <select
                      className="p-2.5 bg-canvas border-2 border-ink/20 text-ink w-full focus:outline-none focus:border-ink transition-colors font-mono text-sm"
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
                      className="flex items-center justify-center p-2.5 bg-canvas text-ink border-2 border-ink/20 hover:border-ink hover:bg-ink hover:text-canvas transition-colors cursor-pointer flex-shrink-0"
                      title="Remove problem"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- SETTERS & TESTERS ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="border-2 border-ink/20 bg-canvas p-6 space-y-4">
              <h2 className="text-sm font-mono font-bold text-ink uppercase flex items-center gap-2 border-b-2 border-ink/10 pb-2">
                <Users className="size-4" />
                Contest Setters
              </h2>
              <select
                multiple
                className="w-full bg-surface border-2 border-ink/20 p-3 h-32 focus:outline-none focus:border-ink text-sm font-mono text-ink"
                {...register("setters")}
              >
                {userList?.map((u) => (
                  <option key={u._id} value={u._id} className="py-1">
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-2 border-ink/20 bg-canvas p-6 space-y-4">
              <h2 className="text-sm font-mono font-bold text-ink uppercase flex items-center gap-2 border-b-2 border-ink/10 pb-2">
                <Users className="size-4" />
                Contest Testers
              </h2>
              <select
                multiple
                className="w-full bg-surface border-2 border-ink/20 p-3 h-32 focus:outline-none focus:border-ink text-sm font-mono text-ink"
                {...register("testers")}
              >
                {userList?.map((u) => (
                  <option key={u._id} value={u._id} className="py-1">
                    {u.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ---------- SUBMIT ---------- */}
          <button
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full md:w-auto bg-ink hover:bg-ink/90 text-canvas px-8 py-3.5 font-mono font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-ink hover:text-ink hover:bg-canvas cursor-pointer relative z-10"
          >
            <Sparkles className="size-4" />
            {isSubmitting ? "Creating contest..." : "Create Contest"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContest;
