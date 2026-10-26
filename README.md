# 朝闻道 · ZHAOWENDAO

> 在雨里，造一些会发光的世界。

Morin 的私人视觉档案馆。一个无框架、无构建步骤的静态个人网站，包含入场身份仪式、声音选择、四首循环配乐、3 秒作品轮播、未来作品留白、GitHub 讨论区与全屏作品档案。

![朝闻道 · 主站首屏](docs/hero.jpg)

| 入场验证 | 手机端 |
| --- | --- |
| ![入场验证](docs/entry.jpg) | ![手机端首屏](docs/mobile.jpg) |

| 新作 · 留白 | 讨论 · 已开放 |
| --- | --- |
| ![新作留白](docs/future.jpg) | ![讨论区](docs/discussion.jpg) |

---

## 现在就可以看

正式地址：**https://ink-neu.github.io/design/**

GitHub 仓库：**https://github.com/ink-neu/design**

本地预览：**http://127.0.0.1:4173**

本地启动方式：

1. 双击项目根目录里的 **`preview.cmd`**；或
2. 在终端运行：

```powershell
cd chaowendao
python -m http.server 4173 --bind 127.0.0.1
```

然后打开 <http://127.0.0.1:4173>。

> 正式站由 GitHub Pages 自动构建。请通过服务器地址访问，不要直接双击 `index.html`；`file://` 会阻止自定义字体加载。

---

## 当前页面结构

导航顺序：

1. **作品 / WORKS** — 四件现有作品
2. **新作 / FORTHCOMING** — 专门留给未来作品的空房间，目前保持为空
3. **讨论 / OPEN TABLE** — 类似论坛的公开讨论区
4. **关于 / ABOUT**
5. **联系 / CONTACT**

当前已经接好：

- **入场验证**：鸟的拼贴作品作为入口画面，「朝闻道」站名、身份输入、扫描、ACCESS GRANTED 动画。
- **声音选择**：验证后选择「带声音进入」或「安静地进入」。
- **四首背景音乐**：Weird Inside 的 *Manifold*、*Who Knows?*、*No More Heroes*、*Just Ask*，按顺序循环；右上角随时开关。
- **3 秒轮播**：4 张真实作品图自动轮换，可手动切换；打开作品详情或切换到后台时暂停。
- **作品档案**：白鸟、INK、门、绘者四件作品进入非对称作品网格和全屏详情。
- **新作留白**：独立的 FORTHCOMING 区块，目前只有一个「预留 / RESERVED」的空画框。
- **讨论区**：已经接入 `ink-neu/design` 的 GitHub Issues（标签 `discussion`），是真实可用的公开讨论区；当前还没有第一条话题。
- **联系标题**：大标题下现在是「雨是公平的，会下给富人，也会下给穷人。」
- **移动端**：五栏导航、菜单、入口、轮播、作品网格与详情均单独适配。

> 入场验证是「仪式性验证」，不收集、不上传数据，也不是密码保护。需要真实验证码 / 年龄门禁时可以继续加。

---

## 内容状态

你说明的 **第 4、5 项先空着**，所以目前：

- 四件作品的标题（白鸟与旧钟 / INK / 门 / 绘者）、年份、类别和描述，都是按画面内容代填的**工作版**。
- 关于页文案、事实、邮箱 `hello@morin.art`、社交链接仍为占位内容。
- 新作区按你的要求保持为空。
- 讨论区已接入 `ink-neu/design`，但还没有第一条话题；点击「发起话题」会打开带 `discussion` 标签的 GitHub Issue。

---

## 讨论区怎么用

讨论区使用 **GitHub Issues** 作为轻量论坛，已经接在：

- 仓库：`ink-neu/design`
- 标签：`discussion`
- 在站内点击「发起话题」→ 打开 GitHub 新建 Issue 页面（自动带上 `discussion` 标签）
- 已有话题会显示标题、作者、回复数和更新时间；点击任意话题会进入 GitHub 回复

没有话题时，讨论区会显示「还没有人开口。第一张椅子，留给你。」

当前配置：

```js
discussion: {
  // ...
  github: {
    owner: "ink-neu",
    repo: "design",
    label: "discussion",
    limit: 6
  }
}
```

> 这是无数据库方案：登录、发帖和回复都使用 GitHub。若以后希望完全站内回复，需要另外接登录和数据库。

---

## 素材替换

所有内容集中在 **`site.config.js`**，不需要改 HTML。

### 作品图片与文字

四件作品在 `works.items`，同时被首屏轮播和作品网格复用：

| 作品 | 文件 | 当前用途 |
| --- | --- | --- |
| 白鸟与旧钟 | `assets/img/work-bird.jpg` | 入场图 + 首屏 + 作品 01 |
| INK | `assets/img/work-ink.jpg` | 首屏 + 作品 02 |
| 门 | `assets/img/work-door.jpg` | 首屏第一张 + 作品 03 + 联系区背景 |
| 绘者 | `assets/img/work-painter.jpg` | 首屏 + 作品 04 + 关于页 |

项目字段：

```js
{
  id: "a-bird-in-time",
  title: "白鸟与旧钟",
  en: "A Bird in Time",
  year: "2026",
  category: "综合材料 / 拼贴",
  description: "……",
  image: "assets/img/work-bird.jpg",
  alt: "图片描述",
  ratio: "16 / 10",
  position: "center"
}
```

- 项目数量不固定，新增/删除会自动排布。
- `ratio` 可混用 `16 / 10`、`1 / 1`、`4 / 5`、`5 / 4`，保留当前非对称节奏。

### 未来作品区

`future` 配置控制新作区的文案：

```js
future: {
  eyebrow: "FORTHCOMING / 未来作品",
  title: "留给\n尚未发生的。",
  lede: "这一格暂时空着。等下一个世界，从雨里长出来。",
  frameLabel: "RESERVED / 预留",
  frameMeta: "NO WORK YET / 等待抵达",
  ghost: "未至"
}
```

目前没有假作品。以后有新作时，可以把 `future` 区替换为新的作品网格，或者直接把作品加入 `works.items`，把这一区继续留空。

### 背景音乐

四首歌已从原始 320 kbps MP3 压缩为适合网页播放的 **AAC / m4a（112 kbps，约 11.3 MB 合计）**，放在：

```text
assets/audio/
├─ 01-manifold.m4a
├─ 02-who-knows.m4a
├─ 03-no-more-heroes.m4a
└─ 04-just-ask.m4a
```

`site.config.js` 中：

```js
audio: {
  volume: 0.3,
  tracks: [
    { file: "assets/audio/01-manifold.m4a", title: "Manifold", artist: "Weird Inside" },
    { file: "assets/audio/02-who-knows.m4a", title: "Who Knows?", artist: "Weird Inside" },
    { file: "assets/audio/03-no-more-heroes.m4a", title: "No More Heroes", artist: "Weird Inside" },
    { file: "assets/audio/04-just-ask.m4a", title: "Just Ask", artist: "Weird Inside" }
  ]
}
```

- 按数组顺序播放，每首结束后淡出并切到下一首，最后循环回第一首。
- 想换顺序、删歌或只留一首，直接改数组。
- 建议上传 **m4a / mp3 / ogg**；不要放未压缩 WAV。
- 右上角开关的 `aria-label` 会显示当前曲名。

### 关于 / 联系

- 关于页图片目前是 `work-painter.jpg`，修改 `about.image` 即可替换成个人照 / 工作照。
- 联系区背景目前是 `work-door.jpg`，在 `index.html` 的 `.contact__bg` 中。
- 联系标题与大标题下一行：

```js
contact: {
  title: ["下一次，", "在雨里见。"],
  statement: ["雨是公平的，", "会下给富人，也会下给穷人。"],
  // ...
}
```

- 修改 `contact.email`、`about.body`、`about.facts`。
- `contact.socials` 默认为空，填写后才显示。

### 发布前一定要改

- [ ] `contact.email`：当前是占位邮箱 `hello@morin.art`。
- [x] `meta.siteUrl`：已设为 `https://ink-neu.github.io/design/`。
- [ ] `meta.title` / `meta.description`。
- [ ] 四件作品的正式标题、年份、职责、描述。
- [ ] 关于页个人介绍、事实与照片。
- [ ] 社交链接、合作状态。
- [x] 讨论区 GitHub 仓库：`ink-neu/design`，标签 `discussion`。
- [ ] 确认 Weird Inside 音乐的公开播放授权。

---

## 部署

纯静态站，不需要构建或后端。

### GitHub Pages（当前）

- 仓库：`ink-neu/design`
- 分支：`main` / root
- 正式地址：**https://ink-neu.github.io/design/**
- 已启用 `.nojekyll`，推送 `main` 后自动重新构建

### 其他平台

也可以部署到 Vercel、Netlify Drop 或 Cloudflare Pages；所有路径都是相对路径，可放在域名根目录或子目录。

---

## 文件结构

```text
chaowendao/
├─ index.html               页面结构
├─ styles.css               全站样式 / 动效 / 响应式
├─ app.js                   入场、轮播、音乐、讨论区、作品详情
├─ site.config.js           ★ 所有内容与 GitHub 讨论配置
├─ serve.mjs                本地静态服务器
├─ preview.cmd              双击启动本地预览
├─ docs/                    README 预览图
├─ assets/
│  ├─ img/                  作品图、分享图、噪点与图标
│  ├─ audio/                四首 m4a 背景音乐
│  └─ fonts/                英文字体与 OFL 授权
└─ README.md
```

字体：Cormorant Garamond 与 IBM Plex Mono，SIL Open Font License，授权全文在 `assets/fonts/`。

---

## 技术备注

- 无框架、无依赖、无构建步骤；图标全部内联 SVG。
- 音乐使用原生 `<audio>` + Media Session 元数据；首屏不预载音频，用户选择声音后才开始加载。
- 讨论区通过 GitHub REST API 读取公开 Issues，不在站内保存任何访客数据。
- 遵守 `prefers-reduced-motion`：减少动效时关闭自动轮播和大部分装饰动画。
- 作品详情使用原生 `<dialog>`，支持 Esc 关闭与键盘左右切换。
- 没有后端，因此入场验证只存在于浏览器前端，不能作为真正的权限控制。
