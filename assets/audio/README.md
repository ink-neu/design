# 背景音乐

这里已经放入四首 **Weird Inside** 的曲子，均为原始 320 kbps MP3 转成的网页版 AAC / m4a（112 kbps）：

| 顺序 | 文件 | 曲名 |
| --- | --- | --- |
| 1 | `01-manifold.m4a` | Manifold |
| 2 | `02-who-knows.m4a` | Who Knows? |
| 3 | `03-no-more-heroes.m4a` | No More Heroes |
| 4 | `04-just-ask.m4a` | Just Ask |

在根目录的 `site.config.js` 中控制音量、顺序与曲目：

```js
audio: {
  volume: 0.3,
  tracks: [
    { file: "assets/audio/01-manifold.m4a", title: "Manifold", artist: "Weird Inside" },
    // ...
  ]
}
```

音乐会在用户选择「带声音进入」后按顺序循环播放。公开发布前请确认已获得线上公开展示/播放授权。
