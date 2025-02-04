---
description: OSINT根本是通靈
title: FhCTF writeup
pubDate: 2024/6/8 22:11:59
tags:
  -  writeup
categories:
    - Daily
---
## 前言
比賽成果紀錄
![ctfd.fhh4ck3rs.taipei_team](https://hackmd.io/_uploads/SJkl6WGB0.png)

![ctfd.fhh4ck3rs.taipei_scoreboard](https://hackmd.io/_uploads/Hyv7p-zSC.png)

# Writeup

## Web

### [穿越檔案的旅人]
題目提示到：**「flag 在 /flag.txt」**
```
server {
    listen 80;
    server_name _;

    location / {
        root /html;
        index index.html index.htm;
    }

    location /img {
        alias /images/;
    }
}
```
發現可以用img作為跳板
改一下url: `https://travaling.fhh4ck3rs.taipei/img../flag.txt`
> FLAG:`FhCTF{how_1_tr4v3rs4l_7h3_w0rld!}`

---

### [A Web]
~~我還是diesearch去看~~
![image](https://hackmd.io/_uploads/H1Tr1eGH0.png)

有robots.txt誒

先找到第一段：`FhCTF{1aSy_t0_f0`

有一個登入畫面，可以用sql injection

username = `admin`

password = `'OR 1=1 --`

第二段`UnD_A_f1AG_c`

登入成功後看到

![image](https://hackmd.io/_uploads/ryu8eezBC.png)

在`isAdmin`中是base64格式

只要改成`True`的base64格式 -> `VHJ1ZQ==`

![image](https://hackmd.io/_uploads/SkCEGxGBA.png)

> FLAG:`FhCTF{1aSy_t0_f0UnD_A_f1AG_cAn_u_f1ND_1T}`
> 
---

### [Gotcha]
會先發現這是git洩漏
利用DotGit擴充去把zip下載下來
再把丟到SourceTree去看歷史紀錄
![image](https://hackmd.io/_uploads/rJ-fHgMrC.png)

> FLAG:`FhCTF{I_9iT_!7}`
---

### [BMI 計算機]
去看源碼，會發現有`eval()`可以鑽

![image](https://hackmd.io/_uploads/r1uCreGrR.png)

先把身高體重用burp suite攔下來

![image](https://hackmd.io/_uploads/SJrKLxMrA.png)

會發現是用strings傳送

把它改成
`{ "string": "require('fs').readFileSync('flag', 'utf8')"}`

就可以執行了

![image](https://hackmd.io/_uploads/HJcp8efrR.png)

> FLAG:`FhCTF{bReAk_bM1_cAcu1aT0r}`

---

### [Login]
用githacker抓下來後再用source tree去看
![image](https://hackmd.io/_uploads/By0GPbESR.png)

---

>FhCTF{r3m0ve_fr0m_F1LE_6U7_in_Rep0}
### [上鎖了！？]
~~先用dirsearch再說~~
![image](https://hackmd.io/_uploads/r1kPvxMHR.png)
得知有admin，去看main.js發現有`#secret`
![image](https://hackmd.io/_uploads/Skw2vefB0.png)
我們知道在flag.txt，但我們沒有權限進去，會被403
所以要用burp suite攔下來後加入referer到locked.fhh4ck3rs.taipei就好
![image](https://hackmd.io/_uploads/rJ36DgzrR.png)
request只要這樣就好
```
GET /admin/flag.txt HTTP/2
Host: locked.fhh4ck3rs.taipei
Referer: http://locked.fhh4ck3rs.taipei
```
![image](https://hackmd.io/_uploads/SJX1KlzHA.png)

> FLAG:`FhCTF{4n_unl0cked_l0ck_15_s7up1d}`

---

### [Information]
~~看到連結無腦先用dirsearch~~
![image](https://hackmd.io/_uploads/H1T-0JGSA.png)
真的有好東西誒，`/redoc`
到目錄下去看就有了
![image](https://hackmd.io/_uploads/Bk-DRyfrA.png)
> FLAG:`FhCTF{Y0u_r3411y_n33d_t0_l0ck_y0ur_API_d0cum3n75}`


---
### [Information Ultimate]
~~老生常談，先用dirsearch~~
會發現有`/docs`可以進去
有api可以玩
先到No One Can Pass
隨便打，會跳出`access-token`而且還是`jwt`格式的
![image](https://hackmd.io/_uploads/SkHD6ezSC.png)
我們要用`jwt-cracker`暴力解密鑰
![image](https://hackmd.io/_uploads/r1aiplfHA.png)
發現密鑰是`secret`
那這樣token就出來了
![image](https://hackmd.io/_uploads/BkIqAgfSC.png)
得到flag~~~~
![image](https://hackmd.io/_uploads/B1LCAxzHC.png)
FLAG:`FhCTF{N3w_ch4ll3ng3_1n_JWT_c95ceec4ea7d5414f10853e616da8e521f957e7627368a641e46fe74720b53b1}`

---
### [Information Revenge]
~~我仍然先用dirsearch~~
有docs可以進去
但是要帳密
![image](https://hackmd.io/_uploads/SyN_WbfSA.png)

題目提到，以他的名字作為擔保，username就是CXPh031x

![image](https://hackmd.io/_uploads/rylLWbzHR.png)
先用burp suite攔下來看，發現是用`username:password`的方式驗證
而且還套用base64格式
![image](https://hackmd.io/_uploads/BJUgzWGH0.png)
知道這些後，~~就可以爆破了~~

![image](https://hackmd.io/_uploads/r1bSXZfHA.png)
這樣就知道密碼是`Password1`了
能進到api那邊直接拿到flag
> FLAG:`FhCTF{W34k_p455w0rd_m4y_c4u53_d4ng3r}`


---
### [Baking Store]
發現是要等旗子烤好
![image](https://hackmd.io/_uploads/Hk3zfeQrR.png)
我們先用burp suite攔下來，有看到一串特殊的cookie
用ciphey看，發現是這樣的加密方式
![image](https://hackmd.io/_uploads/HJnYGl7r0.png)
再把時間改成0秒就好摟囉
![image](https://hackmd.io/_uploads/HJ5N7lXS0.png)
![image](https://hackmd.io/_uploads/BJUHQe7rC.png)
> FLAG:`FhCTF{Cl13nt_s1d3_auth0r1z3d_1s_d4ng3r!!!!}`

---
### [Baking Store Revenge]
進去會有一個登入頁面，先隨便註冊後再登入看看
![image](https://hackmd.io/_uploads/HJXbEe7SC.png)
看看能不能修改url找到flag
在`65536`的地方
![image](https://hackmd.io/_uploads/rypN4eQHR.png)

> FLAG:`FhCTF{IDOR_1s_t3rr4bl3_w1th_n0_l1m173d...}`

---
## Forensics

### [MitM 攻擊者]
下載檔案
丟進wireshake
從題目中 **不要用不安全的協定**
去找最特別的協定
![image](https://hackmd.io/_uploads/BytTTgMrA.png)
就找到flag了
>fhsfctf{w1ll_a1w4y5_pr3v4il}


---
### [Hex Dumb Dumb]
題目給你一個`.chal`檔案，但其實他是張圖片
![HexDumbDumb](https://hackmd.io/_uploads/Bksp6ZGB0.jpg)
把這張strings出來看，把strings最後部分拿來看
抓")"上面
```
FFFFFF
))))))
hhhhhh
))))))
HHHH
C))C
TTTTTt
)))))t
FFFFFF
))))))
)){){)
HHHHHH
))))))
hhhhhh
hhhhhh
##3###
d))d
DDDDdd
DDDD))
u)))
UUUU
)))m
MMMM
pppppp
))))))
PPPP
nnnn
))))
NNNN
##3###
##3###
d))d
DDDDdd
DDDD))
)))m
MMMM
0000
0))))0
))))))
))))
)))r
##3###
##3###
C))C
UUUUU
U)))))
uuuuuu
uuuuu
RRRRRR
))))))
##3###
]})})]

```
> FLAG:`FhCTF{H3xdump_n33d_m0r3_S3CUR3}`

---
### [Do you know packet?]
打開題目封包後發現跟usb有關
之後到這邊載工具
https://github.com/horosora/wireshark-usb-keyboard-analyzer/tree/master
載好後丟到wireshark
再用wireshark打開封包並使用工具
得到flag
![image](https://hackmd.io/_uploads/HJqWzZNHC.png)

> FLAG:`FhCTF{a_S1mp13_USB_C@p7uRe}`

---
## Reverse

### [BabyReverse]
去用ida去看print_flag()
![image](https://hackmd.io/_uploads/HkbHi-zSA.png)

```python
v3 = [57, 23, 60, 43, 57, 4, 38, 79, 10, 32, 30, 13, 76, 32, 29, 75, 29, 6, 32, 13, 76, 9, 76, 13, 74, 76, 32, 26, 17, 24, 78, 17, 76, 76, 13, 91, 90, 89, 2]
s = ''.join(chr(byte ^ 0x7F) for byte in v3)
print(s)
```
> FLAG:`FhCTF{Y0u_ar3_b4by_r3v3r53_eng1n33r$%&}`

---
### [Secret Message]
先用ida打開
![image](https://hackmd.io/_uploads/SyQJmWVrA.png)
會發現說雖然他用rand
但因為srand有給種子碼，所以基本上每次執行的時候
隨機數都是相同的
然後有給flag被加密後的檔案
![image](https://hackmd.io/_uploads/Sk9NQZNr0.png)

所以可以來暴力解
把可視字元當作flag
之後執行`enc flag`
如果enc後的結果等於751
那就記錄下來
然後繼續往下跑
如果enc後的結果等於707
繼續記錄下來
到最後就會有flag了

- solve
```python
from pwn import *
seed = [751, 707, 513, 755, 627, 1036, 1005, 109, 682, 674, 252, 671, 247, 259, 439, 526, 318, 574, 742, 135, 709, 731, 495, 872, 436, 827]
key = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
ans = ""
origin = ""
for i in range(len(seed)):
    for j in key:
        origin = ans
        origin = origin + j
        with open("flag", "w") as file:
            file.write(origin)

        r = process(["./enc", "flag"])
        gg = r.recvall()
        nums = [int(x) for x in gg.decode().split()]
        if nums[i] == seed[i]:
            ans+=j
            break
    
print(ans)
```

---
### [BabyReverse Revenge]
去用ida去看print_flag()
![image](https://hackmd.io/_uploads/Hk4KaJXS0.png)
v9為加密數值，v4=127是XOR鑰匙，v5=35解密的字串長度
用 for 嘗試0~255 分配記憶體儲存解密字串
用for進行 XOR 運算之後printf每個可能
```cpp
#include <stdio.h>
#include <stdlib.h>

void print_flag() {
    int v9[] = {121, 87, 124, 107, 121, 68, 104, 87, 70, 96, 124, 8, 121, 12, 77, 76, 96, 
                83, 14, 84, 12, 96, 77, 12, 73, 12, 81, 88, 12, 17, 17, 27, 0, 27, 66};
    int length = 35;

    for (int key = 0; key < 256; ++key) {
        char *s = (char *)malloc(length + 1);
        if (!s) {
            printf("Memory allocation failed\n");
            return;
        }

        for (int i = 0; i < length; ++i) {
            s[i] = key ^ v9[i];
        }
        s[length] = '\0';

        printf("Key %d: %s\n", key, s);

        free(s);
    }
}

int main() {
    print_flag();
    return 0;
}
```
![image](https://hackmd.io/_uploads/HJP6RkmHA.png)
>Flag:`FhCTF{Why_C7F3rs_l1k3_r3v3ng3..$?$}`

---
### [真。逆向工程]
其實找到print_flag function後照他的用下來就出來了
```cpp
#include <iostream>
#include <cstring>
#include <cstdint>
using namespace std;
void print_flag() {
    int i, j, k;
    uint64_t v4[7];
    uint64_t v6[13];
    char v7[10];
    char result[57]; 
    v6[0] = 0x30602D1979572B0BLL;
    v6[1] = 0x44191E0B2C405607LL;
    v6[2] = 0x1B777409180F6D6FLL;
    v6[3] = 0x2A0F022A52672416LL;
    v6[4] = 0x601B25524E775D7DLL;
    v6[5] = 0x2C2D25635B640649LL;
    v6[6] = 0x527A4B6640082160LL;
    v6[7] = 0x71E2064576E5B5BLL;
    v6[8] = 0x342B373625031C69LL;
    v6[9] = 0x7C0972711E5E5D23LL;
    v6[10] = 0x191D703028635C21LL;
    v6[11] = 0x405D1C7E0B601446LL;
    v6[12] = 0x62611D4B320D6C78LL;
    memcpy(v7, "GQ6,/rqswO", 10);
    v4[0] = 0x48633E0137730E24LL;
    v4[1] = 0x722D6E6F3E295F53LL;
    v4[2] = 0x2738791141693007LL;
    v4[3] = 0x7965302D5A09586CLL;
    v4[4] = 0x17B38197D691A1ELL;
    v4[5] = 0x78097A453D3C5554LL;
    v4[6] = 0x182D517B73331FLL;
    for (i = 56; i > 0; --i)
        *((uint8_t *)v4 + i) ^= *((uint8_t *)v4 + i - 1);
    for (j = 0; j < 0x39; ++j)
        *((uint8_t *)v4 + j) ^= 0x69;
    for (k = 0; k < 0x39; ++k)
        *((uint8_t *)v4 + k) ^= *((uint8_t *)v6 + k);
    memcpy(result, v4, 56);
    cout << result << endl;
}

int main() {
    print_flag();
    return 0;
}
```

> FLAG:`FhCTF{Tru3_R3v3rs3?Y0u_m4y_h4v3_s0m3_m1sund3rs74nd!!%^&#}`
---

## Osint

### [祭]
女巫我會想到北投區
~~(絕對不是復興高中就在北投)~~
北投我能想到的景點:(1.北投公園 2.溫泉博物館 ==3.文物館==)
> FLAG:`FhCTF{112台北市北投區幽雅路32號}`

---
### [緣]
google 以圖搜圖加關鍵字 <華山 祭典 地址>
得到![image](https://hackmd.io/_uploads/HJfIjgzHC.png)
> FhCTF{108台北市萬華區康定路173巷}

---




## Crypto
### [Taiwan No.1]
題目有說到，每一個可視字元有獨立的編碼形式
我們只要將output縮成一行，利用`taiwan-art.py`去做成表
- `taiwan-art.py`
```python
Secret = open('./Secret.txt', 'rb').read()
encode = "~!@#$%^&*()-=[]\\"
Taiwan = list(open('./taiwan.txt', 'r').read())
SuperPower = 13 * 3 * 7 * 5
New_Taiwan = ''
for sec in Secret:
    for prime in [13, 3, 7, 5]:
        for sp in range(SuperPower):
            char = Taiwan.pop(0)
            if char != "#":
                New_Taiwan += char
            else:
                New_Taiwan += encode[sec % prime]
                break

print(New_Taiwan)
```
分析一下會發現，他會讀取taiwan.txt，而taiwan.txt要有4的倍數個`#`
我在`Secret.txt`中打
```
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&'()*+,-./:;<=>?@[]^_`{|}~
```
可以知道所有的可視字元符號，每四個一組，根據輸出值去查表
- 製表C++（要根據Secret.txt微調修正）
```cpp
#include <iostream>
using namespace std;
int main()
{
    string re = "~@@~!~#!@!$@#@%#$~^$%!~~^@!!&~@@*!##(@$$)~%~-!^!=@~@~~!#!!@$@@#~#~$!$!%@%@^#^~~$&!!~*@@!(~#@)!$#-@%$=~^~";
    string abc ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(int i=0;i<104;i+=4){
        cout<<abc[i/4]<<":"<<re[i]<<re[i+1]<<re[i+2]<<re[i+3]<<"\n";
    }
    return 0;
}
```
- python解
```python
stardand={'0':"(~^#",'1':")!~$",'2':"-@!~",'3':"=~@!",'4':"~!#@",'5':"!@$#",'6':"@~%$",'7':"#!^~",'8':"$@~!",'9':"%~!@",'a':"^!^@",'b':"&@~#",'c':"*~!$",'d':"(!@~",'e':")@#!",'f':"-~$@",'g':"=!%#",'h':"~@^$",'i':"!~~~",'j':"@!!!",'k':"#@@@",'l':"$~##",'m':"%!$$",'n':"^@%~",'o':"&~^!",'p':"*!~@",'q':"(@!#",'r':")~@$",'s':"-!#~",'t':"=@$!",'u':"~~%@","v":"!!^#",'w':"@@~$",'x':"#~!~",'y':"$!@!",'z':"%@#@",'A':"~@@~",'B':"!~#!",'C':"@!$@",'D':"#@%#",'E':"$~^$",'F':"%!~~",'G':"^@!!",'H':"&~@@",'I':"*!##",'J':"(@$$",'K':")~%~",'L':"-!^!",'M':"=@~@",'N':"~~!#",'O':"!!@$",'P':"@@#~",'Q':"#~$!",'R':"$!%@","S":"%@^#",'T':"^~~$",'U':"&!!~",'V':"*@@!",'W':"(~#@",'X':")!$#",'Y':"-@%$",'Z':"=~^~",'!':"&~%#",'"':"*!^$",'#':"(@~~",'$':")~!!",'%':"-!@@",'&':"=@##","'":"~~$$",'(':"!!%~",')':"@@^!",'*':"#~~@",'+':"$!!#",',':"%@@$",'-':"^~#~",'.':"&!$!",'/':"*@%@","'":"^!@#",';':"&@#$",'<':"*~$~",'=':"(!%!",'>':")@^@",'?':"-~~#",'@':"=!!$",'[':"~!~!",']':"@~@#",'^':"#!#$",'_':"$@$~",'`':"%~%!",'{':"^~$#",'|':"&!%$",'}':"*@^~",'~':"(~~!"}
transform={
    v:k for k,v in stardand.items()
}
message="@!$@&~^!^@%~=!%#)~@$^!^@=@$!~~%@$~##^!^@=@$!!~~~&~^!^@%~-!#~^@$@&~^!^@%~^@$@-!#~&~^!$~##!!^#!~~~^@%~=!%#^@$@=@$!~@^$!~~~-!#~^@$@*~!$~@^$^!^@$~##$~##)@#!^@%~=!%#)@#!&~%#^@$@~!^#)!#~^~~$~@^$)@#!^@$@%!$$^!^@-!#~#@@@^@$@~@^$^!^@-!#~)!~$$@~!=~@!@~%$^@$@(@~~~~$$-!#~^@$@-!#~&~^!^@$@~@^$)@#!)~@$)@#!^@$@^!^@)~@$)@#!^@$@-!#~&~^!%!$$)@#!^@$@)~@$^!^@^@%~(!@~&~^!%!$$^@$@@@~$&~^!)~@$(!@~-!#~^@$@=@$!&~^!^@$@%!$$^!^@#@@@)@#!^@$@=@$!~@^$)@#!^@$@%!$$)@#!-!#~-!#~^!^@=!%#)@#!^@$@$~##&~^!^@%~=!%#^@$@)@#!^@%~&~^!~~%@=!%#~@^$&!$!~!^#)!#~@!$@&~^!^@%~-~$@$~##!~~~*~!$=@$!^@$@%!$$~~%@-!#~=@$!^@$@^@%~&~^!=@$!^@$@&@~#)@#!^@$@-!#~)@#!)@#!^@%~^@$@=@$!~@^$)~@$&~^!~~%@=!%#~@^$^@$@=@$!~@^$)@#!^@$@&~@@&~^!$~##$!@!^@$@)~%~~@^$^!^@$~##^!^@&!$!~!^#)!#~(~#@)@#!^@$@-!#~~@^$^!^@$~##$~##^@$@)~@$!~~~-!#~)@#!^@$@-~$@)~@$&~^!%!$$^@$@=@$!~@^$)@#!^@$@^!^@-!#~~@^$)@#!-!#~&!$!=@~@$!@!^@$@~@^$)@#!^!^@)~@$=@$!^@$@!~~~-!#~^@$@*~!$&~^!$~##(!@~)@#!)~@$^@$@=@$!~@^$^!^@^@%~^@$@=@$!~@^$)@#!-!#~)@#!^@$@-!#~=@$!)@#!)@#!$~##^@$@$~##!~~~%!$$&@~#-!#~&!$!~!^#)!#~@@#~)~@$!~~~-!#~%!$$^!^@=@$!!~~~*~!$^@$@*~!$&~^!)~@$)@#!^@$@-~$@^!^@!~~~$~##!~~~^@%~=!%#&~%#^@$@(~#@)@#!^@$@)~@$)@#!(@!#~~%@!~~~)~@$)@#!^@$@^!^@-!#~-!#~!~~~-!#~=@$!^!^@^@%~*~!$)@#!&!$!~!^#)!#~-@%$&~^!~~%@)~@$^@$@-~$@$~##^!^@=!%#^@$@!~~~-!#~^@$@~@^$)@#!)~@$)@#!^!@#^@$@%!~~~@^$@!$@^~~$%!~~^~$#-!^!!~~~!!^#=~@!(!@~$@$~)!~$^@%~$@$~^~~$~!#@)!~$@@~$=~@!^@%~$@$~^@!!&~^!&~^!(~^#(~^#&~^!&~^!(~^#(~^#(!@~*@^~"
result=''
for i in range(0,len(message),4):
    ans=message[i:i+4]
    if ans in transform:
        result+=transform[ans]
print(result)
```

- C++解
```cpp
#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;
int main() {
    unordered_map<char, string> encode_map = {
        {'0', "(~^#"}, {'1', ")!~$"}, {'2', "-@!~"}, {'3', "=~@!"}, {'4', "~!#@"},
        {'5', "!@$#"}, {'6', "@~%$"}, {'7', "#!^~"}, {'8', "$@~!"}, {'9', "%~!@"},
        {'a', "^!^@"}, {'b', "&@~#"}, {'c', "*~!$"}, {'d', "(!@~"}, {'e', ")@#!"},
        {'f', "-~$@"}, {'g', "=!%#"}, {'h', "~@^$"}, {'i', "!~~~"}, {'j', "@!!!"},
        {'k', "#@@@"}, {'l', "$~##"}, {'m', "%!$$"}, {'n', "^@%~"}, {'o', "&~^!"},
        {'p', "*!~@"}, {'q', "(@!#"}, {'r', ")~@$"}, {'s', "-!#~"}, {'t', "=@$!"},
        {'u', "~~%@"}, {'v', "!!^#"}, {'w', "@@~$"}, {'x', "#~!~"}, {'y', "$!@!"},
        {'z', "%@#@"}, {'A', "~@@~"}, {'B', "!~#!"}, {'C', "@!$@"}, {'D', "#@%#"},
        {'E', "$~^$"}, {'F', "%!~~"}, {'G', "^@!!"}, {'H', "&~@@"}, {'I', "*!##"},
        {'J', "(@$$"}, {'K', ")~%~"}, {'L', "-!^!"}, {'M', "=@~@"}, {'N', "~~!#"},
        {'O', "!!@$"}, {'P', "@@#~"}, {'Q', "#~$!"}, {'R', "$!%@"}, {'S', "%@^#"},
        {'T', "^~~$"}, {'U', "&!!~"}, {'V', "*@@!"}, {'W', "(~#@"}, {'X', ")!$#"},
        {'Y', "-@%$"}, {'Z', "=~^~"}, {'!', "&~%#"}, {'"', "*!^$"}, {'#', "(@~~"},
        {'$', ")~!!"}, {'%', "-!@@"}, {'&', "=@##"}, {'\'', "~~$$"}, {'(', "!!%~"},
        {')', "@@^!"}, {'*', "#~~@"}, {'+', "$!!#"}, {',', "%@@$"}, {'-', "^~#~"},
        {'.', "&!$!"}, {'/', "*@%@"}, {':', "^!@#"}, {';', "&@#$"}, {'<', "*~$~"},
        {'=', "(!%!"}, {'>', ")@^@"}, {'?', "-~~#"}, {'@', "=!!$"}, {'[', "~!~!"},
        {']', "@~@#"}, {'^', "#!#$"}, {'_', "$@$~"}, {'`', "%~%!"}, {'{', "^~$#"},
        {'|', "&!%$"}, {'}', "*@^~"}, {'~', "(~~!"}
    };
    unordered_map<string, char> decode_map;
    for (const auto& pair : encode_map) {
        decode_map[pair.second] = pair.first;
    }
    string encoded_message = "@!$@&~^!^@%~=!%#)~@$^!^@=@$!~~%@$~##^!^@=@$!!~~~&~^!^@%~-!#~^@$@&~^!^@%~^@$@-!#~&~^!$~##!!^#!~~~^@%~=!%#^@$@=@$!~@^$!~~~-!#~^@$@*~!$~@^$^!^@$~##$~##)@#!^@%~=!%#)@#!&~%#^@$@~!^#)!#~^~~$~@^$)@#!^@$@%!$$^!^@-!#~#@@@^@$@~@^$^!^@-!#~)!~$$@~!=~@!@~%$^@$@(@~~~~$$-!#~^@$@-!#~&~^!^@$@~@^$)@#!)~@$)@#!^@$@^!^@)~@$)@#!^@$@-!#~&~^!%!$$)@#!^@$@)~@$^!^@^@%~(!@~&~^!%!$$^@$@@@~$&~^!)~@$(!@~-!#~^@$@=@$!&~^!^@$@%!$$^!^@#@@@)@#!^@$@=@$!~@^$)@#!^@$@%!$$)@#!-!#~-!#~^!^@=!%#)@#!^@$@$~##&~^!^@%~=!%#^@$@)@#!^@%~&~^!~~%@=!%#~@^$&!$!~!^#)!#~@!$@&~^!^@%~-~$@$~##!~~~*~!$=@$!^@$@%!$$~~%@-!#~=@$!^@$@^@%~&~^!=@$!^@$@&@~#)@#!^@$@-!#~)@#!)@#!^@%~^@$@=@$!~@^$)~@$&~^!~~%@=!%#~@^$^@$@=@$!~@^$)@#!^@$@$~##)@#!^@%~-!#~)@#!-!#~^@$@&~^!-~$@^@$@(!@~)@#!-!#~*!~@)@#!)~@$^!^@=@$!!~~~&~^!^@%~&!$!~!^#)!#~~@@~$~##$~##^@$@*!~@^!^@=@$!~@^$-!#~^@$@^!^@)~@$)@#!^@$@-!#~)@#!)@#!^@%~^@$@=@$!~@^$)~@$&~^!~~%@=!%#~@^$^@$@=@$!~@^$)@#!^@$@*!~@)~@$!~~~-!#~%!$$^@$@&~^!-~$@^@$@-~$@^!^@=@$!)@#!&!$!~!^#)!#~!!@$~~%@)~@$^@$@@@~$!~~~$~##$~##-!#~^@$@^!^@)~@$)@#!^@$@^!^@$~##!~~~=!%#^@%~)@#!(!@~^@$@=@$!~@^$)~@$&~^!~~%@=!%#~@^$^@$@=@$!~@^$)@#!^@$@&~@@&~^!$~##$!@!^@$@)~%~~@^$^!^@$~##^!^@&!$!~!^#)!#~(~#@)@#!^@$@-!#~~@^$^!^@$~##$~##^@$@)~@$!~~~-!#~)@#!^@$@-~$@)~@$&~^!%!$$^@$@=@$!~@^$)@#!^@$@^!^@-!#~~@^$)@#!-!#~&!$!=@~@$!@!^@$@~@^$)@#!^!^@)~@$=@$!^@$@!~~~-!#~^@$@*~!$&~^!$~##(!@~)@#!)~@$^@$@=@$!~@^$^!^@^@%~^@$@=@$!~@^$)@#!-!#~)@#!^@$@-!#~=@$!)@#!)@#!$~##^@$@$~##!~~~%!$$&@~#-!#~&!$!~!^#)!#~@@#~)~@$!~~~-!#~%!$$^!^@=@$!!~~~*~!$^@$@*~!$&~^!)~@$)@#!^@$@-~$@^!^@!~~~$~##!~~~^@%~=!%#&~%#^@$@(~#@)@#!^@$@)~@$)@#!(@!#~~%@!~~~)~@$)@#!^@$@^!^@-!#~-!#~!~~~-!#~=@$!^!^@^@%~*~!$)@#!&!$!~!^#)!#~-@%$&~^!~~%@)~@$^@$@-~$@$~##^!^@=!%#^@$@!~~~-!#~^@$@~@^$)@#!)~@$)@#!^!@#^@$@%!~~~@^$@!$@^~~$%!~~^~$#-!^!!~~~!!^#=~@!(!@~$@$~)!~$^@%~$@$~^~~$~!#@)!~$@@~$=~@!^@%~$@$~^@!!&~^!&~^!(~^#(~^#&~^!&~^!(~^#(~^#(!@~*@^~";
    string decoded_message;
    for (size_t i = 0; i < encoded_message.length(); i += 4) {
        string encoded_char = encoded_message.substr(i, 4);
        if (decode_map.count(encoded_char) > 0) {
            decoded_message += decode_map[encoded_char];
        }
    }
    cout << "Decoded message: " << decoded_message << endl;
    return 0;
}
```
> FLAG:`FhCTF{Liv3d_1n_T41w3n_Goo00oo00d}`

---
## MISC
### [Welcome]
![image](https://hackmd.io/_uploads/SkBuAxGrC.png)


---
### [Survey]
`就是表單`

---
### [INDEX 與 RULES 的差集]
到index中發現xorkey
但是在經過base64 decode後是`FhCTF{H3l1o <-- part 1/2`
在rules中發現
```
<!-- crypt value -->
<!-- 192b741219293d0209041200000000000000000000030000 -->
```
再去解xor
其一解：
```python
import base64
base64_something = "RmhDVEZ7SDNsMW8gPC0tIHBhcnQgMS8y"
crypt_value_hex = "192b741219293d0209041200000000000000000000030000"
xorkey = base64.b64decode(base64_something)
crypt_value = bytes.fromhex(crypt_value_hex)
repeated_xorkey = (xorkey * ((len(crypt_value) // len(xorkey)) + 1))[:len(crypt_value)]
second_bytes = bytes(a ^ b for a, b in zip(crypt_value, repeated_xorkey))
second = second_bytes.decode('utf-8', errors='ignore')
print(xorkey,second)
```
其二解：
```python
import base64
from pwn import *
base64_something = "RmhDVEZ7SDNsMW8gPC0tIHBhcnQgMS8y"
crypt_value_hex = "192b741219293d0209041200000000000000000000030000"
xorkey = base64.b64decode(base64_something)
crypt_value = bytes.fromhex(crypt_value_hex)
print(xor(xorkey, crypt_value))
```
出來了第二段：`b'_C7F_Ru1e5} <-- part 2/2'`
> FLAG:`FhCTF{H3l1ob'_C7F_Ru1e5}`