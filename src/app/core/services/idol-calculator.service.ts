import { Injectable } from '@angular/core';

export interface JogadorStatsFranquia {
  /** Número de temporadas completas jogadas pelo time */
  temporadasJogadas: number;
  /** Número de campeonatos da NBA vencidos pela equipe com o jogador no elenco */
  titulos: number;
  /** Número de prêmios de MVP da Liga conquistados enquanto estava no time */
  mvps: number;
  /** Número de prêmios de Melhor Defensor (DPOY) ou Calouro do Ano (ROY) */
  dpoyOuRoy: number;
  /** Número de prêmios de 6º Homem do Ano */
  sextoHomem: number;
  /** O Maior Overall (OVR) atingido pelo jogador enquanto estava na equipe */
  peakOvr: number;
}

export interface ResultadoIdolo {
  /** Se o jogador alcançou ou não o status de ídolo da franquia */
  isIdolo: boolean;
  /** Pontuação exata calculada baseada na contribuição do jogador */
  scoreTotal: number;
  /** O nome do Tier alcançado (ex: Lenda Cult, Rosto da Franquia) */
  nivel: string;
  /** Uma narrativa dinâmica explicando inteligentemente a origem dos pontos */
  motivo: string;
  /** Uma string formatada pronta para ser renderizada na UI do Front-End */
  badgeCompleto: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdolCalculatorService {

  constructor() { }

  /**
   * Calcula o status de Ídolo de um jogador com base em suas estatísticas pela franquia.
   * Aplica as regras de Relevance Score para definir Tiers de status e narrativas dinâmicas.
   * 
   * @param stats As estatísticas do jogador pela franquia.
   * @returns O objeto `ResultadoIdolo` com a pontuação, nível e motivo gerado.
   */
  calcularStatusIdolo(stats: JogadorStatsFranquia): ResultadoIdolo {
    let scoreTotal = 0;

    // 1. REGRAS DE PONTUAÇÃO BÁSICA (RELEVANCE SCORE)
    // - Longevidade: +5 pontos por temporada
    scoreTotal += (stats.temporadasJogadas || 0) * 5;
    
    // - Títulos: +15 pontos por título
    scoreTotal += (stats.titulos || 0) * 15;
    
    // - MVP da Liga: +20 pontos por cada
    scoreTotal += (stats.mvps || 0) * 20;
    
    // - DPOY ou ROY: +10 pontos por cada
    scoreTotal += (stats.dpoyOuRoy || 0) * 10;
    
    // - 6º Homem do Ano: +5 pontos por cada
    scoreTotal += (stats.sextoHomem || 0) * 5;
    
    // - Peak OVR: +10 pontos se atingiu OVR >= 90
    if (stats.peakOvr >= 90) {
      scoreTotal += 10;
    }

    // 2. NÍVEIS DE ÍDOLO (TIERS EXPANDIDOS)
    let isIdolo = false;
    let nivel = '';

    if (scoreTotal < 50) {
      isIdolo = false;
      nivel = 'Não é ídolo';
    } else if (scoreTotal >= 50 && scoreTotal < 70) {
      isIdolo = true;
      nivel = 'Xodó da Torcida';
    } else if (scoreTotal >= 70 && scoreTotal < 90) {
      isIdolo = true;
      nivel = 'Lenda Cult';
    } else if (scoreTotal >= 90 && scoreTotal < 120) {
      isIdolo = true;
      nivel = 'Rosto da Franquia';
    } else if (scoreTotal >= 120 && scoreTotal < 150) {
      isIdolo = true;
      nivel = 'Lenda Histórica / Camisa Aposentada';
    } else if (scoreTotal >= 150) {
      isIdolo = true;
      nivel = 'Imortal / Estátua na Arena';
    }

    // 3. GERAÇÃO DINÂMICA DA NARRATIVA (MOTIVO)
    let motivoFinal = '';
    
    if (!isIdolo) {
      motivoFinal = 'A contribuição e impacto ainda não foram suficientes para atingir o status de ídolo da franquia.';
    } else {
      const narrativas: string[] = [];
      
      // Avaliar impacto coletivo e longevidade
      if (stats.titulos > 0 && stats.temporadasJogadas >= 5) {
        narrativas.push(`Fidelidade e glória: ${stats.titulos} título(s) conquistado(s) em ${stats.temporadasJogadas} temporadas de casa`);
      } else if (stats.titulos > 0) {
        narrativas.push(`Impacto vitorioso com ${stats.titulos} campeonato(s) conquistado(s)`);
      } else if (stats.temporadasJogadas >= 7) {
        narrativas.push(`Fidelidade exemplar após dedicar ${stats.temporadasJogadas} temporadas à franquia`);
      } else if (stats.temporadasJogadas > 0) {
        narrativas.push(`Registrou passagem por ${stats.temporadasJogadas} temporadas`);
      }

      // Avaliar dominância técnica/prêmios maiores
      if (stats.mvps > 0) {
        narrativas.push(`dominância individual inquestionável ao garantir ${stats.mvps} MVP(s) da Liga`);
      }

      if (stats.peakOvr >= 90) {
        narrativas.push(`apresentando um nível de basquete de elite (Auge OVR ${stats.peakOvr})`);
      }

      // Avaliar prêmios complementares
      const premiosSecundarios = (stats.dpoyOuRoy || 0) + (stats.sextoHomem || 0);
      if (premiosSecundarios > 0) {
        narrativas.push(`conquistando ${premiosSecundarios} prêmio(s) individual(is) de destaque`);
      }

      // Juntar narrativas de forma inteligente (ex: "A, B e C.")
      motivoFinal = narrativas.length > 0
        ? narrativas.join(', ').replace(/, ([^,]*)$/, ' e $1') + '.'
        : 'Reconhecimento geral por sua passagem notável.';
      
      // Capitalizar a primeira letra
      motivoFinal = motivoFinal.charAt(0).toUpperCase() + motivoFinal.slice(1);
    }

    // 4. BADGE COMPLETO FORMATADO
    const badgeCompleto = isIdolo 
      ? `[${scoreTotal} Pts] ${nivel} | Motivo: ${motivoFinal}` 
      : `[${scoreTotal} Pts] ${nivel}`;

    return {
      isIdolo,
      scoreTotal,
      nivel,
      motivo: motivoFinal,
      badgeCompleto
    };
  }
}
