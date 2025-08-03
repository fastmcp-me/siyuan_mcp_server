# 使用官方 Node.js 运行时作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 TypeScript
RUN npm run build

# 暴露端口（如有需要，可选）
# EXPOSE 6806

# 启动服务
CMD ["node", "dist/index.js"] 