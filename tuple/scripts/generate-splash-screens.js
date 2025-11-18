const fs = require('fs');
const path = require('path');

// Splash 화면 데이터 읽기
const splashData = require('../src/figma/splash-screens.json');

console.log('🎨 Splash 화면 생성 중...\n');

const screens = splashData.screens;

// screens 폴더 생성
const screensDir = path.join(__dirname, '../src/screens');
if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true });
}

// 각 화면에 대한 스크린 파일 생성
screens.forEach((screen, index) => {
  const screenName = screen.name.replace(/[_\s-]/g, ''); // Splash_SignIn -> SplashSignIn
  const componentName = `${screenName}Screen`;
  const fileName = `${componentName}.js`;
  const filePath = path.join(screensDir, fileName);
  
  const template = `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/config';

/**
 * ${screen.name}
 * Figma: ${splashData.pageName}
 */
export default function ${componentName}({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🎨 Tuple</Text>
        </View>
        
        {/* 타이틀 */}
        <Text style={styles.title}>${screen.name}</Text>
        
        {/* 서브타이틀 */}
        <Text style={styles.subtitle}>
          언어 교환 및 학습 플랫폼
        </Text>
      </View>
      
      {/* 하단 정보 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by React Native</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.7,
  },
});
`;
  
  fs.writeFileSync(filePath, template);
  console.log(`✅ ${index + 1}. ${componentName} 생성 완료`);
});

console.log(`\n🎉 총 ${screens.length}개의 Splash 화면이 생성되었습니다!`);
console.log('\n다음 단계:');
console.log('1. src/navigation/AppNavigator.js에 화면 추가');
console.log('2. 브라우저에서 확인');

