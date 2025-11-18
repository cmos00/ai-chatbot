import React, { useEffect, useState } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { upsertUser } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function SplashSignInScreen({ navigation }) {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  
  // Figma 디자인 기준: 375 x 667
  const designWidth = 375;
  const designHeight = 667;
  
  // 화면 크기에 맞게 스케일 계산 (최대 430px로 제한)
  const containerWidth = Math.min(width, 430);
  const containerHeight = height;
  const scale = containerWidth / designWidth;
  
  // Figma 레이아웃 비율 계산
  // 로고: y:259 (38.8%), 로그인: y:532 (79.8%)
  const logoTopRatio = 259 / designHeight; // 0.388
  const loginTopRatio = 532 / designHeight; // 0.798
  
  // 요소 크기
  const logoSize = 108 * scale;
  const tupleHeight = 32 * scale;
  const tupleWidth = 67 * scale;
  const signInWithHeight = 19 * scale;
  const signInWithWidth = 97 * scale;
  const buttonSize = 56 * scale;
  const buttonSpacing = 40 * scale; // 두 버튼 사이 간격

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '838080132433-qktmeg94mmgi7inofjhrtt8v0db71ppc.apps.googleusercontent.com',
    expoClientId: '838080132433-qktmeg94mmgi7inofjhrtt8v0db71ppc.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLoginSuccess(authentication);
    }
  }, [response]);

  const handleGoogleLoginSuccess = async (authentication) => {
    try {
      // 1. Google 사용자 정보 가져오기
      await AsyncStorage.setItem('userToken', authentication.accessToken);
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();
      
      // 2. Supabase에 사용자 정보 저장/업데이트
      try {
        const savedUser = await upsertUser(userInfo);
        console.log('✅ Supabase 사용자 저장 완료:', savedUser);
        
        // 3. 사용자 ID를 AsyncStorage에 저장
        await AsyncStorage.setItem('userId', savedUser.id.toString());
        await AsyncStorage.setItem('userEmail', userInfo.email);
        await AsyncStorage.setItem('userName', userInfo.name);
      } catch (supabaseError) {
        console.error('⚠️ Supabase 저장 실패 (계속 진행):', supabaseError);
        // Supabase 저장 실패해도 로그인은 진행
      }
      
      // 4. 로그인 성공 알림
      Alert.alert(
        '로그인 성공',
        `환영합니다, ${userInfo.name}님!`,
        [{ text: '확인', onPress: () => navigation?.navigate('Home') }]
      );
    } catch (error) {
      console.error('Google Login Error:', error);
      Alert.alert('로그인 오류', '로그인 중 문제가 발생했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google Login Error:', error);
      Alert.alert('로그인 오류', '구글 로그인을 시작할 수 없습니다.');
    }
  };

  const handleAppleLogin = () => {
    Alert.alert('애플 로그인', '애플 로그인은 추후 구현 예정입니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={[styles.content, { width: containerWidth, height: containerHeight }]}>
        {/* 배경 이미지 */}
        <ImageBackground
          source={require('../assets/figma/components/BG.png')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* 상단 여백 - Figma 비율: 38.8% */}
          <View style={{ flex: logoTopRatio }} />

          {/* 로고 + TUPLE 섹션 */}
          <View style={styles.logoSection}>
            {/* 로고 이미지 */}
            <Image
              source={require('../assets/figma/components/Logo.png')}
              style={{
                width: logoSize,
                height: logoSize,
              }}
              resizeMode="contain"
            />
            
            {/* TUPLE 텍스트 - 로고 아래 15px 간격 */}
            <View style={{ height: 15 * scale }} />
            <Image
              source={require('../assets/figma/components/TUPLE.png')}
              style={{
                width: tupleWidth,
                height: tupleHeight,
              }}
              resizeMode="contain"
            />
          </View>

          {/* 중간 여백 - 로고와 로그인 사이 */}
          <View style={{ flex: loginTopRatio - logoTopRatio - 0.225 }} />

          {/* 로그인 섹션 */}
          <View style={styles.loginSection}>
            {/* SIGN IN WITH 텍스트 */}
            <Image
              source={require('../assets/figma/components/SIGN-IN-WITH.png')}
              style={{
                width: signInWithWidth,
                height: signInWithHeight,
                marginBottom: 20 * scale,
              }}
              resizeMode="contain"
            />
            
            {/* 로그인 버튼들 */}
            <View style={styles.buttonRow}>
              {/* 구글 로그인 버튼 */}
              <TouchableOpacity
                style={{
                  width: buttonSize,
                  height: buttonSize,
                }}
                onPress={handleGoogleLogin}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../assets/figma/components/Btn-Login-Google.png')}
                  style={styles.buttonImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* 버튼 사이 간격 */}
              <View style={{ width: buttonSpacing }} />

              {/* 애플 로그인 버튼 */}
              <TouchableOpacity
                style={{
                  width: buttonSize,
                  height: buttonSize,
                }}
                onPress={handleAppleLogin}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../assets/figma/components/Btn-Login-Apple.png')}
                  style={styles.buttonImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 하단 여백 */}
          <View style={{ flex: 1 - loginTopRatio - 0.14 }} />
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#26D599', // Figma 그라디언트 시작 색상 (폴백)
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
  },
  background: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
});
