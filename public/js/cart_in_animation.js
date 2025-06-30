// カートインアニメーション   ******************************************************************

// カートインアニメーション用
const cartInImg = document.querySelector(".cart-in-animation > img");

async function cartInAnimation(startElement, x, y, endElement, eX, eY) {
    const backX = x - 40; // X方向の逆方向移動位置

    startElement.style.zIndex = 15;
    startElement.classList.add("fade-in");
    // 2つ目の動き: 目的の高さまで移動
    await moveElement(startElement, x, y, x, eY, 400);
    startElement.style.width = "40px";
    startElement.style.height = "40px";
    cartInImg.style.width = "40px";
    cartInImg.style.height = "40px";

    // 3つ目の動き: 逆方向（右へ少し移動）
    await moveElement(startElement, x, eY, backX, eY, 150);

    startElement.classList.remove("fade-in");
    startElement.classList.add("fade-out");
    // 4つ目の動き: 目的のX座標まで移動
    await moveElement(startElement, backX, eY, eX, eY, 300);
    await waitAction(startElement, -10, 150, 300);
    cartInImg.style.width = "150px";
    cartInImg.style.height = "300px";

    startElement.classList.remove("fade-out");

    // カートを揺らす
    await shakeAnimation(endElement, 1000);
}

function waitAction(element, zIndex, width, height) {
    element.style.zIndex = zIndex;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
}

function moveElement(element, startX, startY, endX, endY, duration = 1000) {
    return new Promise((resolve) => {
        let startTime = null;

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            let elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / duration, 1);

            let easedProgress = easeInOutQuad(progress);
            let newX = startX + (endX - startX) * easedProgress;
            let newY = startY + (endY - startY) * easedProgress;

            element.style.transform = `translate(${newX}px, ${newY}px)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve(); // アニメーション終了後に次の処理へ
            }
        }

        requestAnimationFrame(animate);
    });
}


// カートが揺れるアニメーション
function shakeAnimation(element, duration) {
    if (isAnimating) return;
    isAnimating = true;

    let startTime = null;
    let currentMax = 30; // 開始値を30に固定
    let direction = 1;

    function easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1); // 0 ～ 1 の間

        let easedProgress = easeOutQuad(progress);
        let angle = currentMax * (1 - easedProgress) * direction;
        element.style.transform = `rotate(${angle}deg)`;

        // 100msごとにプラスマイナスを切り替え
        direction = Math.round(elapsed / 100) % 2 === 0 ? 1 : -1;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.transform = `rotate(0deg)`;
            isAnimating = false;
        }
    }

    requestAnimationFrame(animate);
}

