// エクスポート・インポート機能

import { $ } from './utils.js';
import { updatePreview } from './preview.js';
import { updateSkillPoints } from './skill-points.js';
import { updateSkillTables } from './data-management.js';
import { updateDerivedStats } from './character-stats.js';
import { updateImagePreview } from './data-management.js';
import { defaultSkills } from './constants.js';

// キャラクターデータのエクスポート
export async function exportCharacter() {
    // app.jsからcharacterを取得
    const { character } = await import('./app.js');
    
    if (!character.name) {
        alert('エクスポートするには探索者名を入力してください。');
        return;
    }
    
    // JSON文字列に変換
    const characterData = JSON.stringify(character, null, 2);
    
    // Blobを作成
    const blob = new Blob([characterData], { type: 'application/json' });
    
    // ダウンロードリンクを作成
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name}.json`;
    
    // リンクを非表示でDOMに追加してクリック
    document.body.appendChild(a);
    a.click();
    
    // クリーンアップ
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// キャラクターデータのインポート
export async function importCharacter(event) {
    const file = event.target.files[0];
    if (!file) return;

    // ファイル拡張子チェック (.json または .txt を許可)
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.json') && !lowerName.endsWith('.txt')) {
        alert('JSONファイル(.json)またはテキストファイル(.txt)を選択してください。');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            let importedCharacter;
            if (lowerName.endsWith('.json')) {
                // JSONデータをパース
                importedCharacter = JSON.parse(e.target.result);
            } else {
                // いあきゃら形式のテキストをパース
                importedCharacter = await parseIaCharacterText(e.target.result);
            }
            
            // バリデーション
            if (!importedCharacter.name) {
                throw new Error('有効なキャラクターデータではありません。');
            }
            
            // app.jsからsetCharacterとcharacterを取得
            const { setCharacter, character } = await import('./app.js');
            
            // キャラクターデータを設定
            setCharacter(importedCharacter);
            
            // フォームに反映
            // 基本情報
            if ($('name')) $('name').value = character.name || '';
            if ($('occupation')) $('occupation').value = character.occupation || '';
            if ($('school')) $('school').value = character.school || '';
            if ($('origin')) $('origin').value = character.origin || '';
            if ($('gender')) $('gender').value = character.gender || '';
            if ($('age')) $('age').value = character.age || '';
            
            // 能力値
            for (const stat of ['str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu']) {
                if ($(stat)) $(stat).value = character[stat] || 0;
                if ($(`${stat}-percent`)) $(`${stat}-percent`).textContent = `${(character[stat] || 0) * 5}%`;
            }
            
            // 派生能力値
            updateDerivedStats();
            
            // 技能値
            for (const skill in defaultSkills) {
                if ($(skill)) {
                    $(skill).value = character.skills[skill] || defaultSkills[skill];
                }
            }
            
            // カスタムフィールドを反映
            const customFields = [
                'art1Name', 'art2Name', 'craft1Name', 'craft2Name',
                'customSkill1Name', 'customSkill2Name', 'customFirearmName'
            ];
            
            customFields.forEach(field => {
                if ($(field)) {
                    $(field).value = character[field] || '';
                }
            });
            
            // 画像を反映
            updateImagePreview();
            
            // プレビュー更新
            updatePreview();
            
            // 技能ポイント計算の更新
            updateSkillPoints();
            
            // スキルテーブルの更新
            updateSkillTables();
            
            alert(`「${character.name}」をインポートしました。`);
            
        } catch (error) {
            alert(`インポートエラー: ${error.message}`);
        }
    };
    
    reader.readAsText(file);

    // ファイル選択をリセット
    event.target.value = '';
}

// いあきゃら形式テキストのパース
async function parseIaCharacterText(text) {
    const abilityMap = {
        'STR': 'str',
        'CON': 'con',
        'POW': 'pow',
        'DEX': 'dex',
        'APP': 'app',
        'SIZ': 'siz',
        'INT': 'int',
        'EDU': 'edu',
        'HP': 'hp',
        'MP': 'mp',
        'SAN': 'san',
        'IDE': 'idea',
        '幸運': 'luck',
        '知識': 'knowledge'
    };

    const skillMap = {
        '回避': 'dodge',
        'キック': 'kick',
        '組み付き': 'grapple',
        'こぶし（パンチ）': 'punch',
        '頭突き': 'headbutt',
        '投擲': 'throw',
        'マーシャルアーツ': 'martialArts',
        '拳銃': 'handgun',
        'サブマシンガン': 'submachineGun',
        'ショットガン': 'shotgun',
        'マシンガン': 'machineGun',
        'ライフル': 'rifle',
        '応急手当': 'firstAid',
        '鍵開け': 'locksmith',
        '隠す': 'conceal',
        '隠れる': 'hide',
        '聞き耳': 'listen',
        '忍び歩き': 'sneak',
        '写真術': 'photography',
        '精神分析': 'psychoanalysis',
        '追跡': 'track',
        '登攀': 'climb',
        '図書館': 'libraryUse',
        '目星': 'spotHidden',
        '運転': 'drive',
        '機械修理': 'mechanicalRepair',
        '重機械操作': 'operateHeavyMachinery',
        '乗馬': 'ride',
        '水泳': 'swim',
        '操縦': 'pilot',
        '跳躍': 'jump',
        '電気修理': 'electricalRepair',
        'ナビゲート': 'navigate',
        '変装': 'disguise',
        '言いくるめ': 'fastTalk',
        '信用': 'creditRating',
        '説得': 'persuade',
        '値切り': 'bargain',
        '医学': 'medicine',
        'オカルト': 'occult',
        '化学': 'chemistry',
        'クトゥルフ神話': 'cthulhuMythos',
        '芸術': 'art1',
        '経理': 'accounting',
        '考古学': 'archaeology',
        'コンピューター': 'computer',
        '心理学': 'psychology',
        '人類学': 'anthropology',
        '生物学': 'biology',
        '地質学': 'geology',
        '電子工学': 'electronics',
        '天文学': 'astronomy',
        '博物学': 'naturalHistory',
        '物理学': 'physics',
        '法律': 'law',
        '薬学': 'pharmacy',
        '歴史': 'history'
    };

    // 基本は現在のcharacterをクローン
    const { character } = await import('./app.js');
    const clone = JSON.parse(JSON.stringify(character));

    const lines = text.split(/\r?\n/);
    for (const line of lines) {
        if (line.startsWith('名前:')) {
            clone.name = line.replace(/^名前:\s*/, '').split(/[\s(]/)[0].trim();
        } else if (line.startsWith('職業:')) {
            clone.occupation = line.replace(/^職業:\s*/, '').trim();
        } else if (/年齢:/.test(line)) {
            const m = line.match(/年齢:\s*(\d+)/);
            if (m) clone.age = m[1];
            const g = line.match(/性別:\s*([^/]+)/);
            if (g) clone.gender = g[1].trim();
        } else if (/出身:/.test(line)) {
            const m = line.match(/出身:\s*([^\s]+)/);
            if (m) clone.origin = m[1];
        } else if (/^DB\s*/.test(line)) {
            const m = line.match(/DB\s*(.+)/);
            if (m) clone.db = m[1].trim();
        }

        // 能力値
        for (const key in abilityMap) {
            const reg = new RegExp('^' + key + '\\s+(\\d+)');
            const m = line.match(reg);
            if (m) {
                clone[abilityMap[key]] = parseInt(m[1], 10);
            }
        }

        // 技能値
        for (const jSkill in skillMap) {
            const reg = new RegExp('^' + jSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+(\\d+)');
            const m = line.match(reg);
            if (m) {
                if (!clone.skills) clone.skills = {};
                clone.skills[skillMap[jSkill]] = parseInt(m[1], 10);
            }
        }
    }

    return clone;
}