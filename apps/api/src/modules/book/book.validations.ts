import { z } from "@hono/zod-openapi";
import {
  BasicSearchResultSchema,
  DetailSearchResultSchema,
  getBookResultSchema,
} from "@novelty/lib/validations/book";

export const getBookParams = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      param: { name: "id", in: "path", required: true },
      example: "3b64f41e-ae2b-4f7b-9f8d-1f9a5b6a6c2e",
    }),
});

export const getBookSuccessSchema = z
  .object({
    data: getBookResultSchema,
    success: z.literal(true),
  })
  .openapi({
    example: {
      success: true,
      data: {
        id: "OHclhBVv-X4C",
        volumeInfo: {
          title: "The Way of Kings",
          authors: ["Brandon Sanderson"],
          averageRating: 4.5,
          publishedDate: "2010-08-31T00:00:00.000Z",
          description:
            "From #1 New York Times bestselling author Brandon Sanderson, The Way of Kings, Book One of the Stormlight Archive, begins an incredible new saga of epic proportion. Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the topography offers shelter. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain: mystical swords and suits of armor that transform ordinary men into near-invincible warriors. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them. One such war rages on a ruined landscape called the Shattered Plains. There, Kaladin, who traded his medical apprenticeship for a spear to protect his little brother, has been reduced to slavery. In a war that makes no sense, where ten armies fight separately against a single foe, he struggles to save his men and to fathom the leaders who consider them expendable. Brightlord Dalinar Kholin commands one of those other armies. Like his brother, the late king, he is fascinated by an ancient text called The Way of Kings. Troubled by over-powering visions of ancient times and the Knights Radiant, he has begun to doubt his own sanity. Across the ocean, an untried young woman named Shallan seeks to train under an eminent scholar and notorious heretic, Dalinar's niece, Jasnah. Though she genuinely loves learning, Shallan's motives are less than pure. As she plans a daring theft, her research for Jasnah hints at secrets of the Knights Radiant and the true cause of the war. The result of over ten years of planning, writing, and world-building, The Way of Kings is but the opening movement of the Stormlight Archive, a bold masterpiece in the making. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. and return to men the Shards they once bore. The Knights Radiant must stand again. Other Tor books by Brandon Sanderson The Cosmere The Stormlight Archive ● The Way of Kings ● Words of Radiance ● Edgedancer (novella) ● Oathbringer ● Dawnshard (novella) ● Rhythm of War The Mistborn Saga The Original Trilogy ● Mistborn ● The Well of Ascension ● The Hero of Ages Wax and Wayne ● The Alloy of Law ● Shadows of Self ● The Bands of Mourning ● The Lost Metal Other Cosmere novels ● Elantris ● Warbreaker ● Tress of the Emerald Sea ● Yumi and the Nightmare Painter ● The Sunlit Man Collection ● Arcanum Unbounded: The Cosmere Collection The Alcatraz vs. the Evil Librarians series ● Alcatraz vs. the Evil Librarians ● The Scrivener's Bones ● The Knights of Crystallia ● The Shattered Lens ● The Dark Talent ● Bastille vs. the Evil Librarians (with Janci Patterson) Other novels ● The Rithmatist ● Legion: The Many Lives of Stephen Leeds ● The Frugal Wizard’s Handbook for Surviving Medieval England Other books by Brandon Sanderson The Reckoners ● Steelheart ● Firefight ● Calamity Skyward ● Skyward ● Starsight ● Cytonic ● Skyward Flight (with Janci Patterson) ● Defiant At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
          pageCount: 1008,
          imageLinks: {
            thumbnail:
              "http://books.google.com/books/content?id=OHclhBVv-X4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
          },
        },
      },
    },
  });

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

export const detailedSearchSuccessSchema = z
  .object({
    data: DetailSearchResultSchema,
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
              publishedDate: "2010-08-31T00:00:00.000Z",
              description:
                "From #1 New York Times bestselling author Brandon Sanderson, The Way of Kings, Book One of the Stormlight Archive, begins an incredible new saga of epic proportion. Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the topography offers shelter. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain: mystical swords and suits of armor that transform ordinary men into near-invincible warriors. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them. One such war rages on a ruined landscape called the Shattered Plains. There, Kaladin, who traded his medical apprenticeship for a spear to protect his little brother, has been reduced to slavery. In a war that makes no sense, where ten armies fight separately against a single foe, he struggles to save his men and to fathom the leaders who consider them expendable. Brightlord Dalinar Kholin commands one of those other armies. Like his brother, the late king, he is fascinated by an ancient text called The Way of Kings. Troubled by over-powering visions of ancient times and the Knights Radiant, he has begun to doubt his own sanity. Across the ocean, an untried young woman named Shallan seeks to train under an eminent scholar and notorious heretic, Dalinar's niece, Jasnah. Though she genuinely loves learning, Shallan's motives are less than pure. As she plans a daring theft, her research for Jasnah hints at secrets of the Knights Radiant and the true cause of the war. The result of over ten years of planning, writing, and world-building, The Way of Kings is but the opening movement of the Stormlight Archive, a bold masterpiece in the making. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. and return to men the Shards they once bore. The Knights Radiant must stand again. Other Tor books by Brandon Sanderson The Cosmere The Stormlight Archive ● The Way of Kings ● Words of Radiance ● Edgedancer (novella) ● Oathbringer ● Dawnshard (novella) ● Rhythm of War The Mistborn Saga The Original Trilogy ● Mistborn ● The Well of Ascension ● The Hero of Ages Wax and Wayne ● The Alloy of Law ● Shadows of Self ● The Bands of Mourning ● The Lost Metal Other Cosmere novels ● Elantris ● Warbreaker ● Tress of the Emerald Sea ● Yumi and the Nightmare Painter ● The Sunlit Man Collection ● Arcanum Unbounded: The Cosmere Collection The Alcatraz vs. the Evil Librarians series ● Alcatraz vs. the Evil Librarians ● The Scrivener's Bones ● The Knights of Crystallia ● The Shattered Lens ● The Dark Talent ● Bastille vs. the Evil Librarians (with Janci Patterson) Other novels ● The Rithmatist ● Legion: The Many Lives of Stephen Leeds ● The Frugal Wizard’s Handbook for Surviving Medieval England Other books by Brandon Sanderson The Reckoners ● Steelheart ● Firefight ● Calamity Skyward ● Skyward ● Starsight ● Cytonic ● Skyward Flight (with Janci Patterson) ● Defiant At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
              pageCount: 1008,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=OHclhBVv-X4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "Ru7aEAAAQBAJ",
            volumeInfo: {
              title: "The Way of Kings",
              authors: ["PB TEST"],
              publishedDate: "2023-07-28T00:00:00.000Z",
              description:
                "From #1 New York Times bestselling author Brandon Sanderson, The Way of Kings, Book One of the Stormlight Archive begins an incredible new saga of epic proportion. Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the topography offers shelter. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain: mystical swords and suits of armor that transform ordinary men into near-invincible warriors. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them. One such war rages on a ruined landscape called the Shattered Plains. There, Kaladin, who traded his medical apprenticeship for a spear to protect his little brother, has been reduced to slavery. In a war that makes no sense, where ten armies fight separately against a single foe, he struggles to save his men and to fathom the leaders who consider them expendable. Brightlord Dalinar Kholin commands one of those other armies. Like his brother, the late king, he is fascinated by an ancient text called The Way of Kings. Troubled by over-powering visions of ancient times and the Knights Radiant, he has begun to doubt his own sanity. Across the ocean, an untried young woman named Shallan seeks to train under an eminent scholar and notorious heretic, Dalinar's niece, Jasnah. Though she genuinely loves learning, Shallan's motives are less than pure. As she plans a daring theft, her research for Jasnah hints at secrets of the Knights Radiant and the true cause of the war. The result of over ten years of planning, writing, and world-building, The Way of Kings is but the opening movement of the Stormlight Archive, a bold masterpiece in the making. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. and return to men the Shards they once bore. The Knights Radiant must stand again. Other Tor books by Brandon Sanderson The Cosmere The Stormlight Archive The Way of Kings Words of Radiance Edgedancer (Novella) Oathbringer The Mistborn trilogy Mistborn: The Final Empire The Well of Ascension The Hero of Ages Mistborn: The Wax and Wayne series Alloy of Law Shadows of Self Bands of Mourning Collection Arcanum Unbounded Other Cosmere novels Elantris Warbreaker The Alcatraz vs. the Evil Librarians series Alcatraz vs. the Evil Librarians The Scrivener's Bones The Knights of Crystallia The Shattered Lens The Dark Talent The Rithmatist series The Rithmatist Other books by Brandon Sanderson The Reckoners Steelheart Firefight Calamity At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
              pageCount: 1487,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=Ru7aEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "5645EAAAQBAJ",
            volumeInfo: {
              title: "The Way of Kings",
              authors: ["Nathan Clarkson"],
              publishedDate: "2022-04-26T00:00:00.000Z",
              description:
                "Today's man is in an identity crisis. With a never-ending barrage of confusing, condescending, and condemning voices telling him who he is and who he isn't, it can feel impossible to discover who he was made to be. Men were made to be kings, to protect the light, fight the darkness, and rule well the domain God has given them. But to be a good king, men must act in the likeness of the King. Drawing on the ancient tradition of an older and wiser ruler passing on his wisdom, like Solomon in the book of Proverbs, Nathan Clarkson offers young men 40 short and to-the-point letters for the journey. Packed with practical, biblically based advice on real-life issues, this book helps men base their identity not in who the world says they should be but in who their King says they can be. For the modern man looking to live out a greater story, The Way of Kings offers ancient wisdom rooted in sacred Scripture to help him discover who he was created to be.",
              pageCount: 144,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=5645EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "d-nv9nnEnVwC",
            volumeInfo: {
              title: "The Way of Kings",
              authors: ["Brandon Sanderson"],
              averageRating: 4.5,
              publishedDate: "2010-12-30T00:00:00.000Z",
              description:
                "The groundbreaking first book of an epic series that has changed the face of fantasy. The Way of Kings begins The Stormlight Archive. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. Return to men the Shards they once bore. The Knights Radiant must stand again. Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the topography offers shelter. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain: mystical swords and suits of armor that transform ordinary men into near-invincible warriors. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them. One such war rages on a ruined landscape called the Shattered Plains. There, Kaladin, who traded his medical apprenticeship for a spear to protect his little brother, has been reduced to slavery. In a war that makes no sense, where ten armies fight separately against a single foe, he struggles to save his men and to fathom the leaders who consider them expendable. Brightlord Dalinar Kholin commands one of those other armies. Like his brother, the late king, he is fascinated by an ancient text called The Way of Kings. Troubled by over-powering visions of ancient times and the Knights Radiant, he has begun to doubt his own sanity. Across the ocean, an untried young woman named Shallan seeks to train under an eminent scholar and notorious heretic, Dalinar's niece, Jasnah. Though she genuinely loves learning, Shallan's motives are less than pure. As she plans a daring theft, her research for Jasnah hints at secrets of the Knights Radiant and the true cause of the war. Readers love The Way of Kings: 'A masterpiece series in epic fantasy' Novel Notions 'It's multi-POV, action-packed, heartfelt, exciting, thrilling' Goodreads reviewer, ⭐ ⭐ ⭐ ⭐ ⭐ 'The story is mind-blowing' Goodreads Reviewer, ⭐ ⭐ ⭐ ⭐ ⭐ '[It's] elevated the art of storytelling to a different league' Goodreads reviewer, ⭐ ⭐ ⭐ ⭐ ⭐ 'Introduces a series that will change the history of Fantasy' Goodreads reviewer, ⭐ ⭐ ⭐ ⭐ ⭐ 'I really wish I could give The Way of Kings a sixth star' Goodreads reviewer, ⭐ ⭐ ⭐ ⭐ ⭐ Other books by Brandon Sanderson The Cosmere The Stormlight Archive The Way of Kings Words of Radiance Edgedancer (Novella) Oathbringer Rhythm of War Wind and Truth The Mistborn Saga Mistborn The Well of Ascension The Hero of Ages The Alloy of Law Shadows of Self The Bands of Mourning The Lost Metal",
              pageCount: 973,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=d-nv9nnEnVwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "ibu-EAAAQBAJ",
            volumeInfo: {
              title: "The Stormlight Archive, Books 1-4",
              authors: ["Brandon Sanderson"],
              publishedDate: "2023-05-30T00:00:00.000Z",
              description:
                "This Stormlight Archive discounted ebundle includes: The Way of Kings, Words of Radiance, Oathbringer, and Rhythm of War. The #1 New York Times bestselling epic fantasy series by Brandon Sanderson! The Stormlight Archive is the wildly imaginative epic fantasy from New York Times bestselling author Brandon Sanderson: welcome to the remarkable world of Roshar, a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Roshar is shared by humans and the enigmatic, humanoid Parshendi, with whom they are at war. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them, but in the war against the Parshendi, the ancient weapons and armor may not be enough. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. and return to men the Shards they once bore. The Knights Radiant must stand again. --- Other Tor books by Brandon Sanderson The Cosmere The Stormlight Archive ● The Way of Kings ● Words of Radiance ● Edgedancer (novella) ● Oathbringer ● Dawnshard (novella) ● Rhythm of War The Mistborn Saga The Original Trilogy ● Mistborn ● The Well of Ascension ● The Hero of Ages Wax and Wayne ● The Alloy of Law ● Shadows of Self ● The Bands of Mourning ● The Lost Metal Other Cosmere novels ● Elantris ● Warbreaker ● Tress of the Emerald Sea ● Yumi and the Nightmare Painter ● The Sunlit Man Collection ● Arcanum Unbounded: The Cosmere Collection The Alcatraz vs. the Evil Librarians series ● Alcatraz vs. the Evil Librarians ● The Scrivener's Bones ● The Knights of Crystallia ● The Shattered Lens ● The Dark Talent ● Bastille vs. the Evil Librarians (with Janci Patterson) Other novels ● The Rithmatist ● Legion: The Many Lives of Stephen Leeds ● The Frugal Wizard’s Handbook for Surviving Medieval England Other books by Brandon Sanderson The Reckoners ● Steelheart ● Firefight ● Calamity Skyward ● Skyward ● Starsight ● Cytonic ● Skyward Flight (with Janci Patterson) ● Defiant At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
              pageCount: 8007,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=ibu-EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "DinXAAAAMAAJ",
            volumeInfo: {
              title: "Proving the Way",
              authors: ["Mark McNally"],
              publishedDate: "2005-01-01T00:00:00.000Z",
              description:
                "Kokugaku, or nativism, was an important intellectual movement from the 17th-19th century in Japan, and its worldview remains influential. McNally's primary goal is to restore historicity to the study of nativism by recognizing Atsutane's role in the creation and perpetuation of an enduring intellectual tradition.",
              pageCount: 328,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=DinXAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
            },
          },
          {
            id: "JhtkAAAAMAAJ",
            volumeInfo: {
              title:
                "Proceedings of the Association for Japanese Literary Studies",
              publishedDate: "2004-01-01T00:00:00.000Z",
              pageCount: 544,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=JhtkAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
            },
          },
          {
            id: "mwpNDwAAQBAJ",
            volumeInfo: {
              title: "The Stormlight Archive, Books 1-3",
              authors: ["Brandon Sanderson"],
              averageRating: 5,
              publishedDate: "2018-05-08T00:00:00.000Z",
              description:
                "This Stormlight Archive discounted ebundle includes: The Way of Kings, Words of Radiance, Oathbringer The #1 New York Times bestselling epic fantasy series by Brandon Sanderson! The Stormlight Archive is the wildly imaginative epic fantasy from New York Times bestselling author Brandon Sanderson: welcome to the remarkable world of Roshar, a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Roshar is shared by humans and the enigmatic, humanoid Parshendi, with whom they are at war. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them, but in the war against the Parshendi, the ancient weapons and armor may not be enough. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. and return to men the Shards they once bore. The Knights Radiant must stand again. --- Other Tor books by Brandon Sanderson The Cosmere The Stormlight Archive The Way of Kings Words of Radiance Edgedancer (Novella) Oathbringer The Mistborn trilogy Mistborn: The Final Empire The Well of Ascension The Hero of Ages Mistborn: The Wax and Wayne series Alloy of Law Shadows of Self Bands of Mourning Collection Arcanum Unbounded Other Cosmere novels Elantris Warbreaker The Alcatraz vs. the Evil Librarians series Alcatraz vs. the Evil Librarians The Scrivener's Bones The Knights of Crystallia The Shattered Lens The Dark Talent The Rithmatist series The Rithmatist Other books by Brandon Sanderson The Reckoners Steelheart Firefight Calamity At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
              pageCount: 3829,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=mwpNDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
              },
            },
          },
          {
            id: "UaeTvgEACAAJ",
            volumeInfo: {
              title: "The Way of Kings",
              authors: ["Brandon Sanderson"],
              publishedDate: "2011-01-01T00:00:00.000Z",
              description:
                "The brand new epic fantasy series from international bestseller Brandon Sanderson.",
              pageCount: 0,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=UaeTvgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
            },
          },
          {
            id: "IYe-zQEACAAJ",
            volumeInfo: {
              title: "The Way of Kings Part Two",
              authors: ["Brandon Sanderson"],
              publishedDate: "2021-06-24T00:00:00.000Z",
              description:
                "This is the second half of the epic fantasy novel The Way of Kings. Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilisation alike. Animals hide in shells, trees pull in branches, and grass retracts into the soil-less ground. Cities are built only where the topography offers shelter. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain: mystical swords and suits of armour that transform ordinary men into near-invincible warriors. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them. One such war rages on a ruined landscape called the Shattered Plains. There, Kaladin, who traded his medical apprenticeship for a spear to protect his little brother, has been reduced to slavery. In a war that makes no sense, where ten armies fight separately against a single foe, he struggles to save his men and to fathom the leaders who consider them expendable. Brightlord Dalinar Kholin commands one of those other armies. Like his brother, the late king, he is fascinated by an ancient text called The Way of Kings. Troubled by over-powering visions of ancient times and the Knights Radiant, he has begun to doubt his own sanity. Across the ocean, an untried young woman named Shallan seeks to train under an eminent scholar and notorious heretic, Dalinar's niece, Jasnah. Though she genuinely loves learning, Shallan's motives are less than pure. As she plans a daring theft, her research for Jasnah hints at secrets of the Knights Radiant and the true cause of the war. The result of more than ten years of planning, writing, and world-building, The Way of Kings is but the opening movement of The Stormlight Archive, a bold masterpiece in the making. Speak again the ancient oaths: Life before death. Strength before weakness. Journey before Destination. And return to men the Shards they once bore. The Knights Radiant must stand again. The story continues in The Way of Kings: Part Two.",
              pageCount: 544,
              imageLinks: {
                thumbnail:
                  "http://books.google.com/books/content?id=IYe-zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
            },
          },
        ],
      },
    },
  });
