const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

app.get("/api/tc", async (req, res) => {
  const { tc } = req.query;

  if (!tc || tc.length !== 11) {
    return res.json({ error: "TC 11 haneli olmalı" });
  }

  try {
    const response = await fetch(`https://arastir.sbs/api/tc.php?tc=${tc}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ error: "API çalışmadı" });
  }
});

app.listen(PORT);
