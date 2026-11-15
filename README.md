# SaaS Admin Dashboard

CRUD 중심의 SaaS 관리자 대시보드.
사용자·상품·주문을 관리하고, 쌓인 데이터를 집계해 대시보드와 통계로 보여주는 것을 목표로 함.

## 기술 스택

- React 18 + TypeScript
- Vite
- Zustand (상태 관리, `persist`로 브라우저 localStorage에 저장)
- API 연동이 필요해지면 TanStack Query를 추가할 예정임

## 실행

```bash
npm install
npm run dev
```

## 진행 상황

| 단계 | 내용 | 상태 |
|---|---|---|
| 0 | 뼈대 (헤더, 사이드바, 6개 페이지 레이아웃) | 완료 |
| 1 | Users: CRUD 완성 | 완료 |
| 2 | Products: 이미지와 카테고리 추가 | 완료 |
| 3 | Orders: 상태 변경 기능 추가 | 예정 |
| 4 | Dashboard: 앞에서 만든 데이터를 집계 | 예정 |
| 5 | Statistics: 차트 구현 | 예정 |
| 6 | Settings: 관리자 설정 구현 | 예정 |

아직 구현하지 않은 페이지는 점선 박스로 영역만 표시함.

## 구현된 기능

### Users (사용자 관리)

- 사용자 추가 · 수정 · 삭제 · 상세보기 (모달)
- 이름 · 이메일 검색
- 컬럼 헤더 클릭으로 오름차순/내림차순 정렬
- 페이지당 10명씩 페이징
- 유효성 검사: 이름 필수, 이메일 형식, 이메일 중복(대소문자 구분 없음)
- 가입일은 추가할 때 자동으로 입력됨
- 샘플 사용자 25명이 기본으로 들어 있음

### Products (상품 관리)

- 상품 등록 · 수정 · 삭제 · 상세보기 (모달)
- 상품명 검색 + 카테고리 필터 (함께 적용 가능)
- 상품명 · 카테고리 · 가격 · 재고 정렬 (가격·재고는 숫자 기준)
- 이미지 업로드: JPG · PNG · WEBP만 허용, 미리보기와 삭제 가능
  - localStorage 용량(약 5MB) 때문에 최대 400px로 줄이고 JPEG로 압축해 저장함
- 상태는 따로 저장하지 않고 재고로 계산함: 재고 0이면 품절, 아니면 판매 중
- 유효성 검사: 상품명 필수, 가격·재고는 0 이상의 정수
- 카테고리: 전자제품 · 의류 · 식품 · 생활용품 · 도서
- 샘플 상품 15개가 기본으로 들어 있음

## 폴더 구조

```
src/
  components/
    layout/   Header, Sidebar
    common/   PageHeader, Placeholder, Modal, Pagination
  pages/      각 메뉴 페이지 + UserFormModal, ProductFormModal
  stores/     navStore (현재 메뉴), userStore, productStore
  types/      user, product (데이터 모양 정의)
```

## 참고

- 데이터는 브라우저 localStorage에 저장되므로 새로고침해도 유지됨
- 샘플 데이터로 초기화하려면 개발자도구 → Application → Local Storage에서
  `admin-users`, `admin-products` 항목을 삭제하고 새로고침하면 됨

## 데모



https://github.com/user-attachments/assets/1febfde9-3acd-4590-a484-3f12231bb687


