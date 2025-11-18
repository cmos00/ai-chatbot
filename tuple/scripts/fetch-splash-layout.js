const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

// HTTPS 인증서 검증 비활성화
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'gj6CKQTAERlM1P1dQnUayM';
const OUTPUT_FILE = path.join(__dirname, '../src/figma/splash-layout.json');

// Status bar 관련 키워드 (제외할 요소)
const STATUS_BAR_KEYWORDS = ['status bar', 'statusbar', 'status-bar', 'status_bar'];

function isStatusBar(nodeName) {
  const lowerName = nodeName.toLowerCase();
  return STATUS_BAR_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

async function fetchSplashLayout() {
  try {
    console.log('🎨 Figma에서 Splash_SignIn Auto Layout 정보 추출 중...\n');

    // 1. Figma 파일 정보 가져오기
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
        httpsAgent,
      }
    );
    
    const fileData = fileResponse.data;
    const splashPage = fileData.document.children.find(
      (page) => page.name === '00_1_Splash'
    );

    if (!splashPage) {
      console.error('❌ "00_1_Splash" 페이지를 찾을 수 없습니다.');
      return;
    }

    const splashSignInFrame = splashPage.children.find(
      (frame) => frame.name === 'Splash_SignIn'
    );

    if (!splashSignInFrame) {
      console.error('❌ "Splash_SignIn" 프레임을 찾을 수 없습니다.');
      return;
    }

    console.log(`✅ "Splash_SignIn" 프레임 발견!\n`);

    // 2. Auto Layout 정보를 포함한 구조 분석
    function analyzeNode(node, depth = 0) {
      if (!node) return null;

      const indent = '  '.repeat(depth);
      
      // Status bar 제외
      if (isStatusBar(node.name)) {
        console.log(`${indent}⏭️  SKIP: ${node.name}`);
        return null;
      }

      const nodeInfo = {
        id: node.id,
        name: node.name,
        type: node.type,
        absoluteBoundingBox: node.absoluteBoundingBox,
        
        // Auto Layout 속성
        layoutMode: node.layoutMode, // HORIZONTAL, VERTICAL, NONE
        primaryAxisSizingMode: node.primaryAxisSizingMode, // FIXED, AUTO
        counterAxisSizingMode: node.counterAxisSizingMode, // FIXED, AUTO
        primaryAxisAlignItems: node.primaryAxisAlignItems, // MIN, CENTER, MAX, SPACE_BETWEEN
        counterAxisAlignItems: node.counterAxisAlignItems, // MIN, CENTER, MAX
        
        // Padding
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight,
        paddingTop: node.paddingTop,
        paddingBottom: node.paddingBottom,
        
        // Spacing
        itemSpacing: node.itemSpacing,
        
        // Constraints (for non-auto-layout)
        constraints: node.constraints,
        
        // Layout positioning
        layoutAlign: node.layoutAlign, // INHERIT, STRETCH
        layoutGrow: node.layoutGrow, // 0 or 1
        
        // Style
        fills: node.fills,
        backgroundColor: node.backgroundColor,
        effects: node.effects,
        
        // Text properties (if TEXT node)
        characters: node.characters,
        style: node.style,
      };

      // Auto Layout 정보 출력
      if (node.layoutMode) {
        console.log(`${indent}📐 ${node.type}: ${node.name}`);
        console.log(`${indent}   Layout: ${node.layoutMode}`);
        console.log(`${indent}   Primary Align: ${node.primaryAxisAlignItems}`);
        console.log(`${indent}   Counter Align: ${node.counterAxisAlignItems}`);
        console.log(`${indent}   Item Spacing: ${node.itemSpacing || 0}`);
        if (node.paddingTop || node.paddingBottom || node.paddingLeft || node.paddingRight) {
          console.log(`${indent}   Padding: T:${node.paddingTop || 0} R:${node.paddingRight || 0} B:${node.paddingBottom || 0} L:${node.paddingLeft || 0}`);
        }
      } else {
        console.log(`${indent}📦 ${node.type}: ${node.name} (절대 위치)`);
        if (node.absoluteBoundingBox) {
          const box = node.absoluteBoundingBox;
          console.log(`${indent}   Position: x:${box.x}, y:${box.y}, w:${box.width}, h:${box.height}`);
        }
      }

      // 자식 요소 분석
      if (node.children && node.children.length > 0) {
        nodeInfo.children = node.children
          .map(child => analyzeNode(child, depth + 1))
          .filter(child => child !== null);
      }

      return nodeInfo;
    }

    const layoutStructure = analyzeNode(splashSignInFrame);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Layout 구조 분석 완료!');

    // 3. 결과 저장
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(layoutStructure, null, 2));
    console.log(`   저장 위치: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    if (error.response) {
      console.error('   Figma API 응답 오류:', error.response.status, error.response.data);
    }
  }
}

fetchSplashLayout();

