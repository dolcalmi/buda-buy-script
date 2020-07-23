const ccxt = require ('ccxt');
const axios = require('axios');
const commandLineArgs = require('command-line-args')
const info = require('debug')('buda:info')
const error = require('debug')('buda:error')

const optionDefinitions = [
  { name: 'base', alias: 'b', type: String, defaultValue: 'BTC'  },
  { name: 'quote', alias: 'q', type: String, defaultValue: 'COP' },
  { name: 'amount', alias: 'a', type: Number, defaultValue: 0 },
  { name: 'apiKey', alias: 'k', type: String, defaultValue: null },
  { name: 'secret', alias: 's', type: String, defaultValue: null },
];

const { base, quote, amount, apiKey, secret } = commandLineArgs(optionDefinitions);

const infoMsg = 'Order %s with requested amount %s %s was filled with %s %s';
getCoinRate(base, quote, amount)
  .then(a => marketBuy(base, quote, a, { apiKey, secret }))
  .then(r => info(infoMsg, r.id, r.amount, base, r.filled, base))
  .catch(e => error(e))

/**
 * Get a market rate for the given quote (COP, CLP, PEN, ARS)
 * @param  {[type]} base        base currency (BTC, ETH, LTC)
 * @param  {[type]} quote       quote currency (COP, CLP, PEN, ARS)
 * @param  {[type]} quoteAmount amount to validate
 * @return {[type]}             base amount
 */
function getCoinRate(base, quote, quoteAmount) {
  if (quoteAmount <= 0)
    return Promise.reject('Invalid quote amount');

  const data = {'type': 'bid_given_value','limit': null,'amount': quoteAmount,'market_id': null};
  const url = `https://www.buda.com/api/v2/markets/${base}-${quote}/quotations`;

  delete axios.defaults.headers.common["Accept"]

  return axios.post(url, data)
    .then(function (response) {
      let amount = 0.0;
      if (response && response.data && response.data.quotation)
        amount = response.data.quotation.base_balance_change[0];
      info('Rate for %s %s: %s %s', quoteAmount, quote, amount, base)
      return amount;
    })
    .catch((e) => {
      error(e.toJSON());
      return 0.0;
    });
}

/**
 * Creates a market order
 * @param  {[type]} base       base currency (BTC, ETH, LTC)
 * @param  {[type]} quote      quote currency (COP, CLP, PEN, ARS)
 * @param  {[type]} baseAmount order amount
 * @param  {[type]} options    buda api key and secret object { apiKey, secret }
 * @return {[type]}            buda order
 */
function marketBuy(base, quote, baseAmount, options) {
  if (baseAmount <= 0)
    return Promise.reject('Invalid amount')

  let buda = new ccxt.buda (options);
  return buda
    .createOrder(`${base}/${quote}`, 'market', 'buy', baseAmount)
    .then(o => sleep(4000, o))
    .then(o => buda.fetchOrder(o.id));
}

function sleep(ms, order) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(order), ms);
  });
}
