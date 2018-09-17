const root = '../..';
const conf = require('../configs/config.js');
const Logger = require('service-logger');
const utils = require(`${root}/common/util.js`);
const uuid = require('uuid/v4');
const logger = new Logger(__filename);

/*
This map is used to keep an updated sum of the metric keys values from the past
hour. For each metric that is posted, add it's value to the preexisting total for
that metric that exists in this map, and call a setTimeout function (to emulate a TTL)
that will come back after an hour and update this map by subtracting that original
value from the total, essentially erasing data older than an hour.
Example:
metricSums: {
  'active_visitors': 5,
  'num_clicks': 87,
  ...
}
*/
const metricSums = {};


/**
* Class representing a Controller for metric model/type.
*/
class MetricController  {

  /**
  * @constructor
  * @param {string} model - type
  * @param {object} options - Optional params
  */
  constructor(model, options) {}

  /**
  * Returns sum of metrics' values over the most recent hour, given the metric key
  * @param {string} key - metric key to create
  * @param {object} options - Query filters, etc.
  * @return {Promise<Integer>}
  *   on success resolve with sum
  *   else resolve with 0
  */
  async sum(key, options) {
    if (isNaN(metricSums[key])) {
      return 0;
    }
    return metricSums[key];
  }

  /**
  * For now this function just updates the metricSums map and sets TTLs for each
  * created metric that update the metricSums map as they expire
  * @param {string} key - metric key to create
  * @param {object} data - data containing metric info
  * @param {object} options - Query filters, etc.
  * @return {Promise<object|Error>}
  *   on success resolve with found object
  *   else reject with error
  */
  async create(key, data, options) {

    // Whenever metric is added, add to the sum of values for that metric key
    if (isNaN(metricSums[key])) {
      metricSums[key] = data.value
    } else {
      metricSums[key] = metricSums[key] + data.value;
    }

    // When metric is older than 1 hour, we dont care about it anymore.
    // At this time update the sums for that metric key to get rid of this data
    setTimeout(() => {
      logger.debug(`Expired cache metric: ${key} - ${data.value}`)
      metricSums[key] = metricSums[key] - data.value;
    }, conf.get('default_metric_ttl_ms'));

    return {};

  }

}


module.exports = MetricController;
