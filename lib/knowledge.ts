export const KNOWLEDGE_BASE = `
## 카카오게임즈 (Kakao Games Corp) 공식 정보
- 설립: 2016년 (카카오에서 게임 사업부문 분사)
- 모회사: 카카오(Kakao Corp)
- 상장: 2020년 9월, 코스닥(KOSDAQ)
- 본사: 경기도 성남시 분당구 판교로 (판교 테크노밸리)
- 사업: 모바일·PC 게임 개발 및 퍼블리싱

## 카카오게임즈 주요 게임
- 오딘: 발할라 라이징 — 개발사: 라이온하트 스튜디오(Lionheart Studio, 카카오게임즈 자회사), 2021년 출시
- 에버소울 — 퍼블리싱
- 가디언 테일즈 — 개발사: 카카오게임즈 산하 Kong Studios
- 배틀그라운드(PUBG) — 2017~2019년 한국 퍼블리싱 담당 (이후 크래프톤 직접 서비스)
- 우마무스메 프리티 더비 — 한국 퍼블리싱

## 주의
- CEO 등 인사 정보는 변경될 수 있으므로 공식 홈페이지(kakaogames.com) 확인 권장
`.trim();

export function isKakaoRelated(text: string): boolean {
  const keywords = ["카카오게임즈", "kakaogames", "kakao games", "오딘", "라이온하트", "에버소울"];
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}
