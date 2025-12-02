"use client";

import { useEffect, useState } from "react";
import config from "../../config";
import Card from "../card";
import type { movie } from "../types";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
const baseURL = config.baseURL;

export default function Movies() {
    const params = useParams();
    const router = useRouter();

    const rawId = params?.userId;
    const userId = Array.isArray(rawId) ? rawId[0] : rawId;

    const [moviesData, setMoviesData] = useState<movie[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Pagination states
    const [page, setPage] = useState(1);
    const pageSize = 8;

    const totalPages = Math.ceil(moviesData.length / pageSize);

    const currentMovies = moviesData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const fetchMovies = async () => {
        try {
            const res = await fetch(`${baseURL}/movies/${userId}`);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setMoviesData(data);
            setPage(1); // Reset to page 1 on fetch
        } catch (error) {
            setError("Failed to fetch movies");
        }
    };

    useEffect(() => {
        if (userId) fetchMovies();
    }, [userId]);

    const handleAddMovie = () => {
        router.push(`/movies/${userId}/create?operation=create`);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        router.push("/login");
    };

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-8">
                <h1>{error}</h1>
            </div>
        );
    }

    if (moviesData.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-8">
                <h1>Your movie list is empty</h1>
                <button
                    onClick={handleAddMovie}
                    className="primary-button w-full md:w-[300px]"
                >
                    Add Movie
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-3xl md:text-[48px]">My movies</h2>
                    <button className="cursor-pointer" onClick={handleAddMovie}>
                        <IoMdAddCircleOutline className="text-3xl md:text-[48px]" />
                    </button>
                </div>
                <button
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleLogout}
                >
                    <span className="font-bold text-[16px] hidden md:block">
                        Logout
                    </span>
                    <MdOutlineLogout className="text-[30px]" />
                </button>
            </div>

            {/* Movies Grid Only Current Page */}
            <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {currentMovies.map((mov) => (
                    <Card key={mov.id} movie={mov} fetchMovie={fetchMovies} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-5 mb-10">
                <button
                    className="px-4 py-2 cursor-pointer rounded disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span className="font-semibold">
                    {page} / {totalPages}
                </span>

                <button
                    className="px-4 py-2 cursor-pointer rounded disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
