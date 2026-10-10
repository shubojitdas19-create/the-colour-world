const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const docsDir = path.join(rootDir, 'docs');
const ignoreDirs = ['node_modules', '.next', '.git', 'dist', 'build', 'public'];

// Ensure docs directory exists
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

// ==========================================
// 1. PROJECT STRUCTURE MAPPER
// ==========================================
function generateFolderTree() {
    console.log('🗺️  Mapping Frontend Folder Tree...');
    let mapContent = '## Directory Structure\n\n```text\nthe-colour-world\n';

    function generateTree(dir, prefix = '', depth = 0) {
        if (!fs.existsSync(dir) || depth > 6) return;
        const items = fs.readdirSync(dir, { withFileTypes: true })
            .filter(item => !ignoreDirs.includes(item.name));

        items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            mapContent += `${prefix}${connector}${item.name}\n`;

            if (item.isDirectory()) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                generateTree(path.join(dir, item.name), newPrefix, depth + 1);
            }
        });
    }

    // Only map the src folder to keep it clean
    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
        generateTree(srcDir);
    }
    mapContent += '```\n\n';
    return mapContent;
}

// ==========================================
// 2. NEXT.JS APP ROUTER EXTRACTOR
// ==========================================
function generateRoutingContext() {
    console.log('🔗 Extracting App Router Pages & Layouts...');
    let routeDoc = '## Next.js App Router (Pages & Layouts)\n\n';

    const appDir = path.join(rootDir, 'src', 'app');
    if (!fs.existsSync(appDir)) return '⚠️ src/app directory not found.\n';

    function scanRoutes(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                scanRoutes(fullPath);
            } else if (/^(page|layout)\.(tsx|jsx)$/.test(item.name)) {
                const relativePath = fullPath.replace(rootDir, '').replace(/\\/g, '/');
                const routeUrl = relativePath.replace('/src/app', '').replace(/\/(page|layout)\.(tsx|jsx)/, '') || '/ (Homepage)';
                
                routeDoc += `### Route: \`${routeUrl}\`\n`;
                routeDoc += `*File: ${relativePath}*\n\`\`\`tsx\n${fs.readFileSync(fullPath, 'utf8')}\n\`\`\`\n\n`;
            }
        }
    }

    scanRoutes(appDir);
    return routeDoc;
}

// ==========================================
// 3. UI COMPONENTS & DATA EXTRACTOR
// ==========================================
function generateComponentContext() {
    console.log('🎨 Gathering UI Components & Homepage Data...');
    let compDoc = '## Core UI Components & Homepage Sections\n\n';

    const compDir = path.join(rootDir, 'src', 'components');
    if (!fs.existsSync(compDir)) return '⚠️ src/components directory not found.\n';

    function scanComponents(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                scanComponents(fullPath);
            } else if (/\.(tsx|jsx|ts|js)$/.test(item.name)) {
                const relativePath = fullPath.replace(rootDir, '').replace(/\\/g, '/');
                compDoc += `### Component: \`${relativePath}\`\n\`\`\`tsx\n${fs.readFileSync(fullPath, 'utf8')}\n\`\`\`\n\n`;
            }
        }
    }

    scanComponents(compDir);
    return compDoc;
}

// ==========================================
// 4. CONFIG & THEMING EXTRACTOR
// ==========================================
function generateConfigContext() {
    console.log('⚙️  Extracting Tailwind Theme & Configs...');
    let configDoc = '## Project Configurations (Tailwind, Package, etc.)\n\n';

    const configFiles = ['tailwind.config.ts', 'tailwind.config.js', 'package.json', 'src/app/globals.css'];
    
    configFiles.forEach(file => {
        const fullPath = path.join(rootDir, file);
        if (fs.existsSync(fullPath)) {
            const ext = file.endsWith('.json') ? 'json' : file.endsWith('.css') ? 'css' : 'typescript';
            configDoc += `### \`${file}\`\n\`\`\`${ext}\n${fs.readFileSync(fullPath, 'utf8')}\n\`\`\`\n\n`;
        }
    });

    return configDoc;
}

// ==========================================
// 5. MASTER AI HANDOFF COMPILE
// ==========================================
function generateMasterContext() {
    console.log('🤖 Generating FRONTEND_AI_CONTEXT.md...');

    const treeContext = generateFolderTree();
    const configContext = generateConfigContext();
    const routeContext = generateRoutingContext();
    const compContext = generateComponentContext();

    const masterDoc = `# THE COLOUR WORLD - FRONTEND ARCHITECTURE & AI CONTEXT

> **For the AI:** This document contains the complete frontend architecture, Next.js App Router maps, custom UI components, Tailwind configuration, and homepage data structures for "The Colour World" e-commerce website. Read this to understand the established design system, color variables, and existing sections before generating new pages or modifying the store.

---

${treeContext}

---

${configContext}

---

${routeContext}

---

${compContext}
`;

    fs.writeFileSync(path.join(docsDir, 'FRONTEND_AI_CONTEXT.md'), masterDoc);
    console.log('✅ FRONTEND_AI_CONTEXT.md generated successfully in the /docs folder!');
}

// ==========================================
// RUN
// ==========================================
generateMasterContext();