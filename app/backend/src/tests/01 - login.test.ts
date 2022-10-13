import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { FAILED_LOGIN_MOCK, SUCCESSFULLY_LOGIN_MOCK } from './mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing /login route', () => {
  describe('/POST', () => {
    it('Login throught /login route is possible', async () => {
      const loginRequest = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      expect(loginRequest.status).to.be.equal(200);
      expect(loginRequest.body).to.have.property('token');
      expect(loginRequest.body.token).to.be.a('string');
    });

    it('Login throught /login route is not possible when credentials are wrong', async () => {
      const wrongLoginRequest = await chai.request(app).post('/login').send(FAILED_LOGIN_MOCK);
      expect(wrongLoginRequest.status).to.be.equal(401);
      expect(wrongLoginRequest.body).to.have.property('message');
      expect(wrongLoginRequest.body.message).to.be.string('Incorrect email or password');
    });

    it('Login throught /login route is not possible when credentials are missing', async () => {
      const { email:_, FAILED_MOCK_WITHOUT_EMAIL } = FAILED_LOGIN_MOCK as any;
      const missingLoginRequest = await chai.request(app).post('/login').send(FAILED_MOCK_WITHOUT_EMAIL);
      expect(missingLoginRequest.status).to.be.equal(400);
      expect(missingLoginRequest.body).to.have.property('message');
      expect(missingLoginRequest.body.message).to.be.string('All fields must be filled');
    });
  });
  describe('/GET', () => {
    it('Validation of user token on /login/validate route works', async () => {
      const loginRequest = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const validateToken = await chai.request(app).get('/login/validate').set('authorization', loginRequest.body.token);
      expect(validateToken.status).to.be.equal(200);
      expect(validateToken.body).to.have.property('role');
      expect(validateToken.body.role).to.be.string('admin' || 'user');
    });

    it('Validation of user token on /login/validate returns a 401 code if token is invalid', async () => {
      await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const validateToken = await chai.request(app).get('/login/validate').set('authorization', 'sometoken');
      expect(validateToken.status).to.be.equal(401);
    });

    it('Validation of user token on /login/validate returns a 400 code if token is missing', async () => {
      await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const validateToken = await chai.request(app).get('/login/validate');
      expect(validateToken.status).to.be.equal(400);
    });
  });
});
