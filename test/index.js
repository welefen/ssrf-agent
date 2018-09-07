const getAgent = require('../index');
const fetch = require('node-fetch');

const urls = [
  'http://www.welefen.com/',
  'http://qiwoo.org/',
  'http://urlqh.cn/meRow',
  'https://www.baidu.com/',
  'https://www.so.com/?src=so.com',
  'http://s0.qhres.com/static/8f022693068c7a8c/fasdfasdf.js'
];

for (const item of urls) {
  const agent = getAgent(item.startsWith('https://') ? 'https' : 'http');
  fetch(item, {
    agent
  }).then(res => res.text).then(data => {
    console.log('finish', item);
  }).catch(err => {
    console.error(err, item);
  });
}
