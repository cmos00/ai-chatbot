import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
// 테스트: Splash 화면 직접 import
import SplashSignInScreen from './src/screens/SplashSignInScreen';

export default function App() {
  // 웹에서 페이지 제목 설정
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.title = 'Tuple - Splash Test';
    }
  }

  // 네비게이션 없이 직접 화면 표시
  return (
    <View style={styles.appContainer}>
      <SplashSignInScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#26D599', // Fallback color
  },
});
