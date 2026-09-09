import z from "zod";
import {
  MAX_RESULTS_BASIC_SEARCH,
  MAX_RESULTS_DETAILED_SEARCH,
} from "../config";

export const getBookResultSchema = z.object({
  id: z.string(),
  volumeInfo: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1).optional(),
    averageRating: z.number().optional(),
    publishedDate: z.coerce.date().optional(),
    description: z.string().optional(),
    pageCount: z.coerce.number(),
    imageLinks: z.object({
      thumbnail: z.url(),
    }),
  }),
});

export type GetBookResult = z.infer<typeof getBookResultSchema>;

export const BasicSearchResultSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        volumeInfo: z.object({
          title: z.string(),
          authors: z.array(z.string()).min(1),
          averageRating: z.number().optional(),
          imageLinks: z.object({
            thumbnail: z.url(),
          }),
        }),
      }),
    )
    .max(MAX_RESULTS_BASIC_SEARCH),
});

export type BasicSearchResult = z.infer<typeof BasicSearchResultSchema>;

export const DetailSearchResultSchema = z.object({
  items: z.array(getBookResultSchema).max(MAX_RESULTS_DETAILED_SEARCH),
});

export type DetailSearchResult = z.infer<typeof DetailSearchResultSchema>;
