const axios = require('axios');
const fs = require('fs');
const path = require('path');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'gj6CKQTAERlM1P1dQnUayM';

async function exportFigmaImages() {
  try {
    console.log('🎨 Figma에서 화면 이미지 내보내기 중...\n');
    
    // 1. 파일 정보 가져오기
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    const pages = fileResponse.data.document.children;
    const splashPage = pages.find(page => page.name === '00_1_Splash');
    
    if (!splashPage) {
      console.log('❌ 00_1_Splash 페이지를 찾을 수 없습니다.');
      return;
    }

    console.log('✅ 00_1_Splash 페이지 발견!\n');

    // 2. 각 화면의 Node ID 수집
    const nodeIds = splashPage.children.map(screen => screen.id);
    
    console.log('📸 화면 이미지 생성 중...');
    splashPage.children.forEach((screen, i) => {
      console.log(`   ${i + 1}. ${screen.name} (ID: ${screen.id})`);
    });

    // 3. Figma에서 이미지 URL 가져오기
    const imagesResponse = await axios.get(
      `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}`,
      {
        params: {
          ids: nodeIds.join(','),
          format: 'png',
          scale: 2, // 2x 해상도
        },
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log('\n✅ 이미지 URL 생성 완료!\n');

    const imageUrls = imagesResponse.data.images;
    
    // 4. 이미지 다운로드
    const imagesDir = path.join(__dirname, '../src/assets/figma');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    for (const [nodeId, imageUrl] of Object.entries(imageUrls)) {
      const screen = splashPage.children.find(s => s.id === nodeId);
      const fileName = `${screen.name.replace(/[_\s]/g, '-')}.png`;
      const filePath = path.join(imagesDir, fileName);
      
      console.log(`📥 다운로드 중: ${screen.name}`);
      
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      fs.writeFileSync(filePath, imageResponse.data);
      console.log(`   ✅ 저장: ${fileName}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ 모든 이미지 다운로드 완료!`);
    console.log(`   저장 위치: src/assets/figma/`);
    
    // 5. 이미지 URL 정보 저장
    const imageInfo = {};
    for (const [nodeId, imageUrl] of Object.entries(imageUrls)) {
      const screen = splashPage.children.find(s => s.id === nodeId);
      imageInfo[screen.name] = {
        nodeId: nodeId,
        imageUrl: imageUrl,
        localPath: `src/assets/figma/${screen.name.replace(/[_\s]/g, '-')}.png`
      };
    }
    
    const infoPath = path.join(__dirname, '../src/figma/splash-images.json');
    fs.writeFileSync(infoPath, JSON.stringify(imageInfo, null, 2));
    console.log(`   정보 파일: src/figma/splash-images.json`);

  } catch (error) {
    console.error('❌ 오류:', error.response?.data || error.message);
  }
}

exportFigmaImages();

