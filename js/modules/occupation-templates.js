// 職業テンプレート機能

import { $ } from './utils.js';
import { updatePreview } from './preview.js';
import { updateSkillPoints, updateSkillTotal } from './skill-points.js';
import { defaultSkills } from './constants.js';
import { character } from './app.js';

// 職業テンプレート
const occupationTemplates = {
    detective: {
        name: '探偵',
        skills: {
            psychology: 40,
            spotHidden: 50,
            listen: 40,
            persuade: 35,
            libraryUse: 30,
            locksmith: 20,
            firstAid: 30,
            handgun: 40
        }
    },
    doctor: {
        name: '医者',
        skills: {
            medicine: 60,
            psychology: 30,
            firstAid: 70,
            biology: 40,
            pharmacy: 35,
            persuade: 25,
            creditRating: 35
        }
    },
    journalist: {
        name: 'ジャーナリスト',
        skills: {
            libraryUse: 50,
            history: 30,
            photography: 35,
            persuade: 35,
            psychology: 25,
            spotHidden: 30,
            conceal: 25,
            fastTalk: 35
        }
    },
    professor: {
        name: '大学教授',
        skills: {
            libraryUse: 60,
            history: 50,
            archaeology: 40,
            psychology: 30,
            occult: 20,
            persuade: 30,
            creditRating: 40
        }
    },
    policeman: {
        name: '警察官',
        skills: {
            handgun: 50,
            firstAid: 35,
            persuade: 25,
            psychology: 25,
            spotHidden: 40,
            listen: 40,
            track: 30
        }
    }
};

// 職業テンプレートの適用
export function applyOccupationTemplate() {
    const templateKey = $('occupationTemplate').value;
    if (!templateKey || templateKey === 'default') return;
    
    const template = occupationTemplates[templateKey];
    if (!template) return;
    
    // 職業名を設定
    if ($('occupation')) {
        $('occupation').value = template.name;
        character.occupation = template.name;
    }
    
    // 技能値を設定
    for (const skill in template.skills) {
        if ($(skill)) {
            $(skill).value = template.skills[skill];
            character.skills[skill] = template.skills[skill];
        }
    }
    
    // スキルテーブルにも反映
    for (const skill in template.skills) {
        const mappedSkill = skill === 'handgun' ? 'handgun' :
                           skill === 'firstAid' ? 'firstAid' : 
                           skill;
        
        if ($(`${mappedSkill}-base`)) {
            // 技能テーブル内のフィールドに反映
            const occPoints = template.skills[skill] - (defaultSkills[skill] || 0);
            if (occPoints > 0 && $(`${mappedSkill}-occ`)) {
                $(`${mappedSkill}-occ`).value = occPoints;
                updateSkillTotal(mappedSkill);
            }
        }
    }
    
    // プレビュー更新
    updatePreview();
    
    // 技能ポイント計算の更新
    updateSkillPoints();
    
    alert(`「${template.name}」の職業テンプレートを適用しました。`);
}