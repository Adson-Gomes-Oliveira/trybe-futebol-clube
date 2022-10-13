import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { FAILED_MATCH_MOCK, SUCCESSFULLY_MATCH_MOCK, TEAM_ID_MOCK } from './mocks';
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

    it('Request matches in progess from /matches return the correct match', async () => {
      const matchesRequest = await chai.request(app).get('/matches?inProgress=true');
      expect(matchesRequest.status).to.be.equal(200);
      expect(matchesRequest.body).to.be.instanceOf(Array);
      expect(matchesRequest.body[0]).to.have.property('inProgress');
      expect(matchesRequest.body[0].inProgress).to.be.equal(true);
    });

    it('Request matches not in progess from /matches return the correct match', async () => {
      const matchesRequest = await chai.request(app).get('/matches?inProgess=false');
      expect(matchesRequest.status).to.be.equal(200);
      expect(matchesRequest.body).to.be.instanceOf(Array);
      expect(matchesRequest.body[0]).to.have.property('inProgress');
      expect(matchesRequest.body[0].inProgress).to.be.equal(false);
    });
  });

  describe('/POST', () => {
    it('Is possible to save a match in progress on database', async () => {
      const insertMatchRequest = await chai.request(app).post('/matches').send(SUCCESSFULLY_MATCH_MOCK);
      expect(insertMatchRequest.status).to.be.equal(201);
      expect(insertMatchRequest.body).to.have.property('id');
    });

    it('Is not possible to save a match when the payload is wrong', async () => {
      const insertMatchRequest = await chai.request(app).post('/matches').send(FAILED_MATCH_MOCK);
      expect(insertMatchRequest.status).to.be.equal(400);
      expect(insertMatchRequest.body).to.have.property('message');
    });

    it('Is not possible to save a match when the home or away team does not exist', async () => {
      const insertMatchRequest = await chai.request(app).post('/matches').send({
        ...SUCCESSFULLY_MATCH_MOCK,
        homeTeam: 999999999,
      });
      expect(insertMatchRequest.status).to.be.equal(500);
      expect(insertMatchRequest.body).to.have.property('message');
    });
  });
});
