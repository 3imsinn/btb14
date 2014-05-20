/** Controller */
var WhiskyAppController = function() {
   var actWertung;   // Aktuell bearbeitete Wertug
   var valid = new Validator();
   
   /** Zurück auf Home.
    * Quelle: whisky-details
    * Ziel: whisky-home */
   function home() {
      if( WhiskyApp.tablet == true )
      {
         $('#delDialog').popup('close'); // Einfach schliessen, auch wenn nicht offen
         addTasting();
      }
      else
         $.mobile.changePage("#whisky-home", 
                  { transition: "slideup" } );
   }

   /** Neue Wertung erstellen.
    * Quelle: whisky-home
    * Ziel: whisky-details */
   function addTasting() {
      $.mobile.silentScroll();

      // Datum ermitteln, leider muss das ganz genau stimmen
      var ldate = new Date();
      var disp_date = "";
      if( (ldate.getMonth()+1) < 10 )
      {
         if( ldate.getDate() < 10 )
             disp_date = "0" + ldate.getDate() + ".0" + (ldate.getMonth()+1) + "." + ldate.getFullYear();
         else
            disp_date = ldate.getDate() + ".0" + (ldate.getMonth()+1) + "." + ldate.getFullYear();
      }
      else
      {
         if( ldate.getDate() < 10 )
            disp_date = "0" + ldate.getDate() + "." + (ldate.getMonth()+1) + "." + ldate.getFullYear();
         else
            disp_date = ldate.getDate() + "." + (ldate.getMonth()+1) + "." + ldate.getFullYear();
      }

      // Neues Tasting mit Default-Werten löschen
      actWertung = new Wertung(disp_date,"","","Barrel","ja","nein","","2","0", "0", "0", "0", "0", "0", "mittel", "", "" );

      // und so tun, als ob es eine gäbe...
      edit();

      valid.validate();  // erstmalige Validierung
   }
   
   /** Wertung darstellen zum editieren
    * Quelle: whisky-home
    * Ziel: whisky-details */
   function edit(guid) {
      $.mobile.silentScroll();

      // aktuelle Wertung merken, wenn nicht schon gemacht
      if( guid != undefined )
         actWertung = WhiskyApp.tastings.getWertungByID(guid);
      
      // Page wechseln
      if( WhiskyApp.tablet == false )
         $.mobile.changePage("#whisky-details", 
                  { transition: "slidedown" } );

      // Werte setzen
      refreshWertung();
      valid.validate();
   }

   /** Wertung löschen.
    * Quelle: whisky-details
    * Ziel: whisky-home */
   function deleteWertung() {
      if( actWertung != null )
         WhiskyApp.tastings.deleteID(actWertung.guid);

      if( WhiskyApp.tablet == true )
         addTasting();

      $.mobile.changePage("#whisky-home", 
                  { transition: "slideup" } );
   }

   /** Wertung speichern.
    * Quelle: whisky-details
    * Ziel: whisky-home */
   function saveWertung() {
      var w;
      // Eintrag hinzufügen
      if( actWertung == null )
         w = new Wertung();
      else // Wertung updaten
         w = actWertung;

      if( valid.validate() == false )
         return false;

      // Felder holen
      w.date = $('#date').val();
      w.distillery = $('#distillery').val();
      w.bezeichnung = $('#bezeichnung').val();
      w.fass = $('#fass').val();
      w.finishing = $('#finishing').val();
      w.proof = $('#proof').val();
      w.nr = $('#probennr').val();
      
      w.wertung = $("input:radio:checked[name='wertung']").val();
      w.gtorf = $('#torf').val();
      w.gsherry = $('#sherry').val();
      w.gholz = $('#holz').val();
      w.gfrucht = $('#frucht').val();
      w.gflora = $('#flora').val();
      w.gfeinty = $('#feinty').val();
      w.finish = $('#finish').val();
      w.kommentar = $('#kommentar').val();

      // Eintrag hinzufügen/erzeugen (wird in Methode entschieden)
      WhiskyApp.tastings.edit(w);

      if( WhiskyApp.tablet == false )
         $.mobile.changePage("#whisky-home", 
                  { transition: "slideup" } );
      else
         addTasting();
   }

   /** About-Seite als Dialog.
    * Quelle: whisky-home
    * Ziel: about.html 
    * kein changeHash: false! */
   function about() {
      $.mobile.changePage("about.html", 
               { transition: "fade", role: "dialog", } );
   }

   /** Aktualisiert Wertungs-Page
    */
   function refreshWertung() {
      // Zuweisungen
      $('#date').val(actWertung.date);
      $('#distillery').val(actWertung.distillery);
      $('#bezeichnung').val(actWertung.bezeichnung);
      $('#fass').val(actWertung.fass).selectmenu("refresh");
      $('#proof').val(actWertung.proof).slider("refresh");
      $('#finishing').val(actWertung.finishing).slider("refresh");
      $('#probennr').val(actWertung.nr);
      $('#wertung').rating('select', actWertung.wertung-1);
      $('#torf').val(actWertung.gtorf).slider("refresh");
      $('#sherry').val(actWertung.gsherry).slider("refresh");
      $('#holz').val(actWertung.gholz).slider("refresh");
      $('#frucht').val(actWertung.gfrucht).slider("refresh");
      $('#flora').val(actWertung.gflora).slider("refresh");
      $('#feinty').val(actWertung.gfeinty).slider("refresh");
      $('#finish').val(actWertung.finish).selectmenu("refresh");
      $('#kommentar').val(actWertung.kommentar);
   }

   return {
      initialize : function() {
         // Add-Button in der Liste
         $("#newWertung").click(addTasting);

         // About-Dialog
         $("#about").click(about);

         // Home-Button
         $("#home").live( 'click', home);
        
         // Delete-Button
         $("#delWertung").click(function(){ $('#delDialog').popup('open') });
         $("#delRealy").click(deleteWertung);
         $("#delNo").click(function(){ $('#delDialog').popup('close') } );
         
         // Save-Button
         $("#saveWertung").click(saveWertung);
         
         // Tooltips
         $("#labelTorf").click( function(){ $('#tooltipTorf').popup('open', {positionTo: '#torf'}) } );
         $("#labelSherry").click( function(){ $('#tooltipSherry').popup('open', {positionTo: '#sherry'}) } );
         $("#labelHolz").click( function(){ $('#tooltipHolz').popup('open', {positionTo: '#holz'}) } );
         $("#labelFrucht").click( function(){ $('#tooltipFrucht').popup('open', {positionTo: '#frucht'}) } );
         $("#labelFlora").click( function(){ $('#tooltipFlora').popup('open', {positionTo: '#flora'}) } );
         $("#labelFeinty").click( function(){ $('#tooltipFeinty').popup('open', {positionTo: '#feinty'}) } );

         // Live-Validierung
         valid.autoValidate();
      },
      /* click auf Eintrag */
      edit : function(guid) {
         edit(guid);
      },
      /* click auf Eintrag */
      firstView : function() {
         addTasting();
      }
   };
}

/** Controller aufrufen, wenn pageinit von jQM geworfen wird. */
$('#whisky-home').live("pageinit", function(event) {
   // Event-Listener Buttons
   WhiskyApp.controller.initialize();
});