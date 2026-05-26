import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  confirmPassword = ''; 
  nickname = '';       
  
  isLoginMode = true;
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.nickname = '';
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha os campos obrigatórios!';
      return;
    }

    if (!this.isLoginMode) {
      if (!this.nickname) {
        this.errorMessage = 'Por favor, insira um Nickname!';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não batem! Digite novamente.';
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.registrar(this.email, this.password, this.nickname);
      }
      
      console.log('Sucesso! Logado no sistema.');
      this.router.navigate(['/']); 
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao conectar. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}