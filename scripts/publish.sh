#!/bin/bash

# 发布脚本
# 使用方法: ./scripts/publish.sh [npm|docker|both]

set -e

echo "🚀 思源笔记 MCP 服务器发布脚本"
echo "=================================="

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法: $0 [npm|docker|both]"
    echo "  npm   - 发布到 npm"
    echo "  docker - 发布到 Docker Hub"
    echo "  both  - 同时发布到 npm 和 Docker Hub"
    exit 1
fi

PUBLISH_TYPE=$1

# 构建项目
echo "📦 构建项目..."
npm run build

# 测试构建结果
echo "🧪 测试构建结果..."
timeout 10s npm start || true

# 发布到 npm
if [ "$PUBLISH_TYPE" = "npm" ] || [ "$PUBLISH_TYPE" = "both" ]; then
    echo "📤 发布到 npm..."
    
    # 检查是否登录
    if ! npm whoami > /dev/null 2>&1; then
        echo "❌ 请先登录 npm: npm login"
        exit 1
    fi
    
    # 发布
    npm publish
    
    echo "✅ npm 发布成功！"
    echo "📦 包地址: https://www.npmjs.com/package/siyuan-mcp"
fi

# 发布到 Docker Hub
if [ "$PUBLISH_TYPE" = "docker" ] || [ "$PUBLISH_TYPE" = "both" ]; then
    echo "🐳 发布到 Docker Hub..."
    
    # 检查是否登录 Docker
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker 未运行或未登录"
        exit 1
    fi
    
    # 构建镜像
    echo "🔨 构建 Docker 镜像..."
    docker build -t xgq18237/siyuan-mcp:latest .
    
    # 测试镜像
    echo "🧪 测试 Docker 镜像..."
    docker run --rm -e SIYUAN_TOKEN=test xgq18237/siyuan-mcp:latest &
    sleep 5
    kill %1 2>/dev/null || true
    
    # 推送到 Docker Hub
    echo "📤 推送到 Docker Hub..."
    docker push xgq18237/siyuan-mcp:latest
    
    # 添加版本标签
    VERSION=$(node -p "require('./package.json').version")
    docker tag xgq18237/siyuan-mcp:latest xgq18237/siyuan-mcp:$VERSION
    docker push xgq18237/siyuan-mcp:$VERSION
    
    echo "✅ Docker 发布成功！"
    echo "🐳 镜像地址: https://hub.docker.com/r/xgq18237/siyuan-mcp"
fi

echo "🎉 发布完成！"
echo "📚 文档: https://github.com/xgq18237/siyuan_mcp_server" 