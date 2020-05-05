const env = 'prod';

const dev = {
  apiUrl: 'http://localhost:5000',
  clientUrl: 'http://localhost:3000',
  elasticsearchUrl: 'http://localhost:9200',
  dbUrl: 'mongodb://127.0.0.1:27017/em',
  isDev: true,
};

const staging = {
  apiUrl: 'http://localhost:5000',
  clientUrl: 'http://localhost:3000',
  elasticsearchUrl: 'http://localhost:9200',
  dbUrl: 'mongodb://127.0.0.1:27017/em',
  isDev: true,
};

const prod = {
  apiUrl: 'http://35.192.39.222:8100',
  clientUrl: 'https://evidenceminer.com',
  elasticsearchUrl: 'https://7dc1bc0b.ngrok.io/',
  dbUrl: 'mongodb://127.0.0.1:27017/em',
  isDev: false,
};

let config;

if (env === 'prod') {
  config = prod;
} else if (env === 'staging') {
  config = staging;
} else {
  config = dev;
}

module.exports = config;
