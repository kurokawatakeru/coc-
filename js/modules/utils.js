// ユーティリティ関数

// DOM要素取得のヘルパー関数
export function $(id) {
    return document.getElementById(id);
}

// ダイスロール関数
export function rollDice(num, faces) {
    let total = 0;
    for (let i = 0; i < num; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}

// Node.js環境かどうかを判定
export function isNodeEnvironment() {
    return typeof module !== 'undefined' && module.exports;
}