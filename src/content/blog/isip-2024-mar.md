---
description: 紀錄課程作業
title: Programming Security March Homework
pubDate: 2024-03-28 15:40:18
tags:
  -  writeup
categories:
    - Daily
---

![image](https://hackmd.io/_uploads/BJvnFpJO0.png)

## 作業1- C 語言開發

- `printf("%d\\n", a & b);`
  這一行執行了AND運算。a和b的二進位表示分別是1001和1101，進行位元AND運算後，得到結果1001，對應的十進位數字為9。
- `printf("%d\\n", a || b);`
  這一行執行了OR運算。a和b都是非零值，因此表達式a || b的結果為真（1）。所以輸出將是1。
- `printf("%d\\n", a ^ b);`
  這一行執行了位元XOR運算。a和b的二進位表示分別是1001和1101，進行位元XOR運算後，得到結果0100，對應的十進位數字為4。
- `printf("%d\\n", !a);`
  這一行執行了邏輯NOT運算。a的值是非零，所以邏輯NOT運算後為0。所以輸出將是0。
  ![image](https://hackmd.io/_uploads/ByMlc61d0.png)
  ![image](https://hackmd.io/_uploads/Hyvlc6yuA.png)

## 作業2- Linux執行檔分析

C原程式
猜題目作者的生日
![image](https://hackmd.io/_uploads/Hy8X56J_R.png)
執行過程：
![image](https://hackmd.io/_uploads/ry5456yOC.png)
總不可能剛好通靈到別人的生日
到main function中尋找：
![image](https://hackmd.io/_uploads/Hkw85p1uA.png)
比較過程(1)：

![image](https://hackmd.io/_uploads/HyEwcTk_0.png)
比較過程(2)：
![image](https://hackmd.io/_uploads/HJodcTJ_A.png)
![image](https://hackmd.io/_uploads/SkKKq61_A.png)
其實好像進到VV後就看到flag了

# 作業3- 組合語言

這題要找到能跳paradise的值
![image](https://hackmd.io/_uploads/rkjq5TkuA.png)

- 過程：
- 1. 初始的賦值: eax=0x03, ebx=???(不知道是多少), ecx=0x3eb3ac03, edx=0x3eb3ac03。

2. 進入loop,瘋狂執行下去。
3. 在循環中,首先檢查eax是否＝0,如果則跳轉到check。
4. 如果eax不為零,則將ecx+edx,然後將eax-1。
5. 循環重複執行,直到eax變為零。
6. 當eax為零時,跳到check,比較ebx和ecx的值。
7. 如果ebx等於ecx,則跳轉到paradise,將eax設置為1。否則,將eax設置為0。

- 要跳轉到paradise,需要滿足ebx等於ecx的條件。由於ecx的初始值為0x3eb3ac03,我們可以追蹤循環的執行過程來計算出最終ecx的值。
  在循環中,ecx的值會被不斷加上edx的值(0x3eb3ac03)。
  由於eax的初始值為3,因此循環會執行3次。每次循環,ecx的值會增加0x3eb3ac03。

結果：
`要計算出以下：
ecx = 0x3eb3ac03 + 3 * 0x3eb3ac03 `
![image](https://hackmd.io/_uploads/rJFC9TyOR.png)

# 作業4- pwntools解題

C原程式
猜題目作者的生日
![image](https://hackmd.io/_uploads/BkFgi6k_R.png)
pwn解題程式
![image](https://hackmd.io/_uploads/SJMWiayOR.png)
結果：
Flag就噴出來了
![image](https://hackmd.io/_uploads/SycGspy_C.png)

- 加分題 main 2
  ![image](https://hackmd.io/_uploads/rkXVipkdR.png)
  ![image](https://hackmd.io/_uploads/HkaEi61O0.png)
- 加分題 main 3
  ![image](https://hackmd.io/_uploads/SkiHj6ydA.png)
  進入到visual模式後
  也可看到
  0x4012f6
  是main的地址
  ![image](https://hackmd.io/_uploads/S1FIs61_0.png)
- 加分題 main 6
  ![image](https://hackmd.io/_uploads/By_vi6JuA.png)
  進入到visual模式後還是
  可以看到main的地址是0x40121c
  ![image](https://hackmd.io/_uploads/H1w_spJuR.png)
