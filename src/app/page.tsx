"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ studentNumber: "", password: "" });
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    studentNumber: string;
    password: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);


  const router = useRouter();

  const validate = () => {
    const newErrors = { studentNumber: "", password: "" };
    if (!studentNumber) newErrors.studentNumber = "Student number is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return !newErrors.studentNumber && !newErrors.password;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      router.push("/dashboard");
    }
  };


  const scrambleText = () =>
    Math.random().toString(36).substring(2, 10).toUpperCase();

  const generateCredentials = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    let scrambleInterval = setInterval(() => {
      setGeneratedCredentials({
        studentNumber: `23CS${Math.floor(Math.random() * 9000 + 1000)}`,
        password: scrambleText(),
      });
    }, 50);

    setTimeout(() => {
      clearInterval(scrambleInterval);
      const newCreds = {
        studentNumber: `23CS${Math.floor(Math.random() * 9000 + 1000)}`,
        password: Math.random().toString(36).slice(-8),
      };
      setGeneratedCredentials(newCreds);
      setStudentNumber(newCreds.studentNumber);
      setPassword(newCreds.password);
      setIsGenerating(false);
    }, 1000);
  };


  useEffect(() => {
    generateCredentials();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4 py-10">
      <div className="border border-neutral-700 bg-neutral-800 rounded-3xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        {/* Login Form */}
        <div className="p-8 border-r border-neutral-700">
          <div className="flex flex-col items-center mb-6">
            <Image src="/csi-logo.webp" alt="CSI Logo" width={80} height={80} />
            <h1 className="text-2xl font-semibold text-white mt-4">
              CINE&apos;24{" "}
              <span className="text-base italic font-medium text-neutral-400">
                by CSI
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Number */}
            <div className="relative">
              <input
                type="text"
                id="studentNumber"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="peer w-full bg-neutral-700 text-white border border-neutral-600 rounded-full px-5 py-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Student Number"
              />
              <label
                htmlFor="studentNumber"
                className={`pointer-events-none absolute left-5 text-md transition-all ${
                  studentNumber
                    ? "top-[-10px] text-sm text-white"
                    : "top-4 text-base text-neutral-400 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-white"
                }`}
              >
                Student Number
              </label>
              {errors.studentNumber && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.studentNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-neutral-700 text-white border border-neutral-600 rounded-full px-5 py-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className={`pointer-events-none absolute left-5 text-md transition-all ${
                  password
                    ? "top-[-10px] text-sm text-white"
                    : "top-4 text-base text-neutral-400 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-white"
                }`}
              >
                Password
              </label>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700/60 hover:bg-blue-800/60 text-white py-3 rounded-full font-semibold transition duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-md hover:shadow-lg"
            >
              🚀 Login
            </button>
          </form>
        </div>

        {/* Credentials Display */}
        <div className="p-8 border-l border-neutral-700 text-white">
          <h2 className="text-xl font-semibold mb-6">🔐 Mock Credentials</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-md font-semibold mb-1 block">
                Student No:
              </label>
              <div className="bg-blue-500/40 text-white font-mono rounded-lg px-4 py-2 border-[1px] border-neutral-500">
                {generatedCredentials?.studentNumber}
              </div>
            </div>

            <div>
              <label className="text-md font-semibold mb-1 block">
                Password:
              </label>
              <div className="bg-green-500/40 text-white font-mono rounded-lg px-4 py-2 border-[1px] border-neutral-500">
                {generatedCredentials?.password}
              </div>
            </div>
          </div>

          <button
            onClick={generateCredentials}
            disabled={isGenerating}
            className={`w-full relative overflow-hidden px-5 py-3 rounded-full font-semibold transition duration-200 ease-in-out transform ${
              isGenerating
                ? "bg-blue-900 text-white cursor-not-allowed"
                : "bg-blue-700/50 hover:bg-blue-800/50 text-white shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-95"
            }`}
          >
            {isGenerating ? "✨ Generating..." : "♻️ Regenerate"}

            {/* Shimmer effect */}
            {isGenerating && (
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
