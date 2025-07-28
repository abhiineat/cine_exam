"use client";

// import { useEffect } from "react";

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // useEffect(() => {
    //     const fetchDenoBackend = async () => {
    //         const response = await fetch("/api/fetch-token");
    //         const data = await response.json();
    //         console.log("token", data.token);
    //         const res = await fetch(`${backendUrl}/api/exams`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${data.token}`,
    //             },
    //         }); 
    //         if (!res.ok) {
    //             console.error("Failed to fetch exams:", res.statusText);
    //             return;
    //         }
    //         const exams = await res.json();
    //         console.log("Exams fetched successfully:", exams);
    //     };

    //     fetchDenoBackend();
    // }, []);
    return <div>{children}</div>;
}
