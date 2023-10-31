process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('GET /api/v1', () => {
  it('it responds with 200', (done) => {
    chai.request(app).get('/api/v1')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
  });

  it('it responds with expected json', (done) => {
    chai.request(app).get('/api/v1')
      .end((err, res) => {
        const responseDataValue = 'This is a full stack app!';
        should.not.exist(err);
        res.body.should.have.property('data').eql(responseDataValue);
        done();
      });
  });
});

describe('GET /', () => {
  it('it responds with 404', (done) => {
    chai.request(app).get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(404);
        done();
      });
  });
});
