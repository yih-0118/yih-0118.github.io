---
description: 第一次當助教好興奮
title: 一日資訊體驗營writeup
pubDate: 2024/6/3 11:54:15
tags:
  -  writeup
categories:
    - Daily
---

## welcome 0x1

### [今日簡報]

會發現有給你一個pdf檔案
那就是
~~其實是講師跑錯分部
破大房(ＰＤＦ)~~
FLAG：`PDF`

### [welcome]

就是welcome
![image](https://hackmd.io/_uploads/S1oGypcEC.png)
FLAG:`TILEA{h3lLo_w0r1D}`

---

## Linux 0x1

### [knock knock]

進去看到目錄下面就可以了
Linux指令：`ls`
![image](https://hackmd.io/_uploads/BJvhkpcN0.png)
FLAG:`TILEA{l5}`

### [meow meow]

Linux指令中cat就是把檔案的東東文字之類的輸出出來
Linux指令：`cat flag`
![image](https://hackmd.io/_uploads/SJ2-epcNC.png)
FLAG:`TILEA{w3lc0Me_CtF_w0r1D}`

### [ninja file!]

題目說有一個隱藏的檔案，一般的`ls`指令是無法完全顯示出來的
要用`ls -al`所有東東都可以出來
![image](https://hackmd.io/_uploads/HJaFeTqER.png)
FLAG:`TILEA{shhhh......}`

### [時空跳躍]

```
../../../../../../../../../../../

請問這樣往前跳幾的目錄？
```

會發現有11個`/`
所以
FLAG:`11`

### [權限遊戲]

用wget [網址] -O [你想要的檔案名稱]
要提升權限的話
`chmod +x [檔案名稱]`
`./執行檔案的檔案`
![image](https://hackmd.io/_uploads/H1UuWpcE0.png)
FLAG:`TILEA{th1s_1s_6_f169}`

### [考古學家]

要找到一大篇文章中的幾個特定字
可以此用grep指令
用法：`gerp [關鍵字]`
![image](https://hackmd.io/_uploads/HkOlfac4R.png)
FLAG:`TILEA{g00g1e.c0M3}`

### [h1de\_4nD\_s33k]

題目告訴你opt之中有一個檔案叫做secret
Linux指令：`find /opt secret`
知道路徑後直接cat出來
![image](https://hackmd.io/_uploads/SyDqG69VR.png)
FLAG:`TILEA{U...c4Nt!f1nDm3!!!}`

### [永遠不會放棄！]

nc指令：可以連線至該伺服器之類的
在連線之後
會有never gonna give you up 的動畫
跑完之後就有了
![image](https://hackmd.io/_uploads/BJdQXacV0.png)
FLAG:`111tttft11TILEA{n3v3r_g0nn6_g1v3_y0u_up}`

### [SUS service]

用`netstat -an`去看那個有什麼服務在開
![image](https://hackmd.io/_uploads/Sy7Km6940.png)
會發現有一個:80
就代表底下有一個網頁在跑
然後就有了
![image](https://hackmd.io/_uploads/SyPCmTq4C.png)
FLAG:`TILEA{Am0n9_5uS}`

### [鎖匠]

![image](https://hackmd.io/_uploads/rkxb4a5VC.png)
其實我們只要`strings`一下就出來了
![image](https://hackmd.io/_uploads/H1HEN69N0.png)
FLAG:`TILEA{t0d6y_w3ath3r_g00d}`

---

## Crypto 0x1

### [Binary to ASCII]

![image](https://hackmd.io/_uploads/S19vVa94A.png)
丟到這個網頁就可以轉換了
https://www.rapidtables.com/convert/number/binary-to-ascii.html
![image](https://hackmd.io/_uploads/SJ5q46cNR.png)
FLAG:`TILEA{th1s1sb1n6ry}`

### [Hex to ASCII]

丟到這個網頁就可以了
https://www.rapidtables.com/convert/number/hex-to-ascii.html
![image](https://hackmd.io/_uploads/ryYRV694A.png)
FLAG:`TILEA{hect_or_tex}`

### [Base64]

==Base64是一種格式==
[用這個網頁解](https://www.base64decode.org/)
![image](https://hackmd.io/_uploads/SJizBT94A.png)

### [凱薩沙拉]

這是凱薩密碼
==這就是加密了==
https://www.dcode.fr/caesar-cipher
![image](https://hackmd.io/_uploads/r1cPrTqE0.png)
FLAG:`TILAE{caesar_salad_is_good_to_eat}`

---

## web 0x1

### [機器人點踢叉踢]

可以去看下面有什麼
進到`/robots.txt`
![image](https://hackmd.io/_uploads/BJyTBp54R.png)
就有了
FLAG:`Disallow: /search/TILEA{r0b0ts_d0t_txt}`

### [Admin Panel]

打開magic看一下
正常的sql injection無法
目標是把password註釋掉
![image](https://hackmd.io/_uploads/H1A7Lp940.png)
這樣就可以了
FLAG:`TILEA{OsGa' OR 1=1; -- #}`

### [貓咪商店]

我們需要購買`FLAG`但是錢又不夠多
而且沒有按鈕
![image](https://hackmd.io/_uploads/Sk0OL69EA.png)
可知evil cat是5431
那FLAG就是在5430的地方
在購買的時候找到input
修改vaule就好
![image](https://hackmd.io/_uploads/r1DRLpq4R.png)
FLAG:`TILEA{c4T_m30w_m30W}`

### [DNS Lookup Tool 🔍]

我是先去看原始碼發現

```php
<?php
isset($_GET['source']) and die(show_source(__FILE__, true));
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DNS Lookup Tool | Baby</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
</head>

<body>
    <section class="section">
        <div class="container">
            <div class="column is-6 is-offset-3 has-text-centered">
                <div class="box">
                    <h1 class="title">DNS Lookup Tool 🔍</h1>
                    <form method="POST">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" name="name" placeholder="example.com" id="hostname" value="<?= $_POST['name'] ?? '' ?>">
                            </div>
                        </div>
                        <button class="button is-block is-info is-fullwidth">
                            Lookup!
                        </button>
                    </form>
                    <br>
                    <?php if (isset($_POST['name'])) : ?>
                        <section class="has-text-left">
                            <p>Lookup result:</p>
                            <pre><?= shell_exec("host '" . $_POST['name'] . "';") ?></pre>
                        </section>
                    <?php endif; ?>
                    <hr>
                    <a id="magic">Magic</a> | <a href="/?source">Source Code</a>
                </div>
                <article class="message is-link is-hidden is-size-4" id="hint">
                    <div class="message-body is-family-monospace">
                        host '<span class="has-text-danger" id="command"></span>';
                    </div>
                </article>
            </div>
        </div>
    </section>

    <script>
        magic.onclick = () => hint.classList.toggle("is-hidden");
        window.onload = hostname.oninput = () => command.textContent = hostname.value;
    </script>
</body>

</html>
```

可以用$
然後導到有FLAG的東東就可以了
在用cat輸出出來
輸入:`'$(cat /flag\*)'`
![image](https://hackmd.io/_uploads/SJjDv65E0.png)
FlAG:`TILEA{h4ck3R!c0mm3D!!}`

### [cookie master]

先在Inspect找到帳密
![image](https://hackmd.io/_uploads/HJV3DpcNA.png)
登入後發現我被騙了
![image](https://hackmd.io/_uploads/rysTPTc4A.png)
我們進入到application中把cookie的auth_method改成空值
![image](https://hackmd.io/_uploads/SJXZ_p9NC.png)
然後刷新一下就好了
然後就出來了
![image](https://hackmd.io/_uploads/B1y7KpqE0.png)
FLAG:`TILEA{c00K1e_M4St3R}`
