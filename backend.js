const express = require("express");

const app = express();

// ANA SAYFA
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>TC Sorgu</title>
<style>
body { font-family: Arial; padding:20px; background:#111; color:#fff; }
input, button { padding:10px; font-size:16px; }
pre { background:#000; padding:10px; margin-top:15px; }
</style>
</head>
<body>

<h2>TC Sorgu</h2>

<input id="tc" placeholder="TC gir">
<button onclick="sorgula()">Sorgula</button>

<pre id="sonuc"></pre>

<script>
async function sorgula() {
  const tc = document.getElementById("tc").value;

  document.getElementById("sonuc").innerText = "Sorgulanıyor...";

  try {
    const res = await fetch("/tc?tc=" + tc);
    const data = await res.json();

    document.getElementById("sonuc").innerText =
      JSON.stringify(data, null, 2);
  } catch (e) {
    document.getElementById("sonuc").innerText = "Hata: " + e;
  }
}
</script>

</body>
</html>
  `);
});

// API PROXY (AXIOS YOK)
app.get("/tc", async (req, res) => {
  const tc = req.query.tc;

  if (!tc) {
    return res.json({ error: "TC girilmedi" });
  }

  try {
    const response = await fetch(
      "https://arastir.sbs/api/tc.php?tc=" + tc,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
        },
      }
    );

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.json({
        error: "API JSON dönmedi",
        raw: text.substring(0, 300)
      });
    }

  } catch (err) {
    res.json({
      error: "API çekilemedi",
      detail: err.message,
    });
  }
});

app.listen(10000, () => {
  console.log("Server çalışıyor: 10000");
});
