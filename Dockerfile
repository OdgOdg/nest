FROM node:18-alpine
# 작업 디렉토리 설정
WORKDIR /app
# 종속성 파일 복사
COPY package.json yarn.lock ./
RUN yarn install
# 소스 코드 복사
COPY . . 
RUN yarn build
# 애플리케이션 포트 노출
EXPOSE 3000

# 8. 애플리케이션 실행
CMD ["yarn", "start:prod"]

