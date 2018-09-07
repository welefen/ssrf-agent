const {Agent: HttpAgent} = require('http');
const {Agent: HttpsAgent} = require('https');
const {isPrivate} = require('ip');
const httpAgent = new HttpAgent();
const httpsAgent = new HttpsAgent();

const getAgent = agent => {
  if (agent instanceof HttpAgent || agent instanceof HttpsAgent) return agent;
  if (agent.startsWith('https')) return httpsAgent;
  return httpAgent;
};

const defaultIpChecker = (ip, family) => {
  if (family !== 4) return true;
  return !isPrivate(ip);
};

const CREATE_CONNECTION = Symbol('createConnection');

module.exports = function(ipChecker = defaultIpChecker, agent = 'http') {
  if (typeof ipChecker === 'string') {
    agent = ipChecker;
    ipChecker = defaultIpChecker;
  }
  agent = getAgent(agent);
  if (agent[CREATE_CONNECTION]) return agent;
  agent[CREATE_CONNECTION] = true;
  const createConnection = agent.createConnection;
  agent.createConnection = function(...options) {
    const client = createConnection.call(this, ...options);
    client.on('lookup', (err, address, family) => {
      if (err) return;
      if (!ipChecker(address, family)) {
        client.destroy(new Error(`DNS lookup ${address} is not allowed`));
      }
    });
    return client;
  };
  return agent;
};
