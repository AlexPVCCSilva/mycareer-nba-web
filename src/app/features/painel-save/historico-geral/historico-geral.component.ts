import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICampanhaFranquia,
  IJogadorFotoCustom,
  ITemporadaGeral,
  StatusElenco,
  SupabaseService
} from '../../../core/services/supabase.service';
import { IdolCalculatorService, JogadorStatsFranquia } from '../../../core/services/idol-calculator.service';
import { marked } from 'marked';

interface IJogadorElencoFotoItem {
  posicao: string;
  nomeBruto: string;
  nomeExibicao: string;
  nomeChave: string;
  ovr: number | null;
}

interface ICampanhaForm {
  [key: string]: any; 
  temporada: string;
  recorde_wl: string;
  rank_conferencia: number | null;
  resultado_playoffs: string;
  pg: string;
  sg: string;
  sf: string;
  pf: string;
  c: string;
  sexto_homem: string;
  draftado: string;
  observacoes: string;
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

interface ITemporadaGeralForm {
  temporada: string;
  campeao_oeste: string;
  campeao_leste: string;
  campeao_nba: string;
  resultado_finais: string;
  mvp: string;
  rookie_of_the_year: string;
  sixth_man: string;
  dpoy: string;
  mip: string;
  mvp_time: string;
  rookie_of_the_year_time: string;
  sixth_man_time: string;
  dpoy_time: string;
  mip_time: string;
  executivo_do_ano?: string;
  executivo_do_ano_time?: string;
}

const NBA_PLAYERS: { [key: string]: string } = {
  "zaccharie risacher": "1642277", "alex sarr": "1642278", "reed sheppard": "1642279",
  "stephon castle": "1642280", "ron holland": "1642281", "matas buzelis": "1642282",
  "donovan clingan": "1642283", "rob dillingham": "1642284", "zach edey": "1642285",
  "cody williams": "1642286", "dalton knecht": "1642287", "devin carter": "1642288",
  "bub carrington": "1642289", "kel'el ware": "1642290", "nikola topic": "1642291",
  "jared mccain": "1642292", "kyshawn george": "1642293", "tristan da silva": "1642294",
  "ja'kobe walter": "1642295", "tyler smith": "1642296", "daron holmes ii": "1642297",
  "rj davis": "1642500", "cooper flagg": "1642843",
  "gui santos": "1630611", "leandro barbosa": "2571", "nene": "2403", "anderson varejao": "2760",
  "tiago splitter": "201168", "raul neto": "203526", "cristiano felicio": "1626245",
  "bruno caboclo": "203998", "didi louzada": "1629683", "marcelinho huertas": "1626273",
  "lebron james": "2544", "stephen curry": "201939", "kevin durant": "201142",
  "nikola jokic": "203999", "giannis antetokounmpo": "203507", "luka doncic": "1629029",
  "jayson tatum": "1628369", "anthony davis": "203076", "kyrie irving": "202681",
  "james harden": "201935", "kawhi leonard": "202695", "joel embiid": "203954",
  "shai gilgeous-alexander": "1628983", "devin booker": "1626164", "jimmy butler": "202710",
  "damian lillard": "203081", "paul george": "202331", "ja morant": "1629630",
  "donovan mitchell": "1628378", "anthony edwards": "1630162", "deaaron fox": "1628368",
  "trae young": "1629027", "jaylen brown": "1627759", "bam adebayo": "1628389",
  "karl-anthony towns": "1626157", "zion williamson": "1629627", "tyrese haliburton": "1630169",
  "jalen brunson": "1628973", "victor wembanyama": "1641705", "rudy gobert": "203497",
  "jamal murray": "1627750", "domantas sabonis": "1627734", "pascal siakam": "1627783",
  "lauri markkanen": "1628374", "kristaps porzingis": "204001", "jrue holiday": "201950",
  "demar derozan": "201942", "bradley beal": "203078", "zach lavine": "203897",
  "julius randle": "203944", "brandon ingram": "1627742", "khris middleton": "203114",
  "cj mccollum": "203468", "dejounte murray": "1627749", "aaron gordon": "203932",
  "myles turner": "1626167", "fred vanvleet": "1627832", "derrick white": "1628401",
  "draymond green": "203110", "klay thompson": "202691",
  "tyrese maxey": "1630178", "paolo banchero": "1631094", "chet holmgren": "1631096",
  "jalen williams": "1631114", "scottie barnes": "1630567", "evan mobley": "1630596",
  "franz wagner": "1630532", "alperen sengun": "1630578", "jalen green": "1630224",
  "lamelo ball": "1630163", "darius garland": "1629636", "tyler herro": "1629639",
  "desmond bane": "1630217", "jaren jackson jr": "1628991", "mikal bridges": "1628969",
  "josh giddey": "1630581", "brandon miller": "1641706", "scoot henderson": "1641707",
  "cade cunningham": "1630595", "jalen suggs": "1630591", "ausar thompson": "1641709",
  "amen thompson": "1641708", "dereck lively ii": "1641726", "rui hachimura": "1629060",
  "austin reaves": "1630559", "d'angelo russell": "1626156", "marcus smart": "203935",
  "jarrett allen": "1628386", "john collins": "1628381", "kyle kuzma": "1628398",
  "og anunoby": "1628384", "dillon brooks": "1628415", "anfernee simons": "1629014",
  "wendell carter jr": "1628976", "donte divincenzo": "1628408", "rj barrett": "1628392",
  "jordan poole": "1629673", "cam johnson": "1629023", "alex caruso": "1630527",
  "luguentz dort": "1629652", "naz reid": "1629675", "max strus": "1629622",
  "gabe vincent": "1629216", "caleb martin": "1628997", "duncan robinson": "1629130",
  "grant williams": "1629684", "pj washington": "1629020", "brook lopez": "201572",
  "tobias harris": "202699", "nikola vucevic": "202696", "buddy hield": "1627741",
  "russell westbrook": "201566", "carmelo anthony": "2546", "chris paul": "101108",
  "derrick rose": "201565", "blake griffin": "201933", "john wall": "202322",
  "lamarcus aldridge": "200746", "marc gasol": "201188", "dwyane wade": "2548",
  "dwight howard": "2746", "chris bosh": "2547", "tony parker": "2225",
  "manu ginobili": "1938", "pau gasol": "2200", "dirk nowitzki": "1717",
  "rajon rondo": "200765", "kevin love": "201567", "andre iguodala": "2738",
  "demarcus cousins": "202326", "joakim noah": "201149", "kyle lowry": "200768",
  "kemba walker": "202689", "isaiah thomas": "202738", "serge ibaka": "201586",
  "zach randolph": "2216", "mike conley": "201144", "deron williams": "101114",
  "joe johnson": "2207", "al horford": "201143", "paul millsap": "200794",
  "deandre jordan": "201599", "goran dragic": "201609", "lou williams": "201150",
  "kobe bryant": "977", "shaquille o'neal": "406", "tim duncan": "1495",
  "allen iverson": "947", "kevin garnett": "708", "paul pierce": "1718",
  "ray allen": "951", "vince carter": "1713", "tracy mcgrady": "1503",
  "steve nash": "961", "jason kidd": "467", "yao ming": "2397", "amar'e stoudemire": "2405",
  "chris webber": "185", "grant hill": "258", "penny hardaway": "305", "gilbert arenas": "2240",
  "chauncey billups": "1497", "ben wallace": "739", "rasheed wallace": "198",
  "stephon marbury": "950", "steve francis": "948", "jason terry": "478",
  "jamal crawford": "1890", "jr smith": "2747", "kyle korver": "202684",
  "jj redick": "2594", "richard jefferson": "2210", "michael jordan": "893",
  "magic johnson": "77142", "larry bird": "76168", "hakeem olajuwon": "165",
  "david robinson": "50", "charles barkley": "787", "john stockton": "304",
  "karl malone": "252", "scottie pippen": "937", "patrick ewing": "121",
  "clyde drexler": "17", "dominique wilkins": "1122", "reggie miller": "397",
  "alonzo mourning": "278", "dikembe mutombo": "87", "dennis rodman": "14",
  "gary payton": "56", "shawn kemp": "431", "isiah thomas": "77372",
  "kareem abdul-jabbar": "76003", "julius erving": "76622", "moses malone": "77319",
  "tim hardaway": "422", "mitch richmond": "297", "david thompson": "78648",
  "george gervin": "76837", "bill russell": "78049", "wilt chamberlain": "76311",
  "joe dumars": "73", "chris mullin": "193", "vlade divac": "124", "elton brand": "1882",
  "antoine rigaudeau": "2658", "carlos boozer": "2430", "boris diaw": "2564",
  "drazen petrovic": "382", "vinnie johnson": "77143", "kevin mchale": "77536",
  "sidney moncrief": "77626", "terry cummings": "184", "arvydas sabonis": "717",
  "toni kukoc": "314", "peja stojakovic": "1712", "andrei kirilenko": "1905",
  "luis scola": "2449", "sarunas marciulionis": "260", "detlef schrempf": "30",
  "ricky rubio": "201937", "andres nocioni": "1733", "mehmet okur": "2246",
  "hedo turkoglu": "2045", "zydrunas ilgauskas": "980", "andre miller": "1889",
  "tristan thompson": "202684", "shawn marion": "1890", "richard hamilton": "1888",
  "jason williams": "1715", "kenyon martin": "2030", "lamar odom": "2084",
  "corey maggette": "2034", "ron artest": "1897", "stephen jackson": "1536",
  "tayshaun prince": "1886", "mike bibby": "1710", "ben gordon": "1894",
  "luol deng": "2736", "udonis haslem": "2617", "jermaine o'neal": "979",
  "michael redd": "2072", "shane battier": "2203", "gerald wallace": "2222",
  "david west": "2561", "danny granger": "101147", "jason richardson": "2243",
  "baron davis": "2883", "marcus camby": "1711", "steve franchise": "948",
  "carlos arroyo": "1889", "dan majerle": "160", "larry johnson": "187",
  "glen rice": "20", "horace grant": "270", "rik smits": "53", "mark jackson": "349",
  "ron harper": "351", "john starks": "136", "steve kerr": "31", "muggsy bogues": "163",
  "cliff robinson": "194", "dennis scott": "182", "nick anderson": "107",
  "bj armstrong": "167", "terry porter": "45", "sean elliott": "251", "lorenzen wright": "964",
  "dale davis": "208", "antonio davis": "213", "jerry stackhouse": "2754",
  "bill laimbeer": "77328", "rick mahorn": "77443", "dennis johnson": "77138",
  "james worthy": "78621", "byron scott": "144", "michael cooper": "76442",
  "robert parish": "77800", "bernard king": "77264", "alex english": "76673",
  "kiki vandeweghe": "78401", "danny ainge": "76017", "bob mcadoo": "77508",
  "jamaal wilkes": "78523", "bill walton": "78450", "maurice cheeks": "76383"
};

const NBA_TEAMS_INFO: { [key: string]: { abrev: string; sec: string; prim?: string } } = {
  "seattle supersonics": { abrev: "sea", sec: "#FFC72C", prim: "#00653A" },
  "supersonics": { abrev: "sea", sec: "#FFC72C", prim: "#00653A" },
  "sonics": { abrev: "sea", sec: "#FFC72C", prim: "#00653A" },
  "new jersey nets": { abrev: "nj", sec: "#A71930", prim: "#002B5C" },
  "new jersey": { abrev: "nj", sec: "#A71930", prim: "#002B5C" },
  "charlotte bobcats": { abrev: "bob", sec: "#F26F21", prim: "#002B5C" },
  "bobcats": { abrev: "bob", sec: "#F26F21", prim: "#002B5C" },
  "vancouver grizzlies": { abrev: "van", sec: "#BC945C", prim: "#00B2A9" },
  "vancouver": { abrev: "van", sec: "#BC945C", prim: "#00B2A9" },
  "washington bullets": { abrev: "wsh", sec: "#E31837", prim: "#002B5C" },
  "hawks": { abrev: "atl", sec: "#C1D32F", prim: "#E03A3E" },
  "boston celtics": { abrev: "bos", sec: "#BA9653", prim: "#007A33" },
  "celtics": { abrev: "bos", sec: "#BA9653", prim: "#007A33" },
  "brooklyn nets": { abrev: "bkn", sec: "#777777", prim: "#000000" },
  "nets": { abrev: "bkn", sec: "#777777", prim: "#000000" },
  "charlotte hornets": { abrev: "cha", sec: "#00788C", prim: "#1D1160" },
  "hornets": { abrev: "cha", sec: "#00788C", prim: "#1D1160" },
  "bulls": { abrev: "chi", sec: "#000000", prim: "#CE1141" },
  "cavaliers": { abrev: "cle", sec: "#FDBB30", prim: "#860038" },
  "cavs": { abrev: "cle", sec: "#FDBB30", prim: "#860038" },
  "mavericks": { abrev: "dal", sec: "#B8C4CA", prim: "#00538C" },
  "mavs": { abrev: "dal", sec: "#B8C4CA", prim: "#00538C" },
  "nuggets": { abrev: "den", sec: "#FEC524", prim: "#0E2240" },
  "pistons": { abrev: "det", sec: "#1D42BA", prim: "#C8102E" },
  "warriors": { abrev: "gs", sec: "#FFC72C", prim: "#1D428A" },
  "golden state": { abrev: "gs", sec: "#FFC72C", prim: "#1D428A" },
  "rockets": { abrev: "hou", sec: "#000000", prim: "#CE1141" },
  "pacers": { abrev: "ind", sec: "#FDBB30", prim: "#002D62" },
  "clippers": { abrev: "lac", sec: "#1D428A", prim: "#C8102E" },
  "lakers": { abrev: "lal", sec: "#FDB927", prim: "#552583" },
  "memphis grizzlies": { abrev: "mem", sec: "#12173F", prim: "#5D76A9" },
  "grizzlies": { abrev: "mem", sec: "#12173F", prim: "#5D76A9" },
  "heat": { abrev: "mia", sec: "#F9A01B", prim: "#98002E" },
  "bucks": { abrev: "mil", sec: "#EEE1C6", prim: "#00471B" },
  "timberwolves": { abrev: "min", sec: "#236192", prim: "#0C2340" },
  "wolves": { abrev: "min", sec: "#236192", prim: "#0C2340" },
  "pelicans": { abrev: "nop", sec: "#C8102E", prim: "#0C2340" },
  "knicks": { abrev: "ny", sec: "#F58426", prim: "#006BB6" },
  "oklahoma city thunder": { abrev: "okc", sec: "#EF3B24", prim: "#007AC1" },
  "thunder": { abrev: "okc", sec: "#EF3B24", prim: "#007AC1" },
  "magic": { abrev: "orl", sec: "#C4CED4", prim: "#0077C0" },
  "76ers": { abrev: "phi", sec: "#ED174C", prim: "#006BB6" },
  "sixers": { abrev: "phi", sec: "#ED174C", prim: "#006BB6" },
  "suns": { abrev: "phx", sec: "#E56020", prim: "#1D1160" },
  "blazers": { abrev: "por", sec: "#000000", prim: "#E03A3E" },
  "trail blazers": { abrev: "por", sec: "#000000", prim: "#E03A3E" },
  "kings": { abrev: "sac", sec: "#63727A", prim: "#5A2D81" },
  "spurs": { abrev: "sa", sec: "#000000", prim: "#C4CED4" },
  "raptors": { abrev: "tor", sec: "#000000", prim: "#CE1141" },
  "jazz": { abrev: "utah", sec: "#F9A01B", prim: "#002B5C" },
  "wizards": { abrev: "was", sec: "#E31837", prim: "#002B5C" },
  "washington": { abrev: "was", sec: "#E31837", prim: "#002B5C" }
};

@Component({
  selector: 'app-historico-geral',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './historico-geral.component.html',
  styleUrls: ['./historico-geral.component.scss']
})
export class HistoricoGeralComponent implements OnInit {
  // Mobile Menu State
  menuAberto = window.innerWidth > 900;
  
  // Wizard State (Modal Campanha)
  wizardSegmentCampanha: 'resultados' | 'elenco' | 'fotos' = 'resultados';

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenuMobile() {
    if (window.innerWidth <= 900) {
      this.menuAberto = false;
    }
  }

  private cacheCorSec: { [nome: string]: string } = {};

  ligaId: string | null = null;
  temporadas: ITemporadaGeral[] = [];
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
  campanhasTime: ICampanhaFranquia[] = [];
  carregandoTime = false;
  mostrarFormularioTime = false;
  fotosJogadoresCustom: Record<string, IJogadorFotoCustom> = {};
  uploadFotoModo: 'base64' | 'supabase' = 'base64';
  uploadFotoJogadorAlvo: string | null = null;
  salvandoFotoJogadorChave: string | null = null;
  sincronizandoIdolos = false;

  async forcarSincronizacaoIdolos() {
    if (this.sincronizandoIdolos) return;
    const timeAtivo = this.franquias.find(f => f.id === this.abaAtiva);
    if (!timeAtivo) return;

    this.sincronizandoIdolos = true;
    this.cdr.detectChanges();
    try {
      await this.sincronizarEAtualizarIdolos(timeAtivo.nome);
      const lendasBrutas = await this.supabaseService.getHallDaFamaDaFranquia(this.ligaId!, timeAtivo.nome);
      this.lendasTime = lendasBrutas.map(l => this.enriquecerLendaComEstatisticas(l)).sort((a, b) => (b.score || 0) - (a.score || 0));
    } catch (error) {
      console.error('Erro ao forçar sincronização de ídolos:', error);
      alert('Não foi possível sincronizar os ídolos neste momento.');
    } finally {
      this.sincronizandoIdolos = false;
      this.cdr.detectChanges();
    }
  }

  @ViewChild('fotoElencoInput') fotoElencoInput?: ElementRef<HTMLInputElement>;
  
  readonly statusElencoOptions: { value: StatusElenco; label: string; short: string }[] = [
    { value: 'principal', label: 'Principal', short: 'P' },
    { value: 'secundario', label: 'Secundário', short: 'S' },
    { value: 'terciario', label: 'Terciário', short: 'T' },
    { value: 'nenhum', label: 'Nenhum / Sem Status', short: '—' }
  ];
  
  readonly camposPremiacao = [
    { key: 'mvp', label: 'MVP' },
    { key: 'rookie_of_the_year', label: 'ROY (Rookie)' },
    { key: 'sixth_man', label: '6th Man' },
    { key: 'dpoy', label: 'DPOY' },
    { key: 'mip', label: 'MIP' }
  ];
  
  readonly camposHierarquiaElenco: { key: string; label: string; statusKey: string; ovrKey: string }[] = [
    { key: 'pg', label: 'PG', statusKey: 'pg_status', ovrKey: 'pg_ovr' },
    { key: 'sg', label: 'SG', statusKey: 'sg_status', ovrKey: 'sg_ovr' },
    { key: 'sf', label: 'SF', statusKey: 'sf_status', ovrKey: 'sf_ovr' },
    { key: 'pf', label: 'PF', statusKey: 'pf_status', ovrKey: 'pf_ovr' },
    { key: 'c', label: 'C', statusKey: 'c_status', ovrKey: 'c_ovr' },
    { key: 'sexto_homem', label: '6º Homem', statusKey: 'sexto_homem_status', ovrKey: 'sexto_homem_ovr' },
    { key: 'draftado', label: 'Draftado', statusKey: 'draftado_status', ovrKey: 'draftado_ovr' }
  ];
  
  // --- Hall da Fama ---
  lendasTime: any[] = [];
  mostrarFormularioLenda = false;
  salvandoLenda = false;
  
  // Controle do Modal de Edição de Ídolo
  idoloSelecionado: any = null;
  salvandoIdoloEditado = false;
  
  get camisasAposentadas() {
    return this.lendasTime.filter(l => l.numero_camisa && l.numero_camisa.trim() !== '');
  }

  // --- Controle da Campanha ---
  salvandoCampanha = false;
  novaCampanha: ICampanhaForm = this.getCampanhaInicial();

  timesPreDefinidos = [
    { nome: 'Atlanta Hawks', corHex: '#E03A3E' }, { nome: 'Boston Celtics', corHex: '#007A33' },
    { nome: 'Brooklyn Nets', corHex: '#000000' }, { nome: 'Charlotte Hornets', corHex: '#1D1160' },
    { nome: 'Chicago Bulls', corHex: '#CE1141' }, { nome: 'Cleveland Cavaliers', corHex: '#860038' },
    { nome: 'Dallas Mavericks', corHex: '#00538C' }, { nome: 'Denver Nuggets', corHex: '#0E2240' },
    { nome: 'Detroit Pistons', corHex: '#C8102E' }, { nome: 'Golden State Warriors', corHex: '#1D428A' },
    { nome: 'Houston Rockets', corHex: '#CE1141' }, { nome: 'Indiana Pacers', corHex: '#FDBB30' },
    { nome: 'LA Clippers', corHex: '#C8102E' }, { nome: 'Los Angeles Lakers', corHex: '#552583' },
    { nome: 'Memphis Grizzlies', corHex: '#5D76A9' }, { nome: 'Miami Heat', corHex: '#98002E' },
    { nome: 'Milwaukee Bucks', corHex: '#00471B' }, { nome: 'Minnesota Timberwolves', corHex: '#0C2340' },
    { nome: 'New Orleans Pelicans', corHex: '#0C2340' }, { nome: 'New York Knicks', corHex: '#F58426' },
    { nome: 'Oklahoma City Thunder', corHex: '#007AC1' }, { nome: 'Orlando Magic', corHex: '#0077C0' },
    { nome: 'Philadelphia 76ers', corHex: '#006BB6' }, { nome: 'Phoenix Suns', corHex: '#1D1160' },
    { nome: 'Portland Trail Blazers', corHex: '#E03A3E' }, { nome: 'Sacramento Kings', corHex: '#5A2D81' },
    { nome: 'San Antonio Spurs', corHex: '#C4CED4' }, { nome: 'Toronto Raptors', corHex: '#CE1141' },
    { nome: 'Utah Jazz', corHex: '#002B5C' }, { nome: 'Washington Wizards', corHex: '#002B5C' }
  ];

  abaAtiva = 'geral';
  abaFranquiaAtiva: 'temporadas' | 'idolos' = 'temporadas';
  franquias: any[] = [];
  
// ── Configurações da Liga ──────────────────────────────────
mostrarModalConfiguracoes = false;
franquiaEditandoId: string | null = null;
franquiaEditandoForm: {
  nome: string;
  corHex: string;
  logo_url: string | null;
} = { nome: '', corHex: '#552583', logo_url: null };
salvandoEdicaoFranquia = false;

  // AQUI FICAVAM AS VARIÁVEIS DUPLICADAS, AGORA ESTÃO LIMPAS:
  mostrarModalFranquia = false;
  novaFranquia = { nome: '', corHex: '#552583', logo_url: null as string | null };
  salvandoFranquia = false;

  mostrarFormulario = false;
  novaTemporada: ITemporadaGeralForm = this.getTemporadaInicial();
  salvando = false;

  editandoIdGeral: string | null = null;
  editandoIdTime: string | null = null;

  topMVPs: any[] = [];
  topDPOYs: any[] = [];

  get timesAutocomplete(): string[] {
    const nomes = new Set<string>();
    this.timesPreDefinidos.forEach(t => nomes.add(t.nome));
    this.franquias.forEach(f => nomes.add(f.nome));
    if (this.temporadas) {
      this.temporadas.forEach(t => {
        if (t.campeao_nba) nomes.add(t.campeao_nba);
        if (t.campeao_oeste) nomes.add(t.campeao_oeste);
        if (t.campeao_leste) nomes.add(t.campeao_leste);
        if (t.mvp_time) nomes.add(t.mvp_time);
        if (t.dpoy_time) nomes.add(t.dpoy_time);
        // @ts-ignore - Some records might map fields differently, but sticking to what's defined in the interface
        if ((t as any).rookie_of_the_year_time) nomes.add((t as any).rookie_of_the_year_time);
        // @ts-ignore
        if ((t as any).sixth_man_time) nomes.add((t as any).sixth_man_time);
      });
    }
    return Array.from(nomes).filter(n => n && n !== '-' && n !== '—').sort();
  }
  topCampeoes: any[] = [];
  
  lembrancas: any[] = [];
  mostrarFormularioLembranca = false;
  salvandoLembranca = false;
  editandoIdLembranca: string | null = null;
  novaLembranca: any = { data_evento: '', titulo: '', descricao: '', imagem_url: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private idolCalculator: IdolCalculatorService,
    private cdr: ChangeDetectorRef
  ) {}

  private getCampanhaInicial(): ICampanhaForm {
    return {
      temporada: '', recorde_wl: '', rank_conferencia: null, resultado_playoffs: '',
      pg: '', sg: '', sf: '', pf: '', c: '', sexto_homem: '', draftado: '', observacoes: '',
      pg_ovr: null, sg_ovr: null, sf_ovr: null, pf_ovr: null, c_ovr: null,
      sexto_homem_ovr: null, draftado_ovr: null,
      pg_status: 'principal',
      sg_status: 'principal',
      sf_status: 'principal',
      pf_status: 'principal',
      c_status: 'principal',
      sexto_homem_status: 'secundario',
      draftado_status: 'terciario'
    };
  }

  private normalizarStatusElenco(status?: string | null): StatusElenco {
    if (status === 'principal' || status === 'secundario' || status === 'terciario' || status === 'nenhum') {
      return status;
    }
    return 'terciario';
  }

  private normalizarCampanhaCarregada(camp: ICampanhaFranquia): ICampanhaFranquia {
    const migrado = this.migrarOvrLegadoDoNome(camp);
    return {
      ...camp,
      ...migrado,
      pg: migrado.pg ?? (camp.pg ? SupabaseService.limparNomeJogador(camp.pg) : camp.pg),
      sg: migrado.sg ?? (camp.sg ? SupabaseService.limparNomeJogador(camp.sg) : camp.sg),
      sf: migrado.sf ?? (camp.sf ? SupabaseService.limparNomeJogador(camp.sf) : camp.sf),
      pf: migrado.pf ?? (camp.pf ? SupabaseService.limparNomeJogador(camp.pf) : camp.pf),
      c: migrado.c ?? (camp.c ? SupabaseService.limparNomeJogador(camp.c) : camp.c),
      sexto_homem: migrado.sexto_homem ?? (camp.sexto_homem ? SupabaseService.limparNomeJogador(camp.sexto_homem) : camp.sexto_homem),
      draftado: migrado.draftado ?? (camp.draftado ? SupabaseService.limparNomeJogador(camp.draftado) : camp.draftado),
      pg_ovr: camp.pg_ovr ?? migrado.pg_ovr ?? null,
      sg_ovr: camp.sg_ovr ?? migrado.sg_ovr ?? null,
      sf_ovr: camp.sf_ovr ?? migrado.sf_ovr ?? null,
      pf_ovr: camp.pf_ovr ?? migrado.pf_ovr ?? null,
      c_ovr: camp.c_ovr ?? migrado.c_ovr ?? null,
      sexto_homem_ovr: camp.sexto_homem_ovr ?? migrado.sexto_homem_ovr ?? null,
      draftado_ovr: camp.draftado_ovr ?? migrado.draftado_ovr ?? null,
      pg_status: this.normalizarStatusElenco(camp.pg_status),
      sg_status: this.normalizarStatusElenco(camp.sg_status),
      sf_status: this.normalizarStatusElenco(camp.sf_status),
      pf_status: this.normalizarStatusElenco(camp.pf_status),
      c_status: this.normalizarStatusElenco(camp.c_status),
      sexto_homem_status: this.normalizarStatusElenco(camp.sexto_homem_status || 'secundario'),
      draftado_status: this.normalizarStatusElenco(camp.draftado_status || 'terciario')
    };
  }

  private migrarOvrLegadoDoNome(camp: ICampanhaFranquia): Partial<ICampanhaForm> {
    const patch: Partial<ICampanhaForm> = {};
    const slots = ['pg', 'sg', 'sf', 'pf', 'c', 'sexto_homem', 'draftado'] as const;

    for (const slot of slots) {
      const nomeBruto = camp[slot];
      if (!nomeBruto) continue;
      const ovrKey = `${slot}_ovr` as keyof ICampanhaForm;
      if (camp[ovrKey as keyof ICampanhaFranquia] != null) continue;

      const match = nomeBruto.match(/^\s*(?:ovr\s*)?(\d{1,2})\s*[-–—:/]+\s*/i);
      if (match) {
        (patch as Record<string, unknown>)[ovrKey] = parseInt(match[1], 10);
        (patch as Record<string, unknown>)[slot] = SupabaseService.limparNomeJogador(nomeBruto);
      }
    }
    return patch;
  }

  private sanitizarOvr(ovr: number | null | undefined): number | null {
    if (ovr == null || ovr === undefined || Number.isNaN(ovr)) return null;
    const valor = Math.round(ovr);
    if (valor < 40 || valor > 99) return null;
    return valor;
  }

  getNomeJogadorExibicao(nome: string | null | undefined, ovr: number | null | undefined): string {
    const nomeLimpo = SupabaseService.limparNomeJogador(nome);
    if (!nomeLimpo) return '';
    const ovrValido = this.sanitizarOvr(ovr);
    return ovrValido ? `${ovrValido} · ${nomeLimpo}` : nomeLimpo;
  }

  private montarDadosCampanhaParaSalvar(franquia: string): ICampanhaFranquia {
    return {
      liga_id: this.ligaId!,
      franquia,
      temporada: this.novaCampanha.temporada,
      recorde_wl: this.novaCampanha.recorde_wl || null,
      rank_conferencia: this.novaCampanha.rank_conferencia,
      resultado_playoffs: this.novaCampanha.resultado_playoffs || null,
      pg: SupabaseService.limparNomeJogador(this.novaCampanha.pg) || null,
      sg: SupabaseService.limparNomeJogador(this.novaCampanha.sg) || null,
      sf: SupabaseService.limparNomeJogador(this.novaCampanha.sf) || null,
      pf: SupabaseService.limparNomeJogador(this.novaCampanha.pf) || null,
      c: SupabaseService.limparNomeJogador(this.novaCampanha.c) || null,
      sexto_homem: SupabaseService.limparNomeJogador(this.novaCampanha.sexto_homem) || null,
      draftado: SupabaseService.limparNomeJogador(this.novaCampanha.draftado) || null,
      observacoes: this.novaCampanha.observacoes || null,
      pg_ovr: this.sanitizarOvr(this.novaCampanha.pg_ovr),
      sg_ovr: this.sanitizarOvr(this.novaCampanha.sg_ovr),
      sf_ovr: this.sanitizarOvr(this.novaCampanha.sf_ovr),
      pf_ovr: this.sanitizarOvr(this.novaCampanha.pf_ovr),
      c_ovr: this.sanitizarOvr(this.novaCampanha.c_ovr),
      sexto_homem_ovr: this.sanitizarOvr(this.novaCampanha.sexto_homem_ovr),
      draftado_ovr: this.sanitizarOvr(this.novaCampanha.draftado_ovr),
      pg_status: this.novaCampanha.pg_status,
      sg_status: this.novaCampanha.sg_status,
      sf_status: this.novaCampanha.sf_status,
      pf_status: this.novaCampanha.pf_status,
      c_status: this.novaCampanha.c_status,
      sexto_homem_status: this.novaCampanha.sexto_homem_status,
      draftado_status: this.novaCampanha.draftado_status
    };
  }

  private getTemporadaInicial(): ITemporadaGeralForm {
    return {
      temporada: '', campeao_oeste: '', campeao_leste: '', campeao_nba: '', resultado_finais: '',
      mvp: '', rookie_of_the_year: '', sixth_man: '', dpoy: '', mip: '',
      mvp_time: '', rookie_of_the_year_time: '', sixth_man_time: '', dpoy_time: '', mip_time: '',
      executivo_do_ano: '', executivo_do_ano_time: ''
    };
  }

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
    await this.carregarFotosJogadoresCustom();
  }


  isMinhaFranquiaCampeao(campeaoNba: string | null): boolean {
    if (!campeaoNba || !this.franquias) return false;
    const nomeLimpo = campeaoNba.trim().toLowerCase();
    return this.franquias.some(f => f.nome.toLowerCase().includes(nomeLimpo) || nomeLimpo.includes(f.nome.toLowerCase()));
  }

  isMeuTime(nomeTime: string | null | undefined): boolean {
    if (!nomeTime || !this.franquias) return false;
    const nomeLimpo = nomeTime.trim().toLowerCase();
    return this.franquias.some(f => f.nome.toLowerCase().includes(nomeLimpo) || nomeLimpo.includes(f.nome.toLowerCase()));
  }

  getCorMeuTime(nomeTime: string | null | undefined): string | null {
    if (!nomeTime || !this.franquias) return null;
    const nomeLimpo = nomeTime.trim().toLowerCase();
    const franquia = this.franquias.find(f => f.nome.toLowerCase().includes(nomeLimpo) || nomeLimpo.includes(f.nome.toLowerCase()));
    return franquia ? franquia.cor_hex : null;
  }

  getCorAtualFranquia(): string {
    const franquia = this.franquias.find(f => f.id === this.abaAtiva);
    return franquia?.cor_hex || '#FDB927';
  }

  async carregarHistorico() {
    this.carregando = true;
    try {
      if (this.ligaId) {
        this.temporadas = await this.supabaseService.getHistoriaGeralPorLiga(this.ligaId);
        this.calcularTop3(); 
      }
    } catch (error) {
      console.error('Erro ao carregar história geral:', error);
      this.temporadas = [];
      alert('Não foi possível carregar a História Geral agora.');
    }
    this.carregando = false;
    this.cdr.detectChanges();
  }

  async adicionarTemporada() {
    if (!this.novaTemporada.temporada) return alert('O ano da temporada é obrigatório!');
    if (!this.ligaId) return alert('Liga inválida para salvar a temporada.');
    this.salvando = true;
    try {
      const dadosParaSalvar: ITemporadaGeral = {
        liga_id: this.ligaId,
        temporada: this.novaTemporada.temporada,
        campeao_oeste: this.novaTemporada.campeao_oeste || null,
        campeao_leste: this.novaTemporada.campeao_leste || null,
        campeao_nba: this.novaTemporada.campeao_nba || null,
        resultado_finais: this.novaTemporada.resultado_finais || null,
        mvp: this.novaTemporada.mvp || null,
        rookie_of_the_year: this.novaTemporada.rookie_of_the_year || null,
        sixth_man: this.novaTemporada.sixth_man || null,
        dpoy: this.novaTemporada.dpoy || null,
        mip: this.novaTemporada.mip || null,
        mvp_time: this.novaTemporada.mvp_time || null,
        rookie_of_the_year_time: this.novaTemporada.rookie_of_the_year_time || null,
        sixth_man_time: this.novaTemporada.sixth_man_time || null,
        dpoy_time: this.novaTemporada.dpoy_time || null,
        mip_time: this.novaTemporada.mip_time || null,
        executivo_do_ano: this.novaTemporada.executivo_do_ano || null,
        executivo_do_ano_time: this.novaTemporada.executivo_do_ano_time || null
      };

      if (this.editandoIdGeral) {
        await this.supabaseService.atualizarTemporadaGeral(this.editandoIdGeral, dadosParaSalvar);
      } else {
        await this.supabaseService.salvarTemporadaGeral(dadosParaSalvar);
      }
      this.cancelarEdicaoGeral(); 
      await this.carregarHistorico();
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      alert('Erro ao salvar no banco.');
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

  sincronizarScroll(event: Event, elementoAlvo: HTMLElement | null | undefined) {
    if (!elementoAlvo) return;
    const origem = event.target as HTMLElement;
    if (origem) {
      elementoAlvo.scrollLeft = origem.scrollLeft;
    }
  }

  voltarParaOLobby() {
    this.router.navigate(['/']);
  }

  async carregarFranquias() {
    try {
      if (this.ligaId) {
        this.franquias = await this.supabaseService.getFranquiasPorLiga(this.ligaId);
      }
    } catch (error) {
      console.error('Erro ao carregar franquias:', error);
      this.franquias = [];
      alert('Não foi possível carregar as franquias agora.');
    }
    this.cdr.detectChanges();
  }

  async trocarAba(abaId: string | undefined) {
    if (!abaId) return;
    this.abaAtiva = abaId;
    this.abaFranquiaAtiva = 'temporadas'; // Reseta aba interna
    if (abaId === 'lembrancas') {
      await this.carregarLembrancas();
    } else if (abaId !== 'geral') {
      this.carregandoTime = true;
      const timeAtivo = this.franquias.find(f => f.id === abaId);
      
      if (timeAtivo) {
        try {
          const campanhasBrutas = await this.supabaseService.getCampanhasDaFranquia(this.ligaId!, timeAtivo.nome);
          this.campanhasTime = campanhasBrutas.map(camp => this.normalizarCampanhaCarregada(camp));
          
          // Sincroniza e atualiza os ídolos de forma totalmente automática
          await this.sincronizarEAtualizarIdolos(timeAtivo.nome);
          
          const lendasBrutas = await this.supabaseService.getHallDaFamaDaFranquia(this.ligaId!, timeAtivo.nome);
          this.lendasTime = lendasBrutas.map(l => this.enriquecerLendaComEstatisticas(l)).sort((a, b) => (b.score || 0) - (a.score || 0));
        } catch (error) {
          console.error('Erro ao carregar dados da franquia:', error);
          this.campanhasTime = [];
          this.lendasTime = [];
          alert('Não foi possível carregar os dados da franquia.');
        }
      }
      this.carregandoTime = false;
      this.cdr.detectChanges();
    }
  }

  async adicionarCampanhaTime() {
    if (!this.novaCampanha.temporada) return alert('O ano da temporada é obrigatório!');
    if (!this.ligaId) return alert('Liga inválida para salvar a campanha.');
    this.salvandoCampanha = true;
    try {
      const timeAtivo = this.franquias.find(f => f.id === this.abaAtiva);
      if (!timeAtivo) throw new Error('Nenhuma franquia ativa selecionada.');
      
      const dadosParaSalvar = this.montarDadosCampanhaParaSalvar(timeAtivo.nome);

      if (this.editandoIdTime) {
        await this.supabaseService.atualizarCampanhaFranquia(this.editandoIdTime, dadosParaSalvar);
      } else {
        await this.supabaseService.salvarCampanhaFranquia(dadosParaSalvar);
      }
      this.cancelarEdicaoTime();
      const campanhasBrutas = await this.supabaseService.getCampanhasDaFranquia(this.ligaId, timeAtivo.nome);
      this.campanhasTime = campanhasBrutas.map(camp => this.normalizarCampanhaCarregada(camp));
      
      // Sincroniza logo após salvar uma nova campanha
      await this.sincronizarEAtualizarIdolos(timeAtivo.nome);
      const lendasBrutas = await this.supabaseService.getHallDaFamaDaFranquia(this.ligaId, timeAtivo.nome);
      this.lendasTime = lendasBrutas.map(l => this.enriquecerLendaComEstatisticas(l)).sort((a, b) => (b.score || 0) - (a.score || 0));
    } catch (error) {
      console.error('Erro ao salvar elenco:', error);
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
    this.novaFranquia = { nome: '', corHex: '#552583', logo_url: null };
    this.modoPersonalizado = false;
  }

  async salvarTimePadrao(time: any) {
    this.novaFranquia = { nome: time.nome, corHex: time.corHex, logo_url: null };
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
        this.novaFranquia.corHex,
        this.novaFranquia.logo_url
      );
      
      this.franquias.push(timeCriado);
      this.trocarAba(timeCriado.id); 
      this.fecharModalFranquia();
      
    } catch (error: any) {
      console.error('Erro ao salvar time:', error);
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
        const dadosTemporada: any = { liga_id: this.ligaId };

        cabecalho.forEach((nomeColuna: string, index: number) => {
          const chave = nomeColuna.trim();
          if (chave) {
            dadosTemporada[chave] = colunas[index]?.trim() || null;
          }
        });
        registrosParaSalvar.push(dadosTemporada);
      }

      try {
        const { error } = await this.supabaseService.supabase.from('historia_geral').insert(registrosParaSalvar);
        if (error) throw error;
        alert(`Sucesso! ${registrosParaSalvar.length} temporadas importadas.`);
        await this.carregarHistorico(); 
      } catch (error) {
        console.error('Erro na importação em lote:', error);
        alert('Erro ao importar planilha. Verifique se os nomes das colunas estão iguais aos do banco de dados.');
      } finally {
        this.carregando = false;
        this.cdr.detectChanges();
        event.target.value = '';
      }
    };
    leitor.readAsText(arquivo);
  }

  // --- Funções do Modal do Ídolo ---
  abrirModalNovoIdolo() {
    this.idoloSelecionado = {
      id: null,
      franquia_id: this.getNomeAbaAtiva(),
      nome: '',
      numero_camisa: '',
      categoria: 'Jogador',
      motivo: '',
      score: 0,
      isNovo: true
    };
  }

  enriquecerLendaComEstatisticas(lenda: any) {
    const anosTitulos: string[] = [];
    const anosMvp: string[] = [];
    const anosDpoy: string[] = [];
    const anosRoy: string[] = [];
    const anosSexto: string[] = [];
    let maxOvr = 0;
    
    const nomeLimpado = SupabaseService.normalizarNomeJogador(lenda.nome);
    
    if (nomeLimpado && this.campanhasTime) {
      for (const campanha of this.campanhasTime) {
        const temporadaGeral = this.temporadas.find(t => t.temporada === campanha.temporada);
        
        const jogadoresElenco = [
          { nome: campanha.pg, ovr: campanha.pg_ovr },
          { nome: campanha.sg, ovr: campanha.sg_ovr },
          { nome: campanha.sf, ovr: campanha.sf_ovr },
          { nome: campanha.pf, ovr: campanha.pf_ovr },
          { nome: campanha.c, ovr: campanha.c_ovr },
          { nome: campanha.sexto_homem, ovr: campanha.sexto_homem_ovr },
          { nome: campanha.draftado, ovr: campanha.draftado_ovr }
        ];

        const jogadorStats = jogadoresElenco.find(n => n.nome && SupabaseService.normalizarNomeJogador(n.nome) === nomeLimpado);

        if (jogadorStats) {
          const ovr = Number(jogadorStats.ovr) || 0;
          if (ovr > maxOvr) maxOvr = ovr;

          if (temporadaGeral?.campeao_nba === this.getNomeAbaAtiva()) {
            anosTitulos.push(campanha.temporada);
          }
          
          if (temporadaGeral) {
            const verificarPremio = (campoPremio: string | null | undefined) => {
               return SupabaseService.normalizarNomeJogador(campoPremio) === nomeLimpado;
            };

            if (verificarPremio(temporadaGeral.mvp)) anosMvp.push(campanha.temporada);
            if (verificarPremio(temporadaGeral.dpoy)) anosDpoy.push(campanha.temporada);
            if (verificarPremio(temporadaGeral.rookie_of_the_year)) anosRoy.push(campanha.temporada);
            if (verificarPremio(temporadaGeral.sixth_man)) anosSexto.push(campanha.temporada);
          }
        }
      }
    }

    lenda.anosTitulos = anosTitulos;
    lenda.anosMvp = anosMvp;
    lenda.anosDpoy = anosDpoy;
    lenda.anosRoy = anosRoy;
    lenda.anosSexto = anosSexto;
    lenda.maxOvr = maxOvr;
    return lenda;
  }

  abrirModalIdolo(idolo: any) {
    this.idoloSelecionado = { ...idolo }; // Cria uma cópia para edição local
    this.idoloSelecionado = this.enriquecerLendaComEstatisticas(this.idoloSelecionado);
  }

  fecharModalIdolo() {
    this.idoloSelecionado = null;
  }

  async salvarEdicaoIdolo() {
    if (!this.idoloSelecionado) return;
    if (!this.idoloSelecionado.isNovo && !this.idoloSelecionado.id) return;
    if (this.idoloSelecionado.isNovo && !this.idoloSelecionado.nome) {
      alert('Por favor, informe o nome do ídolo.');
      return;
    }

    this.salvandoIdoloEditado = true;
    try {
      if (this.idoloSelecionado.isNovo) {
        const payload = {
          franquia_id: this.idoloSelecionado.franquia_id,
          nome: this.idoloSelecionado.nome,
          numero_camisa: this.idoloSelecionado.numero_camisa,
          categoria: this.idoloSelecionado.categoria,
          motivo: this.idoloSelecionado.motivo,
          score: this.idoloSelecionado.score || 50 // Manual idols get a default minimum score so they appear if user forgets
        };
        const { data, error } = await this.supabaseService.supabase
          .from('hall_da_fama')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        
        // Add to local list and resort
        this.lendasTime.push(data);
        this.lendasTime.sort((a, b) => (b.score || 0) - (a.score || 0));
      } else {
        // Atualiza diretamente na tabela hall_da_fama
        const { error } = await this.supabaseService.supabase
          .from('hall_da_fama')
          .update({
            numero_camisa: this.idoloSelecionado.numero_camisa,
            motivo: this.idoloSelecionado.motivo,
            score: this.idoloSelecionado.score,
            categoria: this.idoloSelecionado.categoria
          })
          .eq('id', this.idoloSelecionado.id);
          
        if (error) throw error;
        
        // Atualiza o card local para refletir imediatamente
        const idx = this.lendasTime.findIndex(l => l.id === this.idoloSelecionado.id);
        if (idx !== -1) {
          this.lendasTime[idx] = { ...this.idoloSelecionado };
        }
      }
      this.fecharModalIdolo();
    } catch (error) {
      console.error('Erro ao editar ídolo:', error);
      alert('Não foi possível salvar as alterações no ídolo.');
    } finally {
      this.salvandoIdoloEditado = false;
      this.cdr.detectChanges();
    }
  }

  async deletarIdolo() {
    if (!this.idoloSelecionado || this.idoloSelecionado.isNovo) return;
    if (!confirm(`Tem certeza que deseja excluir a lenda ${this.idoloSelecionado.nome}?`)) return;

    this.salvandoIdoloEditado = true;
    try {
      await this.supabaseService.deletarIdoloUnico(this.idoloSelecionado.id);
      this.lendasTime = this.lendasTime.filter(l => l.id !== this.idoloSelecionado.id);
      this.fecharModalIdolo();
    } catch (error) {
      console.error('Erro ao deletar ídolo:', error);
      alert('Não foi possível excluir o ídolo.');
    } finally {
      this.salvandoIdoloEditado = false;
      this.cdr.detectChanges();
    }
  }

  async sincronizarEAtualizarIdolos(nomeFranquia: string) {
    if (!this.ligaId) return;
    
    // 1. Dicionário para agregar estatísticas
    const statsJogadores: Record<string, JogadorStatsFranquia> = {};

    // 2. Extrair os jogadores que jogaram no time
    for (const campanha of this.campanhasTime) {
      const temporadaGeral = this.temporadas.find(t => t.temporada === campanha.temporada);
      
      let isCampeao = this.isCampanhaCampeao(campanha.resultado_playoffs);
      if (!isCampeao && temporadaGeral?.campeao_nba) {
         const nfLimpo = nomeFranquia.trim().toLowerCase();
         const cNba = temporadaGeral.campeao_nba.trim().toLowerCase();
         if (nfLimpo.includes(cNba) || cNba.includes(nfLimpo)) {
             isCampeao = true;
         }
      }
      
      const jogadoresElenco = [
        { nome: campanha.pg, ovr: campanha.pg_ovr },
        { nome: campanha.sg, ovr: campanha.sg_ovr },
        { nome: campanha.sf, ovr: campanha.sf_ovr },
        { nome: campanha.pf, ovr: campanha.pf_ovr },
        { nome: campanha.c, ovr: campanha.c_ovr },
        { nome: campanha.sexto_homem, ovr: campanha.sexto_homem_ovr },
        { nome: campanha.draftado, ovr: campanha.draftado_ovr }
      ];

      for (const jogador of jogadoresElenco) {
        if (!jogador.nome || jogador.nome.trim() === '') continue;
        const nomeLimpado = SupabaseService.normalizarNomeJogador(jogador.nome);
        if (!nomeLimpado) continue;
        
        if (!statsJogadores[nomeLimpado]) {
          statsJogadores[nomeLimpado] = {
            temporadasJogadas: 0,
            titulos: 0,
            mvps: 0,
            dpoyOuRoy: 0,
            sextoHomem: 0,
            peakOvr: 0
          };
        }

        const st = statsJogadores[nomeLimpado];
        st.temporadasJogadas += 1;
        if (isCampeao) st.titulos += 1;
        
        const ovr = Number(jogador.ovr) || 0;
        if (ovr > st.peakOvr) st.peakOvr = ovr;

        if (temporadaGeral) {
          const verificarPremio = (campoPremio: string | null | undefined) => {
             return SupabaseService.normalizarNomeJogador(campoPremio) === nomeLimpado;
          };

          if (verificarPremio(temporadaGeral.mvp)) st.mvps += 1;
          if (verificarPremio(temporadaGeral.dpoy) || verificarPremio(temporadaGeral.rookie_of_the_year)) st.dpoyOuRoy += 1;
          if (verificarPremio(temporadaGeral.sixth_man)) st.sextoHomem += 1;
        }
      }
    }

    // 3. Processar Tiers e Preparar Array
    const lendasParaSalvar: any[] = [];
    const idsParaDeletar: string[] = [];
    const lendasExistentes = await this.supabaseService.getHallDaFamaDaFranquia(this.ligaId, nomeFranquia);

    // Iteramos pelo nome ORIGINAL que encontramos (para salvar bonitinho), então precisamos de um map reverso
    // Vamos reconstruir para ter o nome formatado corretamente
    const nomeFormatadoMap: Record<string, string> = {};
    for (const campanha of this.campanhasTime) {
      [campanha.pg, campanha.sg, campanha.sf, campanha.pf, campanha.c, campanha.sexto_homem, campanha.draftado].forEach(nomeBruto => {
        if (nomeBruto) {
           const limpado = SupabaseService.normalizarNomeJogador(nomeBruto);
           if (!nomeFormatadoMap[limpado]) {
             nomeFormatadoMap[limpado] = SupabaseService.limparNomeJogador(nomeBruto);
           }
        }
      });
    }

    for (const [nomeLimpado, stats] of Object.entries(statsJogadores)) {
      const resultado = this.idolCalculator.calcularStatusIdolo(stats);
      const lendaExistente = lendasExistentes.find(l => SupabaseService.normalizarNomeJogador(l.nome) === nomeLimpado);

      if (resultado.isIdolo) {
        const nomeDisplay = nomeFormatadoMap[nomeLimpado] || nomeLimpado;
        lendasParaSalvar.push({
          ...(lendaExistente && lendaExistente.id ? { id: lendaExistente.id } : {}),
          liga_id: this.ligaId,
          franquia: nomeFranquia,
          nome: nomeDisplay,
          categoria: resultado.nivel,
          motivo: resultado.badgeCompleto,
          score: resultado.scoreTotal, // Adicionado score para ordenação
          numero_camisa: lendaExistente ? lendaExistente.numero_camisa : ''
        });
      } else {
        if (lendaExistente && lendaExistente.id) {
          idsParaDeletar.push(lendaExistente.id);
        }
      }
    }

    // Identificar lendas no banco que não têm MAIS jogador nas campanhas (foram apagadas as campanhas)
    for (const lenda of lendasExistentes) {
      const nomeLimpado = SupabaseService.normalizarNomeJogador(lenda.nome);
      if (!statsJogadores[nomeLimpado] && lenda.id && !idsParaDeletar.includes(lenda.id)) {
        // Esta lenda foi adicionada, mas o jogador não existe mais nas campanhas do time (ou nunca existiu e foi manual)
        // Como o usuário quer automação 100%, vamos limpar quem não joga mais
        // a não ser que tenha sido Técnico ou Dono. Se for "Técnico" ou "Dono/Executivo", a gente mantém!
        if (lenda.categoria === 'Técnico' || lenda.categoria === 'Dono/Executivo') {
          continue; // Mantém equipe técnica salva
        }
        idsParaDeletar.push(lenda.id);
      }
    }

    // 4. Salvar tudo
    try {
      await this.supabaseService.salvarOuAtualizarHallDaFama(lendasParaSalvar, idsParaDeletar);
    } catch (error) {
      console.error('Erro ao sincronizar Ídolos automaticamente:', error);
    }
  }

  async processarCSVTime(event: any) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const timeAtivo = this.franquias.find(f => f.id === this.abaAtiva);
    if (!timeAtivo) return alert('Nenhum time selecionado para importar!');

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

        const colunas = linha.split(',');
        const dadosCampanha: any = { liga_id: this.ligaId, franquia: timeAtivo.nome };

        cabecalho.forEach((nomeColuna: string, index: number) => {
          const chave = nomeColuna.trim();
          if (chave) dadosCampanha[chave] = colunas[index]?.trim() || null;
        });
        registrosParaSalvar.push(dadosCampanha);
      }

      try {
        const { error } = await this.supabaseService.supabase.from('campanhas_franquias').insert(registrosParaSalvar);
        if (error) throw error;
        alert(`Sucesso! ${registrosParaSalvar.length} campanhas importadas para o ${timeAtivo.nome}.`);
        this.campanhasTime = await this.supabaseService.getCampanhasDaFranquia(this.ligaId!, timeAtivo.nome);
      } catch (error) {
        console.error('Erro na importação do time:', error);
        alert('Erro ao importar. O Excel está com o cabeçalho igual ao do banco?');
      } finally {
        this.carregandoTime = false;
        this.cdr.detectChanges();
        event.target.value = '';
      }
    };
    leitor.readAsText(arquivo);
  }

  editarTemporadaGeral(temp: any) {
    this.editandoIdGeral = temp.id;
    this.novaTemporada = { ...temp }; 
    this.mostrarFormulario = true; 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editarCampanhaTime(camp: ICampanhaFranquia) {
    this.editandoIdTime = camp.id ?? null;
    const c = this.normalizarCampanhaCarregada(camp);
    this.novaCampanha = {
      ...this.getCampanhaInicial(),
      temporada: c.temporada,
      recorde_wl: c.recorde_wl ?? '',
      rank_conferencia: c.rank_conferencia,
      resultado_playoffs: c.resultado_playoffs ?? '',
      pg: c.pg ?? '', sg: c.sg ?? '', sf: c.sf ?? '', pf: c.pf ?? '', c: c.c ?? '',
      sexto_homem: c.sexto_homem ?? '', draftado: c.draftado ?? '', observacoes: c.observacoes ?? '',
      pg_ovr: c.pg_ovr, sg_ovr: c.sg_ovr, sf_ovr: c.sf_ovr, pf_ovr: c.pf_ovr, c_ovr: c.c_ovr,
      sexto_homem_ovr: c.sexto_homem_ovr, draftado_ovr: c.draftado_ovr,
      pg_status: c.pg_status, sg_status: c.sg_status, sf_status: c.sf_status,
      pf_status: c.pf_status, c_status: c.c_status,
      sexto_homem_status: c.sexto_homem_status, draftado_status: c.draftado_status
    };
    this.mostrarFormularioTime = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicaoGeral() {
    this.editandoIdGeral = null;
    this.novaTemporada = this.getTemporadaInicial();
    this.mostrarFormulario = false;
  }

  cancelarEdicaoTime() {
    this.editandoIdTime = null;
    this.novaCampanha = this.getCampanhaInicial();
    this.mostrarFormularioTime = false;
  }
  
  getCorFranquia(nomeTime: string | null | undefined): string | null {
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

  getCorSecundariaAbaAtiva(): string {
    const nomeTime = this.getNomeAbaAtiva().toLowerCase();
    if (this.cacheCorSec[nomeTime]) {
      return this.cacheCorSec[nomeTime];
    }
    
    const busca = Object.keys(NBA_TEAMS_INFO).find(k => nomeTime.includes(k));
    if (busca) {
      this.cacheCorSec[nomeTime] = NBA_TEAMS_INFO[busca].sec;
      return this.cacheCorSec[nomeTime];
    }
    
    this.cacheCorSec[nomeTime] = 'rgba(255,255,255,0.1)';
    return this.cacheCorSec[nomeTime];
  }

  getFotoJogador(nome: string | null | undefined): string {
    if (!nome) return '';
    const nomeLimpo = this.limparNomeJogador(nome);
    const fotoCustom = this.getFotoCustomByNome(nome);
    if (fotoCustom?.foto_url) return fotoCustom.foto_url;
    
    const busca = SupabaseService.normalizarNomeJogador(nome);
    const chaveEncontrada = Object.keys(NBA_PLAYERS).find(nomeEstrela => busca.includes(nomeEstrela));
    const idNba = chaveEncontrada ? NBA_PLAYERS[chaveEncontrada] : null;

    if (idNba) {
      return `https://cdn.nba.com/headshots/nba/latest/1040x760/${idNba}.png`;
    } else {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeLimpo)}&background=0f172a&color=FDB927&size=150&font-size=0.4&bold=true`;
    }
  }

  async carregarFotosJogadoresCustom() {
    if (!this.ligaId) return;
    try {
      const fotos = await this.supabaseService.getFotosJogadoresCustomPorLiga(this.ligaId);
      const mapa: Record<string, IJogadorFotoCustom> = {};
      fotos.forEach(foto => {
        const chave = SupabaseService.normalizarNomeJogador(foto.jogador_nome_normalizado || foto.jogador_nome);
        if (chave) mapa[chave] = foto;
      });
      this.fotosJogadoresCustom = mapa;
    } catch (error) {
      console.error('Erro ao carregar fotos customizadas:', error);
      this.fotosJogadoresCustom = {};
    }
  }

  getJogadoresElencoCampanhaAtual(): IJogadorElencoFotoItem[] {
    const lista: IJogadorElencoFotoItem[] = [];
    const vistos = new Set<string>();

    for (const campo of this.camposHierarquiaElenco) {
      const valorBruto = String(this.novaCampanha[campo.key] || '').trim();
      if (!valorBruto) continue;

      const nomes = campo.key === 'draftado'
        ? this.extrairNomesDoCampoDraft(valorBruto)
        : [valorBruto];

      const ovrCampo = this.sanitizarOvr(this.novaCampanha[campo.ovrKey] as number | null);

      for (const nomeBruto of nomes) {
        const nomeChave = SupabaseService.normalizarNomeJogador(nomeBruto);
        if (!nomeChave || vistos.has(nomeChave)) continue;
        vistos.add(nomeChave);
        lista.push({
          posicao: campo.label,
          nomeBruto: SupabaseService.limparNomeJogador(nomeBruto),
          nomeExibicao: this.getNomeJogadorExibicao(nomeBruto, ovrCampo),
          nomeChave,
          ovr: ovrCampo
        });
      }
    }

    return lista;
  }

  extrairNomesDoCampoDraft(texto: string): string[] {
    return texto
      .split(/[,;|]|\n/)
      .map(parte => parte.trim())
      .filter(Boolean);
  }

  dispararUploadFotoJogador(jogador: IJogadorElencoFotoItem) {
    this.uploadFotoJogadorAlvo = jogador.nomeBruto;
    this.fotoElencoInput?.nativeElement.click();
  }

  async processarUploadFotoElenco(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const nomeAlvo = this.uploadFotoJogadorAlvo;

    if (!file || !nomeAlvo) {
      target.value = '';
      return;
    }
    if (!this.ligaId) {
      alert('Liga inválida para salvar foto.');
      target.value = '';
      return;
    }

    const nomeNormalizado = SupabaseService.normalizarNomeJogador(nomeAlvo);
    this.salvandoFotoJogadorChave = nomeNormalizado;

    try {
      const fotoBase64 = await this.fileToBase64(file);
      let fotoFinal = fotoBase64;
      let origem: 'base64' | 'supabase' = 'base64';

      if (this.uploadFotoModo === 'supabase') {
        try {
          fotoFinal = await this.supabaseService.uploadFotoJogadorStorage(this.ligaId, nomeNormalizado, file);
          origem = 'supabase';
        } catch {
          origem = 'base64';
        }
      }

      const fotoPersistida = await this.supabaseService.upsertFotoJogadorCustom({
        liga_id: this.ligaId,
        jogador_nome: SupabaseService.limparNomeJogador(nomeAlvo),
        jogador_nome_normalizado: nomeNormalizado,
        foto_url: fotoFinal,
        origem
      });
      this.fotosJogadoresCustom[nomeNormalizado] = fotoPersistida;
    } catch (error) {
      console.error('Erro ao processar upload da foto:', error);
      alert('Não foi possível salvar a foto personalizada do jogador.');
    } finally {
      this.salvandoFotoJogadorChave = null;
      this.uploadFotoJogadorAlvo = null;
      target.value = '';
      this.cdr.detectChanges();
    }
  }

  async removerFotoJogadorCustom(nomeJogador: string) {
    const chave = SupabaseService.normalizarNomeJogador(nomeJogador);
    if (!chave || !this.fotosJogadoresCustom[chave]) return;
    if (!this.ligaId) return;
    try {
      await this.supabaseService.deletarFotoJogadorCustom(this.ligaId, nomeJogador);
      delete this.fotosJogadoresCustom[chave];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao remover foto customizada:', error);
      alert('Não foi possível remover a foto personalizada.');
    }
  }

  getFotoCustomByNome(nomeJogador: string | null | undefined): IJogadorFotoCustom | null {
    if (!nomeJogador) return null;
    const chave = SupabaseService.normalizarNomeJogador(nomeJogador);
    if (this.fotosJogadoresCustom[chave]) return this.fotosJogadoresCustom[chave];

    const parcial = Object.entries(this.fotosJogadoresCustom).find(([k]) =>
      k.includes(chave) || chave.includes(k)
    );
    return parcial ? parcial[1] : null;
  }

  possuiFotoCustom(nomeJogador: string): boolean {
    return !!this.getFotoCustomByNome(nomeJogador);
  }

  trackByJogadorFoto(_index: number, item: IJogadorElencoFotoItem): string {
    return item.nomeChave;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  limparNomeJogador(nome: string | null | undefined): string {
    return SupabaseService.limparNomeJogador(nome);
  }

  calcularTop3() {
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
    const baseDPOY: { [key: string]: number } = { 'Sidney Moncrief': 1 };

    const contagemTimes = { ...baseTimes };
    const contagemMVP = { ...baseMVP };
    const contagemDPOY = { ...baseDPOY };

    const normalizarTime = (nome: string | null | undefined) => {
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

    const normalizarJogador = (nome: string | null | undefined, base: { [key: string]: number }) => {
      if (!nome || nome === '-') return null;
      let nomeLimpo = this.limparNomeJogador(nome).trim();
      const chaveExistente = Object.keys(base).find(k => k.toLowerCase() === nomeLimpo.toLowerCase());
      return chaveExistente ? chaveExistente : nomeLimpo;
    };

    this.temporadas.forEach(temp => {
      const time = normalizarTime(temp.campeao_nba);
      if (time) contagemTimes[time] = (contagemTimes[time] || 0) + 1;
      const mvp = normalizarJogador(temp.mvp, contagemMVP);
      if (mvp) contagemMVP[mvp] = (contagemMVP[mvp] || 0) + 1;
      const dpoy = normalizarJogador(temp.dpoy, contagemDPOY);
      if (dpoy) contagemDPOY[dpoy] = (contagemDPOY[dpoy] || 0) + 1;
    });

    this.topCampeoes = Object.keys(contagemTimes).map(nome => ({ nome, total: contagemTimes[nome] })).sort((a, b) => b.total - a.total);
    this.topMVPs = Object.keys(contagemMVP).map(nome => ({ nome, total: contagemMVP[nome] })).sort((a, b) => b.total - a.total);
    this.topDPOYs = Object.keys(contagemDPOY).map(nome => ({ nome, total: contagemDPOY[nome] })).sort((a, b) => b.total - a.total);
  }

  getLogoTime(nomeTime: string | null | undefined): string | null {
    if (!nomeTime || nomeTime === '—' || nomeTime === '-') return null;
    const busca = nomeTime.toLowerCase().trim();
    
    // 1. Tenta achar a logo customizada salva no banco
    const franquiaBanco = this.franquias.find(f => f.nome.toLowerCase().includes(busca) || busca.includes(f.nome.toLowerCase()));
    if (franquiaBanco && franquiaBanco.logo_url) {
      return franquiaBanco.logo_url;
    }

    // 2. Se não achar, usa as oficiais da ESPN
    const chaves = Object.keys(NBA_TEAMS_INFO).sort((a, b) => b.length - a.length);
    const chave = chaves.find(k => busca.includes(k) || k.includes(busca));
    return chave ? `https://a.espncdn.com/i/teamlogos/nba/500/${NBA_TEAMS_INFO[chave].abrev}.png` : null;
  }

  isMeuTimeCampeao(nomeTime: string | null | undefined): boolean {
    if (!nomeTime || nomeTime === '-' || nomeTime === '—') return false;
    const busca = nomeTime.toLowerCase().trim();
    return this.franquias.some(f => f.nome.toLowerCase().includes(busca) || busca.includes(f.nome.toLowerCase()));
  }

  getTextColorForBackground(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return '#ffffff';
    const brilho = ((parseInt(hex.substring(0, 2), 16) * 299) + (parseInt(hex.substring(2, 4), 16) * 587) + (parseInt(hex.substring(4, 6), 16) * 114)) / 1000;
    return brilho > 150 ? '#000000' : '#ffffff';
  }

  getOvrClass(ovr: number | null | undefined): string {
    const ovrValido = this.sanitizarOvr(ovr);
    if (!ovrValido) return '';
    if (ovrValido >= 90) return 'tier-legend';
    if (ovrValido >= 85) return 'tier-emerald';
    if (ovrValido >= 80) return 'tier-gold';
    if (ovrValido >= 70) return 'tier-silver';
    return 'tier-bronze';
  }

  getEstiloCardLegendario(ovr: number | null | undefined): Record<string, string> {
    const ovrValido = this.sanitizarOvr(ovr);
    if (!ovrValido || ovrValido < 90) return {};
    const franquiaAtual = this.franquias.find(f => f.id === this.abaAtiva);
    if (!franquiaAtual) return {};

    return {
      '--glow-color': franquiaAtual.cor_hex
    };
  }

  getEstiloOvrBadge(ovr: number | null | undefined): Record<string, string> {
    const ovrValido = this.sanitizarOvr(ovr);
    if (!ovrValido || ovrValido < 90) return {};
    const franquiaAtual = this.franquias.find(f => f.id === this.abaAtiva);
    if (!franquiaAtual) return {};

    const cor = franquiaAtual.cor_hex;
    const corContraste = this.getTextColorForBackground(cor);
    
    return {
      'background': `linear-gradient(135deg, ${cor}, rgba(0,0,0,0.6))`,
      'color': corContraste,
      'border': `1px solid ${cor}`,
      'box-shadow': `0 0 12px ${cor}80`,
      'text-shadow': `0 0 8px ${corContraste}80`
    };
  }

  getEstiloJogador(ovr: number | null | undefined): Record<string, string> {
    const ovrValido = this.sanitizarOvr(ovr);
    if (!ovrValido || ovrValido < 90) return {};
    const franquiaAtual = this.franquias.find(f => f.id === this.abaAtiva);
    if (!franquiaAtual) return {};

    const corPrimaria = franquiaAtual.cor_hex;
    const buscaNome = franquiaAtual.nome.toLowerCase();
    const chaveInfo = Object.keys(NBA_TEAMS_INFO).find(k => buscaNome.includes(k) || k.includes(buscaNome));
    const corSecundaria = chaveInfo ? NBA_TEAMS_INFO[chaveInfo].sec : '#888888'; 

    if (ovrValido >= 95) { 
      return { 'background-color': corPrimaria, 'color': this.getTextColorForBackground(corPrimaria), 'padding': '3px 10px', 'border-radius': '15px', 'box-shadow': `0 2px 4px ${corPrimaria}80` };
    } else if (ovrValido >= 90) {
      return { 'background-color': corSecundaria, 'color': this.getTextColorForBackground(corSecundaria), 'padding': '3px 10px', 'border-radius': '15px', 'box-shadow': `0 2px 4px ${corSecundaria}80` };
    }
    return {};
  }

  isCampanhaCampeao(resultado: string | null | undefined): boolean {
    if (!resultado) return false;
    const texto = resultado.toLowerCase();
    return texto.includes('campeão') || texto.includes('campeao') || texto.includes('campeões') || texto.includes('campeoes'); 
  }

  isCampanhaVice(resultado: string | null | undefined): boolean {
    if (!resultado) return false;
    return resultado.toLowerCase().includes('vice'); 
  }
  
  getArrayTitulos(): any[] {
    if (!this.campanhasTime) return [];
    return this.campanhasTime.filter(camp => this.isCampanhaCampeao(camp.resultado_playoffs));
  }

  getArrayVices(): any[] {
    if (!this.campanhasTime) return [];
    return this.campanhasTime.filter(camp => this.isCampanhaVice(camp.resultado_playoffs));
  }

  getArrayExecutivos(): any[] {
    const timeAtivo = this.getNomeAbaAtiva();
    if (!this.temporadas || !timeAtivo) return [];
    return this.temporadas.filter(temp => {
      if (!temp.executivo_do_ano_time) return false;
      return temp.executivo_do_ano_time.trim().toLowerCase() === timeAtivo.trim().toLowerCase();
    });
  }

  async carregarLembrancas() {
    if (this.ligaId) {
      const dadosBrutos = await this.supabaseService.getLembrancasPorLiga(this.ligaId);
      this.lembrancas = dadosBrutos.sort((a, b) => {
        const anoA = parseInt(a.data_evento.match(/\d{4}/)?.[0] || '0', 10);
        const anoB = parseInt(b.data_evento.match(/\d{4}/)?.[0] || '0', 10);
        if (anoA !== anoB) return anoA - anoB; 
        return a.data_evento.localeCompare(b.data_evento);
      });
      this.cdr.detectChanges();
    }
  }

  processarImagemLembranca(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.novaLembranca.imagem_url = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removerImagemSelecionada() {
    this.novaLembranca.imagem_url = '';
  }

  montarDadosIA(temp: any, index: number) {
    const campeao = temp.campeao_nba || 'Time Desconhecido';
    const mvp = temp.mvp || 'Jogador Desconhecido';
    
    // Check for dynasty (won previous year too)
    const prevTemp = this.temporadas[index + 1]; // because ordered DESC
    const isDinastia = prevTemp && prevTemp.campeao_nba === campeao;
    const isThreePeat = isDinastia && this.temporadas[index + 2] && this.temporadas[index + 2].campeao_nba === campeao;
    
    let titulo = '';
    let descricao = '';
    let prompt = `Award-winning sports photography, NBA finals celebration, basketball player from ${campeao} lifting trophy, highly detailed faces, photorealistic, 8k resolution, shot on 85mm lens, dramatic lighting, masterpiece`;

    if (isThreePeat) {
      titulo = `🏆 THREE-PEAT! A DINASTIA DO ${campeao.toUpperCase()}!`;
      descricao = `Histórico! O ${campeao} vence o terceiro título consecutivo na temporada ${temp.temporada}. ${mvp} cimenta o seu legado como MVP das finais numa corrida implacável ao Olimpo do basquetebol!`;
      prompt += `, three-peat dynasty, holding 3 trophies, highly detailed, dramatic stadium lighting, hyperrealistic`;
    } else if (isDinastia) {
      titulo = `BACK-TO-BACK! O ${campeao.toUpperCase()} REPETE O FEITO!`;
      descricao = `Não foi sorte! O ${campeao} conquista o bicampeonato em ${temp.temporada}. Comandados por ${mvp}, a equipa mostrou que é a força dominante na liga nesta era.`;
      prompt += `, back to back champions, holding 2 trophies, highly detailed, dramatic stadium lighting, hyperrealistic`;
    } else {
      // Look for rivalry
      const prevPrevTemp = this.temporadas[index + 2];
      const isRevenge = prevTemp && prevTemp.campeao_nba !== campeao && prevPrevTemp && prevPrevTemp.campeao_nba === campeao;
      
      if (isRevenge) {
        titulo = `A VINGANÇA! ${campeao.toUpperCase()} RECUPERA O TRONO!`;
        descricao = `O título volta para casa! Após tropeçar no ano passado, o ${campeao} vence em ${temp.temporada} e prova que a sua janela de título ainda está aberta. ${mvp} foi o MVP indiscutível.`;
        prompt += `, intense emotional celebration, redemption, highly detailed, dramatic stadium lighting, photorealistic`;
      } else {
        titulo = `${campeao.toUpperCase()} É O GRANDE CAMPEÃO DE ${temp.temporada}!`;
        descricao = `Uma campanha mágica culminou no troféu Larry O'Brien para o ${campeao}. A estrela ${mvp} brilhou nos momentos decisivos e levou o prémio de MVP para casa, marcando esta geração.`;
        prompt += `, highly detailed, dramatic stadium lighting, photorealistic, confetti falling`;
      }
    }
    
    return { titulo, descricao, prompt };
  }

  sugerirNoticiaIA(temporadaId: string) {
    if (!temporadaId) {
      alert('Selecione uma temporada para gerar a notícia.');
      return;
    }
    const tempIndex = this.temporadas.findIndex(t => t.id === temporadaId);
    if (tempIndex === -1) return;
    
    const temp = this.temporadas[tempIndex];
    const { titulo, descricao, prompt } = this.montarDadosIA(temp, tempIndex);
    
    this.novaLembranca.data_evento = `Finais de ${temp.temporada}`;
    this.novaLembranca.titulo = titulo;
    this.novaLembranca.descricao = descricao;
    this.novaLembranca.imagem_url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=400&nologo=true&model=flux&seed=${Math.floor(Math.random() * 1000)}`;
  }

  async gerarLinhaDoTempoGlobal() {
    if (!this.temporadas || this.temporadas.length === 0) {
      alert('Não há temporadas cadastradas na História Geral.');
      return;
    }
    const confirmacao = confirm('Deseja auto-gerar memórias para TODOS os anos sem registro? (Imagens e notícias feitas por IA). Isto pode levar alguns segundos.');
    if (!confirmacao) return;

    this.salvandoLembranca = true;

    try {
      // Find seasons that don't have a matching memory
      const temporadasSemLembranca = this.temporadas.filter(t => 
        !this.lembrancas.some(l => l.data_evento?.includes(t.temporada))
      );

      if (temporadasSemLembranca.length === 0) {
        alert('Todas as temporadas já possuem uma memória gerada na Linha do Tempo!');
        this.salvandoLembranca = false;
        return;
      }

      for (let i = 0; i < temporadasSemLembranca.length; i++) {
        const temp = temporadasSemLembranca[i];
        // Encontrar o index real na lista principal
        const realIndex = this.temporadas.findIndex(t => t.id === temp.id);
        const { titulo, descricao, prompt } = this.montarDadosIA(temp, realIndex);
        
        await this.supabaseService.salvarLembranca({
          liga_id: this.ligaId,
          data_evento: `Finais de ${temp.temporada}`,
          titulo,
          descricao,
          imagem_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=400&nologo=true&model=flux&seed=${Math.floor(Math.random() * 1000)}`
        });
      }
      
      await this.carregarLembrancas();
      alert(`Foram geradas ${temporadasSemLembranca.length} novas memórias de forma automática!`);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao gerar a linha do tempo.');
    } finally {
      this.salvandoLembranca = false;
    }
  }

  abrirFormularioNovaLembranca() {
    this.editandoIdLembranca = null;
    this.novaLembranca = { data_evento: '', titulo: '', descricao: '', imagem_url: '' };
    this.mostrarFormularioLembranca = !this.mostrarFormularioLembranca;
  }

  editarLembranca(memory: any) {
    this.editandoIdLembranca = memory.id;
    this.novaLembranca = { ...memory };
    this.mostrarFormularioLembranca = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicaoLembranca() {
    this.editandoIdLembranca = null;
    this.novaLembranca = { data_evento: '', titulo: '', descricao: '', imagem_url: '' };
    this.mostrarFormularioLembranca = false;
  }

  inserirMarkdown(tipo: string) {
    const textarea = document.getElementById('descricaoLembranca') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.novaLembranca.descricao || '';
    let textBefore = text.substring(0, start);
    let textSelected = text.substring(start, end);
    let textAfter = text.substring(end, text.length);

    let insercao = '';

    if (tipo === 'bold') {
      if (!textSelected) textSelected = 'Texto em negrito';
      insercao = `**${textSelected}**`;
    } else if (tipo === 'ul') {
      if (!textSelected) textSelected = 'Item da lista';
      // Adicionar nova linha se nao estiver no comeco da linha
      const isNewLine = start === 0 || textBefore.endsWith('\n');
      insercao = `${isNewLine ? '' : '\n'}- ${textSelected}\n`;
    }

    this.novaLembranca.descricao = textBefore + insercao + textAfter;

    // Foca novamente e seleciona o texto inserido
    setTimeout(() => {
      textarea.focus();
      const offset = tipo === 'ul' ? (start === 0 || textBefore.endsWith('\n') ? 2 : 3) : 2;
      textarea.setSelectionRange(start + offset, start + offset + textSelected.length);
    }, 0);
  }

  getDescricaoHtml(texto: string) {
    if (!texto) return '';
    return marked.parse(texto) as string;
  }

  async adicionarLembranca() {
    if (!this.novaLembranca.titulo || !this.novaLembranca.data_evento) {
      alert('Preencha os dados obrigatórios!');
      return;
    }
    this.salvandoLembranca = true;
    try {
      const dadosParaSalvar = { ...this.novaLembranca, liga_id: this.ligaId };
      delete dadosParaSalvar.id; // Remover ID caso exista, para evitar conflitos no insert/update

      if (this.editandoIdLembranca) {
        await this.supabaseService.atualizarLembranca(this.editandoIdLembranca, dadosParaSalvar);
      } else {
        await this.supabaseService.salvarLembranca(dadosParaSalvar);
      }

      this.cancelarEdicaoLembranca();
      await this.carregarLembrancas();
    } catch (err) {
      console.error('Erro ao salvar lembrança:', err);
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

  abrirModalRankings() { this.mostrarModalRankings = true; }
  fecharModalRankings() {
    this.mostrarModalRankings = false;
    this.expandido = { campeoes: false, mvps: false, dpoys: false };
  }

  getStatusElencoLabel(status?: string): string {
    if (status === 'principal') return 'Principal';
    if (status === 'secundario') return 'Secundário';
    if (status === 'nenhum') return 'Nenhum / Sem Status';
    return 'Terciário';
  }

  getStatusBadgeClass(status?: string): string {
    if (status === 'principal') return 'status-principal';
    if (status === 'secundario') return 'status-secundario';
    if (status === 'nenhum') return 'status-nenhum';
    return 'status-terciario';
  }

  getStatusShort(status?: string): string {
    if (status === 'principal') return 'P';
    if (status === 'secundario') return 'S';
    if (status === 'nenhum') return '—';
    return 'T';
  }

  trackByCampo(index: number, item: { key: string }): string {
    return item.key;
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }

  toggleTema(): void {
    this.temaEscuro = !this.temaEscuro;
    document.documentElement.setAttribute('data-theme', this.temaEscuro ? 'dark' : 'light');
    localStorage.setItem('tema', this.temaEscuro ? 'dark' : 'light');
  }

  getCorTimaNBA(nomeTime: string | null | undefined): string | null {
    if (!nomeTime || nomeTime === '—' || nomeTime === '-') return null;
    const franquia = this.getCorFranquia(nomeTime);
    if (franquia) return franquia;
    const busca = nomeTime.toLowerCase().trim();
    const chavesInfo = Object.keys(NBA_TEAMS_INFO).sort((a, b) => b.length - a.length);
    const chaveInfo = chavesInfo.find(k => busca.includes(k) || k.includes(busca));
    if (chaveInfo && NBA_TEAMS_INFO[chaveInfo].prim) {
      return NBA_TEAMS_INFO[chaveInfo].prim!;
    }

    const mapaCoresprimarias: { [key: string]: string } = {
      'seattle supersonics': '#00653A', 'supersonics': '#00653A', 'sonics': '#00653A',
      'new jersey nets': '#002B5C', 'new jersey': '#002B5C',
      'charlotte bobcats': '#002B5C', 'bobcats': '#002B5C',
      'vancouver grizzlies': '#00B2A9', 'vancouver': '#00B2A9',
      'washington bullets': '#002B5C', 'bullets': '#002B5C',
      'lakers': '#552583', 'los angeles lakers': '#552583',
      'celtics': '#007A33', 'boston celtics': '#007A33',
      'warriors': '#1D428A', 'golden state warriors': '#1D428A',
      'bulls': '#CE1141', 'chicago bulls': '#CE1141',
      'spurs': '#C4CED4', 'san antonio spurs': '#C4CED4',
      'heat': '#98002E', 'miami heat': '#98002E',
      'cavaliers': '#860038', 'cleveland cavaliers': '#860038', 'cavs': '#860038',
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
    };
    const chavesMapa = Object.keys(mapaCoresprimarias).sort((a, b) => b.length - a.length);
    const chave = chavesMapa.find(k => busca.includes(k) || k.includes(busca));
    return chave ? mapaCoresprimarias[chave] : null;
  }

  processarLogoTime(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.novaFranquia.logo_url = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removerLogoTime() {
    this.novaFranquia.logo_url = null;
  }

  
  calcularProximoAnoTemporada(ultimaTemporada: string | undefined): string {
    if (!ultimaTemporada) return '';
    const matchIfen = ultimaTemporada.match(/^(\d{4})-(\d{2})$/);
    if (matchIfen) {
      const anoInicio = parseInt(matchIfen[1], 10);
      const anoFim = parseInt(matchIfen[2], 10);
      return `${anoInicio + 1}-${String(anoFim + 1).padStart(2, '0')}`;
    }
    const matchSimples = ultimaTemporada.match(/^(\d{4})$/);
    if (matchSimples) {
      const ano = parseInt(matchSimples[1], 10);
      return `${ano + 1}`;
    }
    const matchBarra = ultimaTemporada.match(/^(\d{2})\/(\d{2})$/);
    if (matchBarra) {
      const anoInicio = parseInt(matchBarra[1], 10);
      const anoFim = parseInt(matchBarra[2], 10);
      return `${String(anoInicio + 1).padStart(2, '0')}/${String(anoFim + 1).padStart(2, '0')}`;
    }
    return '';
  }

  abrirFormularioTemporadaGeral(): void {
    if (this.mostrarFormulario && !this.editandoIdGeral) {
      this.mostrarFormulario = false;
      return;
    }
    this.editandoIdGeral = null;
    this.novaTemporada = this.getTemporadaInicial();
    
    if (this.temporadas && this.temporadas.length > 0) {
      const ultima = this.temporadas[0];
      this.novaTemporada.temporada = this.calcularProximoAnoTemporada(ultima.temporada);
    }
    
    this.mostrarFormulario = true;
  }

  abrirFormularioNovaCampanhaTime(): void {
  // Toggle: se já está aberto em modo "novo", fecha
  if (this.mostrarFormularioTime && !this.editandoIdTime) {
    this.mostrarFormularioTime = false;
    return;
  }

  // Herda o elenco da campanha mais recente (índice 0 = mais recente por ORDER DESC)
  if (this.campanhasTime && this.campanhasTime.length > 0) {
    const ultima = this.normalizarCampanhaCarregada(this.campanhasTime[0]);

    this.novaCampanha = {
      // ── Resultados zerados (o usuário vai preencher) ──
      temporada:          this.calcularProximoAnoTemporada(ultima.temporada),
      recorde_wl:         '',
      rank_conferencia:   null,
      resultado_playoffs: '',
      observacoes:        '',
      draftado:           '',
      draftado_ovr:       null,
      draftado_status:    'terciario',

      // ── Elenco herdado da última temporada ──
      pg:              ultima.pg           ?? '',
      pg_ovr:          ultima.pg_ovr,
      pg_status:       ultima.pg_status,

      sg:              ultima.sg           ?? '',
      sg_ovr:          ultima.sg_ovr,
      sg_status:       ultima.sg_status,

      sf:              ultima.sf           ?? '',
      sf_ovr:          ultima.sf_ovr,
      sf_status:       ultima.sf_status,

      pf:              ultima.pf           ?? '',
      pf_ovr:          ultima.pf_ovr,
      pf_status:       ultima.pf_status,

      c:               ultima.c            ?? '',
      c_ovr:           ultima.c_ovr,
      c_status:        ultima.c_status,

      sexto_homem:     ultima.sexto_homem  ?? '',
      sexto_homem_ovr: ultima.sexto_homem_ovr,
      sexto_homem_status: ultima.sexto_homem_status,
    };
  } else {
    // Sem histórico: abre em branco
    this.novaCampanha = this.getCampanhaInicial();
  }

  this.editandoIdTime = null;
  this.mostrarFormularioTime = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ── Configurações da Liga ──────────────────────────────────

abrirModalConfiguracoes(): void {
  this.franquiaEditandoId = null;
  this.franquiaEditandoForm = { nome: '', corHex: '#552583', logo_url: null };
  this.mostrarModalConfiguracoes = true;
}

fecharModalConfiguracoes(): void {
  this.mostrarModalConfiguracoes = false;
  this.franquiaEditandoId = null;
  this.franquiaEditandoForm = { nome: '', corHex: '#552583', logo_url: null };
}

selecionarFranquiaParaEditar(franquia: any): void {
  this.franquiaEditandoId = franquia.id;
  this.franquiaEditandoForm = {
    nome:     franquia.nome,
    corHex:   franquia.cor_hex,
    logo_url: franquia.logo_url ?? null,
  };
}

processarLogoEdicaoFranquia(event: any): void {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.franquiaEditandoForm.logo_url = e.target.result;
    this.cdr.detectChanges();
  };
  reader.readAsDataURL(file);
}

removerLogoEdicaoFranquia(): void {
  this.franquiaEditandoForm.logo_url = null;
}

async salvarEdicaoFranquia(): Promise<void> {
  if (!this.franquiaEditandoId) return;
  if (!this.franquiaEditandoForm.nome?.trim()) {
    alert('O nome do time é obrigatório.');
    return;
  }

  this.salvandoEdicaoFranquia = true;
  try {
    const payload = {
      nome:     this.franquiaEditandoForm.nome.trim(),
      cor_hex:  this.franquiaEditandoForm.corHex,
      logo_url: this.franquiaEditandoForm.logo_url,
    };

    await this.supabaseService.atualizarFranquia(this.franquiaEditandoId, payload);

    // Atualiza localmente para refletir na UI instantaneamente
    const idx = this.franquias.findIndex(f => f.id === this.franquiaEditandoId);
    if (idx !== -1) {
      this.franquias[idx] = { ...this.franquias[idx], ...payload };
      this.franquias = [...this.franquias]; // força detecção de mudança
    }

    this.franquiaEditandoId = null;
    this.franquiaEditandoForm = { nome: '', corHex: '#552583', logo_url: null };
    this.cdr.detectChanges();
  } catch (error) {
    console.error('Erro ao atualizar franquia:', error);
    alert('Não foi possível salvar as alterações. Tente novamente.');
  } finally {
    this.salvandoEdicaoFranquia = false;
    this.cdr.detectChanges();
  }
}

}