import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async criarLiga(nome: string, era_2k: string, ano_inicio: string, admin_id: string) {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    const codigo_convite = `LIGA-${codigo}`;

    const { data, error } = await this.supabase
      .from('ligas')
      .insert([
        { nome, era_2k, ano_inicio, admin_id, codigo_convite }
      ])
      .select();
    if (error) throw error;
    return data[0];
  }

  // 1. Atualizamos esta função para buscar ligas criadas E ligas convidadas
  async getMinhasLigas(userId: string) {
    // Busca as ligas que o Alex criou
    const { data: ligasAdmin } = await this.supabase
      .from('ligas')
      .select('*')
      .eq('admin_id', userId);

    // Busca os IDs das ligas que o Alex foi convidado
    const { data: convites } = await this.supabase
      .from('membros_liga')
      .select('liga_id')
      .eq('user_id', userId);

    let ligasConvidado: any[] = [];
    
    // Se achou algum convite, vai lá na tabela de ligas buscar os dados delas
    if (convites && convites.length > 0) {
      const ids = convites.map(c => c.liga_id);
      const { data: ligasMembro } = await this.supabase
        .from('ligas')
        .select('*')
        .in('id', ids); // Puxa todas de uma vez baseada na lista de IDs
      if (ligasMembro) ligasConvidado = ligasMembro;
    }

    // Junta as ligas próprias com as convidadas e ordena por data
    const todasLigas = [...(ligasAdmin || []), ...ligasConvidado];
    todasLigas.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return todasLigas;
  }

  // 2. A nova função de validar e entrar com código
  async entrarLigaComCodigo(codigo: string, userId: string) {
    const codigoFormatado = codigo.trim().toUpperCase();

    // Procura a liga no banco
    const { data: liga, error: erroBusca } = await this.supabase
      .from('ligas')
      .select('id, admin_id')
      .eq('codigo_convite', codigoFormatado)
      .single(); // Espera achar só 1 resultado

    if (erroBusca || !liga) {
      throw new Error('Código inválido ou liga não encontrada!');
    }

    if (liga.admin_id === userId) {
      throw new Error('Você já é o administrador deste save!');
    }

    // Se passou pelas travas, insere o cara na tabela de membros
    const { error: erroMembro } = await this.supabase
      .from('membros_liga')
      .insert([{ liga_id: liga.id, user_id: userId }]);

    // O código 23505 do Postgres significa "Violação de campo Único"
    if (erroMembro) {
      if (erroMembro.code === '23505') throw new Error('Você já participa desta liga!');
      throw erroMembro;
    }

    return liga.id;
  }

  async getHistoriaGeralPorLiga(ligaId: string) {
    const { data, error } = await this.supabase
      .from('historia_geral')
      .select('*')
      .eq('liga_id', ligaId)
.order('temporada', { ascending: false });
    if (error) {
      console.error('Erro ao buscar história geral:', error);
      return [];
    }
    return data;
  }

  async salvarTemporadaGeral(dados: any) {
    const { data, error } = await this.supabase
      .from('historia_geral')
      .insert([dados])
      .select();

    if (error) throw error;
    return data[0];
  }
  async getFranquiasPorLiga(ligaId: string) {
    const { data, error } = await this.supabase
      .from('franquias_liga')
      .select('*')
      .eq('liga_id', ligaId)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar times:', error);
      return [];
    }
    return data;
  }

  async criarFranquia(ligaId: string, nome: string, corHex: string) {
    const { data, error } = await this.supabase
      .from('franquias_liga')
      .insert([{ liga_id: ligaId, nome, cor_hex: corHex }])
      .select();

    if (error) throw error;
    return data[0];
  }

  // Busca as temporadas jogadas por uma franquia específica usando o NOME do time
  async getCampanhasDaFranquia(ligaId: string, nomeFranquia: string) {
    const { data, error } = await this.supabase
      .from('campanhas_franquias')
      .select('*')
      .eq('liga_id', ligaId)
      .eq('franquia', nomeFranquia) // A sua coluna de texto original!
.order('temporada', { ascending: false });
    if (error) {
      console.error('Erro ao buscar campanhas do time:', error);
      return [];
    }
    return data;
  }

  async salvarCampanhaFranquia(dados: any) {
    const { data, error } = await this.supabase
      .from('campanhas_franquias')
      .insert([dados])
      .select();

    if (error) throw error;
    return data[0];
  }
  async getHallDaFamaDaFranquia(ligaId: string, nomeFranquia: string) {
    const { data, error } = await this.supabase
      .from('hall_da_fama')
      .select('*')
      .eq('liga_id', ligaId)
      .eq('franquia', nomeFranquia)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar o Hall da Fama:', error);
      return [];
    }
    return data;
  }

  async adicionarAoHallDaFama(dados: any) {
    const { data, error } = await this.supabase
      .from('hall_da_fama')
      .insert([dados])
      .select();

    if (error) throw error;
    return data[0];
  }
  // Atualiza uma temporada da História Geral
  async atualizarTemporadaGeral(id: string, dados: any) {
    const { data, error } = await this.supabase
      .from('historia_geral')
      .update(dados)
      .eq('id', id) // Procura a linha exata pelo ID
      .select();

    if (error) throw error;
    return data[0];
  }

  // Atualiza uma campanha do Elenco/Time
  async atualizarCampanhaFranquia(id: string, dados: any) {
    const { data, error } = await this.supabase
      .from('campanhas_franquias')
      .update(dados)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  // --- Serviço de Lembranças e Notícias ---
  async getLembrancasPorLiga(ligaId: string) {
    const { data, error } = await this.supabase
      .from('lembrancas_liga')
      .select('*')
      .eq('liga_id', ligaId)
      // Traz as postagens mais novas primeiro
      .order('id', { ascending: false }); 

    if (error) throw error;
    return data;
  }

  async salvarLembranca(dados: any) {
    const { data, error } = await this.supabase
      .from('lembrancas_liga')
      .insert([dados])
      .select();

    if (error) throw error;
    return data[0];
  }

  async deletarLembranca(id: string) {
    const { error } = await this.supabase
      .from('lembrancas_liga')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}