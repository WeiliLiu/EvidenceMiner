const env = 'dev';

const dev = {
  apiUrl: 'http://localhost:5000',
  clientUrl: 'http://localhost:3000',
  elasticsearchUrl: 'http://localhost:9200',
  isDev: true,
};

const staging = {
  apiUrl: 'http://localhost:5000',
  clientUrl: 'http://localhost:3000',
  elasticsearchUrl: 'http://localhost:9200',
  isDev: true,
};

const prod = {
  apiUrl: 'http://35.192.39.222:8100',
  clientUrl: 'https://evidenceminer.com',
  elasticsearchUrl: 'https://7dc1bc0b.ngrok.io/',
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
