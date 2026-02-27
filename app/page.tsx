"use client";

import { useEffect, useState, useCallback } from "react";

type Movie = {
    id: number;
    title: string;
    director: string;
    year: number;
    rating: number;
};

export default function Home() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [form, setForm] = useState({ title: "", director: "", year: "", rating: "" });

    // Состояния для красивого редактирования оценки (вместо prompt)
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState<string>("");

    // Обернули в useCallback, чтобы избежать "cascading renders" в useEffect
    const fetchMovies = useCallback(async () => {
        try {
            const res = await fetch("/api/movies");
            const data = await res.json();
            setMovies(data);
        } catch (error) {
            console.error("Ошибка при загрузке фильмов:", error);
        }
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // CREATE: Добавление фильма
    const handleAddMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setForm({ title: "", director: "", year: "", rating: "" });
        fetchMovies();
    };

    // DELETE: Удаление фильма
    const handleDelete = async (id: number) => {
        await fetch(`/api/movies/${id}`, { method: "DELETE" });
        fetchMovies();
    };

    // UPDATE: Сохранение новой оценки через UI
    const handleSaveRating = async (movie: Movie) => {
        if (!editRating || isNaN(Number(editRating))) return;

        // Отправляем все данные фильма + новую оценку
        await fetch(`/api/movies/${movie.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...movie, rating: Number(editRating) }),
        });

        setEditingId(null); // Выключаем режим редактирования
        fetchMovies(); // Обновляем список
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">🎬 Каталог Кино</h1>

                {/* Форма добавления */}
                <form
                    onSubmit={handleAddMovie}
                    className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 flex-wrap items-end"
                >
                    <div className="flex flex-col flex-1 min-w-[150px]">
                        <label className="text-sm text-gray-600 mb-1">Название</label>
                        <input
                            required
                            type="text"
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
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col w-24">
                        <label className="text-sm text-gray-600 mb-1">Оценка</label>
                        <input
                            required
                            type="number"
                            step="0.1"
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

                {/* Список фильмов */}
                <div className="grid gap-4">
                    {movies.length === 0 ? (
                        <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">Фильмов пока нет...</p>
                    ) : (
                        movies.map((movie) => (
                            <div
                                key={movie.id}
                                className="bg-white p-4 rounded-lg shadow border flex justify-between items-center transition hover:shadow-md"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {movie.title}{" "}
                                        <span className="text-sm font-normal text-gray-500">({movie.year})</span>
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">Режиссер: {movie.director}</p>

                                    {/* Логика отображения: Режим редактирования ИЛИ обычный просмотр */}
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

                                {/* Кнопки действий */}
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
