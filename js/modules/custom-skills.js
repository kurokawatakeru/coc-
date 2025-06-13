// カスタム技能追加機能

import { $ } from './utils.js';
import { updateSkillTotal } from './skill-points.js';
import { defaultSkills } from './constants.js';
import { character } from './app.js';

// カスタム技能の追加
export function addCustomSkill() {
    // モーダルダイアログを表示
    showAddSkillModal();
}

// 技能追加モーダルの表示
function showAddSkillModal() {
    // モーダルが存在しない場合は作成
    if (!$('addSkillModal')) {
        const modal = document.createElement('div');
        modal.id = 'addSkillModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>カスタム技能の追加</h3>
                <div class="form-group">
                    <label for="newSkillName">技能名</label>
                    <input type="text" id="newSkillName" class="input" placeholder="新しい技能名">
                </div>
                <div class="form-group">
                    <label for="newSkillBase">初期値</label>
                    <input type="number" id="newSkillBase" class="input" value="1" min="0" max="100">
                </div>
                <div class="form-group">
                    <label for="newSkillCategory">カテゴリ</label>
                    <select id="newSkillCategory" class="input">
                        <option value="combat">戦闘技能</option>
                        <option value="shooting">射撃技能</option>
                        <option value="investigate">探索技能</option>
                        <option value="action">行動技能</option>
                        <option value="negotiation">交渉技能</option>
                        <option value="knowledge">知識技能</option>
                    </select>
                </div>
                <button id="saveNewSkill" class="btn primary"><i class="fas fa-plus"></i> 追加</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // モーダルの閉じるボタン
        $('addSkillModal').querySelector('.close').addEventListener('click', function() {
            $('addSkillModal').style.display = 'none';
        });
        
        // 技能追加ボタン
        $('saveNewSkill').addEventListener('click', function() {
            const skillName = $('newSkillName').value.trim();
            const baseValue = parseInt($('newSkillBase').value) || 1;
            const category = $('newSkillCategory').value;
            
            if (skillName) {
                addSkillToTable(skillName, baseValue, category);
                $('addSkillModal').style.display = 'none';
            } else {
                alert('技能名を入力してください');
            }
        });
    }
    
    // モーダルを表示
    $('addSkillModal').style.display = 'block';
}

// テーブルに新しい技能行を追加
function addSkillToTable(skillName, baseValue, category) {
    // スキルIDを生成（スペースや特殊文字を除去したもの）
    const skillId = 'custom-' + skillName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // 該当するカテゴリのテーブルを選択
    let tableBody;
    if (category === 'combat') {
        tableBody = $('combatSkillsContent')?.querySelector('.skill-table tbody');
    } else if (category === 'shooting') {
        tableBody = $('shootingSkillsContent')?.querySelector('.skill-table tbody');
    } else if (category === 'investigate') {
        tableBody = $('investigateSkillsContent')?.querySelector('.skill-table tbody');
    } else if (category === 'knowledge') {
        tableBody = $('knowledgeSkillsContent')?.querySelector('.skill-table tbody');
    } else {
        // 他のカテゴリの場合は最初のテーブルに追加
        tableBody = $('combatSkillsContent')?.querySelector('.skill-table tbody');
    }
    
    if (!tableBody) return;
    
    // 新しい行を作成
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="checkbox" class="growth-check" data-skill="${skillId}"></td>
        <td>${skillName}</td>
        <td id="${skillId}-base">${baseValue}</td>
        <td><input type="number" id="${skillId}-occ" class="input skill-points occupation-points" value="0" min="0"></td>
        <td><input type="number" id="${skillId}-int" class="input skill-points interest-points" value="0" min="0"></td>
        <td><input type="number" id="${skillId}-growth" class="input skill-points growth-points" value="0" min="0"></td>
        <td><input type="number" id="${skillId}-other" class="input skill-points other-points" value="0" min="0"></td>
        <td class="total-cell" id="${skillId}-total">${baseValue}</td>
    `;
    
    // テーブルに追加
    tableBody.appendChild(newRow);
    
    // デフォルト技能リストに追加
    defaultSkills[skillId] = baseValue;
    
    // キャラクターデータに追加
    character.skills[skillId] = baseValue;
    
    // イベントリスナーを追加
    const inputs = newRow.querySelectorAll('.skill-points');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateSkillTotal(skillId);
            updateSkillPoints();
        });
    });
    
    // 成長チェックボックスのリスナー
    const growthCheck = newRow.querySelector('.growth-check');
    growthCheck.addEventListener('change', function() {
        const growthInput = $(`${skillId}-growth`);
        if (this.checked && growthInput) {
            growthInput.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
        } else if (growthInput) {
            growthInput.style.backgroundColor = '';
        }
    });
    
    // 初期値を設定
    updateSkillTotal(skillId);
}

// スキルポイント更新のスタブ関数（循環参照を避けるため）
function updateSkillPoints() {
    // 実際の更新は skill-points.js で行う
    if (window.updateSkillPoints) {
        window.updateSkillPoints();
    }
}