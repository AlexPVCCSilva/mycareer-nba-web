import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Evita que o erro do LockManager do Supabase (ocasionado pelo Live Reload) quebre a aplicação
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.message && event.reason.message.includes('NavigatorLockAcquireTimeoutError')) {
    event.preventDefault();
  }
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
