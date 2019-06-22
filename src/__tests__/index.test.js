import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/user';
import Location from '../models/location';
import app from '../app';

describe('Test cases for the user authentication and locations', () => {
  let token;
  beforeAll(function (done) {
    function clearDB() {
      const promises = [
        User.remove().exec(),
        Location.remove().exec()
      ];

      Promise.all(promises)
        .then(function () {
          done();
        })
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect("mongodb+srv://creez:root@cluster0-w8dbn.mongodb.net/test?retryWrites=true&w=majority", function (err) {
        if (err) {
          throw err;
        }
        return clearDB();
      });
    } else {
      return clearDB();
    }
  });

  afterAll(() => mongoose.disconnect());

  const dummyUser = {
    "name": "Dennis",
    "phone": "0713749945",
    "password": "P@ss1234",
    "confirmPassword": "P@ss1234",
    "email": "test1@gmail.com"
  }

  const dummyBadUser = {
    "name": "Dennis",
    "phone": "0713749945",
    "password": "P@ss1234!",
    "confirmPassword": "P@ss1234",
    "email": "test432@gmail.com"
  }

  const dummyLocation = {
    "name": "Nairobi",
    "females": 234,
    "males": 233
  }

  it("should create a user successfully", done => {
    return request(app)
      .post("/api/v1/user/signup")
      .send(dummyUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("should not create a user with same email", done => {
    return request(app)
      .post("/api/v1/user/signup")
      .send(dummyUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(409, {
        message: 'Email is already taken'
      })
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("should not create a user with confirm pass not matching password", done => {
    return request(app)
      .post("/api/v1/user/signup")
      .send(dummyBadUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        message: 'Password and confirm password must be equal'
      })
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("should login a user successfully", done => {
    return request(app)
      .post("/api/v1/user/signin")
      .send(dummyUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        token = res.body.token;
        done();
      });
  });

  it('should create a location successfully', done => {
    return request(app)
      .post('/api/v1/locations')
      .send(dummyLocation)
      .set('authorization', token)
      .expect(201)
      .end(err => {
        if(err) return done(err);
        done();
      })
  });

  it('should not create same location twice', done => {
    return request(app)
      .post('/api/v1/locations')
      .send(dummyLocation)
      .set('authorization', token)
      .expect(403, {
        message: 'Name of the location must e unique'
      })
      .end(err => {
        if (err) return done(err);
        done();
      })
  });

  it("should not login a user with incorrect creds", done => {
    return request(app)
      .post("/api/v1/user/signin")
      .send(dummyBadUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, {
        message: 'Email or password do not match'
      })
      .then(res => {
        token = res.body.token;
        done();
      });
  });
});
