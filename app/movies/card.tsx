"use client";

import { movie as movieType } from "./types";
import { MdEdit, MdDelete } from "react-icons/md";
import config from "../config";
import { useRouter } from "next/navigation";
import axios from "axios";

const assetsURL = config.staticAssets;

interface CardProps {
    movie: movieType;
    fetchMovie: () => void;
}

export default function Card({ movie, fetchMovie }: CardProps) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(
            `/movies/${movie.userId}/create?operation=update&id=${movie.id}&title=${movie.title}&publishingYear=${movie.publishingYear}`
        );
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.baseURL}/movies/${movie.id}`);
            fetchMovie();
        } catch (error) {
            console.log("Failed to delete:", error);
        }
    };

    return (
        <div className="bg-card-bg p-2 h-[380px] w-[250px] rounded-lg flex flex-col gap-2 bg-[#092C39]">
            <img
                src={`${assetsURL}/uploads/${movie.poster}`}
                alt={movie.title}
                className="w-full h-[300px] object-cover rounded-md mb-2"
            />
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{movie.title}</h2>

                    <div className="flex gap-2">
                        <MdEdit
                            title="Edit movie details"
                            onClick={handleEdit}
                            className="text-2xl cursor-pointer"
                        />
                        <MdDelete
                            title="Delete movie"
                            onClick={handleDelete}
                            className="text-2xl cursor-pointer"
                        />
                    </div>
                </div>

                <p className="text-sm text-gray-400">{movie.publishingYear}</p>
            </div>
        </div>
    );
}
