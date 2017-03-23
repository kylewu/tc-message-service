
require('should');

const request = require('supertest');

const jwts = {
    // userId = 40051331
    // eslint-disable-next-line
  member: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W10sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InRlc3QxIiwiZXhwIjoyNTYzMDc2Njg5LCJ1c2VySWQiOiI0MDA1MTMzMSIsImlhdCI6MTQ2MzA3NjA4OSwiZW1haWwiOiJ0ZXN0QHRvcGNvZGVyLmNvbSIsImp0aSI6ImIzM2I3N2NkLWI1MmUtNDBmZS04MzdlLWJlYjhlMGFlNmE0YSJ9.p13tStpp0A1RJjYJ2axSKCTx7lyWIS3kYtCvs8u88WM',
    // userId = 40051333
    // eslint-disable-next-line
  admin: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJhZG1pbmlzdHJhdG9yIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InRlc3QxIiwiZXhwIjoyNTYzMDc2Njg5LCJ1c2VySWQiOiI0MDA1MTMzMyIsImlhdCI6MTQ2MzA3NjA4OSwiZW1haWwiOiJ0ZXN0QHRvcGNvZGVyLmNvbSIsImp0aSI6ImIzM2I3N2NkLWI1MmUtNDBmZS04MzdlLWJlYjhlMGFlNmE0YSJ9.uiZHiDXF-_KysU5tq-G82oBTYBR0gV_w-svLX_2O6ts',
};
const server = require('../../app');
const axios = require('axios');
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');

sinonStubPromise(sinon);

describe('POST /v4/topics/:topicId/posts ', () => {
  const apiPath = '/v4/topics/:topicId/posts';
  const testBody = {
    post: 'test post',
  };
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should return 403 response without a jwt token', (done) => {
    request(server)
            .post(apiPath)
            .send(testBody)
            .expect(403, done);
  });

  it('should return 403 response with invalid jwt token', (done) => {
    request(server)
            .post(apiPath)
            .set({
              Authorization: 'Bearer wrong',
            })
            .send(testBody)
            .expect(403, done);
  });

  it.skip('should return 200 response with valid jwt token and payload', (done) => {
    sandbox.stub(axios, 'post').returnsPromise().resolves({});
    request(server)
            .post(apiPath)
            .set({
              Authorization: `Bearer ${jwts.admin}`,
            })
            .send(testBody)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.body.should.have.propertyByPath('result', 'content', 'message')
                        .eql('Post created');
              return done();
            });
  });

  it.skip('should return 200 response with valid jwt token and payload with responseTo', (done) => {
    const body = Object.assign({}, testBody, { responseTo: 1 });
    sandbox.stub(axios, 'post').returnsPromise().resolves({});
    request(server)
            .post(apiPath)
            .set({
              Authorization: `Bearer ${jwts.admin}`,
            })
            .send(body)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.body.should.have.propertyByPath('result', 'content', 'message').eql('Post created');
              return done();
            });
  });

  it.skip('should return 500 response with error response', (done) => {
    sandbox.stub(axios, 'post').returnsPromise().rejects({
      response: {
        status: 500,
      },
    });
    request(server)
            .post(apiPath)
            .set({
              Authorization: `Bearer ${jwts.admin}`,
            })
            .send(testBody)
            .expect(500)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.body.should.have.propertyByPath('result', 'content', 'message')
                        .eql('Error creating post');
              return done();
            });
  });
});