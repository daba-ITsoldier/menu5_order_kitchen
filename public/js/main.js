"use strict";

// const { delimiter } = require("path");
const menus = [
    {no:  1, name: "チャーハン", price: 900, img: "img/raimon3.png"},
    {no:  2, name: "唐揚げ", price: 800, img: "img/raimon3.png"},
    {no:  3, name: "餃子", price: 700, img: "img/raimon3.png"},
    {no:  4, name: "焼売", price: 10, img: "img/raimon3.png"},
    {no:  5, name: "棒棒鶏", price: 1000, img: "img/raimon3.png"},
    {no:  6, name: "チャーハンチャーハン チャーハン", price: 1900, img: "img/raimon3.png"},
    {no:  7, name: "チャーハン　　　　　半チャーハン　　　　　全チャーハン　　　　　サイコチャーハン", price: 900, img: "img/raimon.png"},
    {no:  8, name: "寿限無寿限無五劫のすりきれ海砂利水魚の水行末雲来末風来末食う寝るところに住むところやぶらこうじのぶらこうじパイポパイポパイポのシューリンガンシューリンガンのグーリンダイグーリンダイのポンポコピーのポンポコナの長久命ちょうきゅうめいの長助", price: 60000, img: "img/raimon.png"},
    {no:  9, name: "チャーハン", price: 600, img: "img/raimon.png"},
    {no: 10, name: "チャーハン", price: 500, img: "img/raimon.png"},
];

const menuStocks = [];


// カートの位置　定数    ********************************************
const cartButton = document.querySelector(".cart-btn");
const cartCoordinate = cartButton.getBoundingClientRect();
const cartIn = document.querySelector(".cart-in-animation");
let isAnimating = false;



// カート送信前のポップアップ用
const cartInSelection = document.querySelector(".cart-in-selection");
const cartInSelectionOverlay = document.querySelector(".cart-in-selection-overlay");

// カートの位置補正用
const mainCoodinate = document.querySelector(".main").getBoundingClientRect();


// メニュー作成　定数    ********************************************
const menuUl = document.querySelector(".menu > ul");

let activeTooltip = null;

// 一時的にメニューの情報を保存するところ
const temporaryItem = [];   

// カートインアニメーション用の変数
let rect = 0;
let centerX = 0;
let centerY = 0;
let cartRect = 0;
let endX = 0;
let endY = 0;


// 実際にメニュー作成　　　createMenu で menus の中身を使って１つ１つメニューを作成。
document.addEventListener("DOMContentLoaded", function () {
    // ① 商品オブジェクトから要素を生成
    menus.forEach(menu => {
        createMenu(menu);
    });
    
    // ② サブJSの処理を呼び出し
    updateAppealAnimation();
});

// 最初のcart内表示
cartPriceDisplay(menuStocks);
cartTotalDisplay(menuStocks);
inCartPriceDisplay(menuStocks);
inCartTotalDisplay(menuStocks);



// メニュー作成関数  **************************************************************************
// メインにメニューを作成して並べる関数群。
// カートインアニメーション・アピールアニメーションを使っている。

function createMenu(array) {
    // メニューの枠 li、　メニュー画像 img、　メニュー名 span 
    const li = document.createElement("li");
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper", "pulse-target", "dynamic-target");

    const image = document.createElement("img");
    image.classList.add("image");
    image.src = array.img;

    const text = document.createElement("span");
    text.classList.add("text", "shippori-antique-regular");
    text.textContent = `${array.name}`;

    text.addEventListener("click", () => {      // メニュー名をクリックでカートインの動作をさせる
        // カートインアニメーションに必要な座標
        rect = text.getBoundingClientRect();
        centerX = Math.round(rect.left + window.pageXOffset) - 25;
        centerY = Math.round(rect.top + window.pageYOffset) + 75;
        cartRect = cartButton.getBoundingClientRect();
        endX = Math.round(cartRect.left + window.pageXOffset);
        endY = Math.round(cartRect.top + window.pageYOffset) + 16;

        // カートインアニメーション用の div を裏から表示する
        cartInSelection.style.zIndex = 101;
        cartInSelectionOverlay.style.zIndex = 100;
        updateAppealAnimation();
        
        // temporaryItem に現在メニューの情報を入れる
        temporaryItem.push({...array});

        // ここにポップアップのメニュー名と値段の表示も仕込む
        // メニュー名が長すぎる時に「…」で省略した名前を作成
        // truncateText は cart.js に書いてある関数
        const menuName = truncateText(temporaryItem[0].name);   

        // カートに入れる前の選択画面
        displaySelectionName(menuName);                   // メニュー名表示
        displaySelectionPrice(temporaryItem[0].price);    // 値段表示
        displaySelectionExplain(temporaryItem[0].name);   // メニューの説明欄
    });


    // メニュー値段  span
    const priceBox = document.createElement("div");    // 値段の枠
    priceBox.classList.add("price-box");
    const price = document.createElement("span");      // 値段の表示
    price.classList.add("price", "font");
    price.textContent = `${array.price}`;
    const en = document.createElement("span");         // 「円」の表示
    en.classList.add("en", "font");
    en.textContent = "円";


    // 作成した要素を１つに組み立てる
    wrapper.appendChild(image);
    wrapper.appendChild(text);
    wrapper.appendChild(priceBox);

    priceBox.appendChild(price);
    priceBox.appendChild(en);

    li.appendChild(wrapper);
    menuUl.appendChild(li);

    adjustFontSize(text, 5, 28, 52);       // フォントサイズの調整    ここしか使っていないので内包してみる。変になったら外に出すこと。
    // 文字の大きさ調整     (対象要素, 最大文字数, 最小サイズ, 最大サイズ)
    function adjustFontSize(element, maxChars, minFontSize, maxFontSize) {
        const textLength = element.textContent.length;
        const calculatedFontSize = (maxFontSize * maxChars) / textLength;
        const newFontSize = Math.min(Math.max(minFontSize, calculatedFontSize), maxFontSize) + "px";
        element.style.fontSize = newFontSize;
    
        // 🔽 基本は1行にする
        element.style.whiteSpace = "nowrap"; 
        element.style.overflow = "hidden";   
        // element.style.textOverflow = "ellipsis"; 
    
        // 🔽 文字数が最大を超えたら改行を許可
        if (textLength > maxChars) {
            element.style.whiteSpace = "normal"; // 改行を許可
            // element.style.overflow = "visible"; // 全体を表示
            // element.style.textOverflow = "clip"; // 省略せず表示
        }
    }

}


// ここ３つの機能は
// メニューを作る時に、ポップアップの表示を作成するところで使っている。
function displaySelectionName(arr) {
    selectionText.textContent = arr;
}

function displaySelectionPrice(arr) {
    selectionPrice.textContent = arr;
}

function displaySelectionExplain(arr) {
    selectionExplain.textContent = arr;
}


// カートインセレクション ポップアップ    ****************************************************************
// (カートに入れる前に個数選択できるようにする)

// カートに入れる前の個数選択ポップアップ
const selectionSend = document.querySelector(".selection-send");        // ポップアップの送信
const selectionCancel = document.querySelector(".selection-cancel");    // ポップアップの取り消し

// ポップアップ内のメニュー名と値段表示     これらはポップアップ表示の時に仕込む
const selectionText = document.querySelector(".selection-text");
const selectionPrice = document.querySelector(".selection-price > span");
const selectionExplain = document.querySelector(".selection-explain");

// カートに入れる前の個数調整
const selectionMinus = document.querySelector(".selection-minus-container");
const selectionPlus = document.querySelector(".selection-plus-container");
const selectionNum = document.querySelector(".selection-num");

// ポップアップの送信ボタン
let sendCount = 1;

// ポップアップの最大個数
let maxValues = 20;

// クリックで個数調整
selectionMinus.addEventListener("click", () => {        // －ボタン
    sendCount--;
    if(sendCount <= 0) {
        sendCount = 1;
    }
    displaySelectionNum();
});

selectionPlus.addEventListener("click", () => {         // ＋ボタン
    sendCount++;
    if(sendCount > maxValues) {
        sendCount = maxValues;
    };
    displaySelectionNum();
});


function displaySelectionNum() {
    selectionNum.textContent = sendCount;
}




// ポップアップのキャンセルボタンを押した時のアクション
selectionCancel.addEventListener("click", () => {
    cartInSelection.style.zIndex = -10;
    cartInSelectionOverlay.style.zIndex = -11;
    updateAppealAnimation();
    temporaryItem.length = 0;                       // 一時保存アイテムの消去
    sendCount = 1;                                  // 送る個数を基本の１に戻す
    displaySelectionNum();
});

// ポップアップの送信ボタンを押した時のアクション
selectionSend.addEventListener("click", () => {
    cartInAnimation(cartIn, centerX, centerY, cartButton, endX, endY);      // カートインアニメーション
    
    for(let i = 1; i <= sendCount; i++) {          // 一時保存アイテムを移し替える。個数分だけ繰り返すようにした。しかし、これで何か不具合の可能性もある。
        addListItem(temporaryItem[0], menuStocks);
    }
    
    // カートの総額や総数の表示更新
    cartPriceDisplay(menuStocks);
    cartTotalDisplay(menuStocks);
    inCartPriceDisplay(menuStocks);
    inCartTotalDisplay(menuStocks);
    
    cartInSelection.style.zIndex = -10;
    cartInSelectionOverlay.style.zIndex = -11;
    updateAppealAnimation();
    temporaryItem.length = 0;     // 一時保存用の配列内を空っぽにする
    sendCount = 1;
    displaySelectionNum();
});




// *************************************************************************************

// オーダー送信用
// （最後のカート内の送信ボタンからオーダー受信用ページに情報送信する）
const inCartBtn = document.querySelector(".inCart-btn");

inCartBtn.addEventListener("click", function(event) {
    sendOrders(menuStocks);
});



//         *****************************************************

// 進捗
// 残り


//      とっちらかり過ぎなので、機能ごと・セクションごとに分けてjsファイルを整理する。

//      カレンダーを作る
//      カレンダーをクリックして日付を取得できるようにする
//      予約システムを考える
//      （ ０日を当日扱いにするとかで応用できそうなので、分けて考えなくていいかも ）






// 　　　phpなどで送信できるように簡単なサンプルで試す

// 　　　キッチン側のページを作る

// 　　　管理ページも作る

// 　　　とりあえず予約なし版の仮版を完成させる

// 　　　当日予約ができるように作る

// 　　　カレンダーを作る

// 　　　カレンダーで数日先の予約ができるようにする