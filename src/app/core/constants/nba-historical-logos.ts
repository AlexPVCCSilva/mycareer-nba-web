export interface HistoricalLogo {
  start: number;
  end: number;
  url: string;
}

// Dicionário de Logos Históricas da NBA
// Mapeado por nome do time e período ativo.
export const NBA_HISTORICAL_LOGOS: Record<string, HistoricalLogo[]> = {
  'atlanta hawks': [
    { start: 1995, end: 2007, url: 'assets/logos/hawks96-07.png' },
    { start: 2007, end: 2015, url: 'assets/logos/hawks07-15.png' }
  ],
  'boston celtics': [
    { start: 1978, end: 1996, url: 'assets/logos/BostonCeltics78-96.png' }
  ],
  'brooklyn nets': [
    { start: 1997, end: 2012, url: 'assets/logos/nets97-12.png' }
  ],
  'new jersey nets': [
    { start: 1997, end: 2012, url: 'assets/logos/nets97-12.png' }
  ],
  'charlotte hornets': [
    { start: 1988, end: 2002, url: 'assets/logos/CharlotteHornets88-02.png' }
  ],
  'charlotte bobcats': [
    { start: 2004, end: 2014, url: 'assets/logos/bobcats.png' }
  ],
  'cleveland cavaliers': [
    { start: 1994, end: 2003, url: 'assets/logos/cleveland_cavaliers94-03.png' },
    { start: 2003, end: 2010, url: 'assets/logos/cleveland_cavaliers03-10.png' }
  ],
  'dallas mavericks': [
    { start: 1980, end: 2001, url: 'assets/logos/9254_dallas_mavericks-primary-1981.png' }
  ],
  'denver nuggets': [
    { start: 1993, end: 2003, url: 'assets/logos/denver_nuggets_logo_primary_19946066.png' },
    { start: 2003, end: 2008, url: 'assets/logos/denver_nuggets_logo_primary_20044394.png' },
    { start: 2008, end: 2018, url: 'assets/logos/denver_nuggets_logo_primary_20099865.png' }
  ],
  'detroit pistons': [
    { start: 1979, end: 1996, url: 'assets/logos/detroit_pistons_logo_primary_19803973.png' },
    { start: 1996, end: 2001, url: 'assets/logos/detroit_pistons_logo_primary_19976102.png' },
    { start: 2001, end: 2005, url: 'assets/logos/detroit_pistons_logo_primary_20063661.png' }
  ],
  'golden state warriors': [
    { start: 1997, end: 2010, url: 'assets/logos/warrios 1997.png' }
  ],
  'houston rockets': [
    { start: 1972, end: 1995, url: 'assets/logos/houston-rockets-logo-primary-1992-9693.png' },
    { start: 1995, end: 2003, url: 'assets/logos/houston-rockets-logo-primary-1996-8848.png' }
  ],
  'los angeles clippers': [
    { start: 1984, end: 2010, url: 'assets/logos/los_angeles_clippers_logo_primary_19859634.png' },
    { start: 2010, end: 2015, url: 'assets/logos/los_angeles_clippers_logo_primary_20161514.png' }
  ],
  'memphis grizzlies': [
    { start: 2001, end: 2004, url: 'assets/logos/grizzlies01.png' }
  ],
  'milwaukee bucks': [
    { start: 1968, end: 1993, url: 'assets/logos/milwaukee_bucks_logo_primary_19698490.png' },
    { start: 2006, end: 2015, url: 'assets/logos/milwaukee_bucks_logo_primary_20078590.png' }
  ],
  'minnesota timberwolves': [
    { start: 1989, end: 1996, url: 'assets/logos/minnesota-timberwolves-logo-primary-1990-1177.png' },
    { start: 1996, end: 2008, url: 'assets/logos/minnesota-timberwolves-logo-primary-1997-7919.png' },
    { start: 2008, end: 2017, url: 'assets/logos/minnesota-timberwolves-logo-primary-2018-7496.png' }
  ],
  'new orleans hornets': [
    { start: 2002, end: 2013, url: 'assets/logos/new_orleans_hornets_logo_primary_20036938.png' }
  ],
  'new orleans pelicans': [
    { start: 2002, end: 2013, url: 'assets/logos/new_orleans_hornets_logo_primary_20036938.png' }
  ],
  'new york knicks': [
    { start: 1992, end: 2011, url: 'assets/logos/new_york_knicks_logo_primary_19962276.png' }
  ],
  'orlando magic': [
    { start: 1989, end: 2000, url: 'assets/logos/orlando_magic_logo_primary_1999_sportslogosnet-6599.png' },
    { start: 2000, end: 2010, url: 'assets/logos/orlando_magic_logo_primary_20017625.png' }
  ],
  'philadelphia 76ers': [
    { start: 1977, end: 1997, url: 'assets/logos/76sixers 1978.png' },
    { start: 1997, end: 2009, url: 'assets/logos/76sixers98.png' }
  ],
  'phoenix suns': [
    { start: 1992, end: 2000, url: 'assets/logos/phoenix_suns_logo_primary_19931753.png' }
  ],
  'sacramento kings': [
    { start: 1985, end: 1994, url: 'assets/logos/kings85.png' },
    { start: 1994, end: 2016, url: 'assets/logos/kings95.png' }
  ],
  'san antonio spurs': [
    { start: 1976, end: 1989, url: 'assets/logos/spurs77.png' },
    { start: 1989, end: 2002, url: 'assets/logos/spurs89.png' }
  ],
  'seattle supersonics': [
    { start: 1995, end: 2001, url: 'assets/logos/seattle_supersonics_logo_primary_19967583.png' }
  ],
  'oklahoma city thunder': [
    { start: 1967, end: 2008, url: 'assets/logos/seattle_supersonics_logo_primary_19967583.png' }
  ],
  'toronto raptors': [
    { start: 1995, end: 2008, url: 'assets/logos/toronto_raptors_logo_primary_19961665.png' },
    { start: 2008, end: 2015, url: 'assets/logos/toronto_raptors_logo_primary_20096794.png' },
    { start: 2015, end: 2020, url: 'assets/logos/toronto-raptors-logo-primary-2016-4003.png' }
  ],
  'utah jazz': [
    { start: 1979, end: 1996, url: 'assets/logos/jazz79.png' },
    { start: 1996, end: 2004, url: 'assets/logos/utah_jazz_logo_primary_19973688.png' }
  ],
  'washington wizards': [
    { start: 1997, end: 2007, url: 'assets/logos/washington-wizards-logo-primary-1998-7405.png' },
    { start: 2007, end: 2011, url: 'assets/logos/washington-wizards-logo-primary-2012-7003.png' }
  ]
};
