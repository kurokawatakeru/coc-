// クトゥルフ神話TRPG キャラクター作成ツール - 定数定義

// キャラクターデータの初期構造
export const createCharacterTemplate = () => ({
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
});

// 初期技能値
export const defaultSkills = {
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