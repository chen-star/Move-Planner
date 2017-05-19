// Ajax is a library in Javascript


function loadData() {
    // $ means this is an Ajax object
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    // load streetview
    var address = $("#street").val() + " ," + $("#city").val();
    $greeting.text("So, you want to live at "+address+"?");
    var addressURL = "https://maps.googleapis.com/maps/api/streetview?size=600x450&location="+address;
    $body.append('<img class="bgimg" src= "'+addressURL+'">');


    // load NYTimes AJAX request
    var articlURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+city+"&sort=newest&api-key=73d67b070e914634b7c3dc46fe5f14da";
    var city = $("#city").val();
    //.getJSON() will be invoked when receiving the response from NYT
    $.getJSON(articlURL, function(data){

        $nytHeaderElem.text('New York times Articles About '+city);

        var articles = data.response.docs;
        for (var i = 0; i<articles.length;i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>'+article.snippet+'</p>'+'</li>');
        }
        }).error(function(e){ //error handling
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    // load Wikipdeia Articles
    var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&format=json&callback=wikiCallback";
    var wikiTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    },8000);

    $.ajax(wikiURL,{
        dataType: 'jsonp',
        success: function(response){
            var articleList = response[1];

            for (var i = 0;i<articleList.length;i++){
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+
                    articleStr+'</a></li>');
            }
            clearTimeout(wikiTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);
