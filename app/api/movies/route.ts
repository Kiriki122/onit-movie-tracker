import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Получить все фильмы
export async function GET() {
    const movies = await prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(movies);
}

// POST: Добавить фильм
export async function POST(request: Request) {
    const body = await request.json();
    const { title, director, year, rating } = body;

    const newMovie = await prisma.movie.create({
        data: {
            title,
            director,
            year: Number(year),
            rating: Number(rating),
        },
    });

    return NextResponse.json(newMovie);
}
