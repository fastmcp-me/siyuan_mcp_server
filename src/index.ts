import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const SY_HOST = process.env.SIYUAN_HOST || "127.0.0.1";
const SY_PORT = process.env.SIYUAN_PORT || "6806";
const SY_TOKEN = process.env.SIYUAN_TOKEN || "";   // 如果没有令牌就留空
const base = `http://${SY_HOST}:${SY_PORT}`;

const headers: Record<string, string> = { "Content-Type": "application/json" };
if (SY_TOKEN) headers["Authorization"] = `token ${SY_TOKEN}`;

async function api(path: string, body?: any) {
  try {
    console.log(`Calling API: ${base}${path}`);
  const res = await fetch(base + path, {
      method: "POST", // 所有请求都使用 POST 方法
    headers,
      body: JSON.stringify(body || {}), // 总是发送 body，即使是空对象
    });
    
    console.log(`Response status: ${res.status}`);
    console.log(`Response headers:`, Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const text = await res.text();
    console.log(`Response text length: ${text.length}`);
    console.log(`Response text: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
    
    if (!text) {
      throw new Error(`Empty response from server. This usually means:
1. SiYuan API service is not enabled in settings
2. The API endpoint ${path} does not exist
3. Authentication is required but token is invalid`);
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error(`API call failed for ${path}:`, error);
    throw new Error(`Failed to call SiYuan API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/* ---------- Server ---------- */
const server = new Server(
  {
    name: "siyuan-mcp",
    version: "0.1.0",
  },
  { capabilities: { tools: {}, resources: {} } }
);

/* ---------- 工具：思源笔记功能 ---------- */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // 笔记本管理
    {
      name: "list_notebooks",
      description: "列出所有笔记本",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "open_notebook",
      description: "打开指定笔记本",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
        },
        required: ["notebook"],
      },
    },
    {
      name: "close_notebook",
      description: "关闭指定笔记本",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
        },
        required: ["notebook"],
      },
    },
    {
      name: "rename_notebook",
      description: "重命名笔记本",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
          name: { type: "string", description: "新名称" },
        },
        required: ["notebook", "name"],
      },
    },
    {
      name: "create_notebook",
      description: "创建新笔记本",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "笔记本名称" },
        },
        required: ["name"],
      },
    },
    {
      name: "remove_notebook",
      description: "删除笔记本",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
        },
        required: ["notebook"],
      },
    },
    {
      name: "get_notebook_conf",
      description: "获取笔记本配置",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
        },
        required: ["notebook"],
      },
    },
    
    // 文档管理
    {
      name: "create_doc",
      description: "在指定笔记本中新建文档",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID（可选，不提供则使用当前笔记本）" },
          path: { type: "string", description: "文档路径，如 /daily/2025-08-03" },
          markdown: { type: "string", description: "Markdown 内容" },
        },
        required: ["path", "markdown"],
      },
    },
    {
      name: "rename_doc",
      description: "重命名文档",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
          path: { type: "string", description: "文档路径" },
          title: { type: "string", description: "新标题" },
        },
        required: ["notebook", "path", "title"],
      },
    },
    {
      name: "remove_doc",
      description: "删除文档",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
          path: { type: "string", description: "文档路径" },
        },
        required: ["notebook", "path"],
      },
    },
    {
      name: "move_docs",
      description: "移动文档",
      inputSchema: {
        type: "object",
        properties: {
          fromPaths: { type: "array", items: { type: "string" }, description: "源路径列表" },
          toNotebook: { type: "string", description: "目标笔记本 ID" },
          toPath: { type: "string", description: "目标路径" },
        },
        required: ["fromPaths", "toNotebook", "toPath"],
      },
    },
    {
      name: "get_doc_tree",
      description: "获取文档树结构",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID（可选，不提供则使用当前笔记本）" },
        },
        required: [],
      },
    },
    {
      name: "get_hpath_by_path",
      description: "根据路径获取人类可读路径",
      inputSchema: {
        type: "object",
        properties: {
          notebook: { type: "string", description: "笔记本 ID" },
          path: { type: "string", description: "路径" },
        },
        required: ["notebook", "path"],
      },
    },
    {
      name: "get_hpath_by_id",
      description: "根据 ID 获取人类可读路径",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "块 ID" },
        },
        required: ["id"],
      },
    },
    
    // 块操作
    {
      name: "insert_block",
      description: "插入块",
      inputSchema: {
        type: "object",
        properties: {
          dataType: { type: "string", description: "数据类型 (markdown 或 dom)", default: "markdown" },
          data: { type: "string", description: "数据内容" },
          nextID: { type: "string", description: "后一个块的 ID（可选）" },
          previousID: { type: "string", description: "前一个块的 ID（可选）" },
          parentID: { type: "string", description: "父块 ID（可选）" },
        },
        required: ["data"],
      },
    },
    {
      name: "update_block",
      description: "更新块",
      inputSchema: {
        type: "object",
        properties: {
          dataType: { type: "string", description: "数据类型 (markdown 或 dom)", default: "markdown" },
          data: { type: "string", description: "新的数据内容" },
          id: { type: "string", description: "块 ID" },
        },
        required: ["data", "id"],
      },
    },
    {
      name: "delete_block",
      description: "删除块",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "块 ID" },
        },
        required: ["id"],
      },
    },
    {
      name: "move_block",
      description: "移动块",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "要移动的块 ID" },
          previousID: { type: "string", description: "前一个块的 ID（可选）" },
          parentID: { type: "string", description: "父块 ID（可选）" },
        },
        required: ["id"],
      },
    },
    {
      name: "get_block_kramdown",
      description: "获取块 kramdown 源码",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "块 ID" },
        },
        required: ["id"],
      },
    },
    {
      name: "get_child_blocks",
      description: "获取子块",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "父块 ID" },
        },
        required: ["id"],
      },
    },
    
    // 属性操作
    {
      name: "set_block_attrs",
      description: "设置块属性",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "块 ID" },
          attrs: { type: "object", description: "属性对象" },
        },
        required: ["id", "attrs"],
      },
    },
    {
      name: "get_block_attrs",
      description: "获取块属性",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "块 ID" },
        },
        required: ["id"],
      },
    },
    
    // 搜索和查询
    {
      name: "sql_query",
      description: "执行 SQL 查询",
      inputSchema: {
        type: "object",
        properties: {
          sql: { type: "string", description: "SQL 查询语句" },
        },
        required: ["sql"],
      },
    },
    {
      name: "flush_transaction",
      description: "提交事务",
      inputSchema: { type: "object", properties: {} },
    },
    
    // 文件操作
    {
      name: "get_file",
      description: "获取文件",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "文件路径" },
        },
        required: ["path"],
      },
    },
    {
      name: "remove_file",
      description: "删除文件",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "文件路径" },
        },
        required: ["path"],
      },
    },
    {
      name: "rename_file",
      description: "重命名文件",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "文件路径" },
          newPath: { type: "string", description: "新文件路径" },
        },
        required: ["path", "newPath"],
      },
    },
    {
      name: "read_dir",
      description: "列出文件",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "文件夹路径" },
        },
        required: ["path"],
      },
    },
    
    // 导出功能
    {
      name: "export_md_content",
      description: "导出 Markdown 文本",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "要导出的文档块 ID" },
        },
        required: ["id"],
      },
    },
    
    // 通知功能
    {
      name: "push_msg",
      description: "推送消息",
      inputSchema: {
        type: "object",
        properties: {
          msg: { type: "string", description: "消息内容" },
          timeout: { type: "number", description: "显示时间（毫秒，可选）" },
        },
        required: ["msg"],
      },
    },
    {
      name: "push_err_msg",
      description: "推送错误消息",
      inputSchema: {
        type: "object",
        properties: {
          msg: { type: "string", description: "错误消息内容" },
          timeout: { type: "number", description: "显示时间（毫秒，可选）" },
        },
        required: ["msg"],
      },
    },
    
    // 系统信息
    {
      name: "get_system_info",
      description: "获取系统信息",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_version",
      description: "获取思源笔记版本",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_current_time",
      description: "获取系统当前时间",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_boot_progress",
      description: "获取启动进度",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "check_siyuan_status",
      description: "检查思源笔记状态和 API 可用性",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_workspace_info",
      description: "获取工作空间和连接信息",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

/* ---------- 工具调用 ---------- */
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
  const { name, arguments: args } = req.params;
  switch (name) {
      // 笔记本管理
    case "list_notebooks": {
        try {
          const data = await api("/api/notebook/lsNotebooks");
          if (data.code === 0 && data.data && data.data.notebooks) {
            return { content: [{ type: "text", text: JSON.stringify(data.data.notebooks, null, 2) }] };
          } else {
            return { content: [{ type: "text", text: `获取笔记本列表失败: ${data.msg || '未知错误'}` }] };
          }
        } catch (error) {
          return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }] };
        }
      }
      
      case "open_notebook": {
        if (!args) throw new Error("Arguments are required for open_notebook tool");
        const result = await api("/api/notebook/openNotebook", { notebook: args.notebook });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 笔记本打开成功: ${args.notebook}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 打开失败: ${result.msg}` }] };
        }
      }
      
      case "close_notebook": {
        if (!args) throw new Error("Arguments are required for close_notebook tool");
        const result = await api("/api/notebook/closeNotebook", { notebook: args.notebook });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 笔记本关闭成功: ${args.notebook}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 关闭失败: ${result.msg}` }] };
        }
      }
      
      case "rename_notebook": {
        if (!args) throw new Error("Arguments are required for rename_notebook tool");
        const result = await api("/api/notebook/renameNotebook", { 
          notebook: args.notebook, 
          name: args.name 
        });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 笔记本重命名成功: ${args.name}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 重命名失败: ${result.msg}` }] };
        }
      }
      
      case "get_notebook": {
        if (!args) throw new Error("Arguments are required for get_notebook tool");
        const result = await api("/api/notebook/getNotebook", { notebook: args.notebook });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "create_notebook": {
        if (!args) throw new Error("Arguments are required for create_notebook tool");
        const result = await api("/api/notebook/createNotebook", { name: args.name });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 笔记本创建成功: ${args.name}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 创建失败: ${result.msg}` }] };
        }
      }
      
      case "remove_notebook": {
        if (!args) throw new Error("Arguments are required for remove_notebook tool");
        const result = await api("/api/notebook/removeNotebook", { notebook: args.notebook });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 笔记本删除成功: ${args.notebook}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 删除失败: ${result.msg}` }] };
        }
      }
      
      case "get_notebook_conf": {
        if (!args) throw new Error("Arguments are required for get_notebook_conf tool");
        const result = await api("/api/notebook/getNotebookConf", { notebook: args.notebook });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 文档管理
    case "create_doc": {
        if (!args) throw new Error("Arguments are required for create_doc tool");
        
        let notebookId = args.notebook;
        if (!notebookId) {
          const currentNotebook = await api("/api/notebook/getNotebook");
          notebookId = currentNotebook.data?.id;
          if (!notebookId) {
            throw new Error("无法获取笔记本 ID，请手动指定 notebook 参数");
          }
        }
        
        const result = await api("/api/filetree/createDocWithMd", {
          notebook: notebookId,
        path: args.path,
        markdown: args.markdown,
      });
        
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 文档创建成功: ${args.path}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 创建失败: ${result.msg}` }] };
        }
      }
      
      case "rename_doc": {
        if (!args) throw new Error("Arguments are required for rename_doc tool");
        const result = await api("/api/filetree/renameDoc", {
          notebook: args.notebook,
          path: args.path,
          title: args.title,
        });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 文档重命名成功: ${args.title}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 重命名失败: ${result.msg}` }] };
        }
      }
      
      case "remove_doc": {
        if (!args) throw new Error("Arguments are required for remove_doc tool");
        const result = await api("/api/filetree/removeDoc", {
          notebook: args.notebook,
          path: args.path,
        });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 文档删除成功: ${args.path}` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 删除失败: ${result.msg}` }] };
        }
      }
      
      case "move_docs": {
        if (!args) throw new Error("Arguments are required for move_docs tool");
        const result = await api("/api/filetree/moveDocs", {
          fromPaths: args.fromPaths,
          toNotebook: args.toNotebook,
          toPath: args.toPath,
        });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 文档移动成功` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 移动失败: ${result.msg}` }] };
        }
      }
      
      case "get_doc": {
        if (!args) throw new Error("Arguments are required for get_doc tool");
        const result = await api("/api/filetree/getDoc", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "update_doc": {
        if (!args) throw new Error("Arguments are required for update_doc tool");
        const result = await api("/api/filetree/saveDoc", {
          id: args.id,
          markdown: args.markdown,
        });
        if (result.code === 0) {
          return { content: [{ type: "text", text: `✅ 文档更新成功` }] };
        } else {
          return { content: [{ type: "text", text: `❌ 更新失败: ${result.msg}` }] };
        }
      }
      
      case "get_doc_tree": {
        let notebookId = args?.notebook;
        if (!notebookId) {
          const currentNotebook = await api("/api/notebook/getNotebook");
          notebookId = currentNotebook.data?.id;
          if (!notebookId) {
            throw new Error("无法获取笔记本 ID");
          }
        }
        
        const result = await api("/api/filetree/getDocTree", { notebook: notebookId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_hpath_by_path": {
        if (!args) throw new Error("Arguments are required for get_hpath_by_path tool");
        const result = await api("/api/filetree/getHPathByPath", {
          notebook: args.notebook,
          path: args.path,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_hpath_by_id": {
        if (!args) throw new Error("Arguments are required for get_hpath_by_id tool");
        const result = await api("/api/filetree/getHPathByID", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 块操作
      case "insert_block": {
        if (!args) throw new Error("Arguments are required for insert_block tool");
        const params: any = {
          dataType: args.dataType || "markdown",
          data: args.data,
        };
        if (args.nextID) params.nextID = args.nextID;
        if (args.previousID) params.previousID = args.previousID;
        if (args.parentID) params.parentID = args.parentID;
        
        const result = await api("/api/block/insertBlock", params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "update_block": {
        if (!args) throw new Error("Arguments are required for update_block tool");
        const result = await api("/api/block/updateBlock", {
          dataType: args.dataType || "markdown",
          data: args.data,
          id: args.id,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "delete_block": {
        if (!args) throw new Error("Arguments are required for delete_block tool");
        const result = await api("/api/block/deleteBlock", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "move_block": {
        if (!args) throw new Error("Arguments are required for move_block tool");
        const params: any = { id: args.id };
        if (args.previousID) params.previousID = args.previousID;
        if (args.parentID) params.parentID = args.parentID;
        
        const result = await api("/api/block/moveBlock", params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_block_kramdown": {
        if (!args) throw new Error("Arguments are required for get_block_kramdown tool");
        const result = await api("/api/block/getBlockKramdown", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_child_blocks": {
        if (!args) throw new Error("Arguments are required for get_child_blocks tool");
        const result = await api("/api/block/getChildBlocks", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 属性操作
      case "set_block_attrs": {
        if (!args) throw new Error("Arguments are required for set_block_attrs tool");
        const result = await api("/api/attr/setBlockAttrs", {
          id: args.id,
          attrs: args.attrs,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_block_attrs": {
        if (!args) throw new Error("Arguments are required for get_block_attrs tool");
        const result = await api("/api/attr/getBlockAttrs", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 搜索和查询
      case "sql_query": {
        if (!args) throw new Error("Arguments are required for sql_query tool");
        const result = await api("/api/query/sql", { stmt: args.sql });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "flush_transaction": {
        const result = await api("/api/sqlite/flushTransaction");
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 文件操作
      case "get_file": {
        if (!args) throw new Error("Arguments are required for get_file tool");
        const result = await api("/api/file/getFile", { path: args.path });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "remove_file": {
        if (!args) throw new Error("Arguments are required for remove_file tool");
        const result = await api("/api/file/removeFile", { path: args.path });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "rename_file": {
        if (!args) throw new Error("Arguments are required for rename_file tool");
        const result = await api("/api/file/renameFile", {
          path: args.path,
          newPath: args.newPath,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "read_dir": {
        if (!args) throw new Error("Arguments are required for read_dir tool");
        const result = await api("/api/file/readDir", { path: args.path });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 导出功能
      case "export_md_content": {
        if (!args) throw new Error("Arguments are required for export_md_content tool");
        const result = await api("/api/export/exportMdContent", { id: args.id });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 通知功能
      case "push_msg": {
        if (!args) throw new Error("Arguments are required for push_msg tool");
        const params: any = { msg: args.msg };
        if (args.timeout) params.timeout = args.timeout;
        
        const result = await api("/api/notification/pushMsg", params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "push_err_msg": {
        if (!args) throw new Error("Arguments are required for push_err_msg tool");
        const params: any = { msg: args.msg };
        if (args.timeout) params.timeout = args.timeout;
        
        const result = await api("/api/notification/pushErrMsg", params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      // 系统信息
      case "get_system_info": {
        const result = await api("/api/system/info");
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_version": {
        const result = await api("/api/system/version");
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_current_time": {
        const result = await api("/api/system/currentTime");
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "get_boot_progress": {
        const result = await api("/api/system/bootProgress");
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
              case "check_siyuan_status": {
          const status: {
            version: any;
            systemInfo: any;
            notebooks: any;
            sqlQuery: any;
            errors: string[];
          } = {
            version: null,
            systemInfo: null,
            notebooks: null,
            sqlQuery: null,
            errors: []
          };
          
          try {
            status.version = await api("/api/system/version");
          } catch (error) {
            status.errors.push(`版本检查失败: ${error instanceof Error ? error.message : String(error)}`);
          }
          
          try {
            status.systemInfo = await api("/api/system/info");
          } catch (error) {
            status.errors.push(`系统信息检查失败: ${error instanceof Error ? error.message : String(error)}`);
          }
          
          try {
            status.notebooks = await api("/api/notebook/lsNotebooks");
          } catch (error) {
            status.errors.push(`笔记本列表检查失败: ${error instanceof Error ? error.message : String(error)}`);
          }
          
          try {
            status.sqlQuery = await api("/api/query/sql", { stmt: "SELECT 1" });
          } catch (error) {
            status.errors.push(`SQL 查询检查失败: ${error instanceof Error ? error.message : String(error)}`);
          }
          
          const summary = `
=== 思源笔记状态检查 ===

✅ 正常工作的 API:
${status.version ? '- 系统版本 API' : ''}
${status.systemInfo ? '- 系统信息 API' : ''}
${status.sqlQuery ? '- SQL 查询 API' : ''}

❌ 有问题的 API:
${status.notebooks ? '' : '- 笔记本列表 API'}
${status.errors.length > 0 ? status.errors.map(e => `- ${e}`).join('\n') : ''}

建议操作:
1. 确保思源笔记中有打开的笔记本
2. 检查 API 权限设置
3. 尝试重启思源笔记
4. 如果问题持续，可能需要重新生成 API 令牌

详细状态: ${JSON.stringify(status, null, 2)}
          `;
          
          return { content: [{ type: "text", text: summary }] };
        }
        
        case "get_workspace_info": {
          const info = {
            connection: {
              host: SY_HOST,
              port: SY_PORT,
              baseUrl: base,
              hasToken: !!SY_TOKEN
            },
            workspace: {
              path: "未设置",
              description: "工作空间路径已移除，使用相对路径"
            },
            environment: {
              SIYUAN_HOST: SY_HOST,
              SIYUAN_PORT: SY_PORT,
              SIYUAN_TOKEN: SY_TOKEN ? "已设置" : "未设置",
              SIYUAN_WORKSPACE: "已移除"
            }
          };
          
          const summary = `
=== 工作空间和连接信息 ===

🔗 连接信息:
- 主机: ${info.connection.host}
- 端口: ${info.connection.port}
- 基础URL: ${info.connection.baseUrl}
- 令牌状态: ${info.connection.hasToken ? '已设置' : '未设置'}

📁 工作空间:
- 路径: ${info.workspace.path}
- 状态: ${info.workspace.description}

⚙️ 环境变量:
${Object.entries(info.environment).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

💡 建议:
1. 如果访问远程思源笔记，请设置 SIYUAN_HOST
2. 如果使用非默认端口，请设置 SIYUAN_PORT
3. 建议设置 SIYUAN_WORKSPACE 以支持绝对路径操作
4. 确保 SIYUAN_TOKEN 已正确设置

详细配置: ${JSON.stringify(info, null, 2)}
          `;
          
          return { content: [{ type: "text", text: summary }] };
        }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error("Tool call failed:", error);
    return { 
      content: [{ 
        type: "text", 
        text: `Error: ${error instanceof Error ? error.message : String(error)}` 
      }] 
    };
  }
});

/* ---------- 资源：思源笔记数据资源 ---------- */
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "siyuan://recent",
      name: "最近 10 篇文档",
      mimeType: "application/json",
    },
    {
      uri: "siyuan://notebooks",
      name: "所有笔记本列表",
      mimeType: "application/json",
    },
    {
      uri: "siyuan://system-info",
      name: "系统信息",
      mimeType: "application/json",
    },
    {
      uri: "siyuan://doc-tree",
      name: "当前笔记本文档树",
      mimeType: "application/json",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async ({ params: { uri } }) => {
  try {
    switch (uri) {
      case "siyuan://recent": {
    const sql = `SELECT * FROM blocks WHERE type = 'd' ORDER BY created DESC LIMIT 10`;
    const res = await api("/api/query/sql", { stmt: sql });
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(res.data, null, 2) }] };
  }
      
      case "siyuan://notebooks": {
        const res = await api("/api/notebook/lsNotebooks");
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(res, null, 2) }] };
      }
      
      case "siyuan://system-info": {
        const res = await api("/api/system/info");
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(res, null, 2) }] };
      }
      
      case "siyuan://doc-tree": {
        // 获取当前笔记本
        const currentNotebook = await api("/api/notebook/getNotebook");
        const notebookId = currentNotebook.data?.id;
        
        if (!notebookId) {
          return { 
            contents: [{ 
              uri, 
              mimeType: "text/plain", 
              text: "无法获取当前笔记本信息" 
            }] 
          };
        }
        
        const res = await api("/api/filetree/getDocTree", { notebook: notebookId });
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(res, null, 2) }] };
      }
      
      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  } catch (error) {
    console.error("Resource read failed:", error);
    return { 
      contents: [{ 
        uri, 
        mimeType: "text/plain", 
        text: `Error: ${error instanceof Error ? error.message : String(error)}` 
      }] 
    };
  }
});

/* ---------- 启动 ---------- */
const transport = new StdioServerTransport();
server.connect(transport);