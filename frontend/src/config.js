const env = 'dev'

const dev = {
  searchUrl: 'http://localhost:9200',
  frontUrl: 'http://localhost:3000',
}

const staging = {
  frontUrl: 'https://evidenceminer.firebaseapp.com',
  searchUrl: 'https://7dc1bc0b.ngrok.io',
}

const prod = {
  frontUrl: 'https://evidenceminer.firebaseapp.com',
  searchUrl: 'https://7dc1bc0b.ngrok.io',
}

function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

let config = {}

if (env === 'prod') {
  config = mergeDeep(config, prod)
} else if (env === 'staging') {
  config = mergeDeep(config, staging)
} else {
  config = mergeDeep(config, dev)
}

config.env = env
export default config
