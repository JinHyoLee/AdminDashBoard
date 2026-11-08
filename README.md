# MY ADMIN

CRUD 중심 SaaS Admin Dashboard (React + TypeScript + Vite + Zustand)

## 실행

```bash
npm install
npm run dev
```

## 현재 상태: 뼈대

헤더, 사이드바, 6개 페이지의 영역 배치만 있고 데이터와 기능은 아직 없어요.
점선 박스는 앞으로 구현할 영역이에요.

## 폴더 구조

```
src/
  components/
    layout/   Header, Sidebar
    common/   PageHeader, Placeholder
  pages/      Dashboard, Users, Products, Orders, Statistics, Settings
  stores/     navStore (현재 메뉴 상태)
```

## 개발 순서

1. Users: CRUD 완성
2. Products: 이미지와 카테고리 추가
3. Orders: 상태 변경 기능 추가
4. Dashboard: 앞에서 만든 데이터를 집계
5. Statistics: 차트 구현
6. Settings: 관리자 설정 구현

API 연동이 필요해지면 TanStack Query를 추가해요.
