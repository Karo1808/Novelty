import { z } from "@hono/zod-openapi";
import { BasicSearchResultSchema } from "@novelty/lib/validations/book";

export const basicSearchQuerySchema = z.object({
  query: z
    .string()
    .min(1)
    .max(50)
    .openapi({
      example: "query",
      description: "any search query",
    })
    .openapi("searchQuery"),
});

export const basicSearchSuccessSchema = z
  .object({
    data: BasicSearchResultSchema,
    success: z.literal(true),
  })
  .openapi({
    example: {
      success: true,
      data: {
        items: [
          {
            id: "OHclhBVv-X4C",
            volumeInfo: {
              title: "The Way of Kings",
              authors: ["Brandon Sanderson"],
              averageRating: 4.5,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=OHclhBVv-X4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "rGvfAwAAQBAJ",
            volumeInfo: {
              title: "Brandon Sanderson Sampler",
              authors: ["Brandon Sanderson"],
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=rGvfAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "C1k5BAAAQBAJ",
            volumeInfo: {
              title: "Three Fantasies - Tales from the Cosmere",
              authors: ["Brandon Sanderson"],
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=C1k5BAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "-eIDAAAAMBAJ",
            volumeInfo: {
              title: "Backpacker",
              averageRating: 3.5,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=-eIDAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "294DAAAAMBAJ",
            volumeInfo: {
              title: "Backpacker",
              averageRating: 5,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=294DAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
        ],
      },
    },
  });
