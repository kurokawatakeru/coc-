// プレビュー機能

import { $ } from './utils.js';

// プレビュー更新
export async function updatePreview() {
    const { character } = await import('./app.js');
    // 基本情報
    if ($('preview-name')) $('preview-name').textContent = character.name || '';
    if ($('preview-occupation')) $('preview-occupation').textContent = character.occupation || '';
    if ($('preview-school')) $('preview-school').textContent = character.school || '';
    if ($('preview-origin')) $('preview-origin').textContent = character.origin || '';
    if ($('preview-gender')) $('preview-gender').textContent = character.gender || '';
    if ($('preview-age')) $('preview-age').textContent = character.age || '';
    
    // 能力値
    if ($('preview-str')) $('preview-str').textContent = `${character.str}（${character.str * 5}%）`;
    if ($('preview-con')) $('preview-con').textContent = `${character.con}（${character.con * 5}%）`;
    if ($('preview-siz')) $('preview-siz').textContent = `${character.siz}（${character.siz * 5}%）`;
    if ($('preview-dex')) $('preview-dex').textContent = `${character.dex}（${character.dex * 5}%）`;
    if ($('preview-app')) $('preview-app').textContent = `${character.app}（${character.app * 5}%）`;
    if ($('preview-int')) $('preview-int').textContent = `${character.int}（${character.int * 5}%）`;
    if ($('preview-pow')) $('preview-pow').textContent = `${character.pow}（${character.pow * 5}%）`;
    if ($('preview-edu')) $('preview-edu').textContent = `${character.edu}（${character.edu * 5}%）`;
    
    // 派生値
    if ($('preview-san')) $('preview-san').textContent = `${character.san}点`;
    if ($('preview-hp')) $('preview-hp').textContent = `${character.hp}点`;
    if ($('preview-mp')) $('preview-mp').textContent = `${character.mp}点`;
    if ($('preview-idea')) $('preview-idea').textContent = `${character.idea}%`;
    if ($('preview-luck')) $('preview-luck').textContent = `${character.luck}%`;
    if ($('preview-knowledge')) $('preview-knowledge').textContent = `${character.knowledge}%`;
    if ($('preview-db')) $('preview-db').textContent = character.db;
    
    // 技能値
    for (const skill in character.skills) {
        if ($(`preview-${skill}`)) {
            $(`preview-${skill}`).textContent = `${character.skills[skill]}%`;
        }
    }
}