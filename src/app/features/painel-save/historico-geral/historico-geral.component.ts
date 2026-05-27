import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

// Dicionário Oficial de IDs da NBA (Jogadores 88+ OVR desde 1984)
const NBA_PLAYERS: { [key: string]: string } = {
  // --- DRAFT 2024 ---
  "zaccharie risacher": "1642277",
  "alex sarr": "1642278",
  "reed sheppard": "1642279",
  "stephon castle": "1642280",
  "ron holland": "1642281",
  "matas buzelis": "1642282",
  "donovan clingan": "1642283",
  "rob dillingham": "1642284",
  "zach edey": "1642285",
  "cody williams": "1642286",
  "dalton knecht": "1642287",
  "devin carter": "1642288",
  "bub carrington": "1642289",
  "kel'el ware": "1642290",
  "nikola topic": "1642291",
  "jared mccain": "1642292",
  "kyshawn george": "1642293",
  "tristan da silva": "1642294",
  "ja'kobe walter": "1642295",
  "tyler smith": "1642296",
  "daron holmes ii": "1642297",
  "rj davis": "1642500", 
  "cooper flagg": "1642843",

  // --- BRASILEIROS NA NBA ---
  "gui santos": "1630611",
  "leandro barbosa": "2571",
  "nene": "2403",
  "anderson varejao": "2760",
  "tiago splitter": "201168",
  "raul neto": "203526",
  "cristiano felicio": "1626245",
  "bruno caboclo": "203998",
  "didi louzada": "1629683",
  "marcelinho huertas": "1626273",

  // --- SUPERESTRELAS E ALL-STARS ATUAIS ---
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
  "rudy gobert": "203497",
  "jamal murray": "1627750",
  "domantas sabonis": "1627734",
  "pascal siakam": "1627783",
  "lauri markkanen": "1628374",
  "kristaps porzingis": "204001",
  "jrue holiday": "201950",
  "demar derozan": "201942",
  "bradley beal": "203078",
  "zach lavine": "203897",
  "julius randle": "203944",
  "brandon ingram": "1627742",
  "khris middleton": "203114",
  "cj mccollum": "203468",
  "dejounte murray": "1627749",
  "aaron gordon": "203932",
  "myles turner": "1626167",
  "fred vanvleet": "1627832",
  "derrick white": "1628401",
  "draymond green": "203110",
  "klay thompson": "202691",

  // --- A NOVA GERAÇÃO (Jovens Estrelas) ---
  "tyrese maxey": "1630178",
  "paolo banchero": "1631094",
  "chet holmgren": "1631096",
  "jalen williams": "1631114",
  "scottie barnes": "1630567",
  "evan mobley": "1630596",
  "franz wagner": "1630532",
  "alperen sengun": "1630578",
  "jalen green": "1630224",
  "lamelo ball": "1630163",
  "darius garland": "1629636",
  "tyler herro": "1629639",
  "desmond bane": "1630217",
  "jaren jackson jr": "1628991",
  "mikal bridges": "1628969",
  "josh giddey": "1630581",
  "brandon miller": "1641706",
  "scoot henderson": "1641707",
  "cade cunningham": "1630595",
  "jalen suggs": "1630591",
  "ausar thompson": "1641709",
  "amen thompson": "1641708",
  "dereck lively ii": "1641726",

  // --- BONS TITULARES E ROLE PLAYERS ATUAIS ---
  "rui hachimura": "1629060",
  "austin reaves": "1630559",
  "d'angelo russell": "1626156",
  "marcus smart": "203935",
  "jarrett allen": "1628386",
  "john collins": "1628381",
  "kyle kuzma": "1628398",
  "og anunoby": "1628384",
  "dillon brooks": "1628415",
  "anfernee simons": "1629014",
  "wendell carter jr": "1628976",
  "donte divincenzo": "1628408",
  "rj barrett": "1628392",
  "jordan poole": "1629673",
  "cam johnson": "1629023",
  "alex caruso": "1630527",
  "luguentz dort": "1629652",
  "naz reid": "1629675",
  "max strus": "1629622",
  "gabe vincent": "1629216",
  "caleb martin": "1628997",
  "duncan robinson": "1629130",
  "grant williams": "1629684",
  "pj washington": "1629020",
  "brook lopez": "201572",
  "tobias harris": "202699",
  "nikola vucevic": "202696",
  "buddy hield": "1627741",

  // --- ANOS 2010s ---
  "russell westbrook": "201566",
  "carmelo anthony": "2546",
  "chris paul": "101108",
  "derrick rose": "201565",
  "blake griffin": "201933",
  "john wall": "202322",
  "lamarcus aldridge": "200746",
  "marc gasol": "201188",
  "dwyane wade": "2548",
  "dwight howard": "2746",
  "chris bosh": "2547",
  "tony parker": "2225",
  "manu ginobili": "1938",
  "pau gasol": "2200",
  "dirk nowitzki": "1717",
  "rajon rondo": "200765",
  "kevin love": "201567",
  "andre iguodala": "2738",
  "demarcus cousins": "202326",
  "joakim noah": "201149",
  "kyle lowry": "200768",
  "kemba walker": "202689",
  "isaiah thomas": "202738",
  "serge ibaka": "201586",
  "zach randolph": "2216",
  "mike conley": "201144",
  "deron williams": "101114",
  "joe johnson": "2207",
  "al horford": "201143",
  "paul millsap": "200794",
  "deandre jordan": "201599",
  "goran dragic": "201609",
  "lou williams": "201150",

  // --- ANOS 2000s ---
  "kobe bryant": "977",
  "shaquille o'neal": "406",
  "tim duncan": "1495",
  "allen iverson": "947",
  "kevin garnett": "708",
  "paul pierce": "1718",
  "ray allen": "951",
  "vince carter": "1713",
  "tracy mcgrady": "1503",
  "steve nash": "961",
  "jason kidd": "467",
  "yao ming": "2397",
  "amar'e stoudemire": "2405",
  "chris webber": "185",
  "grant hill": "258",
  "penny hardaway": "305",
  "gilbert arenas": "2240",
  "chauncey billups": "1497",
  "ben wallace": "739",
  "rasheed wallace": "198",
  "stephon marbury": "950",
  "steve francis": "948",
  "jason terry": "478",
  "jamal crawford": "1890",
  "jr smith": "2747",
  "kyle korver": "202684",
  "jj redick": "2594",
  "richard jefferson": "2210",
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
  "shawn kemp": "431",
  "isiah thomas": "77372",
  "kareem abdul-jabbar": "76003",
  "julius erving": "76622",
  "moses malone": "77319",
  "tim hardaway": "422",
  "mitch richmond": "297",
  "david thompson": "78648",
  "george gervin": "76837",
  "bill russell": "78049",
  "wilt chamberlain": "76311",
  "joe dumars": "73",
  "chris mullin": "193",
  "vlade divac": "124",
   "Elton Brand": "1882",
  "antoine rigaudeau": "2658",
  "carlos boozer": "2430",
  "boris diaw": "2564",
  "drazen petrovic": "382",
  "vinnie johnson": "77143",
  "kevin mchale": "77536",
  "sidney moncrief": "77626",
  "terry cummings": "184",
  "arvydas sabonis": "717", // Sabonis Pai

  "toni kukoc": "314",
  "peja stojakovic": "1712",
  "andrei kirilenko": "1905",
  "luis scola": "2449",
  "sarunas marciulionis": "260",
  "detlef schrempf": "30",
  "ricky rubio": "201937",
  "andres nocioni": "1733",
  "mehmet okur": "2246",
  "hedo turkoglu": "2045",
  "zydrunas ilgauskas": "980",
  "Andre Miller": "1889",
  "Tristan Thompson": "202684",
  "shawn marion": "1890",
  "richard hamilton": "1888",
  "jason williams": "1715",
  "kenyon martin": "2030",
  "lamar odom": "2084",
  "corey maggette": "2034",
  "ron artest": "1897",
  "stephen jackson": "1536",
  "tayshaun prince": "1886",
  "mike bibby": "1710",
  "ben gordon": "1894",
  "luol deng": "2736",
  "udonis haslem": "2617",
  "jermaine o'neal": "979",
  "michael redd": "2072",
  "shane battier": "2203",
  "elton brand": "1882",
  "gerald wallace": "2222",
  "david west": "2561",
  "danny granger": "101147",
  "jason richardson": "2243",
  "baron davis": "2883",
  "marcus camby": "1711",
  "steve franchise": "948", // Steve Francis
  "carlos arroyo": "1889",

  // --- ANOS 90s (Tough Guys, Atiradores e Coadjuvantes de Luxo) ---
  "dan majerle": "160",
  "larry johnson": "187", // Grandmama
  "glen rice": "20",
  "horace grant": "270",
  "rik smits": "53",
  "mark jackson": "349",
  "ron harper": "351",
  "john starks": "136",
  "steve kerr": "31",
  "muggsy bogues": "163",
  "cliff robinson": "194",
  "dennis scott": "182",
  "nick anderson": "107",
  "bj armstrong": "167",
  "terry porter": "45",
  "sean elliott": "251",
  "lorenzen wright": "964",
  "dale davis": "208",
  "antonio davis": "213",
  "jerry stackhouse": "2754",

  // --- ANOS 80s (Bad Boys, Showtime e Celtics Bench) ---
  "bill laimbeer": "77328",
  "rick mahorn": "77443",
  "dennis johnson": "77138",
  "james worthy": "78621", // Big Game James
  "byron scott": "144",
  "michael cooper": "76442",
  "robert parish": "77800", // The Chief
  "bernard king": "77264",
  "alex english": "76673",
  "kiki vandeweghe": "78401",
  "danny ainge": "76017",
  "bob mcadoo": "77508",
  "jamaal wilkes": "78523",
  "bill walton": "78450", // Anos 70/80
  "maurice cheeks": "76383"
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

  public expandido = {
    campeoes: false,
    mvps: false,
    dpoys: false
  };
  temaEscuro = true;


public mostrarModalRankings = false;
  
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

    const temaSalvo = localStorage.getItem('tema');
      if (temaSalvo === 'light') {
        this.temaEscuro = false;
        document.documentElement.setAttribute('data-theme', 'light');
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
    // --- HISTÓRICO REAL DA NBA ATÉ O INÍCIO DA TEMPORADA 1983-84 ---
    const baseTimes: { [key: string]: number } = {
      'Boston Celtics': 14, 'Los Angeles Lakers': 8, 'Philadelphia 76ers': 3,
      'Golden State Warriors': 3, 'New York Knicks': 2, 'Milwaukee Bucks': 1,
      'Portland Trail Blazers': 1, 'Seattle SuperSonics': 1, 'Washington Bullets': 1,
      'Sacramento Kings': 1, 'Atlanta Hawks': 1, 'Baltimore Bullets': 1
    };

    const baseMVP: { [key: string]: number } = {
      'Kareem Abdul-Jabbar': 6, 'Bill Russell': 5, 'Wilt Chamberlain': 4,
      'Moses Malone': 3, 'Bob Pettit': 2, 'Julius Erving': 1, 'Bob Cousy': 1,
      'Oscar Robertson': 1, 'Wes Unseld': 1, 'Willis Reed': 1, 'Dave Cowens': 1,
      'Bob McAdoo': 1, 'Bill Walton': 1
    };

    const baseDPOY: { [key: string]: number } = {
      'Sidney Moncrief': 1 // O prêmio de DPOY foi criado em 1982-83
    };

    // Clona as bases para podermos somar com os dados do seu save
    const contagemTimes = { ...baseTimes };
    const contagemMVP = { ...baseMVP };
    const contagemDPOY = { ...baseDPOY };

    // 👇 O SEGREDO ESTÁ AQUI: Dicionário de Apelidos dos Times 👇
    const normalizarTime = (nome: string) => {
      if (!nome || nome === '-') return null;
      let nomeLimpo = nome.toLowerCase().trim();
      
      const mapaTimes: { [key: string]: string } = {
        'lakers': 'Los Angeles Lakers', 'la lakers': 'Los Angeles Lakers', 'los angeles lakers': 'Los Angeles Lakers',
        'celtics': 'Boston Celtics', 'boston': 'Boston Celtics', 'boston celtics': 'Boston Celtics',
        'sixers': 'Philadelphia 76ers', '76ers': 'Philadelphia 76ers', 'philly': 'Philadelphia 76ers', 'philadelphia 76ers': 'Philadelphia 76ers',
        'warriors': 'Golden State Warriors', 'golden state': 'Golden State Warriors', 'golden state warriors': 'Golden State Warriors',
        'knicks': 'New York Knicks', 'ny knicks': 'New York Knicks', 'new york': 'New York Knicks', 'new york knicks': 'New York Knicks',
        'bucks': 'Milwaukee Bucks', 'milwaukee': 'Milwaukee Bucks', 'milwaukee bucks': 'Milwaukee Bucks',
        'blazers': 'Portland Trail Blazers', 'portland': 'Portland Trail Blazers', 'portland trail blazers': 'Portland Trail Blazers',
        'sonics': 'Seattle SuperSonics', 'seattle': 'Seattle SuperSonics', 'seattle supersonics': 'Seattle SuperSonics',
        'bullets': 'Washington Bullets', 'washington': 'Washington Wizards', 'wizards': 'Washington Wizards', 'washington wizards': 'Washington Wizards',
        'kings': 'Sacramento Kings', 'sacramento': 'Sacramento Kings', 'sacramento kings': 'Sacramento Kings',
        'hawks': 'Atlanta Hawks', 'atlanta': 'Atlanta Hawks', 'atlanta hawks': 'Atlanta Hawks',
        'bulls': 'Chicago Bulls', 'chicago': 'Chicago Bulls', 'chicago bulls': 'Chicago Bulls',
        'spurs': 'San Antonio Spurs', 'san antonio': 'San Antonio Spurs', 'san antonio spurs': 'San Antonio Spurs',
        'pistons': 'Detroit Pistons', 'detroit': 'Detroit Pistons', 'detroit pistons': 'Detroit Pistons',
        'rockets': 'Houston Rockets', 'houston': 'Houston Rockets', 'houston rockets': 'Houston Rockets',
        'heat': 'Miami Heat', 'miami': 'Miami Heat', 'miami heat': 'Miami Heat',
        'mavs': 'Dallas Mavericks', 'dallas': 'Dallas Mavericks', 'dallas mavericks': 'Dallas Mavericks',
        'nuggets': 'Denver Nuggets', 'denver': 'Denver Nuggets', 'denver nuggets': 'Denver Nuggets',
        'suns': 'Phoenix Suns', 'phoenix': 'Phoenix Suns', 'phoenix suns': 'Phoenix Suns',
        'jazz': 'Utah Jazz', 'utah': 'Utah Jazz', 'utah jazz': 'Utah Jazz',
        'pacers': 'Indiana Pacers', 'indiana': 'Indiana Pacers', 'indiana pacers': 'Indiana Pacers',
        'magic': 'Orlando Magic', 'orlando': 'Orlando Magic', 'orlando magic': 'Orlando Magic',
        'cavs': 'Cleveland Cavaliers', 'cleveland': 'Cleveland Cavaliers', 'cleveland cavaliers': 'Cleveland Cavaliers',
        'raptors': 'Toronto Raptors', 'toronto': 'Toronto Raptors', 'toronto raptors': 'Toronto Raptors',
        'hornets': 'Charlotte Hornets', 'charlotte': 'Charlotte Hornets', 'charlotte hornets': 'Charlotte Hornets',
        'nets': 'Brooklyn Nets', 'brooklyn': 'Brooklyn Nets', 'new jersey nets': 'Brooklyn Nets', 'new jersey': 'Brooklyn Nets', 'brooklyn nets': 'Brooklyn Nets',
        'timberwolves': 'Minnesota Timberwolves', 'wolves': 'Minnesota Timberwolves', 'minnesota': 'Minnesota Timberwolves', 'minnesota timberwolves': 'Minnesota Timberwolves',
        'pelicans': 'New Orleans Pelicans', 'new orleans': 'New Orleans Pelicans', 'new orleans pelicans': 'New Orleans Pelicans',
        'grizzlies': 'Memphis Grizzlies', 'memphis': 'Memphis Grizzlies', 'vancouver grizzlies': 'Memphis Grizzlies', 'memphis grizzlies': 'Memphis Grizzlies',
        'clippers': 'LA Clippers', 'la clippers': 'LA Clippers', 'los angeles clippers': 'LA Clippers', 'san diego clippers': 'LA Clippers'
      };

      return mapaTimes[nomeLimpo] || nome.trim();
    };

    // Função normal para jogadores (ignora Case)
    const normalizarJogador = (nome: string, base: { [key: string]: number }) => {
      if (!nome || nome === '-') return null;
      let nomeLimpo = this.limparNomeJogador(nome).trim();
      const chaveExistente = Object.keys(base).find(k => k.toLowerCase() === nomeLimpo.toLowerCase());
      return chaveExistente ? chaveExistente : nomeLimpo;
    };

    // Percorre tudo o que aconteceu NO SEU SAVE e soma na base
    this.temporadas.forEach(temp => {
      // Usa o normalizador de TIMES
      const time = normalizarTime(temp.campeao_nba);
      if (time) contagemTimes[time] = (contagemTimes[time] || 0) + 1;

      // Usa o normalizador de JOGADORES
      const mvp = normalizarJogador(temp.mvp, contagemMVP);
      if (mvp) contagemMVP[mvp] = (contagemMVP[mvp] || 0) + 1;

      const dpoy = normalizarJogador(temp.dpoy, contagemDPOY);
      if (dpoy) contagemDPOY[dpoy] = (contagemDPOY[dpoy] || 0) + 1;
    });

    // Ordena tudo
    this.topCampeoes = Object.keys(contagemTimes)
      .map(nome => ({ nome, total: contagemTimes[nome] }))
      .sort((a, b) => b.total - a.total);

    this.topMVPs = Object.keys(contagemMVP)
      .map(nome => ({ nome, total: contagemMVP[nome] }))
      .sort((a, b) => b.total - a.total);

    this.topDPOYs = Object.keys(contagemDPOY)
      .map(nome => ({ nome, total: contagemDPOY[nome] }))
      .sort((a, b) => b.total - a.total);
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

  toggleVerMais(categoria: 'campeoes' | 'mvps' | 'dpoys') {
    this.expandido[categoria] = !this.expandido[categoria];
  }


  abrirModalRankings() {
    this.mostrarModalRankings = true;
  }

  fecharModalRankings() {
    this.mostrarModalRankings = false;
    // Opcional: Fecha as listas expandidas ao fechar o modal
    this.expandido = { campeoes: false, mvps: false, dpoys: false };
  }
  trackById(index: number, item: any): any {
  return item.id || index;
}

  toggleTema(): void {
    this.temaEscuro = !this.temaEscuro;
    document.documentElement.setAttribute(
      'data-theme', 
      this.temaEscuro ? 'dark' : 'light'
    );
    localStorage.setItem('tema', this.temaEscuro ? 'dark' : 'light');
  }

  

        getCorTimaNBA(nomeTime: string): string | null {
        if (!nomeTime || nomeTime === '—' || nomeTime === '-') return null;

        // Primeiro tenta nas suas franquias cadastradas
        const franquia = this.getCorFranquia(nomeTime);
        if (franquia) return franquia;

        // Senão busca no dicionário global de times
        const busca = nomeTime.toLowerCase().trim();
        const mapaCoresprimarias: { [key: string]: string } = {
          'lakers': '#552583', 'los angeles lakers': '#552583',
          'celtics': '#007A33', 'boston celtics': '#007A33',
          'warriors': '#1D428A', 'golden state warriors': '#1D428A',
          'bulls': '#CE1141', 'chicago bulls': '#CE1141',
          'spurs': '#C4CED4', 'san antonio spurs': '#C4CED4',
          'heat': '#98002E', 'miami heat': '#98002E',
          'cavaliers': '#860038', 'cleveland cavaliers': '#860038',
          'cavs': '#860038',
          'pistons': '#C8102E', 'detroit pistons': '#C8102E',
          'rockets': '#CE1141', 'houston rockets': '#CE1141',
          'mavericks': '#00538C', 'dallas mavericks': '#00538C', 'mavs': '#00538C',
          'nuggets': '#0E2240', 'denver nuggets': '#0E2240',
          'bucks': '#00471B', 'milwaukee bucks': '#00471B',
          'suns': '#1D1160', 'phoenix suns': '#1D1160',
          'knicks': '#006BB6', 'new york knicks': '#006BB6',
          'sixers': '#006BB6', '76ers': '#006BB6', 'philadelphia 76ers': '#006BB6',
          'raptors': '#CE1141', 'toronto raptors': '#CE1141',
          'jazz': '#002B5C', 'utah jazz': '#002B5C',
          'thunder': '#007AC1', 'oklahoma city thunder': '#007AC1',
          'clippers': '#C8102E', 'la clippers': '#C8102E',
          'hawks': '#E03A3E', 'atlanta hawks': '#E03A3E',
          'nets': '#000000', 'brooklyn nets': '#000000',
          'hornets': '#1D1160', 'charlotte hornets': '#1D1160',
          'grizzlies': '#5D76A9', 'memphis grizzlies': '#5D76A9',
          'timberwolves': '#0C2340', 'minnesota timberwolves': '#0C2340',
          'pelicans': '#0C2340', 'new orleans pelicans': '#0C2340',
          'magic': '#0077C0', 'orlando magic': '#0077C0',
          'blazers': '#E03A3E', 'portland trail blazers': '#E03A3E',
          'kings': '#5A2D81', 'sacramento kings': '#5A2D81',
          'pacers': '#002D62', 'indiana pacers': '#002D62',
          'wizards': '#002B5C', 'washington wizards': '#002B5C',
          'sonics': '#00653A', 'seattle supersonics': '#00653A',
          'bullets': '#002B5C', 'washington bullets': '#002B5C',
        };

        const chave = Object.keys(mapaCoresprimarias).find(k =>
          busca.includes(k) || k.includes(busca)
        );

        return chave ? mapaCoresprimarias[chave] : null;
      }
}