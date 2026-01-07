import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

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
        // console.log("Fetching data failed");
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
        // alert(result.message || "Failed to create contest");
        toast.error("Failed to create contest");
      } else {
        // alert("Contest created successfully 🎉");
        toast.success("Contest created successfully 🎉")
        reset();
      }
    } catch (error) {
      // alert("Server error while creating contest");
      toast.error("Server error while creating contest");
    }
  };

  return (
    <div className="w-full px-20 mx-auto py-10 bg-white">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Create New Contest</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-6 rounded-lg border border-gray-100 space-y-6 box-animate animate-scale-in"
      >
        {/* ---------- BASIC INFO ---------- */}
        <div>
          <label className="font-semibold block mb-1">Contest Name</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("contestName", { required: "Contest name required" })}
          />
          {errors.contestName && (
            <p className="text-red-500 text-sm">{errors.contestName.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold block mb-1">Contest Code</label>
          <input
            className="w-full p-3 border rounded-lg uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("contestCode", { required: "Contest code required" })}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Start Time</label>
          <input
            type="datetime-local"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("startTime", { required: "Start time required" })}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">
            Duration (in minutes)
          </label>
          <input
            type="number"
            min="1"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("duration", { required: "Duration required" })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("rated")} />
          <span className="font-semibold">Rated Contest</span>
        </div>

        {/* ---------- PROBLEMS SECTION ---------- */}
        <div className="border rounded-lg p-4 bg-white box-animate">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Problems</h2>

            <button
              type="button"
              onClick={() =>
                append({ index: "", problemId: "" })
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg btn-animate font-semibold"
            >
              + Add Problem
            </button>
          </div>

          {fields.length === 0 && (
            <p className="text-gray-500">No problems added.</p>
          )}

          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-3 items-center mb-3 border p-3 rounded-lg bg-white box-animate"
            >
              {/* Problem Index like A,B,C */}
              <input
                placeholder="Index (A/B/C)"
                className="p-2 border rounded-lg w-full md:w-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                {...register(`problems.${idx}.index`, {
                  required: "Index required"
                })}
              />

              {/* Problem Select */}
              <select
                className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                {...register(`problems.${idx}.problemId`, {
                  required: "Select problem"
                })}
              >
                <option value="">Select Problem</option>
                {problemList?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.probCode} — {p.probName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => remove(idx)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg btn-animate font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ---------- SETTERS ---------- */}
        <div className="border rounded-lg p-4 bg-white box-animate">
          <h2 className="text-xl font-semibold mb-2">Setters</h2>

          <select
            multiple
            className="w-full border rounded-lg p-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("setters")}
          >
            {userList?.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- TESTERS ---------- */}
        <div className="border rounded-lg p-4 bg-white box-animate">
          <h2 className="text-xl font-semibold mb-2">Testers</h2>

          <select
            multiple
            className="w-full border rounded-lg p-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            {...register("testers")}
          >
            {userList?.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- SUBMIT ---------- */}
        <button
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg btn-animate font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
};

export default AddContest;

