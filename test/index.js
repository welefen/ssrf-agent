const getAgent = require('../index');
const fetch = require('node-fetch');
const checker = (ip, faimily) => {
  console.log(ip, faimily);
  return false;
}
const agent = getAgent(checker);

fetch('http://www.welefen.com', {
  agent
}).then(res => res.text).then(data => {
  console.log('finish');
}).catch(err => {
  console.error(err);
});
