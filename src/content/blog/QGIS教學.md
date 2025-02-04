---
title: QGIS教學
pubDate: 2023-09-10 10:00:27
categories:
    - Daily
description: 自己做面量圖的過程
image : https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/QGIS_2.2_Valmiera_showing_new_menu_design.png/1200px-QGIS_2.2_Valmiera_showing_new_menu_design.png
---

# 利用QGIS製作面量圖

安裝好後會看到此捷徑，使用Desktop版
![](https://hackmd.io/_uploads/HJx6Qh5Cn.png)

---

建立一個新的圖層
![](https://hackmd.io/_uploads/HyYeHh5C3.png)

好了會長這樣
![](https://hackmd.io/_uploads/ryEW829A3.png)

保持良好習慣，隨時存檔
![](https://hackmd.io/_uploads/BkW9wn503.png)

---

先去下載鄉鎮市區界線的.shp檔案
![](https://hackmd.io/_uploads/SyRpSnc0h.png)

> https://whgis-nlsc.moi.gov.tw/Opendata/Files.aspx

下載好後會有一個zip檔案
為了方便我在此建了新資料夾存放
Path:D:\QGIS 230910教學
![](https://hackmd.io/_uploads/HJscL35R2.png)

---

點選「Layer/Add Layeer/Add Vector Layer」
![](https://hackmd.io/_uploads/r1SydhqAn.png)

導入剛剛解壓縮的.shp檔案
![](https://hackmd.io/_uploads/S1hUd39R2.png)

:::warning
Encoding一定要改成UTF-8格式
:::
![](https://hackmd.io/_uploads/ry09_3qAn.png)

然後按add
![](https://hackmd.io/_uploads/ryqkF3cC3.png)

好了會長這樣
![](https://hackmd.io/_uploads/BJAbt29C3.png)

先改成白色
![](https://hackmd.io/_uploads/rk9FKhcRh.png)

確認屬性表
![](https://hackmd.io/_uploads/r1tTqnqAn.png)
![](https://hackmd.io/_uploads/ryN052qR3.png)

---

到我們之前的Excel，有看到為GIS建立的表格，選取後面的欄位
![](https://hackmd.io/_uploads/ry9bohc02.png)

建立一個文本檔案
![](https://hackmd.io/_uploads/H1rosh5A2.png)

貼上剛才的資料
![](https://hackmd.io/_uploads/BkmCohcRh.png)

更改副檔名為.csv
![](https://hackmd.io/_uploads/Skxghh9A3.png)

Add Delimited Text Layer
![](https://hackmd.io/_uploads/Sypz22q02.png)

選起剛才的.csv檔案
![](https://hackmd.io/_uploads/HJYN23q0h.png)

然後按上面的Pcocessing
再選取Tools
![](https://hackmd.io/_uploads/r1KL229A3.png)

在輸入框輸入Join attributes by field value
![](https://hackmd.io/_uploads/HyT_22903.png)
:::info

<!-- input layer表示具有地理資訊的圖層
table field表示選擇圖層中的主要欄位
input layer2表示具有統計資料的檔案（剛才的csv檔案）
table field2表示選擇統計資料的主要欄 -->

:::
![](https://hackmd.io/_uploads/BkgT3nc02.png)

幫新的圖層先存檔
![](https://hackmd.io/_uploads/H1cyT2qCh.png)

幫新的統計圖層命名
最後按run
![](https://hackmd.io/_uploads/rksWT3cAh.png)

幫統計圖層著色
![](https://hackmd.io/_uploads/SJp0p2qCn.png)

選擇Graduated
![](https://hackmd.io/_uploads/ry0e0h50n.png)

Vaule的參照對象是peopleform
![](https://hackmd.io/_uploads/Bku-A3cR2.png)

改一下區分的東東
![](https://hackmd.io/_uploads/BJ3z03qA3.png)

就有了
![](https://hackmd.io/_uploads/HyPQCn9An.png)

右鍵上色圖層
選取Properties
![](https://hackmd.io/_uploads/BJMSC2q03.png)

在Label中選取Single Lables
![](https://hackmd.io/_uploads/r1uUC2c03.png)

value參照TOWNNAME
![](https://hackmd.io/_uploads/B1BPAhqAn.png)

名稱就出來了
![](https://hackmd.io/_uploads/Sk5u0hq03.png)

~~剩下顏色要怎麼改就看你懂不懂美了~~
![](https://hackmd.io/_uploads/ryS5R39Rn.png)
![](https://hackmd.io/_uploads/B1TjRncRh.png)
![](https://hackmd.io/_uploads/HJNTA29C3.png)
![](https://hackmd.io/_uploads/HJbyka5C3.png)

# 利用QGIS製作點圖

去下載Goole Rarth Pro
https://www.google.com/intl/zh-TW/earth/versions/
![](https://hackmd.io/_uploads/ryYF1a5A2.png)
跟之前一樣
![](https://hackmd.io/_uploads/Bkbk-6c02.png)
我們要標出明倫高中的點點
![](https://hackmd.io/_uploads/HJCbZ6qRh.png)

![](https://hackmd.io/_uploads/HJoX-pqCh.png)
把csv檔案丟進去
![](https://hackmd.io/_uploads/BkVLZTqAn.png)
改成逗號
然後照著我用下去
![](https://hackmd.io/_uploads/rJXdW690h.png)

![](https://hackmd.io/_uploads/r1UcWaq02.png)

![](https://hackmd.io/_uploads/Hkl0Zaq0h.png)

![](https://hackmd.io/_uploads/B1nyzaqC2.png)
:::warning
這邊要把存檔類型改成kml，圖我放錯了
:::
![](https://hackmd.io/_uploads/ByzNfaqC2.png)
把kml檔案拖到QGIS中
然後按確定就好了

![](https://hackmd.io/_uploads/H1YDQp502.png)

![](https://hackmd.io/_uploads/HkBTQac0n.png)

![](https://hackmd.io/_uploads/Bk1LET90h.jpg)
