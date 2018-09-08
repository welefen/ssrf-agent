# ssrf-agent

prevent SSRF in http(s) request

## Install

```
npm install ssrf-agent --save
```

## Usage

```js
const ssrfAgent = require('ssrf-agent');
const request = require('request');
// with request module
const url = 'http://www.welefen.com'
request(url, {
  agent: ssrfAgent(url)
}, (err, response, body) => {
  
})
```

```js
const ssrfAgent = require('ssrf-agent');
const fetch = require('node-fetch');
// with node-fetch module
const url = 'http://www.welefen.com'
fetch(url, {
  agent: ssrfAgent(url)
}).then(res => res.text).then(data => {

}).catch(err => {

})
```

## Options

```js
const getAgent = require('ssrf-agent');
const agent = getAgent(ipChecker, agent);
```
* `ipChecker(ip)` {Function} check ip is allowed, default is `require('ip').isPrivate`
* `agent`  {String | Object} default is `http`, support `http` `https` or `agent instance`