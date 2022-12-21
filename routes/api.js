const mongoose = require('mongoose');
/* eslint-disable no-underscore-dangle */
/*
*
*
*       Complete the API routing below
*
*
*/

module.exports = (app, book) => {
  app.route('/api/books')
    .get((req, res) => {
      book.find({}, (err, books) => {
        res.json(books);
      });
      // // should we be looking for an id query here at all? see get method later...
      // // get route query (id)
      // const searchId = req.query._id;
      // // check for valid id in query
      // const isValidId = mongoose.Types.ObjectId.isValid(searchId);
      // // if there is no query (undefined) or if the query contains a valid id
      // if (searchId === undefined || isValidId) {
      //   // determine if there is an id query
      //   const searchParam = (searchId) ? { _id: searchId } : {};
      //   // get all/one doc(s) based on the query
      //   book.find(searchParam, (err, books) => {
      //     if (books.length >= 1) {
      //       res.json(books);
      //     } else {
      //       // return 'no book exists' if there is no result
      //       res.send('no book exists');
      //     }
      //   });
      // } else {
      //   // return 'no book exists' for invalid id
      //   res.send('no book exists');
      // }
    })

    .post((req, res) => {
      // const { title } = req.body;
      // console.log(title);
      // response will contain new book object including atleast _id and title
      // check for required field
      if (!req.body.title) {
        res.json('missing required field title');
      } else {
        // insert new book (no error checking if already exists)
        book.create({ title: req.body.title }, (err, newBook) => {
          if (err) console.log(err);
          res.json(newBook); // all details
          // res.json({ _id: newBook._id, title: newBook.title }); // just _id and title
        });
      }
    })

    .delete((req, res) => {
      // if successful response will be 'complete delete successful'
      book.deleteMany({}, (err, data) => {
        if (data.deletedCount > 0) {
          console.log('deleted all');
          res.send('complete delete successful'); // not working
        } else {
          console.log('no books to delete');
          res.send('no books to delete'); // not working
        }
        // // not working
        // if (!err && data) {
        //   return res.send('complete delete successful');
        // }
        // return res.send('error deleting');
      });
    });

  app.route('/api/books/:id')
    .get((req, res) => {
      const bookid = req.params.id;
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      // if invalid id, return 'no book exists'
      if (!mongoose.Types.ObjectId.isValid(bookid)) res.json('no book exists');
      // if valid id
      else {
        book.findById(bookid, (err, bookResult) => {
          // console.log(bookResult,);
          if (err) console.log(err);
          // if null, return 'no book exists'
          else if (!bookResult) res.json('no book exists');
          // if book exists, return the book
          else res.json(bookResult);
        });
      }
    })

    .post(async (req, res) => {
      const bookid = req.params.id;
      const { comment } = req.body;
      // if invalid id, return 'no book exists'
      if (!mongoose.Types.ObjectId.isValid(bookid)) res.send('no book exists');
      // if no comment, return 'missing req'd field'
      else if (!comment) res.json('missing required field comment');
      else {
        const bookToUpdate = await book.findById(bookid);
        if (!bookToUpdate) res.json('no book exists');
        else {
          bookToUpdate.commentcount += 1;
          bookToUpdate.comments.push(comment);
          await bookToUpdate.save();
          res.json(bookToUpdate);
        }
      }
    })

    .delete((req, res) => {
      const bookid = req.params.id;
      // if successful response will be 'delete successful'
      if (!mongoose.Types.ObjectId.isValid(bookid)) res.json('no book exists');
      // if valid id
      else {
        book.findByIdAndDelete(bookid, (err, bookResult) => {
          // console.log(bookResult,);
          if (err) console.log(err);
          // if null, return 'no book exists'
          else if (!bookResult) res.json('no book exists');
          // if book exists, return the book
          else res.json('delete successful');
        });
      }
    });
};
