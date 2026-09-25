// ==UserScript==
// @name         GitHub 界面汉化（北汐版）
// @name:en      GitHub UI Chinese Localization
// @namespace    https://github.com/seobeixi
// @version      1.0.0
// @description  把 GitHub 的英文界面翻译成中文。手工维护的精准词典，不会把 Commit 翻成"犯罪"。支持导航栏、仓库页、新建仓库页、Settings、Pages 设置等高频场景。
// @author       seobeixi
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
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
    'input[type="text"]',
    'input[type="password"]',
    'input[type="email"]',
    'input[type="search"]',
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

  function translatableTextNode(node) {
    if (!node || !node.nodeValue) return false;
    const t = node.nodeValue.trim();
    if (!t) return false;
    // 只处理含字母的、长度合理的文本
    if (t.length > 160) return false;
    if (!/[A-Za-z]/.test(t)) return false;
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
    return false;
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.closest && el.closest(SKIP_SELECTOR)) return;

    // placeholder
    const ph = el.getAttribute && el.getAttribute('placeholder');
    if (ph) {
      const zh = lookup(ph);
      if (zh !== null) el.setAttribute('placeholder', zh);
    }
    // title
    const ti = el.getAttribute && el.getAttribute('title');
    if (ti) {
      const zh = lookup(ti);
      if (zh !== null) el.setAttribute('title', zh);
    }
    // aria-label
    const al = el.getAttribute && el.getAttribute('aria-label');
    if (al) {
      const zh = lookup(al);
      if (zh !== null) el.setAttribute('aria-label', zh);
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
      '  .btn{display:flex;align-items:center;gap:6px;background:#1f6feb;color:#fff;',
      '       border:none;border-radius:999px;padding:9px 15px;font-size:13px;cursor:pointer;',
      '       font-family:-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;',
      '       box-shadow:0 3px 12px rgba(0,0,0,.28);transition:.18s;font-weight:500}',
      '  .btn:hover{background:#388bfd;transform:translateY(-1px)}',
      '  .btn.off{background:#30363d;color:#8b949e}',
      '  .dot{width:7px;height:7px;border-radius:50%;background:#3fb950;flex-shrink:0}',
      '  .btn.off .dot{background:#6e7681}',
      '</style>',
      '<button class="btn" title="点击切换中英界面">',
      '  <span class="dot"></span><span class="txt">中文</span>',
      '</button>'
    ].join('');

    document.body.appendChild(host);

    const btn = sh.querySelector('.btn');
    const txt = sh.querySelector('.txt');
    const dot = sh.querySelector('.dot');

    function refresh() {
      btn.classList.toggle('off', !ENABLED);
      txt.textContent = ENABLED ? '中文' : 'English';
      btn.title = ENABLED ? '当前：中文界面，点击切回英文' : '当前：英文界面，点击切换中文';
    }
    refresh();

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

  // 注册菜单命令（Tampermonkey 支持时）
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('切换中文 / English', function () {
        ENABLED = !ENABLED;
        store.set('enabled', ENABLED);
        location.reload();
      });
    }
  } catch (e) { /* ignore */ }

})();
