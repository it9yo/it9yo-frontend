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


### 안드로이드 kakao 로그인
https://ssilook.tistory.com/entry/React-Native-RN-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EB%A1%9C%EA%B7%B8%EC%9D%B8kakao-login-%EA%B5%AC%ED%98%84

https://velog.io/@space_dog/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-%EB%B9%8C%EB%93%9C-%EC%8B%9C%EC%97%90-compileDebugKotlin-%EC%97%90%EB%9F%AC

https://dev-donghwan.tistory.com/3


### 안드로이드 코틀린 버전 확인
https://offbyone.tistory.com/425


### 안드로이드 Execution failed for task ':react-native-seoul-naver-login:generateDebugRFile'. 에러 발생시
```
cd android
./gradlew clean
cd ..

npx react-native run-android
```