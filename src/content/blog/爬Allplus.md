---
description: 給高二受益的
title: Allplus的單字
pubDate: 2025-01-03 01:15:57
tags:
  -  不知道
categories:
    - Daily
---

如何去爬取All plus雜誌的單字導出json
```python
import requests
from bs4 import BeautifulSoup
from json import dumps
import re

def after_name(raw_name):
    name = re.sub(r'[\\/:*?"<>|]', '_', raw_name.replace('\n', '').strip())
    name = re.sub(r'\s+', ' ', name)  
    return name

def crawler(page):
    response = requests.get(page)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')
    vocabulary_list = []
    sections = soup.find_all('div', class_='main-word')
    for section in sections:
        vocabulary = section.find('div', class_='word').text.strip()
        pos = section.find('div', class_='explain').find('span', class_='part-of-speech-tag').text.strip()
        chinese = section.find('div', class_='explain').text.strip().split(' ')[-1]
        vocabulary_list.append({
            "vocabulary": vocabulary,
            "partOfSpeech": pos,
            "chinese": chinese
        })
    file_name = soup.find('span', class_='small')
    file_name = after_name(file_name.text)
    return vocabulary_list, file_name

if __name__ == "__main__":
    base = "https://voccard.liveabc.com/allplus/2024/9/" #自行調整月份與年份
    day = [f"{base}{day}" for day in range(1, 20)]  
    for page in day:
        vocabulary, output = crawler(page) 
        result = {"vocabularies": vocabulary}
        output = f"{output}.json"
        with open(output, 'w', encoding="utf-8") as json_file:
            json_file.write(dumps(result, ensure_ascii=False, indent=4))
        print(f"Vocabulary data saved to '{output}'.")
```