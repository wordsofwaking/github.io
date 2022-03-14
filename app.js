
function createGif(res) {
    const gif = res.data.length;
    let randGif = Math.floor(Math.random() * gif);
    let $newDiv = $("<div>");
    let $newGif = $("<img>", {src: res.data[randGif].images.original.url})
    $newDiv.append($newGif);
    $("div").append($newDiv);
}

$("form").on("submit", async function(e) {
     e.preventDefault();
     const keyword = $("#input-form").val();
     const res = await axios.get('http://api.giphy.com/v1/gifs/search', { params: {q: keyword, api_key: "di6RKA1QQhdgJtYo7OgjRW9664gX6iVl"}})
     console.log(res);
     $("#input-form").val("");
     createGif(res.data);
 })
 
 $("#delete-btn").on("click", function() {
    $("div").empty();
  });

 
//  keeps doubling my images, work with Don on this.
