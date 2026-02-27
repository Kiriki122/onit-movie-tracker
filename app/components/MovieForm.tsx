"use client";

import { useState } from "react";

type MovieFormProps = {
    onMovieAdded: () => void;
};

export default function MovieForm({ onMovieAdded }: MovieFormProps) {
    const [form, setForm] = useState({ title: "", director: "", year: "", rating: "" });

    const handleAddMovie = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setForm({ title: "", director: "", year: "", rating: "" });
            onMovieAdded();
        } catch (error) {
            console.error("Ошибка при добавлении фильма:", error);
        }
    };

    return (
        <form
            onSubmit={handleAddMovie}
            className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 flex-wrap items-end"
        >
            <div className="flex flex-col flex-1 min-w-[150px]">
                <label className="text-sm text-gray-600 mb-1">Название</label>
                <input
                    required
                    type="text"
                    minLength={2}
                    maxLength={255}
                    className="border p-2 rounded focus:ring-2 outline-none"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
                <label className="text-sm text-gray-600 mb-1">Режиссер</label>
                <input
                    required
                    type="text"
                    minLength={2}
                    maxLength={255}
                    className="border p-2 rounded focus:ring-2 outline-none"
                    value={form.director}
                    onChange={(e) => setForm({ ...form, director: e.target.value })}
                />
            </div>
            <div className="flex flex-col w-24">
                <label className="text-sm text-gray-600 mb-1">Год</label>
                <input
                    required
                    type="number"
                    className="border p-2 rounded focus:ring-2 outline-none"
                    value={form.year}
                    min={1888}
                    max={new Date().getFullYear() + 10}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
            </div>
            <div className="flex flex-col w-24">
                <label className="text-sm text-gray-600 mb-1">Оценка</label>
                <input
                    required
                    type="number"
                    step="0.1"
                    min={1}
                    max={10}
                    className="border p-2 rounded focus:ring-2 outline-none"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
            >
                Добавить
            </button>
        </form>
    );
}
