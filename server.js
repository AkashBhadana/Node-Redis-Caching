const express = require('express');
const axios = require('axios').default;
const client = require('./client');

const app = express();

app.get('/', async (req, res) => {
  try {
    const cacheValue = await client.get('todos');
    if (cacheValue) {
      const parsedCacheValue = JSON.parse(cacheValue);
      return res.json(parsedCacheValue);
    }

    const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos');
    await client.set('todos', JSON.stringify(data));
    await client.expire('todos', 30);

    return res.json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(9000, () => {
  console.log('Server is running on port 9000');
});
