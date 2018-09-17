/* eslint-disable max-len */
const testUtils = require('../test-utils.js');
const request = require('request-promise');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const API_URL = process.env.API_URL || 'http://0.0.0.0:3000';

describe('Misc Tests', function() {
  this.timeout(20000);

  it('Status endpoint returns successfully and contains expected data', done => {
    chai.request(API_URL).get('/status').then(response => {
      response.should.have.status(200);
      const body = response.body;
      body.should.be.an('object');
      body.name.should.equal('metric-service');
      body.state.should.equal('operational');
      body.hash.should.match(/[a-f0-9]{64}/);
      body.system.should.be.an('object');
      body.database.should.equal('connected');
      done();
    }).catch(error => {
      done(error);
    });
  });

});
