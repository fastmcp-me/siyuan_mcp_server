# 🚀 部署和发布指南

本文档详细说明如何将思源笔记 MCP 服务器发布到 npm 和 Docker Hub。

## 📦 npm 包发布（支持 npx）

### 1. 准备工作

#### 1.1 注册 npm 账号
```bash
# 如果没有 npm 账号，先注册
npm adduser
```

#### 1.2 登录 npm
```bash
npm login
```

#### 1.3 检查包名可用性
```bash
npm search siyuan-mcp
```

### 2. 发布步骤

#### 2.1 构建项目
```bash
npm run build
```

#### 2.2 测试构建结果
```bash
npm start
```

#### 2.3 发布到 npm
```bash
npm publish
```

#### 2.4 验证发布
```bash
npm view siyuan-mcp
```

### 3. 使用 npx 运行

发布后，用户可以通过以下方式使用：

#### 3.1 直接运行
```bash
npx siyuan-mcp
```

#### 3.2 设置环境变量
```bash
SIYUAN_HOST=127.0.0.1 SIYUAN_PORT=6806 SIYUAN_TOKEN=your-token npx siyuan-mcp
```

#### 3.3 全局安装
```bash
npm install -g siyuan-mcp
siyuan-mcp
```

### 4. 版本更新

#### 4.1 更新版本号
```bash
# 补丁版本
npm version patch

# 次要版本
npm version minor

# 主要版本
npm version major
```

#### 4.2 重新发布
```bash
npm publish
```

## 🐳 Docker 发布

### 1. 准备工作

#### 1.1 注册 Docker Hub 账号
访问 [Docker Hub](https://hub.docker.com/) 注册账号

#### 1.2 登录 Docker Hub
```bash
docker login
```

### 2. 构建和发布

#### 2.1 构建镜像
```bash
docker build -t xgq18237/siyuan-mcp:latest .
```

#### 2.2 测试镜像
```bash
docker run --rm -e SIYUAN_TOKEN=your-token xgq18237/siyuan-mcp:latest
```

#### 2.3 推送到 Docker Hub
```bash
docker push xgq18237/siyuan-mcp:latest
```

#### 2.4 添加版本标签
```bash
docker tag xgq18237/siyuan-mcp:latest xgq18237/siyuan-mcp:1.0.0
docker push xgq18237/siyuan-mcp:1.0.0
```

### 3. 使用 Docker 镜像

#### 3.1 拉取镜像
```bash
docker pull xgq18237/siyuan-mcp:latest
```

#### 3.2 运行容器
```bash
docker run -d \
  -e SIYUAN_HOST=127.0.0.1 \
  -e SIYUAN_PORT=6806 \
  -e SIYUAN_TOKEN=your-token \
  --name siyuan-mcp-server \
  xgq18237/siyuan-mcp:latest
```

#### 3.3 使用 Docker Compose
```yaml
version: '3.8'
services:
  siyuan-mcp:
    image: xgq18237/siyuan-mcp:latest
    environment:
      - SIYUAN_HOST=127.0.0.1
      - SIYUAN_PORT=6806
      - SIYUAN_TOKEN=${SIYUAN_TOKEN}
    restart: unless-stopped
```

## 🔄 自动化发布

### 1. GitHub Actions 配置

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish

on:
  release:
    types: [published]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}

  publish-docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: xgq18237/siyuan-mcp:latest,xgq18237/siyuan-mcp:${{ github.ref_name }}
```

### 2. 设置 Secrets

在 GitHub 仓库设置中添加：
- `NPM_TOKEN`: npm 访问令牌
- `DOCKER_USERNAME`: Docker Hub 用户名
- `DOCKER_PASSWORD`: Docker Hub 密码

## 📋 发布检查清单

### npm 发布前检查
- [ ] 更新版本号
- [ ] 更新 CHANGELOG.md
- [ ] 测试构建结果
- [ ] 检查 package.json 配置
- [ ] 验证 README.md 内容
- [ ] 测试 npx 运行

### Docker 发布前检查
- [ ] 测试 Dockerfile 构建
- [ ] 验证镜像运行
- [ ] 检查环境变量配置
- [ ] 测试 Docker Compose
- [ ] 更新镜像标签

## 🛠️ 故障排除

### npm 发布问题

#### 包名冲突
```bash
# 检查包名是否可用
npm search siyuan-mcp
# 如果冲突，考虑使用作用域包名
npm publish --access public
```

#### 权限问题
```bash
# 检查登录状态
npm whoami
# 重新登录
npm login
```

### Docker 发布问题

#### 登录失败
```bash
# 重新登录 Docker Hub
docker logout
docker login
```

#### 推送失败
```bash
# 检查镜像标签
docker images
# 重新标记
docker tag local-image:tag xgq18237/siyuan-mcp:latest
```

## 📚 相关链接

- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Docker Hub 发布指南](https://docs.docker.com/docker-hub/repos/)
- [GitHub Actions 文档](https://docs.github.com/en/actions) 