# 思源笔记 MCP 服务器

这是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的思源笔记服务器，提供了完整的思源笔记 API 功能。

## 功能特性

### 🔧 工具 (Tools)

#### 笔记本管理
- **`list_notebooks`** - 列出所有笔记本
- **`open_notebook`** - 打开指定笔记本
- **`close_notebook`** - 关闭指定笔记本
- **`rename_notebook`** - 重命名笔记本
- **`create_notebook`** - 创建新笔记本
- **`remove_notebook`** - 删除笔记本
- **`get_notebook_conf`** - 获取笔记本配置

#### 文档管理
- **`create_doc`** - 在指定笔记本中新建文档
- **`rename_doc`** - 重命名文档
- **`remove_doc`** - 删除文档
- **`move_docs`** - 移动文档
- **`get_doc_tree`** - 获取文档树结构
- **`get_hpath_by_path`** - 根据路径获取人类可读路径
- **`get_hpath_by_id`** - 根据 ID 获取人类可读路径

#### 块操作
- **`insert_block`** - 插入块
- **`update_block`** - 更新块
- **`delete_block`** - 删除块
- **`move_block`** - 移动块
- **`get_block_kramdown`** - 获取块 kramdown 源码
- **`get_child_blocks`** - 获取子块

#### 属性操作
- **`set_block_attrs`** - 设置块属性
- **`get_block_attrs`** - 获取块属性

#### 搜索和查询
- **`sql_query`** - 执行 SQL 查询
- **`flush_transaction`** - 提交事务

#### 文件操作
- **`get_file`** - 获取文件
- **`remove_file`** - 删除文件
- **`rename_file`** - 重命名文件
- **`read_dir`** - 列出文件

#### 导出功能
- **`export_md_content`** - 导出 Markdown 文本

#### 通知功能
- **`push_msg`** - 推送消息
- **`push_err_msg`** - 推送错误消息

#### 系统信息
- **`get_system_info`** - 获取系统信息
- **`get_version`** - 获取思源笔记版本
- **`get_current_time`** - 获取系统当前时间
- **`get_boot_progress`** - 获取启动进度
- **`check_siyuan_status`** - 检查思源笔记状态和 API 可用性

### 📚 资源 (Resources)

- **`siyuan://recent`** - 最近 10 篇文档
- **`siyuan://notebooks`** - 所有笔记本列表
- **`siyuan://system-info`** - 系统信息
- **`siyuan://doc-tree`** - 当前笔记本文档树

## 安装和配置

### 1. 安装依赖
```bash
npm install
```

### 2. 构建项目
```bash
npm run build
```

### 3. 配置 MCP

在你的 MCP 配置文件中添加：

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

#### 环境变量说明：

- **`SIYUAN_HOST`** - 思源笔记服务器地址（默认：127.0.0.1）
- **`SIYUAN_PORT`** - 思源笔记服务器端口（默认：6806）
- **`SIYUAN_TOKEN`** - API 令牌（必需）
- **`SIYUAN_WORKSPACE`** - 思源笔记工作空间路径（已移除，使用相对路径）

### 4. 获取 API 令牌

1. 打开思源笔记
2. 进入 `设置` → `关于` → `API 令牌`
3. 复制令牌并填入配置中

## 使用示例

### 笔记本管理
```json
{
  "name": "list_notebooks",
  "arguments": {}
}
```

```json
{
  "name": "create_notebook",
  "arguments": {
    "name": "我的新笔记本"
  }
}
```

### 文档管理
```json
{
  "name": "create_doc",
  "arguments": {
    "path": "/daily/2025-08-03",
    "markdown": "# 今日总结\n\n今天完成了以下工作：\n- 项目开发\n- 文档编写"
  }
}
```

```json
{
  "name": "rename_doc",
  "arguments": {
    "notebook": "20210817205410-2kvfpfn",
    "path": "/old-title.sy",
    "title": "新标题"
  }
}
```

### 块操作
```json
{
  "name": "insert_block",
  "arguments": {
    "data": "这是一个新块",
    "parentID": "20211229114650-vrek5x6"
  }
}
```

```json
{
  "name": "update_block",
  "arguments": {
    "id": "20211230161520-querkps",
    "data": "更新后的内容"
  }
}
```

### SQL 查询
```json
{
  "name": "sql_query",
  "arguments": {
    "sql": "SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 5"
  }
}
```

### 通知功能
```json
{
  "name": "push_msg",
  "arguments": {
    "msg": "操作完成！",
    "timeout": 5000
  }
}
```

### 系统状态检查
```json
{
  "name": "check_siyuan_status",
  "arguments": {}
}
```

### 工作空间信息
```json
{
  "name": "get_workspace_info",
  "arguments": {}
}
```

## API 参考

本服务器基于思源笔记官方 API 文档实现，支持以下主要 API 端点：

### 笔记本管理
- `/api/notebook/lsNotebooks` - 列出笔记本
- `/api/notebook/openNotebook` - 打开笔记本
- `/api/notebook/closeNotebook` - 关闭笔记本
- `/api/notebook/renameNotebook` - 重命名笔记本
- `/api/notebook/createNotebook` - 创建笔记本
- `/api/notebook/removeNotebook` - 删除笔记本
- `/api/notebook/getNotebookConf` - 获取笔记本配置

### 文档管理
- `/api/filetree/createDocWithMd` - 创建文档
- `/api/filetree/renameDoc` - 重命名文档
- `/api/filetree/removeDoc` - 删除文档
- `/api/filetree/moveDocs` - 移动文档
- `/api/filetree/getDocTree` - 获取文档树
- `/api/filetree/getHPathByPath` - 根据路径获取人类可读路径
- `/api/filetree/getHPathByID` - 根据 ID 获取人类可读路径

### 块操作
- `/api/block/insertBlock` - 插入块
- `/api/block/updateBlock` - 更新块
- `/api/block/deleteBlock` - 删除块
- `/api/block/moveBlock` - 移动块
- `/api/block/getBlockKramdown` - 获取块 kramdown 源码
- `/api/block/getChildBlocks` - 获取子块

### 属性操作
- `/api/attr/setBlockAttrs` - 设置块属性
- `/api/attr/getBlockAttrs` - 获取块属性

### 搜索和查询
- `/api/query/sql` - SQL 查询
- `/api/sqlite/flushTransaction` - 提交事务

### 文件操作
- `/api/file/getFile` - 获取文件
- `/api/file/removeFile` - 删除文件
- `/api/file/renameFile` - 重命名文件
- `/api/file/readDir` - 列出文件

### 导出功能
- `/api/export/exportMdContent` - 导出 Markdown 文本

### 通知功能
- `/api/notification/pushMsg` - 推送消息
- `/api/notification/pushErrMsg` - 推送错误消息

### 系统信息
- `/api/system/info` - 系统信息
- `/api/system/version` - 版本信息
- `/api/system/currentTime` - 当前时间
- `/api/system/bootProgress` - 启动进度

## 错误处理

服务器提供了完善的错误处理机制：

- 网络连接错误
- API 调用失败
- 参数验证错误
- 空响应处理

所有错误都会返回有意义的错误信息，帮助用户快速定位问题。

### 常见问题解决

#### API 返回空响应
如果遇到 "Empty response from server" 错误，请按以下步骤检查：

1. **确保思源笔记正在运行**
2. **检查 API 服务设置**：
   - 打开思源笔记
   - 进入 `设置` → `关于` → `API 令牌`
   - 确保 API 服务已启用
3. **确保有打开的笔记本**：
   - 在思源笔记中打开一个笔记本
   - 某些 API 需要先打开笔记本才能正常工作
4. **重启思源笔记**：
   - 完全关闭思源笔记
   - 重新启动
5. **检查 API 令牌**：
   - 重新生成 API 令牌
   - 确保令牌格式正确

#### 使用状态检查工具
使用 `check_siyuan_status` 工具来诊断问题：
```json
{
  "name": "check_siyuan_status",
  "arguments": {}
}
```

这个工具会检查所有 API 端点的状态并提供详细的诊断信息。

## 开发

### 项目结构
```
siyuan-mcp/
├── src/
│   └── index.ts          # 主服务器代码
├── dist/                 # 编译输出
├── package.json          # 项目配置
└── tsconfig.json         # TypeScript 配置
```

### 开发命令
```bash
# 构建项目
npm run build

# 开发模式（需要先构建）
node dist/index.js
```

## 许可证

MIT License 