// ******************** ぬるぬるスクロールさせるもの *********************************************
const menuDisplay = document.querySelector(".menu");

window.addEventListener("load", function () {          // スクロール関係。見た目ややこしいので function を内包したけど、変になったら外に置くこと。あと用途不明なのが２つ。
    const menu = document.querySelector(".menu");            // 用途不明
    const items = document.querySelectorAll(".menu li");     // 用途不明
    const main = document.querySelector(".main");


    widthMenu(menus);           // 横画面全体のだいたいの大きさ
    leftGoButton(main);         // 
    rightGoButton(main);
    
    
    // メニューの土台のwidth
    function widthMenu(array) {
        menuDisplay.style.width = `calc((10dvw + 200px) * ${array.length} + 30dvw)`;
    }
    
    
    // スムーズな移動用
    function smoothScrollTo(element, targetPosition, duration) {
        let startPosition = element.scrollLeft;
        let distance = targetPosition - startPosition;
        let startTime = performance.now();
        
        function step(currentTime) {
            let elapsedTime = currentTime - startTime;
            let progress = Math.min(elapsedTime / duration, 1); // 進行度を計算（0 〜 1）
            
            element.scrollLeft = startPosition + distance * easeOutCubic(progress);
        
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3); // イージング（後半減速）
        }
        
        requestAnimationFrame(step);
    }
    
    function rightGoButton(array) {
        const rightGoBtn = document.querySelector(".main > .rightGoBtn");
        rightGoBtn.addEventListener("click", () => {
            let targetPosition = array.scrollWidth - array.clientWidth; // 右端まで
            smoothScrollTo(array, targetPosition, 1000); // 1秒でスクロール
        });
    }

    function leftGoButton(array) {
        const leftGoBtn = document.querySelector(".main > .leftGoBtn");
        leftGoBtn.addEventListener("click", () => {
            smoothScrollTo(array, 0, 1000); // **左端までスクロール**
        });
    }

});
