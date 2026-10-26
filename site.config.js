/*
 * 朝闻道 · 站点内容配置
 * ------------------------------------------------------------------
 * 这个文件是整站唯一需要改内容的地方。
 * 把图片放进 assets/img/，音频放进 assets/audio/，然后修改下面的路径。
 * 第 4、5 项（作品文案与联系方式）暂留为工作版，等 Morin 后续替换。
 */
window.SITE_CONFIG = {
  meta: {
    title: "朝闻道 — to the Endless nameless.",
    description: "在雨里，造一些会发光的世界。拼贴、绘画、来稿与未完成的未来，一个向所有无名者敞开的视觉档案馆。",
    ogImage: "assets/img/og.jpg",
    siteUrl: "https://ink-neu.github.io/design/"
  },

  brand: {
    signature: "to the Endless nameless."
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
    eyebrow: "TO THE ENDLESS NAMELESS",
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
        prompt: "A surrealist mixed-media collage on aged cream paper: a white goose with blue contour lines, a vintage clock face, a cracked blue globe, red pigment splashes, botanical and anatomical fragments, a small silver fish on a plate, torn typography, muted teal and vermilion palette, quiet cinematic still life, fine paper grain, high detail.",
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
        prompt: "An editorial typographic experiment: the word INK in heavy black letters dissolving into glossy black ink, a single drop of vermilion, off-white paper, high contrast, macro ink texture, art direction poster, minimal composition.",
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
        prompt: "A lone figure in a dark suit walking across a path of reflective mosaic shards toward a glowing rectangular doorway standing in the sea, a huge low sun on the horizon, teal and burnt orange sky, retro-futurist cinematic scene, atmospheric, wide shot.",
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
        prompt: "Anime-inspired editorial illustration of a silver-haired painter in flowing white robes, surrounded by suspended paint strokes and blurred typography, holding a brush that blooms into a flower, dynamic pose, saturated cyan and coral palette, soft grain, high detail.",
        alt: "绘者：银白发角色在颜料与字母之间作画",
        ratio: "5 / 4",
        position: "center"
      }
    ]
  },

  fragment: {
    eyebrow: "LIVE FRAGMENTS / 作品切片",
    title: "把一张画，\n拆回一句话。",
    text: "每四秒，窗口会裁切到下一件作品。点击画面，它会碎成像素，露出生成它的提示词。",
    hint: "点击拆解 / CLICK TO REVEAL PROMPT",
    promptLabel: "PROMPT / 提示词",
    copy: "复制提示词",
    copied: "已复制",
    close: "返回画面",
    interval: 4200
  },

  openCall: {
    eyebrow: "OPEN CALL / 来稿",
    title: "不只属于我。\n把你也造的世界，放进来。",
    intro: "「朝闻道」不只收藏我的世界。这里也为别人留一盏灯：把你造过的画面投进来，让它在雨里被看见。",
    note: "来稿经馆主审核后收录。你的名字与提示词会一起保留。",
    form: {
      eyebrow: "SUBMISSION / 投稿",
      title: "投递一件作品",
      intro: "选择一张图，填下它的名字和提示词。提交后会打开 GitHub 投稿页；把图片附在正文里，经审核后收录。",
      choose: "选择图片 / DROP AN IMAGE",
      change: "换一张图片",
      author: "作者",
      workTitle: "作品名",
      year: "年份",
      prompt: "提示词 / 作品说明",
      contact: "联系方式（可选）",
      submit: "在 GitHub 继续投稿",
      localNote: "图片只在本机预览，不会上传到本站服务器；正式图片需要在 GitHub 投稿页中附加。",
      emailFallback: "没有 GitHub？发邮件投稿",
      status: "投稿页已打开。请把图片拖进正文，然后提交。",
      error: "请先选择图片，并填写作者、作品名与提示词。"
    },
    github: {
      owner: "ink-neu",
      repo: "design",
      submissionLabel: "submission",
      acceptedLabel: "accepted",
      limit: 12
    },
    gallery: {
      eyebrow: "COMMUNITY / 已收录",
      emptyTitle: "还没有收录来稿。",
      emptyText: "第一件来自别处的世界，会出现在这里。"
    }
  },

  auth: {
    supabaseUrl: "https://roclabcyhwcseswvonrx.supabase.co",
    supabaseKey: "sb_publishable_g5Ftk5JFEBv5bYyKV5mliQ_9BFicj4V",
    siteUrl: "https://ink-neu.github.io/design/",
    defaultName: "Nameless.",
    defaultAvatarStyle: "rain",
    avatarStyles: [
      { id: "rain", label: "雨", bg: "#041b1d", fg: "#71ded6", accent: "#ff7b32" },
      { id: "ember", label: "烬", bg: "#24100a", fg: "#ffb36d", accent: "#ff7b32" },
      { id: "paper", label: "纸", bg: "#e8dfcf", fg: "#253a38", accent: "#c85c2a" },
      { id: "moss", label: "苔", bg: "#122018", fg: "#a6d8a0", accent: "#ffd27a" },
      { id: "violet", label: "夜", bg: "#191426", fg: "#c4b5fd", accent: "#71ded6" },
      { id: "mono", label: "白", bg: "#0b0f10", fg: "#d6d6d6", accent: "#ffffff" }
    ]
  },

  comments: {
    eyebrow: "OPEN TABLE / 留言",
    status: "OPEN TABLE / 留言开放",
    intro: "留下一个问题、一个想法，或一段雨夜。匿名也能发言；想留下名字时，再登录。",
    placeholder: "写下你想留下的……",
    submit: "发布留言",
    submitting: "正在发布…",
    emptyTitle: "还没有人开口。",
    emptyText: "第一张椅子，留给你。",
    countSuffix: "MESSAGES",
    guestNote: "匿名发言 · 名字会显示为 Nameless.",
    anonymousNote: "你正以 Nameless. 发言。登录后可保留自己的名字。",
    memberNote: "以你的名字发言。",
    login: "登录 / 留下名字",
    upgrade: "登录，保留这个名字",
    loading: "正在读取留言…",
    error: "留言暂时读不到，请稍后再试。",
    postError: "发布失败，请稍后再试。",
    posted: "留言已发布。",
    delete: "删除",
    confirmDelete: "删除这条留言？",
    refresh: "刷新",
    genderLabels: {
      "": "不填写",
      female: "女性",
      male: "男性",
      nonbinary: "非二元",
      other: "其他"
    },
    account: {
      eyebrow: "ACCOUNT / 账号",
      guestTitle: "留下你的名字。",
      guestText: "匿名也可以直接留言，名字会显示为 Nameless.。登录后会得到一个可以保存名字、代码头像和性别的账号。",
      emailLabel: "邮箱",
      emailPlaceholder: "you@example.com",
      sendLink: "发送登录链接",
      sending: "正在发送…",
      sent: "登录链接已发送，请去邮箱点击。",
      anonymous: "先以 Nameless. 继续",
      anonymousStatus: "你现在是 Nameless.，可以直接留言。",
      anonymousTitle: "Nameless.",
      anonymousText: "这是一个匿名身份。登录后，名字和留言都会保留。",
      upgradeTitle: "保存你的账号",
      upgradeText: "输入邮箱，把这个匿名身份升级成你的账号。",
      upgradeButton: "发送保存链接",
      upgradeSent: "确认链接已发送，请去邮箱点击。",
      profileTitle: "你的账号",
      nameLabel: "名字",
      namePlaceholder: "你的名字",
      genderLabel: "性别（可选）",
      avatarLabel: "代码头像",
      reroll: "换一组代码",
      save: "保存资料",
      saving: "正在保存…",
      saved: "资料已保存。",
      logout: "退出登录",
      close: "关闭",
      loginError: "登录失败，请检查邮箱后再试。",
      saveError: "保存失败，请稍后再试。"
    }
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
    intro: "留下一个问题、一个想法，或一段雨夜。匿名也能发言；想留下名字时，再登录。",
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
    copyright: "© 2026 TO THE ENDLESS NAMELESS. ALL WORLDS RESERVED.",
    credit: "TO THE ENDLESS NAMELESS · SOUNDTRACK / WEIRD INSIDE",
    backToTop: "回到顶部"
  }
};





