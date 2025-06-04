// クトゥルフ神話TRPG キャラクター作成ツール スクリプト

// キャラクターデータ
let character = {
    // 基本情報
    name: '',
    occupation: '',
    school: '',
    origin: '',
    gender: '',
    age: '',
    
    // 能力値
    str: 0,
    con: 0,
    siz: 0,
    dex: 0,
    app: 0,
    int: 0,
    pow: 0,
    edu: 0,
    
    // 派生値
    san: 0,
    idea: 0,
    luck: 0,
    knowledge: 0,
    db: '',
    hp: 0,
    mp: 0,
    
    // 技能
    skills: {},
    
    // カスタムフィールド
    art1Name: '',
    art2Name: '',
    craft1Name: '',
    craft2Name: '',
    customSkill1Name: '',
    customSkill2Name: '',
    customFirearmName: '',
    
    // 画像データ
    characterImage: null,
    
    // 各種メモやバックストーリー（オプション）
    backstory: '',
    equipments: '',
    allies: '',
    notes: ''
};

// 初期技能値
const defaultSkills = {
    listen: 25,            // 聞き耳
    spotHidden: 25,        // 目星
    libraryUse: 25,        // 図書館
    track: 10,             // 追跡
    locksmith: 1,          // 鍵開け
    conceal: 15,           // 隠す
    hide: 10,              // 隠れる
    sneak: 10,             // 忍び歩き
    firstAid: 30,          // 応急手当
    medicine: 5,           // 医学
    psychology: 5,         // 心理学
    occult: 5,             // オカルト
    archaeology: 1,        // 考古学
    history: 20,           // 歴史
    cthulhuMythos: 0,      // クトゥルフ神話
    climb: 40,             // 登攀
    jump: 25,              // 跳躍
    swim: 25,              // 水泳
    drive: 20,             // 運転（自動車）
    pilot: 1,              // 操縦
    ride: 5,               // 乗馬
    throw: 25,             // 投擲
    dodge: 0,              // 回避（DEX×2で計算）
    persuade: 15,          // 説得
    fastTalk: 5,           // 言いくるめ
    bargain: 5,            // 値切り
    creditRating: 15,      // 信用
    handgun: 20,           // 拳銃
    rifle: 25,             // ライフル
    shotgun: 30,           // ショットガン
    submachineGun: 15,     // サブマシンガン
    machineGun: 15,        // マシンガン
    punch: 50,             // こぶし
    kick: 25,              // キック
    grapple: 25,           // 組みつき
    headbutt: 10,          // 頭突き
    // 追加技能
    accounting: 10,        // 経理
    anthropology: 1,       // 人類学
    biology: 1,            // 生物学
    chemistry: 1,          // 化学
    computer: 1,           // コンピューター
    electronics: 1,        // 電子工学
    geology: 1,            // 地質学
    law: 5,                // 法律
    navigate: 10,          // ナビゲート
    physics: 1,            // 物理学
    astronomy: 1,          // 天文学
    electricalRepair: 10,  // 電気修理
    mechanicalRepair: 20,  // 機械修理
    naturalHistory: 10,    // 博物学
    operateHeavyMachinery: 1, // 重機械操作
    photography: 10,       // 写真術
    psychoanalysis: 1,     // 精神分析
    disguise: 1,           // 変装
    martialArts: 1,        // マーシャルアーツ
    survival: 10,          // サバイバル
    pharmacy: 1,           // 薬学
    iaijutsu: 1,           // 居合
    // 言語
    ownLanguage: 0,        // 母国語（EDU×5）
    otherLanguage1: 1,     // 他の言語1
    otherLanguage2: 1,     // 他の言語2
};

// DOM要素取得のヘルパー関数
function $(id) {
    return document.getElementById(id);
}

// ページロード時の初期化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
    });
}

// アプリケーションの初期化
function initializeApp() {
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
    initializeSkillFields();
    
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
function initImageUpload() {
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
                character.characterImage = e.target.result;
                
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
            character.characterImage = null;
            
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
                character.characterImage = e.target.result;
                
                // 削除ボタンを表示
                if (removeButton) removeButton.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// アコーディオンの初期化
function initAccordions() {
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
function initTabs() {
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
function setEventListeners() {
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
            $(field).addEventListener('input', updateBasicInfo);
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
                character[field] = this.value;
            });
        }
    });
}

// 能力値入力フィールドの初期化
function initializeCharacteristicFields() {
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
function initializeSkillFields() {
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

// 基本情報の更新
function updateBasicInfo() {
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
function updateCharacteristic(stat) {
    if (!$(stat)) return;
    
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
function updateOwnLanguage() {
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
function updateSkill(skill) {
    if (!$(skill)) return;
    
    const value = parseInt($(skill).value) || 0;
    character.skills[skill] = value;
    
    // プレビュー更新
    updatePreview();
}

// 派生能力値の更新
function updateDerivedStats() {
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
function calculateDamageBonus(str, siz) {
    const total = str + siz;
    if (total <= 12) return '-1D6';
    if (total <= 16) return '-1D4';
    if (total <= 24) return '0';
    if (total <= 32) return '+1D4';
    return '+1D6';
}

// 個別の能力値をダイスロール
function rollIndividualStat(event) {
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
function generateRandomCharacter() {
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

// ダイスロール関数
function rollDice(num, sides) {
    let total = 0;
    for (let i = 0; i < num; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

// キャラクターの保存
function saveCharacter() {
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
function loadSavedCharacterList() {
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
function loadCharacter() {
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
    character = loadedCharacter;
    
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
function updateImagePreview() {
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
function updateSkillTables() {
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
}

// キャラクターシート印刷
function printCharacterSheet() {
    // プレビューを確実に更新
    updatePreview();
    
    // 印刷
    window.print();
}

// プレビュー更新
function updatePreview() {
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

// キャラクターデータのエクスポート
function exportCharacter() {
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
function importCharacter(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // ファイル拡張子チェック
    if (!file.name.endsWith('.json')) {
        alert('JSONファイル(.json)を選択してください。');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // JSONデータをパース
            const importedCharacter = JSON.parse(e.target.result);
            
            // バリデーション
            if (!importedCharacter.name) {
                throw new Error('有効なキャラクターデータではありません。');
            }
            
            // キャラクターデータを設定
            character = importedCharacter;
            
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

// PDF生成処理（完全版）
async function generatePDF() {
    try {
        // キャラクターデータの検証
        if (!character.name) {
            alert('PDF生成には探索者名が必要です。');
            return;
        }
        
        // PDF生成用のコンテナを準備
        const pdfContainer = $('pdf-container');
        const characterSheetImg = $('characterSheetImg');
        
        // キャラシート画像の設定
        // ファイル名を簡素化して、スペースを含まないものに変更
        characterSheetImg.src = 'character-sheet.png';

        // 読み込みエラー時の処理を追加
        characterSheetImg.onerror = function() {
            alert('キャラクターシート画像の読み込みに失敗しました。\n' +
                 '画像ファイル「character-sheet.png」が同じフォルダに存在するか確認してください。');
            return;
        };
        
        // 画像の読み込みを待つ
        await new Promise((resolve, reject) => {
            characterSheetImg.onload = resolve;
            characterSheetImg.onerror = reject;
            if (characterSheetImg.complete) resolve();
        }).catch(error => {
            throw new Error('キャラクターシート画像の読み込みに失敗しました。');
        });
        
        // 入力エリアの座標定義 (提供された詳細なリスト)
        const inputAreas = [
            { x: 800, y: 510, width: 270, height: 290, type: 'image', field: 'characterImage' },//画像
            { x: 311, y: 60, width: 173, height: 22, type: 'text', field: 'name' },  // 探索者名
            { x: 312, y: 92, width: 172, height: 22, type: 'text', field: 'occupation' },  // 職業
            { x: 327, y: 124, width: 156, height: 24, type: 'text', field: 'school' }, // 学校・学位
            { x: 272, y: 162, width: 203, height: 25, type: 'text', field: 'origin' }, // 出身
            { x: 273, y: 198, width: 61, height: 25, type: 'text', field: 'gender' },  // 性別
            { x: 398, y: 200, width: 44, height: 21, type: 'number', field: 'age' },// 年齢
            { x: 610, y: 90, width: 35, height: 25, type: 'number', field: 'str' }, // STR
            { x: 654, y: 95, width: 35, height: 20, type: 'number', field: 'strPercent' }, // STR✖️5
            { x: 762, y: 91, width: 35, height: 20, type: 'number', field: 'dex' }, // DEX
            { x: 815, y: 95, width: 35, height: 20, type: 'number', field: 'dexPercent' }, // DEX✖️5
            { x: 925, y: 90, width: 35, height: 20, type: 'number', field: 'int' }, // INT
            { x: 1031, y: 91, width: 35, height: 20, type: 'number', field: 'idea' },// アイデア
            { x: 610, y: 126, width: 35, height: 20, type: 'number', field: 'con' },// CON
            { x: 654, y: 130, width: 35, height: 20, type: 'number', field: 'conPercent' }, // CON✖️5
            { x: 762, y: 126, width: 35, height: 20, type: 'number', field: 'app' },// APP
            { x: 815, y: 130, width: 35, height: 20, type: 'number', field: 'appPercent' }, // APP✖️5
            { x: 925, y: 127, width: 35, height: 20, type: 'number', field: 'pow' },// POW
            { x: 1021, y: 128, width: 35, height: 20, type: 'number', field: 'luck' },// 幸運
            { x: 610, y: 160, width: 35, height: 20, type: 'number', field: 'siz' },// SIZ
            { x: 654, y: 165, width: 35, height: 20, type: 'number', field: 'sizPercent' }, // SIZ✖️5
            { x: 540, y: 516, width: 35, height: 18, type: 'number', field: 'eduSkillPoints' },// 職業技能
            { x: 761, y: 162, width: 35, height: 20, type: 'number', field: 'san' },// SAN
            { x: 1020, y: 162, width: 35, height: 20, type: 'number', field: 'knowledge' },// 知識    
            { x: 925, y: 163, width: 35, height: 20, type: 'number', field: 'edu' },// EDU
            { x: 710, y: 516, width: 35, height: 18, type: 'number', field: 'intSkillPoints' },//任意
            { x: 440, y: 549, width: 35, height: 20, type: 'number', field: 'fastTalk' },// 言いくるめ
            { x: 440, y: 577, width: 35, height: 20, type: 'number', field: 'medicine' },//医学
            { x: 440, y: 607, width: 35, height: 20, type: 'number', field: 'drive' },//運転(自動車)
            { x: 440, y: 637, width: 35, height: 20, type: 'number', field: 'driveOther' },// 運転()
            { x: 440, y: 666, width: 35, height: 20, type: 'number', field: 'firstAid' },// 応急手当て
            { x: 440, y: 695, width: 35, height: 20, type: 'number', field: 'occult' },// オカルト
            { x: 440, y: 725, width: 35, height: 20, type: 'number', field: 'dodge' },// 回避
            { x: 440, y: 754, width: 35, height: 20, type: 'number', field: 'chemistry' },// 化学
            { x: 440, y: 784, width: 35, height: 20, type: 'number', field: 'locksmith' },// 鍵開け
            { x: 440, y: 813, width: 35, height: 20, type: 'number', field: 'conceal' },// 隠す
            { x: 440, y: 843, width: 35, height: 20, type: 'number', field: 'hide' },// 隠れる
            { x: 440, y: 873, width: 35, height: 20, type: 'number', field: 'mechanicalRepair' },// 機械修理
            { x: 440, y: 903, width: 35, height: 20, type: 'number', field: 'listen' },// 聞き耳
            { x: 440, y: 932, width: 35, height: 20, type: 'number', field: 'cthulhuMythos' },// クトゥルフ神話
            { x: 440, y: 961, width: 35, height: 20, type: 'number', field: 'art1' },// 芸術()
            { x: 290, y: 964, width: 70, height: 20, type: 'text', field: 'art1Name' },// 芸術()
            { x: 440, y: 991, width: 35, height: 20, type: 'number', field: 'art2' },// 芸術()
            { x: 290, y: 995, width: 70, height: 20, type: 'text', field: 'art2Name' },// 芸術()
            { x: 440, y: 1021, width: 35, height: 20, type: 'number', field: 'accounting' },// 経理
            { x: 440, y: 1050, width: 35, height: 20, type: 'number', field: 'archaeology' },// 考古学
            { x: 440, y: 1080, width: 35, height: 20, type: 'number', field: 'computer' },// コンピューター
            { x: 440, y: 1110, width: 35, height: 20, type: 'number', field: 'sneak' },// 忍び歩き
            { x: 440, y: 1139, width: 35, height: 20, type: 'number', field: 'photography' },// 写真術
            { x: 440, y: 1168, width: 35, height: 20, type: 'number', field: 'operateHeavyMachinery' },// 重機械操作
            { x: 440, y: 1198, width: 35, height: 20, type: 'number', field: 'ride' },// 乗馬
            { x: 440, y: 1227, width: 35, height: 20, type: 'number', field: 'creditRating' },// 信用
            { x: 440, y: 1256, width: 35, height: 20, type: 'number', field: 'psychology' },// 心理学
            { x: 440, y: 1287, width: 35, height: 20, type: 'number', field: 'anthropology' },// 人類学
            { x: 730, y: 549, width: 35, height: 20, type: 'number', field: 'swim' },//水泳
            { x: 730, y: 579, width: 35, height: 20, type: 'number', field: 'craft1' },// 制作()
            { x: 580, y: 582, width: 70, height: 20, type: 'text', field: 'craft1Name' },// 制作()
            { x: 730, y: 607, width: 35, height: 20, type: 'number', field: 'craft2' },// 制作()
            { x: 730, y: 637, width: 35, height: 20, type: 'number', field: 'psychoanalysis' },// 精神分析
            { x: 730, y: 667, width: 35, height: 20, type: 'number', field: 'biology' },// 生物学
            { x: 730, y: 697, width: 35, height: 20, type: 'number', field: 'persuade' },// 説得
            { x: 730, y: 726, width: 35, height: 20, type: 'number', field: 'pilot1' },// 操縦()
            { x: 730, y: 755, width: 35, height: 20, type: 'number', field: 'pilot2' },// 操縦()
            { x: 730, y: 784, width: 35, height: 20, type: 'number', field: 'geology' },// 地質学
            { x: 730, y: 814, width: 35, height: 20, type: 'number', field: 'jump' },// 跳躍
            { x: 730, y: 844, width: 35, height: 20, type: 'number', field: 'track' },// 追跡
            { x: 730, y: 873, width: 35, height: 20, type: 'number', field: 'electricalRepair' },// 電気修理
            { x: 730, y: 902, width: 35, height: 20, type: 'number', field: 'electronics' },// 電子工学
            { x: 730, y: 931, width: 35, height: 20, type: 'number', field: 'astronomy' },// 天文学
            { x: 730, y: 961, width: 35, height: 20, type: 'number', field: 'throw' },// 投擲
            { x: 730, y: 990, width: 35, height: 20, type: 'number', field: 'climb' },// 登攀
            { x: 730, y: 1020, width: 35, height: 20, type: 'number', field: 'libraryUse' },// 図書館
            { x: 730, y: 1050, width: 35, height: 20, type: 'number', field: 'navigate' },// ナビゲート
            { x: 730, y: 1079, width: 35, height: 20, type: 'number', field: 'bargain' },// 値切り
            { x: 730, y: 1110, width: 35, height: 20, type: 'number', field: 'naturalHistory' },// 博物学
            { x: 730, y: 1138, width: 35, height: 20, type: 'number', field: 'physics' },// 物理学
            { x: 730, y: 1168, width: 35, height: 20, type: 'number', field: 'disguise' },// 変装
            { x: 730, y: 1198, width: 35, height: 20, type: 'number', field: 'law' },// 法律
            { x: 730, y: 1227, width: 35, height: 20, type: 'number', field: 'otherLanguage1' },// 他の言語
            { x: 730, y: 1256, width: 35, height: 20, type: 'number', field: 'otherLanguage2' },// 他の言語
            { x: 730, y: 1286, width: 35, height: 20, type: 'number', field: 'ownLanguage' },// 母国語
            { x: 1020, y: 815, width: 35, height: 20, type: 'number', field: 'martialArts' },// マーシャルアーツ
            { x: 1020, y: 844, width: 35, height: 20, type: 'number', field: 'spotHidden' },// 目星
            { x: 1020, y: 874, width: 35, height: 20, type: 'number', field: 'pharmacy' },// 薬学
            { x: 1020, y: 902, width: 35, height: 20, type: 'number', field: 'history' },// 歴史
            { x: 1020, y: 931, width: 35, height: 20, type: 'number', field: 'survival' },// サバイバル
            { x: 1020, y: 961, width: 35, height: 20, type: 'number', field: 'iaijutsu' },// 居合
            { x: 825, y: 1020, width: 130, height: 20, type: 'text', field: 'customSkill1Name' },// 追加技能書き込み場所
            { x: 1020, y: 1020, width: 35, height: 20, type: 'number', field: 'customSkill1' },// 追加技能書き込み場所の数値
            { x: 825, y: 1050, width: 130, height: 20, type: 'text', field: 'customSkill2Name' },// 追加技能書き込み場所
            { x: 1020, y: 1050, width: 35, height: 20, type: 'number', field: 'customSkill2' },// 追加技能書き込み場所の数値
            { x: 1020, y: 1138, width: 35, height: 20, type: 'number', field: 'handgun' },// 拳銃
            { x: 1020, y: 1168, width: 35, height: 20, type: 'number', field: 'submachineGun' },// サブマシンガン
            { x: 1020, y: 1198, width: 35, height: 20, type: 'number', field: 'shotgun' },// ショットガン
            { x: 1020, y: 1228, width: 35, height: 20, type: 'number', field: 'machineGun' },// マシンガン
            { x: 1020, y: 1257, width: 35, height: 20, type: 'number', field: 'rifle' },// ライフル
            { x: 825, y: 1288, width: 130, height: 20, type: 'text', field: 'customFirearmName' },// 火器系の技能書き込み場所
            { x: 1020, y: 1288, width: 35, height: 20, type: 'number', field: 'customFirearm' },// 火器系の技能書き込み場所の数値
            { x: 235, y: 1410, width: 30, height: 20, type: 'number', field: 'kick' },//キック
            { x: 235, y: 1438, width: 30, height: 20, type: 'number', field: 'grapple' },//組みつき
            { x: 235, y: 1464, width: 30, height: 20, type: 'number', field: 'punch' },//こぶし
            { x: 235, y: 1489, width: 30, height: 20, type: 'number', field: 'headbutt' },//頭突き
        ];
        
        // 既存の入力フィールドをクリア
        while (pdfContainer.children.length > 1) {
            pdfContainer.removeChild(pdfContainer.lastChild);
        }
        
        // カスタムフィールドとスキルデータを収集
        collectCustomFieldData();
        
        // 入力フィールドを生成
        inputAreas.forEach(area => {
            if (!area.field) return; // フィールド名がない場合はスキップ
            
            const input = document.createElement('div');
            input.className = 'pdf-input-overlay';
            input.style.left = area.x + 'px';
            input.style.top = area.y + 'px';
            input.style.width = area.width + 'px';
            input.style.height = area.height + 'px';
            
            // 値の設定
            if (area.type === 'text') {
                // 基本情報と特殊フィールド
                if (['name', 'occupation', 'school', 'origin', 'gender', 'age'].includes(area.field)) {
                    input.textContent = character[area.field] || '';
                }
                // 芸術名や制作名などのカスタムフィールド
                else if (area.field.includes('Name')) {
                    input.textContent = character[area.field] || '';
                }
            } 
            else if (area.type === 'number') {
                // 能力値
                if (['str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu'].includes(area.field)) {
                    input.textContent = character[area.field] || '0';
                }
                // 能力値パーセント
                else if (area.field.endsWith('Percent')) {
                    const baseField = area.field.replace('Percent', '');
                    input.textContent = (character[baseField] || 0) * 5;
                }
                // 派生値
                else if (['san', 'hp', 'mp', 'idea', 'luck', 'knowledge'].includes(area.field)) {
                    input.textContent = character[area.field] || '0';
                }
                // 技能
                else if (character.skills && character.skills[area.field] !== undefined) {
                    input.textContent = character.skills[area.field];
                }
                // 職業/任意技能ポイント
                else if (area.field === 'eduSkillPoints') {
                    input.textContent = (character.edu || 0) * 20;
                }
                else if (area.field === 'intSkillPoints') {
                    input.textContent = (character.int || 0) * 10;
                }
                // カスタム技能・カスタム火器など
                else if (area.field.startsWith('custom') && character.skills && character.skills[area.field]) {
                    input.textContent = character.skills[area.field];
                }
                // その他のスキル値
                else {
                    // 技能値が設定されていない場合はデフォルト値を使用
                    const skillValue = character.skills && character.skills[area.field] !== undefined 
                        ? character.skills[area.field] 
                        : (defaultSkills[area.field] || 0);
                    input.textContent = skillValue;
                }
            }
            else if (area.type === 'image' && area.field === 'characterImage') {
                // キャラクター画像の設定
                if (character.characterImage) {
                    const img = document.createElement('img');
                    img.src = character.characterImage;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '8px';
                    input.appendChild(img);
                }
            }
            
            pdfContainer.appendChild(input);
        });
        
        // jsPDFを初期化
        const { jsPDF } = window.jspdf;
        
        // PDFコンテナを表示
        pdfContainer.style.display = 'block';
        
        try {
            // HTML要素をキャンバスに変換
            const canvas = await html2canvas(pdfContainer, {
                scale: 2, // 高品質化
                useCORS: true,
                logging: false
            });
            
            // PDFコンテナを非表示に戻す
            pdfContainer.style.display = 'none';
            
            // キャンバスからイメージデータを取得
            const imgData = canvas.toDataURL('image/png');
            
            // PDF作成
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // 画像をPDFに追加
            pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
            
            // PDF保存
            pdf.save(`${character.name}_キャラクターシート.pdf`);
            
            // 成功メッセージ
            alert('PDFを生成しました！');
        } catch (error) {
            // キャンバス変換エラー
            console.error('キャンバス変換エラー:', error);
            alert('PDFの生成に失敗しました。一部ブラウザでは正常に動作しない場合があります。');
            
            // PDFコンテナを非表示に戻す
            pdfContainer.style.display = 'none';
        }
        
    } catch (error) {
        console.error('PDF生成エラー:', error);
        alert(`PDF生成中にエラーが発生しました: ${error.message}`);
    }
}

// カスタムフィールドのデータを収集
function collectCustomFieldData() {
    // HTML側で定義されたカスタムフィールドをキャラクターモデルに反映
    const customFields = [
        'art1Name', 'art2Name', 'craft1Name', 'craft2Name',
        'customSkill1Name', 'customSkill2Name', 'customFirearmName'
    ];
    
    customFields.forEach(field => {
        if ($(field)) {
            character[field] = $(field).value || '';
        }
    });
    
    // カスタム技能の値も収集
    const customSkillValues = [
        'art1', 'art2', 'craft1', 'craft2',
        'customSkill1', 'customSkill2', 'customFirearm'
    ];
    
    customSkillValues.forEach(field => {
        if ($(field)) {
            if (!character.skills) character.skills = {};
            character.skills[field] = parseInt($(field).value) || 0;
        }
    });
}

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
function applyOccupationTemplate() {
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

// 技能ポイント計算機能の初期化
function initSkillPointsCalculation() {
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
function updateSkillPoints() {
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
function updateSkillTotal(skillId) {
    if (!$(`${skillId}-base`) || !$(`${skillId}-total`)) return;
    
    const baseValue = parseInt($(`${skillId}-base`).textContent) || 0;
    const occPoints = parseInt($(`${skillId}-occ`)?.value) || 0;
    const intPoints = parseInt($(`${skillId}-int`)?.value) || 0;
    const growthPoints = parseInt($(`${skillId}-growth`)?.value) || 0;
    const otherPoints = parseInt($(`${skillId}-other`)?.value) || 0;
    
    const total = baseValue + occPoints + intPoints + growthPoints + otherPoints;
    $(`${skillId}-total`).textContent = total;

    // キャラクターデータを常に同期
    character.skills[skillId] = total;

    // 表示されている技能値を更新
    if ($(skillId)) {
        $(skillId).value = total;
    }
    
    // 回避技能の場合、DEXから計算される初期値を反映
    if (skillId === 'dodge') {
        updateDodgeBaseValue();
    }
}

// 回避技能の初期値更新（DEXの2倍）
function updateDodgeBaseValue() {
    const dex = parseInt($('dex')?.value) || 0;
    const dodgeBase = dex * 2;
    if ($('dodge-base')) {
        $('dodge-base').textContent = dodgeBase;
        updateSkillTotal('dodge');
    }
}

// 使用ポイント数の更新（すべての技能の合計を更新）
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

// カスタム技能の追加
function addCustomSkill() {
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
            updateUsedPoints();
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

// Node.js export for testing
if (typeof module !== "undefined" && module.exports) {
    module.exports = { rollDice, calculateDamageBonus };
}
