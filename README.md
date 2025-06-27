# 2048 微信小程序版

一个基于微信小程序的2048数字合并游戏实现，完美复刻经典2048游戏玩法，适配移动端触摸操作。

## 功能特点

- 🎮 经典2048游戏玩法
- 👆 支持触摸滑动操作
- 📊 实时分数计算和最高分记录
- 🔄 本地存储游戏进度
- 🎨 精美的动画效果
- 📱 完全响应式设计

## 技术栈

- 微信小程序原生开发
- JavaScript ES6+
- WXML/WXSS
- 微信云开发（可选）

## 使用说明

1. 使用微信开发者工具导入项目
2. 点击编译按钮运行项目
3. 在模拟器或真机上体验游戏
4. 通过滑动屏幕控制数字移动方向

5. ![image](https://github.com/user-attachments/assets/360acaf9-26d6-4f02-b096-fb20c9b938d1)


## 项目结构

```
weapp/
├── app.js               # 小程序入口文件
├── app.wxss             # 全局样式
├── pages/
│   └── game/            # 游戏页面
│       ├── game.js      # 游戏逻辑
│       ├── game.json    # 页面配置
│       ├── game.wxml    # 页面结构
│       └── game.wxss    # 页面样式
└── README.md            # 项目说明
```

## 开发计划

- [x] 基础游戏逻辑实现
- [x] 界面布局和样式
- [ ] 添加音效系统
- [ ] 实现多主题切换
- [ ] 接入微信云开发
- [ ] 添加排行榜功能

## 如何贡献

1. Fork 本项目
2. 创建您的分支 (`git checkout -b feature/awesome-feature`)
3. 提交您的修改 (`git commit -am 'Add some awesome feature'`)
4. 推送到分支 (`git push origin feature/awesome-feature`)
5. 提交 Pull Request

## 许可证

MIT License
