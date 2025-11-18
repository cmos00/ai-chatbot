# 🚀 Tuple 프로젝트 설정 가이드

이 가이드는 Tuple 프로젝트를 Git, Supabase, Vercel에 배포하는 방법을 안내합니다.

---

## 📋 목차

1. [Supabase 설정](#1-supabase-설정)
2. [환경변수 설정](#2-환경변수-설정)
3. [Git 저장소 설정](#3-git-저장소-설정)
4. [Vercel 배포](#4-vercel-배포)
5. [Google OAuth 설정](#5-google-oauth-설정)

---

## 1️⃣ Supabase 설정

### 1.1 Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com/) 접속 및 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `tuple` (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 입력 (저장해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국에 가까운 지역)
4. **Create new project** 클릭
5. 프로젝트 생성 대기 (1-2분 소요)

### 1.2 API 키 복사

프로젝트 생성 후:
1. 좌측 메뉴에서 **Settings** (⚙️) 클릭
2. **API** 클릭
3. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGci...` (긴 토큰 문자열)

### 1.3 사용자 테이블 생성

1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. 아래 SQL 코드 붙여넣기:

```sql
-- 사용자 테이블 생성
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  picture TEXT,
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 데이터를 읽을 수 있도록 정책 생성
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (true);

-- 모든 사용자가 데이터를 삽입/업데이트할 수 있도록 정책 생성
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. **Run** (또는 Ctrl+Enter) 클릭하여 실행
5. ✅ "Success. No rows returned" 메시지 확인

---

## 2️⃣ 환경변수 설정

### 2.1 로컬 개발용 .env 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```bash
# .env 파일 생성
touch .env
```

`.env` 파일 내용:

```env
# Supabase 설정 (위에서 복사한 값 붙여넣기)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Google OAuth 설정
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=838080132433-qktmeg94mmgi7inofjhrtt8v0db71ppc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=838080132433-qktmeg94mmgi7inofjhrtt8v0db71ppc.apps.googleusercontent.com
```

⚠️ **중요**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 업로드되지 않습니다.

---

## 3️⃣ Git 저장소 설정

### 3.1 Git 초기화 (이미 되어있음)

```bash
# Git 상태 확인
git status
```

### 3.2 GitHub 저장소 생성

1. [github.com](https://github.com/) 접속
2. 우측 상단 **+** → **New repository** 클릭
3. 저장소 정보 입력:
   - **Repository name**: `tuple`
   - **Description**: `Language Exchange Mobile App`
   - **Visibility**: `Private` (권장) 또는 `Public`
   - ⚠️ **Initialize this repository** 옵션 체크 해제 (이미 로컬에 코드가 있음)
4. **Create repository** 클릭

### 3.3 Git 커밋 및 푸시

```bash
# 모든 파일 스테이징
git add .

# 커밋
git commit -m "Initial commit: Tuple app with Google login and Supabase"

# GitHub 저장소 연결 (본인의 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/tuple.git

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

---

## 4️⃣ Vercel 배포

### 4.1 Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com/) 접속 및 로그인
2. **Add New...** → **Project** 클릭
3. **Import Git Repository** 섹션에서 방금 만든 GitHub 저장소 선택
4. **Import** 클릭

### 4.2 프로젝트 설정

1. **Framework Preset**: `Other` 또는 `Create React App` 선택
2. **Build Command**:
   ```bash
   npx expo export:web
   ```
3. **Output Directory**:
   ```
   dist
   ```
4. **Install Command**: (기본값 유지)
   ```bash
   npm install
   ```

### 4.3 환경변수 설정 ⭐ (중요!)

**Environment Variables** 섹션에서 아래 변수 추가:

| Name | Value |
|------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` (Supabase에서 복사) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (Supabase에서 복사) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | `838080132433-qktmeg...` |
| `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID` | `838080132433-qktmeg...` |

### 4.4 배포

1. **Deploy** 클릭
2. 배포 완료 대기 (2-3분 소요)
3. ✅ 배포 성공 시 URL 생성: `https://tuple-xxxxx.vercel.app`

---

## 5️⃣ Google OAuth 설정 (Vercel URL 추가)

### 5.1 Google Cloud Console에서 Vercel URL 추가

1. [console.cloud.google.com](https://console.cloud.google.com/) 접속
2. 프로젝트 **tuple-477904** 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. OAuth 2.0 클라이언트 ID 클릭
5. **승인된 JavaScript 원본**에 추가:
   ```
   https://tuple-xxxxx.vercel.app
   ```
6. **승인된 리디렉션 URI**에 추가:
   ```
   https://tuple-xxxxx.vercel.app
   ```
7. **저장** 클릭

---

## 🎉 완료!

이제 다음 URL에서 앱에 접근할 수 있습니다:

- **로컬**: http://localhost:8081
- **Vercel**: https://tuple-xxxxx.vercel.app

---

## 🐛 문제 해결

### Supabase 연결 오류
- `.env` 파일에 올바른 URL과 Key가 입력되었는지 확인
- Vercel 환경변수가 정확히 입력되었는지 확인

### Google 로그인 오류
- `redirect_uri_mismatch`: Google Cloud Console에서 리디렉션 URI 확인
- `invalid_client`: Client ID가 올바른지 확인

### Vercel 빌드 실패
- `package.json`의 모든 dependencies가 설치되었는지 확인
- Build Command와 Output Directory 설정 확인

---

## 📚 추가 자료

- [Expo 공식 문서](https://docs.expo.dev/)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Vercel 공식 문서](https://vercel.com/docs)
- [Google OAuth 가이드](https://developers.google.com/identity/protocols/oauth2)
