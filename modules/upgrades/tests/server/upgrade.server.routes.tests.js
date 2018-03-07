'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Upgrade = mongoose.model('Upgrade'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  upgrade;

/**
 * Upgrade routes tests
 */
describe('Upgrade CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Upgrade
    user.save(function () {
      upgrade = {
        name: 'Upgrade name'
      };

      done();
    });
  });

  it('should be able to save a Upgrade if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upgrade
        agent.post('/api/upgrades')
          .send(upgrade)
          .expect(200)
          .end(function (upgradeSaveErr, upgradeSaveRes) {
            // Handle Upgrade save error
            if (upgradeSaveErr) {
              return done(upgradeSaveErr);
            }

            // Get a list of Upgrades
            agent.get('/api/upgrades')
              .end(function (upgradesGetErr, upgradesGetRes) {
                // Handle Upgrades save error
                if (upgradesGetErr) {
                  return done(upgradesGetErr);
                }

                // Get Upgrades list
                var upgrades = upgradesGetRes.body;

                // Set assertions
                (upgrades[0].user._id).should.equal(userId);
                (upgrades[0].name).should.match('Upgrade name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Upgrade if not logged in', function (done) {
    agent.post('/api/upgrades')
      .send(upgrade)
      .expect(403)
      .end(function (upgradeSaveErr, upgradeSaveRes) {
        // Call the assertion callback
        done(upgradeSaveErr);
      });
  });

  it('should not be able to save an Upgrade if no name is provided', function (done) {
    // Invalidate name field
    upgrade.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upgrade
        agent.post('/api/upgrades')
          .send(upgrade)
          .expect(400)
          .end(function (upgradeSaveErr, upgradeSaveRes) {
            // Set message assertion
            (upgradeSaveRes.body.message).should.match('Please fill Upgrade name');

            // Handle Upgrade save error
            done(upgradeSaveErr);
          });
      });
  });

  it('should be able to update an Upgrade if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upgrade
        agent.post('/api/upgrades')
          .send(upgrade)
          .expect(200)
          .end(function (upgradeSaveErr, upgradeSaveRes) {
            // Handle Upgrade save error
            if (upgradeSaveErr) {
              return done(upgradeSaveErr);
            }

            // Update Upgrade name
            upgrade.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Upgrade
            agent.put('/api/upgrades/' + upgradeSaveRes.body._id)
              .send(upgrade)
              .expect(200)
              .end(function (upgradeUpdateErr, upgradeUpdateRes) {
                // Handle Upgrade update error
                if (upgradeUpdateErr) {
                  return done(upgradeUpdateErr);
                }

                // Set assertions
                (upgradeUpdateRes.body._id).should.equal(upgradeSaveRes.body._id);
                (upgradeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Upgrades if not signed in', function (done) {
    // Create new Upgrade model instance
    var upgradeObj = new Upgrade(upgrade);

    // Save the upgrade
    upgradeObj.save(function () {
      // Request Upgrades
      request(app).get('/api/upgrades')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Upgrade if not signed in', function (done) {
    // Create new Upgrade model instance
    var upgradeObj = new Upgrade(upgrade);

    // Save the Upgrade
    upgradeObj.save(function () {
      request(app).get('/api/upgrades/' + upgradeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', upgrade.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Upgrade with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/upgrades/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Upgrade is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Upgrade which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Upgrade
    request(app).get('/api/upgrades/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Upgrade with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Upgrade if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upgrade
        agent.post('/api/upgrades')
          .send(upgrade)
          .expect(200)
          .end(function (upgradeSaveErr, upgradeSaveRes) {
            // Handle Upgrade save error
            if (upgradeSaveErr) {
              return done(upgradeSaveErr);
            }

            // Delete an existing Upgrade
            agent.delete('/api/upgrades/' + upgradeSaveRes.body._id)
              .send(upgrade)
              .expect(200)
              .end(function (upgradeDeleteErr, upgradeDeleteRes) {
                // Handle upgrade error error
                if (upgradeDeleteErr) {
                  return done(upgradeDeleteErr);
                }

                // Set assertions
                (upgradeDeleteRes.body._id).should.equal(upgradeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Upgrade if not signed in', function (done) {
    // Set Upgrade user
    upgrade.user = user;

    // Create new Upgrade model instance
    var upgradeObj = new Upgrade(upgrade);

    // Save the Upgrade
    upgradeObj.save(function () {
      // Try deleting Upgrade
      request(app).delete('/api/upgrades/' + upgradeObj._id)
        .expect(403)
        .end(function (upgradeDeleteErr, upgradeDeleteRes) {
          // Set message assertion
          (upgradeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Upgrade error error
          done(upgradeDeleteErr);
        });

    });
  });

  it('should be able to get a single Upgrade that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Upgrade
          agent.post('/api/upgrades')
            .send(upgrade)
            .expect(200)
            .end(function (upgradeSaveErr, upgradeSaveRes) {
              // Handle Upgrade save error
              if (upgradeSaveErr) {
                return done(upgradeSaveErr);
              }

              // Set assertions on new Upgrade
              (upgradeSaveRes.body.name).should.equal(upgrade.name);
              should.exist(upgradeSaveRes.body.user);
              should.equal(upgradeSaveRes.body.user._id, orphanId);

              // force the Upgrade to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Upgrade
                    agent.get('/api/upgrades/' + upgradeSaveRes.body._id)
                      .expect(200)
                      .end(function (upgradeInfoErr, upgradeInfoRes) {
                        // Handle Upgrade error
                        if (upgradeInfoErr) {
                          return done(upgradeInfoErr);
                        }

                        // Set assertions
                        (upgradeInfoRes.body._id).should.equal(upgradeSaveRes.body._id);
                        (upgradeInfoRes.body.name).should.equal(upgrade.name);
                        should.equal(upgradeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Upgrade.remove().exec(done);
    });
  });
});
