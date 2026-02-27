"use client";

import { useState, useCallback } from "react";
import MovieForm from "@/app/components/MovieForm";
import MovieItem from "@/app/components/MovieItem";
import { Movie } from "@/types/movie";

type MovieDisplayProps = {
    initialMovies: Movie[];
};

export default function MovieDisplay({ initialMovies }: MovieDisplayProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);

    const fetchMovies = useCallback(async () => {
        try {
            const res = await fetch("/api/movies");
            const data = await res.json();
            setMovies(data);
        } catch (error) {
            console.error("Ошибка при загрузке фильмов:", error);
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">🎬 Каталог Кино</h1>

            <MovieForm onMovieAdded={fetchMovies} />

            <div className="grid gap-4">
                {movies.length === 0 ? (
                    <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">Фильмов пока нет...</p>
                ) : (
                    movies.map((movie) => (
                        <MovieItem
                            key={movie.id}
                            movie={movie}
                            onMovieDeleted={fetchMovies}
                            onMovieUpdated={fetchMovies}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
