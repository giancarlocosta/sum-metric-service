const root = '../..';
const express = require('express');
const middleware = require(`${root}/server/middleware`).util;
const Logger = require('service-logger');
const logger = new Logger(__filename);
const router = new express.Router();

const MetricController = require(`${root}/server/controllers/MetricController.js`);
const metricController = new MetricController();


router.get('/:key/sum', async (req, res, next) => {
  const data = await metricController.sum(req.params.key, {
    queryFilters: req.query
  });
  res.send({ value: data });
});


router.post('/:key', async (req, res, next) => {
  const result = await metricController.create(req.params.key, req.body);
  res.send(result);
});


module.exports = router;
