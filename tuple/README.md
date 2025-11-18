# Tuple App

React Native로 개발된 iOS 및 Android 크로스 플랫폼 모바일 애플리케이션입니다.

## 프로젝트 구조

```
tuple/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── screens/         # 화면 컴포넌트
│   ├── navigation/      # 네비게이션 설정
│   ├── services/        # API 서비스
│   ├── utils/          # 유틸리티 함수
│   ├── assets/         # 이미지, 폰트 등
│   └── constants/      # 상수 및 설정
├── App.js              # 앱 진입점
└── package.json        # 의존성 관리
```

## 설치된 주요 라이브러리

- **React Native**: 크로스 플랫폼 모바일 앱 개발 프레임워크
- **Expo**: React Native 개발 도구
- **React Navigation**: 화면 네비게이션
- **Axios**: HTTP 클라이언트
- **AsyncStorage**: 로컬 데이터 저장소

## 시작하기

### 필수 요구사항

- Node.js (v14 이상)
- npm 또는 yarn
- Expo Go 앱 (모바일 기기에 설치)

### 개발 서버 실행

```bash
npm start
```

### 플랫폼별 실행

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 개발 가이드

### 새 화면 추가

1. `src/screens/` 폴더에 새 화면 컴포넌트 생성
2. `src/navigation/AppNavigator.js`에 라우트 추가

### API 호출

`src/services/api.js`에서 제공하는 axios 인스턴스를 사용하세요:

```javascript
import apiClient from '../services/api';

const fetchData = async () => {
  const response = await apiClient.get('/endpoint');
  return response.data;
};
```

### 로컬 데이터 저장

`src/utils/storage.js`의 유틸리티 함수를 사용하세요:

```javascript
import { storeData, getData } from '../utils/storage';

await storeData('key', { data: 'value' });
const data = await getData('key');
```

## 배포

### iOS

1. Xcode에서 프로젝트 열기
2. 빌드 설정 구성
3. App Store Connect에 업로드

### Android

1. 키스토어 생성
2. `android/app/build.gradle` 설정
3. AAB 파일 생성 및 Play Console에 업로드

## 라이선스

MIT

