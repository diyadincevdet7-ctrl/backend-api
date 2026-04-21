const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

app.get("/api/tc", async (req, res) => {
  const { tc } = req.query;

  if (!tc) {
    return res.json({ error: "tc gerekli" });
  }

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(`https://arastir.sbs/api/tc.php?tc=${tc}`, {
      waitUntil: "networkidle2",
      timeout: 15000
    });

    const content = await page.evaluate(() => document.body.innerText);

    await browser.close();

    try {
      const json = JSON.parse(content);
      res.json(json);
    } catch {
      res.json({
        error: "JSON değil",
        raw: content
      });
    }

  } catch (err) {
    res.json({
      error: "Puppeteer hata",
      detail: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});
