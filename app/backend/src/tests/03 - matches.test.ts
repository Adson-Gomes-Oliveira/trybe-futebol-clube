import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { FAILED_MATCH_MOCK, SUCCESSFULLY_LOGIN_MOCK, SUCCESSFULLY_MATCH_MOCK, TEAM_ID_MOCK } from './mocks';
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
      const loginMatch = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const insertMatchRequest = await chai.request(app).post('/matches').send(SUCCESSFULLY_MATCH_MOCK)
        .set('authorization', loginMatch.body.token);

      expect(insertMatchRequest.status).to.be.equal(201);
      expect(insertMatchRequest.body).to.have.property('id');
    });

    it('Is not possible to save a match when the payload is wrong', async () => {
      const loginMatch = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const insertMatchRequest = await chai.request(app).post('/matches').send(FAILED_MATCH_MOCK)
        .set('authorization', loginMatch.body.token);

      expect(insertMatchRequest.status).to.be.equal(400);
      expect(insertMatchRequest.body).to.have.property('message');
    });

    it('Is not possible to save a match when the two teams are equal', async () => {
      const loginMatch = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const insertMatchRequest = await chai.request(app).post('/matches').send({
        ...SUCCESSFULLY_MATCH_MOCK,
        homeTeam: 8,
        awayTeam: 8,
      }).set('authorization', loginMatch.body.token);

      expect(insertMatchRequest.status).to.be.equal(401);
      expect(insertMatchRequest.body).to.have.property('message');
      expect(insertMatchRequest.body.message).to.be.string('It is not possible to create a match with two equal teams');
    });

    it('Is not possible to save a match when the home or away team does not exist', async () => {
      const loginMatch = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const insertMatchRequest = await chai.request(app).post('/matches').send({
        ...SUCCESSFULLY_MATCH_MOCK,
        homeTeam: 999999999,
      }).set('authorization', loginMatch.body.token);

      expect(insertMatchRequest.status).to.be.equal(404);
      expect(insertMatchRequest.body).to.have.property('message');
      expect(insertMatchRequest.body.message).to.be.string('There is no team with such id!');
    });

    it('Is not possible to save a match when the token is invalid', async () => {
      const insertMatchRequest = await chai.request(app).post('/matches').send(SUCCESSFULLY_MATCH_MOCK)
        .set('authorization', 'sometoken');

      expect(insertMatchRequest.status).to.be.equal(401);
      expect(insertMatchRequest.body).to.have.property('message');
      expect(insertMatchRequest.body.message).to.be.string('Token must be a valid token');
    });
  });

  describe('/PATCH', () => {
    it('Is possible to finish a match by the /matches/:id/finish route', async () => {
      const loginMatch = await chai.request(app).post('/login').send(SUCCESSFULLY_LOGIN_MOCK);
      const finishMatch = await chai.request(app).patch('/matches/1/finish')
        .set('authorization', loginMatch.body.token);

      expect(finishMatch.status).to.be.equal(200);
      expect(finishMatch.body).to.have.property('message');
      expect(finishMatch.body.message).to.be.string('Finished');
    });
  });
});
