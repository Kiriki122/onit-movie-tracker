import { GET } from "@/app/api/movies/route";
import { prisma } from "@/lib/prisma";

describe("API: /api/movies", () => {
    beforeAll(async () => {
        await prisma.movie.deleteMany({});
        await prisma.movie.create({
            data: {
                title: "Тестовый фильм для CI",
                director: "Тестовый режиссер",
                year: 2025,
                rating: 10,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test("GET /api/movies должен вернуть список с тестовым фильмом", async () => {
        const response = await GET();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(1);
        expect(data[0].title).toBe("Тестовый фильм для CI");
    });
});
