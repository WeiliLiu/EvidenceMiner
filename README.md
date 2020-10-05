# EvidenceMiner

### Project Structure
- `frontend` - the frontend web application (React) that displays the information
- `elasticsearch` - elasticsearch cluster set up for search purposes

### Installation
First, we need to set up an elasticsearch cluster. 

Install the package `elasticsearch` needed to run the scripts
```
pip install elasticsearch
```
Download [Elasticsearch-7.6.2](https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.2-linux-x86_64.tar.gz) and place it under the `elasticsearch` directory.

Download the [dataset](https://google.com) and place it under the `elasticsearch` directory.

Unzip the elasticsearch folder and start the elasticsearch server
```
tar -xvzf elasticsearch-7.6.2-linux-x86_64.tar.gz
cd elasticsearch-7.6.2/bin
./elasticsearch
```

Once the elasticsearch is started, run the following scripts.
```
cd elasticsearch
python3 setup.py
python3 index.py
```

Install the dependencies for the `frontend` app by running these commands
```
cd frontend
npm install
```

### Running

Start the frontend web app
```
cd frontend
npm start
```

### Finally
- `elasticsearch` is served at [http://localhost:9200](http://localhost:9200)
- `frontend` is served at [http://localhost:3000](https://localhost:3000)
