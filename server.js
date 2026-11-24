const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));

function demoReply(messages, language='auto') {
  const last = String(messages[messages.length-1]?.content || '').trim();
  const lang = language === 'auto'
    ? (/[ўқғҳқҷӣӣ]/i.test(last) ? 'uz' : (/[а-яё]/i.test(last) ? 'ru' : 'en'))
    : language;
  const dict = {
    uz: {
      hello: "Салом! Мен Ali Teacher'нинг бепул демо режимиман. Инглиз тилини ўрганишда ёрдам бераман. Масалан, 'Present Simple' ёки 'I am a student' деб ёзинг.",
      name: "Менинг исмим Ali Teacher. Мен сенга инглиз тилини ўрганишда ёрдам бераман.",
      python: "Бу Zehn Academy'даги инглиз тили ўқитувчиси демоси. Инглизча сўз, грамматика ёки гап юбор — содда қилиб тушунтираман.",
      present: "Present Simple — одатий ёки такрорланадиган иш-ҳаракатлар учун. Формула: I/You/We/They + verb; He/She/It + verb-s. Мисол: I play football. She plays football.",
      am: "Тўғри гап: “I am a student.” Маъноси: “Мен талабаман”. “I” билан “am” ишлатилади.",
      thanks: "Арзимайди! Яна савол бер. 😊",
      fallback: "Саволингни олдим! Бу ҳозирча бепул демо режим: мен асосий инглиз тили мавзулари ва намунавий саволларга жавоб бера оламан. Аниқроқ ёрдам учун инглизча гапингни ёки грамматика мавзусини юбор."
    },
    tg: {
      hello: "Салом! Ман демо-версияи ройгони Ali Teacher ҳастам. Барои омӯзиши забони англисӣ кӯмак мекунам. Масалан, 'Present Simple' ё 'I am a student' нависед.",
      name: "Номи ман Ali Teacher аст. Ман ба шумо дар омӯзиши забони англисӣ кӯмак мекунам.",
      python: "Ин демо-омӯзгори забони англисӣ дар Zehn Academy аст. Калима, ҷумла ё мавзӯи грамматикиро фиристед.",
      present: "Present Simple барои амалҳои одатӣ истифода мешавад. Формула: I/You/We/They + verb; He/She/It + verb-s. Мисол: I play football. She plays football.",
      am: "Ҷумлаи дуруст: “I am a student.” Маънояш: “Ман донишҷӯ ҳастам”. Бо “I” калимаи “am” меояд.",
      thanks: "Марҳамат! Саволи дигар диҳед. 😊",
      fallback: "Саволи шумо қабул шуд! Ин ҳоло демо-режими ройгон аст. Ман ба мавзӯъҳои асосии англисӣ ва намунаҳои одӣ ҷавоб медиҳам. Ҷумлаи англисӣ ё мавзӯи грамматикиро фиристед."
    },
    ru: {
      hello: "Здравствуйте! Я бесплатная демо-версия Ali Teacher. Помогу изучать английский. Например, напишите «Present Simple» или «I am a student».",
      name: "Меня зовут Ali Teacher. Я помогаю изучать английский язык.",
      python: "Это демо-версия преподавателя английского в Zehn Academy. Отправьте английское слово, предложение или тему грамматики.",
      present: "Present Simple используется для привычных и повторяющихся действий. Формула: I/You/We/They + verb; He/She/It + verb-s. Примеры: I play football. She plays football.",
      am: "Правильно: “I am a student.” Перевод: «Я студент». С местоимением “I” используется “am”.",
      thanks: "Пожалуйста! Задавайте следующий вопрос. 😊",
      fallback: "Я получил ваш вопрос! Сейчас это бесплатный демо-режим: доступны базовые темы английского и примеры. Отправьте английское предложение или тему грамматики."
    },
    en: {
      hello: "Hello! I'm the free demo version of Ali Teacher. I can help with basic English. Try asking about Present Simple or write “I am a student.”",
      name: "My name is Ali Teacher. I help you learn English step by step.",
      python: "This is the Zehn Academy English-teacher demo. Send an English word, sentence, or grammar topic.",
      present: "Present Simple describes habits and repeated actions. Form: I/You/We/They + verb; He/She/It + verb-s. Examples: I play football. She plays football.",
      am: "Correct sentence: “I am a student.” Use “am” with the subject “I”.",
      thanks: "You're welcome! Ask another question. 😊",
      fallback: "I received your question! This is currently a free demo, with basic English topics and sample answers. Send an English sentence or a grammar topic and I'll help."
    }
  };
  const d = dict[lang] || dict.en;
  const q = last.toLowerCase();
  if (/^(hi|hello|hey|салом|ассалом|привет|здравствуйте|салом алейкум)/i.test(q)) return d.hello;
  if (/your name|who are you|исминг|номат|тебя зовут|кимсан/i.test(q)) return d.name;
  if (/present simple|презент симпл/i.test(q)) return d.present;
  if (/i am student|i student|i am a student/i.test(q)) return d.am;
  if (/thank|рахмат|спасибо|ташаккур/i.test(q)) return d.thanks;
  return d.fallback;
}

app.post('/api/chat', async (req,res)=>{
  const {messages=[], language='auto'} = req.body || {};
  res.json({reply:demoReply(messages, language), language:language==='auto'?'en':language, mode:'demo'});
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Ali Teacher DEMO running: http://localhost:${port}`));
