import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ListaLigasComponent } from './features/dashboard-ligas/lista-ligas/lista-ligas.component'; 
import { HistoricoGeralComponent } from './features/painel-save/historico-geral/historico-geral.component'; 
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LoginComponent,
    ListaLigasComponent,
    HistoricoGeralComponent, // Adicione aqui no imports do módulo
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: '', component: ListaLigasComponent },
      { path: 'liga/:id', component: HistoricoGeralComponent } // Rota dinâmica!
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }