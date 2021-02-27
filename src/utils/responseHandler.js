const log4js = require('log4js');
const boom = require('boom');

const logger = log4js.getLogger('[Response Handler]');

exports.boom = boom;

exports.handleError = (res) => (err) => {
  try {
    const boomified = boom.isBoom(err)
      ? err
      : boom.boomify(new Error(err), { statusCode: err.statusCode || 500 });

    if (err.data) {
      boomified.output.payload.data = err.data;
    }

    if (boomified.output.statusCode >= 500) {
      logger.error(err);
    }

    res.set(boomified.output.headers);
    res.status(boomified.output.statusCode);
    res.json(boomified.output.payload);
  } catch (error) {
    logger.error({ error });
    res.status(500).send({ error: 'Error. Contact system administrator.' });
  }
};
