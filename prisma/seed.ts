import { Movie } from "@/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const moviesToAdd: Omit<Movie, "id" | "createdAt">[] = [
        { title: "Интерстеллар", director: "Кристофер Нолан", year: 2014, rating: 9.0 },
        { title: "Матрица", director: "Лана и Лилли Вачовски", year: 1999, rating: 8.7 },
        { title: "Криминальное чтиво", director: "Квентин Тарантино", year: 1994, rating: 8.9 },
        { title: "Дюна", director: "Дени Вильнёв", year: 2021, rating: 8.2 },
        { title: "Начало", director: "Кристофер Нолан", year: 2010, rating: 8.8 },
        { title: "Зеленая миля", director: "Фрэнк Дарабонт", year: 1999, rating: 9.1 },
        { title: "Властелин колец: Возвращение короля", director: "Питер Джексон", year: 2003, rating: 8.9 },
        { title: "Побег из Шоушенка", director: "Фрэнк Дарабонт", year: 1994, rating: 9.3 },
        { title: "Форрест Гамп", director: "Роберт Земекис", year: 1994, rating: 8.8 },
        { title: "Тёмный рыцарь", director: "Кристофер Нолан", year: 2008, rating: 9.0 },
    ];

    console.log("Начинаем заполнение базы данных...");

    await prisma.movie.deleteMany({});
    console.log("Существующие фильмы удалены.");

    for (const movieData of moviesToAdd) {
        const createdMovie = await prisma.movie.create({
            data: movieData,
        });
        console.log(`Добавлен фильм: ${createdMovie.title}`);
    }
    console.log("База данных успешно заполнена!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
