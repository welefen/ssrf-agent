# ssrf-agent

make http(s) to prevent SSRF

## Installation

```
npm install ssrf-agent
```

## Usage

```js
const getAgent = require('ssrf-agent');
const request = require('request');
const agent = getAgent();
// with request module
request('http://www.welefen.com', {
  agent
}, (err, response, body) => {
  
})
```

```js
const getAgent = require('ssrf-agent');
const fetch = require('node-fetch');
const agent = getAgent();
// with node-fetch module
fetch('http://www.welefen.com', {
  agent
}).then(res => res.text).then(data => {

}).catch(err => {

})
```

## Options

```js
const getAgent = require('ssrf-agent');
const agent = getAgent(ipChecker, agent);
```
* `ipChecker(ip, family = 4 | 6)` {Function} check ip is allowed, default is `ip.isPrivate`
* `agent`  {String | Object} default is `http`, support `http` `https` or `agent instance`