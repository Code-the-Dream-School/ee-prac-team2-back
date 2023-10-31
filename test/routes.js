process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/server');
let app = require('../src/app');
let should = chai.should();

chai.use(chaiHttp);

describe('GET /api/v1', () => {
  it('it responds with 200', (done) => {
    chai.request(app).get('/api/v1')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it responds with expected json', (done) => {
    chai.request(app).get('/api/v1')
      .end((err, res) => {
        const responseDataValue = 'This is a full stack app!'
        res.body.should.have.property('data').eql(responseDataValue);
        done();
      });
  });
});

describe('GET /', () => {
  it('it responds with 404', (done) => {
    chai.request(app).get('/')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
