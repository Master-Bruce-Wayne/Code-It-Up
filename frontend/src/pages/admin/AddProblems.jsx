import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../context/User.jsx";
import { toast } from "react-toastify";

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
      // alert("Login required. UserName missing!");
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
        // alert(res.data.message || "Problem creation failed");
        toast.error("Problem creation failed");
        return;
      }

      // alert("Problem created successfully 🎉");
      toast.success("Problem created successfully 🎉");
      reset();
    } catch (err) {
      // console.error(err);
      // alert("Server error while creating problem");
      toast.error("Server error while creating problem");
    }
  };

  return (
    <div className="w-full px-20 mx-auto py-10 bg-white">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">
        Add New Problem
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-6 rounded-lg border border-gray-100 space-y-6 box-animate animate-scale-in"
      >
        {/* Name, Code*/}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="font-semibold block mb-1">
              Problem Name
            </label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("probName", {
                required: "Problem name is required",
              })}
            />
            {errors.probName && (
              <p className="text-red-500 text-sm">
                {errors.probName.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Problem Code
            </label>
            <input
              className="w-full p-3 border rounded-lg uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("probCode", {
                required: "Problem code is required",
              })}
            />
          </div>
        </div>

        {/* Rating, Limits(time & mem) */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="font-semibold block mb-1">
              Rating
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("probRating", {
                required: "Rating required",
              })}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Time Limit (ms)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("timeLimit")}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Memory Limit (MB)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("memoryLimit")}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="font-semibold block mb-1">
            Tags (comma separated)
          </label>
          <input
            placeholder="dp, graphs, math"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("probTags")}
          />
        </div>

        {/* prob statement */}
        <div>
          <label className="font-semibold block mb-1">
            Problem Statement
          </label>
          <textarea
            className="w-full p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("probStatement", {
              required: "Problem statement required",
            })}
          />
        </div>

        {/* prob constraints */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="font-semibold block mb-1">
              Input Format
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("inputFormat", {
                required: "Input format required",
              })}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Output Format
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("outputFormat", {
                required: "Output format required",
              })}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Constraints
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              {...register("constraints", {
                required: "Constraints required",
              })}
            />
          </div>
        </div>

        {/* sample test cases */}
        <div className="border rounded-lg p-4 bg-white box-animate">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Samples</h2>

            <button
              type="button"
              onClick={() => append({ input: "", output: "" })}
              className="px-4 py-2 bg-green-600 text-white rounded-lg btn-animate font-semibold"
            >
              + Add Sample
            </button>
          </div>

          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="border p-3 rounded-lg mb-3 space-y-2 bg-white box-animate"
            >
              <p className="font-semibold">Sample {idx + 1}</p>

              <textarea
                placeholder="Sample Input"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                {...register(`samples.${idx}.input`, {
                  required: true,
                })}
              />

              <textarea
                placeholder="Sample Output"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                {...register(`samples.${idx}.output`, {
                  required: true,
                })}
              />

              <button
                type="button"
                onClick={() => remove(idx)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg btn-animate font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* submit buttons */}
        <button
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg btn-animate font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Problem"}
        </button>
      </form>
    </div>
  );
};

export default AddProblems;
