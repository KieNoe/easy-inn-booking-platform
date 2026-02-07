// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default defineConfig([
  // 忽略的文件和文件夹
  {
    ignores: [
      '**/*.config.ts', // 忽略所有 xxx.config.ts 文件
      'dist/**', // 忽略 dist 文件夹及其所有内容
      '**/dist/**', // 也忽略嵌套在其他目录中的 dist 文件夹
      '**/node_modules/**',
      '**/backend/**',
    ],
  },
  // 应用 ESLint 推荐的规则
  js.configs.recommended,

  // 应用 React 推荐的规则
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'], // 根据需要调整文件匹配模式
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      ecmaVersion: 2022, // 根据需要调整 ECMAScript 版本
      sourceType: 'module', // 根据需要调整模块类型
      parser: tsParser, // 使用 @typescript-eslint/parser
      // 配置全局变量
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        // 如果有自定义全局变量，可以在这里添加
        // myCustomGlobal: 'readonly',
      },
    },
    rules: {
      // 自定义规则
      'react/react-in-jsx-scope': 'off', // Taro/React 17+ 不需要 import React
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/exhaustive-deps': 'warn',
      // 如果需要应用 React 和 React-Hooks 的推荐规则，可以取消注释以下行
      // 'react/react-in-jsx-scope': 'off', // 已经在上面设置
      // 'react/prop-types': 'off', // 如果不需要 PropTypes 检查
      // 其他 React 相关规则
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
      // 其他 TypeScript 相关规则
      // '@typescript-eslint/explicit-function-return-type': 'off',
    },
    // 如果需要处理特定的处理器，可以在这里配置
    // processors: {
    //   '.md': myMarkdownProcessor,
    // },
  },
  // 您可以根据需要添加更多的配置对象，例如针对特定文件类型的配置
  // 例如，针对 Vue 文件的配置
  // {
  //   files: ['**/*.vue'],
  //   plugins: {
  //     // Vue 相关插件
  //   },
  //   languageOptions: {
  //     // Vue 相关的语言选项
  //   },
  //   rules: {
  //     // Vue 相关的规则
  //   },
  // },
]);
