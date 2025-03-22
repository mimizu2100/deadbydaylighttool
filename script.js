// タイマー関連
let timerInterval;
let seconds = 0;
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-timer');
const resetButton = document.getElementById('reset-timer');
let isTimerRunning = false;
// パークデータ
const perkData = [
    { name: "Balanced Landing", description: "落下後の硬直を軽減し、移動速度が上昇する。", icon: "balanced_landing.png" },
    { name: "Dead Hard", description: "負傷時にダッシュして攻撃を回避する。", icon: "dead_hard.png" },
    { name: "Head On", description: "ロッカーから飛び出し、殺人鬼をスタンさせる。", icon: "head_on.png" },
    { name: "Lithe", description: "乗り越え後、移動速度が上昇する。", icon: "lithe.png" },
    { name: "Overcome", description: "負傷後のダッシュ距離が延長される。", icon: "overcome.png" },
    { name: "Sprint Burst", description: "走り始めに高速でダッシュする。", icon: "sprint_burst.png" },
];
// キラー関連
const killerIcons = document.querySelectorAll('.killer-icon');
let hookCounts = [0, 0, 0, 0];
const perkIcons = document.querySelectorAll('.perk-icon');
let selectedPerks = [[], [], [], []];
// ポップアップ関連
const perkDescriptionPopup = document.getElementById('perk-description');
const perkDescriptionText = document.getElementById('perk-description-text');
const closePopupBtn = document.getElementById('close-popup');
// 効果音関連
let timerStartSound; // ★ Audioオブジェクトの宣言をここで行う
let isMuted = false; // ★ ミュート状態を管理する変数
const muteButton = document.createElement('button'); // ★ ミュートボタンを生成
muteButton.textContent = 'ミュート'; // ★ ボタンのテキストを設定
muteButton.id = 'mute-button'; // ★ ボタンにIDを設定
// タイマー関数
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    if (seconds >= 60) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startButton.textContent = 'Start';
        startButton.disabled = false;
    }
}
// タイマースタート関数
function startTimer() {
    if (!isTimerRunning) {
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        startButton.textContent = 'Stop';
        startButton.disabled = true;
        if (timerStartSound && !isMuted) { // ★ ミュート状態でなければ再生
            timerStartSound.play(); // タイマー開始音を再生
        } else if (timerStartSound && isMuted) {
            console.log("ミュート状態です。効果音は再生しません。");
        }
    }
}
// タイマーリセット関数
function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = '00:00';
    isTimerRunning = false;
    startButton.textContent = 'Start';
    startButton.disabled = false;
}
// キラーアイコンクリック処理
killerIcons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
                hookCounts[index] = (hookCounts[index] + 1) % 4;
                icon.textContent = hookCounts[index] === 3 ? '💀' : hookCounts[index];
        });
});
// パークアイコンクリック処理
perkIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        const killerIndex = Math.floor(index / 6);
        const perkIndex = index % 6;
        if (selectedPerks[killerIndex].includes(perkIndex)) {
            selectedPerks[killerIndex] = selectedPerks[killerIndex].filter(p => p !== perkIndex);
            icon.classList.remove('active');
        } else {
            selectedPerks[killerIndex].push(perkIndex);
            icon.classList.add('active');
        }
        perkDescriptionText.textContent = perkData[perkIndex].description;
        perkDescriptionPopup.style.display = 'block';
    });
});
// ポップアップ閉じる処理
closePopupBtn.addEventListener('click', () => {
    perkDescriptionPopup.style.display = 'none';
});
// リセットボタン
document.getElementById('reset-all').addEventListener('click', () => {
    resetTimer();
    hookCounts.forEach((_, index) => {
        hookCounts[index] = 0;
        killerIcons[index].textContent = 0;
    });
    selectedPerks.forEach(arr => arr.length = 0);
    perkIcons.forEach(icon => icon.classList.remove('active'));
});
document.getElementById('reset-hook-count').addEventListener('click', () => {
    hookCounts.forEach((_, index) => {
        hookCounts[index] = 0;
        killerIcons[index].textContent = 0;
    });
});
document.getElementById('reset-perks').addEventListener('click', () => {
    selectedPerks.forEach(arr => arr.length = 0);
    perkIcons.forEach(icon => icon.classList.remove('active'));
});
// パークアイコンの画像を設定
const perkIconsElements = document.querySelectorAll('.perk-icon');
perkIconsElements.forEach((icon, index) => {
    const perkIndex = index % 6;
    icon.querySelector('img').src = perkData[perkIndex].icon;
});
// ページ読み込み時にAudioオブジェクトを初期化
window.onload = () => {
    timerStartSound = new Audio('決死の一撃 2025-03-22 194215.mp3'); // ★ MP3ファイルのパスを指定 ★
    //timerControls.appendChild(muteButton); // ★ muteButtonをtimerControlsに追加 (timerControlsは定義されていません)
    document.body.appendChild(muteButton); // ★ muteButtonをbodyに追加
};
// イベントリスナー
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
// ミュートボタンのイベントリスナー ★ 追加 ★
muteButton.addEventListener('click', () => {
    isMuted = !isMuted; // ミュート状態を反転
    muteButton.textContent = isMuted ? 'ミュート解除' : 'ミュート'; // ボタンのテキストを更新
});
