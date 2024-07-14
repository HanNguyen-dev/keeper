FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
ENV GIN_MODE=release
RUN go build -o /bin/keeper-be .

FROM scratch AS runner
COPY --from=build /bin/keeper-be /bin/keeper-be
COPY --from=build /etc/ssl/certs/ /etc/ssl/certs/
CMD ["/bin/keeper-be"]

