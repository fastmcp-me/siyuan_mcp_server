# 思源笔记 MCP 服务器 / SiYuan MCP Server

<div align="center">

[English](#english-version) | [中文](#中文版本)

</div>

---

## English Version

A Model Context Protocol (MCP) server for SiYuan Note, providing complete SiYuan API functionality.

### 🚀 Quick Start

#### 1. Clone the repository
```bash
git clone https://github.com/xgq18237/siyuan_mcp_server.git
cd siyuan_mcp_server
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Build the project
```bash
npm run build
```

#### 4. Docker deployment

1. **Build image**
```bash
docker build -t siyuan-mcp-server .
```

2. **Run container (recommended with environment variables)**
```bash
docker run -d \
  -e SIYUAN_HOST=127.0.0.1 \
  -e SIYUAN_PORT=6806 \
  -e SIYUAN_TOKEN=your-api-token \
  --name siyuan-mcp-server \
  siyuan-mcp-server
```

3. **View logs**
```bash
docker logs -f siyuan-mcp-server
```

4. **Stop and remove container**
```bash
docker stop siyuan-mcp-server && docker rm siyuan-mcp-server
```

##### Docker Compose (Recommended)

1. **Configure environment variables**
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your SiYuan configuration
# SIYUAN_HOST=127.0.0.1
# SIYUAN_PORT=6806
# SIYUAN_TOKEN=your-api-token
```

2. **Start service**
```bash
docker-compose up -d
```

3. **View logs**
```bash
docker-compose logs -f
```

4. **Stop service**
```bash
docker-compose down
```

#### 5. Get SiYuan API token

1. **Open SiYuan Note**
2. **Go to Settings**:
   - Click the menu icon in the top left
   - Select `Settings`
3. **Find API Token**:
   - Click `About` in the settings page
   - Find the `API Token` option
4. **Copy token**:
   - Click `Generate Token` or copy existing token
   - Save the token (you'll need it later)

#### 6. Configure MCP client

##### Cursor Configuration

1. **Open Cursor settings**:
   - Press `Ctrl/Cmd + ,` to open settings
   - Search for "MCP" or "Model Context Protocol"

2. **Add MCP configuration**:
   - Find MCP configuration options
   - Click "Add Server" or "Add Server"

3. **Configure server information**:
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

4. **Replace token**:
   - Replace `your-api-token-here` with the token you obtained in step 5

5. **Restart Cursor**:
   - Completely close Cursor
   - Restart

##### Other MCP Client Configuration

If you use other MCP-compatible clients, the configuration is similar:

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

#### 7. Verify connection

After configuration, you can verify the connection by:

1. **Test in Cursor**:
   - Open a new chat window
   - Type: `List all notebooks`
   - If it returns a notebook list, the connection is successful

2. **Use status check**:
   - Type: `Check SiYuan status`
   - View the returned status information

### 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SIYUAN_HOST` | SiYuan server address | 127.0.0.1 | No |
| `SIYUAN_PORT` | SiYuan server port | 6806 | No |
| `SIYUAN_TOKEN` | API token | - | Yes |

### 📋 Common Issues

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
3. Click `Generate Token` or copy existing token
4. Ensure the token format is correct (usually a string of alphanumeric characters)

#### Q: What if the project path configuration is wrong?
**A:** 
1. Ensure the project path is correct
2. Use absolute path or relative path
3. Check if the `dist/index.js` file exists

### 🎯 Features

#### 📚 Notebook Management (8 APIs)
Notebooks are the basic organizational units of SiYuan Note, each containing multiple documents.

- **`list_notebooks`** - List all notebooks, get notebook IDs and names
- **`open_notebook`** - Open specified notebook, activate workspace
- **`close_notebook`** - Close specified notebook, release resources
- **`rename_notebook`** - Rename notebook, update display name
- **`create_notebook`** - Create new notebook, support custom names
- **`remove_notebook`** - Delete notebook, clean related data
- **`get_notebook_conf`** - Get notebook configuration information
- **`set_notebook_conf`** - Save notebook configuration, custom settings

#### 📄 Document Management (11 APIs)
Documents are specific content units in notebooks, supporting hierarchical structure and path management.

- **`create_doc`** - Create new document in specified notebook, support Markdown content
- **`rename_doc`** - Rename document, keep content unchanged
- **`rename_doc_by_id`** - Rename by document ID, precise operation
- **`remove_doc`** - Delete document, clean file system
- **`remove_doc_by_id`** - Delete by document ID, precise operation
- **`move_docs`** - Move documents to other locations or notebooks
- **`move_docs_by_id`** - Move by document ID, precise operation
- **`get_hpath_by_path`** - Get human-readable path by path
- **`get_hpath_by_id`** - Get human-readable path by ID
- **`get_path_by_id`** - Get storage path by ID
- **`get_ids_by_hpath`** - Get IDs by human-readable path

#### 🧩 Block Operations (11 APIs)
Blocks are the smallest content units in SiYuan Note, supporting flexible editing, reorganization, and referencing.

- **`insert_block`** - Insert block, support specified position and data type
- **`prepend_block`** - Insert prepend child block, add content at parent block beginning
- **`append_block`** - Insert append child block, add content at parent block end
- **`update_block`** - Update block content, support Markdown and DOM formats
- **`delete_block`** - Delete block, clean related references
- **`move_block`** - Move block to new position, support hierarchical adjustment
- **`get_block_kramdown`** - Get block kramdown source code, for export
- **`get_child_blocks`** - Get child block list, traverse block structure
- **`fold_block`** - Fold block, hide child content
- **`unfold_block`** - Unfold block, show child content
- **`transfer_block_ref`** - Transfer block reference, maintain reference relationships

#### 🏷️ Attribute Operations (2 APIs)
Block attributes are used to store metadata and custom information, supporting key-value pair storage.

- **`set_block_attrs`** - Set block attributes, support custom key-value pairs
- **`get_block_attrs`** - Get block attributes, read metadata information

#### 🔍 Search and Query (2 APIs)
Get data from SiYuan Note through SQL queries, supporting complex query conditions.

- **`sql_query`** - Execute SQL queries, support all SQLite syntax
- **`flush_transaction`** - Commit transactions, ensure data persistence

#### 📁 File Operations (5 APIs)
Manage files and directories in SiYuan Note workspace, support resource management.

- **`get_file`** - Get file content, read file data
- **`remove_file`** - Delete file, clean storage space
- **`rename_file`** - Rename file, update file path
- **`read_dir`** - List directory content, browse file structure
- **`put_file`** - Write file, create or update file content

#### 📤 Export Functions (2 APIs)
Export SiYuan Note content to various formats, support backup and sharing.

- **`export_md_content`** - Export Markdown text, maintain format
- **`export_resources`** - Export files and directories, include resource files

#### 📢 Notification Functions (2 APIs)
Push messages and error prompts to users, provide operation feedback.

- **`push_msg`** - Push messages, display success prompts
- **`push_err_msg`** - Push error messages, display error information

#### 💻 System Information (5 APIs)
Get SiYuan Note system status and runtime information, monitor system health.

- **`get_version`** - Get SiYuan Note version information
- **`get_current_time`** - Get system current time
- **`get_boot_progress`** - Get boot progress, monitor boot status
- **`check_siyuan_status`** - Check SiYuan Note status and API availability
- **`get_workspace_info`** - Get workspace and connection information

#### 🎨 Template Functions (2 APIs)
Use template system to create dynamic content, support variable substitution.

- **`render_template`** - Render template files, support external templates
- **`render_sprig`** - Render Sprig templates, support inline template syntax

#### 🔄 Conversion Functions (1 API)
Use Pandoc for document format conversion, support multiple output formats.

- **`pandoc_convert`** - Pandoc conversion, support multiple document formats

#### 📎 Resource Files (1 API)
Manage resource files in SiYuan Note, support batch upload.

- **`upload_asset`** - Upload resource files, support batch operations

### 🔧 Core Features

#### 🚀 High Performance
- **Asynchronous Processing**: All API calls use asynchronous processing for faster response
- **Batch Operations**: Support batch document movement and block operations for improved efficiency
- **Transaction Management**: Built-in transaction mechanism ensures data consistency

#### 🛡️ Secure and Reliable
- **Authentication**: Support API token authentication to protect data security
- **Error Handling**: Comprehensive error handling mechanism provides detailed error information
- **Parameter Validation**: Strict parameter validation prevents invalid operations

#### 🔌 Easy Integration
- **MCP Protocol**: Based on Model Context Protocol, easy to integrate with AI tools
- **Standard Interface**: Follows SiYuan Note official API specifications
- **Multi-language Support**: Supports Chinese and English documentation and error messages

#### 📊 Data Management
- **Complete CRUD**: Support create, read, update, delete for all data types
- **Hierarchical Structure**: Support hierarchical organization of documents and blocks
- **Reference System**: Support block references and transfers, maintain data relationships

#### 🎯 Developer Friendly
- **Detailed Logging**: Provide detailed API call logs for easy debugging
- **Status Checking**: Built-in connection status checking for quick problem diagnosis
- **Rich Examples**: Provide complete usage examples and best practices

### 📊 API Statistics

- **Total APIs**: 49
- **Feature Modules**: 12
- **Supported Operations**: Complete SiYuan Note API functionality
- **Coverage**: 100% SiYuan Note official API (except network APIs)

### 📚 Usage Examples

#### Basic Operations

**List all notebooks**
```json
{
  "name": "list_notebooks",
  "arguments": {}
}
```

**Create new document**
```json
{
  "name": "create_doc",
  "arguments": {
    "notebook": "20241009135857-599ipbh",
    "path": "/daily/2025-01-15",
    "markdown": "# Today's Summary\n\nToday I completed the following work:\n- Project development\n- Document writing"
  }
}
```

**Execute SQL query**
```json
{
  "name": "sql_query",
  "arguments": {
    "sql": "SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 5"
  }
}
```

**Insert block**
```json
{
  "name": "insert_block",
  "arguments": {
    "data": "This is new block content",
    "dataType": "markdown",
    "parentID": "20250803150424-tu1cl78"
  }
}
```

**Set block attributes**
```json
{
  "name": "set_block_attrs",
  "arguments": {
    "id": "20250803150424-tu1cl78",
    "attrs": {
      "custom-status": "active",
      "custom-tag": "important"
    }
  }
}
```

#### Advanced Operations

**Check SiYuan status**
```json
{
  "name": "check_siyuan_status",
  "arguments": {}
}
```

**Get workspace information**
```json
{
  "name": "get_workspace_info",
  "arguments": {}
}
```

**Batch move documents**
```json
{
  "name": "move_docs",
  "arguments": {
    "fromPaths": ["/daily/2025-01-14", "/daily/2025-01-13"],
    "toNotebook": "20241009135857-599ipbh",
    "toPath": "/archive/2025-01"
  }
}
```

**Export document content**
```json
{
  "name": "export_md_content",
  "arguments": {
    "id": "20250115123456-abcdef"
  }
}
```

**Use template rendering**
```json
{
  "name": "render_sprig",
  "arguments": {
    "template": "Hello {{.name}}! Today is {{.date}}. Your tasks: {{range .tasks}}- {{.}}\n{{end}}"
  }
}
```

**Upload resource files**
```json
{
  "name": "upload_asset",
  "arguments": {
    "assetsDirPath": "/assets/images",
    "files": ["screenshot.png", "diagram.svg", "document.pdf"]
  }
}
```

#### Common SQL Query Examples

**Get recently created documents**
```sql
SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 10
```

**Find blocks with specific tags**
```sql
SELECT * FROM blocks WHERE content LIKE '%#important%' OR content LIKE '%#urgent%'
```

**Count blocks by type**
```sql
SELECT type, COUNT(*) as count FROM blocks GROUP BY type
```

**Find blocks with empty content**
```sql
SELECT * FROM blocks WHERE content = '' OR content IS NULL
```

**Get content within specific time range**
```sql
SELECT * FROM blocks WHERE created >= '2025-01-01' AND created <= '2025-01-31'
```

### 📚 Development Resources

#### Related Links
- [SiYuan Note Official Documentation](https://b3log.org/siyuan/)
- [SiYuan Note API Documentation](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)

#### Community Support
- [SiYuan Note Community](https://b3log.org/siyuan/)
- [GitHub Issues](https://github.com/xgq18237/siyuan_mcp_server/issues)

#### Technology Stack
- **Language**: TypeScript/JavaScript
- **Protocol**: Model Context Protocol (MCP)
- **Framework**: @modelcontextprotocol/sdk
- **Deployment**: Docker, Node.js
- **Database**: SQLite (via SiYuan Note)

#### Development Tools
- **Editor**: VS Code, Cursor
- **Build Tool**: TypeScript Compiler
- **Package Manager**: npm
- **Containerization**: Docker, Docker Compose

### 🔧 Advanced Features

#### 1. Template System
Use `render_template` and `render_sprig` to create dynamic content:
```json
{
  "name": "render_sprig",
  "arguments": {
    "template": "Hello {{.name}}! Today is {{.date}}."
  }
}
```

#### 2. File Management
Use file operation APIs to manage attachments and resources:
```json
{
  "name": "upload_asset",
  "arguments": {
    "assetsDirPath": "/assets",
    "files": ["image1.jpg", "document.pdf"]
  }
}
```

#### 3. Data Export
Use export functions to backup and share content:
```json
{
  "name": "export_md_content",
  "arguments": {
    "id": "20250115123456-abcdef"
  }
}
```

#### 4. Batch Operations
Support batch document and block operations for improved efficiency:
```json
{
  "name": "move_docs",
  "arguments": {
    "fromPaths": ["/doc1", "/doc2", "/doc3"],
    "toNotebook": "notebook-id",
    "toPath": "/archive"
  }
}
```

#### 5. Status Monitoring
Real-time monitoring of SiYuan Note system status:
```json
{
  "name": "check_siyuan_status",
  "arguments": {}
}
```

### Documentation

For detailed documentation, see the [Chinese version](#中文版本) below.

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

##### Docker Compose 方式（推荐）

1. 配置环境变量
```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件，填入你的思源笔记配置
# SIYUAN_HOST=127.0.0.1
# SIYUAN_PORT=6806
# SIYUAN_TOKEN=你的思源API令牌
```

2. 启动服务
```bash
docker-compose up -d
```

3. 查看日志
```bash
docker-compose logs -f
```

4. 停止服务
```bash
docker-compose down
```

#### 5. 获取思源笔记 API 令牌

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

#### 6. 配置 MCP 客户端

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
   - 将 `your-api-token-here` 替换为你在步骤 5 中获取的令牌

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

#### 7. 验证连接

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

### 🎯 功能特性

#### 📚 笔记本管理 (8个接口)
笔记本是思源笔记的基本组织单位，每个笔记本包含多个文档。

- **`list_notebooks`** - 列出所有笔记本，获取笔记本ID和名称
- **`open_notebook`** - 打开指定笔记本，激活工作空间
- **`close_notebook`** - 关闭指定笔记本，释放资源
- **`rename_notebook`** - 重命名笔记本，更新显示名称
- **`create_notebook`** - 创建新笔记本，支持自定义名称
- **`remove_notebook`** - 删除笔记本，清理相关数据
- **`get_notebook_conf`** - 获取笔记本配置信息
- **`set_notebook_conf`** - 保存笔记本配置，自定义设置

#### 📄 文档管理 (11个接口)
文档是笔记本中的具体内容单元，支持层级结构和路径管理。

- **`create_doc`** - 在指定笔记本中新建文档，支持Markdown内容
- **`rename_doc`** - 重命名文档，保持内容不变
- **`rename_doc_by_id`** - 根据文档ID重命名，精确操作
- **`remove_doc`** - 删除文档，清理文件系统
- **`remove_doc_by_id`** - 根据文档ID删除，精确操作
- **`move_docs`** - 移动文档到其他位置或笔记本
- **`move_docs_by_id`** - 根据文档ID移动，精确操作
- **`get_hpath_by_path`** - 根据路径获取人类可读路径
- **`get_hpath_by_id`** - 根据ID获取人类可读路径
- **`get_path_by_id`** - 根据ID获取存储路径
- **`get_ids_by_hpath`** - 根据人类可读路径获取IDs

#### 🧩 块操作 (11个接口)
块是思源笔记的最小内容单位，支持灵活的编辑、重组和引用。

- **`insert_block`** - 插入块，支持指定位置和数据类型
- **`prepend_block`** - 插入前置子块，在父块开头添加内容
- **`append_block`** - 插入后置子块，在父块末尾添加内容
- **`update_block`** - 更新块内容，支持Markdown和DOM格式
- **`delete_block`** - 删除块，清理相关引用
- **`move_block`** - 移动块到新位置，支持层级调整
- **`get_block_kramdown`** - 获取块kramdown源码，用于导出
- **`get_child_blocks`** - 获取子块列表，遍历块结构
- **`fold_block`** - 折叠块，隐藏子内容
- **`unfold_block`** - 展开块，显示子内容
- **`transfer_block_ref`** - 转移块引用，维护引用关系

#### 🏷️ 属性操作 (2个接口)
块属性用于存储元数据和自定义信息，支持键值对存储。

- **`set_block_attrs`** - 设置块属性，支持自定义键值对
- **`get_block_attrs`** - 获取块属性，读取元数据信息

#### 🔍 搜索和查询 (2个接口)
通过SQL查询获取思源笔记中的数据，支持复杂查询条件。

- **`sql_query`** - 执行SQL查询，支持所有SQLite语法
- **`flush_transaction`** - 提交事务，确保数据持久化

#### 📁 文件操作 (5个接口)
管理思源笔记工作空间中的文件和目录，支持资源管理。

- **`get_file`** - 获取文件内容，读取文件数据
- **`remove_file`** - 删除文件，清理存储空间
- **`rename_file`** - 重命名文件，更新文件路径
- **`read_dir`** - 列出目录内容，浏览文件结构
- **`put_file`** - 写入文件，创建或更新文件内容

#### 📤 导出功能 (2个接口)
将思源笔记内容导出为各种格式，支持备份和分享。

- **`export_md_content`** - 导出Markdown文本，保持格式
- **`export_resources`** - 导出文件与目录，包含资源文件

#### 📢 通知功能 (2个接口)
向用户推送消息和错误提示，提供操作反馈。

- **`push_msg`** - 推送消息，显示成功提示
- **`push_err_msg`** - 推送错误消息，显示错误信息

#### 💻 系统信息 (5个接口)
获取思源笔记系统状态和运行信息，监控系统健康。

- **`get_version`** - 获取思源笔记版本信息
- **`get_current_time`** - 获取系统当前时间
- **`get_boot_progress`** - 获取启动进度，监控启动状态
- **`check_siyuan_status`** - 检查思源笔记状态和API可用性
- **`get_workspace_info`** - 获取工作空间和连接信息

#### 🎨 模板功能 (2个接口)
使用模板系统创建动态内容，支持变量替换。

- **`render_template`** - 渲染模板文件，支持外部模板
- **`render_sprig`** - 渲染Sprig模板，支持内联模板语法

#### 🔄 转换功能 (1个接口)
使用Pandoc进行文档格式转换，支持多种输出格式。

- **`pandoc_convert`** - Pandoc转换，支持多种文档格式

#### 📎 资源文件 (1个接口)
管理思源笔记中的资源文件，支持批量上传。

- **`upload_asset`** - 上传资源文件，支持批量操作

### 🔧 核心特性

#### 🚀 高性能
- **异步处理**: 所有API调用采用异步处理，提高响应速度
- **批量操作**: 支持批量文档移动和块操作，提升效率
- **事务管理**: 内置事务机制，确保数据一致性

#### 🛡️ 安全可靠
- **身份验证**: 支持API令牌认证，保护数据安全
- **错误处理**: 完善的错误处理机制，提供详细错误信息
- **参数验证**: 严格的参数验证，防止无效操作

#### 🔌 易于集成
- **MCP协议**: 基于Model Context Protocol，易于与AI工具集成
- **标准接口**: 遵循思源笔记官方API规范
- **多语言支持**: 支持中英文文档和错误信息

#### 📊 数据管理
- **完整CRUD**: 支持创建、读取、更新、删除所有数据类型
- **层级结构**: 支持文档和块的层级组织
- **引用系统**: 支持块引用和转移，维护数据关系

#### 🎯 开发友好
- **详细日志**: 提供详细的API调用日志，便于调试
- **状态检查**: 内置连接状态检查，快速诊断问题
- **示例丰富**: 提供完整的使用示例和最佳实践

### 📊 接口统计

- **总接口数**: 49个
- **功能模块**: 12个
- **支持的操作**: 完整的思源笔记API功能
- **覆盖范围**: 100%思源笔记官方API（除网络接口外）

### 📚 使用示例

#### 基础操作示例

**列出所有笔记本**
```json
{
  "name": "list_notebooks",
  "arguments": {}
}
```

**创建新文档**
```json
{
  "name": "create_doc",
  "arguments": {
    "notebook": "20241009135857-599ipbh",
    "path": "/daily/2025-01-15",
    "markdown": "# 今日总结\n\n今天完成了以下工作：\n- 项目开发\n- 文档编写"
  }
}
```

**执行 SQL 查询**
```json
{
  "name": "sql_query",
  "arguments": {
    "sql": "SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 5"
  }
}
```

**插入块**
```json
{
  "name": "insert_block",
  "arguments": {
    "data": "这是一个新的块内容",
    "dataType": "markdown",
    "parentID": "20250803150424-tu1cl78"
  }
}
```

**设置块属性**
```json
{
  "name": "set_block_attrs",
  "arguments": {
    "id": "20250803150424-tu1cl78",
    "attrs": {
      "custom-status": "active",
      "custom-tag": "important"
    }
  }
}
```

#### 高级操作示例

**检查思源笔记状态**
```json
{
  "name": "check_siyuan_status",
  "arguments": {}
}
```

**获取工作空间信息**
```json
{
  "name": "get_workspace_info",
  "arguments": {}
}
```

**批量移动文档**
```json
{
  "name": "move_docs",
  "arguments": {
    "fromPaths": ["/daily/2025-01-14", "/daily/2025-01-13"],
    "toNotebook": "20241009135857-599ipbh",
    "toPath": "/archive/2025-01"
  }
}
```

**导出文档内容**
```json
{
  "name": "export_md_content",
  "arguments": {
    "id": "20250115123456-abcdef"
  }
}
```

**使用模板渲染**
```json
{
  "name": "render_sprig",
  "arguments": {
    "template": "Hello {{.name}}! Today is {{.date}}. Your tasks: {{range .tasks}}- {{.}}\n{{end}}"
  }
}
```

**上传资源文件**
```json
{
  "name": "upload_asset",
  "arguments": {
    "assetsDirPath": "/assets/images",
    "files": ["screenshot.png", "diagram.svg", "document.pdf"]
  }
}
```

#### 常用SQL查询示例

**获取最近创建的文档**
```sql
SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 10
```

**查找包含特定标签的块**
```sql
SELECT * FROM blocks WHERE content LIKE '%#重要%' OR content LIKE '%#urgent%'
```

**统计各类型块的数量**
```sql
SELECT type, COUNT(*) as count FROM blocks GROUP BY type
```

**查找空内容的块**
```sql
SELECT * FROM blocks WHERE content = '' OR content IS NULL
```

**获取特定时间范围内的内容**
```sql
SELECT * FROM blocks WHERE created >= '2025-01-01' AND created <= '2025-01-31'
```

### 📚 开发资源

#### 相关链接
- [思源笔记官方文档](https://b3log.org/siyuan/)
- [思源笔记API文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)

#### 社区支持
- [思源笔记社区](https://b3log.org/siyuan/)
- [GitHub Issues](https://github.com/xgq18237/siyuan_mcp_server/issues)

#### 技术栈
- **语言**: TypeScript/JavaScript
- **协议**: Model Context Protocol (MCP)
- **框架**: @modelcontextprotocol/sdk
- **部署**: Docker, Node.js
- **数据库**: SQLite (通过思源笔记)

#### 开发工具
- **编辑器**: VS Code, Cursor
- **构建工具**: TypeScript Compiler
- **包管理**: npm
- **容器化**: Docker, Docker Compose



### 🛠️ 开发

#### 项目结构
```
siyuan-mcp/
├── src/
│   └── index.ts          # 主服务器代码
├── dist/                 # 编译输出
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── docker-compose.yml    # Docker Compose 配置
├── Dockerfile           # Docker 构建文件
├── env.example          # 环境变量模板
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

# 启动服务器
npm start

# 测试 Docker 部署
npm test

# 清理并重新构建
npm run rebuild
```

### 🔄 更新日志

#### v1.0.0 (2025-01-15)
- ✅ 完成49个API接口的实现
- ✅ 修复所有不存在的接口调用
- ✅ 添加缺失的接口功能
- ✅ 完善错误处理和参数验证
- ✅ 优化代码结构和文档
- ✅ 支持完整的思源笔记API功能

#### 主要改进
1. **接口完整性**: 实现了思源笔记官方API文档中的所有接口（除网络接口外）
2. **错误处理**: 改进了错误处理和参数验证
3. **文档更新**: 更新了README文档以反映当前功能
4. **测试覆盖**: 完成了所有接口的测试和验证

### 📄 许可证

MIT License

---

## 详细使用指南

### 🔍 接口分类详解

#### 1. 笔记本管理
笔记本是思源笔记的基本组织单位，每个笔记本包含多个文档。

**常用操作**：
- `list_notebooks`: 获取所有笔记本列表，用于了解当前可用的笔记本
- `create_notebook`: 创建新笔记本，为新的知识领域做准备
- `open_notebook`: 打开指定笔记本，开始在该笔记本中工作

#### 2. 文档管理
文档是笔记本中的具体内容单元，支持层级结构。

**常用操作**：
- `create_doc`: 创建新文档，支持指定路径和Markdown内容
- `rename_doc`: 重命名文档，保持内容不变
- `move_docs`: 移动文档到其他位置或笔记本

#### 3. 块操作
块是思源笔记的最小内容单位，支持灵活的编辑和重组。

**常用操作**：
- `insert_block`: 在指定位置插入新块
- `append_block`: 在父块末尾添加子块
- `update_block`: 更新现有块的内容
- `move_block`: 移动块到新位置

#### 4. 搜索和查询
通过SQL查询获取思源笔记中的数据。

**常用操作**：
- `sql_query`: 执行自定义SQL查询
- 常用查询示例：
  - 获取最近创建的文档：`SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 10`
  - 获取所有标签：`SELECT * FROM blocks WHERE content LIKE '%#%'`

### 🛠️ 故障排除

#### 常见错误及解决方案

**1. 连接失败**
```
Error: Failed to call SiYuan API: HTTP 401: Unauthorized
```
**解决方案**：
- 检查API令牌是否正确
- 确认思源笔记正在运行
- 验证网络连接

**2. 空响应错误**
```
Error: Empty response from server
```
**解决方案**：
- 确保思源笔记API服务已启用
- 检查思源笔记设置中的API选项
- 重启思源笔记

**3. 笔记本不存在**
```
Error: 笔记本不存在
```
**解决方案**：
- 使用`list_notebooks`查看可用笔记本
- 确认笔记本ID正确
- 先创建笔记本再操作

**4. 文档路径错误**
```
Error: 文档路径不存在
```
**解决方案**：
- 使用`get_hpath_by_path`验证路径
- 确保路径格式正确（如：`/daily/2025-01-15`）
- 先创建父级目录

### 📝 最佳实践

#### 1. 工作流程建议
1. **初始化**：使用`check_siyuan_status`检查连接状态
2. **获取信息**：使用`list_notebooks`获取可用笔记本
3. **创建内容**：使用`create_doc`创建新文档
4. **编辑内容**：使用块操作API进行内容编辑
5. **组织内容**：使用移动和重命名功能整理内容

#### 2. 错误处理
- 始终检查API响应的`code`字段
- 使用`push_msg`和`push_err_msg`提供用户反馈
- 在批量操作前先测试单个操作

#### 3. 性能优化
- 使用`flush_transaction`提交批量操作
- 合理使用SQL查询，避免查询大量数据
- 及时清理不需要的块和文档

### 🔧 高级功能

#### 1. 模板系统
使用`render_template`和`render_sprig`创建动态内容：
```json
{
  "name": "render_sprig",
  "arguments": {
    "template": "Hello {{.name}}! Today is {{.date}}."
  }
}
```

#### 2. 文件管理
使用文件操作API管理附件和资源：
```json
{
  "name": "upload_asset",
  "arguments": {
    "assetsDirPath": "/assets",
    "files": ["image1.jpg", "document.pdf"]
  }
}
```

#### 3. 数据导出
使用导出功能备份和分享内容：
```json
{
  "name": "export_md_content",
  "arguments": {
    "id": "20250115123456-abcdef"
  }
}
```

#### 4. 批量操作
支持批量文档和块操作，提高效率：
```json
{
  "name": "move_docs",
  "arguments": {
    "fromPaths": ["/doc1", "/doc2", "/doc3"],
    "toNotebook": "notebook-id",
    "toPath": "/archive"
  }
}
```

#### 5. 状态监控
实时监控思源笔记系统状态：
```json
{
  "name": "check_siyuan_status",
  "arguments": {}
}
```

---

**[⬆ 返回顶部](#思源笔记-mcp-服务器--siyuan-mcp-server)**