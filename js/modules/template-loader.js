// HTMLテンプレート読み込み機能

// テンプレートをfetchで取得して挿入する
export async function loadTemplate(templatePath, targetSelector) {
    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`テンプレートの読み込みに失敗しました: ${templatePath}`);
        }
        const html = await response.text();
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.innerHTML = html;
        } else {
            console.warn(`ターゲット要素が見つかりません: ${targetSelector}`);
        }
    } catch (error) {
        console.error('テンプレート読み込みエラー:', error);
    }
}

// 複数のテンプレートを並行して読み込む
export async function loadTemplates(templates) {
    const promises = templates.map(({ path, target }) => loadTemplate(path, target));
    await Promise.all(promises);
}

// 主要なコンポーネントを読み込む
export async function loadMainComponents() {
    const templates = [
        { path: 'templates/components/header.html', target: 'header-container' },
        { path: 'templates/components/tabs.html', target: 'tabs-container' },
        { path: 'templates/components/basic-info-tab.html', target: 'basic-tab-container' },
        { path: 'templates/components/skills-tab.html', target: 'skills-tab-container' },
        { path: 'templates/components/combat-tab.html', target: 'combat-tab-container' },
        { path: 'templates/components/preview-tab.html', target: 'preview-tab-container' },
        { path: 'templates/components/footer.html', target: 'footer-container' },
        { path: 'templates/components/pdf-container.html', target: 'pdf-container-wrapper' }
    ];
    
    await loadTemplates(templates);
}

// 技能タブのサブコンポーネントを読み込む
export async function loadSkillsSubComponents() {
    const skillTemplates = [
        { path: 'templates/components/skill-points-section.html', target: 'skill-points-container' },
        { path: 'templates/components/combat-skills-section.html', target: 'combat-skills-container' },
        { path: 'templates/components/shooting-skills-section.html', target: 'shooting-skills-container' },
        { path: 'templates/components/investigate-skills-section.html', target: 'investigate-skills-container' },
        { path: 'templates/components/knowledge-skills-section.html', target: 'knowledge-skills-container' },
        { path: 'templates/components/action-skills-section.html', target: 'action-skills-container' },
        { path: 'templates/components/negotiation-skills-section.html', target: 'negotiation-skills-container' },
        { path: 'templates/components/custom-fields-section.html', target: 'custom-fields-container' }
    ];
    
    await loadTemplates(skillTemplates);
}