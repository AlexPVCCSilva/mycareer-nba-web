import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

// Dicionário Oficial de IDs da NBA (Jogadores 88+ OVR desde 1984)
const NBA_PLAYERS: { [key: string]: string } = {
  // --- A ERA ATUAL (Superestrelas e Jovens Monstros) ---
  "lebron james": "2544",
  "stephen curry": "201939",
  "kevin durant": "201142",
  "nikola jokic": "203999",
  "giannis antetokounmpo": "203507",
  "luka doncic": "1629029",
  "jayson tatum": "1628369",
  "anthony davis": "203076",
  "kyrie irving": "202681",
  "james harden": "201935",
  "kawhi leonard": "202695",
  "joel embiid": "203954",
  "shai gilgeous-alexander": "1628983",
  "devin booker": "1626164",
  "jimmy butler": "202710",
  "damian lillard": "203081",
  "paul george": "202331",
  "ja morant": "1629630",
  "donovan mitchell": "1628378",
  "anthony edwards": "1630162",
  "deaaron fox": "1628368",
  "trae young": "1629027",
  "jaylen brown": "1627759",
  "bam adebayo": "1628389",
  "karl-anthony towns": "1626157",
  "zion williamson": "1629627",
  "tyrese haliburton": "1630169",
  "jalen brunson": "1628973",
  "victor wembanyama": "1641705",

  // --- ANOS 2010s (Auge do Heat, Warriors e Spurs) ---
  "russell westbrook": "201566",
  "carmelo anthony": "2546",
  "chris paul": "101108",
  "derrick rose": "201565",
  "blake griffin": "201933",
  "klay thompson": "202691",
  "draymond green": "203110",
  "demar derozan": "201942",
  "john wall": "202322",
  "lamarcus aldridge": "200746",
  "marc gasol": "201188",
  "zach lavine": "203897",
  "rudy gobert": "203497",
  "bradley beal": "203078",

  // --- ANOS 2000s (Era Kobe, Shaq e Duncan) ---
  "kobe bryant": "977",
  "shaquille o'neal": "406",
  "tim duncan": "1495",
  "allen iverson": "970",
  "dwyane wade": "2548",
  "kevin garnett": "708",
  "dirk nowitzki": "1717",
  "paul pierce": "1718",
  "ray allen": "951",
  "vince carter": "1713",
  "tracy mcgrady": "1503",
  "steve nash": "961",
  "jason kidd": "429",
  "yao ming": "2397",
  "manu ginobili": "1938",
  "tony parker": "2225",
  "pau gasol": "2200",
  "chris bosh": "2547",
  "dwight howard": "2730",
  "amar'e stoudemire": "2405",
  "chris webber": "185",
  "grant hill": "258",
  "penny hardaway": "305",

  // --- ANOS 90s & 80s (Era Jordan, Magic e Bird) ---
  "michael jordan": "893",
  "magic johnson": "77142",
  "larry bird": "76168",
  "hakeem olajuwon": "165",
  "david robinson": "50",
  "charles barkley": "787",
  "john stockton": "304",
  "karl malone": "252",
  "scottie pippen": "937",
  "patrick ewing": "121",
  "clyde drexler": "17",
  "dominique wilkins": "1122",
  "reggie miller": "397",
  "alonzo mourning": "278",
  "dikembe mutombo": "87",
  "dennis rodman": "14",
  "gary payton": "56",
  "shawn kemp": "431"
};

const NBA_TEAMS_INFO: { [key: string]: { abrev: string, sec: string } } = {
  "hawks": { abrev: "atl", sec: "#C1D32F" }, "boston celtics": { abrev: "bos", sec: "#BA9653" },
  "nets": { abrev: "bkn", sec: "#777777" }, "hornets": { abrev: "cha", sec: "#00788C" },
  "bulls": { abrev: "chi", sec: "#000000" }, "cavaliers": { abrev: "cle", sec: "#FDBB30" },
  "mavericks": { abrev: "dal", sec: "#B8C4CA" }, "nuggets": { abrev: "den", sec: "#FEC524" },
  "pistons": { abrev: "det", sec: "#1D42BA" }, "warriors": { abrev: "gs", sec: "#FFC72C" },
  "rockets": { abrev: "hou", sec: "#000000" }, "pacers": { abrev: "ind", sec: "#FDBB30" },
  "clippers": { abrev: "lac", sec: "#1D428A" }, "lakers": { abrev: "lal", sec: "#FDB927" },
  "grizzlies": { abrev: "mem", sec: "#12173F" }, "heat": { abrev: "mia", sec: "#F9A01B" },
  "bucks": { abrev: "mil", sec: "#EEE1C6" }, "timberwolves": { abrev: "min", sec: "#236192" },
  "pelicans": { abrev: "nop", sec: "#C8102E" }, "knicks": { abrev: "ny", sec: "#F58426" },
  "thunder": { abrev: "okc", sec: "#EF3B24" }, "magic": { abrev: "orl", sec: "#C4CED4" },
  "76ers": { abrev: "phi", sec: "#ED174C" }, "suns": { abrev: "phx", sec: "#E56020" },
  "blazers": { abrev: "por", sec: "#000000" }, "kings": { abrev: "sac", sec: "#63727A" },
  "spurs": { abrev: "sa", sec: "#000000" }, "raptors": { abrev: "tor", sec: "#000000" },
  "jazz": { abrev: "utah", sec: "#F9A01B" }, "wizards": { abrev: "was", sec: "#E31837" }
};

@Component({
  selector: 'app-historico-geral',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './historico-geral.component.html',
  styleUrls: ['./historico-geral.component.scss']
})
export class HistoricoGeralComponent implements OnInit {
  ligaId: string | null = null;
  temporadas: any[] = [];
  carregando = true;

  // --- Controle do Modal de Times ---
  modoPersonalizado = false;
  campanhasTime: any[] = [];
  carregandoTime = false;
  mostrarFormularioTime = false;
  
  // --- Hall da Fama ---
  lendasTime: any[] = [];
  mostrarFormularioLenda = false;
  salvandoLenda = false;
  novaLenda = {
    nome: '', numero_camisa: '', categoria: 'Jogador', motivo: ''
  };

  // --- Controle da Campanha ---
  salvandoCampanha = false;
  novaCampanha = {
    temporada: '', recorde_wl: '', rank_conferencia: null, 
    resultado_playoffs: '', pg: '', sg: '', sf: '', pf: '', c: '', sexto_homem: '',
    draftado: '', observacoes: '' // <- Campos novos
  };

  // Lista com as 30 franquias oficiais da NBA e suas cores primárias
  timesPreDefinidos = [
    { nome: 'Atlanta Hawks', corHex: '#E03A3E' },
    { nome: 'Boston Celtics', corHex: '#007A33' },
    { nome: 'Brooklyn Nets', corHex: '#000000' },
    { nome: 'Charlotte Hornets', corHex: '#1D1160' },
    { nome: 'Chicago Bulls', corHex: '#CE1141' },
    { nome: 'Cleveland Cavaliers', corHex: '#860038' },
    { nome: 'Dallas Mavericks', corHex: '#00538C' },
    { nome: 'Denver Nuggets', corHex: '#0E2240' },
    { nome: 'Detroit Pistons', corHex: '#C8102E' },
    { nome: 'Golden State Warriors', corHex: '#1D428A' },
    { nome: 'Houston Rockets', corHex: '#CE1141' },
    { nome: 'Indiana Pacers', corHex: '#FDBB30' },
    { nome: 'LA Clippers', corHex: '#C8102E' },
    { nome: 'Los Angeles Lakers', corHex: '#552583' },
    { nome: 'Memphis Grizzlies', corHex: '#5D76A9' },
    { nome: 'Miami Heat', corHex: '#98002E' },
    { nome: 'Milwaukee Bucks', corHex: '#00471B' },
    { nome: 'Minnesota Timberwolves', corHex: '#0C2340' },
    { nome: 'New Orleans Pelicans', corHex: '#0C2340' },
    { nome: 'New York Knicks', corHex: '#F58426' },
    { nome: 'Oklahoma City Thunder', corHex: '#007AC1' },
    { nome: 'Orlando Magic', corHex: '#0077C0' },
    { nome: 'Philadelphia 76ers', corHex: '#006BB6' },
    { nome: 'Phoenix Suns', corHex: '#1D1160' },
    { nome: 'Portland Trail Blazers', corHex: '#E03A3E' },
    { nome: 'Sacramento Kings', corHex: '#5A2D81' },
    { nome: 'San Antonio Spurs', corHex: '#C4CED4' },
    { nome: 'Toronto Raptors', corHex: '#CE1141' },
    { nome: 'Utah Jazz', corHex: '#002B5C' },
    { nome: 'Washington Wizards', corHex: '#002B5C' }
  ];

  // --- Sistema de Abas e Franquias ---
  abaAtiva = 'geral';
  franquias: any[] = [];
  
  mostrarModalFranquia = false;
  novaFranquia = { nome: '', corHex: '#552583' };
  salvandoFranquia = false;

  // Variáveis para controlar o formulário de adicionar temporada
  mostrarFormulario = false;
  novaTemporada = {
    temporada: '', campeao_oeste: '', campeao_leste: '', campeao_nba: '', resultado_finais: '', 
    mvp: '', rookie_of_the_year: '', sixth_man: '', dpoy: '', mip: ''
  };
  salvando = false;

editandoIdGeral: string | null = null;
  editandoIdTime: string | null = null;

  topMVPs: any[] = [];
  topDPOYs: any[] = [];
  topCampeoes: any[] = [];
  
  // --- Motor de Lembranças ---
  lembrancas: any[] = [];
  mostrarFormularioLembranca = false;
  salvandoLembranca = false;
  novaLembranca = { data_evento: '', titulo: '', descricao: '', imagem_url: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.ligaId = this.route.snapshot.paramMap.get('id');
    
    if (!this.ligaId) {
      this.router.navigate(['/']);
      return;
    }

    await this.carregarHistorico();
    await this.carregarFranquias();
  }

  async carregarHistorico() {
    this.carregando = true;
    if (this.ligaId) {
      this.temporadas = await this.supabaseService.getHistoriaGeralPorLiga(this.ligaId);
      this.calcularTop3(); 
    }
    this.carregando = false;
    this.cdr.detectChanges();
  }

  async adicionarTemporada() {
    if (!this.novaTemporada.temporada) return alert('O ano da temporada é obrigatório!');
    this.salvando = true;
    try {
      const dadosParaSalvar: any = { ...this.novaTemporada, liga_id: this.ligaId };
      delete dadosParaSalvar.id; 

      if (this.editandoIdGeral) {
        await this.supabaseService.atualizarTemporadaGeral(this.editandoIdGeral, dadosParaSalvar);
      } else {
        await this.supabaseService.salvarTemporadaGeral(dadosParaSalvar);
      }
      this.cancelarEdicaoGeral(); 
      await this.carregarHistorico();
    } catch (error) {
      console.error('Ó bosta, erro ao salvar:', error);
      alert('Erro ao salvar no banco.');
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

  voltarParaOLobby() {
    this.router.navigate(['/']);
  }

  async carregarFranquias() {
    if (this.ligaId) {
      this.franquias = await this.supabaseService.getFranquiasPorLiga(this.ligaId);
      this.cdr.detectChanges();
    }
  }

  // --- Funções do Gerenciador de Elenco ---
  async trocarAba(abaId: string) {
    this.abaAtiva = abaId;
    if (abaId === 'lembrancas') {
      await this.carregarLembrancas();

    } else if (abaId !== 'geral') {
      this.carregandoTime = true;
      const timeAtivo = this.franquias.find(f => f.id === abaId);
      
      if (timeAtivo) {
        this.campanhasTime = await this.supabaseService.getCampanhasDaFranquia(this.ligaId!, timeAtivo.nome);
        this.lendasTime = await this.supabaseService.getHallDaFamaDaFranquia(this.ligaId!, timeAtivo.nome);
      }
      this.carregandoTime = false;
      this.cdr.detectChanges();
    }
  }

  async adicionarCampanhaTime() {
    if (!this.novaCampanha.temporada) return alert('O ano da temporada é obrigatório!');
    this.salvandoCampanha = true;
    try {
      const timeAtivo = this.franquias.find(f => f.id === this.abaAtiva);
      
      // O ': any' aqui também!
      const dadosParaSalvar: any = { ...this.novaCampanha, liga_id: this.ligaId, franquia: timeAtivo.nome };
      delete dadosParaSalvar.id;

      if (this.editandoIdTime) {
        await this.supabaseService.atualizarCampanhaFranquia(this.editandoIdTime, dadosParaSalvar);
      } else {
        await this.supabaseService.salvarCampanhaFranquia(dadosParaSalvar);
      }
      this.cancelarEdicaoTime();
      this.campanhasTime = await this.supabaseService.getCampanhasDaFranquia(this.ligaId!, timeAtivo.nome);
    } catch (error) {
      console.error('Ó bosta, erro ao salvar elenco:', error);
      alert('Erro ao salvar no banco.');
    } finally {
      this.salvandoCampanha = false;
      this.cdr.detectChanges();
    }
  }

  abrirModalFranquia() {
    this.modoPersonalizado = false; 
    this.mostrarModalFranquia = true;
  }

  fecharModalFranquia() {
    this.mostrarModalFranquia = false;
    this.novaFranquia = { nome: '', corHex: '#552583' };
    this.modoPersonalizado = false;
  }

  async salvarTimePadrao(time: any) {
    this.novaFranquia = { nome: time.nome, corHex: time.corHex };
    await this.salvarNovaFranquia(); 
  }

  async salvarNovaFranquia() {
    if (!this.novaFranquia.nome) {
      alert('Digite o nome do time!');
      return;
    }

    this.salvandoFranquia = true;
    try {
      const timeCriado = await this.supabaseService.criarFranquia(
        this.ligaId!,
        this.novaFranquia.nome,
        this.novaFranquia.corHex
      );
      
      this.franquias.push(timeCriado);
      this.trocarAba(timeCriado.id); 
      this.fecharModalFranquia();
      
    } catch (error: any) {
      console.error('Ó bosta, erro ao salvar time:', error);
      alert('Erro ao criar franquia. Esse nome já existe neste save?');
    } finally {
      this.salvandoFranquia = false;
      this.cdr.detectChanges();
    }
  }

  async processarCSV(event: any) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    this.carregando = true;
    this.cdr.detectChanges();

    const leitor = new FileReader();
    
    leitor.onload = async (e: any) => {
      const texto = e.target.result;
      const linhas = texto.split('\n');
      
      const cabecalho = linhas[0].toLowerCase().replace(/\r/g, '').split(',');
      const registrosParaSalvar: any[] = [];

      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].replace(/\r/g, '').trim();
        if (!linha) continue; 

        const colunas = linha.split(',');
        
        const dadosTemporada: any = {
          liga_id: this.ligaId
        };

        cabecalho.forEach((nomeColuna: string, index: number) => {
          const chave = nomeColuna.trim();
          if (chave) {
            dadosTemporada[chave] = colunas[index]?.trim() || null;
          }
        });

        registrosParaSalvar.push(dadosTemporada);
      }

      try {
        console.log('Enviando dados da planilha para o banco:', registrosParaSalvar);
        
        const { error } = await this.supabaseService.supabase
          .from('historia_geral')
          .insert(registrosParaSalvar);

        if (error) throw error;

        alert(`Sucesso! ${registrosParaSalvar.length} temporadas importadas.`);
        await this.carregarHistorico(); 

      } catch (error) {
        console.error('Ó bosta, erro na importação em lote:', error);
        alert('Erro ao importar planilha. Verifique se os nomes das colunas estão iguais aos do banco de dados.');
      } finally {
        this.carregando = false;
        this.cdr.detectChanges();
        event.target.value = '';
      }
    };

    leitor.readAsText(arquivo);
  }

  async eternizarLenda() {
    if (!this.novaLenda.nome) {
      alert('O nome da lenda é obrigatório!');
      return;
    }

    this.salvandoLenda = true;
    try {
      const timeAtivo = this.franquias.find(f => f.id === this.abaAtiva);

      const dadosParaSalvar = {
        ...this.novaLenda,
        liga_id: this.ligaId,
        franquia: timeAtivo.nome 
      };

      await this.supabaseService.adicionarAoHallDaFama(dadosParaSalvar);
      
      this.novaLenda = { nome: '', numero_camisa: '', categoria: 'Jogador', motivo: '' };
      this.mostrarFormularioLenda = false;
      
      this.lendasTime = await this.supabaseService.getHallDaFamaDaFranquia(this.ligaId!, timeAtivo.nome);
      
    } catch (error) {
      console.error('Ó bosta, erro ao salvar no Hall da Fama:', error);
      alert('Erro ao registrar a lenda.');
    } finally {
      this.salvandoLenda = false;
      this.cdr.detectChanges();
    }
  }


  // --- Importador CSV para Elencos/Franquias ---
  async processarCSVTime(event: any) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    // Descobre em qual aba de time você está no momento do clique
    const timeAtivo = this.franquias.find(f => f.id === this.abaAtiva);
    if (!timeAtivo) {
      alert('Nenhum time selecionado para importar!');
      return;
    }

    this.carregandoTime = true;
    this.cdr.detectChanges();

    const leitor = new FileReader();
    
    leitor.onload = async (e: any) => {
      const texto = e.target.result;
      const linhas = texto.split('\n');
      
      const cabecalho = linhas[0].toLowerCase().replace(/\r/g, '').split(',');
      const registrosParaSalvar: any[] = [];

      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].replace(/\r/g, '').trim();
        if (!linha) continue;

        // Trata os dados separados por vírgula de forma inteligente para não quebrar em textos longos
        const colunas = linha.split(',');
        
        const dadosCampanha: any = {
          liga_id: this.ligaId,
          franquia: timeAtivo.nome 
        };

        cabecalho.forEach((nomeColuna: string, index: number) => {
          const chave = nomeColuna.trim();
          if (chave) {
            dadosCampanha[chave] = colunas[index]?.trim() || null;
          }
        });

        registrosParaSalvar.push(dadosCampanha);
      }

      try {
        const { error } = await this.supabaseService.supabase
          .from('campanhas_franquias')
          .insert(registrosParaSalvar);

        if (error) throw error;

        alert(`Imbecil de fácil! ${registrosParaSalvar.length} campanhas importadas para o ${timeAtivo.nome}.`);
        
        // Recarrega a tabela do time na hora
        this.campanhasTime = await this.supabaseService.getCampanhasDaFranquia(this.ligaId!, timeAtivo.nome);

      } catch (error) {
        console.error('Ó bosta, erro na importação do time:', error);
        alert('Erro ao importar. O Excel está com o cabeçalho igual ao do banco?');
      } finally {
        this.carregandoTime = false;
        this.cdr.detectChanges();
        event.target.value = ''; // Limpa o input
      }
    };

    leitor.readAsText(arquivo);
  }
  // --- Funções de Edição ---
  editarTemporadaGeral(temp: any) {
    this.editandoIdGeral = temp.id;
    this.novaTemporada = { ...temp }; 
    this.mostrarFormulario = true; 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editarCampanhaTime(camp: any) {
    this.editandoIdTime = camp.id;
    this.novaCampanha = { ...camp };
    this.mostrarFormularioTime = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicaoGeral() {
    this.editandoIdGeral = null;
    this.novaTemporada = { temporada: '', campeao_oeste: '', campeao_leste: '', campeao_nba: '', resultado_finais: '', mvp: '', rookie_of_the_year: '', sixth_man: '', dpoy: '', mip: '' };
    this.mostrarFormulario = false;
  }

  cancelarEdicaoTime() {
    this.editandoIdTime = null;
    this.novaCampanha = { temporada: '', recorde_wl: '', rank_conferencia: null, resultado_playoffs: '', pg: '', sg: '', sf: '', pf: '', c: '', sexto_homem: '', draftado: '', observacoes: '' };
    this.mostrarFormularioTime = false;
  }
  
// --- Funções Visuais e de Cores ---
  getCorFranquia(nomeTime: string): string | null {
    if (!nomeTime) return null;
    
    const busca = nomeTime.toLowerCase().trim();
    
    const franquia = this.franquias.find(f => {
      const nomeFranquia = f.nome.toLowerCase();
      return nomeFranquia.includes(busca) || busca.includes(nomeFranquia);
    });
    
    return franquia ? franquia.cor_hex : null;
  }

  getNomeAbaAtiva(): string {
    const franquia = this.franquias.find(f => f.id === this.abaAtiva);
    return franquia ? franquia.nome : 'Franquia';
  }

  getCorAbaAtiva(): string {
    const franquia = this.franquias.find(f => f.id === this.abaAtiva);
    return franquia ? franquia.cor_hex : '#222222';
  }



  getFotoJogador(nome: string): string {
    if (!nome) return '';
    
    const busca = nome.toLowerCase().trim();
    
    const chaveEncontrada = Object.keys(NBA_PLAYERS).find(nomeEstrela => busca.includes(nomeEstrela));
    
    const idNba = chaveEncontrada ? NBA_PLAYERS[chaveEncontrada] : null;

    if (idNba) {
      return `https://cdn.nba.com/headshots/nba/latest/1040x760/${idNba}.png`;
    } else {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0f172a&color=FDB927&size=150&font-size=0.4&bold=true`;
    }
  }

  
  // Limpa o "99 - " da frente
  limparNomeJogador(nome: string): string {
    if (!nome) return '';
    return nome.replace(/^\d+\s*-\s*/, '').trim(); 
  }

  calcularTop3() {
    const contagemMVP: { [key: string]: number } = {};
    const contagemDPOY: { [key: string]: number } = {};
    const contagemTimes: { [key: string]: number } = {};

    this.temporadas.forEach(temp => {
      // Conta os Times Campeões da NBA
      if (temp.campeao_nba && temp.campeao_nba !== '-') {
        const time = temp.campeao_nba.trim();
        contagemTimes[time] = (contagemTimes[time] || 0) + 1;
      }
      // Conta os MVPs
      if (temp.mvp && temp.mvp !== '-') {
        const mvp = this.limparNomeJogador(temp.mvp);
        contagemMVP[mvp] = (contagemMVP[mvp] || 0) + 1;
      }
      // Conta os DPOYs
      if (temp.dpoy && temp.dpoy !== '-') {
        const dpoy = this.limparNomeJogador(temp.dpoy);
        contagemDPOY[dpoy] = (contagemDPOY[dpoy] || 0) + 1;
      }
    });

    this.topCampeoes = Object.keys(contagemTimes)
      .map(nome => ({ nome, total: contagemTimes[nome] }))
      .sort((a, b) => b.total - a.total).slice(0, 3);

    this.topMVPs = Object.keys(contagemMVP)
      .map(nome => ({ nome, total: contagemMVP[nome] }))
      .sort((a, b) => b.total - a.total).slice(0, 3);

    this.topDPOYs = Object.keys(contagemDPOY)
      .map(nome => ({ nome, total: contagemDPOY[nome] }))
      .sort((a, b) => b.total - a.total).slice(0, 3);
  }



  getLogoTime(nomeTime: string): string | null {
    if (!nomeTime) return null;
    const busca = nomeTime.toLowerCase().trim();
    const chave = Object.keys(NBA_TEAMS_INFO).find(k => busca.includes(k) || k.includes(busca));
    return chave ? `https://a.espncdn.com/i/teamlogos/nba/500/${NBA_TEAMS_INFO[chave].abrev}.png` : null;
  }

  isMeuTimeCampeao(nomeTime: string): boolean {
    if (!nomeTime || nomeTime === '-') return false;
    const busca = nomeTime.toLowerCase().trim();
    return this.franquias.some(f => f.nome.toLowerCase().includes(busca) || busca.includes(f.nome.toLowerCase()));
  }

  getTextColorForBackground(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return '#ffffff';
    const brilho = ((parseInt(hex.substring(0, 2), 16) * 299) + (parseInt(hex.substring(2, 4), 16) * 587) + (parseInt(hex.substring(4, 6), 16) * 114)) / 1000;
    return brilho > 150 ? '#000000' : '#ffffff'; // Se for cor clara (tipo o amarelo), usa letra preta
  }

  getEstiloJogador(jogadorString: string): any {
    if (!jogadorString) return {};
    
    const match = jogadorString.match(/\b(\d{2})\b/);
    const ovr = match ? parseInt(match[0], 10) : 0;
    
    if (ovr < 90) return {};
    const franquiaAtual = this.franquias.find(f => f.id === this.abaAtiva);
    if (!franquiaAtual) return {};

    const corPrimaria = franquiaAtual.cor_hex;
    const buscaNome = franquiaAtual.nome.toLowerCase();
    const chaveInfo = Object.keys(NBA_TEAMS_INFO).find(k => buscaNome.includes(k) || k.includes(buscaNome));
    const corSecundaria = chaveInfo ? NBA_TEAMS_INFO[chaveInfo].sec : '#888888'; 

    if (ovr >= 95) { 
      return { 'background-color': corPrimaria, 'color': this.getTextColorForBackground(corPrimaria), 'padding': '3px 10px', 'border-radius': '15px', 'box-shadow': `0 2px 4px ${corPrimaria}80` };
    } else if (ovr >= 90) {
      return { 'background-color': corSecundaria, 'color': this.getTextColorForBackground(corSecundaria), 'padding': '3px 10px', 'border-radius': '15px', 'box-shadow': `0 2px 4px ${corSecundaria}80` };
    }
    return {};
  }
  isCampanhaCampeao(resultado: string): boolean {
    if (!resultado) return false;
    const texto = resultado.toLowerCase();
    return texto.includes('campeão') || texto.includes('campeao') || texto.includes('campeões') || texto.includes('campeoes'); 
  }

  isCampanhaVice(resultado: string): boolean {
    if (!resultado) return false;
    const texto = resultado.toLowerCase();
    return texto.includes('vice'); 
  }
  
  getArrayTitulos(): any[] {
    if (!this.campanhasTime) return [];
    const qtd = this.campanhasTime.filter(camp => this.isCampanhaCampeao(camp.resultado_playoffs)).length;
    return new Array(qtd);
  }

  getArrayVices(): any[] {
    if (!this.campanhasTime) return [];
    const qtd = this.campanhasTime.filter(camp => this.isCampanhaVice(camp.resultado_playoffs)).length;
    return new Array(qtd);
  }


  
  async carregarLembrancas() {
    if (this.ligaId) {
      const dadosBrutos = await this.supabaseService.getLembrancasPorLiga(this.ligaId);
      
      this.lembrancas = dadosBrutos.sort((a, b) => {
        const anoA = parseInt(a.data_evento.match(/\d{4}/)?.[0] || '0', 10);
        const anoB = parseInt(b.data_evento.match(/\d{4}/)?.[0] || '0', 10);

        if (anoA !== anoB) {
          return anoA - anoB; 
        }
                return a.data_evento.localeCompare(b.data_evento);
      });

      this.cdr.detectChanges();
    }
  }

  // Pega o arquivo do seu PC e transforma em texto pra salvar no banco!
  processarImagemLembranca(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.novaLembranca.imagem_url = e.target.result; // A mágica do Base64 acontece aqui
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removerImagemSelecionada() {
    this.novaLembranca.imagem_url = '';
  }

  async adicionarLembranca() {
    if (!this.novaLembranca.titulo || !this.novaLembranca.data_evento) {
      alert('A Data e o Título da manchete são obrigatórios!');
      return;
    }

    this.salvandoLembranca = true;
    try {
      const dadosParaSalvar = { ...this.novaLembranca, liga_id: this.ligaId };
      await this.supabaseService.salvarLembranca(dadosParaSalvar);
      
      this.novaLembranca = { data_evento: '', titulo: '', descricao: '', imagem_url: '' };
      this.mostrarFormularioLembranca = false;
      await this.carregarLembrancas();
    } catch (error) {
      console.error('Ó bosta, erro ao salvar memória:', error);
      alert('Erro ao salvar. A imagem pode ser pesada demais, tente comprimir um pouco!');
    } finally {
      this.salvandoLembranca = false;
      this.cdr.detectChanges();
    }
  }

  async excluirLembranca(id: string) {
    if(confirm('Tem certeza que deseja apagar esse momento histórico?')) {
      try {
        await this.supabaseService.deletarLembranca(id);
        await this.carregarLembrancas();
      } catch (error) {
        alert('Erro ao excluir.');
      }
    }
  }
}