#!/usr/bin/env node

/**
 * 测试脚本 - 验证思源笔记 MCP 服务器功能
 * Test script for SiYuan MCP Server
 */

const { spawn } = require('child_process');
const readline = require('readline');

console.log('🧪 思源笔记 MCP 服务器测试');
console.log('SiYuan MCP Server Test');
console.log('========================');

// 检查环境变量
const requiredEnvVars = ['SIYUAN_HOST', 'SIYUAN_PORT', 'SIYUAN_TOKEN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ 缺少必需的环境变量:');
  console.log('Missing required environment variables:');
  missingVars.forEach(varName => console.log(`  - ${varName}`));
  console.log('\n请设置环境变量或创建 .env 文件');
  console.log('Please set environment variables or create .env file');
  process.exit(1);
}

console.log('✅ 环境变量检查通过');
console.log('Environment variables check passed');

// 测试 Docker 构建
console.log('\n🔨 测试 Docker 构建...');
console.log('Testing Docker build...');

const dockerBuild = spawn('docker', ['build', '-t', 'siyuan-mcp-test', '.']);

dockerBuild.stdout.on('data', (data) => {
  console.log(`Docker build output: ${data}`);
});

dockerBuild.stderr.on('data', (data) => {
  console.log(`Docker build error: ${data}`);
});

dockerBuild.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Docker 构建成功');
    console.log('Docker build successful');
    
    // 测试容器运行
    console.log('\n🐳 测试容器运行...');
    console.log('Testing container run...');
    
    const dockerRun = spawn('docker', [
      'run', '--rm',
      '-e', `SIYUAN_HOST=${process.env.SIYUAN_HOST}`,
      '-e', `SIYUAN_PORT=${process.env.SIYUAN_PORT}`,
      '-e', `SIYUAN_TOKEN=${process.env.SIYUAN_TOKEN}`,
      'siyuan-mcp-test'
    ]);
    
    // 设置超时
    const timeout = setTimeout(() => {
      console.log('⏰ 测试超时，停止容器');
      console.log('Test timeout, stopping container');
      dockerRun.kill();
    }, 10000);
    
    dockerRun.stdout.on('data', (data) => {
      console.log(`Container output: ${data}`);
    });
    
    dockerRun.stderr.on('data', (data) => {
      console.log(`Container error: ${data}`);
    });
    
    dockerRun.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ 容器运行测试成功');
        console.log('Container run test successful');
      } else {
        console.log(`❌ 容器运行测试失败，退出码: ${code}`);
        console.log(`Container run test failed, exit code: ${code}`);
      }
      
      // 清理测试镜像
      console.log('\n🧹 清理测试镜像...');
      console.log('Cleaning up test image...');
      spawn('docker', ['rmi', 'siyuan-mcp-test']).on('close', () => {
        console.log('✅ 测试完成');
        console.log('Test completed');
      });
    });
    
  } else {
    console.log(`❌ Docker 构建失败，退出码: ${code}`);
    console.log(`Docker build failed, exit code: ${code}`);
  }
});

// 处理中断信号
process.on('SIGINT', () => {
  console.log('\n🛑 测试被中断');
  console.log('Test interrupted');
  process.exit(0);
}); 