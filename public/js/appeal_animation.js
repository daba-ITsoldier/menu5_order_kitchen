let current_zIndex = 0;

// 最前面の z-index を検出する関数
// .pulse-target クラスを持つ要素すべてのz-indexを調べて一番大きなz-indexの整数値を返す。
// autoなどの文字列の場合は無視するコード。
function detectTopZIndex() {
  const allTargets = document.querySelectorAll(".pulse-target");
  let maxZ = 0;

  allTargets.forEach(el => {
    const z = parseInt(window.getComputedStyle(el).zIndex, 10);
    if (!isNaN(z) && z > maxZ) {
      maxZ = z;
    }
  });

  return maxZ;
}

// z-index をもとにアニメーション対象を更新する関数
// .pulse-target を持つ要素すべてのz-indexを調べて、
// current_zIndex - 5 より大きいものに pulse クラスを付与する。それ以外は外す。
function updateZIndex() {
  current_zIndex = detectTopZIndex();    // current_zIndex に対象要素のz-indexの最大値を入力

  // const elements = document.querySelectorAll(".pulse-target");
  // elements.forEach(el => {
  //   const z = parseInt(window.getComputedStyle(el).zIndex, 10);    // el のz-indexの値を整数に
  //   if (!isNaN(z) && z >= current_zIndex - 5) {      // 数字である、かつ、z がcurrent_zIndex - 5 より大きい
  //     el.classList.add("pulse");
  //   } else {
  //     el.classList.remove("pulse");
  //   }
  // });
}

// グループ定義
const groupA = [];
const groupB = [];
const groupC = [];


function updateGroups() {
  // 一度グループを空にする（重複回避）
  groupA.length = 0;
  groupB.length = 0;
  groupC.length = 0;

  const allTargets = document.querySelectorAll(".pulse-target");

  allTargets.forEach((el, index) => {
    if (el.classList.contains("groupA-fixed")) {
      groupA.push(el);
    } else if (el.classList.contains("groupB-fixed")) {
      groupB.push(el);
    } else if (el.classList.contains("groupC-fixed")) {
      groupC.push(el);
    } else if (el.classList.contains("dynamic-target")) {
      const i = index % 3;
      if (i === 0) groupA.push(el);
      else if (i === 1) groupB.push(el);
      else groupC.push(el);
    }
  });
}

let pulseLoopStarted = false; // フラグで多重起動防止

function startPulseLoop() {
  if (pulseLoopStarted) return;
  pulseLoopStarted = true;

  updateZIndex();  // 念のため再取得しておくと安全
  updateGroups();  // 念のため再初期化しておくと安全

  const groups = [groupA, groupB, groupC];
  let currentIndex = 0;

  function loop() {
    const group = groups[currentIndex];

    group.forEach(el => {
      const z = parseInt(window.getComputedStyle(el).zIndex, 10);
      if (!isNaN(z) && z >= current_zIndex - 5) {
        el.classList.add("pulse");
      }
    });

    // アニメーション1秒後、次の準備
    setTimeout(() => {
      group.forEach(el => el.classList.remove("pulse"));
      currentIndex = (currentIndex + 1) % 3;

      setTimeout(loop, 500); // 0.5秒待機して次へ
    }, 1000);
  }


  loop();
}


// ******************* これを動作させるとOKという関数 ********************************
function updateAppealAnimation() {
  updateZIndex();
  updateGroups();
  startPulseLoop();
}
