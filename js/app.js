// クトゥルフ神話TRPG キャラクター作成ツール メインファイル

// 各モジュールをインポート
import { initializeApp } from './modules/initialization.js';

// ページロード時の初期化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
    });
}