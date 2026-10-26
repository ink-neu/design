/*
 * 朝闻道 · 站点内容配置
 * ------------------------------------------------------------------
 * 这个文件是整站唯一需要改内容的地方。
 * 把图片放进 assets/img/，音频放进 assets/audio/，然后修改下面的路径。
 * 第 4、5 项（作品文案与联系方式）暂留为工作版，等 Morin 后续替换。
 */
window.SITE_CONFIG = {
  meta: {
    title: "朝闻道 — Morin 的视觉档案馆",
    description: "在雨里，造一些会发光的世界。拼贴、绘画与未完成的未来，Morin 的私人视觉作品档案馆。",
    ogImage: "assets/img/og.jpg",
    siteUrl: "https://ink-neu.github.io/design/"
  },

  identity: {
    owner: "MORIN",
    siteName: "朝闻道",
    roman: "ZHAOWENDAO",
    quote: "朝闻道，夕死可矣。",
    quoteFrom: "《论语 · 里仁》"
  },

  entry: {
    image: "assets/img/work-bird.jpg",
    imageAlt: "白鸟、旧钟、蓝色星球与红色颜料组成的超现实拼贴",
    protocol: "SECURE ENTRY / 身份验证",
    eyebrow: "A PRIVATE ARCHIVE BY MORIN",
    title: "朝闻道",
    roman: "ZHAOWENDAO",
    quote: "朝闻道，夕死可矣。",
    deck: "这里收藏我造过的门、梦，与那些还没有名字的世界。在进入之前，请先留下一枚名字。",
    prompt: "访客识别",
    promptEn: "VISITOR ID",
    placeholder: "你的称呼（可留空）",
    verify: "验证身份",
    verifying: "正在核对身份",
    anonymous: "匿名访客",
    verified: "身份确认",
    verifiedEn: "ACCESS GRANTED",
    disclaimer: "这只是一场入场仪式。本站不会记录或上传你的信息。",
    soundTitle: "这夜，要有声音吗？",
    soundDeck: "四首 Weird Inside 的曲子，会依次循环。进入之后，你随时可以在右上角关闭它。",
    soundEyebrow: "AUDIO PROTOCOL / 声音协议",
    soundOn: "带声音进入",
    soundOnEn: "ENTER WITH SOUND",
    soundOnNote: "WEIRD INSIDE / 4 TRACKS",
    soundOff: "安静地进入",
    soundOffEn: "ENTER IN SILENCE",
    soundOffNote: "只保留画面",
    enter: "进入档案馆",
    imageCaption: "作品档案 / 入口",
    imageMeta: "A BIRD IN TIME / 12:00"
  },

  audio: {
    // 四首背景音乐已压缩为适合网页的 AAC (m4a)，按顺序循环。
    // 音乐：Weird Inside。公开发布前请确认你有相应的线上播放授权。
    // 如需替换，把文件放进 assets/audio/，再改下面的列表。
    volume: 0.3,
    tracks: [
      { file: "assets/audio/01-manifold.m4a", title: "Manifold", artist: "Weird Inside" },
      { file: "assets/audio/02-who-knows.m4a", title: "Who Knows?", artist: "Weird Inside" },
      { file: "assets/audio/03-no-more-heroes.m4a", title: "No More Heroes", artist: "Weird Inside" },
      { file: "assets/audio/04-just-ask.m4a", title: "Just Ask", artist: "Weird Inside" }
    ]
  },

  hero: {
    eyebrow: "PRIVATE VISUAL ARCHIVE / 私人视觉档案",
    title: ["在雨里，", "造一些", "会发光的世界。"],
    intro: "我是 Morin。这里收藏我造过的门、梦，以及那些还没有名字的世界。",
    cta: "查看选作",
    sideNote: "VISUAL STORIES / 2024—2026",
    timeNote: "WORLDS / IN PROGRESS",
    slides: [
      {
        image: "assets/img/work-door.jpg",
        alt: "站在彩色碎片之路上，走向海面尽头一扇发光的门",
        title: "门",
        en: "THE DOOR",
        meta: "海面 / 06:17",
        position: "center"
      },
      {
        image: "assets/img/work-bird.jpg",
        alt: "白鸟、旧钟、蓝色星球与红色颜料组成的超现实拼贴",
        title: "白鸟与旧钟",
        en: "A BIRD IN TIME",
        meta: "纸上 / 12:00",
        position: "center"
      },
      {
        image: "assets/img/work-painter.jpg",
        alt: "银白发角色在彩色颜料与模糊字母之间绘制花朵",
        title: "绘者",
        en: "THE PAINTER",
        meta: "颜色 / 未干",
        position: "center"
      },
      {
        image: "assets/img/work-ink.jpg",
        alt: "黑白墨迹穿过 INK 字母，中央留有一滴橙红色",
        title: "INK",
        en: "INK",
        meta: "墨迹 / 无题",
        position: "center"
      }
    ]
  },

  works: {
    eyebrow: "SELECTED WORKS / 选作",
    title: "一些会发光的\n世界。",
    intro: "拼贴、绘画与未完成的世界。每一件作品，都是一扇通往别处的窗。",
    // 4、5 项暂为空：以下标题、年份与描述先用画面内容代填，
    // 等 Morin 提供正式作品信息后替换。
    items: [
      {
        id: "a-bird-in-time",
        title: "白鸟与旧钟",
        en: "A Bird in Time",
        year: "2026",
        category: "综合材料 / 拼贴",
        description: "白鸟、旧钟、地图与蓝色星球在同一张纸上相遇。红色像一次意外，也像一枚印章。",
        image: "assets/img/work-bird.jpg",
        alt: "白鸟与旧钟：鸟、钟表、地球与红色颜料的拼贴",
        ratio: "16 / 10",
        position: "center"
      },
      {
        id: "ink",
        title: "INK",
        en: "INK",
        year: "2026",
        category: "字体实验 / 视觉识别",
        description: "墨迹穿过字母，留下名字的轮廓。黑白之间，只保留一点橙红。",
        image: "assets/img/work-ink.jpg",
        alt: "INK：黑白墨迹与橙红色滴的字体实验",
        ratio: "1 / 1",
        position: "center"
      },
      {
        id: "the-door",
        title: "门",
        en: "The Door",
        year: "2026",
        category: "数字绘画 / 概念场景",
        description: "沿着发光的水面走向一扇门，门后是另一片海与日落。",
        image: "assets/img/work-door.jpg",
        alt: "门：人物沿着彩色碎片路径走向海上的发光门",
        ratio: "4 / 5",
        position: "center"
      },
      {
        id: "the-painter",
        title: "绘者",
        en: "The Painter",
        year: "2026",
        category: "角色插画 / 视觉叙事",
        description: "颜色从衣袖、画笔和空气里溅开。她站在未完成的画面中央。",
        image: "assets/img/work-painter.jpg",
        alt: "绘者：银白发角色在颜料与字母之间作画",
        ratio: "5 / 4",
        position: "center"
      }
    ]
  },

  future: {
    eyebrow: "FORTHCOMING / 未来作品",
    title: "留给\n尚未发生的。",
    lede: "这一格暂时空着。等下一个世界，从雨里长出来。",
    frameLabel: "RESERVED / 预留",
    frameMeta: "NO WORK YET / 等待抵达",
    ghost: "未至"
  },

  discussion: {
    eyebrow: "OPEN TABLE / 讨论",
    title: "留一盏灯，\n给路过的人。",
    intro: "这里会成为一个公开的讨论区。留下一个问题、一个想法，或一段雨夜。",
    boardLabel: "GITHUB ISSUES / 公开讨论",
    boardStatus: "WAITING FOR SIGNAL / 等待接线",
    fallbackKicker: "THE TABLE IS ALMOST OPEN",
    fallbackTitle: "讨论区正在接线。",
    fallbackText: "接上一个公开的 GitHub 仓库后，这里会显示所有话题、回复与参与入口。",
    fallbackCta: "先写信给我",
    fallbackHref: "#contact",
    newTopic: "发起话题",
    emptyTitle: "还没有人开口。",
    emptyText: "第一张椅子，留给你。",
    allTopics: "在 GitHub 查看全部",
    // 已接入 ink-neu/design 的 Issues，使用 discussion 标签筛选话题。
    github: {
      owner: "ink-neu",
      repo: "design",
      label: "discussion",
      limit: 6
    }
  },

  about: {
    eyebrow: "ABOUT THE ARCHIVE / 关于",
    title: "造世界的人，\n也住在世界里。",
    name: "MORIN",
    role: "视觉创作者 / 世界构建者",
    body: [
      "我是 Morin，一个在纸、颜色与数字之间造世界的人。",
      "「朝闻道」是我的私人档案馆。这里没有标准答案，只有一扇扇通往别处的门——关于时间，关于记忆，也关于所有还没有名字的世界。"
    ],
    facts: [
      { label: "身份", value: "视觉创作者" },
      { label: "坐标", value: "雨中某处" },
      { label: "状态", value: "持续建造中" }
    ],
    quote: "朝闻道，夕死可矣。",
    quoteFrom: "《论语 · 里仁》",
    image: "assets/img/work-painter.jpg",
    imageAlt: "银白发角色在彩色颜料与字母之间作画",
    imageCaption: "STUDY / IN PROGRESS",
    imageSide: "THE MAKER IN THE PAINT"
  },

  contact: {
    eyebrow: "CONTACT / 联系",
    title: ["下一次，", "在雨里见。"],
    statement: ["雨是公平的，", "会下给富人，也会下给穷人。"],
    email: "hello@morin.art",
    emailLabel: "写信给我",
    socials: [
      // 填写 href 后才会显示。示例：
      // { label: "Instagram", href: "https://instagram.com/yourname" }
    ],
    availability: "OPEN FOR SELECTED PROJECTS / 接受合作与委托",
    location: "SOMEWHERE IN THE RAIN",
    note: "通常会在两个雨夜内回信。"
  },

  footer: {
    copyright: "© 2026 MORIN. ALL WORLDS RESERVED.",
    credit: "SOUNDTRACK / WEIRD INSIDE · DESIGNED IN THE RAIN",
    backToTop: "回到顶部"
  }
};





