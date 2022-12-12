import request from 'supertest';
import { expect, should } from 'chai';
import app from '../../../app';
import { v4 as uuidv4 } from 'uuid';
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhcnNoYWt1bWFyaTM3MEBnbWFpbC5jb20iLCJuYW1lIjoiVmFyc2hhIGt1bWFyaSIsImlkIjoiZGlkOmhpZDp0ZXN0bmV0Ono5cEc1UEVpUmZuNDc4ekNydFVGNjZmbXVxdHg1YkQzS1VIRXFpODM1VDhXOCIsImlhdCI6MTY3MDY3MjIwMiwiZXhwIjoxNjcwNzkyMjAyfQ.Hc5YWjC74VQel0gOO-R0_TSiT69_D7_IwvQ5bJ_Gxlks';
let appDetail = {
  appName: 'testApp',
  tenantSubdomain: 'varsha',
};

const appCredential = {
  clientId: '0aa16b524dd810f7',
  clientSecret: '9fcdc2230f00111c66a4e7dfcc663772a209a33a',
  tenantSubdomain: 'varsha',
  grantType: 'client_credentials',
};
before(function (done) {
  this.timeout(8000);
  setTimeout(done, 2000);
});
const origin = 'http://localhost:9002';
describe(' Test /api/v1/app', () => {
  // Test cases for registering an apps
  it('should be able to fail as authToken is not passed in header ', (done) => {
    const tempAppDetail = { ...appDetail };
    request(app)
      .post('/api/v1/app/register')
      .set('origin', origin)
      .send(tempAppDetail)
      .expect(403)
      .end(function (err, res) {
        console.log(err);
        expect(res.text).equals('Authorization token is not passed in the header');
        return done();
      });
  }).timeout(15000);
  it('should be able to fail as origin is not passed in header ', (done) => {
    const tempAppDetail = { ...appDetail };
    request(app)
      .post('/api/v1/app/register')
      .set('Authorization', 'Bearer ' + authToken)
      .send(tempAppDetail)
      .expect(400)
      .end(function (err, res) {
        console.log(err);
        expect(res.text).equals('Authorization token is not passed in the header');
        return done();
      });
  });

  it('should not be able to register app as app tenantSubdomain is null or empty ', (done) => {
    const tempAppDetail = { ...appDetail };
    tempAppDetail.tenantSubdomain = '';
    request(app)
      .post('/api/v1/app/register')
      .set('Authorization', 'Bearer ' + authToken)
      .set('orign', origin)
      .send(tempAppDetail)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.errors[0].msg).equals("appName can't be null or empty");
        return done();
      });
  });

  it('should be able to register a new app ', (done) => {
    const tempAppDetail = { ...appDetail };
    tempAppDetail.appName = tempAppDetail.appName + uuidv4();
    request(app)
      .post('/api/v1/app/register')
      .set('Authorization', 'Bearer ' + authToken)
      .set('orign', origin)
      .send(tempAppDetail)
      .expect(201)
      .end(function (err, res) {
        expect(res.status).equal(201);
        should().exist(res.body.data['_id']);
        should().exist(res.body.data['clientId']);
        should().exist(res.body.data['userId']);
        should().exist(res.body.data['clientSecret']);
        should().exist(res.body.data['tenantSubdomain']);
        should().exist(res.body.data['kmsId']);
        should().exist(res.body.data['edvId']);
        appDetail = { ...res.body };
        expect(res.body.appName).equals(tempAppDetail.appName);
        expect(res.body.tenantSubdomain).equals(tempAppDetail.tenantSubdomain);
        return done();
      });
  });
  it('should not be able to register a new app as appname already exists', (done) => {
    const tempAppDetail = { ...appDetail };

    request(app)
      .post('/api/v1/app/register')
      .set('Authorization', 'Bearer ' + authToken)
      .set('orign', origin)
      .send(tempAppDetail)
      .expect(400)
      .end(function (err, res) {
        expect(res.status).equal(400);
        expect(res.text).equals(`App ${tempAppDetail.appName} is already registered`);

        return done();
      });
  });

  //Test case for generating auth token
  it('should not be able to generate accessToken as clientId is not passed in body ', (done) => {
    const tempAppCredential = { ...appCredential };
    tempAppCredential.clientId = '';
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.errors[0].msg).equals("clientId can't be null or empty");
        return done();
      });
  });
  it('should not be able to generate accessToken as clientSecret is not passed in body ', (done) => {
    const tempAppCredential = { ...appCredential };
    tempAppCredential.clientSecret = '';
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.errors[0].msg).equals("clientSecret can't be null or empty");
        return done();
      });
  });
  it('should not be able to generate accessToken as tenantSubdomain is not passed in body ', (done) => {
    const tempAppCredential = { ...appCredential };
    tempAppCredential.tenantSubdomain = '';
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.errors[0].msg).equals('tenantSubdomain can not be null or empty');
        return done();
      });
  });
  it('should not be able to generate accessToken as grantType is not passed in body ', (done) => {
    const tempAppCredential = { ...appCredential };
    tempAppCredential.grantType = '';
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.errors[0].msg).equals("grantType can't be null or empty");
        return done();
      });
  });

  it('should not be able to generate accessToken as grantType is invalid', (done) => {
    const tempAppCredential = { ...appCredential };
    tempAppCredential.grantType = 'client_credential';
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(400)
      .end(function (err, res) {
        expect(res.text).equals('Invalid grantType');
        return done();
      });
  });

  it('should not be able to generate accessToken as credential detail passed in body is not correct', (done) => {
    const tempAppCredential = { ...appCredential };
    tempAppCredential.clientSecret = 'dfghjkl7yhbe5678yh548';
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(401)
      .end(function (err, res) {
        expect(res.text).equals('Access denied');
        return done();
      });
  });

  it('should be able to generate accessToken', (done) => {
    const tempAppCredential = { ...appDetail };
    request(app)
      .post('/api/v1/app/auth')
      .send(tempAppCredential)
      .expect(200)
      .end(function (err, res) {
        if (err) return err;
        should().exist(res.body.data['token']);
        should().exist(res.body.data['expiresIn']);
        should().exist(res.body.data['tokenType']);
        expect(res.body.data.tokenType).equal('Bearer');
        return done();
      });
  });
});
