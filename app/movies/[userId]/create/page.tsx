"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import config from "@/app/config";

const baseURL = config.baseURL;

// ------------------------------------
// ✔ ZOD SCHEMA
// ------------------------------------
const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    publishingYear: z
        .string()
        .min(1, "Publishing year is required")
        .regex(/^[0-9]{4}$/, "Year must be a valid 4-digit number"),
    poster: z
        .instanceof(File, { message: "Poster is required" })
        .or(z.any().refine((val) => val instanceof File, "Poster is required")),
});

type MovieFormData = z.infer<typeof movieSchema>;

export default function CreateUpdateMovie() {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();

    const rawId = params?.userId;
    const userId = Array.isArray(rawId) ? rawId[0] : rawId;

    const id = searchParams.get("id");
    const isCreate = searchParams.get("operation") === "create";

    const [preview, setPreview] = useState<string | null>(null);

    // ------------------------------------
    // ✔ React Hook Form Setup
    // ------------------------------------
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<MovieFormData>({
        resolver: zodResolver(movieSchema),
        defaultValues: {
            title: searchParams.get("title") || "",
            publishingYear: searchParams.get("publishingYear") || "",
        },
    });

    // ------------------------------------
    // ✔ Dropzone for file upload
    // ------------------------------------
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setValue("poster", file, { shouldValidate: true });
            setPreview(URL.createObjectURL(file));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
    });

    // ------------------------------------
    // ✔ Submit Handler
    // ------------------------------------
    const onSubmitForm = async (formDataValues: MovieFormData) => {
        const formData = new FormData();

        formData.append("userId", userId!);
        formData.append("title", formDataValues.title);
        formData.append("publishingYear", formDataValues.publishingYear);
        formData.append("poster", formDataValues.poster);

        let url = `${baseURL}/movies`;
        let method = "POST";

        if (!isCreate && id) {
            url = `${baseURL}/movies/${id}`;
            method = "PUT";
        }

        await fetch(url, { method, body: formData });
        router.push(`/movies/${userId}`);
    };

    // ------------------------------------
    // ✔ Cancel Handler
    // ------------------------------------
    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-[48px] font-semibold">
                {isCreate ? "Create a new movie" : "Edit movie"}
            </h1>

            <form onSubmit={handleSubmit(onSubmitForm)} className="mt-5 lg:mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">

                    {/* ---------------------- FILE UPLOAD ---------------------- */}
                    <div className="flex flex-col gap-3 min-h-[200px] md:min-h-[450px]">
                        <div
                            {...getRootProps()}
                            className={
                                `border-2 flex justify-center items-center h-full border-dashed rounded-xl p-6 cursor-pointer text-center transition
                                ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-500 bg-[#224957]"}
                            `}
                        >
                            <input {...getInputProps()} />

                            {preview ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={preview}
                                        alt="Poster Preview"
                                        className="w-32 h-40 object-cover rounded-md"
                                    />
                                    <p className="mt-2 text-sm text-gray-200">
                                        {watch("poster")?.name}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-200">
                                    {isDragActive ? "Drop image here…" : "Drop an image here"}
                                </p>
                            )}
                        </div>

                        {errors.poster?.message && (
                            <p className="text-red-400 text-sm">
                                {String(errors.poster.message)}
                            </p>
                        )}

                    </div>

                    {/* ---------------------- TEXT FIELDS ---------------------- */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                className="input"
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="number"
                                placeholder="Publishing Year"
                                className="input"
                                {...register("publishingYear")}
                            />
                            {errors.publishingYear && (
                                <p className="text-red-400 text-sm">
                                    {errors.publishingYear.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center mt-6">
                            <button
                                onClick={handleCancel}
                                className="cancel-button w-full md:w-[300px]"
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="primary-button w-full md:w-[300px]"
                                type="submit"
                            >
                                {isCreate ? "Submit" : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
