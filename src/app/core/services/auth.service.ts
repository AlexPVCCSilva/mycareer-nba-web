import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private supabaseService: SupabaseService) {}

  async registrar(email: string, password: string, nickname: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname 
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabaseService.supabase.auth.signOut();
    if (error) throw error;
  }

  // 4. Pegar o usuário que está logado no momento
  async getUsuarioAtual() {
    const { data: { user } } = await this.supabaseService.supabase.auth.getUser();
    return user;
  }

  
}