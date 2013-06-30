describe('porchetta-client', function() {
  var expect    = chai.expect;
  var Vendors   = Backbone.Collection.extend({ name: 'vendors', url: 'api/vendors' });
  var Accounts  = Backbone.Collection.extend({ name: 'accounts', url: 'api/accounts' });
  var bertCooper, rogerSterling, peteCambell;

  function createUser(user, room, cb) {
    var vendors = new Vendors([
      { id: 1, name: 'Ambassador' },
      { id: 2, name: 'Big Media Co.' },
      { id: 3, name: 'Boutique Ads, LLC' }
    ]);
    var accounts = new Accounts([
      { id: 1, name: 'Accounts Payable', type: 'Liability' },
      { id: 2, name: 'Accounts Receivable', type: 'Asset' }
    ]);
    var porchetta = new Porchetta('http://localhost:4000', room)
      .add(vendors)
      .add(accounts)
      .on('connect', cb);

    user = { porchetta: porchetta, vendors: vendors, accounts: accounts };
  }

  beforeEach(function(done) {
    async.parallel([
      function(cb) { createUser(bertCooper, 1, cb); },
      function(cb) { createUser(rogerSterling, 1, cb); },
      function(cb) { createUser(peteCambell, 2, cb); }
    ], done);
  });

  describe('emits sync', function() {
    it('on add');
    it('on change');
    it('on remove');
  });

  it('does not active when no other viewers');

  afterEach(function() {
    bertCooper.porchetta.socket.disconnect();
    rogerSterling.porchetta.socket.disconnect();
    peteCambell.porchetta.socket.disconnect();
  });
});
