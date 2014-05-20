var WhiskyApp = {
   tastings: new Tastings(),
   controller: new WhiskyAppController(),
   gui: new WhiskyView(),
   tablet: false,
}

// Observer auf Tastings
WhiskyApp.tastings.addObserver(WhiskyApp.gui, "update");