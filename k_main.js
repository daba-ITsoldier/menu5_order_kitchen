"use strict";

let refreshSeconds = 30;

fetchOrders();
setinterval(fetchOrders, refreshSeconds * 1000);