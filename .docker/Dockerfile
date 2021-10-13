FROM node:14-alpine as builder
WORKDIR /app
RUN apk add git
COPY ./ /app
RUN yarn install
RUN yarn build

FROM node:14-alpine
WORKDIR /app
RUN apk add git
COPY --from=builder /app/build /app
# Temp fix with `RUN true`
# Error: https://github.com/blueoneapp/ecp/runs/3343866584?check_suite_focus=true#step:6:100
# Solution: https://github.com/moby/moby/issues/37965#issuecomment-426853382
RUN true
COPY --from=builder /app/package.json /app
RUN true
COPY --from=builder /app/yarn.lock /app
RUN true
COPY --from=builder /app/.adonisrc.json /app
RUN true
RUN yarn install --production=true
CMD node server.js
