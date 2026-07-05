import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../context/User.jsx";
import { toast } from "react-toastify";
import { Plus, Trash, PlusCircle, Server, Code2, Cpu } from "lucide-react";

const AddProblems = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { userData } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      probName: "",
      probCode: "",
      probRating: "",
      timeLimit: 2000,
      memoryLimit: 512,
      probTags: "",
      probStatement: "",
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      samples: [{ input: "", output: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "samples",
  });

  const onSubmit = async (data) => {
    if (!userData?._id) {
      toast.warn("Login required. UserName missing!");
      return;
    }

    const payload = {
      ...data,
      probTags: data.probTags
        ? data.probTags.split(",").map((t) => t.trim())
        : [],
      probRating: Number(data.probRating),
      timeLimit: Number(data.timeLimit),
      memoryLimit: Number(data.memoryLimit),
      userId: userData._id,
    };

    try {
      const res = await axios.post(
        `${apiUrl}/problem/createNew`,
        payload,
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error("Problem creation failed");
        return;
      }

      toast.success("Problem created successfully 🎉");
      reset();
    } catch (err) {
      toast.error("Server error while creating problem");
    }
  };

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-12 bg-slate-950 min-h-screen">
      <div className="mb-8 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
          <Code2 className="size-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Add New Problem</h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
            Create standard problem instances for the public registry
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-900/60 border border-slate-800 backdrop-blur-md p-8 rounded-3xl space-y-6 shadow-xl animate-scale-in"
      >
        {/* Name, Code*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Problem Title</label>
            <input
              placeholder="e.g., Shortest Path Matrix"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              {...register("probName", {
                required: "Problem name is required",
              })}
            />
            {errors.probName && (
              <p className="text-red-500 text-xs font-semibold mt-0.5">
                {errors.probName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Problem Code</label>
            <input
              placeholder="e.g., 001A"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm uppercase"
              {...register("probCode", {
                required: "Problem code is required",
              })}
            />
          </div>
        </div>

        {/* Rating, Limits(time & mem) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Difficulty Rating</label>
            <input
              type="number"
              placeholder="e.g., 1200"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              {...register("probRating", {
                required: "Rating required",
              })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Time Limit (ms)</label>
            <input
              type="number"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              {...register("timeLimit")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Memory Limit (MB)</label>
            <input
              type="number"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              {...register("memoryLimit")}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Tags (comma separated)</label>
          <input
            placeholder="dp, graphs, math"
            className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
            {...register("probTags")}
          />
        </div>

        {/* prob statement */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Problem Statement</label>
          <textarea
            placeholder="Describe the problem details and background context..."
            className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm min-h-[120px]"
            {...register("probStatement", {
              required: "Problem statement required",
            })}
          />
        </div>

        {/* prob constraints */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Input Format</label>
            <textarea
              placeholder="Describe variables read from stdin..."
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm min-h-[100px]"
              {...register("inputFormat", {
                required: "Input format required",
              })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Output Format</label>
            <textarea
              placeholder="Describe outputs printed to stdout..."
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm min-h-[100px]"
              {...register("outputFormat", {
                required: "Output format required",
              })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Constraints</label>
            <textarea
              placeholder="e.g., 1 <= N <= 10^5"
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm min-h-[100px]"
              {...register("constraints", {
                required: "Constraints required",
              })}
            />
          </div>
        </div>

        {/* sample test cases */}
        <div className="border border-slate-850 bg-slate-950/40 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              <Cpu className="size-4.5 text-indigo-400" />
              Sample Test Cases
            </h2>

            <button
              type="button"
              onClick={() => append({ input: "", output: "" })}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl btn-animate font-bold text-xs cursor-target shadow-md shadow-indigo-600/10"
            >
              <PlusCircle className="size-3.5" />
              Add Sample
            </button>
          </div>

          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="border border-slate-850 p-4 rounded-xl space-y-3 bg-slate-900/30"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Sample Case #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline cursor-target"
                >
                  <Trash className="size-3.5" />
                  Remove
                </button>
              </div>

              <textarea
                placeholder="Sample Input (stdin)"
                className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-mono text-xs min-h-[80px]"
                {...register(`samples.${idx}.input`, {
                  required: true,
                })}
              />

              <textarea
                placeholder="Expected Output (stdout)"
                className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all font-mono text-xs min-h-[80px]"
                {...register(`samples.${idx}.output`, {
                  required: true,
                })}
              />
            </div>
          ))}
        </div>

        {/* submit button */}
        <button
          disabled={isSubmitting}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5 active:translate-y-0 cursor-target text-sm mt-4"
        >
          <Server className="size-4" />
          {isSubmitting ? "Creating problem..." : "Create Problem"}
        </button>
      </form>
    </div>
  );
};

export default AddProblems;
