"use server";

import MovieDisplay from "@/app/components/MovieDisplay";
import { prisma } from "@/lib/prisma";
import { Movie } from "@/types/movie";


export default async function Home() {
    const movies: Movie[] = await prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
            <MovieDisplay initialMovies={movies} />
        </div>
    );
}
