/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');

const { assert } = chai;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including status code!
  */
  /*
  test('#example Test GET /api/books', (done) => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  let chaiId;
  const chaiTestTitle = 'Chai Test Title';
  const badId = 'super_bad_id';

  suite('Routing tests', () => {
    suite('POST /api/books with title => create book object/expect book object', () => {
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({ title: chaiTestTitle })
          .end((err, res) => {
            chaiId = res.body._id;
            assert.equal(res.status, 200);
            assert.equal(res.body.title, chaiTestTitle, 'Title should match posted title');
            done();
          });
      });

      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({ title: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title', 'Missing field error should appear');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            res.body.forEach((elem) => {
              assert.property(elem, 'commentcount', 'Should contain commentcount property');
              assert.property(elem, 'title', 'Should contain title property');
              assert.property(elem, '_id', 'Should contain _id property');
            });
            done();
          });
        // done();
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai.request(server)
          .get(`/api/books/${badId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists', 'Check for invalid id in GET request');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .get(`/api/books/${chaiId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, chaiId, 'Id should match the param');
            assert.equal(res.body.title, chaiTestTitle, 'Title should match id param');
            assert.property(res.body, 'commentcount', 'Response should have commentcount property');
            assert.isArray(res.body.comments, 'Should have an array field of comments');
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
          .post(`/api/books/${chaiId}`)
          .send({ comment: 'Chai is cool' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isAtLeast(res.body.comments.length, 1, 'There should be at least one comment');
            assert.include(res.body.comments, 'Chai is cool', 'The posted comment should be in the array');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai.request(server)
          .post(`/api/books/${chaiId}`)
          .send({ comment: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment', 'Send error if no posted comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai.request(server)
          .post(`/api/books/${badId}`)
          .send({ comment: "This comment shouldn't go anywhere" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists', 'Send error for invalid id');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${chaiId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful', 'Should notify of successful deletion');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${badId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists', 'Send error of invalid id');
            done();
          });
      });
    });
  });
});
