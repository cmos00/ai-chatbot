# 🔍 흰 화면 디버깅 단계

## 1️⃣ 브라우저에서 확인해주세요

### Elements 탭 확인
```
F12 → Elements 탭 → <div id="root"> 찾기
```

**질문: `<div id="root">` 안에 무엇이 있나요?**

#### 케이스 A: 비어있음
```html
<div id="root"></div>
```
→ React 앱이 마운트 안 됨

#### 케이스 B: 내용이 있음
```html
<div id="root">
  <div>...</div>
</div>
```
→ CSS 문제

### Console 탭 다시 확인
**"No errors" 맞나요?**
- 빨간색 에러가 하나도 없나요?
- 노란색 경고만 있나요?

## 2️⃣ Network 탭 확인

```
F12 → Network 탭 → 새로고침
```

**index.bundle 파일을 찾아주세요:**
- 초록색(200)인가요? ✅
- 빨간색(404, 500)인가요? ❌

## 3️⃣ 응답을 보내주세요

다음을 스크린샷으로 보내주시거나 설명해주세요:
1. Elements 탭의 `<div id="root">` 내용
2. Console 탭의 모든 메시지
3. Network 탭의 index.bundle 상태

