import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../context/User.jsx";
import { toast } from "react-toastify";
import { Plus, Trash, PlusCircle, Server, Code2, Cpu } from "lucide-react";
import AnnotationMarker from "../../components/AnnotationMarker.jsx";

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

      toast.success("Problem created successfully");
      reset();
    } catch (err) {
      toast.error("Server error while creating problem");
    }
  };

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 bg-canvas blueprint-grid min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 border-2 border-ink bg-surface shadow-[2px_2px_0_0_#17181A]">
            <Code2 className="size-6 text-ink" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-mono text-ink tracking-tight uppercase">Add New Problem</h1>
            <p className="text-xs text-ink/60 font-mono font-bold uppercase tracking-wider mt-1">
              Create standard problem instances for the public registry
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

          {/* Name, Code*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Problem Title</label>
              <input
                placeholder="e.g., Shortest Path Matrix"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("probName", {
                  required: "Problem name is required",
                })}
              />
              {errors.probName && (
                <p className="text-red-600 text-xs font-mono font-bold mt-0.5">
                  {errors.probName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Problem Code</label>
              <input
                placeholder="e.g., 001A"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm uppercase"
                {...register("probCode", {
                  required: "Problem code is required",
                })}
              />
            </div>
          </div>

          {/* Rating, Limits(time & mem) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Difficulty Rating</label>
              <input
                type="number"
                placeholder="e.g., 1200"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("probRating", {
                  required: "Rating required",
                })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Time Limit (ms)</label>
              <input
                type="number"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("timeLimit")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Memory Limit (MB)</label>
              <input
                type="number"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("memoryLimit")}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5 relative z-10">
            <label className="text-xs font-mono font-bold text-ink uppercase">Tags (comma separated)</label>
            <input
              placeholder="dp, graphs, math"
              className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
              {...register("probTags")}
            />
          </div>

          {/* prob statement */}
          <div className="flex flex-col gap-1.5 relative z-10">
            <label className="text-xs font-mono font-bold text-ink uppercase">Problem Statement</label>
            <textarea
              placeholder="Describe the problem details and background context..."
              className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm min-h-[120px]"
              {...register("probStatement", {
                required: "Problem statement required",
              })}
            />
          </div>

          {/* prob constraints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Input Format</label>
              <textarea
                placeholder="Describe variables read from stdin..."
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm min-h-[100px]"
                {...register("inputFormat", {
                  required: "Input format required",
                })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Output Format</label>
              <textarea
                placeholder="Describe outputs printed to stdout..."
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm min-h-[100px]"
                {...register("outputFormat", {
                  required: "Output format required",
                })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-ink uppercase">Constraints</label>
              <textarea
                placeholder="e.g., 1 <= N <= 10^5"
                className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm min-h-[100px]"
                {...register("constraints", {
                  required: "Constraints required",
                })}
              />
            </div>
          </div>

          {/* sample test cases */}
          <div className="border-2 border-ink/20 bg-canvas p-6 space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b-2 border-ink/10 pb-4">
              <h2 className="text-sm font-mono font-bold text-ink uppercase flex items-center gap-2">
                <Cpu className="size-4" />
                Sample Test Cases
              </h2>

              <button
                type="button"
                onClick={() => append({ input: "", output: "" })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-canvas hover:bg-ink/90 font-mono font-bold text-xs uppercase cursor-pointer transition-colors border-2 border-transparent hover:border-ink hover:text-ink hover:bg-canvas"
              >
                <PlusCircle className="size-3.5" />
                Add Sample
              </button>
            </div>

            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="border-2 border-ink/20 p-4 space-y-3 bg-surface"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-ink/60 uppercase">Sample Case #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-ink hover:underline cursor-pointer"
                  >
                    <Trash className="size-3.5" />
                    Remove
                  </button>
                </div>

                <textarea
                  placeholder="Sample Input (stdin)"
                  className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm min-h-[80px]"
                  {...register(`samples.${idx}.input`, {
                    required: true,
                  })}
                />

                <textarea
                  placeholder="Expected Output (stdout)"
                  className="w-full p-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm min-h-[80px]"
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
            className="flex items-center justify-center gap-2 w-full md:w-auto bg-ink hover:bg-ink/90 text-canvas px-8 py-3.5 font-mono font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-ink hover:text-ink hover:bg-canvas cursor-pointer relative z-10"
          >
            <Server className="size-4" />
            {isSubmitting ? "Creating problem..." : "Create Problem"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblems;
