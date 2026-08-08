export interface TACODefinition {
  code: string;
  superCategory: string;
  name: string;
  typicalDecompositionYears: number;
  marineImpact: string;
}

export const TACO_CATEGORIES: Record<string, TACODefinition> = {
  '1-01': {
    code: 'TACO 1-01',
    superCategory: 'Bottles',
    name: 'Plastic Bottle (PET/HDPE)',
    typicalDecompositionYears: 450,
    marineImpact: 'Breaks into toxic microplastics ingested by sea turtles & pelagic fish.',
  },
  '1-02': {
    code: 'TACO 1-02',
    superCategory: 'Bottles',
    name: 'Glass Bottle',
    typicalDecompositionYears: 1000000,
    marineImpact: 'Sharp fragments present physical cuts, though chemically inert.',
  },
  '2-01': {
    code: 'TACO 2-01',
    superCategory: 'Bags',
    name: 'Single-use Plastic Carrier Bag',
    typicalDecompositionYears: 20,
    marineImpact: 'Mistaken for jellyfish by leatherback sea turtles; causes fatal digestive blockage.',
  },
  '2-02': {
    code: 'TACO 2-02',
    superCategory: 'Bags',
    name: 'Trash Bag / Heavy Duty Film',
    typicalDecompositionYears: 50,
    marineImpact: 'Smothers benthic seafloor habitats and prevents oxygenation.',
  },
  '3-01': {
    code: 'TACO 3-01',
    superCategory: 'Food Containers',
    name: 'Crisp / Snack Packet (Multilayer Foil)',
    typicalDecompositionYears: 80,
    marineImpact: 'Non-recyclable composite plastic; persistent floating surface marine debris.',
  },
  '3-02': {
    code: 'TACO 3-02',
    superCategory: 'Food Containers',
    name: 'Styrofoam / EPS Food Tray',
    typicalDecompositionYears: 500,
    marineImpact: 'Crumbles instantly into buoyant polystyrene micro-beads.',
  },
  '4-01': {
    code: 'TACO 4-01',
    superCategory: 'Caps & Lids',
    name: 'Plastic Bottle Cap',
    typicalDecompositionYears: 400,
    marineImpact: 'Frequently found in stomach contents of seabirds like albatrosses.',
  },
  '5-01': {
    code: 'TACO 5-01',
    superCategory: 'Cups & Utensils',
    name: 'Disposable Plastic Cup / Straw',
    typicalDecompositionYears: 200,
    marineImpact: 'Rigid sharp plastic liable to lodge in nostrils or digestive tracts.',
  },
  '6-01': {
    code: 'TACO 6-01',
    superCategory: 'Fishing Gear',
    name: 'Ghost Net / Monofilament Fishing Line',
    typicalDecompositionYears: 600,
    marineImpact: 'Critical ghost-fishing hazard; continually entangles fish, mammals, and coral reefs.',
  },
  '7-01': {
    code: 'TACO 7-01',
    superCategory: 'Fragments',
    name: 'Unidentified Microplastic Fragment',
    typicalDecompositionYears: 500,
    marineImpact: 'Absorbs persistent organic pollutants (POPs) and enters food chain bioaccumulation.',
  },
  '8-01': {
    code: 'TACO 8-01',
    superCategory: 'Cigarettes',
    name: 'Cigarette Butt (Cellulose Acetate)',
    typicalDecompositionYears: 12,
    marineImpact: 'Leaches heavy metals and nicotine toxic to plankton and fish larvae.',
  },
};

export const DECOMPOSITION_INFO = [
  { item: 'Paper Towel', years: 0.1, color: '#10B981' },
  { item: 'Cigarette Butt', years: 12, color: '#F59E0B' },
  { item: 'Plastic Bag', years: 20, color: '#EF4444' },
  { item: 'Styrofoam Cup', years: 50, color: '#EF4444' },
  { item: 'Aluminum Can', years: 200, color: '#6B7280' },
  { item: 'Plastic Bottle', years: 450, color: '#DC2626' },
  { item: 'Monofilament Line', years: 600, color: '#7C3AED' },
];
