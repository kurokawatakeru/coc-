// 技能ポイント計算機能

import { $ } from './utils.js';

// 技能ポイント計算機能の初期化
export function initSkillPointsCalculation() {
    // EDUとINTの値の変更監視
    if ($('edu')) {
        $('edu').addEventListener('input', updateSkillPoints);
    }
    if ($('int')) {
        $('int').addEventListener('input', updateSkillPoints);
    }
    
    // 職業ポイント計算方法の変更監視
    if ($('occupationPointsCalc')) {
        $('occupationPointsCalc').addEventListener('change', updateSkillPoints);
    }
    
    // ボーナスポイントの変更監視
    if ($('occupationPointsBonus')) {
        $('occupationPointsBonus').addEventListener('input', updateSkillPoints);
    }
    if ($('interestPointsBonus')) {
        $('interestPointsBonus').addEventListener('input', updateSkillPoints);
    }
    
    // 全ての技能ポイント入力フィールドの変更を監視
    document.querySelectorAll('.skill-points').forEach(input => {
        input.addEventListener('input', function() {
            // 対応する技能の合計を更新
            const skillId = this.id.split('-')[0];
            updateSkillTotal(skillId);
            
            // 使用されているポイント数を更新
            updateUsedPoints();
        });
    });
    
    // 成長チェックボックスの変更監視
    document.querySelectorAll('.growth-check').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const skillId = this.getAttribute('data-skill');
            // チェック状態に応じて成長欄の背景色を変更
            const growthInput = document.getElementById(`${skillId}-growth`);
            if (growthInput) {
                if (this.checked) {
                    growthInput.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
                } else {
                    growthInput.style.backgroundColor = '';
                }
            }
        });
    });
    
    // 初期更新
    updateSkillPoints();
}

// 技能ポイントの更新
export function updateSkillPoints() {
    const edu = parseInt($('edu')?.value) || 0;
    const int = parseInt($('int')?.value) || 0;
    
    // 職業ポイントの計算
    const occCalcMethod = $('occupationPointsCalc')?.value || 'edu*20';
    let occPoints = 0;
    
    if (occCalcMethod === 'edu*20') {
        occPoints = edu * 20;
    } else if (occCalcMethod === 'edu*15') {
        occPoints = edu * 15;
    } else if (occCalcMethod === 'edu*10') {
        occPoints = edu * 10;
    }
    
    // ボーナスポイントの追加
    const occBonus = parseInt($('occupationPointsBonus')?.value) || 0;
    const totalOccPoints = occPoints + occBonus;
    
    // 興味ポイントの計算
    const intPoints = int * 10;
    const intBonus = parseInt($('interestPointsBonus')?.value) || 0;
    const totalIntPoints = intPoints + intBonus;
    
    // 使用されているポイントを計算
    const usedOccPoints = calculateUsedOccPoints();
    const usedIntPoints = calculateUsedIntPoints();
    
    // 表示を更新
    if ($('occupationPointsTotal')) {
        $('occupationPointsTotal').textContent = `${usedOccPoints}/${totalOccPoints}`;
    }
    if ($('interestPointsTotal')) {
        $('interestPointsTotal').textContent = `${usedIntPoints}/${totalIntPoints}`;
    }
    
    // ポイント割り当てフィールドの制限を設定
    updatePointsFieldsLimits(totalOccPoints - usedOccPoints, totalIntPoints - usedIntPoints);
}

// 使用済み職業ポイントの計算
function calculateUsedOccPoints() {
    let total = 0;
    document.querySelectorAll('.occupation-points').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    return total;
}

// 使用済み興味ポイントの計算
function calculateUsedIntPoints() {
    let total = 0;
    document.querySelectorAll('.interest-points').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    return total;
}

// ポイント割り当てフィールドの制限を更新
function updatePointsFieldsLimits(remainingOcc, remainingInt) {
    // 入力済みの値は保持するが、新たに入力する際の最大値を制限
    // 赤/緑で残りポイント数の状態を視覚的に示す
    const occPointsTotal = $('occupationPointsTotal');
    const intPointsTotal = $('interestPointsTotal');
    
    if (occPointsTotal) {
        if (remainingOcc < 0) {
            occPointsTotal.style.color = 'var(--danger-color)';
        } else {
            occPointsTotal.style.color = 'var(--success-color)';
        }
    }
    
    if (intPointsTotal) {
        if (remainingInt < 0) {
            intPointsTotal.style.color = 'var(--danger-color)';
        } else {
            intPointsTotal.style.color = 'var(--success-color)';
        }
    }
}

// 特定の技能の合計値を更新
export async function updateSkillTotal(skillId) {
    if (!$(`${skillId}-base`) || !$(`${skillId}-total`)) return;
    
    const baseValue = parseInt($(`${skillId}-base`).textContent) || 0;
    const occPoints = parseInt($(`${skillId}-occ`)?.value) || 0;
    const intPoints = parseInt($(`${skillId}-int`)?.value) || 0;
    const growthPoints = parseInt($(`${skillId}-growth`)?.value) || 0;
    const otherPoints = parseInt($(`${skillId}-other`)?.value) || 0;
    
    const total = baseValue + occPoints + intPoints + growthPoints + otherPoints;
    $(`${skillId}-total`).textContent = total;

    // キャラクターデータを常に同期
    const { character } = await import('./app.js');
    character.skills[skillId] = total;

    // 表示されている技能値を更新
    if ($(skillId)) {
        $(skillId).value = total;
    }
    
}

// 回避技能の初期値更新
export function updateDodgeBaseValue() {
    const dex = parseInt($('dex')?.value) || 0;
    const dodgeBase = dex * 2;
    if ($('dodge-base')) {
        $('dodge-base').textContent = dodgeBase;
        updateSkillTotal('dodge');
    }
}

// 使用ポイント数の更新
function updateUsedPoints() {
    const usedOccPoints = calculateUsedOccPoints();
    const usedIntPoints = calculateUsedIntPoints();
    
    // EDUとINTから計算される最大値
    const edu = parseInt($('edu')?.value) || 0;
    const int = parseInt($('int')?.value) || 0;
    
    // 職業ポイントの計算
    const occCalcMethod = $('occupationPointsCalc')?.value || 'edu*20';
    let occPoints = 0;
    
    if (occCalcMethod === 'edu*20') {
        occPoints = edu * 20;
    } else if (occCalcMethod === 'edu*15') {
        occPoints = edu * 15;
    } else if (occCalcMethod === 'edu*10') {
        occPoints = edu * 10;
    }
    
    // ボーナスポイントの追加
    const occBonus = parseInt($('occupationPointsBonus')?.value) || 0;
    const totalOccPoints = occPoints + occBonus;
    
    // 興味ポイントの計算
    const intPoints = int * 10;
    const intBonus = parseInt($('interestPointsBonus')?.value) || 0;
    const totalIntPoints = intPoints + intBonus;
    
    // 表示更新
    if ($('occupationPointsTotal')) {
        $('occupationPointsTotal').textContent = `${usedOccPoints}/${totalOccPoints}`;
    }
    if ($('interestPointsTotal')) {
        $('interestPointsTotal').textContent = `${usedIntPoints}/${totalIntPoints}`;
    }
    
    // 残りポイントに基づいて表示色を変更
    updatePointsFieldsLimits(totalOccPoints - usedOccPoints, totalIntPoints - usedIntPoints);
}