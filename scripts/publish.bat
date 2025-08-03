@echo off
setlocal enabledelayedexpansion

echo 🚀 思源笔记 MCP 服务器发布脚本
echo ==================================

REM 检查参数
if "%1"=="" (
    echo 使用方法: %0 [npm^|docker^|both]
    echo   npm   - 发布到 npm
    echo   docker - 发布到 Docker Hub
    echo   both  - 同时发布到 npm 和 Docker Hub
    exit /b 1
)

set PUBLISH_TYPE=%1

REM 构建项目
echo 📦 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    exit /b 1
)

REM 测试构建结果
echo 🧪 测试构建结果...
start /b npm start
timeout /t 5 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

REM 发布到 npm
if "%PUBLISH_TYPE%"=="npm" goto :publish_npm
if "%PUBLISH_TYPE%"=="both" goto :publish_npm
goto :publish_docker

:publish_npm
echo 📤 发布到 npm...

REM 检查是否登录
call npm whoami >nul 2>&1
if errorlevel 1 (
    echo ❌ 请先登录 npm: npm login
    exit /b 1
)

REM 发布
call npm publish
if errorlevel 1 (
    echo ❌ npm 发布失败
    exit /b 1
)

echo ✅ npm 发布成功！
echo 📦 包地址: https://www.npmjs.com/package/siyuan-mcp

if "%PUBLISH_TYPE%"=="npm" goto :end

:publish_docker
echo 🐳 发布到 Docker Hub...

REM 检查 Docker 是否运行
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未运行或未登录
    exit /b 1
)

REM 构建镜像
echo 🔨 构建 Docker 镜像...
docker build -t xgq18237/siyuan-mcp:latest .
if errorlevel 1 (
    echo ❌ Docker 构建失败
    exit /b 1
)

REM 测试镜像
echo 🧪 测试 Docker 镜像...
docker run --rm -e SIYUAN_TOKEN=test xgq18237/siyuan-mcp:latest &
timeout /t 5 /nobreak >nul
docker stop $(docker ps -q --filter ancestor=xgq18237/siyuan-mcp:latest) >nul 2>&1

REM 推送到 Docker Hub
echo 📤 推送到 Docker Hub...
docker push xgq18237/siyuan-mcp:latest
if errorlevel 1 (
    echo ❌ Docker 推送失败
    exit /b 1
)

REM 添加版本标签
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set VERSION=%%i
docker tag xgq18237/siyuan-mcp:latest xgq18237/siyuan-mcp:!VERSION!
docker push xgq18237/siyuan-mcp:!VERSION!

echo ✅ Docker 发布成功！
echo 🐳 镜像地址: https://hub.docker.com/r/xgq18237/siyuan-mcp

:end
echo 🎉 发布完成！
echo 📚 文档: https://github.com/xgq18237/siyuan_mcp_server 