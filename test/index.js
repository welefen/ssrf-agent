const { test } = require('ava');
const { Agent: HTTPAgent } = require('http');
const { Agent: HTTPSAgent } = require('https');
const fetch = require('node-fetch');
const getAgent = require('../index');

test('getAgent with agent instance', async t => {
  const urls = [
    'http://127.0.0.1',
    'https://www.baidu.com/'
  ];

  t.plan(urls.length);

  try {
    await fetch(urls[0], {
      agent: getAgent(undefined, new HTTPAgent())
    });
    t.fail();
  } catch (e) {
    t.pass();
  }

  try {
    await fetch(urls[1], {
      agent: getAgent(undefined, new HTTPSAgent())
    });
    t.pass();
  } catch (e) {
    t.fail();
  }
});

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
    'http://017700000001', // ip host url with octonary number
    'http://127.0.0.1.xip.io/', // url with local dns
    'http://A.com@127.0.0.1', // url with @
    'http://127.0.0.1', // ip host url
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
