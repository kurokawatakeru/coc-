// キャラクター能力値関連機能

import { $, rollDice } from './utils.js';
import { updatePreview } from './preview.js';
import { updateSkillPoints, updateDodgeBaseValue, updateSkillTotal } from './skill-points.js';

// 基本情報の更新
export async function updateBasicInfo() {
    const { character } = await import('./app.js');
    
    character.name = $('name') ? $('name').value : '';
    character.occupation = $('occupation') ? $('occupation').value : '';
    character.school = $('school') ? $('school').value : '';
    character.origin = $('origin') ? $('origin').value : '';
    character.gender = $('gender') ? $('gender').value : '';
    character.age = $('age') ? $('age').value : '';
    
    // プレビュー更新
    updatePreview();
}

// 能力値の更新
export async function updateCharacteristic(stat) {
    if (!$(stat)) return;
    
    const { character } = await import('./app.js');
    const value = parseInt($(stat).value) || 0;
    character[stat] = value;
    
    // パーセント表示を更新
    if ($(`${stat}-percent`)) {
        $(`${stat}-percent`).textContent = `${value * 5}%`;
    }
    
    // 派生値の更新
    updateDerivedStats();
    
    // プレビュー更新
    updatePreview();
    
    // 技能ポイント計算の更新（EDUとINTの場合）
    if (stat === 'edu' || stat === 'int') {
        updateSkillPoints();
    }
    
    // 回避の初期値を更新（DEXの場合）
    if (stat === 'dex') {
        updateDodgeBaseValue();
    }
    
    // 母国語を更新（EDUの場合）
    if (stat === 'edu') {
        updateOwnLanguage();
    }
}

// 母国語の更新（EDU×5）
export async function updateOwnLanguage() {
    const { character } = await import('./app.js');
    const eduValue = character.edu || 0;
    const ownLanguageValue = eduValue * 5;
    
    // character.skillsにセット
    character.skills.ownLanguage = ownLanguageValue;
    
    // 表示を更新
    if ($('ownLanguage')) {
        $('ownLanguage').value = ownLanguageValue;
    }
    
    // スキルテーブルにも反映
    if ($('ownLanguage-base')) {
        $('ownLanguage-base').textContent = ownLanguageValue;
        updateSkillTotal('ownLanguage');
    }
}

// 技能値の更新
export async function updateSkill(skill) {
    if (!$(skill)) return;
    
    const { character } = await import('./app.js');
    const value = parseInt($(skill).value) || 0;
    character.skills[skill] = value;
    
    // プレビュー更新
    updatePreview();
}

// 派生能力値の更新
export async function updateDerivedStats() {
    const { character } = await import('./app.js');
    
    // 正気度 = POW×5
    character.san = character.pow * 5;
    if ($('san')) {
        $('san').value = character.san;
    }
    
    // アイデア = INT×5
    character.idea = character.int * 5;
    if ($('idea')) {
        $('idea').value = character.idea;
    }
    
    // 幸運 = POW×5
    character.luck = character.pow * 5;
    if ($('luck')) {
        $('luck').value = character.luck;
    }
    
    // 知識 = EDU×5
    character.knowledge = character.edu * 5;
    if ($('knowledge')) {
        $('knowledge').value = character.knowledge;
    }
    
    // 耐久力 = (CON+SIZ)/2（切り捨て）
    character.hp = Math.floor((character.con + character.siz) / 2);
    if ($('hp')) {
        $('hp').value = character.hp;
    }
    
    // マジックポイント = POW
    character.mp = character.pow;
    if ($('mp')) {
        $('mp').value = character.mp;
    }
    
    // ダメージボーナス
    character.db = calculateDamageBonus(character.str, character.siz);
    if ($('db')) {
        $('db').value = character.db;
    }
    
    // 回避 = DEX×2
    character.skills.dodge = character.dex * 2;
    if ($('dodge')) {
        $('dodge').value = character.skills.dodge;
    }
    
    // スキルテーブルの回避基本値も更新
    if ($('dodge-base')) {
        $('dodge-base').textContent = character.dex * 2;
        updateSkillTotal('dodge');
    }
}

// ダメージボーナス計算
export function calculateDamageBonus(str, siz) {
    const total = str + siz;
    if (total <= 12) return '-1D6';
    if (total <= 16) return '-1D4';
    if (total <= 24) return '0';
    if (total <= 32) return '+1D4';
    return '+1D6';
}

// 個別の能力値をダイスロール
export function rollIndividualStat(event) {
    const button = event.currentTarget;
    const stat = button.getAttribute('data-stat');
    const dicePattern = button.getAttribute('data-dice');
    
    // ボタンのロールアニメーション
    button.classList.add('rolling');
    
    // アニメーション終了後にクラスを削除
    setTimeout(() => {
        button.classList.remove('rolling');
    }, 500);
    
    // 値を計算
    let value = 0;
    
    if (dicePattern === '3d6') {
        value = rollDice(3, 6);
    } else if (dicePattern === '2d6+6') {
        value = rollDice(2, 6) + 6;
    } else if (dicePattern === '3d6+3') {
        value = rollDice(3, 6) + 3;
    }
    
    // フィールドに設定
    if ($(stat)) {
        $(stat).value = value;
    }
    
    // キャラクターデータを更新
    updateCharacteristic(stat);
}

// ランダムキャラクター生成
export async function generateRandomCharacter() {
    const { character } = await import('./app.js');
    
    // 各能力値をランダムに生成
    character.str = rollDice(3, 6);       // STR: 3D6
    character.con = rollDice(3, 6);       // CON: 3D6
    character.siz = rollDice(2, 6) + 6;   // SIZ: 2D6+6
    character.dex = rollDice(3, 6);       // DEX: 3D6
    character.app = rollDice(3, 6);       // APP: 3D6
    character.int = rollDice(3, 6);       // INT: 3D6
    character.pow = rollDice(3, 6);       // POW: 3D6
    character.edu = rollDice(3, 6) + 3;   // EDU: 3D6+3
    
    // フォームに反映
    for (const stat of ['str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu']) {
        if ($(stat)) {
            $(stat).value = character[stat];
        }
        if ($(`${stat}-percent`)) {
            $(`${stat}-percent`).textContent = `${character[stat] * 5}%`;
        }
    }
    
    // 派生能力値を更新
    updateDerivedStats();
    
    // プレビュー更新
    updatePreview();
    
    // 技能ポイント計算の更新
    updateSkillPoints();
}