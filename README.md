# it9yo-frontend

## 설치 방법

```shell
npm install

cd ios
pod install
# m1 mac
arch -x86_64 pod install
```

## 실행 방법

```shell
# 메트로 서버 실행
npx react-native start

# ios simulator 실행
npx react-native run-ios
또는
npm run ios

# android simulator 실행
npx react-native run-android
또는
npm run android
```

## 폴더 구조

- src/assets: 이미지, 폰트 등
- src/constants: 상수
- src/pages: 페이지 단위 컴포넌트
- src/components: 기타 컴포넌트
- src/contexts: context api 모음
- src/hooks: 커스텀 훅 모음
- src/modules: 네이티브 모듈
- src/recoil: 상태 관리 recoil 사용
- types: 타입 정의
