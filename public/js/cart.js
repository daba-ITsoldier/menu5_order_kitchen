// addListItem(element, menuStocks);
// これを使うための関数群。
// 商品を選んでカートインアニメーション -> カート内表示 という流れの
// カート内表示をする関数群。



// cart-price トータル金額　　cart-total トータル個数
const cartPrice = document.querySelector(".cart-price > span");
const cartTotal = document.querySelector(".cart-total > span");
const inCartEn = document.querySelector(".inCart-topArea > .inCart-en");
const inCartKo = document.querySelector(".inCart-topArea > .inCart-ko");
const outputDiv = document.getElementById("output");



function cartPriceDisplay(menuStocks) {
    const total = menuStocks.reduce((sum, menu) => sum + menu.price, 0);
    cartPrice.textContent = total;
}

function inCartPriceDisplay(menuStocks) {
    const total = menuStocks.reduce((sum, menu) => sum + menu.price, 0);
    inCartEn.textContent = total;
}

function cartTotalDisplay(menuStocks) {
    const total = menuStocks.length;
    cartTotal.textContent = total;
}

function inCartTotalDisplay(menuStocks) {
    const total = menuStocks.length;
    inCartKo.textContent = total;
}



// menuStocks のソート用。カートに入れたメニューのソート
function sortCart(menuStocks) {
    menuStocks.sort((a, b) => a.no - b.no);
}

// cart内に入れたメニューの表示
function addListItem(element, menuStocks) {
    element.id = Date.now();            // ランダムな id を作成して付与する
    menuStocks.push(element);           // menuStocks に入れる。
    sortCart(menuStocks);               // 入れたメニューを並べ替える。
    renderList(menuStocks);             // 
}


function renderList(menuStocks) {
    const ul = document.querySelector(".cart-container > ul");
    ul.replaceChildren();            // カート内の li 要素を全部消す

    const summarizedMenus = groupItems(menuStocks);

    console.log(summarizedMenus);

    summarizedMenus.forEach(menu => {
        const li = document.createElement("li");
        
        const span = document.createElement("span");
        span.classList.add("cart-span","shippori-antique-regular");
        // span.textContent = menu.name;
        span.textContent = truncateText(menu.name);

        if(menu.name.length > 10) {
            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            tooltip.textContent = menu.name;
            span.appendChild(tooltip);

            span.addEventListener("click", () => {
                if(activeTooltip && activeTooltip !== tooltip) {
                    activeTooltip.style.display = "none";
                }
                tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
                activeTooltip = tooltip.style.display === "block" ? tooltip : null;
            });
        }

        outputDiv.appendChild(span);
        
        const cartNum = document.createElement("span");
        cartNum.classList.add("cart-num","shippori-antique-regular");
        cartNum.textContent = menu.count;

        const deleteBtn = document.createElement("div");
        const delImg = document.createElement("img");
        delImg.src = "img/cancel4.png";
        deleteBtn.classList.add("delete-btn", "shippori-antique-regular");
        deleteBtn.addEventListener("click", () => {
            deleteItem(menu.no, menuStocks);  
        });
        
        deleteBtn.appendChild(delImg);
        li.appendChild(span);
        li.appendChild(cartNum);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
}

// 指定した変数内の「no」プロパティを数えてまとめたものを新しい変数にして返すやつ。
// これはキッチン側でも使うようにする。
function groupItems(menuStocks) {
    const grouped = new Map();

    menuStocks.forEach(menu => {
        const no = Number(menu.no); // ← 型を統一して処理する
        if (!grouped.has(no)) {
            // 最初の要素をコピーしつつカウント追加
            grouped.set(no, { ...menu, no, count: 1 });
        } else {
            const existing = grouped.get(no);
            existing.count += 1;
        }
    });

    return Array.from(grouped.values());
}


function deleteItem(id, menuStocks) {
    const targetId = Number(id); // ← 型を合わせるために Number に変換！

    // id と一致する要素を除いて menuStocks の中身を置き換える
    const filtered = menuStocks.filter(menu => menu.no !== targetId);
    menuStocks.splice(0, menuStocks.length, ...filtered);

    console.log(`削除対象ID: ${targetId}`);
    console.log(`削除後のmenuStocks:`, menuStocks);

    renderList(menuStocks);
    cartPriceDisplay(menuStocks);
    cartTotalDisplay(menuStocks);
    inCartPriceDisplay(menuStocks);
    inCartTotalDisplay(menuStocks);
}


function truncateText(text) {
    if (text.length > 10) {
        // return text.slice(0, 4) + "…" + text.slice(-4);
        return text.slice(0, 9) + "…";
    }
    return text;
}


// cart-btn の挙動
const cartBtn = document.querySelector(".cart-btn");
const cart = document.querySelector(".cart");
const overlayArea = document.querySelector(".overlay-area");
const hideBtn = document.querySelector(".hide-btn");

cartBtn.addEventListener("click", () => {
    cart.classList.add("appear");
    overlayArea.classList.add("appear");
    cart.style.zIndex = 101;
    overlayArea.style.zIndex = 100;
    hideBtn.style.zIndex = 102;
    updateAppealAnimation();
});

hideBtn.addEventListener("click", () => {
    cart.classList.remove("appear");
    overlayArea.classList.remove("appear");
    cart.style.zIndex = 1;
    overlayArea.style.zIndex = 0;
    hideBtn.style.zIndex = 2;
    updateAppealAnimation();
});

