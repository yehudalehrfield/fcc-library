/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
$(document).ready(() => {
  const items = [];
  let itemsRaw = [];

  $.getJSON('/api/books', (data) => {
    // let  items = [];
    itemsRaw = data;
    $.each(data, (i, val) => {
      items.push(`<li class="bookItem" id="${i}">${val.title} - ${val.commentcount} comments</li>`);
      return (i !== 14);
    });
    // console.log(`Num books: ${itemsRaw.length()}`);
    if (items.length >= 15) {
      items.push(`<p>...and ${data.length - 15} more!</p>`);
    }
    $('<ul/>', {
      class: 'listWrapper',
      html: items.join(''),
    }).appendTo('#display');
  });

  let comments = [];
  $('#display').on('click', 'li.bookItem', () => {
    $('#detailTitle').html(`<b>${itemsRaw[this.id].title}</b> (id: ${itemsRaw[this.id]._id})`);
    $.getJSON(`/api/books/${itemsRaw[this.id]._id}`, (data) => {
      comments = [];
      $.each(data.comments, (i, val) => {
        comments.push(`<li>${val}</li>`);
      });
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      comments.push(`<br><button class="btn btn-info addComment" id="${data._id}">Add Comment</button>`);
      comments.push(`<button class="btn btn-danger deleteBook" id="${data._id}">Delete Book</button>`);
      $('#detailComments').html(comments.join(''));
    });
  });

  $('#bookDetail').on('click', 'button.deleteBook', function () {
    $.ajax({
      url: `/api/books/${this.id}`,
      type: 'delete',
      success(data) {
        // update list
        $('#detailComments').html(`<p style="color: red;">${data}<p><p>Refresh the page</p>`);
      },
    });
  });

  $('#bookDetail').on('click', 'button.addComment', function () {
    const newComment = $('#commentToAdd').val();
    $.ajax({
      url: `/api/books/${this.id}`,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success(data) {
        comments.unshift(newComment); // adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      },
    });
  });

  $('#newBook').click(() => {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success(data) {
        // update list
      },
    });
  });

  $('#deleteAllBooks').click(() => {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success(data) {
        // update list
      },
    });
  });
});
