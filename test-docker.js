#!/usr/bin/env node

// 简单的 MCP 服务器测试脚本
import { spawn } from 'child_process';

console.log('🧪 测试 Docker 容器中的 MCP 服务器...');

// 测试环境变量
const env = {
  SIYUAN_HOST: '127.0.0.1',
  SIYUAN_PORT: '6806',
  SIYUAN_TOKEN: 'test-token',
  ...process.env
};

console.log('📋 环境变量配置:');
console.log(`  SIYUAN_HOST: ${env.SIYUAN_HOST}`);
console.log(`  SIYUAN_PORT: ${env.SIYUAN_PORT}`);
console.log(`  SIYUAN_TOKEN: ${env.SIYUAN_TOKEN ? '已设置' : '未设置'}`);

// 启动 MCP 服务器
const server = spawn('node', ['dist/index.js'], {
  env,
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('🚀 启动 MCP 服务器...');

server.stdout.on('data', (data) => {
  console.log('📤 服务器输出:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('⚠️  服务器错误:', data.toString());
});

server.on('close', (code) => {
  console.log(`✅ 服务器已关闭，退出码: ${code}`);
});

// 5秒后关闭服务器
setTimeout(() => {
  console.log('⏰ 测试完成，关闭服务器...');
  server.kill();
}, 5000); 