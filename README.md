# GitHub 入门到能用

北汐的 Git / GitHub 学习资料包。

## 文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | **主页**。完整学习手册，11 章：安装配置 → 四个区域 → 命令速查 → 推项目 → 拉仓库 → 分支 → .gitignore → 排错手册 → GitHub Pages → Issues/PR/Actions → 每日工作流 |
| `cheatsheet.html` | **中英对照手册**。看不懂英文时查这个。含新建仓库页、Pages 设置页、导航栏、仓库首页、Settings 侧边栏的逐项对照，以及术语小词典和常见英文提示语 |
| `github-zh.user.js` | **界面汉化脚本**。装到浏览器里，GitHub 界面直接变中文。见下方安装说明 |

直接用浏览器打开 `.html` 文件就能看，带侧边导航和代码复制按钮。

## 汉化脚本安装方法

### 第一步：装脚本管理器

浏览器装扩展 **Tampermonkey**（中文名"篡改猴"）：

- Edge：`microsoftedge.microsoft.com/addons` 搜 Tampermonkey
- Chrome：Chrome 应用商店搜 Tampermonkey

### 第二步：装脚本

方式 A（推荐，能自动更新）：

1. 把 `github-zh.user.js` 推到这个 GitHub 仓库
2. 在浏览器地址栏直接访问这个文件的地址，Tampermonkey 会自动弹出安装页
3. 点「安装」

方式 B（本地装）：

1. 点浏览器工具栏的 Tampermonkey 图标 → 「管理面板」
2. 点「实用工具」标签 → 在「导入」区域把 `github-zh.user.js` 的内容粘进去
3. 点「安装」

### 第三步：用

打开 github.com，右下角会出现一个蓝色小圆钮显示「中文」。

- 点它可以**一键切换**中文 / 英文
- 切回英文时会自动刷新页面还原

### 它是怎么工作的

用的是「整段文本精确匹配」——只有页面文字和词典里**完全一致**时才翻译。

所以不会出现浏览器翻译那种尴尬：把 `Commit` 翻成"犯罪"、把文件名也一起翻掉。

同时它会**跳过**这些区域，绝不误伤：

- 代码块和文件内容
- README 正文、评论内容
- 文件名、路径、提交哈希值

### 想加词怎么办

用文本编辑器打开 `github-zh.user.js`，找到 `const DICT = {` 那一行，按同样的格式加一行：

```javascript
'Repository name': '仓库名称',
```

左边的英文要**一字不差**（包括大小写），右边写中文。存盘后刷新页面生效。

## 顺便当练手项目

这个文件夹本身就是个 GitHub Pages 项目的模板，可以直接推上去：

```bash
cd github-guide
git init
git branch -M main
git add .
git commit -m "初始化：GitHub 学习手册"
git remote add origin https://github.com/seobeixi/github-guide.git
git push -u origin main
```

然后到仓库的 `Settings` → `Pages`，分支选 `main`、目录选 `/ (root)`，保存。

等一分钟，访问 `https://seobeixi.github.io/github-guide/` —— 网站就上线了。

## 学习节奏

| 阶段 | 目标 |
|---|---|
| 第 1 天 | 跑通流程，看到自己的网址 |
| 第 2-3 天 | 练熟五条日常命令 |
| 第 1 周 | 会用分支 |
| 第 2 周 | 看懂别人的仓库 |
| 第 1 个月 | 提第一个 PR |
