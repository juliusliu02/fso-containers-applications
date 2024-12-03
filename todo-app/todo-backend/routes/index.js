const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const todoCount = parseInt(await redis.getAsync("count") || 0)

  res.json({
    added_todo: todoCount
  });
});

module.exports = router;
