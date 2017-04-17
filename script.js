function randomArticle() {
   $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&generator=random&grnnamespace=0&callback=?", function(result)  {
      // button Choose For Me ready to be clicked again
      $("#random").attr("disabled", false);
      // hiding intro (empty state) before displaying the response from API
      cleanIntro();
      $.each(result.query.pages, function(key, page){
         $("#random-result-title").html('<a href="http://en.wikipedia.org/?curid=' + page.pageid + '">' + page.title + '</a>');
         $("#random-result").html(page.extract);
         return false; //to display 1st element and finish the loop
      });
      $(".random-result").slideDown(function () {
         arrowBack();
      });
   });
}

function searchArticle(query){
   $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&grnnamespace=0&prop=extracts&exlimit=max&explaintext&exintro&gsrsearch=" + query + "&callback=?", function(result) {
      // button Choose For Me ready to be clicked again
      $("#query-button").attr("disabled", false);
      // hiding intro (empty state) before displaying the result from API
      cleanIntro();
      if (result.hasOwnProperty("query")) {
         $.each(result.query.pages, function(key, page){
            var extract = page.extract.length > 464 ? page.extract.substring(0,464) + "..." : page.extract;
            $("#article-list").append('<li><h2><a href="http://en.wikipedia.org/?curid=' + page.pageid + '">' + page.title + '</a></h2>' + '<p>' + extract + '</p>' + '</li>');
         });
      } else {
         hintChange(true);
      }
      arrowBack();
   });
}

function cleanIntro (){
   $(".intro").hide();
}

function hintChange (turnOn) {
   if (turnOn) {
     $("#no-query").removeClass("hidden");
     $("#random").addClass("look");
   } else {
     $("#no-query").addClass("hidden");
     $("#random").removeClass("look");
   }
}

// back-to-top link visibility set
function arrowBack (){
   if (!$(".intro").is(":visible") && $("body").height() - $("footer").height() > $(window).height()){
      $("#back-to-top").removeClass("hidden");
   } else {
      $("#back-to-top").addClass("hidden");
   }
}

$(document).ready(function() {
   $("#random").on("click", function(e) {
      // random button unfocusing
      $(this).blur();
      // disable the button before getting the response from API
      $(this).attr("disabled", true);
      // hiding article-list
      $("#article-list").hide();
      // hiding no-query help text and removing yellow look background of random after random being chosen
      hintChange(false);
      randomArticle();
      e.preventDefault();
   });
   $("#query-button").on("click", function(e) {
      // cleaning after previous search
      $("#article-list").html(""); 
      // making article-list visible again
      $("#article-list").show();
      // cleaning random result if displayed
      $(".random-result").slideUp(function (){
         // when content slided up calling arrowBack() when query is empty back-to-top section
         arrowBack();
      });
      if ($("#query").val() === "") {
         // if input is empty let's display empty state help and clean intro image
         cleanIntro();
         hintChange(true);
         // if random hovered over #no-query span class removed else visible
         $("#random").hover(function() {
               $("#no-query span").removeClass("accent-hint");
            }, function() {
               $("#no-query span").addClass("accent-hint");
            });
      } else {
         // disable the button before getting the response from API
         $(this).attr("disabled", true);
         // passing input text
         searchArticle($("#query").val()); 
         hintChange(false);
      }
      e.preventDefault();
   });
   // back-to-top focus 
   $("#arrow-top").on("click", function() {
      $("#query").focus().select();
   });
});
