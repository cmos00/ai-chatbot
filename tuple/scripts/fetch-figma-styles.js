const axios = require('axios');
const fs = require('fs');
const path = require('path');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'gj6CKQTAERlM1P1dQnUayM';

async function fetchDetailedStyles() {
  try {
    console.log('🎨 Figma 상세 스타일 정보 가져오는 중...\n');
    
    // 파일 전체 정보 (nodes 포함)
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    const fileData = fileResponse.data;
    const pages = fileData.document.children;
    
    // 00_1_Splash 페이지 찾기
    const splashPage = pages.find(page => page.name === '00_1_Splash');
    
    if (!splashPage) {
      console.log('❌ 00_1_Splash 페이지를 찾을 수 없습니다.');
      return;
    }

    console.log('✅ 00_1_Splash 페이지 발견!');
    console.log(`   화면 수: ${splashPage.children.length}개\n`);

    // 각 화면의 상세 정보 추출
    const screens = splashPage.children.map((screen, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`${index + 1}. ${screen.name}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      // 기본 정보
      console.log(`타입: ${screen.type}`);
      console.log(`크기: ${screen.absoluteBoundingBox?.width} x ${screen.absoluteBoundingBox?.height}`);
      
      // 배경색
      if (screen.backgroundColor) {
        const bg = screen.backgroundColor;
        const hex = rgbToHex(bg.r, bg.g, bg.b);
        console.log(`배경색: ${hex} (opacity: ${bg.a || 1})`);
      }
      
      // 하위 요소들
      if (screen.children) {
        console.log(`\n하위 요소 (${screen.children.length}개):`);
        screen.children.forEach((child, i) => {
          console.log(`  ${i + 1}. ${child.name} (${child.type})`);
          
          // 텍스트 요소
          if (child.type === 'TEXT' && child.characters) {
            console.log(`     텍스트: "${child.characters}"`);
            if (child.style) {
              console.log(`     폰트: ${child.style.fontFamily} ${child.style.fontWeight}`);
              console.log(`     크기: ${child.style.fontSize}px`);
            }
            if (child.fills && child.fills[0] && child.fills[0].color) {
              const color = child.fills[0].color;
              console.log(`     색상: ${rgbToHex(color.r, color.g, color.b)}`);
            }
          }
        });
      }
      
      return {
        name: screen.name,
        type: screen.type,
        width: screen.absoluteBoundingBox?.width,
        height: screen.absoluteBoundingBox?.height,
        backgroundColor: screen.backgroundColor ? {
          hex: rgbToHex(screen.backgroundColor.r, screen.backgroundColor.g, screen.backgroundColor.b),
          opacity: screen.backgroundColor.a || 1
        } : null,
        children: screen.children ? extractChildren(screen.children) : []
      };
    });

    // JSON으로 저장
    const outputDir = path.join(__dirname, '../src/figma');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'splash-styles.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(screens, null, 2)
    );

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ 스타일 정보 저장 완료: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ 오류:', error.response?.data || error.message);
  }
}

function extractChildren(children) {
  return children.map(child => {
    const data = {
      name: child.name,
      type: child.type,
    };
    
    // 텍스트
    if (child.type === 'TEXT') {
      data.text = child.characters;
      if (child.style) {
        data.style = {
          fontFamily: child.style.fontFamily,
          fontWeight: child.style.fontWeight,
          fontSize: child.style.fontSize,
          textAlign: child.style.textAlignHorizontal,
        };
      }
    }
    
    // 색상
    if (child.fills && child.fills[0] && child.fills[0].color) {
      const color = child.fills[0].color;
      data.color = rgbToHex(color.r, color.g, color.b);
      data.opacity = color.a || 1;
    }
    
    // 위치
    if (child.absoluteBoundingBox) {
      data.position = {
        x: child.absoluteBoundingBox.x,
        y: child.absoluteBoundingBox.y,
        width: child.absoluteBoundingBox.width,
        height: child.absoluteBoundingBox.height,
      };
    }
    
    return data;
  });
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

fetchDetailedStyles();

