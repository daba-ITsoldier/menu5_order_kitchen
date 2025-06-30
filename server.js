const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public")); // publicフォルダを公開
app.use(express.json());           // JSONを受け取れるようにする

const ordersFile = "orders.json";  // 保存ファイルの場所

// 注文取得API（GET）
app.get("/api/orders", (req, res) => {
  fs.readFile(ordersFile, "utf8", (err, data) => {
    if (err) return res.status(500).send("読み込み失敗");
    res.json(JSON.parse(data || "[]"));
  });
});

// 注文保存API（POST）
app.post("/api/orders", (req, res) => {
  const newOrders = req.body;
  fs.writeFile(ordersFile, JSON.stringify(newOrders, null, 2), (err) => {
    if (err) return res.status(500).send("保存失敗");
    res.json({ saved: newOrders.length });
  });
});

// サーバー起動
app.listen(port, () => {
  console.log(`サーバー起動中: http://localhost:${port}`);
});
