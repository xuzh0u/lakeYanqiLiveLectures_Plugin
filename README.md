# README

> 感谢原作者前辈整理校园网直播端的原文件!

> 本仓库文件仅供学习使用, 如有侵权, 请联系我删除, 感谢您的理解.

- 自行安装好 SilverLight 插件
- 在**该校该校区**的**校园无线网环境**内用 IE 浏览器或其他浏览器的 IE 模式打开 htm 文件
- 根据提示加载老版本的播放器插件 (allow blocked content)
- 在网页左上角下拉选框中选择相应的教室

## Tips

- J[a]-[bbb] = Jiao [a] 楼 [bbb] 教室
- X[a]-[bbb] = Xueyuan [a] [bbb] 教室

## 项目结构

```
|- lakeYanqiLiveLecture_files/  # 项目依赖的 js 文件
|- channelid_ref.csv            # 教室对应 id 的简表
|- lakeYanqiLiveLecture.htm     # 主要使用的本地 htm 文件
|- ReachPlayer.xap              # 项目依赖的文件
|- README.md                    # 项目说明文件
|- Silverlight_x64.exe          # 可用的 SilverLight 安装文件
```

## TODOs

- 教室列表不完整, 亟待补充 (本地可按需将其他教室的 id 和说明按照 htm 文件中的相同格式添加到 option 中), 欢迎通过 PR/issue 增加相关信息
