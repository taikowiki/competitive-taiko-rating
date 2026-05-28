set GOOS=linux
set GOARCH=amd64
go build -o dist/linux.bin .

set GOOS=darwin
set GOARCH=arm64
go build -o dist/mac-arm.bin .