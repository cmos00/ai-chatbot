import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * Splash_Normal
 * Figma 실제 디자인 이미지 사용
 */
export default function SplashNormalScreen({ navigation }) {
  const { width, height } = Dimensions.get('window');
  
  React.useEffect(() => {
    // 2초 후 다음 화면으로 이동
    const timer = setTimeout(() => {
      // navigation.navigate('Home'); // 나중에 활성화
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Figma에서 가져온 실제 디자인 이미지 */}
      <Image
        source={require('../assets/figma/Splash-Normal.png')}
        style={[styles.image, { width, height }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    flex: 1,
  },
});
