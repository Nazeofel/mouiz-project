const PORT = process.env.PORT || 8080;
const express = require("express");
const cheerio = require("cheerio");

const app = express();

let memes = [];

const fetchMemes = async (page) => {
  const response = await fetch(
    `https://programmerhumor.io/page/${page !== undefined ? page : 1}/`
  );
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
  return memes;
};

app.get("/", async (req, res, next) => {
  return res.send(
    "Welcome to the programming memes API, MADE By Mouiz scraps data from : https://programmerhumor.io/page/1/"
  );
});

app.get("/api/memes", async (req, res, next) => {
  const page = req.query.page;
  console.log(page);
  await fetchMemes(page);
  return res.json(memes);
});

app.listen(PORT, () => {
  console.log("Server running...");
});
