FROM golang:latest

WORKDIR /backend

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

ENV PORT 8080

RUN bash build.sh --frontend-path "/"
