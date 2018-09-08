const { test } = require('ava');
const fetch = require('node-fetch');
const getAgent = require('../index');

test('allowed url', async t => {
  const urls = [
    'http://www.welefen.com/',
    'https://www.baidu.com/',
    'https://www.so.com/?src=so.com',
    'http://s0.qhres.com/static/8f022693068c7a8c/fasdfasdf.js',
    'https://www.so.com/s?ie=utf-8&fr=so.com&src=home_so.com&q=ww'
  ];

  t.plan(urls.length);

  for (const item of urls) {
    const agent = getAgent(item);
    try {
      await fetch(item, { agent });
      t.pass();
    } catch (e) {
      t.fail();
    }
  }
});

test('disallowed url', async t => {
  const urls = [
    'http://10.16.133.61', // ip host url
    'http://urlqh.cn/mgwC8', // short url with ip host url
    'http://qiwoo.org/', // internal domain url
    'http://urlqh.cn/meRow' // short url with internal domain url
  ];

  t.plan(urls.length);

  for (const item of urls) {
    const agent = getAgent(item);
    try {
      await fetch(item, { agent });
      t.fail();
    } catch (e) {
      t.pass();
    }
  }
});
