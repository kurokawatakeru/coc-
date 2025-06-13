// データ管理機能（保存・読み込み）

import { $ } from './utils.js';
import { updatePreview } from './preview.js';
import { updateSkillPoints, updateSkillTotal } from './skill-points.js';
import { defaultSkills } from './constants.js';

// キャラクターの保存
export async function saveCharacter() {
    const { character } = await import('./app.js');
    
    if (!character.name) {
        alert('保存するには探索者名を入力してください。');
        return;
    }
    
    // 保存データを取得
    let savedCharacters = JSON.parse(localStorage.getItem('cocCharacters') || '{}');
    
    // キャラクターを追加
    savedCharacters[character.name] = character;
    
    // ローカルストレージに保存
    localStorage.setItem('cocCharacters', JSON.stringify(savedCharacters));
    
    // 保存データリストを更新
    loadSavedCharacterList();
    
    alert(`探索者「${character.name}」を保存しました。`);
}

// 保存キャラクターリストの読み込み
export function loadSavedCharacterList() {
    const savedCharacters = JSON.parse(localStorage.getItem('cocCharacters') || '{}');
    const select = $('loadSelect');
    
    if (!select) return;
    
    // リストをクリア（最初の「保存データ読込...」以外）
    while (select.options.length > 1) {
        select.options.remove(1);
    }
    
    // 保存されているキャラクターをリストに追加
    for (const name in savedCharacters) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    }
}

// キャラクターの読み込み
export async function loadCharacter() {
    const { character } = await import('./app.js');
    
    const select = $('loadSelect');
    if (!select) return;
    
    const selectedName = select.value;
    
    if (!selectedName) return;
    
    // 保存データから選択したキャラクターを取得
    const savedCharacters = JSON.parse(localStorage.getItem('cocCharacters') || '{}');
    const loadedCharacter = savedCharacters[selectedName];
    
    if (!loadedCharacter) {
        alert('キャラクターデータが見つかりません。');
        return;
    }
    
    // キャラクターデータを反映
    Object.assign(character, loadedCharacter);
    
    // 基本情報を反映
    if ($('name')) $('name').value = character.name || '';
    if ($('occupation')) $('occupation').value = character.occupation || '';
    if ($('school')) $('school').value = character.school || '';
    if ($('origin')) $('origin').value = character.origin || '';
    if ($('gender')) $('gender').value = character.gender || '';
    if ($('age')) $('age').value = character.age || '';
    
    // 能力値を反映
    for (const stat of ['str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu']) {
        if ($(stat)) $(stat).value = character[stat] || 0;
        if ($(`${stat}-percent`)) $(`${stat}-percent`).textContent = `${(character[stat] || 0) * 5}%`;
    }
    
    // 派生能力値を反映
    if ($('san')) $('san').value = character.san || 0;
    if ($('hp')) $('hp').value = character.hp || 0;
    if ($('mp')) $('mp').value = character.mp || 0;
    if ($('idea')) $('idea').value = character.idea || 0;
    if ($('luck')) $('luck').value = character.luck || 0;
    if ($('knowledge')) $('knowledge').value = character.knowledge || 0;
    if ($('db')) $('db').value = character.db || '0';
    
    // 技能値を反映
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
}

// 画像プレビューの更新
export async function updateImagePreview() {
    const { character } = await import('./app.js');
    
    const imagePreview = $('characterImagePreview');
    const removeButton = $('removeImageBtn');
    
    if (!imagePreview) return;
    
    // 既存のプレビューをクリア
    while (imagePreview.firstChild) {
        imagePreview.removeChild(imagePreview.firstChild);
    }
    
    // 画像がある場合は表示
    if (character.characterImage) {
        const img = document.createElement('img');
        img.src = character.characterImage;
        imagePreview.appendChild(img);
        
        // 削除ボタンを表示
        if (removeButton) removeButton.style.display = 'block';
    } else {
        // 画像がない場合はプレースホルダーを表示
        const placeholder = document.createElement('span');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = '画像をドロップまたはクリックして選択';
        imagePreview.appendChild(placeholder);
        
        // 削除ボタンを非表示
        if (removeButton) removeButton.style.display = 'none';
    }
}

// スキルテーブルの更新
export async function updateSkillTables() {
    const { character } = await import('./app.js');
    
    // 戦闘技能
    const combatSkills = ['dodge', 'kick', 'grapple', 'punch', 'headbutt', 'throw', 'martialArts'];
    
    combatSkills.forEach(skill => {
        if ($(`${skill}-base`)) {
            const baseValue = skill === 'dodge' ? character.dex * 2 : defaultSkills[skill];
            $(`${skill}-base`).textContent = baseValue;
            
            // 既存の値を設定
            if ($(`${skill}-occ`)) $(`${skill}-occ`).value = 0;
            if ($(`${skill}-int`)) $(`${skill}-int`).value = 0;
            if ($(`${skill}-growth`)) $(`${skill}-growth`).value = 0;
            if ($(`${skill}-other`)) $(`${skill}-other`).value = 0;
            
            // 合計を計算
            updateSkillTotal(skill);
        }
    });
    
    // 射撃技能
    const shootingSkills = ['handgun', 'smg', 'shotgun', 'mg', 'rifle'];
    
    shootingSkills.forEach(skill => {
        if ($(`${skill}-base`)) {
            const mappedSkill = skill === 'smg' ? 'submachineGun' : (skill === 'mg' ? 'machineGun' : skill);
            $(`${skill}-base`).textContent = defaultSkills[mappedSkill] || 0;
            
            // 既存の値を設定
            if ($(`${skill}-occ`)) $(`${skill}-occ`).value = 0;
            if ($(`${skill}-int`)) $(`${skill}-int`).value = 0;
            if ($(`${skill}-growth`)) $(`${skill}-growth`).value = 0;
            if ($(`${skill}-other`)) $(`${skill}-other`).value = 0;
            
            // 合計を計算
            updateSkillTotal(skill);
        }
    });
    
    // 探索技能
    const investigateSkills = ['listen', 'spotHidden', 'libraryUse', 'track', 'locksmith', 'conceal', 'hide', 'sneak'];
    
    investigateSkills.forEach(skill => {
        if ($(`${skill}-base`)) {
            $(`${skill}-base`).textContent = defaultSkills[skill] || 0;
            
            // 既存の値を設定
            if ($(`${skill}-occ`)) $(`${skill}-occ`).value = 0;
            if ($(`${skill}-int`)) $(`${skill}-int`).value = 0;
            if ($(`${skill}-growth`)) $(`${skill}-growth`).value = 0;
            if ($(`${skill}-other`)) $(`${skill}-other`).value = 0;
            
            // 合計を計算
            updateSkillTotal(skill);
        }
    });
    
    // 知識技能
    const knowledgeSkills = ['firstAid', 'medicine', 'psychology', 'occult', 'history', 'cthulhuMythos'];
    
    knowledgeSkills.forEach(skill => {
        if ($(`${skill}-base`)) {
            $(`${skill}-base`).textContent = defaultSkills[skill] || 0;
            
            // 既存の値を設定
            if ($(`${skill}-occ`)) $(`${skill}-occ`).value = 0;
            if ($(`${skill}-int`)) $(`${skill}-int`).value = 0;
            if ($(`${skill}-growth`)) $(`${skill}-growth`).value = 0;
            if ($(`${skill}-other`)) $(`${skill}-other`).value = 0;
            
            // 合計を計算
            updateSkillTotal(skill);
        }
    });
    
    // 母国語の基本値を更新
    if ($('ownLanguage-base')) {
        const ownLanguageBase = character.edu * 5;
        $('ownLanguage-base').textContent = ownLanguageBase;
        updateSkillTotal('ownLanguage');
    }
}