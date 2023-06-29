const PORT = process.env.PORT || 8080;
const express = require("express");
const cheerio = require("cheerio");

const app = express();

let memes = [];

const fetchMemes = async () => {
  for (let page = 0; page <= 1938; page++) {
    const response = await fetch(`https://programmerhumor.io/page/${page}/`);
    const html = await response.text();
    const $ = cheerio.load(html);

    $("a")
      .filter(function () {
        return $(this).hasClass("g1-frame");
      })
      .each(async function (index) {
        const title = $(this).attr("title");
        const img = $(this).find("img");
        const imageUrl = img.data("src");

        const payload = {
          title,
          imageUrl,
          // source: memesWebsite.name,
        };

        const doubled = memes.find(
          (meme) => JSON.stringify(meme) === JSON.stringify(payload)
        );
        if (!doubled) {
          memes.push(payload);
        }
      });
  }
};

app.get("/", async (req, res, next) => {
  return res.send("Welcome to the programming memes API");
});

app.get("/api/memes", async (req, res, next) => {
  try {
    await fetchMemes();
    return res.json(memes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running...");
});
