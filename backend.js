const express = require("express");
const axios = require("axios");

const app = express();

// ANA SAYFA (HTML + JS)
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

// API PROXY
app.get("/tc", async (req, res) => {
  const tc = req.query.tc;

  if (!tc) {
    return res.json({ error: "TC girilmedi" });
  }

  try {
    const response = await axios.get(
      "https://arastir.sbs/api/tc.php?tc=" + tc,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
        },
      }
    );

    res.json(response.data);
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
