import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private readonly API_KEY_LOCAL_STORAGE = 'nba_mycareer_gemini_key';
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    this.inicializarSePossivel();
  }

  /**
   * Salva a chave no localStorage e tenta inicializar a API.
   */
  salvarApiKey(key: string): void {
    if (key && key.trim().length > 0) {
      localStorage.setItem(this.API_KEY_LOCAL_STORAGE, key.trim());
      this.inicializarSePossivel();
    }
  }

  /**
   * Remove a chave salva.
   */
  removerApiKey(): void {
    localStorage.removeItem(this.API_KEY_LOCAL_STORAGE);
    this.genAI = null;
    this.model = null;
  }

  /**
   * Retorna a chave salva, se existir.
   */
  getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_LOCAL_STORAGE);
  }

  /**
   * Verifica se a API está configurada.
   */
  isConfigurado(): boolean {
    return this.model !== null;
  }

  private inicializarSePossivel(): void {
    const key = this.getApiKey();
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
      // Utilizando o alias oficial do Google para o modelo Flash Latest
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    }
  }

  /**
   * Gera um texto dramático (manchete + resumo) sobre a temporada passada via IA.
   * @param dadosTemporada Objeto com dados: time, wl, playoffs, mvp, dpoy, campeao, etc.
   */
  async gerarResumoTemporada(dadosTemporada: any): Promise<string> {
    if (!this.model) {
      throw new Error('Chave da API do Gemini não configurada!');
    }

    const prompt = `Aja como um redator chefe de uma revista de basquete esportiva americana super prestigiada (estilo SLAM Magazine ou ESPN).
    
Você precisa escrever um breve e impactante relato histórico sobre a temporada passada do time: ${dadosTemporada.franquia}.

Aqui estão os dados duros da temporada dessa franquia:
- Temporada (Ano): ${dadosTemporada.temporada}
- Recorde: ${dadosTemporada.recorde_wl}
- Posição (Seed): ${dadosTemporada.rank_conferencia || 'Não informado'}
- Resultado nos Playoffs: ${dadosTemporada.resultado_playoffs || 'Não foi aos Playoffs'}
- Elenco (Principais Jogadores): ${dadosTemporada.jogadores_chave || 'Não informados'}

Contexto da Liga neste mesmo ano:
- Campeão da NBA: ${dadosTemporada.campeao_nba || 'Desconhecido'}
- MVP da Temporada: ${dadosTemporada.mvp || 'Desconhecido'}
- Defensor do Ano: ${dadosTemporada.dpoy || 'Desconhecido'}

Sua tarefa:
Escreva UM ÚNICO parágrafo (máximo de 4-5 frases), começando com uma MANCHETE CAIXA ALTA DE IMPACTO (seguida de travessão ou nova linha). 
Exagere no drama esportivo, exalte as vitórias épicas ou narre tragicamente a decepção nos playoffs. Foque no time ${dadosTemporada.franquia}, mas pode citar o campeão/MVP se for relevante. Mantenha o texto dinâmico, luxuoso, digno de um documentário "The Last Dance". Retorne APENAS o texto jornalístico, sem formatações Markdown adicionais.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Erro ao gerar narrativa com Gemini:', error);
      throw error;
    }
  }
}
