// 初期化関連機能

import { $ } from './utils.js';
import { loadSavedCharacterList } from './data-management.js';
import { initSkillPointsCalculation } from './skill-points.js';
import { updateBasicInfo, updateCharacteristic, rollIndividualStat, generateRandomCharacter } from './character-stats.js';
import { saveCharacter, loadCharacter } from './data-management.js';
import { printCharacterSheet, generatePDF } from './pdf-generation.js';
import { exportCharacter, importCharacter } from './export-import.js';
import { applyOccupationTemplate } from './occupation-templates.js';
import { addCustomSkill } from './custom-skills.js';
import { updateSkill } from './character-stats.js';
import { defaultSkills } from './constants.js';

// app.jsからcharacterを動的に参照

// アプリケーションの初期化
export async function initializeApp() {
    // ダークモード設定の読み込み
    const savedTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeSwitch').checked = true;
    }

    // テーマ切り替えボタンの動作
    if (document.getElementById('themeSwitch')) {
        document.getElementById('themeSwitch').addEventListener('change', function(e) {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('theme', 'dark');
                }
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('theme', 'light');
                }
            }
        });
    }
    
    // タブ切り替え処理
    initTabs();
    
    // イベントリスナーの設定
    setEventListeners();
    
    // 能力値入力フィールドの初期化
    initializeCharacteristicFields();
    
    // 技能フィールドの初期化
    await initializeSkillFields();
    
    // 保存データの読み込み
    loadSavedCharacterList();
    
    // 技能ポイント計算の初期化
    initSkillPointsCalculation();
    
    // アコーディオン初期化
    initAccordions();
    
    // 画像アップロード機能の初期化
    initImageUpload();
}

// 画像アップロード機能の初期化
export function initImageUpload() {
    const imageInput = $('characterImage');
    const imagePreview = $('characterImagePreview');
    const removeButton = $('removeImageBtn');
    
    if (!imageInput || !imagePreview) return;
    
    // 画像プレビューをクリックしたら入力を開く
    imagePreview.addEventListener('click', () => {
        imageInput.click();
    });
    
    // ファイル選択時の処理
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // 既存の画像があれば削除
                while (imagePreview.firstChild) {
                    imagePreview.removeChild(imagePreview.firstChild);
                }
                
                // 新しい画像を表示
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);
                
                // キャラクターデータに画像を保存
                import('./app.js').then(({ character }) => {
                    character.characterImage = e.target.result;
                });
                
                // 削除ボタンを表示
                if (removeButton) removeButton.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 画像削除ボタンの処理
    if (removeButton) {
        removeButton.addEventListener('click', (event) => {
            event.preventDefault();
            // プレビューをクリア
            while (imagePreview.firstChild) {
                imagePreview.removeChild(imagePreview.firstChild);
            }
            
            // プレースホルダーを追加
            const placeholder = document.createElement('span');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = '画像をドロップまたはクリックして選択';
            imagePreview.appendChild(placeholder);
            
            // キャラクターデータから画像を削除
            import('./app.js').then(({ character }) => {
                character.characterImage = null;
            });
            
            // 入力フィールドをリセット
            imageInput.value = '';
            
            // 削除ボタンを非表示
            removeButton.style.display = 'none';
        });
    }
    
    // ドラッグ&ドロップの処理
    imagePreview.addEventListener('dragover', (event) => {
        event.preventDefault();
        imagePreview.style.borderColor = 'var(--accent-color)';
    });
    
    imagePreview.addEventListener('dragleave', () => {
        imagePreview.style.borderColor = 'var(--border-color)';
    });
    
    imagePreview.addEventListener('drop', (event) => {
        event.preventDefault();
        imagePreview.style.borderColor = 'var(--border-color)';
        
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // 既存の画像があれば削除
                while (imagePreview.firstChild) {
                    imagePreview.removeChild(imagePreview.firstChild);
                }
                
                // 新しい画像を表示
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);
                
                // キャラクターデータに画像を保存
                import('./app.js').then(({ character }) => {
                    character.characterImage = e.target.result;
                });
                
                // 削除ボタンを表示
                if (removeButton) removeButton.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// アコーディオンの初期化
export function initAccordions() {
    // アコーディオン要素が存在する場合
    if (document.getElementById('combatSkillsHeader')) {
        document.getElementById('combatSkillsHeader').addEventListener('click', function() {
            toggleAccordion('combatSkillsContent', this);
        });
    }
    
    if (document.getElementById('shootingSkillsHeader')) {
        document.getElementById('shootingSkillsHeader').addEventListener('click', function() {
            toggleAccordion('shootingSkillsContent', this);
        });
    }
    
    if (document.getElementById('investigateSkillsHeader')) {
        document.getElementById('investigateSkillsHeader').addEventListener('click', function() {
            toggleAccordion('investigateSkillsContent', this);
        });
    }

    if (document.getElementById('actionSkillsHeader')) {
        document.getElementById('actionSkillsHeader').addEventListener('click', function() {
            toggleAccordion('actionSkillsContent', this);
        });
    }

    if (document.getElementById('negotiationSkillsHeader')) {
        document.getElementById('negotiationSkillsHeader').addEventListener('click', function() {
            toggleAccordion('negotiationSkillsContent', this);
        });
    }

    if (document.getElementById('knowledgeSkillsHeader')) {
        document.getElementById('knowledgeSkillsHeader').addEventListener('click', function() {
            toggleAccordion('knowledgeSkillsContent', this);
        });
    }
    
    if (document.getElementById('customFieldsHeader')) {
        document.getElementById('customFieldsHeader').addEventListener('click', function() {
            toggleAccordion('customFieldsContent', this);
        });
    }

    // 初期設定：開いた状態にする
    if (document.getElementById('combatSkillsContent')) {
        document.getElementById('combatSkillsContent').style.display = 'block';
    }
    if (document.getElementById('shootingSkillsContent')) {
        document.getElementById('shootingSkillsContent').style.display = 'block';
    }
    if (document.getElementById('investigateSkillsContent')) {
        document.getElementById('investigateSkillsContent').style.display = 'block';
    }
    if (document.getElementById('actionSkillsContent')) {
        document.getElementById('actionSkillsContent').style.display = 'block';
    }
    if (document.getElementById('negotiationSkillsContent')) {
        document.getElementById('negotiationSkillsContent').style.display = 'block';
    }
    if (document.getElementById('knowledgeSkillsContent')) {
        document.getElementById('knowledgeSkillsContent').style.display = 'block';
    }
    if (document.getElementById('customFieldsContent')) {
        document.getElementById('customFieldsContent').style.display = 'block';
    }
}

// アコーディオンの開閉
function toggleAccordion(contentId, header) {
    const content = document.getElementById(contentId);
    if (!content) return;
    
    const icon = header.querySelector('.fa-chevron-down, .fa-chevron-up');
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (icon && icon.classList.contains('fa-chevron-up')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    } else {
        content.style.display = 'block';
        if (icon && icon.classList.contains('fa-chevron-down')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
}

// タブ機能の初期化
export function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブなタブを解除
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // クリックされたタブをアクティブに
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            $(tabId).classList.add('active');
        });
    });
}

// イベントリスナーの設定
export function setEventListeners() {
    // ランダム生成ボタン
    if ($('randomBtn')) {
        $('randomBtn').addEventListener('click', generateRandomCharacter);
    }
    
    // 保存ボタン
    if ($('saveBtn')) {
        $('saveBtn').addEventListener('click', saveCharacter);
    }
    
    // 読み込みセレクト
    if ($('loadSelect')) {
        $('loadSelect').addEventListener('change', loadCharacter);
    }
    
    // 印刷ボタン
    if ($('printBtn')) {
        $('printBtn').addEventListener('click', printCharacterSheet);
    }
    
    // PDF生成ボタン
    if ($('generatePdfBtn')) {
        $('generatePdfBtn').addEventListener('click', generatePDF);
    }
    
    // エクスポートボタン
    if ($('exportBtn')) {
        $('exportBtn').addEventListener('click', exportCharacter);
    }
    
    // インポートボタン
    if ($('importBtn')) {
        $('importBtn').addEventListener('click', () => {
            if ($('importFile')) {
                $('importFile').click();
            }
        });
    }
    
    // インポートファイル選択
    if ($('importFile')) {
        $('importFile').addEventListener('change', importCharacter);
    }
    
    // 職業テンプレート選択
    if ($('occupationTemplate')) {
        $('occupationTemplate').addEventListener('change', applyOccupationTemplate);
    }
    
    // 基本情報フィールド
    const basicInfoFields = ['name', 'occupation', 'school', 'origin', 'gender', 'age'];
    basicInfoFields.forEach(field => {
        if ($(field)) {
            $(field).addEventListener('input', () => {
                updateBasicInfo();
            });
        }
    });
    
    // 個別の能力値ロールボタン
    const rollButtons = document.querySelectorAll('.roll-btn');
    rollButtons.forEach(button => {
        button.addEventListener('click', rollIndividualStat);
    });
    
    // スキル追加ボタン
    if ($('addSkillBtn')) {
        $('addSkillBtn').addEventListener('click', addCustomSkill);
    }
    
    // カスタムフィールド
    const customNameFields = [
        'art1Name', 'art2Name', 'craft1Name', 'craft2Name',
        'customSkill1Name', 'customSkill2Name', 'customFirearmName'
    ];
    
    customNameFields.forEach(field => {
        if ($(field)) {
            $(field).addEventListener('input', function() {
                import('./app.js').then(({ character }) => {
                    character[field] = this.value;
                });
            });
        }
    });
}

// 能力値入力フィールドの初期化
export function initializeCharacteristicFields() {
    const characteristics = ['str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu'];
    
    characteristics.forEach(stat => {
        if ($(stat)) {
            $(stat).addEventListener('input', () => {
                updateCharacteristic(stat);
            });
        }
    });
}

// 技能フィールドの初期化
export async function initializeSkillFields() {
    const { character } = await import('./app.js');
    
    // 各技能フィールドを取得
    for (const skill in defaultSkills) {
        // すべての技能をキャラクターデータにセット
        character.skills[skill] = defaultSkills[skill];

        const element = $(skill);
        if (element) {
            // 初期値を設定
            element.value = defaultSkills[skill];

            // イベントリスナーを追加
            element.addEventListener('input', () => {
                updateSkill(skill);
            });
        }
    }
}