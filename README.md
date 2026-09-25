# GitHub 入门到能用

一份给北汐的 Git / GitHub 学习手册，单文件网页版。

## 内容

- **基础**：安装配置、四个区域、命令速查
- **实操**：推自己的项目、拉别人的仓库、分支、.gitignore
- **进阶**：排错手册、GitHub Pages 免费托管、Issues/PR/Actions、每日工作流

## 怎么用

直接用浏览器打开 `index.html` 就能看，带侧边导航和代码复制按钮。

## 顺便当练手项目

这个文件夹本身就是个 GitHub Pages 项目的模板：

```bash
cd github-guide
git init
git branch -M main
git add .
git commit -m "初始化：GitHub 学习手册"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

然后到仓库的 `Settings` → `Pages`，分支选 `main`、目录选 `/ (root)`，保存。

等一分钟，访问 `https://你的用户名.github.io/仓库名/` —— 你就有自己的网站了。

## 学习节奏

| 阶段 | 目标 |
|---|---|
| 第 1 天 | 跑通流程，看到自己的网址 |
| 第 2-3 天 | 练熟五条日常命令 |
| 第 1 周 | 会用分支 |
| 第 2 周 | 看懂别人的仓库 |
| 第 1 个月 | 提第一个 PR |
