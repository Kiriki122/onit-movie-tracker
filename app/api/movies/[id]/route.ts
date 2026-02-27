import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT: Обновить фильм (принимает ID)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const body = await request.json();
    const { title, director, year, rating } = body;

    const updatedMovie = await prisma.movie.update({
        where: { id: Number(id) },
        data: {
            title, // если undefined, prisma просто проигнорирует (но лучше явно проверять)
            director,
            year: year ? Number(year) : undefined,
            rating: rating ? Number(rating) : undefined,
        },
    });

    return NextResponse.json(updatedMovie);
}

// DELETE: Удалить фильм (принимает ID)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await prisma.movie.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Фильм удален" });
}
