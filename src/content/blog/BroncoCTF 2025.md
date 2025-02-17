---
description: 跟著OhYeahSec打的第一場
title: 2025 BroncoCTF
pubDate: 2025-02-17 12:20:54
tags:
  -  writeup
categories:
    - Daily
---

## 前言
我自己其實沒有多專注在打這題，一共解了兩題分別是
- Reverse: Reversing for Ophidiophiles
- Crypto: Rahhh-SA
其實都蠻簡單的

### Reversing for Ophidiophiles
原題：
```
Do you love python? Or at least tolerate it? Then this is the challenge for you!

When run with the correct flag, the given file prints: 23a326c27bee9b40885df97007aa4dbe410e93.

What is the flag?
```
```python
flag = input()
carry = 0
key = "Awesome!"
output = []
for i,c in enumerate(flag):
    val = ord(c)
    val += carry
    val %= 256
    val ^= ord(key[i % len(key)])
    output.append(val)
    carry += ord(c)
    carry %= 256

print(bytes(output).hex())
```
`exploit.py`
```python!
def f(hex_output):
    hex_bytes = bytes.fromhex(hex_output)
    key = "Awesome!"
    carry = 0
    flag = []

    for i, val in enumerate(hex_bytes):
        val ^= ord(key[i % len(key)])
        val = (val - carry) % 256
        flag.append(chr(val))
        carry += val
        carry %= 256

    return ''.join(flag)

hex_output = "23a326c27bee9b40885df97007aa4dbe410e93"
print(f(hex_output))
```
![image](https://hackmd.io/_uploads/Syo-3Ee51x.png)

### Rahhh-SA
原題：
```
Behold! A modern take on an old crypto classic!

I call it RAHHH-SA! That's because with just a simple numerical inversion of RSA's rules, it's now unbreakable! RAHHH!

e = 65537
n = 3429719
c = [-53102, -3390264, -2864697, -3111409, -2002688, -2864697, -1695722, -1957072, -1821648, -1268305, -3362005, -712024, -1957072, -1821648, -1268305, -732380, -2002688, -967579, -271768, -3390264, -712024, -1821648, -3069724, -732380, -892709, -271768, -732380, -2062187, -271768, -292609, -1599740, -732380, -1268305, -712024, -271768, -1957072, -1821648, -3418677, -732380, -2002688, -1821648, -3069724, -271768, -3390264, -1847282, -2267004, -3362005, -1764589, -293906, -1607693]
Y'know what? I'm so confident in this new system I'll even share one of my deepest secrets!

p = -811
```
`exploit.py`
```python
def egcd(a, b):
    if a == 0:
        return b, 0, 1
    else:
        g, x, y = egcd(b % a, a)
        return g, y - (b // a) * x, x

def modinv(a, m):
    g, x, _ = egcd(a, m)
    if g == 1:
        return x % m

e = 65537
n = 3429719
p = -811
p_abs = abs(p)
q_abs = n // p_abs  
phi = (p_abs - 1) * (q_abs - 1)  
d = modinv(e, phi)
ciphertexts = [
    -53102, -3390264, -2864697, -3111409, -2002688, -2864697, -1695722,
    -1957072, -1821648, -1268305, -3362005, -712024, -1957072, -1821648,
    -1268305, -732380, -2002688, -967579, -271768, -3390264, -712024, -1821648,
    -3069724, -732380, -892709, -271768, -732380, -2062187, -271768, -292609,
    -1599740, -732380, -1268305, -712024, -271768, -1957072, -1821648, -3418677,
    -732380, -2002688, -1821648, -3069724, -271768, -3390264, -1847282, -2267004,
    -3362005, -1764589, -293906, -1607693
]
plaintext_nums = [pow(ct % n, d, n) for ct in ciphertexts]
plaintext = ''.join(chr(num) for num in plaintext_nums)
print(plaintext)
```
![image](https://hackmd.io/_uploads/H1mh3Ng5ke.png)

### Summarize
![image](https://hackmd.io/_uploads/rJLga4eq1g.png)
