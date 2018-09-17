/* eslint-disable max-len */
const testUtils = require('../test-utils.js');
const request = require('request-promise');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const FIXTURES_DIR = '../fixtures';
const API_URL = process.env.API_URL || 'http://0.0.0.0:3000';


describe('Metrics Test', function() {
  this.timeout(10000);

  before(async (done) => {
    done();
  });

  /*
  ******************************************************************************
  * BASIC TESTS
  ******************************************************************************
  */
  describe('POST-ing and GET-ing sum', () => {

    // NORMAL OPERATION

    it('POST, then GET sum', async (done) => {
      try {
        // POST
        const options1 = {
          method: 'POST',
          uri: `${API_URL}/metric/activeVisitors`,
          body: {
            value: 1
          },
          json: true
        };

        const options2 = {
          method: 'POST',
          uri: `${API_URL}/metric/numClicks`,
          body: {
            value: 1
          },
          json: true
        };

        // PUT/GET 1
        for (let i = 0; i < 100; i++) {
          const post1 = (await request(options1));
          post1.should.be.a('object');
        }

        for (let i = 0; i < 400; i++) {
          const post1 = (await request(options2));
          post1.should.be.a('object');
        }

        let activeVisitors = await request.get(`${API_URL}/metric/activeVisitors/sum`, { json: true });
        activeVisitors.should.be.a('object');
        expect(activeVisitors.value).to.equal(100);

        let numClicks = await request.get(`${API_URL}/metric/numClicks/sum`, { json: true });
        numClicks.should.be.a('object');
        expect(numClicks.value).to.equal(400);


        done();
      } catch (e) {
        done(e);
      }
    });


    // ERROR CHECKS
    // TODO
  });

});
