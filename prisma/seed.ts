import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const movies = [
    { title: "Интерстеллар", director: "Кристофер Нолан", year: 2014, rating: 9.0 },
    { title: "Матрица", director: "Лана и Лилли Вачовски", year: 1999, rating: 8.7 },
    { title: "Криминальное чтиво", director: "Квентин Тарантино", year: 1994, rating: 8.9 },
    { title: "Дюна", director: "Дени Вильнёв", year: 2021, rating: 8.2 }
  ]

  console.log('Начинаем заполнение базы данных...')
  for (const movie of movies) {
    const createdMovie = await prisma.movie.create({
      data: movie
    })
    console.log(`Добавлен фильм: ${createdMovie.title}`)
  }
  console.log('База данных успешно заполнена!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })