import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing /leaderboard', () => {
  describe('/GET', () => {
    it('Request leaderboard on route /leaderboard returns all teams', async () => {
      const leaderboard = await chai.request(app).get('/leaderboard');
      expect(leaderboard.status).to.be.equal(200);
      expect(leaderboard.body).to.be.instanceOf(Array);
      expect(leaderboard.body[0]).to.have.property('name');
    });
  });
});
