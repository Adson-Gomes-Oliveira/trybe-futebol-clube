import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import { FAILED_LOGIN_MOCK, SUCCESSFULLY_LOGIN_MOCK } from './mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing the /login route', () => {
  describe('/POST', () => {
    it('Login throught /login route is possible', async () => {
      const loginRequest = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      expect (loginRequest.status).to.be.equal(200);
      expect (loginRequest.body).to.have.property('token');
      expect (loginRequest.body.token).to.be.a('string');
    });

    it('Login throught /login route is not possible when credentials are wrong', async () => {
      const loginRequest = await chai.request(app).post('/login').send(FAILED_LOGIN_MOCK);
      expect (loginRequest.status).to.be.equal(401);
      expect (loginRequest.body).to.have.property('message');
      expect (loginRequest.body.token).to.be('Invalid Credentials!');
    });
  });
});
