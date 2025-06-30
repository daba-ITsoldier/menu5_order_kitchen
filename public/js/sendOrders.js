function sendOrders(array) {
    fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(array)
    })
    .then(res => res.json())
    .then(data => console.log(`送信完了！注文数: ${data.saved}`))
    .catch(err => console.log("送信失敗: " + err.message));
}