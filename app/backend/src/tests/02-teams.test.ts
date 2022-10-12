import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing the /teams route', () => {
  describe('/GET', () => {
    it('Request on /teams route returns all teams from database', async () => {
      const teamsRequest = await chai.request(app).get('/teams');
      expect(teamsRequest.status).to.be.equal(200);
      expect(teamsRequest.body).to.be.instanceOf(Array);
      expect(teamsRequest.body[0]).to.have.property('id');
      expect(teamsRequest.body[0]).to.have.property('teamName');
    });
  });
});
