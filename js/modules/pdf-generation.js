// PDF生成・印刷機能

import { $ } from './utils.js';
import { defaultSkills } from './constants.js';

// キャラクターシート印刷（背景画像を利用）
export async function printCharacterSheet() {
    const { character } = await import('./app.js');
    
    try {
        if (!character.name) {
            alert('印刷には探索者名が必要です。');
            return;
        }

        const pdfContainer = $('pdf-container');
        const characterSheetImg = $('characterSheetImg');

        // 背景画像を設定
        characterSheetImg.src = 'character-sheet.png';
        characterSheetImg.onerror = function() {
            alert('キャラクターシート画像の読み込みに失敗しました。\n' +
                  '画像ファイル「character-sheet.png」が同じフォルダに存在するか確認してください。');
        };

        // 画像読み込みを待機
        await new Promise((resolve, reject) => {
            characterSheetImg.onload = resolve;
            characterSheetImg.onerror = reject;
            if (characterSheetImg.complete) resolve();
        });

        const inputAreas = [
            { x: 800, y: 510, width: 270, height: 290, type: 'image', field: 'characterImage' },
            { x: 311, y: 60, width: 173, height: 22, type: 'text', field: 'name' },
            { x: 312, y: 92, width: 172, height: 22, type: 'text', field: 'occupation' },
            { x: 327, y: 124, width: 156, height: 24, type: 'text', field: 'school' },
            { x: 272, y: 162, width: 203, height: 25, type: 'text', field: 'origin' },
            { x: 273, y: 198, width: 61, height: 25, type: 'text', field: 'gender' },
            { x: 398, y: 200, width: 44, height: 21, type: 'number', field: 'age' },
            { x: 610, y: 90, width: 35, height: 25, type: 'number', field: 'str' },
            { x: 654, y: 95, width: 35, height: 20, type: 'number', field: 'strPercent' },
            { x: 762, y: 91, width: 35, height: 20, type: 'number', field: 'dex' },
            { x: 815, y: 95, width: 35, height: 20, type: 'number', field: 'dexPercent' },
            { x: 925, y: 90, width: 35, height: 20, type: 'number', field: 'int' },
            { x: 1031, y: 91, width: 35, height: 20, type: 'number', field: 'idea' },
            { x: 610, y: 126, width: 35, height: 20, type: 'number', field: 'con' },
            { x: 654, y: 130, width: 35, height: 20, type: 'number', field: 'conPercent' },
            { x: 762, y: 126, width: 35, height: 20, type: 'number', field: 'app' },
            { x: 815, y: 130, width: 35, height: 20, type: 'number', field: 'appPercent' },
            { x: 925, y: 127, width: 35, height: 20, type: 'number', field: 'pow' },
            { x: 1021, y: 128, width: 35, height: 20, type: 'number', field: 'luck' },
            { x: 610, y: 160, width: 35, height: 20, type: 'number', field: 'siz' },
            { x: 654, y: 165, width: 35, height: 20, type: 'number', field: 'sizPercent' },
            { x: 540, y: 516, width: 35, height: 18, type: 'number', field: 'eduSkillPoints' },
            { x: 761, y: 162, width: 35, height: 20, type: 'number', field: 'san' },
            { x: 1020, y: 162, width: 35, height: 20, type: 'number', field: 'knowledge' },
            { x: 925, y: 163, width: 35, height: 20, type: 'number', field: 'edu' },
            { x: 710, y: 516, width: 35, height: 18, type: 'number', field: 'intSkillPoints' },
            { x: 440, y: 549, width: 35, height: 20, type: 'number', field: 'fastTalk' },
            { x: 440, y: 577, width: 35, height: 20, type: 'number', field: 'medicine' },
            { x: 440, y: 607, width: 35, height: 20, type: 'number', field: 'drive' },
            { x: 440, y: 637, width: 35, height: 20, type: 'number', field: 'driveOther' },
            { x: 440, y: 666, width: 35, height: 20, type: 'number', field: 'firstAid' },
            { x: 440, y: 695, width: 35, height: 20, type: 'number', field: 'occult' },
            { x: 440, y: 725, width: 35, height: 20, type: 'number', field: 'dodge' },
            { x: 440, y: 754, width: 35, height: 20, type: 'number', field: 'chemistry' },
            { x: 440, y: 784, width: 35, height: 20, type: 'number', field: 'locksmith' },
            { x: 440, y: 813, width: 35, height: 20, type: 'number', field: 'conceal' },
            { x: 440, y: 843, width: 35, height: 20, type: 'number', field: 'hide' },
            { x: 440, y: 873, width: 35, height: 20, type: 'number', field: 'mechanicalRepair' },
            { x: 440, y: 903, width: 35, height: 20, type: 'number', field: 'listen' },
            { x: 440, y: 932, width: 35, height: 20, type: 'number', field: 'cthulhuMythos' },
            { x: 440, y: 961, width: 35, height: 20, type: 'number', field: 'art1' },
            { x: 290, y: 964, width: 70, height: 20, type: 'text', field: 'art1Name' },
            { x: 440, y: 991, width: 35, height: 20, type: 'number', field: 'art2' },
            { x: 290, y: 995, width: 70, height: 20, type: 'text', field: 'art2Name' },
            { x: 440, y: 1021, width: 35, height: 20, type: 'number', field: 'accounting' },
            { x: 440, y: 1050, width: 35, height: 20, type: 'number', field: 'archaeology' },
            { x: 440, y: 1080, width: 35, height: 20, type: 'number', field: 'computer' },
            { x: 440, y: 1110, width: 35, height: 20, type: 'number', field: 'sneak' },
            { x: 440, y: 1139, width: 35, height: 20, type: 'number', field: 'photography' },
            { x: 440, y: 1168, width: 35, height: 20, type: 'number', field: 'operateHeavyMachinery' },
            { x: 440, y: 1198, width: 35, height: 20, type: 'number', field: 'ride' },
            { x: 440, y: 1227, width: 35, height: 20, type: 'number', field: 'creditRating' },
            { x: 440, y: 1256, width: 35, height: 20, type: 'number', field: 'psychology' },
            { x: 440, y: 1287, width: 35, height: 20, type: 'number', field: 'anthropology' },
            { x: 730, y: 549, width: 35, height: 20, type: 'number', field: 'swim' },
            { x: 730, y: 579, width: 35, height: 20, type: 'number', field: 'craft1' },
            { x: 580, y: 582, width: 70, height: 20, type: 'text', field: 'craft1Name' },
            { x: 730, y: 607, width: 35, height: 20, type: 'number', field: 'craft2' },
            { x: 730, y: 637, width: 35, height: 20, type: 'number', field: 'psychoanalysis' },
            { x: 730, y: 667, width: 35, height: 20, type: 'number', field: 'biology' },
            { x: 730, y: 697, width: 35, height: 20, type: 'number', field: 'persuade' },
            { x: 730, y: 726, width: 35, height: 20, type: 'number', field: 'pilot1' },
            { x: 730, y: 755, width: 35, height: 20, type: 'number', field: 'pilot2' },
            { x: 730, y: 784, width: 35, height: 20, type: 'number', field: 'geology' },
            { x: 730, y: 814, width: 35, height: 20, type: 'number', field: 'jump' },
            { x: 730, y: 844, width: 35, height: 20, type: 'number', field: 'track' },
            { x: 730, y: 873, width: 35, height: 20, type: 'number', field: 'electricalRepair' },
            { x: 730, y: 902, width: 35, height: 20, type: 'number', field: 'electronics' },
            { x: 730, y: 931, width: 35, height: 20, type: 'number', field: 'astronomy' },
            { x: 730, y: 961, width: 35, height: 20, type: 'number', field: 'throw' },
            { x: 730, y: 990, width: 35, height: 20, type: 'number', field: 'climb' },
            { x: 730, y: 1020, width: 35, height: 20, type: 'number', field: 'libraryUse' },
            { x: 730, y: 1050, width: 35, height: 20, type: 'number', field: 'navigate' },
            { x: 730, y: 1079, width: 35, height: 20, type: 'number', field: 'bargain' },
            { x: 730, y: 1110, width: 35, height: 20, type: 'number', field: 'naturalHistory' },
            { x: 730, y: 1138, width: 35, height: 20, type: 'number', field: 'physics' },
            { x: 730, y: 1168, width: 35, height: 20, type: 'number', field: 'disguise' },
            { x: 730, y: 1198, width: 35, height: 20, type: 'number', field: 'law' },
            { x: 825, y: 1020, width: 130, height: 20, type: 'text', field: 'customSkill1Name' },
            { x: 1020, y: 1020, width: 35, height: 20, type: 'number', field: 'customSkill1' },
            { x: 825, y: 1050, width: 130, height: 20, type: 'text', field: 'customSkill2Name' },
            { x: 1020, y: 1050, width: 35, height: 20, type: 'number', field: 'customSkill2' },
            { x: 1020, y: 1138, width: 35, height: 20, type: 'number', field: 'handgun' },
            { x: 1020, y: 1168, width: 35, height: 20, type: 'number', field: 'submachineGun' },
            { x: 1020, y: 1198, width: 35, height: 20, type: 'number', field: 'shotgun' },
            { x: 1020, y: 1228, width: 35, height: 20, type: 'number', field: 'machineGun' },
            { x: 1020, y: 1257, width: 35, height: 20, type: 'number', field: 'rifle' },
            { x: 825, y: 1288, width: 130, height: 20, type: 'text', field: 'customFirearmName' },
            { x: 1020, y: 1288, width: 35, height: 20, type: 'number', field: 'customFirearm' },
            { x: 235, y: 1410, width: 30, height: 20, type: 'number', field: 'kick' },
            { x: 235, y: 1438, width: 30, height: 20, type: 'number', field: 'grapple' },
            { x: 235, y: 1464, width: 30, height: 20, type: 'number', field: 'punch' },
            { x: 235, y: 1489, width: 30, height: 20, type: 'number', field: 'headbutt' }
        ];

        while (pdfContainer.children.length > 1) {
            pdfContainer.removeChild(pdfContainer.lastChild);
        }

        await collectCustomFieldData();

        inputAreas.forEach(area => {
            if (!area.field) return;

            const input = document.createElement('div');
            input.className = 'pdf-input-overlay';
            input.style.left = area.x + 'px';
            input.style.top = area.y + 'px';
            input.style.width = area.width + 'px';
            input.style.height = area.height + 'px';

            if (area.type === 'text') {
                if (['name', 'occupation', 'school', 'origin', 'gender', 'age'].includes(area.field)) {
                    input.textContent = character[area.field] || '';
                } else if (area.field.includes('Name')) {
                    input.textContent = character[area.field] || '';
                }
            } else if (area.type === 'number') {
                if (['str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu'].includes(area.field)) {
                    input.textContent = character[area.field] || '0';
                } else if (area.field.endsWith('Percent')) {
                    const baseField = area.field.replace('Percent', '');
                    input.textContent = (character[baseField] || 0) * 5;
                } else if (['san', 'hp', 'mp', 'idea', 'luck', 'knowledge'].includes(area.field)) {
                    input.textContent = character[area.field] || '0';
                } else if (character.skills && character.skills[area.field] !== undefined) {
                    input.textContent = character.skills[area.field];
                } else if (area.field === 'eduSkillPoints') {
                    input.textContent = (character.edu || 0) * 20;
                } else if (area.field === 'intSkillPoints') {
                    input.textContent = (character.int || 0) * 10;
                } else if (area.field.startsWith('custom') && character.skills && character.skills[area.field]) {
                    input.textContent = character.skills[area.field];
                } else {
                    const skillValue = character.skills && character.skills[area.field] !== undefined
                        ? character.skills[area.field]
                        : (defaultSkills[area.field] || 0);
                    input.textContent = skillValue;
                }
            } else if (area.type === 'image' && area.field === 'characterImage') {
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

        // PDF生成コンテナを表示
        pdfContainer.style.display = 'block';

        // html2canvasでキャンバスに変換
        const canvas = await html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // コンテナを非表示に戻す
        pdfContainer.style.display = 'none';

        // キャンバスを画像データに変換
        const imgData = canvas.toDataURL('image/png');

        // 新しいウィンドウで印刷
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>キャラクターシート印刷</title>
                    <style>
                        body { margin: 0; padding: 0; }
                        img { max-width: 100%; height: auto; }
                        @media print {
                            body { margin: 0; }
                            img { width: 100%; page-break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <img src="${imgData}" alt="キャラクターシート" />
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            alert('ポップアップブロックにより印刷ウィンドウを開けませんでした。ポップアップを許可してください。');
        }
    } catch (error) {
        console.error('印刷エラー:', error);
        alert(`印刷中にエラーが発生しました: ${error.message}`);
    }
}

// 簡易印刷機能（代替案）
export async function printCharacterSheetSimple() {
    const { character } = await import('./app.js');
    
    if (!character.name) {
        alert('印刷には探索者名が必要です。');
        return;
    }

    // プレビュータブの内容を印刷
    const previewContent = document.querySelector('#preview .panel');
    if (!previewContent) {
        alert('プレビューコンテンツが見つかりません。');
        return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${character.name} - キャラクターシート</title>
                <style>
                    body { font-family: 'Noto Sans JP', sans-serif; margin: 20px; }
                    .panel { background: white; }
                    .sheet-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #8e44ad; padding-bottom: 10px; }
                    .sheet-row, .sheet-row-2 { margin: 5px 0; }
                    .sheet-label { font-weight: bold; color: #8e44ad; }
                    .stat-table { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 10px 0; }
                    .stat-cell { padding: 5px; border: 1px solid #ddd; }
                    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
                    .skills-column h4 { color: #8e44ad; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    .skill-preview-item { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid #eee; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                ${previewContent.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    } else {
        alert('ポップアップブロックにより印刷ウィンドウを開けませんでした。');
    }
}

// PDF生成機能の続きは別途作成
export async function generatePDF() {
    // TODO: 実装予定
    alert('PDF生成機能は実装中です。現在は印刷機能をご利用ください。');
}

// カスタムフィールドデータの収集
export async function collectCustomFieldData() {
    const { character } = await import('./app.js');
    
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