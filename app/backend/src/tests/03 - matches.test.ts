import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { TEAM_ID_MOCK } from './mocks';
import MatchesModel from '../database/models/MatchesModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing /matches route', () => {
  describe('/GET', () => {
    it('Request from /matches returns all matches with teams', async () => {
      const matchesRequest = await chai.request(app).get('/matches');
      expect(matchesRequest.status).to.be.equal(200);
      expect(matchesRequest.body).to.be.instanceOf(Array);
      expect(matchesRequest.body[0]).to.have.property('teamHome');
      expect(matchesRequest.body[0]).to.have.property('teamAway');
    });
  });
});
