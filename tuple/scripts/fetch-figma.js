const axios = require('axios');
const fs = require('fs');
const path = require('path');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'gj6CKQTAERlM1P1dQnUayM';

async function fetchFigmaFile() {
  try {
    console.log('🎨 Figma 파일 정보를 가져오는 중...\n');
    
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    const fileData = fileResponse.data;
    
    console.log('✅ 파일 정보:');
    console.log(`   이름: ${fileData.name}`);
    console.log(`   버전: ${fileData.version}`);
    console.log('');

    const document = fileData.document;
    const pages = document.children || [];
    
    console.log('📑 페이지 목록:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    pages.forEach((page, index) => {
      console.log(`\n${index + 1}. 페이지: "${page.name}"`);
      console.log(`   ID: ${page.id}`);
      
      if (page.children && page.children.length > 0) {
        console.log(`   프레임/요소: ${page.children.length}개`);
        page.children.forEach((child, childIndex) => {
          console.log(`      ${childIndex + 1}. ${child.type}: "${child.name}"`);
        });
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 00_1_Splash 페이지 찾기
    const splashPage = pages.find(page => page.name === '00_1_Splash');
    
    if (splashPage) {
      console.log('\n✅ "00_1_Splash" 페이지 발견!');
      console.log(`   화면 수: ${splashPage.children ? splashPage.children.length : 0}개`);
      
      // 저장
      const outputDir = path.join(__dirname, '../src/figma');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, 'splash-screens.json');
      fs.writeFileSync(
        outputPath,
        JSON.stringify({
          pageName: splashPage.name,
          pageId: splashPage.id,
          screens: splashPage.children || [],
        }, null, 2)
      );

      console.log(`\n💾 저장 완료: ${outputPath}`);
      
      return splashPage;
    } else {
      console.log('\n⚠️  "00_1_Splash" 페이지를 찾을 수 없습니다.');
      console.log('사용 가능한 페이지:');
      pages.forEach(page => console.log(`   - ${page.name}`));
      return null;
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.response?.data || error.message);
    process.exit(1);
  }
}

fetchFigmaFile();

