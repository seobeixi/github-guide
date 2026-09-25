// ==UserScript==
// @name         GitHub 界面汉化（北汐版）
// @name:en      GitHub UI Chinese Localization
// @namespace    https://github.com/seobeixi
// @version      2.0.0
// @description  把 GitHub 的英文界面翻译成中文。混合引擎：手工词典精准翻译常用词（不会把 Commit 翻成"犯罪"），词典未收录的自动调用机器翻译补全。支持导航栏、仓库页、新建仓库页、Settings、Pages 等全站界面。
// @author       seobeixi
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.mymemory.translated.net
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  /* ============================================================
   * 一、设置读写（兼容没有 GM API 的环境）
   * ============================================================ */
  const store = {
    get(key, def) {
      try {
        if (typeof GM_getValue === 'function') return GM_getValue(key, def);
      } catch (e) { /* ignore */ }
      try {
        const v = localStorage.getItem('ghzh_' + key);
        return v === null ? def : JSON.parse(v);
      } catch (e) { return def; }
    },
    set(key, val) {
      try {
        if (typeof GM_setValue === 'function') { GM_setValue(key, val); return; }
      } catch (e) { /* ignore */ }
      try { localStorage.setItem('ghzh_' + key, JSON.stringify(val)); } catch (e) { /* ignore */ }
    }
  };

  let ENABLED = store.get('enabled', true);
  let MT_ENABLED = store.get('mtEnabled', true);
  let MT_MODE = store.get('mtMode', 'auto');

  /* ============================================================
   * 二、翻译词典
   * 说明：只做「整段文本完全相等」的匹配，不做模糊替换，
   *       所以不会误伤代码、文件名、README 正文。
   * ============================================================ */
  const DICT = {
    /* ---------- 顶部导航 / 全局 ---------- */
    'Pull requests': '拉取请求',
    'Issues': '议题',
    'Marketplace': '应用市场',
    'Explore': '探索',
    'Notifications': '通知',
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Sign in to GitHub': '登录 GitHub',
    'Search or jump to...': '搜索或跳转…',
    'Search or jump to…': '搜索或跳转…',
    'Type / to search': '按 / 搜索',
    'Your profile': '你的主页',
    'Your repositories': '你的仓库',
    'Your organizations': '你的组织',
    'Your projects': '你的项目',
    'Your stars': '你的星标',
    'Your gists': '你的代码片段',
    'Your Copilot': '你的 Copilot',
    'Your enterprises': '你的企业',
    'Your sponsors': '你的赞助',
    'Settings': '设置',
    'Dashboard': '仪表盘',
    'New repository': '新建仓库',
    'New gist': '新建代码片段',
    'New organization': '新建组织',
    'New project': '新建项目',
    'Import repository': '导入仓库',
    'Upgrade': '升级',
    'Feature preview': '功能预览',
    'Help': '帮助',
    'Docs': '文档',
    'Support': '支持',
    'Community': '社区',
    'Enterprise': '企业版',
    'Blog': '博客',
    'About': '关于',
    'Pricing': '定价',
    'Security': '安全',
    'Status': '状态',
    'Contact GitHub': '联系 GitHub',
    'Terms': '条款',
    'Privacy': '隐私',
    'Send feedback': '发送反馈',
    'Open user account menu': '打开用户菜单',
    'Open global navigation menu': '打开全局导航菜单',
    'Toggle navigation': '切换导航',
    'Dismiss': '关闭',
    'Close': '关闭',
    'Copy link': '复制链接',
    'Copy': '复制',
    'Copied!': '已复制！',
    'Copy to clipboard': '复制到剪贴板',
    'Loading…': '加载中…',
    'Loading...': '加载中…',
    'Search': '搜索',
    'Filter': '筛选',
    'Sort': '排序',
    'Clear': '清除',
    'Apply': '应用',
    'Reset': '重置',
    'Show more': '显示更多',
    'Show less': '收起',
    'Show all': '显示全部',
    'More': '更多',
    'Back': '返回',
    'Next': '下一步',
    'Previous': '上一步',
    'Continue': '继续',
    'Finish': '完成',
    'Done': '完成',
    'Cancel': '取消',
    'Save': '保存',
    'Save changes': '保存更改',
    'Saved': '已保存',
    'Update': '更新',
    'Edit': '编辑',
    'Delete': '删除',
    'Remove': '移除',
    'Add': '添加',
    'Create': '创建',
    'Confirm': '确认',
    'Submit': '提交',
    'Yes': '是',
    'No': '否',
    'OK': '确定',
    'Preview': '预览',
    'Write': '编写',
    'Download': '下载',
    'Upload': '上传',

    /* ---------- 仓库页 Tab ---------- */
    'Code': '代码',
    'Actions': '操作',
    'Projects': '项目',
    'Wiki': '维基',
    'Insights': '洞察',
    'Discussions': '讨论',
    'Releases': '发布版本',
    'Packages': '软件包',
    'Environments': '环境',
    'Deployments': '部署',
    'Checks': '检查',
    'Files changed': '文件变更',
    'Conversation': '对话',
    'Commits': '提交',
    'Commit': '提交',

    /* ---------- 仓库操作按钮 ---------- */
    'Watch': '关注',
    'Unwatch': '取消关注',
    'Star': '星标',
    'Starred': '已星标',
    'Unstar': '取消星标',
    'Fork': '复刻',
    'Forked': '已复刻',
    'Sponsor': '赞助',
    'Pin': '固定',
    'Unpin': '取消固定',
    'Add file': '添加文件',
    'Create new file': '新建文件',
    'Upload files': '上传文件',
    'Find file': '查找文件',
    'Go to file': '转到文件',
    'Go to line': '跳到行',
    'Edit this file': '编辑此文件',
    'Delete this file': '删除此文件',
    'Edit file': '编辑文件',
    'Edit README': '编辑 README',
    'Clone': '克隆',
    'Clone or download': '克隆或下载',
    'Download ZIP': '下载 ZIP 压缩包',
    'Open with GitHub Desktop': '用 GitHub Desktop 打开',
    'Use Git or checkout with SVN using the web URL.': '使用 Git 或 SVN，通过此网址检出。',
    'Local': '本地',
    'Codespaces': '代码空间',
    'HTTPS': 'HTTPS',
    'SSH': 'SSH',
    'GitHub CLI': 'GitHub 命令行',
    'Get started by creating a new file or uploading an existing file.': '新建一个文件或上传已有文件，即可开始。',
    'There aren’t any releases here': '这里还没有发布版本',
    'Create a new release': '创建新版本',
    'Releases are enabled for this repository.': '此仓库已启用发布功能。',
    'Readme': '说明文件',
    'License': '许可证',
    'Contributing': '参与贡献',
    'Activity': '动态',
    'Custom properties': '自定义属性',
    'Stars': '星标',
    'Watchers': '关注者',
    'Forks': '复刻',
    'No description, website, or topics provided.': '未提供描述、网站或主题标签。',
    'Edit repository metadata': '编辑仓库信息',
    'Edit topics': '编辑主题标签',
    'Topics': '主题标签',
    'Resources': '资源',
    'Report abuse': '举报滥用',

    /* ---------- 提交历史 ---------- */
    'commits': '次提交',
    'commit': '次提交',
    'Commits on': '提交于',
    'Latest commit': '最新提交',
    'Browse files': '浏览文件',
    'History': '历史',
    'Blame': '逐行追溯',
    'Raw': '原始文件',
    'Permalink': '永久链接',
    'View file': '查看文件',
    'View code': '查看代码',
    'Copy raw contents': '复制原始内容',
    'Download raw file': '下载原始文件',
    'Open in github.dev editor': '在 github.dev 编辑器中打开',
    'Open in github.dev': '在 github.dev 中打开',
    'Edit in place': '就地编辑',

    /* ---------- 新建仓库页 ---------- */
    'Create a new repository': '创建新仓库',
    'A repository contains all project files, including the revision history.':
      '仓库包含项目的全部文件，以及完整的修改历史。',
    'Repository name': '仓库名称',
    'Great repository names are short and memorable. Need inspiration? How about':
      '好的仓库名应该简短好记。需要灵感吗？试试',
    'Description': '描述',
    '(optional)': '（可选）',
    'Public': '公开',
    'Private': '私有',
    'Anyone on the internet can see this repository. You choose who can commit.':
      '互联网上的任何人都能看到此仓库，由你决定谁可以提交。',
    'You choose who can see and commit to this repository.':
      '由你决定谁可以查看和提交到此仓库。',
    'Initialize this repository with:': '初始化此仓库：',
    'Add a README file': '添加 README 文件',
    'Add .gitignore': '添加 .gitignore',
    'Choose a license': '选择许可证',
    'Create repository': '创建仓库',
    'Repository template': '仓库模板',
    'Start your repository with a template': '用模板初始化仓库',
    'No template': '不使用模板',
    'Choose a repository template': '选择仓库模板',

    /* ---------- 账号 Settings 侧边栏 ---------- */
    'Public profile': '公开资料',
    'Account': '账号',
    'Appearance': '外观',
    'Accessibility': '无障碍',
    'Billing and plans': '账单与套餐',
    'Emails': '邮箱',
    'Password and authentication': '密码与身份验证',
    'Sessions': '登录会话',
    'SSH and GPG keys': 'SSH 与 GPG 密钥',
    'Organizations': '组织',
    'Repositories': '仓库',
    'Saved replies': '已保存的回复',
    'Applications': '应用',
    'Developer settings': '开发者设置',
    'Personal access tokens': '个人访问令牌',
    'Tokens (classic)': '令牌（经典）',
    'Fine-grained tokens': '细粒度令牌',
    'OAuth Apps': 'OAuth 应用',
    'GitHub Apps': 'GitHub 应用',
    'Preferences': '偏好设置',
    'Profile': '资料',
    'Change username': '更改用户名',
    'Change your username': '更改你的用户名',
    'Delete account': '删除账号',
    'Export account data': '导出账号数据',
    'Theme preferences': '主题偏好',
    'Light': '浅色',
    'Dark': '深色',
    'System': '跟随系统',
    'Light default': '浅色（默认）',
    'Dark default': '深色（默认）',
    'Light high contrast': '浅色高对比度',
    'Dark high contrast': '深色高对比度',
    'Light colorblind': '浅色色盲友好',
    'Dark colorblind': '深色色盲友好',
    'Light Protanopia & Deuteranopia': '浅色（红绿色盲）',
    'Dark Protanopia & Deuteranopia': '深色（红绿色盲）',
    'Light Tritanopia': '浅色（蓝黄色盲）',
    'Dark Tritanopia': '深色（蓝黄色盲）',

    /* ---------- Pages 设置页 ---------- */
    'GitHub Pages': 'GitHub 页面',
    'Pages': '页面',
    'Build and deployment': '构建与部署',
    'Source': '源',
    'Deploy from a branch': '从分支部署',
    'GitHub Actions': 'GitHub 操作',
    'Branch': '分支',
    'Folder': '文件夹',
    'Custom domain': '自定义域名',
    'Enforce HTTPS': '强制使用 HTTPS',
    'Your site is live at': '你的网站已上线于',
    'Your site is published at': '你的网站已发布于',
    'Visit site': '访问网站',
    'Your GitHub Pages site is currently being built from the':
      '你的 GitHub Pages 站点当前正从下列位置构建：',
    'Learn more': '了解更多',
    'Check out our documentation': '查看我们的文档',
    'Unpublish site': '取消发布网站',
    'Remove domain': '移除域名',
    'Note': '注意',

    /* ---------- 议题 / 拉取请求 ---------- */
    'New issue': '新建议题',
    'New pull request': '新建拉取请求',
    'Create pull request': '创建拉取请求',
    'Merge pull request': '合并拉取请求',
    'Create draft pull request': '创建草稿拉取请求',
    'Compare & pull request': '对比并创建拉取请求',
    'Open': '开启',
    'Closed': '已关闭',
    'Merged': '已合并',
    'Draft': '草稿',
    'Author': '作者',
    'Labels': '标签',
    'Milestones': '里程碑',
    'Assignee': '指派给',
    'Assignees': '指派给',
    'Reviewers': '审查者',
    'No one assigned': '未指派',
    'None yet': '暂无',
    'Leave a comment': '留下评论',
    'Comment': '评论',
    'Close issue': '关闭议题',
    'Close with comment': '评论并关闭',
    'Reopen issue': '重新开启议题',
    'Subscribe': '订阅',
    'Unsubscribe': '取消订阅',
    'Participants': '参与者',
    'Linked pull requests': '关联的拉取请求',
    'Successfully merging a pull request may close this issue.':
      '成功合并拉取请求后，可能会自动关闭此议题。',
    'Add a comment': '添加评论',
    'Write a comment...': '写点评论…',
    'Ready for review': '准备审查',
    'Approve': '批准',
    'Request changes': '请求修改',
    'Comment on this pull request': '评论此拉取请求',
    'Submit review': '提交审查',
    'Review changes': '审查变更',
    'Discard': '丢弃',
    'Resolve conversation': '标记为已解决',
    'Unresolve conversation': '标记为未解决',
    'Viewed': '已查看',

    /* ---------- 个人主页 ---------- */
    'Overview': '概览',
    'Followers': '关注者',
    'Following': '正在关注',
    'Follow': '关注',
    'Unfollow': '取消关注',
    'Block or report': '屏蔽或举报',
    'Contribution activity': '贡献活动',
    'contributions in the last year': '过去一年的贡献',
    'Edit profile': '编辑个人资料',
    'Achievements': '成就',
    'Highlights': '亮点',
    'Popular repositories': '热门仓库',
    'Pinned': '已固定',

    /* ---------- 通知 ---------- */
    'All': '全部',
    'Unread': '未读',
    'Mark as read': '标记为已读',
    'Mark as done': '标记为完成',
    'Mark all as read': '全部标记为已读',
    'You’re all caught up!': '你已经看完啦！',
    'You have no unread notifications': '你没有未读通知',

    /* ---------- 登录 / 注册页 ---------- */
    'Username or email address': '用户名或邮箱地址',
    'Password': '密码',
    'Forgot password?': '忘记密码？',
    'Create an account': '创建账号',
    'Sign in with a passkey': '用通行密钥登录',
    'New to GitHub?': '第一次用 GitHub？',
    'Terms of Service': '服务条款',
    'Privacy Statement': '隐私声明',

    /* ---------- 新版首页 / Dashboard ---------- */
    'Home': '首页',
    'Top repositories': '常用仓库',
    'Find a repository...': '查找仓库…',
    'Find a repository…': '查找仓库…',
    'New': '新建',
    'Getting started': '开始使用',
    'Recommended': '推荐',
    'Recent activity': '最近动态',
    'My repositories': '我的仓库',
    'Repositories you contribute to': '你参与贡献的仓库',
    'You don’t have any repositories that match.': '没有匹配的仓库。',
    'Create your first code project': '创建你的第一个代码项目',
    'Start a Copilot chat': '开始 Copilot 对话',
    'Ask Copilot questions about coding or GitHub and get instant help with your first project.':
      '向 Copilot 提问编程或 GitHub 相关问题，为你的第一个项目获取即时帮助。',
    'Discover more': '发现更多',
    'Show more activity': '显示更多动态',
    'Show less activity': '收起动态',

    /* ---------- Copilot 相关 ---------- */
    'Ask anything or type @ to add context': '输入任何问题，或用 @ 添加上下文',
    'Ask': '提问',
    'Agent': '智能体',
    'Auto': '自动',
    'Debug': '调试',
    'Write code': '编写代码',
    'Create issue': '创建议题',
    'Optimized for: Balance': '已优化为：均衡',
    'Optimized for: Precision': '已优化为：精确',
    'Optimized for: Creativity': '已优化为：创意',
    'The GitHub Copilot app': 'GitHub Copilot 应用',
    'An agent-driven desktop experience built natively on GitHub.':
      '原生构建于 GitHub 之上的智能体桌面体验。',
    'Download for Windows': '下载 Windows 版',
    'Download for macOS': '下载 macOS 版',
    'Download for Linux': '下载 Linux 版',
    'My open pull requests': '我开启的拉取请求',
    'Summarize my latest PR': '总结我最新的拉取请求',
    'Create a new issue': '创建新议题',
    'Search my repositories': '搜索我的仓库',
    'What can I help you with?': '有什么可以帮你的？',
    'Explain this code': '解释这段代码',
    'Fix this bug': '修复这个 bug',
    'Write a test': '写一个测试',

    /* ---------- 首页推荐模块 ---------- */
    'Playlist': '播放列表',
    'Start playlist': '开始播放',
    'GitHub for beginners on YouTube': 'YouTube 上的 GitHub 入门教程',
    'Designed to help you master the basics of GitHub, whether you’re new to coding or looking to enhance your version control skills.':
      '帮你掌握 GitHub 基础，无论你是编程新手，还是想提升版本控制技能。',
    'Recommended for you': '为你推荐',
    'Explore GitHub': '探索 GitHub',
    'Hide this': '隐藏此项',
    'Feedback': '反馈',
    'complete': '完成',

    /* ---------- 通用提示 ---------- */
    'Something went wrong.': '出错了。',
    'Try again': '重试',
    'Retry': '重试',
    'Required': '必填',
    'Optional': '可选',
    'Enabled': '已启用',
    'Disabled': '已禁用',
    'On': '开',
    'Off': '关',
    'Default': '默认',
    'Public repositories': '公开仓库',
    'Private repositories': '私有仓库',
    'All repositories': '全部仓库',
    'Selected repositories': '选中的仓库',
    'Recent': '最近',
    'Suggested': '推荐',
    'No results matched your search.': '没有匹配的结果。',
    'Jump to': '跳转到'
  };

  /* ---------- 正则规则：处理带数字/变量的动态文本 ---------- */
  const PATTERNS = [
    [/^(\d[\d,]*)\s+commits?$/i, (m) => `${m[1]} 次提交`],
    [/^Show all (\d[\d,]*)\s+commits?$/i, (m) => `显示全部 ${m[1]} 次提交`],
    [/^Star this repository \((\d+)\)$/i, (m) => `星标本仓库（${m[1]}）`],
    [/^Fork this repository \((\d+)\)$/i, (m) => `复刻本仓库（${m[1]}）`],
    [/^(\d+)\s+branches?$/i, (m) => `${m[1]} 个分支`],
    [/^(\d+)\s+tags?$/i, (m) => `${m[1]} 个标签`],
    [/^(\d+)\s+contributors?$/i, (m) => `${m[1]} 位贡献者`],
    [/^(\d+)\s+open$/i, (m) => `${m[1]} 个开启`],
    [/^(\d+)\s+closed$/i, (m) => `${m[1]} 个已关闭`],
    [/^(\d+)\s+stars?$/i, (m) => `${m[1]} 个星标`],
    [/^(\d+)\s+forks?$/i, (m) => `${m[1]} 个复刻`],
    [/^(\d+)\s+watching$/i, (m) => `${m[1]} 人关注`],
    [/^(\d+)\s+files? changed$/i, (m) => `${m[1]} 个文件变更`],
    [/^Show (\d+) more$/i, (m) => `再显示 ${m[1]} 条`],
    [/^(\d+) days ago$/i, (m) => `${m[1]} 天前`],
    [/^(\d+) hours? ago$/i, (m) => `${m[1]} 小时前`],
    [/^(\d+) minutes? ago$/i, (m) => `${m[1]} 分钟前`],
    [/^(\d+) seconds? ago$/i, (m) => `${m[1]} 秒前`],
    [/^(\d+) months? ago$/i, (m) => `${m[1]} 个月前`],
    [/^(\d+) years? ago$/i, (m) => `${m[1]} 年前`],
    [/^(\d+)\/(\d+) complete$/i, (m) => `${m[1]}/${m[2]} 已完成`],
    [/^(\d+) complete$/i, (m) => `${m[1]} 已完成`],
    [/^(\d+) selected$/i, (m) => `已选 ${m[1]} 项`],
    [/^(\d+) results?$/i, (m) => `${m[1]} 个结果`],
    [/^Page (\d+)$/i, (m) => `第 ${m[1]} 页`],
    [/^yesterday$/i, () => '昨天'],
    [/^last week$/i, () => '上周'],
    [/^last month$/i, () => '上个月'],
    [/^last year$/i, () => '去年'],
    [/^on ([A-Z][a-z]{2} \d{1,2},? \d{4})$/i, (m) => `${m[1]}`],
    [/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}),? (\d{4})$/i,
      (m) => `${m[3]}年${{Jan:'1',Feb:'2',Mar:'3',Apr:'4',May:'5',Jun:'6',Jul:'7',Aug:'8',Sep:'9',Oct:'10',Nov:'11',Dec:'12'}[m[1]]}月${m[2]}日`]
  ];

  /* ============================================================
   * 三、需要跳过的区域（绝不翻译）
   * 代码、文件名、README 正文、用户评论内容等
   * ============================================================ */
  const SKIP_SELECTOR = [
    'pre',
    'code',
    'samp',
    'kbd',
    'textarea',
    'script',
    'style',
    'noscript',
    '.blob-code',
    '.blob-wrapper',
    '.highlight',
    '.js-file-line',
    '.markdown-body',
    '.comment-body',
    '.react-code-lines',
    '.cm-editor',
    '.CodeMirror',
    '[data-testid="code-cell"]',
    '.js-navigation-open',
    '.js-path-segment',
    '.final-path',
    '.breadcrumb',
    '[data-testid="breadcrumbs"]',
    '[data-testid="blob"]',
    '.commit-tease-sha',
    '.sha',
    '.commit-sha',
    '.user-mention',
    '.team-mention',
    '.author',
    '.avatar',
    '.js-username',
    '[itemprop="name"]',
    '.ghzh-ui',
    '[data-ghzh-skip]'
  ].join(',');

  /* ============================================================
   * 四、翻译引擎
   * ============================================================ */

  function lookup(text) {
    if (!text) return null;
    const t = text.trim();
    if (!t) return null;

    // 1. 精确词典
    if (Object.prototype.hasOwnProperty.call(DICT, t)) {
      const zh = DICT[t];
      return text.replace(t, zh);
    }

    // 2. 正则规则
    for (let i = 0; i < PATTERNS.length; i++) {
      const re = PATTERNS[i][0];
      const fn = PATTERNS[i][1];
      const m = t.match(re);
      if (m) {
        const zh = fn(m);
        if (zh && zh !== t) return text.replace(t, zh);
      }
    }
    return null;
  }

  /* ============================================================
   * 四之二、机器翻译引擎（MyMemory 免费接口）
   * 只在词典/正则都未命中时兜底，并做缓存与限流
   * ============================================================ */

  const MT = {
    cache: {},
    pending: {},          // 正在请求的文本 -> 等待者数组
    queue: [],
    timer: null,
    inflight: 0,
    MAX_INFLIGHT: 3,
    INTERVAL: 260,        // 批间隔(ms)，控制速率
    DAILY_LIMIT: 4800,    // 每天字数上限（官方 5000，留余量）
    used: 0,
    dead: false,          // 连续失败后停用
    failCount: 0,

    loadCache() {
      try {
        const c = store.get('mtCache', null);
        if (c && typeof c === 'object') this.cache = c;
        const u = store.get('mtUsed', null);
        const day = new Date().toISOString().slice(0, 10);
        if (u && u.day === day) this.used = u.count || 0;
        else this.used = 0;
      } catch (e) { /* ignore */ }
    },

    saveCache() {
      try {
        // 控制缓存体积，最多保留 4000 条
        const keys = Object.keys(this.cache);
        if (keys.length > 4000) {
          const keep = keys.slice(keys.length - 3000);
          const nc = {};
          keep.forEach(function (k) { nc[k] = MT.cache[k]; });
          this.cache = nc;
        }
        store.set('mtCache', this.cache);
        store.set('mtUsed', { day: new Date().toISOString().slice(0, 10), count: this.used });
      } catch (e) { /* ignore */ }
    },

    // 判断是否值得送去机器翻译
    worth(text) {
      if (!MT_ENABLED || this.dead) return false;
      const t = text.trim();
      if (t.length < 2 || t.length > 120) return false;   // 太短/太长都不翻
      if (!/[A-Za-z]{2}/.test(t)) return false;           // 至少两个连续字母
      if (!/^[\x20-\x7E\u00A0-\u024F\u2018\u2019\u201C\u201D\u2026\u2013\u2014]+$/.test(t)) return false; // 纯英文/欧文标点，避免翻中文内容
      if (/^[\d\s.,:;!?%$+\-*/=<>()\[\]{}#@&|~^"'`\\]+$/.test(t)) return false; // 纯符号数字
      if (/[\w.-]+@[\w.-]+\.\w+/.test(t)) return false;   // 邮箱
      if (/\b[\w-]+\.(js|ts|json|md|css|html|yml|yaml|py|go|rs|java|sh)\b/i.test(t)) return false; // 文件名
      if (this.used >= this.DAILY_LIMIT) return false;
      return true;
    },

    get(text) {
      const k = text.trim();
      return Object.prototype.hasOwnProperty.call(this.cache, k) ? this.cache[k] : null;
    },

    // 加入队列；完成后回调
    request(text, cb) {
      const k = text.trim();
      const hit = this.get(k);
      if (hit) { cb(hit); return; }
      if (!this.worth(text)) { cb(null); return; }

      if (this.pending[k]) { this.pending[k].push(cb); return; }
      this.pending[k] = [cb];
      this.queue.push(k);
      this.schedule();
    },

    schedule() {
      const self = this;
      if (this.timer) return;
      this.timer = setTimeout(function () {
        self.timer = null;
        self.flush();
      }, this.INTERVAL);
    },

    flush() {
      const self = this;
      if (!this.queue.length) return;
      // 控制并发
      if (this.inflight >= this.MAX_INFLIGHT) { this.schedule(); return; }

      const k = this.queue.shift();
      this.inflight++;
      this.used += k.length;

      this.ajax(k, function (zh) {
        self.inflight--;
        const waiters = self.pending[k] || [];
        delete self.pending[k];

        if (zh) {
          self.cache[k] = zh;
          self.failCount = 0;
          waiters.forEach(function (fn) { try { fn(zh); } catch (e) {} });
          self.saveCache();
        } else {
          waiters.forEach(function (fn) { try { fn(null); } catch (e) {} });
        }
        if (self.queue.length) self.schedule();
      });
    },

    ajax(text, cb) {
      const self = this;
      const url = 'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text) + '&langpair=en|zh-CN';

      function done(ok, zh) {
        if (!ok) {
          self.failCount++;
          if (self.failCount >= 8) { self.dead = true; }  // 连续失败就放弃，别拖累页面
          cb(null);
          return;
        }
        cb(zh);
      }

      // 优先用 GM_xmlhttpRequest，绕过 CORS
      try {
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 12000,
            onload(res) {
              try {
                const d = JSON.parse(res.responseText);
                const t = d && d.responseData && d.responseData.translatedText;
                if (t && typeof t === 'string' && !/^[A-Za-z\s]*$/.test(t)) done(true, t);
                else done(false);
              } catch (e) { done(false); }
            },
            onerror() { done(false); },
            ontimeout() { done(false); }
          });
          return;
        }
      } catch (e) { /* 降级到 fetch */ }

      // 降级：fetch（依赖 CORS，接口返回 Access-Control-Allow-Origin: *）
      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          const t = d && d.responseData && d.responseData.translatedText;
          if (t && typeof t === 'string' && !/^[A-Za-z\s]*$/.test(t)) done(true, t);
          else done(false);
        })
        .catch(function () { done(false); });
    }
  };

  MT.loadCache();

  function translatableTextNode(node) {
    if (!node || !node.nodeValue) return false;
    const t = node.nodeValue.trim();
    if (!t) return false;
    // 只处理含字母的、长度合理的文本
    if (t.length > 160) return false;
    if (!/[A-Za-z]/.test(t)) return false;
    // 已含中文 → 说明翻译过了，直接跳过（防止重复处理形成循环）
    if (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(t)) return false;
    return true;
  }

  function translateTextNode(node) {
    if (!translatableTextNode(node)) return false;
    const parent = node.parentElement;
    if (!parent) return false;
    if (parent.closest(SKIP_SELECTOR)) return false;
    if (parent.hasAttribute('data-ghzh-skip')) return false;

    const result = lookup(node.nodeValue);
    if (result !== null && result !== node.nodeValue) {
      node.nodeValue = result;
      return true;
    }

    // 词典/正则未命中 → 交给机器翻译兜底（异步，不影响页面）
    if (MT_ENABLED && !MT.dead && MT.worth(node.nodeValue)) {
      const raw = node.nodeValue;
      const prefix = raw.match(/^\s*/)[0];
      const suffix = raw.match(/\s*$/)[0];
      MT.request(raw, function (zh) {
        if (!zh) return;
        // 回填前确认节点还在文档里、内容没被改过
        if (!node.parentElement || !document.contains(node)) return;
        if (node.nodeValue !== raw) return;
        node.nodeValue = prefix + zh + suffix;
      });
    }
    return false;
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.closest && el.closest(SKIP_SELECTOR)) return;

    const attrs = ['placeholder', 'title', 'aria-label'];
    for (let i = 0; i < attrs.length; i++) {
      const name = attrs[i];
      const val = el.getAttribute && el.getAttribute(name);
      if (!val) continue;

      const zh = lookup(val);
      if (zh !== null) { el.setAttribute(name, zh); continue; }

      // 同样给属性加机器翻译兜底
      if (MT_ENABLED && !MT.dead && MT.worth(val)) {
        (function (attrName, orig) {
          MT.request(orig, function (t) {
            if (!t || !document.contains(el)) return;
            if (el.getAttribute(attrName) !== orig) return;
            el.setAttribute(attrName, t);
          });
        })(name, val);
      }
    }
  }

  function walk(root) {
    if (!ENABLED) return;
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1) return;
    if (root.closest && root.closest(SKIP_SELECTOR)) {
      // 但属性仍可能值得翻译（例如搜索框本身不在 skip 里）
      return;
    }

    translateAttributes(root);

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(n) {
          if (!translatableTextNode(n)) return NodeFilter.FILTER_REJECT;
          const p = n.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (p.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let n;
    while ((n = walker.nextNode())) {
      translateTextNode(n);
    }

    // 处理属性
    if (root.querySelectorAll) {
      const els = root.querySelectorAll('[placeholder],[title],[aria-label]');
      for (let i = 0; i < els.length; i++) translateAttributes(els[i]);
    }
  }

  /* ============================================================
   * 五、监听页面变化（GitHub 是单页应用，切换页面不会整页刷新）
   * ============================================================ */
  let pending = null;
  function scheduleTranslate(root) {
    if (!ENABLED) return;
    if (pending) clearTimeout(pending);
    pending = setTimeout(function () {
      pending = null;
      walk(root || document.body);
    }, 120);
  }

  let observerStarted = false;
  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;
    const mo = new MutationObserver(function (muts) {
      if (!ENABLED) return;
      for (let i = 0; i < muts.length; i++) {
        const m = muts[i];
        if (m.type === 'childList' && m.addedNodes.length) {
          for (let j = 0; j < m.addedNodes.length; j++) {
            const nd = m.addedNodes[j];
            if (nd.nodeType === 1 && nd.classList && nd.classList.contains('ghzh-ui')) continue;
            scheduleTranslate(nd);
          }
          return;
        }
        if (m.type === 'characterData') {
          scheduleTranslate(m.target.parentElement);
          return;
        }
      }
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /* ============================================================
   * 六、悬浮控制面板（用 Shadow DOM 隔离样式，避免被 GitHub 干扰）
   * ============================================================ */
  function buildPanel() {
    if (document.querySelector('.ghzh-ui')) return;

    const host = document.createElement('div');
    host.className = 'ghzh-ui';
    host.style.cssText = 'position:fixed;z-index:2147483000;right:18px;bottom:18px;';

    const sh = host.attachShadow({ mode: 'open' });
    sh.innerHTML = [
      '<style>',
      '  .wrap{display:flex;flex-direction:column;align-items:flex-end;gap:6px;',
      '        font-family:-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}',
      '  .btn{display:flex;align-items:center;gap:6px;background:#1f6feb;color:#fff;',
      '       border:none;border-radius:999px;padding:9px 15px;font-size:13px;cursor:pointer;',
      '       box-shadow:0 3px 12px rgba(0,0,0,.28);transition:.18s;font-weight:500}',
      '  .btn:hover{background:#388bfd;transform:translateY(-1px)}',
      '  .btn.off{background:#30363d;color:#8b949e}',
      '  .dot{width:7px;height:7px;border-radius:50%;background:#3fb950;flex-shrink:0}',
      '  .btn.off .dot{background:#6e7681}',
      '  .mt{display:flex;align-items:center;gap:6px;background:#21262d;color:#c9d1d9;',
      '      border:1px solid #30363d;border-radius:999px;padding:6px 12px;font-size:11.5px;',
      '      cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.24);transition:.18s}',
      '  .mt:hover{border-color:#58a6ff}',
      '  .mt.off{opacity:.5}',
      '  .mdot{width:6px;height:6px;border-radius:50%;background:#d29922;flex-shrink:0}',
      '  .mt.off .mdot{background:#6e7681}',
      '  .tip{position:absolute;right:0;bottom:calc(100% + 8px);width:230px;padding:10px 12px;',
      '       background:#161b22;color:#c9d1d9;border:1px solid #30363d;border-radius:10px;',
      '       font-size:11.5px;line-height:1.7;display:none}',
      '  .tip.on{display:block}',
      '  .tip b{color:#58a6ff;font-weight:500}',
      '  .tip .row{display:flex;justify-content:space-between;gap:8px;margin-top:5px}',
      '  .tip .k{color:#8b949e}',
      '</style>',
      '<div class="wrap" style="position:relative">',
      '  <div class="tip" id="tip">',
      '    <div><b>混合翻译引擎</b></div>',
      '    <div style="margin-top:4px">词典：精准翻译常用词（优先）</div>',
      '    <div>机器翻译：词典未收录时兜底</div>',
      '    <div class="row"><span class="k">今日用量</span><span id="usage">–</span></div>',
      '    <div class="row"><span class="k">缓存条目</span><span id="cached">–</span></div>',
      '    <div class="row"><span class="k">状态</span><span id="state">–</span></div>',
      '  </div>',
      '  <button class="mt" id="mtBtn">',
      '    <span class="mdot"></span><span id="mtTxt">机翻开</span>',
      '  </button>',
      '  <button class="btn" title="点击切换中英界面">',
      '    <span class="dot"></span><span class="txt">中文</span>',
      '  </button>',
      '</div>'
    ].join('');

    document.body.appendChild(host);

    const btn = sh.querySelector('.btn');
    const txt = sh.querySelector('.txt');
    const mtBtn = sh.querySelector('#mtBtn');
    const mtTxt = sh.querySelector('#mtTxt');
    const tip = sh.querySelector('#tip');
    const usageEl = sh.querySelector('#usage');
    const cachedEl = sh.querySelector('#cached');
    const stateEl = sh.querySelector('#state');
    let tipTimer = null;

    function refresh() {
      btn.classList.toggle('off', !ENABLED);
      txt.textContent = ENABLED ? '中文' : 'English';
      btn.title = ENABLED ? '当前：中文界面，点击切回英文' : '当前：英文界面，点击切换中文';

      mtBtn.classList.toggle('off', !MT_ENABLED);
      mtTxt.textContent = MT_ENABLED ? (MT.dead ? '机翻停用' : '机翻开') : '机翻关';
    }
    refresh();

    function refreshTip() {
      usageEl.textContent = MT.used + ' / ' + MT.DAILY_LIMIT + ' 字';
      cachedEl.textContent = Object.keys(MT.cache).length + ' 条';
      stateEl.textContent = MT.dead ? '接口无响应' : (MT_ENABLED ? '正常' : '已关闭');
    }

    // 悬停查看用量
    mtBtn.addEventListener('mouseenter', function () {
      clearTimeout(tipTimer);
      refreshTip();
      tip.classList.add('on');
    });
    mtBtn.addEventListener('mouseleave', function () {
      tipTimer = setTimeout(function () { tip.classList.remove('on'); }, 350);
    });

    // 点击切换机翻
    mtBtn.addEventListener('click', function () {
      if (MT.dead) { MT.dead = false; MT.failCount = 0; }
      MT_ENABLED = !MT_ENABLED;
      store.set('mtEnabled', MT_ENABLED);
      refresh();
      refreshTip();
    });

    btn.addEventListener('click', function () {
      ENABLED = !ENABLED;
      store.set('enabled', ENABLED);
      refresh();
      if (ENABLED) {
        // 切回中文时重新翻译（已翻译过的会被词典再次匹配，为幂等操作）
        walk(document.body);
      } else {
        // 提示刷新以还原英文
        txt.textContent = '刷新还原';
        setTimeout(function () { location.reload(); }, 400);
      }
    });
  }

  /* ============================================================
   * 七、启动
   * ============================================================ */
  function boot() {
    walk(document.body);
    buildPanel();
    startObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // GitHub 用 Turbo 做前端路由，监听页面切换事件
  ['turbo:load', 'pjax:end', 'turbo:render'].forEach(function (evt) {
    document.addEventListener(evt, function () { scheduleTranslate(document.body); });
  });

  // 兜底：URL 变化检测
  let lastUrl = location.href;
  setInterval(function () {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(function () { scheduleTranslate(document.body); }, 250);
    }
  }, 600);

  // 定期保存机器翻译缓存与用量
  setInterval(function () { MT.saveCache(); }, 30000);
  window.addEventListener('beforeunload', function () { MT.saveCache(); });

  // 注册菜单命令（Tampermonkey 支持时）
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('切换中文 / English', function () {
        ENABLED = !ENABLED;
        store.set('enabled', ENABLED);
        location.reload();
      });
      GM_registerMenuCommand('开关机器翻译（当前：' + (MT_ENABLED ? '开' : '关') + '）', function () {
        MT_ENABLED = !MT_ENABLED;
        store.set('mtEnabled', MT_ENABLED);
        location.reload();
      });
      GM_registerMenuCommand('查看机器翻译用量', function () {
        alert('今日已用：' + MT.used + ' / ' + MT.DAILY_LIMIT + ' 字\n' +
              '缓存条目：' + Object.keys(MT.cache).length + ' 条\n' +
              '接口状态：' + (MT.dead ? '无响应（已停用）' : '正常') + '\n' +
              '开关状态：' + (MT_ENABLED ? '开' : '关'));
      });
      GM_registerMenuCommand('清空机器翻译缓存', function () {
        MT.cache = {};
        MT.saveCache();
        location.reload();
      });
    }
  } catch (e) { /* ignore */ }

})();
