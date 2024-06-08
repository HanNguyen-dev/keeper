FROM golang:1.22-alpine as build
WORKDIR /src
COPY . .
ENV GIN_MODE=release
RUN go build -o /bin/keeper-be .

FROM scratch as runner
COPY --from=build /bin/keeper-be /bin/keeper-be
CMD ["/bin/keeper-be"]