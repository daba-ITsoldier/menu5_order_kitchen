function fetchOrders() {
    fetch("/api/orders")
        .then(res => res.json())
        .then(data => {
        const list = document.getElementById("order-list");
        list.innerHTML = "";
        data.forEach(order => {
            const li = document.createElement("li");
            li.textContent = `テーブル${order.table}：${order.item} ×${order.quantity}`;
            list.appendChild(li);
        });
    });
}