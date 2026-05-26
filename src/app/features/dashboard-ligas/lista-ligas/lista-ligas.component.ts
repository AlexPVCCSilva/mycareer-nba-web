import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Adicionado!
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-lista-ligas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-ligas.component.html',
  styleUrls: ['./lista-ligas.component.scss']
})
export class ListaLigasComponent implements OnInit {
  nickname = '';
  userId = ''; 
  ligas: any[] = [];
  carregando = true;
// Variáveis do Formulário de Entrar na Liga
  mostrarModalEntrar = false;
  codigoConvite = '';
  entrandoLiga = false;
  // Variáveis do Formulário de Nova Liga
  mostrarModalCriar = false;
  novaLiga = { nome: '', era: '', ano: '' };
  salvandoLiga = false;

  constructor(
    private authService: AuthService, 
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getUsuarioAtual();
      if (!user) {
        this.router.navigate(['/login']); 
        return;
      }
      this.nickname = user.user_metadata?.['nickname'] || 'Treinador';
      this.userId = user.id; 
      this.ligas = await this.supabaseService.getMinhasLigas(this.userId);
    } catch (error) {
      console.error('Ó bosta, erro ao carregar:', error);
    } finally {
      this.carregando = false;
    }
  }

  abrirModal() {
    this.mostrarModalCriar = true;
  }

  fecharModal() {
    this.mostrarModalCriar = false;
    this.novaLiga = { nome: '', era: '', ano: '' };
  }

  async criarNovaLiga() {
    if (!this.novaLiga.nome || !this.novaLiga.era || !this.novaLiga.ano) {
      alert('Preencha todos os campos!');
      return;
    }

    this.salvandoLiga = true;
    try {
      const ligaCriada = await this.supabaseService.criarLiga(
        this.novaLiga.nome, 
        this.novaLiga.era, 
        this.novaLiga.ano, 
        this.userId
      );
      
      console.log('Liga criada com sucesso!', ligaCriada);
      this.ligas.push(ligaCriada); // Joga a liga nova na tela
      this.fecharModal();
      
    } catch (error) {
      console.error('Ó bosta, falha ao criar liga:', error);
      alert('Erro ao criar liga no banco.');
    } finally {
      this.salvandoLiga = false;
    }
  }

  async sair() {
    await this.authService.logout();
    this.router.navigate(['/login']);
    }
  acessarLiga(ligaId: string) {
    this.router.navigate(['/liga', ligaId]);
  }
  abrirModalEntrar() {
    this.mostrarModalEntrar = true;
  }

  fecharModalEntrar() {
    this.mostrarModalEntrar = false;
    this.codigoConvite = ''; 
  }

  async entrarLiga() {
    if (!this.codigoConvite) {
      alert('Por favor, digite um código de convite!');
      return;
    }

    this.entrandoLiga = true;
    try {
      await this.supabaseService.entrarLigaComCodigo(this.codigoConvite, this.userId);
      alert('Sucesso! Bem-vindo à nova liga!');
      
      this.fecharModalEntrar();
      
      this.carregando = true;
      this.ligas = await this.supabaseService.getMinhasLigas(this.userId);
      this.carregando = false;
      
    } catch (error: any) {
      console.error('Ó bosta, falha no convite:', error);
      alert(error.message || 'Erro ao processar o convite.');
    } finally {
      this.entrandoLiga = false;
    }
  }

}