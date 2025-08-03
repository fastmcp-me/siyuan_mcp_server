# 思源笔记 MCP 服务器 / SiYuan MCP Server

<div align="center">

[English](#english-version) | [中文](#中文版本)

</div>

---

## 中文版本



这是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的思源笔记服务器，提供了完整的思源笔记 API 功能。

### 🚀 快速开始

#### 1. 克隆项目
```bash
git clone https://github.com/xgq18237/siyuan_mcp_server.git
cd siyuan_mcp_server
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 构建项目
```bash
npm run build
```

#### 4. Docker 部署方式

1. 构建镜像
```bash
docker build -t siyuan-mcp-server .
```

2. 运行容器（推荐使用环境变量传递思源参数）
```bash
docker run -d \
  -e SIYUAN_HOST=127.0.0.1 \
  -e SIYUAN_PORT=6806 \
  -e SIYUAN_TOKEN=你的思源API令牌 \
  --name siyuan-mcp-server \
  siyuan-mcp-server
```

3. 查看日志
```bash
docker logs -f siyuan-mcp-server
```

4. 停止并删除容器
```bash
docker stop siyuan-mcp-server && docker rm siyuan-mcp-server
```

#### 4. 获取思源笔记 API 令牌

1. **打开思源笔记**
2. **进入设置**：
   - 点击左上角菜单图标
   - 选择 `设置`
3. **找到 API 令牌**：
   - 在设置页面中点击 `关于`
   - 找到 `API 令牌` 选项
4. **复制令牌**：
   - 点击 `生成令牌` 或复制现有令牌
   - 保存令牌（稍后需要用到）

#### 5. 配置 MCP 客户端

##### Cursor 配置

1. **打开 Cursor 设置**：
   - 按 `Ctrl/Cmd + ,` 打开设置
   - 搜索 "MCP" 或 "Model Context Protocol"

2. **添加 MCP 配置**：
   - 找到 MCP 配置选项
   - 点击 "Add Server" 或 "添加服务器"

3. **配置服务器信息**：
```json
{
  "mcpServers": {
    "siyuan-mcp": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "SIYUAN_HOST": "127.0.0.1",
        "SIYUAN_PORT": "6806",
        "SIYUAN_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

4. **替换令牌**：
   - 将 `your-api-token-here` 替换为你在步骤 4 中获取的令牌

5. **重启 Cursor**：
   - 完全关闭 Cursor
   - 重新启动

##### 其他 MCP 客户端配置

如果你使用其他支持 MCP 的客户端，配置方式类似：

```json
{
  "mcpServers": {
    "siyuan-mcp": {
      "command": "node",
      "args": ["path/to/siyuan_mcp_server/dist/index.js"],
      "env": {
        "SIYUAN_HOST": "127.0.0.1",
        "SIYUAN_PORT": "6806",
        "SIYUAN_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

**注意**：将 `path/to/siyuan_mcp_server` 替换为你的实际项目路径。

#### 6. 验证连接

配置完成后，你可以通过以下方式验证连接：

1. **在 Cursor 中测试**：
   - 打开一个新的聊天窗口
   - 输入：`列出所有笔记本`
   - 如果返回笔记本列表，说明连接成功

2. **使用状态检查**：
   - 输入：`检查思源笔记状态`
   - 查看返回的状态信息

### 🔧 环境变量配置

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `SIYUAN_HOST` | 思源笔记服务器地址 | 127.0.0.1 | 否 |
| `SIYUAN_PORT` | 思源笔记服务器端口 | 6806 | 否 |
| `SIYUAN_TOKEN` | API 令牌 | - | 是 |

### 📋 常见问题

#### Q: 连接失败怎么办？
**A:** 请按以下步骤检查：
1. 确保思源笔记正在运行
2. 检查 API 令牌是否正确
3. 确认思源笔记中有打开的笔记本
4. 重启思源笔记和 Cursor

#### Q: 如何获取正确的 API 令牌？
**A:** 
1. 打开思源笔记
2. 进入 `设置` → `关于` → `API 令牌`
3. 点击 `生成令牌` 或复制现有令牌
4. 确保令牌格式正确（通常是一串字母数字组合）

#### Q: 项目路径配置错误怎么办？
**A:** 
1. 确保项目路径正确
2. 使用绝对路径或相对路径
3. 检查 `dist/index.js` 文件是否存在

### 🔧 功能特性

#### 笔记本管理
- **`list_notebooks`** - 列出所有笔记本
- **`open_notebook`** - 打开指定笔记本
- **`close_notebook`** - 关闭指定笔记本
- **`rename_notebook`** - 重命名笔记本
- **`create_notebook`** - 创建新笔记本
- **`remove_notebook`** - 删除笔记本

#### 文档管理
- **`create_doc`** - 在指定笔记本中新建文档
- **`rename_doc`** - 重命名文档
- **`remove_doc`** - 删除文档
- **`move_docs`** - 移动文档
- **`get_doc_tree`** - 获取文档树结构

#### 块操作
- **`insert_block`** - 插入块
- **`update_block`** - 更新块
- **`delete_block`** - 删除块
- **`move_block`** - 移动块
- **`get_block_kramdown`** - 获取块 kramdown 源码

#### 搜索和查询
- **`sql_query`** - 执行 SQL 查询
- **`check_siyuan_status`** - 检查思源笔记状态

### 📚 使用示例

#### 列出所有笔记本
```json
{
  "name": "list_notebooks",
  "arguments": {}
}
```

#### 创建新文档
```json
{
  "name": "create_doc",
  "arguments": {
    "path": "/daily/2025-01-15",
    "markdown": "# 今日总结\n\n今天完成了以下工作：\n- 项目开发\n- 文档编写"
  }
}
```

#### 执行 SQL 查询
```json
{
  "name": "sql_query",
  "arguments": {
    "sql": "SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 5"
  }
}
```

### 🛠️ 开发

#### 项目结构
```
siyuan-mcp/
├── src/
│   └── index.ts          # 主服务器代码
├── dist/                 # 编译输出
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 项目文档
```

#### 开发命令
```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式
npm run dev

---

**[⬆ 返回顶部](#思源笔记-mcp-服务器--siyuan-mcp-server)**
```

---

## English Version

This is a SiYuan Note MCP server based on [Model Context Protocol (MCP)](https://modelcontextprotocol.io/), providing complete SiYuan Note API functionality.

### 🚀 Quick Start

#### 1. Clone the Project
```bash
git clone https://github.com/xgq18237/siyuan_mcp_server.git
cd siyuan_mcp_server
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Build the Project
```bash
npm run build
```

#### 4. Get SiYuan Note API Token

1. **Open SiYuan Note**
2. **Access Settings**:
   - Click the menu icon in the top-left corner
   - Select `Settings`
3. **Find API Token**:
   - In the settings page, click `About`
   - Find the `API Token` option
4. **Copy the Token**:
   - Click `Generate Token` or copy the existing token
   - Save the token (you'll need it later)

#### 5. Configure MCP Client

##### Cursor Configuration

1. **Open Cursor Settings**:
   - Press `Ctrl/Cmd + ,` to open settings
   - Search for "MCP" or "Model Context Protocol"

2. **Add MCP Configuration**:
   - Find the MCP configuration option
   - Click "Add Server" or "添加服务器"

3. **Configure Server Information**:
```json
{
  "mcpServers": {
    "siyuan-mcp": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "SIYUAN_HOST": "127.0.0.1",
        "SIYUAN_PORT": "6806",
        "SIYUAN_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

4. **Replace the Token**:
   - Replace `your-api-token-here` with the token you obtained in step 4

5. **Restart Cursor**:
   - Completely close Cursor
   - Restart it

##### Other MCP Client Configuration

If you're using other MCP-compatible clients, the configuration is similar:

```json
{
  "mcpServers": {
    "siyuan-mcp": {
      "command": "node",
      "args": ["path/to/siyuan_mcp_server/dist/index.js"],
      "env": {
        "SIYUAN_HOST": "127.0.0.1",
        "SIYUAN_PORT": "6806",
        "SIYUAN_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

**Note**: Replace `path/to/siyuan_mcp_server` with your actual project path.

#### 6. Verify Connection

After configuration, you can verify the connection by:

1. **Testing in Cursor**:
   - Open a new chat window
   - Type: `list all notebooks`
   - If it returns a notebook list, the connection is successful

2. **Using Status Check**:
   - Type: `check SiYuan status`
   - View the returned status information

### 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SIYUAN_HOST` | SiYuan Note server address | 127.0.0.1 | No |
| `SIYUAN_PORT` | SiYuan Note server port | 6806 | No |
| `SIYUAN_TOKEN` | API token | - | Yes |

### 📋 FAQ

#### Q: What if the connection fails?
**A:** Please check the following steps:
1. Ensure SiYuan Note is running
2. Check if the API token is correct
3. Confirm there are open notebooks in SiYuan Note
4. Restart SiYuan Note and Cursor

#### Q: How to get the correct API token?
**A:** 
1. Open SiYuan Note
2. Go to `Settings` → `About` → `API Token`
3. Click `Generate Token` or copy the existing token
4. Ensure the token format is correct (usually a string of alphanumeric characters)

#### Q: What if the project path configuration is wrong?
**A:** 
1. Ensure the project path is correct
2. Use absolute or relative paths
3. Check if the `dist/index.js` file exists

### 🔧 Features

#### Notebook Management
- **`list_notebooks`** - List all notebooks
- **`open_notebook`** - Open specified notebook
- **`close_notebook`** - Close specified notebook
- **`rename_notebook`** - Rename notebook
- **`create_notebook`** - Create new notebook
- **`remove_notebook`** - Delete notebook

#### Document Management
- **`create_doc`** - Create new document in specified notebook
- **`rename_doc`** - Rename document
- **`remove_doc`** - Delete document
- **`move_docs`** - Move documents
- **`get_doc_tree`** - Get document tree structure

#### Block Operations
- **`insert_block`** - Insert block
- **`update_block`** - Update block
- **`delete_block`** - Delete block
- **`move_block`** - Move block
- **`get_block_kramdown`** - Get block kramdown source

#### Search and Query
- **`sql_query`** - Execute SQL query
- **`check_siyuan_status`** - Check SiYuan Note status

### 📚 Usage Examples

#### List All Notebooks
```json
{
  "name": "list_notebooks",
  "arguments": {}
}
```

#### Create New Document
```json
{
  "name": "create_doc",
  "arguments": {
    "path": "/daily/2025-01-15",
    "markdown": "# Today's Summary\n\nToday I completed the following work:\n- Project development\n- Document writing"
  }
}
```

#### Execute SQL Query
```json
{
  "name": "sql_query",
  "arguments": {
    "sql": "SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 5"
  }
}
```

### 🛠️ Development

#### Project Structure
```
siyuan-mcp/
├── src/
│   └── index.ts          # Main server code
├── dist/                 # Compiled output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

#### Development Commands
```bash
# Install dependencies
npm install

# Build project
npm run build

# Development mode
npm run dev
```

### 📄 License

MIT License

---

**[⬆ 返回顶部](#思源笔记-mcp-服务器--siyuan-mcp-server)** 