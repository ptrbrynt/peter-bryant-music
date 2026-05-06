import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { DateTime, Settings } from "luxon";

export default async function (eleventyConfig) {
  eleventyConfig.addFilter("date", (dateObj, format = "DDD") => {
    const options = { zone: "Europe/London" };
    if (dateObj instanceof Date) {
      return DateTime.fromJSDate(dateObj, options).toFormat(format);
    } else {
      return DateTime.fromISO(dateObj, options).toFormat(format);
    }
  });

  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    collection: {
      name: "post",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "Peter Bryant",
      base: "https://peterbryantmusic.com",
      author: {
        name: "Peter Bryant",
        email: "hello@peterbryantmusic.com",
      },
    },
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  const { IdAttributePlugin } = await import("@11ty/eleventy");

  eleventyConfig.addPlugin(IdAttributePlugin);

  eleventyConfig.addCollection("post", function (collectionsApi) {
    return collectionsApi.getFilteredByGlob("posts/*.md").sort(function (a, b) {
      return a.date - b.date;
    });
  });
}
