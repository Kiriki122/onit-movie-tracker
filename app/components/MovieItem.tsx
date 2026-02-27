"use client";

import { Movie } from "@/types/movie";
import { useState } from "react";

type MovieItemProps = {
    movie: Movie;
    onMovieDeleted: () => void;
    onMovieUpdated: () => void;
};

export default function MovieItem({ movie, onMovieDeleted, onMovieUpdated }: MovieItemProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState<string>("");

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/movies/${id}`, { method: "DELETE" });
            onMovieDeleted();
        } catch (error) {
            console.error("Ошибка при удалении фильма:", error);
        }
    };

    const handleSaveRating = async (currentMovie: Movie) => {
        if (!editRating || isNaN(Number(editRating))) {
            alert("Пожалуйста, введите корректную оценку.");
            return;
        }

        try {
            await fetch(`/api/movies/${currentMovie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...currentMovie, rating: Number(editRating) }),
            });
            setEditingId(null);
            onMovieUpdated();
        } catch (error) {
            console.error("Ошибка при обновлении оценки:", error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border flex justify-between items-center transition hover:shadow-md">
            <div>
                <h2 className="text-xl font-semibold">
                    {movie.title} <span className="text-sm font-normal text-gray-500">({movie.year})</span>
                </h2>
                <p className="text-gray-600 text-sm mt-1">Режиссер: {movie.director}</p>

                {editingId === movie.id ? (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-yellow-600 font-bold text-sm">⭐ Оценка:</span>
                        <input
                            type="number"
                            step="0.1"
                            className="border p-1 rounded w-20 text-sm focus:ring-2 outline-none"
                            value={editRating}
                            onChange={(e) => setEditRating(e.target.value)}
                            autoFocus
                        />
                        <button
                            onClick={() => handleSaveRating(movie)}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition text-sm font-medium"
                        >
                            Сохранить
                        </button>
                        <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition text-sm font-medium"
                        >
                            Отмена
                        </button>
                    </div>
                ) : (
                    <p className="text-yellow-600 font-bold mt-2 flex items-center gap-1 text-sm">
                        ⭐ Оценка: {movie.rating}
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                {editingId !== movie.id && (
                    <button
                        onClick={() => {
                            setEditingId(movie.id);
                            setEditRating(movie.rating.toString());
                        }}
                        className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 transition text-sm font-medium"
                    >
                        Изменить оценку
                    </button>
                )}
                <button
                    onClick={() => handleDelete(movie.id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition text-sm font-medium"
                >
                    Удалить
                </button>
            </div>
        </div>
    );
}
