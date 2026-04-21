 const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

app.get("/api/tc", async (req, res) => {
  const { tc } = req.query;

  if (!tc || tc.length !== 11) {
    return res.json({ error: "TC 11 haneli olmalı" });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new"
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36"
    );

    await page.goto(`https://arastir.sbs/api/tc.php?tc=${tc}`, {
      waitUntil: "networkidle2",
      timeout: 20000
    });

    const content = await page.evaluate(() => document.body.innerText);

    try {
      const data = JSON.parse(content);
      return res.json(data);
    } catch {
      return res.json({
        error: "JSON değil",
        raw: content
      });
    }

  } catch (err) {
    return res.json({
      error: "Puppeteer hata",
      detail: err.message
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});
