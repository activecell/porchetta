const agent = require('superagent');
const url   = '/api/v1/handshake.json';

module.exports = function(io) {
  io.set('authorization', function (data, accept) {
    request(data, function(err, res) {
      accept(err, res.statusCode === 204);
    });
  });
};

/**
 * Helper to prepare request options based on handshake `data`
 */

function request(data, cb) {
  agent
    .get((process.env.ORIGIN || data.headers.origin) + url)
    .set('Host', (data.headers.origin || '').replace('http://', ''))
    .set('Cookie', data.headers.cookie)
    .set('Accept', 'application/json')
    .end(cb);
}
