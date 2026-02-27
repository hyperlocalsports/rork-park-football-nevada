export interface TeamImage {
  url: string;
  caption: string;
}

export interface ScheduleGame {
  opponentId: string;
  date: string;
}

export interface Team {
  id: string;
  name: string;
  mascot: string;
  parkName: string;
  city: 'Henderson' | 'Las Vegas' | 'Boulder City';
  colors: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
  parkAddress: string;
  parkAcreage: string;
  parkDescription: string;
  motto: string;
  images: TeamImage[];
  logoUrl?: string;
  identity: string;
  established: string;
  tagline: string;
  latitude: number;
  longitude: number;
  schedule: ScheduleGame[];
  wins: number;
  losses: number;
  ties: number;
  jerseyNumber?: string;
}

export const TEAMS: Team[] = [
  {
    id: 'acacia-guardians',
    name: 'Acacia Park Gold Star Guardians',
    mascot: 'Guardians',
    parkName: 'Acacia Park',
    city: 'Henderson',
    colors: ['Black', 'Gold'],
    primaryColor: '#0D0D0D',
    secondaryColor: '#C8A84E',
    accentColor: '#E0C97A',
    description: 'The Gold Star Guardians represent the protective spirit of Acacia Park — a community cornerstone known for its sustainable landscapes and dedication to water-smart urban planning. Clad in black and gold, the Guardians embody discipline, resilience, and the unwavering commitment to defend their home turf. Their identity draws from the park\'s botanical demonstration garden with over 100 drought-tolerant species — a living testament to the power of preservation.',
    parkAddress: '50 Casa Del Fuego St., Henderson, NV 89012',
    parkAcreage: '16 acres',
    parkDescription: 'Acacia Park features the Acacia Demonstration Gardens with over 100 drought-tolerant plant species, ball fields, basketball court, dog park, splash pad, and walking course. A highly rated park known for sustainable water-smart landscaping in the McCullough Hills neighborhood.',
    motto: 'Guard the Standard',
    tagline: 'Discipline defines us. Gold crowns us.',
    identity: 'Discipline • Resilience • Preservation',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://r2-pub.rork.com/generated-images/3f1464e2-0c7a-4a78-8923-a5f29ac96e92.png', caption: 'Guardian athlete — black and gold' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/xcv5wffrk3c3hne82em22', caption: 'Custom black & gold flag belts' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/fh34k2306of30fayewrtf', caption: 'Game day ready' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0p74h5le0200hbp6kxz2j', caption: 'Guardian on the field' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/qi7eqb0kunf0tjg4ixpn1', caption: 'Gold Star helmet detail' },
    ],
    latitude: 36.0397,
    longitude: -115.0460,
    schedule: [
      { opponentId: 'heritage-hawkeyes', date: '3/1' },
      { opponentId: 'cornerstone-cougars', date: '3/8' },
      { opponentId: 'hidden-falls-falcons', date: '3/15' },
    ],
    wins: 5,
    losses: 1,
    ties: 0,
    jerseyNumber: '23',
  },
  {
    id: 'mission-hills-mountaineers',
    name: 'Mission Hills Park Mountaineers',
    mascot: 'Mountaineers',
    parkName: 'Mission Hills Park',
    city: 'Henderson',
    colors: ['Tan', 'White', 'Dirty Brown', 'Gritty Brown'],
    primaryColor: '#4A3728',
    secondaryColor: '#C4A77D',
    accentColor: '#E8DCC8',
    description: 'The Mountaineers draw their rugged identity from Mission Hills Park\'s expansive grounds in the heart of Henderson. Their earth-toned palette reflects the raw, untamed terrain of the Nevada high desert. Every play is a climb — every drive, a summit push. The park\'s wide-open fields and surrounding desert landscape inspire a team built on grit and elevation.',
    parkAddress: '551 E. Mission Dr., Henderson, NV 89002',
    parkAcreage: '22 acres',
    parkDescription: 'Mission Hills Park is an expansive community park off College Drive in Henderson featuring ball fields, basketball and tennis courts, pickleball, splash pad, open meadows, playgrounds, and walking trails. A popular multi-use park known for its well-maintained grounds and family-friendly atmosphere.',
    motto: 'Climb. Conquer. Repeat.',
    tagline: 'Born from the mountain. Built for the grind.',
    identity: 'Grit • Elevation • Endurance',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0pbprd8u41dwq6bliu0ce', caption: 'Mountaineers athlete — Mission Hills' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/w06cituinhsnvitnp38aa', caption: 'Night game intensity' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/bhtn7ygvxctlcjdiifg4t',
    latitude: 36.0283,
    longitude: -114.9627,
    schedule: [
      { opponentId: 'anthem-hills-antelopes', date: '3/2' },
      { opponentId: 'arroyo-grande-aces', date: '3/9' },
      { opponentId: 'pecos-pioneers', date: '3/16' },
    ],
    wins: 3,
    losses: 2,
    ties: 1,
    jerseyNumber: '11',
  },
  {
    id: 'anthem-hills-antelopes',
    name: 'Anthem Hills Park Antelopes',
    mascot: 'Antelopes',
    parkName: 'Anthem Hills Park',
    city: 'Henderson',
    colors: ['Brownish Orange', 'Tan', 'White'],
    primaryColor: '#5C3A1E',
    secondaryColor: '#C47F3A',
    accentColor: '#D4B896',
    description: 'Swift, graceful, and impossibly fast — the Antelopes channel the spirit of the pronghorn that once roamed the Nevada basin. Anthem Hills Park sits elevated above Henderson, and the Antelopes play with the same high-ground advantage — explosive speed and relentless agility. Their mountain-range jersey motif and desert earth palette capture the raw beauty of the Anthem landscape.',
    parkAddress: '2256 N. Reunion Dr., Henderson, NV 89052',
    parkAcreage: '53 acres',
    parkDescription: 'Anthem Hills Park is a sprawling 53-acre park in the Anthem master-planned community, featuring lighted ball fields, basketball courts, skate park, roller hockey, volleyball courts, playgrounds, walking trails, and scenic mountain views of the surrounding desert landscape.',
    motto: 'Speed is Our Nature',
    tagline: 'Fleet of foot. Fierce of heart.',
    identity: 'Speed • Agility • Grace',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/o8da490vvxs2ur3hvzmwc', caption: 'Antelope athlete — game ready' },
    ],
    latitude: 35.9833,
    longitude: -115.0913,
    schedule: [
      { opponentId: 'mission-hills-mountaineers', date: '3/2' },
      { opponentId: 'paseo-verde-panthers', date: '3/9' },
      { opponentId: 'discovery-desert-devils', date: '3/16' },
    ],
    wins: 4,
    losses: 1,
    ties: 1,
    jerseyNumber: '7',
  },
  {
    id: 'heritage-hawkeyes',
    name: 'Heritage Park Hawkeyes',
    mascot: 'Hawkeyes',
    parkName: 'Heritage Park',
    city: 'Henderson',
    colors: ['Blue', 'Dark Gold', 'White'],
    primaryColor: '#1B3A5C',
    secondaryColor: '#B8942E',
    accentColor: '#FFFFFF',
    description: 'The Hawkeyes possess vision that cuts through every defense. Heritage Park is Henderson\'s crown jewel — a sprawling 30-acre facility that hosts the city\'s biggest events. The Hawkeyes carry that same big-stage presence, combining precision passing with eagle-eyed defensive reads. Blue and gold command authority on the field.',
    parkAddress: '350 S Racetrack Rd, Henderson, NV 89015',
    parkAcreage: '30 acres',
    parkDescription: 'Heritage Park is one of Henderson\'s premier parks, featuring an amphitheater, aquatic complex, gardens, sports fields, and is home to many of the city\'s signature community events.',
    motto: 'See Everything. Miss Nothing.',
    tagline: 'Eyes like a hawk. Instincts of a champion.',
    identity: 'Vision • Precision • Authority',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/sm545x4gdm3e7xhuzc7dn', caption: 'Hawkeyes athlete in blue and gold' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/7lxgyy2ej15byagc3afk4', caption: 'Hawkeyes mascot' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/w8xvea0exhafzhfzgj1x0',
    latitude: 36.0331,
    longitude: -114.9810,
    schedule: [
      { opponentId: 'acacia-guardians', date: '3/1' },
      { opponentId: 'ocallaghan-outlaws', date: '3/8' },
      { opponentId: 'cactus-wren-coyotes', date: '3/15' },
    ],
    wins: 4,
    losses: 2,
    ties: 0,
  },
  {
    id: 'hidden-falls-falcons',
    name: 'Hidden Falls Park Falcons',
    mascot: 'Falcons',
    parkName: 'Hidden Falls Park',
    city: 'Henderson',
    colors: ['Red', 'Black'],
    primaryColor: '#8B1A1A',
    secondaryColor: '#0D0D0D',
    accentColor: '#CC2222',
    description: 'Named for the cascading water features tucked within their home park, the Falcons strike with the same sudden, devastating force. Red and black — the colors of fire and shadow — the Falcons are built for explosive plays and suffocating defense. They embody the element of surprise, hidden in plain sight.',
    parkAddress: '281 W. Horizon Dr., Henderson, NV 89002',
    parkAcreage: '60 acres',
    parkDescription: 'Hidden Falls Park is a 60-acre park featuring walking trails, splash pad, skate park, dog park, basketball court, playgrounds, and open green spaces. Known for its hidden water features and scenic desert surroundings.',
    motto: 'Strike from the Shadows',
    tagline: 'Unseen. Unmatched. Unstoppable.',
    identity: 'Power • Stealth • Fury',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/lbo47grv9q4t74hbgvlxr', caption: 'Falcons athlete in red and black' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/34u8rffhfhx27vad5r2dp', caption: 'Falcons female athlete — sunset game day' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/y14lu2auydxmkfh79yn3w',
    latitude: 36.0005,
    longitude: -115.0380,
    schedule: [
      { opponentId: 'cornerstone-cougars', date: '3/1' },
      { opponentId: 'acacia-guardians', date: '3/8' },
      { opponentId: 'arroyo-grande-aces', date: '3/15' },
    ],
    wins: 3,
    losses: 3,
    ties: 0,
  },
  {
    id: 'cornerstone-cougars',
    name: 'Cornerstone Park Cougars',
    mascot: 'Cougars',
    parkName: 'Cornerstone Park',
    city: 'Henderson',
    colors: ['Deep Navy', 'Metallic Silver', 'Charcoal'],
    primaryColor: '#0F1B2D',
    secondaryColor: '#A8B2BD',
    accentColor: '#3A3F47',
    description: 'The Cougars stalk the field with calculated patience before unleashing devastating power. Cornerstone Park — one of Henderson\'s most beloved nature preserves at over 100 acres — gives the Cougars their identity: composed, powerful, and deeply connected to the land. Their metallic silver and deep navy palette reflects the park\'s lake waters and twilight skies.',
    parkAddress: '1600 Wigwam Pkwy, Henderson, NV 89074',
    parkAcreage: '100+ acres',
    parkDescription: 'Cornerstone Park is a massive nature preserve featuring a lake, bird-watching areas, wetlands, walking trails, sports fields, and a community garden. One of Henderson\'s most iconic outdoor spaces.',
    motto: 'Built on Stone',
    tagline: 'Patient. Powerful. Predatory.',
    identity: 'Patience • Power • Dominance',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uiotgbg2rfqp1lgjv7yus', caption: 'Cougars female athlete in navy and silver' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/7u9ipcetokiwbugukzyqe', caption: 'Cougars male athlete — game ready' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/gaqxawpviwxt518gxe6ek', caption: 'Cougars mascot' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0ya2p218lt0a598uepm03', caption: 'Cougars athlete in navy and silver' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/swslvttc12vmoleh5raya', caption: 'Cougars mascot illustration' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0nmnuy77pqg34iwlpueyp',
    latitude: 36.0240,
    longitude: -115.0190,
    schedule: [
      { opponentId: 'hidden-falls-falcons', date: '3/1' },
      { opponentId: 'pecos-pioneers', date: '3/8' },
      { opponentId: 'paseo-verde-panthers', date: '3/15' },
    ],
    wins: 2,
    losses: 3,
    ties: 1,
  },
  {
    id: 'arroyo-grande-aces',
    name: 'Arroyo Grande Park Aces',
    mascot: 'Aces',
    parkName: 'Arroyo Grande Park',
    city: 'Henderson',
    colors: ['Forest Green', 'Copper', 'Bone White'],
    primaryColor: '#1E3B2C',
    secondaryColor: '#B87333',
    accentColor: '#E8DDD0',
    description: 'The Aces play every hand to perfection. Arroyo Grande — meaning "great stream" — flows through Henderson like a lifeline, and the Aces channel that relentless current. Forest green and copper evoke the desert oasis, where every play is a winning hand dealt with precision and swagger.',
    parkAddress: '298 N. Arroyo Grande Blvd., Henderson, NV 89014',
    parkAcreage: '56 acres',
    parkDescription: 'Arroyo Grande Sports Complex is a 56-acre facility with ball fields, basketball courts, dog park, playgrounds, picnic areas, and walking paths along the Pittman Wash Trail. A major recreational hub in central Henderson.',
    motto: 'Every Play is a Winning Hand',
    tagline: 'Deal the play. Win the pot.',
    identity: 'Precision • Swagger • Fortune',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/268h3tznwfekchug36qmt', caption: 'Aces athlete in green and copper' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/7tm4s655j16dot5zdq6i4', caption: 'Aces mascot' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ga5z0aadzp2hgt4eeg7ky',
    latitude: 36.0450,
    longitude: -115.0380,
    schedule: [
      { opponentId: 'mission-hills-mountaineers', date: '3/2' },
      { opponentId: 'hidden-falls-falcons', date: '3/9' },
      { opponentId: 'heritage-hawkeyes', date: '3/16' },
    ],
    wins: 3,
    losses: 2,
    ties: 1,
  },
  {
    id: 'pecos-pioneers',
    name: 'Pecos Park Pioneers',
    mascot: 'Pioneers',
    parkName: 'Pecos Park',
    city: 'Henderson',
    colors: ['Deep Olive', 'Desert Sand', 'Charcoal'],
    primaryColor: '#3B4A2F',
    secondaryColor: '#D4C4A8',
    accentColor: '#3A3A3A',
    description: 'The Pioneers forge new paths through every defensive scheme. Named for the trailblazers who settled the Nevada frontier, the Pecos Park Pioneers play with old-school grit and modern-day innovation — a team that never backs down from uncharted territory. Deep olive and desert sand honor the frontier spirit.',
    parkAddress: '150 N. Pecos Rd., Henderson, NV 89074',
    parkAcreage: '18 acres',
    parkDescription: 'Pecos Legacy Park offers ball fields, tennis and volleyball courts, basketball courts, playgrounds, and shaded picnic areas along the Pittman Wash Trail. A well-loved community gathering spot in the Green Valley South neighborhood.',
    motto: 'Forge the Path',
    tagline: 'Trail first. Fear nothing.',
    identity: 'Grit • Innovation • Frontier Spirit',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0xy2mxb1fpdn5g0aqdauo', caption: 'Pioneers female athlete — game ready' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/gkz0wz3h7aod86uct1o2n', caption: 'Pioneers athlete in olive and sand' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/xy0qtljeogh09ro9g5ypy', caption: 'Pioneers mascot' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ocu6jj1xyh9tb6bsga5n7',
    latitude: 36.0390,
    longitude: -115.0380,
    schedule: [
      { opponentId: 'cornerstone-cougars', date: '3/2' },
      { opponentId: 'anthem-hills-antelopes', date: '3/9' },
      { opponentId: 'ocallaghan-outlaws', date: '3/16' },
    ],
    wins: 2,
    losses: 4,
    ties: 0,
  },
  {
    id: 'paseo-verde-panthers',
    name: 'Paseo Verde Park Panthers',
    mascot: 'Panthers',
    parkName: 'Paseo Verde Park',
    city: 'Henderson',
    colors: ['Purple', 'Black'],
    primaryColor: '#2D1B4E',
    secondaryColor: '#0D0D0D',
    accentColor: '#7B3FA0',
    description: 'Silent. Lethal. Unstoppable. The Panthers prowl Paseo Verde Park with a predator\'s patience and a champion\'s hunger. Purple and black — royalty meets darkness — the Panthers are the team everyone fears but no one sees coming. Their home park is one of Henderson\'s most complete recreational facilities.',
    parkAddress: '1851 Paseo Verde Pkwy., Henderson, NV 89012',
    parkAcreage: '25 acres',
    parkDescription: 'Paseo Verde Park is a premier recreational facility featuring a library, sports fields, tennis courts, swimming pool, and extensive walking trails. One of Henderson\'s most complete community parks.',
    motto: 'Silent. Lethal. Unstoppable.',
    tagline: 'Royalty wears black.',
    identity: 'Stealth • Royalty • Fear',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/eg1k3zevxjii7gj896np2', caption: 'Panthers female athlete — tunnel walk' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/n9sd8l6lksg6e2yod4lf6', caption: 'Panthers mascot — purple lightning' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6ce0sfc5oe4ihbhebo8v1', caption: 'Panthers team — championship celebration' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/7eq15k4jkqkiwcb4hoqsh',
    latitude: 36.0230,
    longitude: -115.0300,
    schedule: [
      { opponentId: 'discovery-desert-devils', date: '3/1' },
      { opponentId: 'anthem-hills-antelopes', date: '3/8' },
      { opponentId: 'cornerstone-cougars', date: '3/15' },
    ],
    wins: 4,
    losses: 2,
    ties: 0,
    jerseyNumber: '00',
  },
  {
    id: 'discovery-desert-devils',
    name: 'Discovery Park Desert Devils',
    mascot: 'Desert Devils',
    parkName: 'Discovery Park',
    city: 'Henderson',
    colors: ['Burgundy', 'Gold'],
    primaryColor: '#5C1A2A',
    secondaryColor: '#C8A84E',
    accentColor: '#8B2E4A',
    description: 'The Desert Devils bring hellfire and fury to every game. Discovery Park\'s innovative design and forward-thinking community spaces inspire a team that plays with creative chaos — unpredictable, daring, and impossible to contain. Burgundy and gold ignite the field with a presence that burns.',
    parkAddress: '2011 Paseo Verde Pkwy., Henderson, NV 89012',
    parkAcreage: '7 acres',
    parkDescription: 'Discovery Park is a community park featuring basketball and tennis courts, playground, open fields, and gathering spaces along Paseo Verde Parkway. A neighborhood favorite near the Paseo Verde Library and recreation center.',
    motto: 'Raise Hell on the Field',
    tagline: 'Burn bright. Play reckless.',
    identity: 'Chaos • Daring • Fire',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/gff77o87dk763mn5xl130', caption: 'Desert Devils athlete in uniform' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/wob6hp6tm4mvl6dq733uh', caption: 'Desert Devils mascot' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/q8eo5qkyyvwrdmdmho1bn',
    latitude: 36.0240,
    longitude: -115.0285,
    schedule: [
      { opponentId: 'paseo-verde-panthers', date: '3/1' },
      { opponentId: 'cactus-wren-coyotes', date: '3/8' },
      { opponentId: 'anthem-hills-antelopes', date: '3/15' },
    ],
    wins: 1,
    losses: 4,
    ties: 1,
    jerseyNumber: '66',
  },
  {
    id: 'ocallaghan-outlaws',
    name: "O'Callaghan Park Outlaws",
    mascot: 'Outlaws',
    parkName: "O'Callaghan Park",
    city: 'Henderson',
    colors: ['Orange', 'Black'],
    primaryColor: '#1A1A1A',
    secondaryColor: '#E87D20',
    accentColor: '#FF9B3D',
    description: "The Outlaws play by their own rules. O'Callaghan Park — named for a Nevada governor — carries a legacy of bold leadership, and the Outlaws embody that same fearless spirit. Orange and black blaze across the field like a desert sunset on fire. No rules. No limits. Just the relentless pursuit of victory.",
    parkAddress: '601 Skyline Rd., Henderson, NV 89002',
    parkAcreage: '20 acres',
    parkDescription: "O'Callaghan Park features ball fields, basketball and tennis courts, volleyball courts, dog park, horseshoe pits, playgrounds, and shaded ramadas in the Highland Hills neighborhood. Named after former Nevada Governor Mike O'Callaghan, the park honors his legacy of public service.",
    motto: 'No Rules. No Limits.',
    tagline: 'Law of the land is ours.',
    identity: 'Fearless • Bold • Untamed',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/sewd7v0vei88rnngbl3jh', caption: 'Outlaws female athlete — orange and black' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4oon97t8n1fkrhr0oidv0', caption: 'Outlaws male athlete — game ready' },
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/5j24c6wmyzq7138f2s454', caption: 'Outlaws promo — O\'Callaghan Park' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/f6wc5twrqd7clqb4eft2u',
    latitude: 35.9975,
    longitude: -115.0325,
    schedule: [
      { opponentId: 'heritage-hawkeyes', date: '3/2' },
      { opponentId: 'pecos-pioneers', date: '3/9' },
      { opponentId: 'acacia-guardians', date: '3/16' },
    ],
    wins: 2,
    losses: 3,
    ties: 1,
  },
  {
    id: 'cactus-wren-coyotes',
    name: 'Cactus Wren Park Coyotes',
    mascot: 'Coyotes',
    parkName: 'Cactus Wren Park',
    city: 'Henderson',
    colors: ['Dark Teal', 'Slate Gray', 'Bronze'],
    primaryColor: '#1A3A3A',
    secondaryColor: '#5A6A6E',
    accentColor: '#A67C52',
    description: 'The Coyotes are the ultimate desert survivors — cunning, adaptable, and impossible to outrun. Cactus Wren Park, named for Nevada\'s resilient desert bird, gives the Coyotes their identity: scrappy, intelligent, and built for the long game. Dark teal and bronze echo the Mojave at dusk.',
    parkAddress: '2900 Ivanpah Dr., Henderson, NV 89074',
    parkAcreage: '7 acres',
    parkDescription: 'Cactus Wren Park features ball fields, basketball court, skate park, dog park, volleyball court, playgrounds, and walking paths with connections to the 215 trail system. A well-maintained neighborhood park near St. Rose Parkway.',
    motto: 'Adapt. Survive. Dominate.',
    tagline: 'Desert-born. Battle-tested.',
    identity: 'Cunning • Survival • Intelligence',
    established: 'Henderson Division — Est. 2025',
    images: [
      { url: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/nzrfrnoqnkyxuyej3sgmp', caption: 'Coyotes female athlete — teal and bronze' },
    ],
    logoUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uapwqen6f9squbhvjw013',
    latitude: 36.0130,
    longitude: -115.0490,
    schedule: [
      { opponentId: 'arroyo-grande-aces', date: '3/1' },
      { opponentId: 'discovery-desert-devils', date: '3/8' },
      { opponentId: 'mission-hills-mountaineers', date: '3/15' },
    ],
    wins: 1,
    losses: 5,
    ties: 0,
  },
];

export const LOCATIONS = ['Henderson', 'Las Vegas', 'Boulder City'] as const;
export type LocationFilter = typeof LOCATIONS[number];

export function getTeamsByCity(city: LocationFilter): Team[] {
  return TEAMS.filter(t => t.city === city);
}

export function getStandings(city?: LocationFilter): Team[] {
  const filtered = city ? TEAMS.filter(t => t.city === city) : TEAMS;
  return [...filtered].sort((a, b) => {
    const aWinPct = a.wins / (a.wins + a.losses + a.ties || 1);
    const bWinPct = b.wins / (b.wins + b.losses + b.ties || 1);
    if (bWinPct !== aWinPct) return bWinPct - aWinPct;
    return b.wins - a.wins;
  });
}

export const LEAGUE_HERO_IMAGE = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/11eeqypz2nc9h63mxgcep';

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
}
