REM Paths in this file are very specific

SET DST_DIR_JAVA="d:/RServer/src/main/java"
SET SRC_DIR_PROTOBUF="d:/WRRS-JS/protocol/"
SET DST_DIR_JS="d:/WRRS-JS/protocol/"

REM Compile Java version
protoc-2.6.1 --java_out=%DST_DIR_JAVA% WRRS.proto

REM Compile JavaScript version
c:/nodejs/pbjs %SRC_DIR_PROTOBUF%WRRS.proto  -e org.wikience.wrrs.wrrsprotobuf -t js > %DST_DIR_JS%WRRS.proto.js