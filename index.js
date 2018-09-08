const { Agent: HttpAgent } = require('http');
const { Agent: HttpsAgent } = require('https');
const { isPrivate, isV4Format } = require('ip');
const httpAgent = new HttpAgent();
const httpsAgent = new HttpsAgent();

const getAgent = agent => {
  if (agent instanceof HttpAgent || agent instanceof HttpsAgent) return agent;
  if (agent.startsWith('https')) return httpsAgent;
  return httpAgent;
};

const defaultIpChecker = ip => {
  if (isV4Format(ip)) {
    return !isPrivate(ip);
  }

  return true;
};

const CREATE_CONNECTION = Symbol('createConnection');

module.exports = function(
  ipChecker = defaultIpChecker,
  agent = 'http'
) {
  if (typeof ipChecker === 'string') {
    agent = ipChecker;
    ipChecker = defaultIpChecker;
  }
  agent = getAgent(agent);
  if (agent[CREATE_CONNECTION]) return agent;
  agent[CREATE_CONNECTION] = true;

  const checker = (address, client) => {
    if (ipChecker(address)) {
      return;
    }

    return client.destroy(new Error(`DNS lookup ${address} is not allowed.`));
  };

  const createConnection = agent.createConnection;
  agent.createConnection = function(options, fn) {
    const client = createConnection.call(this, options, () => {
      const { host: address } = options;
      if (!checker(address, client) && typeof fn === 'function') {
        fn();
      }
    });

    client.on('lookup', (err, address) => {
      if (err) return;
      checker(address, client);
    });

    return client;
  };

  return agent;
};
