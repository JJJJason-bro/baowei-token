# 保卫 token

一款使用 HTML5 Canvas 2D 制作的中文塔防游戏。玩家需要通过种植角色、收集阳光和合理布防，守住服务器机房最后的 token。

## 在线游玩

GitHub Pages 发布后，可直接用浏览器打开：

https://jjjjason-bro.github.io/baowei-token/

## 已实现内容

- 无尽模式与七关剧情闯关
- 七种植物与七种僵尸角色
- 剧情对话、图鉴、悬停说明和关卡解锁
- 无尽模式 Buff 抽取
- 自动阳光收集与游戏速度调节
- 奶龙猜拳小游戏
- 键盘与鼠标操作，支持响应式 Canvas

## 本地运行

项目不需要构建。为避免浏览器对本地图片和音频的限制，建议在项目目录启动静态服务器：

```powershell
python -m http.server 8765
```

然后访问 `http://127.0.0.1:8765/`。

## 项目结构

- `index.html`：游戏代码与界面
- `assets/`：角色、背景、音效和音乐
- `qa-check.js`：基础静态检查

