/** Objekt Wertung repräsentiert eine einzelne 
 * Bewertung eines Whisky.
 */
var Wertung = Class.extend({
   // Konstruktor
   init : function(date, distillery, bezeichnung, fass, proof, finishing, nr, wertung, gtorf, gsherry, gholz, gfrucht,
      gflora, gfeinty, finish, kommentar, ort) {

      // GUID als ID (somit keine Probleme bei Verteilten Einträgen)
      this.guid = this.generateGUID();

      // Allgemeine Parameter
      this.date = date;
      this.distillery = distillery;
      this.bezeichnung = bezeichnung;
      this.fass = fass;
      this.proof = proof; // Fassstärke?
      this.finishing = finishing;
      this.nr = nr; // Proben oder Fassnummer
      
      // Bewertung Whisky
      this.wertung = wertung;
      this.gtorf = gtorf;
      this.gsherry = gsherry;
      this.gholz = gholz;
      this.gfrucht = gfrucht;
      this.gflora = gflora;
      this.gfeinty = gfeinty;
      this.finish = finish;
      this.kommentar = kommentar;
   
      // Ort der Bewertung
      if(ort == null)
         this.ort = "";
      else
         this.ort = ort;
   },

   /**
    * Gibt eine Bezeichnung der Wertung zurück.
    */
   getName : function() {
      return this.distillery + ": " +  this.bezeichnung + " - Wertung am " + this.date;
   }
});

/** Objekt Tastings - Container für Wertungen
 *  mit den üblichen CRUD-Funktionen.
 */
var Tastings = Observer.extend({
   init : function() {
      this._super();
      this.wertungsAr = new Array();
   },
   
   // Nun die CRUD Funktionen
   /** Tastings setzen */
   setWertungen : function(array) {
      this.wertungsAr = array;

      // update
      this.notify({obj: this.wertungsAr, crud: "R"});
   },
   
   /** (C) Erzeugt eine Wertung und fügt diese hinzu.
    */
   create : function(date, distillery, bezeichnung, fass, proof, finishing, nr, wertung, gtorf, gsherry, gholz, gfrucht,
         gflora, gfeinty, finish, kommentar, ort) {
   
      // Wertung erzeugen
   	var wertung = new Wertung(date, distillery, bezeichnung, fass, proof, finishing, nr, wertung, gtorf, gsherry, gholz, gfrucht,
         gflora, gfeinty, finish, kommentar, ort);
   
      // dem Array hinzufügen      
      this.wertungsAr.push(wertung);

      // update
      this.notify({obj: wertung, crud: "C"});
   },
   
   /** (C) Fügt einen Eintrag hinzu, mit Wertungs-Objekt
    */
   add : function(wertung) {
         // dem Array hinzufügen      
      this.wertungsAr.push(wertung);

      // update
      this.notify({obj: wertung, crud: "C"});
   },
   
   /** (R) Sucht die Wertung mit der GUID.
    */
   getWertungByID : function(guid) {
   	for ( var i = 0; i < this.wertungsAr.length; i++) {
   		if (this.wertungsAr[i].guid == guid) {
   			return this.wertungsAr[i];
   		}
   	}
   },
   
   /** (R) Array mit Wertungen zurückgeben
    */
   getWertungen : function() {
      return this.wertungsAr;
   },
   
   /** (U) Aktualisiert die Wertung.
    * Wenn diese nicht vorhanden ist, wird eine neue erzeugt.
    */
   edit : function(wertung) {
      var gefunden = 0;
      
      for ( var i = 0; i < this.wertungsAr.length; i++) {
         if (this.wertungsAr[i].guid == wertung.guid) {
            // Wertung gefunden, nun ersetzen
            this.wertungsAr[i] = wertung;
            gefunden = 1;
            this.notify({obj: wertung, crud: "U"});
         }
      }
      
      // existiert keine, dann hinzufügen
      if( gefunden == 0 )
         this.add(wertung);
   },

   /** (D) Löscht die Wertung mit der GUID.
    */
   deleteID : function(guid) {
   	for ( var i = 0; i < this.wertungsAr.length; i++) {
   		if (this.wertungsAr[i].guid == guid) {
   			var deleted = this.wertungsAr.splice(i, 1);
            this.notify({obj: deleted[0], crud: "D"});
   			return;
   		}
   	}
   }
});
