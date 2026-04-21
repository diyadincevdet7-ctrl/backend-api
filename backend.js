const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/tc", async (req, res) => {
  const tc = req.query.tc;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://arastir.sbs", {
      waitUntil: "networkidle2"
    });

    const data = await page.evaluate(async (tc) => {
      const res = await fetch(`/api/tc.php?tc=${tc}`);
      return await res.json();
    }, tc);

    await browser.close();

    res.json(data);

  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(10000, () => console.log("Server çalışıyor"));
