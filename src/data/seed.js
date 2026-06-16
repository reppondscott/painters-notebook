// Core SM units shared across all SM armies
const CORE_UNIT_TYPES = [
  {
    id: 'epic-heroes', label: 'Epic Heroes', models: [],
  },
  {
    id: 'characters', label: 'Characters', models: [
      { id: 'ancient', name: 'Ancient', notes: '', recipes: [] },
      { id: 'ancient-terminator', name: 'Ancient in Terminator Armour', notes: '', recipes: [] },
      { id: 'apothecary', name: 'Apothecary', notes: '', recipes: [] },
      { id: 'apothecary-biologis', name: 'Apothecary Biologis', notes: 'Attached to Eradicators. Fire Discipline enhancement.', recipes: [] },
      { id: 'bladeguard-ancient', name: 'Bladeguard Ancient', notes: '', recipes: [] },
      { id: 'captain', name: 'Captain', notes: '', recipes: [] },
      { id: 'captain-gravis', name: 'Captain in Gravis Armour', notes: '', recipes: [] },
      { id: 'captain-phobos', name: 'Captain in Phobos Armour', notes: '', recipes: [] },
      { id: 'captain-terminator', name: 'Captain in Terminator Armour', notes: '', recipes: [] },
      { id: 'captain-jump', name: 'Captain with Jump Pack', notes: '', recipes: [] },
      { id: 'chaplain', name: 'Chaplain', notes: '', recipes: [] },
      { id: 'chaplain-terminator', name: 'Chaplain in Terminator Armour', notes: '', recipes: [] },
      { id: 'chaplain-jump', name: 'Chaplain with Jump Pack', notes: '', recipes: [] },
      { id: 'judiciar', name: 'Judiciar', notes: 'Attached to Deathwing Knights — grants Fights First.', recipes: [] },
      { id: 'librarian', name: 'Librarian', notes: '', recipes: [] },
      { id: 'librarian-phobos', name: 'Librarian in Phobos Armour', notes: '', recipes: [] },
      { id: 'librarian-terminator', name: 'Librarian in Terminator Armour', notes: '', recipes: [] },
      { id: 'lieutenant', name: 'Lieutenant', notes: '', recipes: [] },
      { id: 'lieutenant-phobos', name: 'Lieutenant in Phobos Armour', notes: '', recipes: [] },
      { id: 'lieutenant-reiver', name: 'Lieutenant in Reiver Armour', notes: '', recipes: [] },
      { id: 'lieutenant-combi', name: 'Lieutenant with Combi-weapon', notes: '', recipes: [] },
      { id: 'techmarine', name: 'Techmarine', notes: '', recipes: [] },
    ],
  },
  {
    id: 'battleline', label: 'Battleline', models: [
      { id: 'assault-intercessors', name: 'Assault Intercessor Squad', notes: '', recipes: [] },
      { id: 'heavy-intercessors', name: 'Heavy Intercessor Squad', notes: '', recipes: [] },
      { id: 'intercessors', name: 'Intercessor Squad', notes: '', recipes: [] },
      { id: 'tactical-squad', name: 'Tactical Squad', notes: '', recipes: [] },
    ],
  },
  {
    id: 'infantry', label: 'Infantry', models: [
      { id: 'aggressors', name: 'Aggressor Squad', notes: '', recipes: [] },
      { id: 'assault-intercessors-jump', name: 'Assault Intercessors with Jump Packs', notes: 'Two units of 5. Objective pressure.', recipes: [] },
      { id: 'bladeguard-veterans', name: 'Bladeguard Veteran Squad', notes: 'Shield color treatment TBD.', recipes: [] },
      { id: 'centurion-assault', name: 'Centurion Assault Squad', notes: '', recipes: [] },
      { id: 'centurion-devastator', name: 'Centurion Devastator Squad', notes: '', recipes: [] },
      { id: 'company-heroes', name: 'Company Heroes', notes: '', recipes: [] },
      { id: 'desolation-squad', name: 'Desolation Squad', notes: '', recipes: [] },
      { id: 'devastator-squad', name: 'Devastator Squad', notes: '', recipes: [] },
      { id: 'eliminator-squad', name: 'Eliminator Squad', notes: '', recipes: [] },
      { id: 'eradicators', name: 'Eradicator Squad', notes: '', recipes: [
        {
          id: 'r-red-housing', name: 'Red Weapon Housing', type: 'workflow',
          source: '@lorescale', part: 'weapons', imageId: null,
          steps: [
            { label: 'Base', detail: 'Khorne Red over black primer' },
            { label: 'Layer', detail: 'Mephiston Red on raised surfaces' },
            { label: 'Highlight', detail: 'Evil Sunz Scarlet on edges' },
            { label: 'Fine highlight', detail: 'Wild Rider Red on sharpest edges' },
            { label: 'Edge', detail: 'Fire Dragon Bright on tips and corners' },
          ],
          notes: 'Hot orange-red edge finish. Used for weapon housing spot color across DA army.',
          tags: ['red', 'weapons', 'spot color'],
        },
      ]},
      { id: 'hellblasters', name: 'Hellblaster Squad', notes: '', recipes: [
        {
          id: 'r-armor-wash', name: 'Armor Wash', type: 'mix',
          source: '@MattsHobbyHour', part: 'metallics', imageId: null,
          mix: [{ paint: 'Lahmian Medium', parts: 2 }, { paint: 'Ratling Grime', parts: 1 }],
          notes: 'Pools in recesses without killing highlights. For metallics primarily.',
          tags: ['wash', 'metallics'],
        },
      ]},
      { id: 'inceptor-squad', name: 'Inceptor Squad', notes: '', recipes: [] },
      { id: 'incursor-squad', name: 'Incursor Squad', notes: '', recipes: [] },
      { id: 'infernus-squad', name: 'Infernus Squad', notes: '', recipes: [] },
      { id: 'infiltrators', name: 'Infiltrator Squad', notes: 'Backfield objective holders. Deepstrike denial role.', recipes: [] },
      { id: 'reiver-squad', name: 'Reiver Squad', notes: '', recipes: [] },
      { id: 'scout-squad', name: 'Scout Squad', notes: '', recipes: [] },
      { id: 'sternguard-veterans', name: 'Sternguard Veteran Squad', notes: '', recipes: [] },
      { id: 'suppressor-squad', name: 'Suppressor Squad', notes: '', recipes: [] },
      { id: 'terminator-assault', name: 'Terminator Assault Squad', notes: '', recipes: [] },
      { id: 'terminator-squad', name: 'Terminator Squad', notes: '', recipes: [] },
      { id: 'vanguard-veterans', name: 'Vanguard Veteran Squad with Jump Packs', notes: '', recipes: [] },
      { id: 'victrix-honour-guard', name: 'Victrix Honour Guard', notes: '', recipes: [] },
    ],
  },
  {
    id: 'mounted', label: 'Mounted', models: [
      { id: 'chaplain-bike', name: 'Chaplain on Bike', notes: '', recipes: [] },
      { id: 'outrider-squad', name: 'Outrider Squad', notes: '', recipes: [] },
    ],
  },
  {
    id: 'vehicle', label: 'Vehicle', models: [
      { id: 'ballistus-dreadnought', name: 'Ballistus Dreadnought', notes: '', recipes: [] },
      { id: 'brutalis-dreadnought', name: 'Brutalis Dreadnought', notes: '', recipes: [] },
      { id: 'dreadnought', name: 'Dreadnought', notes: '', recipes: [] },
      { id: 'firestrike-servo-turrets', name: 'Firestrike Servo-turrets', notes: '', recipes: [] },
      { id: 'gladiator-lancer', name: 'Gladiator Lancer', notes: '', recipes: [] },
      { id: 'gladiator-reaper', name: 'Gladiator Reaper', notes: '', recipes: [] },
      { id: 'gladiator-valiant', name: 'Gladiator Valiant', notes: '', recipes: [] },
      { id: 'invader-atv', name: 'Invader ATV', notes: '', recipes: [] },
      { id: 'invictor-warsuit', name: 'Invictor Tactical Warsuit', notes: '', recipes: [] },
      { id: 'land-raider', name: 'Land Raider', notes: '', recipes: [] },
      { id: 'land-raider-crusader', name: 'Land Raider Crusader', notes: '', recipes: [] },
      { id: 'land-raider-redeemer', name: 'Land Raider Redeemer', notes: '', recipes: [] },
      { id: 'predator-annihilator', name: 'Predator Annihilator', notes: '', recipes: [] },
      { id: 'predator-destructor', name: 'Predator Destructor', notes: '', recipes: [] },
      { id: 'redemptor-dreadnought', name: 'Redemptor Dreadnought', notes: '', recipes: [] },
      { id: 'repulsor', name: 'Repulsor', notes: '', recipes: [] },
      { id: 'repulsor-executioner', name: 'Repulsor Executioner', notes: '', recipes: [] },
      { id: 'storm-speeder-hailstrike', name: 'Storm Speeder Hailstrike', notes: '', recipes: [] },
      { id: 'storm-speeder-hammerstrike', name: 'Storm Speeder Hammerstrike', notes: '', recipes: [] },
      { id: 'storm-speeder-thunderstrike', name: 'Storm Speeder Thunderstrike', notes: '', recipes: [] },
      { id: 'stormhawk-interceptor', name: 'Stormhawk Interceptor', notes: '', recipes: [] },
      { id: 'stormraven-gunship', name: 'Stormraven Gunship', notes: '', recipes: [] },
      { id: 'stormtalon-gunship', name: 'Stormtalon Gunship', notes: '', recipes: [] },
      { id: 'vindicator', name: 'Vindicator', notes: '', recipes: [] },
      { id: 'whirlwind', name: 'Whirlwind', notes: '', recipes: [] },
    ],
  },
  {
    id: 'dedicated-transport', label: 'Dedicated Transport', models: [
      { id: 'drop-pod', name: 'Drop Pod', notes: '', recipes: [] },
      { id: 'impulsor', name: 'Impulsor', notes: '', recipes: [] },
      { id: 'razorback', name: 'Razorback', notes: '', recipes: [] },
      { id: 'rhino', name: 'Rhino', notes: '', recipes: [] },
    ],
  },
  {
    id: 'fortification', label: 'Fortification', models: [
      { id: 'hammerfall-bunker', name: 'Hammerfall Bunker', notes: '', recipes: [] },
    ],
  },
]

// Deep clone utility
function clone(obj) { return JSON.parse(JSON.stringify(obj)) }

// Build Dark Angels unit types: core SM + DA-specific units injected into right categories
function buildDarkAngelsUnitTypes() {
  const ut = clone(CORE_UNIT_TYPES)

  // Epic Heroes
  ut.find(u => u.id === 'epic-heroes').models = [
    { id: 'azrael', name: 'Azrael', notes: 'Warlord. Attached to Hellblasters.', recipes: [] },
    { id: 'lion-el-jonson', name: 'Lion El\'Jonson', notes: 'Primarch of the Dark Angels.', recipes: [] },
  ]

  // Characters
  ut.find(u => u.id === 'characters').models.push(...[
    { id: 'asmodai', name: 'Asmodai', notes: 'Master Interrogator-Chaplain.', recipes: [] },
    { id: 'belial', name: 'Belial', notes: 'Master of the Deathwing.', recipes: [] },
    { id: 'ezekiel', name: 'Ezekiel', notes: 'Chief Librarian of the Dark Angels.', recipes: [] },
    { id: 'lazarus', name: 'Lazarus', notes: 'Master of the 5th Company.', recipes: [] },
    { id: 'judiciar-da', name: 'Judiciar', notes: 'Attached to Deathwing Knights — grants Fights First.', recipes: [] },
    { id: 'apothecary-biologis-da', name: 'Apothecary Biologis', notes: 'Attached to Eradicators. Fire Discipline enhancement.', recipes: [] },
  ])

  // Infantry — add DA unique units
  ut.find(u => u.id === 'infantry').models.push(...[
    { id: 'deathwing-knights', name: 'Deathwing Knights', notes: 'Two units of 5. Terminator plate, flail weapons.', recipes: [] },
    { id: 'deathwing-terminator-squad', name: 'Deathwing Terminator Squad', notes: '', recipes: [] },
    { id: 'inner-circle-companions', name: 'Inner Circle Companions', notes: '6 models. Black armor, purple robes — confirmed lore-accurate scheme for the Risen.', recipes: [] },
  ])

  // Mounted — add DA unique units
  ut.find(u => u.id === 'mounted').models.push(...[
    { id: 'ravenwing-black-knights', name: 'Ravenwing Black Knights', notes: '', recipes: [] },
    { id: 'ravenwing-command-squad', name: 'Ravenwing Command Squad', notes: '', recipes: [] },
  ])

  // Vehicle — add DA unique units
  ut.find(u => u.id === 'vehicle').models.push(...[
    { id: 'land-speeder-vengeance', name: 'Land Speeder Vengeance', notes: '', recipes: [] },
    { id: 'nephilim-jetfighter', name: 'Nephilim Jetfighter', notes: '', recipes: [] },
    { id: 'ravenwing-dark-talon', name: 'Ravenwing Dark Talon', notes: '', recipes: [] },
    { id: 'ravenwing-darkshroud', name: 'Ravenwing Darkshroud', notes: '', recipes: [] },
    { id: 'sammael', name: 'Sammael on Sableclaw', notes: 'Vehicle keyword regardless of mount option.', recipes: [] },
  ])

  // Remove duplicate judiciar and apothecary-biologis from characters (they were in core)
  const chars = ut.find(u => u.id === 'characters')
  chars.models = chars.models.filter(m => !['judiciar', 'apothecary-biologis'].includes(m.id))

  return ut
}

// Build Blood Angels unit types
function buildBloodAngelsUnitTypes() {
  const ut = clone(CORE_UNIT_TYPES)

  // Epic Heroes
  ut.find(u => u.id === 'epic-heroes').models = [
    { id: 'astorath', name: 'Astorath', notes: 'High Chaplain of the Blood Angels.', recipes: [] },
    { id: 'commander-dante', name: 'Commander Dante', notes: 'Chapter Master of the Blood Angels.', recipes: [] },
    { id: 'gabriel-seth', name: 'Gabriel Seth', notes: 'Chapter Master of the Flesh Tearers.', recipes: [] },
    { id: 'lemartes', name: 'Lemartes', notes: 'Guardian of the Lost.', recipes: [] },
    { id: 'mephiston', name: 'Chief Librarian Mephiston', notes: 'Also Epic Hero.', recipes: [] },
    { id: 'the-sanguinor', name: 'The Sanguinor', notes: 'Exemplar of the Host.', recipes: [] },
    { id: 'tycho-the-lost', name: 'Tycho the Lost', notes: '', recipes: [] },
  ]

  // Characters — add BA unique
  ut.find(u => u.id === 'characters').models.push(...[
    { id: 'ba-captain', name: 'Blood Angels Captain', notes: '', recipes: [] },
    { id: 'dc-captain', name: 'Death Company Captain', notes: '', recipes: [] },
    { id: 'dc-captain-jump', name: 'Death Company Captain with Jump Pack', notes: '', recipes: [] },
    { id: 'sanguinary-priest', name: 'Sanguinary Priest', notes: '', recipes: [] },
  ])

  // Infantry — add BA unique
  ut.find(u => u.id === 'infantry').models.push(...[
    { id: 'death-company-marines', name: 'Death Company Marines', notes: '', recipes: [] },
    { id: 'death-company-bolt-rifles', name: 'Death Company Marines with Bolt Rifles', notes: '', recipes: [] },
    { id: 'death-company-jump', name: 'Death Company Marines with Jump Packs', notes: '', recipes: [] },
    { id: 'sanguinary-guard', name: 'Sanguinary Guard', notes: '', recipes: [] },
  ])

  // Vehicle — add BA unique
  ut.find(u => u.id === 'vehicle').models.push(...[
    { id: 'baal-predator', name: 'Baal Predator', notes: '', recipes: [] },
    { id: 'death-company-dreadnought', name: 'Death Company Dreadnought', notes: 'Uses Brutalis kit. Distinct datasheet.', recipes: [] },
  ])

  return ut
}

export const SEED = {
  bases: {
    recipes: [],
    moodboard: [],
  },
  armies: [
    {
      id: 'dark-angels',
      name: 'Dark Angels',
      subtitle: 'Gladius Task Force · 10th Edition',
      accentColor: '#2d5a27',
      accentLight: '#4a7c3f',
      moodboard: [
        {
          id: 'mb-da-1',
          source: '@ursamajor.minis',
          platform: 'Instagram',
          notes: '7-phase Dark Angels green armor process. Sponge highlighting into washes and glazes. Flagged as reference for robes/fabrics — not current armor approach.',
          tags: ['green', 'armor', 'robes'],
          imageId: null,
        },
        {
          id: 'mb-da-2',
          source: 'Battle Forged Gaming (ICC inspiration)',
          platform: 'Instagram',
          notes: 'Inner Circle Companions reference. Black armor, purple robes — lore-accurate Risen scheme.',
          tags: ['ICC', 'black armor', 'purple robes'],
          imageId: null,
        },
      ],
      unitTypes: buildDarkAngelsUnitTypes(),
      sharedRecipes: [{
        id: 'sr-da-green',
        name: 'Dark Angels Green Armor (Reference)',
        type: 'workflow',
        source: '@ursamajor.minis',
        part: 'armor',
        imageId: null,
        steps: [
          { label: 'Phase 1 — Sponge', detail: 'Stipple Angel Green over black undercoat' },
          { label: 'Phase 2 — Layer', detail: 'WAAAGH! Flesh over raised areas' },
          { label: 'Phase 3 — Highlight', detail: 'Loren Forest on edges' },
          { label: 'Phase 4 — Fine highlight', detail: 'Elysian Green on sharpest edges' },
          { label: 'Phase 5 — Shade', detail: 'Caliban Green into recesses' },
          { label: 'Phase 6 — Wash', detail: 'Grimdark Shadow over whole surface' },
          { label: 'Phase 7 — Glaze', detail: 'Black Templar glaze to deepen shadows' },
        ],
        notes: 'Full 7-phase reference. NOT current armor approach — flagged for robes/fabrics use.',
        tags: ['green', 'armor', 'robes', 'reference'],
      }],
    },
    {
      id: 'blood-angels',
      name: 'Blood Angels',
      subtitle: 'Painting Inspiration · Reference',
      accentColor: '#8b1a1a',
      accentLight: '#b52929',
      moodboard: [{
        id: 'mb-ba-1',
        source: 'Battle Forged Gaming',
        platform: 'Instagram Reels',
        notes: 'Kitbashed BA Captain. Deep muted red — dark burgundy shadows to mid-red highlights, desaturated. Antiqued warm gold. Parchment tabard. Teal feathered wings as cold accent.',
        tags: ['captain', 'red', 'gold', 'teal accent'],
        imageId: null,
      }],
      unitTypes: buildBloodAngelsUnitTypes(),
      sharedRecipes: [],
    },
  ],
}
