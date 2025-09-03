import z from "zod";
import { MAX_RESULTS_BASIC_SEARCH } from "../config";

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
