# 구글 로그인 설정 가이드

React Native + Expo 환경에서 구글 로그인을 구현하는 방법입니다.

---

## 📋 목차

1. [Google Cloud Console 설정](#1-google-cloud-console-설정)
2. [코드 설정](#2-코드-설정)
3. [테스트](#3-테스트)
4. [문제 해결](#4-문제-해결)

---

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성

#### 단계별 가이드:

1. **Google Cloud Console 접속**
   - 브라우저에서 [console.cloud.google.com](https://console.cloud.google.com/) 접속
   - 구글 계정으로 로그인 (없다면 계정 생성)

2. **새 프로젝트 만들기**
   - 화면 상단 좌측에 **프로젝트 선택** 드롭다운 클릭
   - 팝업창에서 우측 상단의 **새 프로젝트** 버튼 클릭
   
   ![프로젝트 선택 위치]
   ```
   Google Cloud Platform
   [≡] [프로젝트 선택 ▼]  [검색창]  [🔔] [👤]
   ```

3. **프로젝트 정보 입력**
   - **프로젝트 이름**: `Tuple` (또는 원하는 이름)
   - **조직**: 선택 안 함 (개인 프로젝트)
   - **위치**: 조직 없음 (기본값)
   
4. **만들기 클릭**
   - 하단의 **만들기** 버튼 클릭
   - 프로젝트 생성 완료까지 약 10-30초 소요
   - 알림이 뜨면 **프로젝트 선택** 클릭하여 새 프로젝트로 이동

> 💡 **팁**: 프로젝트 이름은 나중에 변경할 수 있지만, 프로젝트 ID는 변경할 수 없습니다.

### 1.2 OAuth 동의 화면 설정

#### 단계별 가이드:

1. **OAuth 동의 화면 메뉴로 이동**
   - 좌측 상단 **햄버거 메뉴(≡)** 클릭
   - **API 및 서비스** → **OAuth 동의 화면** 선택
   
2. **User Type 선택**
   - **외부(External)** 선택
   - **만들기** 버튼 클릭
   
   > ⚠️ **왜 외부를?** 개인 개발자는 "내부"를 선택할 수 없습니다. 외부를 선택하면 테스트 모드에서 개발할 수 있습니다.

3. **앱 정보 입력** (1단계)
   - **앱 이름**: `Tuple`
   - **사용자 지원 이메일**: 본인 구글 계정 이메일 선택
   - **앱 로고**: (선택사항) 나중에 추가 가능
   - **앱 도메인**: (비워두기)
   - **승인된 도메인**: (비워두기)
   - **개발자 연락처 정보**: 본인 이메일 입력
   - **저장 후 계속** 클릭
   
4. **범위(Scopes) 설정** (2단계)
   - 기본 범위는 자동으로 포함됨 (email, profile, openid)
   - 추가할 필요 없음
   - **저장 후 계속** 클릭

5. **테스트 사용자** (3단계)
   - **+ ADD USERS** 클릭
   - 본인 구글 계정 이메일 입력
   - 테스트할 다른 계정이 있다면 추가
   - **추가** 클릭
   - **저장 후 계속** 클릭
   
   > 💡 **중요**: 앱이 "테스트" 모드일 때는 여기 추가한 이메일만 로그인 가능합니다!

6. **요약(Summary) 확인** (4단계)
   - 입력한 정보 확인
   - **대시보드로 돌아가기** 클릭

### 1.3 OAuth 2.0 클라이언트 ID 생성

#### 📱 웹 애플리케이션 (필수)

#### 단계별 가이드:

1. **사용자 인증 정보 메뉴로 이동**
   - 좌측 **햄버거 메뉴(≡)** 클릭
   - **API 및 서비스** → **사용자 인증 정보** 선택

2. **새 OAuth 2.0 클라이언트 ID 만들기**
   - 상단의 **+ 사용자 인증 정보 만들기** 클릭
   - 드롭다운에서 **OAuth 2.0 클라이언트 ID** 선택

3. **애플리케이션 유형 선택**
   - **애플리케이션 유형**: **웹 애플리케이션** 선택
   - **이름**: `Tuple Web` 입력

4. **승인된 JavaScript 원본 추가**
   - **승인된 JavaScript 원본** 섹션에서 **+ URI 추가** 클릭
   - 다음 URL들을 하나씩 추가:
     ```
     http://localhost:8081
     http://localhost:19006
     ```
   
   > 💡 **설명**: 
   > - `localhost:8081`: Expo 웹 개발 서버
   > - `localhost:19006`: Expo Go 앱 개발 서버

5. **승인된 리디렉션 URI 추가**
   - **승인된 리디렉션 URI** 섹션에서 **+ URI 추가** 클릭
   - 다음 URL들을 하나씩 추가:
     ```
     http://localhost:8081
     http://localhost:19006
     ```
   
   > ⚠️ **나중에 추가**: Expo 계정이 있다면
   > ```
   > https://auth.expo.io/@YOUR_EXPO_USERNAME/tuple
   > ```
   > `YOUR_EXPO_USERNAME`을 본인의 Expo 계정명으로 변경
   > 
   > Expo 계정이 없다면 [expo.dev](https://expo.dev)에서 가입 후 추가하세요.

6. **만들기 클릭**
   - 하단의 **만들기** 버튼 클릭

7. **클라이언트 ID 복사**
   - 팝업창에 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 표시됨
   - **클라이언트 ID** 복사 (예: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - 💾 **안전한 곳에 저장**하세요!
   
   > ⚠️ **주의**: 
   > - **클라이언트 ID**만 필요합니다 (보안 비밀번호는 사용 안 함)
   > - `.apps.googleusercontent.com` 포함 전체를 복사하세요
   
8. **확인** 클릭

---

## 2. 코드 설정

### 2.1 SplashSignInScreen.js 수정

#### 단계별 가이드:

1. **파일 열기**
   - VSCode 또는 Cursor에서 프로젝트 열기
   - `src/screens/SplashSignInScreen.js` 파일 열기

2. **클라이언트 ID 입력 위치 찾기**
   - **33-37번째 줄** 찾기 (Google.useAuthRequest 부분)
   - 현재 코드:
   ```javascript
   const [request, response, promptAsync] = Google.useAuthRequest({
     webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
     iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
     androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
     expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
   });
   ```

3. **클라이언트 ID 교체**
   - Google Cloud Console에서 복사한 클라이언트 ID를 붙여넣기
   - `webClientId`와 `expoClientId`에 **동일한 ID** 입력
   - iOS/Android는 개발 초기에는 필요 없음 (나중에 추가 가능)

4. **수정 후 코드 예시**
   ```javascript
   const [request, response, promptAsync] = Google.useAuthRequest({
     webClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
     expoClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
     // iOS와 Android는 나중에 추가 가능
   });
   ```

   또는 간단하게:
   ```javascript
   const [request, response, promptAsync] = Google.useAuthRequest({
     webClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
     expoClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
   });
   ```

5. **파일 저장**
   - `Cmd + S` (Mac) 또는 `Ctrl + S` (Windows)로 저장

> 💡 **체크리스트**:
> - [ ] 클라이언트 ID가 `.apps.googleusercontent.com`으로 끝나는가?
> - [ ] `webClientId`와 `expoClientId`가 동일한가?
> - [ ] 따옴표(`''`)로 감싸져 있는가?
> - [ ] 파일을 저장했는가?

### 2.2 app.json 수정 (선택사항)

네이티브 앱용으로 scheme 추가:

```json
{
  "expo": {
    "scheme": "tuple"
  }
}
```

---

## 3. 테스트

### 3.1 웹에서 테스트

#### 단계별 가이드:

1. **개발 서버 실행**
   - 터미널(Terminal) 열기
   - 프로젝트 디렉토리로 이동:
     ```bash
     cd /Users/kakaogames/tuple
     ```
   - 웹 서버 시작:
     ```bash
     npm run web
     ```
   - 또는 캐시 삭제 후 시작:
     ```bash
     npm run web -- --clear
     ```

2. **브라우저에서 접속**
   - 자동으로 브라우저가 열립니다
   - 또는 수동으로 `http://localhost:8081` 접속
   - Splash 화면이 보여야 합니다 (그라디언트 배경 + 로고 + 버튼)

3. **구글 로그인 테스트**
   - **구글 로그인 버튼**(왼쪽 버튼) 클릭
   - 새 팝업창이 열립니다
   
   > ⚠️ **팝업이 차단되면?**
   > - 브라우저 주소창 옆 팝업 차단 아이콘 클릭
   > - `localhost:8081` 팝업 허용
   > - 다시 버튼 클릭

4. **구글 계정 선택**
   - 팝업창에서 구글 계정 선택
   - OAuth 동의 화면에서 추가한 테스트 계정이어야 함!
   
5. **권한 승인**
   - "Tuple이(가) 다음 항목에 액세스하려고 합니다" 화면
   - 기본 프로필 정보 보기
   - **계속** 또는 **허용** 클릭

6. **로그인 성공 확인**
   - 팝업창 자동으로 닫힘
   - 앱에서 알림 팝업 표시:
     ```
     로그인 성공
     환영합니다, [이름]님!
     ```
   - **확인** 클릭

### 3.2 디버깅 및 로그 확인

#### 브라우저 개발자 도구 사용:

1. **개발자 도구 열기**
   - `F12` (Windows/Linux)
   - `Cmd + Option + I` (Mac)
   - 또는 우클릭 → **검사**

2. **Console 탭 확인**
   - 로그인 성공 시:
     ```
     Google User Info: {name: "...", email: "...", ...}
     ```
   - 로그인 실패 시:
     ```
     Google Login Error: [오류 메시지]
     ```

3. **Network 탭 확인** (고급)
   - Google OAuth 요청 확인
   - 리디렉션 URL 확인

### 3.3 테스트 체크리스트

> ✅ **성공했다면**:
> - [ ] 팝업창이 정상적으로 열렸다
> - [ ] 구글 계정으로 로그인했다
> - [ ] "로그인 성공" 알림이 표시되었다
> - [ ] 콘솔에 사용자 정보가 출력되었다
>
> ❌ **실패했다면**: 아래 [4. 문제 해결](#4-문제-해결) 참고

---

## 4. 문제 해결

### ❌ "redirect_uri_mismatch" 오류

**원인**: 리디렉션 URI가 Google Cloud Console에 등록되지 않음

**해결**:
1. Google Cloud Console → **사용자 인증 정보** → 웹 클라이언트 ID 클릭
2. **승인된 리디렉션 URI**에 다음 추가:
   ```
   http://localhost:8081
   http://localhost:19006
   ```

### ❌ "invalid_client" 오류

**원인**: 잘못된 클라이언트 ID

**해결**:
1. Google Cloud Console에서 클라이언트 ID 다시 복사
2. `.apps.googleusercontent.com` 포함 전체 복사
3. `SplashSignInScreen.js`에 정확히 붙여넣기

### ❌ "access_denied" 오류

**원인**: OAuth 동의 화면이 승인되지 않음

**해결**:
1. Google Cloud Console → **OAuth 동의 화면**
2. **테스트 사용자** 추가
3. 본인의 구글 계정 이메일 추가

### ❌ 팝업이 차단됨

**원인**: 브라우저 팝업 차단

**해결**:
1. 브라우저 주소창 옆 팝업 차단 아이콘 클릭
2. `localhost:8081` 팝업 허용
3. 다시 로그인 시도

### ❌ "No refresh token is provided" 경고

**원인**: 정상 동작이지만 리프레시 토큰이 없음

**해결**: 무시해도 됨. 로그인 자체는 정상 작동합니다.

---

## 5. 추가 설정 (선택사항)

### 5.1 iOS 앱 설정

iOS 네이티브 앱용 클라이언트 ID:

1. Google Cloud Console → **사용자 인증 정보** → **+ 사용자 인증 정보 만들기**
2. 애플리케이션 유형: **iOS**
3. 번들 ID: `com.tuple.app` (app.json의 `ios.bundleIdentifier`와 동일)
4. 클라이언트 ID 복사 → `iosClientId`에 입력

### 5.2 Android 앱 설정

Android 네이티브 앱용 클라이언트 ID:

1. SHA-1 인증서 지문 생성:
   ```bash
   # macOS/Linux
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
   
   # 비밀번호: android
   ```

2. Google Cloud Console → **사용자 인증 정보** → **+ 사용자 인증 정보 만들기**
3. 애플리케이션 유형: **Android**
4. 패키지 이름: `com.tuple.app` (app.json의 `android.package`와 동일)
5. SHA-1 인증서 지문 입력
6. 클라이언트 ID 복사 → `androidClientId`에 입력

---

## 6. 프로덕션 배포 체크리스트

배포 전 확인 사항:

- [ ] 모든 플랫폼의 클라이언트 ID 설정 완료
- [ ] OAuth 동의 화면 검토 제출 (외부 사용자용)
- [ ] 프로덕션 도메인을 리디렉션 URI에 추가
- [ ] 환경 변수로 클라이언트 ID 관리 (하드코딩 지양)
- [ ] 로그아웃 기능 구현
- [ ] 에러 처리 개선

---

## 📚 참고 자료

- [Expo Auth Session 문서](https://docs.expo.dev/guides/authentication/#google)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 💡 팁

1. **개발 단계**에서는 웹 클라이언트 ID만 있어도 테스트 가능합니다.
2. **OAuth 동의 화면**이 "테스트" 상태일 때는 추가한 테스트 사용자만 로그인 가능합니다.
3. **프로덕션 배포** 전에 Google의 검토를 받아야 합니다(1-2주 소요).

---

## ❓ 문제가 계속되면?

1. 브라우저 개발자 도구(F12) 콘솔 확인
2. Metro 번들러 터미널 로그 확인
3. Google Cloud Console에서 설정 다시 확인
4. 캐시 삭제 후 재시작:
   ```bash
   cd /Users/kakaogames/tuple
   npm run web -- --clear
   ```
