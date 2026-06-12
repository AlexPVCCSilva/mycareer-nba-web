import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export type StatusElenco = 'principal' | 'secundario' | 'terciario' | 'nenhum';

export interface ITemporadaGeral {
  id?: string;
  liga_id: string;
  temporada: string;
  campeao_oeste: string | null;
  campeao_leste: string | null;
  campeao_nba: string | null;
  resultado_finais: string | null;
  mvp: string | null;
  rookie_of_the_year: string | null;
  sixth_man: string | null;
  dpoy: string | null;
  mip: string | null;
  mvp_time: string | null;
  rookie_of_the_year_time: string | null;
  sixth_man_time: string | null;
  dpoy_time: string | null;
  mip_time: string | null;
  executivo_do_ano?: string | null;
  executivo_do_ano_time?: string | null;
}

export interface ICampanhaFranquia {
  id?: string;
  liga_id: string;
  franquia: string;
  temporada: string;
  recorde_wl: string | null;
  rank_conferencia: number | null;
  resultado_playoffs: string | null;
  pg: string | null;
  sg: string | null;
  sf: string | null;
  pf: string | null;
  c: string | null;
  sexto_homem: string | null;
  draftado: string | null;
  observacoes: string | null;
  pg_ovr: number | null;
  sg_ovr: number | null;
  sf_ovr: number | null;
  pf_ovr: number | null;
  c_ovr: number | null;
  sexto_homem_ovr: number | null;
  draftado_ovr: number | null;
  pg_status: StatusElenco;
  sg_status: StatusElenco;
  sf_status: StatusElenco;
  pf_status: StatusElenco;
  c_status: StatusElenco;
  sexto_homem_status: StatusElenco;
  draftado_status: StatusElenco;
}

export interface IJogadorFotoCustom {
  id?: string;
  liga_id: string;
  jogador_nome: string;
  jogador_nome_normalizado: string;
  foto_url: string;
  origem: 'base64' | 'supabase';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;
  private readonly tabelaFotosJogadores = 'jogadores_fotos_custom';
  private readonly bucketFotosJogadores = 'jogadores-fotos';

  /** Remove prefixos de OVR (ex: "99 - ", "OVR 98:", "85–") */
  static limparNomeJogador(nome: string | null | undefined): string {
    if (!nome) return '';
    let limpo = nome.trim();
    const prefixoOvr = /^\s*(?:ovr\s*)?\d{1,3}\s*[-–—:/]+\s*/i;
    while (prefixoOvr.test(limpo)) {
      limpo = limpo.replace(prefixoOvr, '').trim();
    }
    return limpo.replace(/\s+/g, ' ').trim();
  }

  /** Chave canônica para banco e cache (ex: "lebron james") */
  static normalizarNomeJogador(nome: string | null | undefined): string {
    return SupabaseService.limparNomeJogador(nome).toLowerCase().replace(/\s+/g, ' ').trim();
  }

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

  async getHistoriaGeralPorLiga(ligaId: string): Promise<ITemporadaGeral[]> {
    const { data, error } = await this.supabase
      .from('historia_geral')
      .select('*')
      .eq('liga_id', ligaId)
.order('temporada', { ascending: false });
    if (error) {
      console.error('Erro ao buscar história geral:', error);
      return [] as ITemporadaGeral[];
    }
    return (data || []) as ITemporadaGeral[];
  }

  async salvarTemporadaGeral(dados: ITemporadaGeral) {
    const { data, error } = await this.supabase
      .from('historia_geral')
      .insert([dados])
      .select();

    if (error) throw error;
    return data[0] as ITemporadaGeral;
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

  async criarFranquia(ligaId: string, nome: string, corHex: string, logoUrl: string | null = null) {
    const { data, error } = await this.supabase
      .from('franquias_liga')
      .insert([{ liga_id: ligaId, nome, cor_hex: corHex,logo_url: logoUrl }])
      .select();

    if (error) throw error;
    return data[0];
  }

  // Busca as temporadas jogadas por uma franquia específica usando o NOME do time
  async getCampanhasDaFranquia(ligaId: string, nomeFranquia: string): Promise<ICampanhaFranquia[]> {
    const { data, error } = await this.supabase
      .from('campanhas_franquias')
      .select('*')
      .eq('liga_id', ligaId)
      .eq('franquia', nomeFranquia) // A sua coluna de texto original!
.order('temporada', { ascending: false });
    if (error) {
      console.error('Erro ao buscar campanhas do time:', error);
      return [] as ICampanhaFranquia[];
    }
    return (data || []) as ICampanhaFranquia[];
  }

  async salvarCampanhaFranquia(dados: ICampanhaFranquia) {
    const { data, error } = await this.supabase
      .from('campanhas_franquias')
      .insert([dados])
      .select();

    if (error) throw error;
    return data[0] as ICampanhaFranquia;
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

  async salvarOuAtualizarHallDaFama(lendas: any[], idsParaDeletar: string[]) {
    if (idsParaDeletar.length > 0) {
      const { error: erroDel } = await this.supabase
        .from('hall_da_fama')
        .delete()
        .in('id', idsParaDeletar);
      if (erroDel) throw erroDel;
    }

    if (lendas.length > 0) {
      const { error: erroUpsert } = await this.supabase
        .from('hall_da_fama')
        .upsert(lendas); // Supabase atualiza se tiver 'id', senão insere
      if (erroUpsert) throw erroUpsert;
    }
  }

  // Atualiza uma temporada da História Geral
  async atualizarTemporadaGeral(id: string, dados: Partial<ITemporadaGeral>) {
    const { data, error } = await this.supabase
      .from('historia_geral')
      .update(dados)
      .eq('id', id) // Procura a linha exata pelo ID
      .select();

    if (error) throw error;
    return data[0] as ITemporadaGeral;
  }


  async atualizarFranquia(
  id: string,
  dados: Partial<{ nome: string; cor_hex: string; logo_url: string | null }>
) {
  const { data, error } = await this.supabase
    .from('franquias_liga')
    .update(dados)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
  // Atualiza uma campanha do Elenco/Time
  async atualizarCampanhaFranquia(id: string, dados: Partial<ICampanhaFranquia>) {
    const { data, error } = await this.supabase
      .from('campanhas_franquias')
      .update(dados)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0] as ICampanhaFranquia;
  }

  async getFotosJogadoresCustomPorLiga(ligaId: string): Promise<IJogadorFotoCustom[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tabelaFotosJogadores)
        .select('*')
        .eq('liga_id', ligaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as IJogadorFotoCustom[];
    } catch (error) {
      console.error('Erro ao buscar fotos customizadas:', error);
      throw error;
    }
  }

  async getFotoJogadorCustomPorNome(ligaId: string, nomeBruto: string): Promise<IJogadorFotoCustom | null> {
    try {
      const nomeNormalizado = SupabaseService.normalizarNomeJogador(nomeBruto);
      if (!nomeNormalizado) return null;

      const { data: exato, error: erroExato } = await this.supabase
        .from(this.tabelaFotosJogadores)
        .select('*')
        .eq('liga_id', ligaId)
        .eq('jogador_nome_normalizado', nomeNormalizado)
        .maybeSingle();

      if (erroExato) throw erroExato;
      if (exato) return exato as IJogadorFotoCustom;

      const { data: parcial, error: erroParcial } = await this.supabase
        .from(this.tabelaFotosJogadores)
        .select('*')
        .eq('liga_id', ligaId)
        .ilike('jogador_nome_normalizado', `%${nomeNormalizado}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (erroParcial) throw erroParcial;
      return (parcial?.[0] as IJogadorFotoCustom) || null;
    } catch (error) {
      console.error('Erro ao buscar foto por jogador:', error);
      throw error;
    }
  }

  async upsertFotoJogadorCustom(dados: IJogadorFotoCustom): Promise<IJogadorFotoCustom> {
    try {
      const payload: IJogadorFotoCustom = {
        ...dados,
        jogador_nome: SupabaseService.limparNomeJogador(dados.jogador_nome),
        jogador_nome_normalizado: SupabaseService.normalizarNomeJogador(dados.jogador_nome)
      };

      const { data, error } = await this.supabase
        .from(this.tabelaFotosJogadores)
        .upsert(payload, {
          onConflict: 'liga_id,jogador_nome_normalizado'
        })
        .select()
        .single();

      if (error) throw error;
      return data as IJogadorFotoCustom;
    } catch (error) {
      console.error('Erro ao salvar foto customizada:', error);
      throw error;
    }
  }

  async deletarFotoJogadorCustom(ligaId: string, nomeBruto: string): Promise<void> {
    try {
      const nomeNormalizado = SupabaseService.normalizarNomeJogador(nomeBruto);
      if (!nomeNormalizado) return;

      const { error } = await this.supabase
        .from(this.tabelaFotosJogadores)
        .delete()
        .eq('liga_id', ligaId)
        .eq('jogador_nome_normalizado', nomeNormalizado);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar foto customizada:', error);
      throw error;
    }
  }

  async uploadFotoJogadorStorage(ligaId: string, nomeNormalizado: string, arquivo: File): Promise<string> {
    try {
      const extensao = arquivo.name.split('.').pop() || 'png';
      const caminho = `${ligaId}/${nomeNormalizado.replace(/\s+/g, '-')}-${Date.now()}.${extensao}`;

      const { error: erroUpload } = await this.supabase.storage
        .from(this.bucketFotosJogadores)
        .upload(caminho, arquivo, { upsert: true });

      if (erroUpload) throw erroUpload;

      const { data } = this.supabase.storage
        .from(this.bucketFotosJogadores)
        .getPublicUrl(caminho);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro no upload da foto para storage:', error);
      throw error;
    }
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

  async atualizarLembranca(id: string, dados: any) {
    const { data, error } = await this.supabase
      .from('lembrancas_liga')
      .update(dados)
      .eq('id', id)
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