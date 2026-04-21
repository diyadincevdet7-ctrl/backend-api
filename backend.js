const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

// 🔥 SAĞLAM API SİSTEMİ (fallback + parse fix)
const API_LIST = [
  "https://arastir.sbs"
];

async function fetchTC(tc) {
  for (let base of API_LIST) {
    try {
      const response = await fetch(`${base}/api/tc.php?tc=${tc}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "*/*"
        },
        timeout: 5000
      });

      const text = await response.text();

      // JSON dene
      try {
        return JSON.parse(text);
      } catch {
        // JSON değilse bile göster
        return {
          success: false,
          error: "API JSON dönmedi",
          raw: text
        };
      }

    } catch (err) {
      console.log("API fail:", err.message);
    }
  }

  return {
    success: false,
    error: "Tüm API'ler başarısız"
  };
}

// 🔥 ENDPOINT
app.get("/api/tc", async (req, res) => {
  const { tc } = req.query;

  if (!tc || tc.length !== 11) {
    return res.json({
      success: false,
      error: "TC 11 haneli olmalı"
    });
  }

  const data = await Promise.race([
    fetchTC(tc),
    new Promise(resolve =>
      setTimeout(() =>
        resolve({
          success: false,
          error: "Timeout (5sn)"
        }), 5000)
    )
  ]);

  res.json(data);
});

// 🔥 404
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint yok"
  });
});

// 🚀 START
app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});
