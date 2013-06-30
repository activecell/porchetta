describe('porchetta-client', function() {
  var expect    = chai.expect;
  var porchetta = require('porchetta');
  var Vendors   = Backbone.Collection.extend({ name: 'vendors', url: 'api/vendors' });
  var Accounts  = Backbone.Collection.extend({ name: 'accounts', url: 'api/accounts' });

  // porchetta.connect('http://localhost:4000', app.company.id);

  describe('sync event', function() {
    it('on add');
    it('on change');
    it('on remove');
  });

  describe('viewers event', function() {
    it('does not active when on one connection');
  });
});
