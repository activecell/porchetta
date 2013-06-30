describe('porchetta-client', function() {
  var expect   = chai.expect;
  var Vendors  = Backbone.Collection.extend({ name: 'vendors', url: 'api/vendors' });
  var Accounts = Backbone.Collection.extend({ name: 'accounts', url: 'api/accounts' });
  var bertCooper, rogerSterling, donDrapper, peteCambell;

  function createUser(room, cb) {
    var vendors = new Vendors([
      { id: 1, name: 'Ambassador' },
      { id: 2, name: 'Big Media Co.' },
      { id: 3, name: 'Boutique Ads, LLC' }
    ]);
    var accounts = new Accounts([
      { id: 1, name: 'Accounts Payable', type: 'Liability' },
      { id: 2, name: 'Accounts Receivable', type: 'Asset' }
    ]);
    var porchetta = new Porchetta('http://localhost:4000', room, { 'force new connection': true })
      .add(vendors)
      .add(accounts);
    porchetta.on('connect', function() {
      cb(null, { porchetta: porchetta, vendors: vendors, accounts: accounts });
    });
  }

  beforeEach(function(done) {
    async.parallel([
      function(cb) { createUser(1, cb); },
      function(cb) { createUser(1, cb); },
      function(cb) { createUser(1, cb); },
      function(cb) { createUser(2, cb); }
    ], function(err, result) {
      bertCooper    = result[0];
      rogerSterling = result[1];
      donDrapper    = result[2];
      peteCambell   = result[3];
      done(err);
    });
  });

  it('does not active without viewers');
  it('throws error when collection is already watching');

  describe('emits sync', function() {
    it('on add', function(done) {
      var complete = _.after(2, done);
      bertCooper.vendors.add({ id: 4, name: 'Another random restaurant' });

      rogerSterling.porchetta.on('vendors:add', function(json) {
        expect(rogerSterling.vendors).length(4);
        expect(json.id).equal(4);
        complete();
      });
      donDrapper.porchetta.on('vendors:add', function(json) {
        expect(donDrapper.vendors).length(4);
        expect(json.name).equal('Another random restaurant');
        complete();
      });
      bertCooper.porchetta.on('vendors:add', function(json) {
        done('error: it does not return event back');
      });
      peteCambell.porchetta.on('vendors:add', function(json) {
        done('error: it broadcasts only in one room');
      });
    });

    it('on change');
    it('on remove');
  });

  afterEach(function() {
    bertCooper.porchetta.socket.disconnect();
    rogerSterling.porchetta.socket.disconnect();
    donDrapper.porchetta.socket.disconnect();
    peteCambell.porchetta.socket.disconnect();
  });
});
