// Part Two - Movies App!
// Build an application that uses jQuery to do the following:
// Contains a form with two inputs for a title and rating along with a button to submit the form.
// When the form is submitted, capture the values for each of the inputs and append them to the DOM along with a button to remove each title and rating from the DOM.
// When the button to remove is clicked, remove each title and rating from the DOM.


$("#submit").on("click", function(e){
    e.preventDefault();
    let movie = $("#movie").val();
    let rank = $("#rank").val();
    $('body').append(`<div id="newDiv">${movie} is a ${rank} / 10</div>`).append('<button id="delete">Delete</button>');
    $('#delete').on('click', function(e){
      $('#newDiv, #delete').remove();
    });
    $('#movie').val('');
    $('#rank').val('');
})
