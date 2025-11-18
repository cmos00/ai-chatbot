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
const OUTPUT_DIR = path.join(__dirname, '../src/assets/figma/components');
const INFO_FILE = path.join(__dirname, '../src/figma/splash-signin-components.json');

// Status bar 관련 키워드 (제외할 요소)
const STATUS_BAR_KEYWORDS = ['status bar', 'statusbar', 'status-bar', 'status_bar'];

function isStatusBar(nodeName) {
  const lowerName = nodeName.toLowerCase();
  return STATUS_BAR_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

async function fetchSplashComponents() {
  try {
    console.log('🎨 Figma에서 Splash_SignIn 컴포넌트 추출 중...\n');

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
      console.log('사용 가능한 프레임:', splashPage.children.map(f => f.name).join(', '));
      return;
    }

    console.log(`✅ "Splash_SignIn" 프레임 발견!\n`);

    // 2. 프레임 내부의 모든 요소 분석
    function extractComponents(node, depth = 0) {
      const indent = '  '.repeat(depth);
      const components = [];

      if (!node) return components;

      // Status bar 제외
      if (isStatusBar(node.name)) {
        console.log(`${indent}⏭️  SKIP (Status Bar): ${node.name}`);
        return components;
      }

      // 현재 노드 정보
      const component = {
        id: node.id,
        name: node.name,
        type: node.type,
        absoluteBoundingBox: node.absoluteBoundingBox,
        fills: node.fills,
        effects: node.effects,
        exportable: true,
      };

      console.log(`${indent}📦 ${node.type}: ${node.name} (ID: ${node.id})`);
      
      // 배경색이나 스타일 정보 출력
      if (node.fills && node.fills.length > 0) {
        node.fills.forEach(fill => {
          if (fill.type === 'SOLID' && fill.color) {
            const r = Math.round(fill.color.r * 255);
            const g = Math.round(fill.color.g * 255);
            const b = Math.round(fill.color.b * 255);
            console.log(`${indent}   색상: rgb(${r}, ${g}, ${b})`);
            component.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        });
      }

      components.push(component);

      // 자식 요소가 있으면 재귀적으로 탐색
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          const childComponents = extractComponents(child, depth + 1);
          components.push(...childComponents);
        });
      }

      return components;
    }

    const allComponents = extractComponents(splashSignInFrame);
    
    console.log(`\n✅ 총 ${allComponents.length}개 컴포넌트 발견!\n`);

    // 3. 주요 컴포넌트 필터링 (버튼, 로고, 아이콘, 텍스트 등)
    const mainComponents = allComponents.filter(comp => {
      const nameLower = comp.name.toLowerCase();
      return (
        nameLower.includes('button') ||
        nameLower.includes('btn') ||
        nameLower.includes('logo') ||
        nameLower.includes('icon') ||
        nameLower.includes('google') ||
        nameLower.includes('apple') ||
        nameLower.includes('background') ||
        nameLower.includes('bg') ||
        comp.type === 'TEXT' // 모든 텍스트 요소 포함
      );
    });

    console.log('🎯 주요 컴포넌트:');
    mainComponents.forEach(comp => {
      console.log(`   • ${comp.name} (${comp.type})`);
    });

    // 4. 이미지 내보내기 (주요 컴포넌트만)
    if (mainComponents.length > 0) {
      console.log('\n📸 이미지 생성 중...\n');

      const componentIds = mainComponents.map(c => c.id).join(',');
      
      const imageResponse = await axios.get(
        `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${componentIds}&format=png&scale=2`,
        {
          headers: {
            'X-Figma-Token': FIGMA_ACCESS_TOKEN,
          },
          httpsAgent,
        }
      );

      const imageUrls = imageResponse.data.images;

      // 5. 이미지 다운로드
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      const downloadedComponents = [];
      for (const comp of mainComponents) {
        const imageUrl = imageUrls[comp.id];
        if (imageUrl) {
          const imageName = `${comp.name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
          const imagePath = path.join(OUTPUT_DIR, imageName);
          
          console.log(`📥 다운로드 중: ${comp.name}`);
          
          const response = await axios.get(imageUrl, {
            responseType: 'stream',
            httpsAgent,
          });
          
          response.data.pipe(fs.createWriteStream(imagePath));

          await new Promise((resolve, reject) => {
            response.data.on('end', () => {
              console.log(`   ✅ 저장: ${imageName}`);
              downloadedComponents.push({
                ...comp,
                imageName: imageName,
                imagePath: imagePath,
              });
              resolve();
            });
            response.data.on('error', reject);
          });
        }
      }

      // 6. 전체 프레임 정보도 저장
      const frameInfo = {
        frameName: splashSignInFrame.name,
        frameId: splashSignInFrame.id,
        absoluteBoundingBox: splashSignInFrame.absoluteBoundingBox,
        backgroundColor: splashSignInFrame.backgroundColor,
        components: downloadedComponents,
        allComponents: allComponents, // 모든 컴포넌트 정보도 저장
      };

      // 정보 파일 저장
      const infoDir = path.dirname(INFO_FILE);
      if (!fs.existsSync(infoDir)) {
        fs.mkdirSync(infoDir, { recursive: true });
      }

      fs.writeFileSync(INFO_FILE, JSON.stringify(frameInfo, null, 2));

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ 모든 컴포넌트 다운로드 완료!');
      console.log(`   이미지 저장 위치: ${OUTPUT_DIR}`);
      console.log(`   정보 파일: ${INFO_FILE}`);
      console.log(`   다운로드된 컴포넌트: ${downloadedComponents.length}개`);
    } else {
      console.log('\n⚠️  내보낼 주요 컴포넌트가 없습니다.');
      
      // 전체 정보는 저장
      fs.writeFileSync(INFO_FILE, JSON.stringify({
        frameName: splashSignInFrame.name,
        frameId: splashSignInFrame.id,
        allComponents: allComponents,
      }, null, 2));
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    if (error.response) {
      console.error('   Figma API 응답 오류:', error.response.status, error.response.data);
    }
  }
}

fetchSplashComponents();

