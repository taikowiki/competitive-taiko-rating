# Competitive Taiko Rating - 개발 메모

## 백엔드 구현 현황 (Go)

### 1. 데이터베이스 함수 (`site/backend/db/func.go`)
- `GetCurrentSession()`: `competition` 테이블에서 가장 최신(ID 기준) 세션 정보를 가져옵니다.
- `GetCurrentHirobaCompeIds()`: 
    - 내부적으로 `GetCurrentSession()`을 호출하여 현재 시즌/세션 확인.
    - `hiroba_competition` 테이블에서 해당 시즌/세션의 `compeId` 목록을 조회.
    - 현재 세션 데이터가 없을 경우 가장 최근의 데이터를 가져오는 fallback 로직 포함.

### 2. API 핸들러 (`site/backend/server/handler.go`)
- `CurrentSession`: 
    - 최신 세션 정보를 DB에서 가져오고, 각 곡의 `songNo`를 이용해 외부 API(`taiko.wiki`)에서 상세 정보(제목, 레벨)를 조회합니다.
    - `SongCache`를 사용하여 동일 곡에 대한 중복 API 호출을 방지합니다.

### 3. 외부 API 연동 (`site/backend/server/server.go`)
- `taiko.wiki/api/v1/song/no/:songNo` 엔드포인트를 통해 곡 정보를 가져옵니다.
- `diff` 값(5=우라, 기타=오니)에 따라 적절한 난이도 레벨을 파싱합니다.

## 프론트엔드 작업 (Svelte)
- `site/frontend/src/routes/About.svelte` 등에서 관련 내용 수정 중.

## 향후 과제
- 레이팅 랭킹 시스템 연동 (`GetRankings`)
- 플레이어 상세 페이지 (`GetPlayerDetails`) 구현 마무리
- 시즌별 기록 조회 기능 추가
