const { Agent: HttpAgent } = require('http');
const { Agent: HttpsAgent } = require('https');
const { isPrivate, isV4Format, isV6Format } = require('ip');
const httpAgent = new HttpAgent();
const httpsAgent = new HttpsAgent();

const getAgent = agent => {
  if (agent instanceof HttpAgent || agent instanceof HttpsAgent) return agent;
  if (agent.startsWith('https')) return httpsAgent;
  return httpAgent;
};

const defaultIpChecker = ip => {
  if (isV4Format(ip) || isV6Format(ip)) {
    return !isPrivate(ip);
  }

  return true;
};

const CREATE_CONNECTION = Symbol('createConnection');

module.exports = function (
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

  const createConnection = agent.createConnection;
  agent.createConnection = function (options, fn) {
    const { host: address } = options;
    if (!ipChecker(address)) {
      throw new Error(`DNS lookup ${address} is not allowed.`);
    }

    const client = createConnection.call(this, options, fn);
    client.on('lookup', (err, address) => {
      if (err || ipChecker(address)) {
        return;
      }

      return client.destroy(new Error(`DNS lookup ${address} is not allowed.`));
    });

    return client;
  };

  return agent;
};
