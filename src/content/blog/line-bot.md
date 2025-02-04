---
description: 明倫單字卡的究極延伸，line api好貴
title: line_bot
pubDate: 2024-07-26 09:29:46
tags:
  -  不知道
categories:
    - Daily
---
## 明倫單字卡Line Bot指令介紹
![image](https://hackmd.io/_uploads/SJ-Fo_ltA.png)



- start - 每5分鐘發送一個隨機單字
- stop - 停止發送單字
- asterjen - 一句鼓勵的話
- crazy - 每3秒發送一個隨機單字
- help - 顯示此說明訊息

程式碼：
```javascript
const linebot = require('linebot');
const fs = require('fs');
const path = require('path');

const bot = linebot({
  channelId: '?',
  channelSecret: '?',
  channelAccessToken: '?'
});

// 讀取所有 JSON 檔案
const vocabularyPath = path.join(__dirname, 'vocabulary-list');
const allVocabularies = [];

function readVocabularyFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      readVocabularyFiles(itemPath);
    } else if (item.isFile() && path.extname(item.name) === '.json') {
      try {
        const data = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
        if (Array.isArray(data.vocabularies)) {
          data.vocabularies.forEach(vocab => {
            vocab.source = path.basename(itemPath, '.json'); // 只保留檔名，不包括 .json
          });
          allVocabularies.push(...data.vocabularies);
        }
      } catch (error) {
        console.error(`Error reading file ${itemPath}:`, error);
      }
    }
  });
}

readVocabularyFiles(vocabularyPath);

console.log(`Loaded ${allVocabularies.length} vocabularies in total.`);

// 隨機選擇一個單字
function getRandomVocabulary() {
  const randomIndex = Math.floor(Math.random() * allVocabularies.length);
  return allVocabularies[randomIndex];
}

const userIntervals = {};

// 定時發送單字
function sendVocabulary(userId) {
  if (userIntervals[userId]) {
    clearInterval(userIntervals[userId]);
  }

  userIntervals[userId] = setInterval(() => {
    const vocabulary = getRandomVocabulary();
    const message = `單字：${vocabulary.vocabulary} (${vocabulary.partOfSpeech})\n中文：${vocabulary.chinese}\n出處：${vocabulary.source}`;
    bot.push(userId, message);
  }, 5 * 60 * 1000); 
}

function sendVocabulary_fuck(userId) {
  if (userIntervals[userId]) {
    clearInterval(userIntervals[userId]);
  }

  userIntervals[userId] = setInterval(() => {
    const vocabulary = getRandomVocabulary();
    const message = `單字：${vocabulary.vocabulary} (${vocabulary.partOfSpeech})\n中文：${vocabulary.chinese}\n出處：${vocabulary.source}`;
    bot.push(userId, message);
  },3000); // 每 3 秒發送一次
}

// 停止發送單字
function stopSendingVocabulary(userId) {
  if (userIntervals[userId]) {
    clearInterval(userIntervals[userId]);
    delete userIntervals[userId];
  }
}

const botInstructions = `歡迎使用明倫單字卡！
以下是可用的指令：
1. start - 每5分鐘發送一個隨機單字
2. stop - 停止發送單字
3. asterjen - 一句鼓勵的話
4. crazy - 每3秒發送一個隨機單字
5. help - 顯示此說明訊息`;
bot.on('message', function (event) {
  // Check the message type
  switch (event.message.type) {
    case 'text':
      handleTextMessage(event);
      break;
    case 'sticker':
      handleStickerMessage(event);
      break;
    default:
      handleOtherMessage(event);
  }
});

function handleTextMessage(event) {
  const userMessage = event.message.text.toLowerCase();

  switch (userMessage) {
    case 'start':
      event.reply('之後每5分鐘會傳一個單字給你~');
      sendVocabulary(event.source.userId);
      break;
    case 'crazy':
      event.reply('接招吧哈哈哈！');
      sendVocabulary_fuck(event.source.userId);
      break;
    case 'stop':
      stopSendingVocabulary(event.source.userId);
      event.reply('已停止！');
      break;
    case 'help':
      event.reply(botInstructions);
      break;
    case 'asterjen':
      event.reply('沒事去多拜拜，做好事，時時觀功念恩👍');
      break;
    default:
      event.reply(botInstructions);
  }
}

function handleStickerMessage(event) {
  event.reply('收到你的貼圖了！不過我只能處理文字訊息喔。');
  event.reply(botInstructions);
}

function handleOtherMessage(event) {
  event.reply('抱歉，我只能處理文字訊息。');
  event.reply(botInstructions);
}

bot.listen('/linewebhook', 3000, function () {
  console.log('機器人已啟動！');
});
```



使用示範：
![image](https://hackmd.io/_uploads/SkqFhOgtR.png)
