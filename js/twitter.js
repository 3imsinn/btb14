// Wir beginnen mit jQuery und warten auf das ready-Event des DOM
  // Das Dollarsymbol innerhalb der anonymen Funktion ist eine Abkürzung für das jQuery Objekt
  jQuery(document).ready(function($){
    // Zwischenspeichern der Twitter API URL
    var twitter_api_url = 'http://search.twitter.com/search.json';

    // Nun weisen wir unserem Link in der Form einen click-Eventhandler zu
    $("#tweets").load(function(){

    // Wir lesen den Usernamen aus dem value-Attribut des Inputfeldes aus
    // var twitter_user = $("#search").val();

    // und bauen daraus die komplette URL für unseren AJAX-Request zusammen
    var url = twitter_api_url + '?callback=?&rpp=5&q=from:3imsinn';

    // Wir beginnen mit unserem AJAX-Request
    $.ajax({
      // An die url, die wir oben zusammengebaut haben
      url: url,
      // Die Abfrage soll vom Browser gecacht werden
      cache: true,
      // Ist vom Typ GET
      type: "GET",
      // jQuery, soll die empfangen Daten nicht vorverarbeiten, dass machen wir alles selber
      processData: false,
      // Wir erwarten folgenden Content vom Twitterserver
      contentType: "application/json; charset=utf-8",
      // und es ist ein JSONP
      dataType: "jsonp",
      // Ist der Request erfolgreich und wir empfangen etwa vom Server, dann führe folgende Funktion aus
      success: function (serverData) {
        // Überprüfen wir erstmal, ob der User überhaupt existiert, also wird seine user id größer als 0 sein
        if (serverData.max_id > 0)
        {
            // uns interessieren nur die Ergebnisse
            serverData = serverData["results"];
            // leeren wir alles was im Content-Bereich der zweiten inner page steht
            $('#tweets').empty();

            // Bauen wir unser Ergebnisliste
            var tweet_html='<ul id="resultList">',
            // Zum Cachen
            fromUser="";
            // Jetzt gehen wir alle Ergebnisse mit einer Schleife durch 
            $.each(serverData, function(i, tweet) { 
              // Und holen uns aus dem allerersten Ergebnis den Usernamen und speichern den in unserer Cache-Variable 
              if (i===0){ fromUser = tweet.from_user; } 

              // Nun bauen wir unseren Tweet zusammen und fügen ihn jedesmal zu unserer String-Variable "tweet_html" hinzu 
              tweet_html += '<li class="tweet_text" style="display: none;">'; 
              tweet_html += '<h3>'+fromUser+'<\/h3>'; 
              tweet_html += ''+tweet.text + '<\/p><\/li>';
            }); 

            // schließen wir die Liste ab 
            tweet_html +='<\/ul>';
            
            // und fügen sie unserem Platzhalter hinzu 
            $('#tweets').append(tweet_html) 

            // Weil wir die Twitterdaten clientseitig hinzufügen, sind diese zum Zeitpunkt 
            // bei dem jQuery Mobile initialisiert wird nicht vorhanden. 
            // Deswegen machen wir das nachträglich 
            $('#resultList').listview({ theme: "c", countTheme: "c", headerTheme: "c", dividerTheme: "c", splitTheme: "c", 

            // und fügen sogar eine Suchfunktion hinzu 
            filter: true }) 

            // Nun blenden wir die Liste ein 
            .children().fadeIn(); 
          } 

          // exisitert der User nicht, wird eine Fehlermeldung eingeblendet 
          else { 
            $('#tweets').text("Sorry, nothing for #btb14 up to now."); 
          } 
        }, 

        // Erhalten wir vom Twitterserver keine Antwort geben wir die entsprechende Fehlermeldung aus. 

        error: function (XMLHttpRequest, textStatus, errorThrown) { 
          alert("fehler: " + errorThrown); 
        } 
      }); 
    });