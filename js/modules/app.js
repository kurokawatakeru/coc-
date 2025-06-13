// メインアプリケーションファイル

import { createCharacterTemplate } from './constants.js';

// グローバルなキャラクターデータ
export let character = createCharacterTemplate();

// キャラクターデータを更新するための関数
export function setCharacter(newCharacter) {
    Object.assign(character, newCharacter);
}