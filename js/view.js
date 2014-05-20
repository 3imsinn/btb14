/**
 *  UPDATE METHODE
 *  Aktualisiert der Wertungs-Liste */
var WhiskyView = View.extend({
   init : function() {
      this._super();
   },
   /** Sortierung des Tasting-Arrays */
   sortAlg : function(a, b) {
      a = a.distillery.toLowerCase();
      b = b.distillery.toLowerCase();
      return (a == b) ? 0 : (a > b) ? 1 : -1;
   },
   /** GUI aktualisieren */
   update : function(scope, data) {
      var actTitel = "";
      var count = 0;
      var line = "";

      // (1) Alte Listview löschen
      $('#whiskylist ul li').remove();

      var ar = scope.getWertungen(); // (2) alle Wertungen lesen
      ar.sort(this.sortAlg);         // und sortieren

      // (3) Durch die Wertungen gehen
      for(var i = 0; i < ar.length; i++) {
         // Titel
         if(ar[i].distillery != actTitel) {
            if(newEntryRowTitle != null) {
               // Anzahl Wertungen der letzten Distillery setzen
               newEntryRowTitle.find('.ui-li-count').text(count);
               count = 0;
            }
            var newEntryRowTitle = $('#titleTemplate').clone();
            actTitel = ar[i].distillery;
            newEntryRowTitle.find('#label').text(actTitel);
            newEntryRowTitle.appendTo('#whiskylist ul');
         }

         // (4) Allg. Informationen
         count++;
         var newEntryRow = $('#entryTemplate').clone();
         newEntryRow.jqmData('entryId', ar[i].guid);
         newEntryRow.find('#ui-li-title').text(ar[i].bezeichnung);
         if(ar[i].proof == "ja")
            newEntryRow.find('#ui-li-fass').html(ar[i].fass+", Fassstärke");
         else
            newEntryRow.find('#ui-li-fass').html(ar[i].fass);
         newEntryRow.find('#forsearch').text(ar[i].distillery);
         // Finish darstellen
         line = "";
         if( ar[i].finish == "mittel" )
            line = line + "&ndash;";
         if( ar[i].finish == "lang" )
            line = line + "&ndash;&ndash;";
         if( ar[i].finish == "sehrlang" )
            line = line + "&ndash;&ndash;&ndash;";
         newEntryRow.find('.ui-li-aside').html(line);
         
         // Wertung (Sterne)
         newEntryRow.find('input[value='+ar[i].wertung+']').prop('checked', true);
         newEntryRow.find('input[type=radio]').prop('name', 'list-'+i);
            
         // Bilder setzen
         if (ar[i].gfrucht >= 5)
            newEntryRow.find('.ui-li-icon').attr("src", "img/fruit.png");
         if (ar[i].gsherry >= 5)
            newEntryRow.find('.ui-li-icon').attr("src", "img/cherry.png");
         if (ar[i].gtorf >= 5)
            newEntryRow.find('.ui-li-icon').attr("src", "img/peat.png");
            
         // Event-Listener setzen auf Clicken
         newEntryRow.click(function() {
            WhiskyApp.controller.edit($(this).jqmData('entryId'));
         });

         // (5) Der Liste hinzufügen
         newEntryRow.appendTo('#whiskylist ul');
      }

      // Anzahl Wertungen der letzten Distillery setzen
      if (newEntryRowTitle != null) {
         newEntryRowTitle.find('.ui-li-count').text(count);
      }

      // (6) Alle Radio-Buttons rendern, aber nur die hinzugefügten, nicht das Muster!
      $('#whiskylist ul li input[type=radio]').rating();
   }
});

/**
 * Bevor die Seite erzeugt wird, je nach Auflösung die Pages/Contents umhängen. */
$(document).bind("pagebeforecreate", function(){
   var winwidth = $(window).width();

   // Je nach Auflösung...
   if(winwidth >= 650) {
      var element = $('#whiskydetail').html();
      $('#whiskydetails').append(element);
      $('#whisky-details').remove();
      WhiskyApp.tablet = true;
   } else {
      $('#whiskylist').removeClass("content-list");
      $('#whiskydetails').remove();
   }
});

/**
 * Event für neues Tasting darstellen. */
$('#whisky-home').live("pageshow", function(event, ui) {
   if(WhiskyApp.tablet == true)
      WhiskyApp.controller.firstView();
});
