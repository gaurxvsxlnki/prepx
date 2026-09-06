/* ============================================================
   Question bank — Phase 2 demo dataset.

   Mirrors the `questions` table schema 1:1. Every row is mapped
   to the exact textbook page(s) it belongs to (the reader only
   ever shows content for the page being read). All items are
   clearly marked DEMO: they are self-authored revision items in
   the pattern of the source exams — never official PYQs.
   Phase 2+ swaps this module for Supabase queries via
   `lib/contentRepo.ts` without UI changes.
   ============================================================ */

import type { ReaderSection, StudyQuestion } from '../types/study';
import type { SubjectCode as Subject } from '../types';

/* chapterId is added per-bank via withChapter(); general rows set '' */
type Seed = Omit<StudyQuestion, 'id' | 'isDemo' | 'chapterId'> & {
  id: string;
  chapterId?: string;
  subject?: Subject;
};

const demo = (q: Seed): StudyQuestion => ({
  ...q,
  isDemo: true,
  chapterId: q.chapterId ?? '',
});

/* chapter -> subject (used for PYQ filters and analytics) */
export const CHAPTER_SUBJECT: Record<string, Subject> = {
  'living-world': 'biology',
  'biological-classification': 'biology',
  'basic-concepts': 'chemistry',
  'units-measurements': 'physics',
};

export function subjectOfRow(q: StudyQuestion): Subject {
  return (q.subject as Subject | undefined) ??
    (q.chapterId ? (CHAPTER_SUBJECT[q.chapterId] as Subject | undefined) : undefined) ??
    'biology';
}

/* ------------------------------------------------------------------ */
/* BIOLOGY · The Living World (ch 1 · 9 pages)                         */
/* ------------------------------------------------------------------ */
const LIVING_WORLD: Seed[] = [
  {
    id: 'lw-1', section: 'important', kind: 'short', difficulty: 'easy', topic: 'Diversity', pages: [2],
    text: 'Why is the number of described living species only an estimate, not a final count?',
    answer: 'Biodiversity surveys are still incomplete — new species are discovered each year across poorly explored habitats (rainforests, oceans), so the ~1.7 million described species are an ongoing estimate.',
    explanation: 'Taxonomic work is continuous; estimates commonly range between 1.7 and 1.8 million named species.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'lw-2', section: 'important', kind: 'conceptual', difficulty: 'medium', topic: 'Nomenclature', pages: [3, 4],
    text: 'What does “nomenclature” standardise, and why does it matter for a global study platform?',
    answer: 'Nomenclature gives every organism one unambiguous scientific name so students and scientists across regions and languages refer to the same organism.',
    explanation: 'Local names differ everywhere; the binomial scientific name is universal.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'lw-3', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'Nomenclature', pages: [3, 4],
    text: 'Binomial nomenclature was introduced by —',
    options: ['Carolus Linnaeus', 'G. D. Haeckel', 'R. H. Whittaker', 'A. R. Wallace'],
    answer: 'Carolus Linnaeus',
    explanation: 'Linnaeus introduced the binomial system in “Species Plantarum” (1753); Whittaker proposed the five-kingdom system in 1969.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'lw-4', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Taxonomy', pages: [3, 4],
    text: 'Which pair is correctly matched?',
    options: [
      'Herbarium — living plant collection',
      'Botanical garden — dried specimens',
      'Museum — preserved plant and animal specimens',
      'Key — a list of species habitats',
    ],
    answer: 'Museum — preserved plant and animal specimens',
    explanation: 'Herbaria store dried specimens, botanical gardens keep living plants, museums preserve specimens, and keys are analytical identification aids based on couplets.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'lw-5', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Taxonomy', pages: [4, 5],
    text: 'A taxon is correctly described as —',
    options: [
      'A group of related genera',
      'Any taxonomic category',
      'A group of related species',
      'The scientific name of an organism',
    ],
    answer: 'Any taxonomic category',
    explanation: 'Taxon is a general term for any rank in the hierarchy — species, genus, family and kingdom are all taxa.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'lw-6', section: 'mcq', kind: 'assertion', difficulty: 'medium', topic: 'Nomenclature', pages: [4],
    text: 'A: Scientific names are written in italics with the genus name capitalised.\nR: The International Code of Botanical Nomenclature frames naming rules.',
    options: [
      'Both A and R are true and R explains A',
      'Both A and R are true but R does not explain A',
      'A is true but R is false',
      'A is false but R is true',
    ],
    answer: 'Both A and R are true but R does not explain A',
    explanation: 'Both statements are independently true, but writing conventions do not explain why the code exists.',
    source: 'demo', sourceLabel: 'Demo · assertion', marks: 1,
  },
  {
    id: 'lw-7', section: 'important', kind: 'short', difficulty: 'hard', topic: 'Tools of taxonomy', pages: [4],
    text: 'A herbarium sheet and a botanical garden serve different purposes. Distinguish them with one example each.',
    answer: 'A herbarium is a storehouse of dried, pressed plant specimens on sheets with label data; a botanical garden maintains living plants for reference (e.g., Kew).',
    explanation: 'Herbarium specimens are dead and preserved; gardens hold living collections.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'lw-8', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Identification', pages: [3],
    text: 'Why must identification come before naming and classification in taxonomy?',
    answer: 'An organism must be correctly identified as belonging to a known group first; only then can it be named and placed in the classification.',
    explanation: 'Identification connects the unknown organism to established knowledge.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'lw-9', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Taxonomic hierarchy', pages: [5],
    text: 'Which is the correct ascending order of taxonomic categories?',
    options: [
      'Species → Genus → Family → Order → Class',
      'Genus → Species → Order → Family → Class',
      'Class → Order → Family → Genus → Species',
      'Family → Genus → Species → Order → Class',
    ],
    answer: 'Species → Genus → Family → Order → Class',
    explanation: 'Higher categories aggregate the ones below: Species → Genus → Family → Order → Class → Phylum → Kingdom.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'lw-10', section: 'mcq', kind: 'mcq', difficulty: 'hard', topic: 'Species concept', pages: [5, 6],
    text: 'Two plants belong to the same species if they —',
    options: [
      'Look exactly alike',
      'Can interbreed and produce fertile offspring',
      'Share the same genus',
      'Grow in the same habitat',
    ],
    answer: 'Can interbreed and produce fertile offspring',
    explanation: 'A species is a group of interbreeding natural populations producing fertile offspring; appearance alone is not decisive.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'lw-11', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'Taxonomic aids', pages: [8],
    text: 'Keys used in taxonomic manuals are based on —',
    options: [
      'Overall similarity of organisms',
      'Contrasting characters called couplets',
      'Evolutionary ancestry',
      'Geographic ranges',
    ],
    answer: 'Contrasting characters called couplets',
    explanation: 'Each couplet presents two contrasting characters; accepting one rejects the other, narrowing to the correct taxon.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'lw-12', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Taxonomic categories', pages: [6],
    text: 'Solanum, Petunia and Datura belong to which category above the genus level?',
    options: ['Order', 'Family', 'Class', 'Division'],
    answer: 'Family',
    explanation: 'They are placed in Solanaceae — the family level groups related genera.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'lw-13', section: 'pyq', kind: 'mcq', difficulty: 'easy', topic: 'Nomenclature', pages: [3, 4],
    exam: 'neet', year: 2022,
    text: 'Binomial nomenclature means the scientific name of an organism is —',
    options: ['A single epithet only', 'Two words — generic and specific epithet', 'A name in the local language', 'A name with three parts'],
    answer: 'Two words — generic and specific epithet',
    explanation: 'Every scientific name has a genus name followed by a species epithet.',
    source: 'demo', sourceLabel: 'Demo · NEET pattern 2022', marks: 1,
  },
  {
    id: 'lw-14', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Taxonomic hierarchy', pages: [5, 6],
    exam: 'jee', year: 2021,
    text: 'Which sequence moves from the most inclusive to the least inclusive category?',
    options: [
      'Kingdom → Phylum → Class → Order → Family',
      'Family → Class → Order → Phylum → Kingdom',
      'Order → Class → Phylum → Kingdom → Species',
      'Species → Genus → Family → Order',
    ],
    answer: 'Kingdom → Phylum → Class → Order → Family',
    explanation: 'Kingdom is the broadest obligatory category; each step downward aggregates fewer, more similar organisms.',
    source: 'demo', sourceLabel: 'Demo · pattern 2021', marks: 2,
  },
  {
    id: 'lw-15', section: 'pyq', kind: 'short', difficulty: 'medium', topic: 'Diversity', pages: [2, 3],
    exam: 'cbse', year: 2024,
    text: 'What do the terms diversity and “the living world” refer to, and why classify it?',
    answer: 'Diversity is the enormous variety of living organisms; classification brings order so that 1.7+ million species can be identified, named and studied systematically.',
    source: 'demo', sourceLabel: 'Demo · Board pattern 2024', marks: 3,
  },
  {
    id: 'lw-16', section: 'pyq', kind: 'short', difficulty: 'medium', topic: 'Taxonomic aids', pages: [8],
    exam: 'neet', year: 2019,
    text: 'How are herbarium sheets and museums useful in taxonomic studies?',
    answer: 'Herbaria preserve dried plant specimens for reference, while museums preserve plants and animals for study and identification; both back taxonomic research and teaching.',
    source: 'demo', sourceLabel: 'Demo · NEET pattern 2019', marks: 2,
  },
];

/* ------------------------------------------------------------------ */
/* BIOLOGY · Biological Classification (ch 2 · 13 pages)               */
/* ------------------------------------------------------------------ */
const CLASSIFICATION: Seed[] = [
  {
    id: 'bc-1', section: 'important', kind: 'conceptual', difficulty: 'medium', topic: 'Five-kingdom system', pages: [2],
    text: 'Why did Whittaker’s five-kingdom system replace the earlier two-kingdom (Plantae–Animalia) arrangement?',
    answer: 'Two kingdoms could not place organisms like fungi, unicellular eukaryotes and bacteria sensibly. Whittaker used cell structure, body organisation, nutrition and phylogeny to propose Monera, Protista, Fungi, Plantae and Animalia.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'bc-2', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'Five-kingdom system', pages: [2],
    text: 'The five-kingdom classification was proposed by —',
    options: ['Eichler', 'R. H. Whittaker', 'Linnaeus', 'Haeckel'],
    answer: 'R. H. Whittaker',
    explanation: 'Whittaker (1969) arranged organisms into Monera, Protista, Fungi, Plantae and Animalia.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'bc-3', section: 'important', kind: 'short', difficulty: 'easy', topic: 'Five-kingdom system', pages: [2],
    text: 'List the five kingdoms with one defining feature of each.',
    answer: 'Monera — prokaryotic cells; Protista — unicellular eukaryotes; Fungi — heterotrophic, chitinous walls; Plantae — autotrophic, cellulosic walls; Animalia — heterotrophic, no cell wall.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'bc-4', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Archaebacteria', pages: [3, 4],
    text: 'Bacteria thriving in extreme saline habitats are —',
    options: ['Methanogens', 'Halophiles', 'Thermoacidophiles', 'Cyanobacteria'],
    answer: 'Halophiles',
    explanation: 'Archaebacteria include halophiles (salt-loving), thermoacidophiles (hot, acidic) and methanogens (methane producers).',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'bc-5', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Monera', pages: [3, 4],
    text: 'The smallest living cells known, lacking a definite cell wall, are —',
    options: ['Mycoplasma', 'Viroids', 'Cyanobacteria', 'Slime moulds'],
    answer: 'Mycoplasma',
    explanation: 'Mycoplasmas have no cell wall and are the smallest free-living cells; they can survive without oxygen.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'bc-6', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Protista · Diatoms', pages: [5],
    text: 'Why do diatoms form durable deposits of diatomaceous earth?',
    answer: 'Diatom cell walls are made of silica, which does not decay; over millennia, dead diatoms accumulate on ocean floors as diatomaceous earth.',
    explanation: 'Diatomaceous earth is mined for filtration and polishing.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'bc-7', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Protista', pages: [5],
    text: 'A protist with two overlapping silicified shells is a —',
    options: ['Dinoflagellate', 'Diatom', 'Euglenoid', 'Slime mould'],
    answer: 'Diatom',
    explanation: 'Diatoms (Bacillariophyceae) have a frustule of two silica shells fitting like a soap box.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'bc-8', section: 'mcq', kind: 'assertion', difficulty: 'hard', topic: 'Slime moulds', pages: [7],
    text: 'A: Slime moulds form fruiting bodies in unfavourable conditions.\nR: Slime moulds are saprophytic protists that move like amoebae.',
    options: [
      'Both A and R are true and R explains A',
      'Both A and R are true but R does not explain A',
      'A is true but R is false',
      'A is false but R is true',
    ],
    answer: 'Both A and R are true but R does not explain A',
    explanation: 'Fruiting bodies aid survival in adverse conditions; the amoeboid saprophytic lifestyle is a separate trait.',
    source: 'demo', sourceLabel: 'Demo · assertion', marks: 2,
  },
  {
    id: 'bc-9', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Fungi', pages: [7, 8],
    text: 'Fungi are best described as —',
    options: [
      'Autotrophic eukaryotes with chitin walls',
      'Heterotrophic eukaryotes with chitinous walls',
      'Prokaryotes that absorb nutrients',
      'Photosynthetic decomposers',
    ],
    answer: 'Heterotrophic eukaryotes with chitinous walls',
    explanation: 'Fungi are eukaryotic, lack chlorophyll and digest food externally, absorbing nutrients; their walls contain chitin.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'bc-10', section: 'mcq', kind: 'mcq', difficulty: 'hard', topic: 'Basidiomycetes', pages: [9],
    text: 'Rusts and smuts — the plant pathogens — belong to —',
    options: ['Ascomycetes', 'Basidiomycetes', 'Phycomycetes', 'Deuteromycetes'],
    answer: 'Basidiomycetes',
    explanation: 'Mushrooms, bracket fungi, puffballs, rusts and smuts are basidiomycetes.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'bc-11', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Symbiosis', pages: [9],
    text: 'What is a lichen, and what does each partner contribute?',
    answer: 'A lichen is a symbiotic association of an alga and a fungus: the alga photosynthesises while the fungus provides shelter and absorbs water and minerals.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'bc-12', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Viruses', pages: [10],
    text: 'What are viroids, and how do they differ from viruses?',
    answer: 'Viroids are infectious RNA molecules with no protein coat (discovered by T. O. Diener, 1971); viruses always have genetic material enclosed in a protein coat.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'bc-13', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'Viruses', pages: [10],
    text: 'Viruses are considered living because they —',
    options: [
      'Multiply only inside a host cell',
      'Possess genetic material (DNA or RNA)',
      'Crystallise outside the host',
      'Lack cellular machinery',
    ],
    answer: 'Possess genetic material (DNA or RNA)',
    explanation: 'Possession of genetic material and reproduction inside hosts are living traits; outside a host they are inert crystals.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'bc-14', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Viruses', pages: [10],
    exam: 'neet', year: 2023,
    text: 'Infectious agents that consist only of RNA with no protein coat are called —',
    options: ['Prions', 'Viroids', 'Virions', 'Bacteriophages'],
    answer: 'Viroids',
    explanation: 'Viroids are naked RNA pathogens discovered by T. O. Diener; prions are infectious proteins.',
    source: 'demo', sourceLabel: 'Demo · NEET pattern 2023', marks: 1,
  },
  {
    id: 'bc-15', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Monera', pages: [3, 4],
    exam: 'neet', year: 2021,
    text: 'Archaebacteria differ from eubacteria mainly in —',
    options: [
      'Their cell-wall composition and habitat',
      'Absence of ribosomes',
      'Presence of a nucleus',
      'Mode of nutrition',
    ],
    answer: 'Their cell-wall composition and habitat',
    explanation: 'Archaebacteria have distinct walls and inhabit extreme environments such as salt lakes, hot springs and marshy areas.',
    source: 'demo', sourceLabel: 'Demo · NEET pattern 2021', marks: 1,
  },
  {
    id: 'bc-16', section: 'pyq', kind: 'mcq', difficulty: 'easy', topic: 'Five-kingdom system', pages: [2],
    exam: 'cbse', year: 2020,
    text: 'Which kingdom in Whittaker’s system contains only prokaryotic organisms?',
    options: ['Protista', 'Fungi', 'Monera', 'Plantae'],
    answer: 'Monera',
    explanation: 'Monera = all prokaryotes (bacteria, cyanobacteria, mycoplasma).',
    source: 'demo', sourceLabel: 'Demo · Board pattern 2020', marks: 1,
  },
  {
    id: 'bc-17', section: 'pyq', kind: 'short', difficulty: 'medium', topic: 'Fungi', pages: [8, 9],
    exam: 'cbse', year: 2023,
    text: 'Differentiate between Ascomycetes and Basidiomycetes with one example each.',
    answer: 'Ascomycetes produce ascospores in sacs (e.g., Penicillium, morels); Basidiomycetes produce basidiospores on basidia (e.g., mushrooms, puffballs, rusts).',
    source: 'demo', sourceLabel: 'Demo · Board pattern 2023', marks: 3,
  },
  {
    id: 'bc-18', section: 'pyq', kind: 'mcq', difficulty: 'hard', topic: 'Protista', pages: [5],
    exam: 'jee', year: 2022,
    text: 'Organisms with silicified cell walls that form diatomaceous earth belong to —',
    options: ['Dinoflagellates', 'Bacillariophyceae', 'Euglenoids', 'Myxomycetes'],
    answer: 'Bacillariophyceae',
    explanation: 'Diatoms are placed in Bacillariophyceae and deposit silica walls that persist after death.',
    source: 'demo', sourceLabel: 'Demo · pattern 2022', marks: 2,
  },
];

/* ------------------------------------------------------------------ */
/* CHEMISTRY · Basic Concepts (ch 1 · 28 pages)                        */
/* ------------------------------------------------------------------ */
const CHEMISTRY: Seed[] = [
  {
    id: 'chm-1', section: 'important', kind: 'conceptual', difficulty: 'medium', topic: 'Laws of chemistry', pages: [3, 4],
    text: 'State the law of conservation of mass and the law of definite proportions.',
    answer: 'Conservation of mass: matter is neither created nor destroyed in a reaction (Lavoisier). Definite proportions: a compound always contains the same elements in fixed proportion by mass (Proust) — e.g., water is always 1 : 8 by mass H : O.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'chm-2', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'Laws of chemistry', pages: [3],
    text: 'The law of conservation of mass is credited to —',
    options: ['Dalton', 'Lavoisier', 'Proust', 'Avogadro'],
    answer: 'Lavoisier',
    explanation: 'Proust gave definite proportions; Dalton gave the atomic theory.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'chm-3', section: 'mcq', kind: 'mcq', difficulty: 'hard', topic: 'Laws of chemistry', pages: [4],
    text: 'Which pair of compounds illustrates the law of multiple proportions?',
    options: ['H₂O and H₂O₂', 'CO₂ and SO₂', 'NaCl and KCl', 'CaCO₃ and CaO'],
    answer: 'H₂O and H₂O₂',
    explanation: 'The same two elements combine in different simple whole-number ratios — the essence of multiple proportions.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'chm-4', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'SI & units', pages: [2],
    text: 'Which is NOT an SI base unit?',
    options: ['Mole', 'Kelvin', 'Candela', 'Newton'],
    answer: 'Newton',
    explanation: 'Newton is derived (kg m s⁻²); mole, kelvin and candela are base units.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'chm-5', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Mole concept', pages: [5, 6],
    text: 'One mole of any substance contains exactly —',
    options: [
      '6.022 × 10²³ molecules',
      '6.022 × 10²³ entities',
      '6.022 × 10²³ atoms',
      '22.4 entities',
    ],
    answer: '6.022 × 10²³ entities',
    explanation: 'A mole contains Avogadro’s number of the specified entities — atoms, molecules or ions.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'chm-6', section: 'mcq', kind: 'numerical', difficulty: 'medium', topic: 'Stoichiometry', pages: [7, 8],
    text: '0.5 mol of H₂SO₄ is dissolved to make 500 mL of solution. Find its molarity.',
    options: ['0.5 M', '1.0 M', '1.5 M', '2.0 M'],
    answer: '1.0 M',
    explanation: 'Molarity = moles / litres = 0.5 / 0.5 = 1.0 M.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'chm-7', section: 'mcq', kind: 'numerical', difficulty: 'medium', topic: 'Stoichiometry', pages: [7],
    text: 'Mass percentage of carbon in CO₂ (C = 12, O = 16) is —',
    options: ['27.3%', '42.9%', '50%', '72.7%'],
    answer: '27.3%',
    explanation: 'Molar mass of CO₂ = 44 g mol⁻¹; %C = (12 / 44) × 100 = 27.3%.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'chm-8', section: 'mcq', kind: 'numerical', difficulty: 'medium', topic: 'Concentration', pages: [7],
    text: 'How many grams of NaOH (molar mass 40) are needed for 250 mL of a 0.5 M solution?',
    options: ['2.5 g', '5.0 g', '10.0 g', '20.0 g'],
    answer: '5.0 g',
    explanation: 'moles = M × V(L) = 0.5 × 0.25 = 0.125; mass = 0.125 × 40 = 5.0 g.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'chm-9', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Stoichiometry', pages: [8, 9],
    text: 'Define limiting reagent with an example.',
    answer: 'The reactant consumed completely first, limiting product yield — e.g., burning 2 mol H₂ with 1 mol O₂: H₂ is limiting and 2 mol water forms.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'chm-10', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Empirical formula', pages: [8],
    text: 'A compound’s empirical formula is CH₂O and its molar mass is 180 g mol⁻¹. Its molecular formula is —',
    options: ['C₂H₄O₂', 'C₃H₆O₃', 'C₆H₁₂O₆', 'CH₂O'],
    answer: 'C₆H₁₂O₆',
    explanation: 'CH₂O unit mass = 30; n = 180/30 = 6 → C₆H₁₂O₆.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'chm-11', section: 'mcq', kind: 'mcq', difficulty: 'hard', topic: 'Significant figures', pages: [10, 11],
    text: 'The number of significant figures in 0.05040 is —',
    options: ['3', '4', '5', '6'],
    answer: '4',
    explanation: 'Leading zeros are not significant; the trailing zero after 4 is — 0.05040 has 4 significant figures.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'chm-12', section: 'mcq', kind: 'assertion', difficulty: 'hard', topic: 'Concentration', pages: [9, 10],
    text: 'A: Molarity of a solution changes with temperature.\nR: Solution volume changes with temperature while moles stay fixed.',
    options: [
      'Both A and R are true and R explains A',
      'Both A and R are true but R does not explain A',
      'A is true but R is false',
      'A is false but R is true',
    ],
    answer: 'Both A and R are true and R explains A',
    explanation: 'Molarity = moles / volume; volume expands with temperature, so molarity shifts. Molality is mass-based and temperature independent.',
    source: 'demo', sourceLabel: 'Demo · assertion', marks: 2,
  },
  {
    id: 'chm-13', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Mole concept', pages: [5, 6],
    exam: 'neet', year: 2024,
    text: 'The number of moles in 22 g of CO₂ (molar mass 44 g mol⁻¹) is —',
    options: ['0.25', '0.5', '1.0', '2.0'],
    answer: '0.5',
    explanation: 'moles = mass / molar mass = 22 / 44 = 0.5 mol.',
    source: 'demo', sourceLabel: 'Demo · NEET pattern 2024', marks: 1,
  },
  {
    id: 'chm-14', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Concentration', pages: [9],
    exam: 'jee', year: 2023,
    text: 'Molarity of a solution that has 0.2 mol solute in 400 mL is —',
    options: ['0.4 M', '0.5 M', '0.8 M', '2 M'],
    answer: '0.5 M',
    explanation: 'M = 0.2 / 0.4 = 0.5 M.',
    source: 'demo', sourceLabel: 'Demo · JEE pattern 2023', marks: 2,
  },
  {
    id: 'chm-15', section: 'pyq', kind: 'numerical', difficulty: 'hard', topic: 'Stoichiometry', pages: [8, 9],
    exam: 'jee', year: 2022,
    text: 'How many grams of water form when 4 g of H₂ reacts with excess O₂?',
    options: ['18 g', '27 g', '36 g', '54 g'],
    answer: '36 g',
    explanation: '2H₂ + O₂ → 2H₂O; 4 g H₂ = 2 mol → 2 mol H₂O = 36 g.',
    source: 'demo', sourceLabel: 'Demo · JEE pattern 2022', marks: 3,
  },
  {
    id: 'chm-16', section: 'pyq', kind: 'short', difficulty: 'easy', topic: 'Laws of chemistry', pages: [3],
    exam: 'cbse', year: 2024,
    text: 'Why is the law of multiple proportions considered evidence for the atomic theory?',
    answer: 'It shows elements combine in simple whole-number ratios, consistent with atoms combining in fixed small numbers.',
    source: 'demo', sourceLabel: 'Demo · Board pattern 2024', marks: 2,
  },
  {
    id: 'chm-17', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Significant figures', pages: [10, 11],
    exam: 'jee', year: 2020,
    text: 'The result of 3.24 + 12.1 (with correct significant figures) is —',
    options: ['15.3', '15.34', '15.3̅4', '15'],
    answer: '15.3',
    explanation: 'In addition, the answer has the same decimal places as the least precise term (12.1 → one decimal) → 15.3.',
    source: 'demo', sourceLabel: 'Demo · JEE pattern 2020', marks: 2,
  },
];

/* ------------------------------------------------------------------ */
/* PHYSICS · Units and Measurements (ch 2 · 14 pages)                  */
/* ------------------------------------------------------------------ */
const PHYSICS: Seed[] = [
  {
    id: 'ph-1', section: 'important', kind: 'conceptual', difficulty: 'easy', topic: 'SI system', pages: [1, 2],
    text: 'Why are SI base units defined using fundamental constants (e.g., the speed of light) instead of physical artefacts?',
    answer: 'Constants like c are identical everywhere and never degrade, unlike a physical bar that expands with temperature or gets damaged — every laboratory reproduces the same standard.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'ph-2', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'SI system', pages: [1, 2],
    text: 'How many base SI units are there — and which is a base unit?',
    options: ['7 · Ampere', '6 · Joule', '7 · Newton', '8 · Volt'],
    answer: '7 · Ampere',
    explanation: 'The seven base units are metre, kilogram, second, ampere, kelvin, mole, candela.',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'ph-3', section: 'mcq', kind: 'mcq', difficulty: 'easy', topic: 'Supplementary units', pages: [2, 3],
    text: 'The radian and the steradian are —',
    options: [
      'SI base units',
      'Derived units with special names',
      'Supplementary (dimensionless) units',
      'Non-SI units',
    ],
    answer: 'Supplementary (dimensionless) units',
    explanation: 'Plane angle and solid angle are dimensionless supplementary units in the SI.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'ph-4', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Dimensional analysis', pages: [4],
    text: 'The dimensional formula of force is —',
    options: ['[M L T⁻²]', '[M L² T⁻²]', '[M L T²]', '[M L⁻¹ T⁻²]'],
    answer: '[M L T⁻²]',
    explanation: 'F = ma → M × (L T⁻²) = M L T⁻².',
    source: 'demo', sourceLabel: 'Demo · NCERT line', marks: 1,
  },
  {
    id: 'ph-5', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Measurement', pages: [4, 5],
    text: 'The parallax method is used to measure —',
    options: ['Distance of planets or stars', 'Mass of the Moon', 'Time period of a pendulum', 'Earth’s radius'],
    answer: 'Distance of planets or stars',
    explanation: 'Parallax uses the angular shift of a distant object viewed from two positions to compute distance.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'ph-6', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Measurement · instruments', pages: [5, 6],
    text: 'What is least count, and how is it found for a vernier calliper?',
    answer: 'Least count is the smallest measurement an instrument can resolve. For a vernier calliper, LC = 1 main scale division ÷ number of vernier divisions.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'ph-7', section: 'mcq', kind: 'numerical', difficulty: 'hard', topic: 'Measurement · instruments', pages: [6],
    text: 'The least count of a vernier calliper with 1 mm main-scale divisions and 50 vernier divisions is —',
    options: ['0.02 mm', '0.01 mm', '0.05 mm', '0.1 mm'],
    answer: '0.02 mm',
    explanation: 'LC = 1 mm / 50 = 0.02 mm.',
    source: 'demo', sourceLabel: 'Demo', marks: 2,
  },
  {
    id: 'ph-8', section: 'mcq', kind: 'mcq', difficulty: 'medium', topic: 'Significant figures', pages: [9, 10],
    text: 'A measurement records 3.50 cm using a scale of least count 0.1 cm. The significant figures are —',
    options: ['2', '3', '4', 'Cannot say'],
    answer: '3',
    explanation: 'The trailing zero is significant because it encodes measurement precision.',
    source: 'demo', sourceLabel: 'Demo', marks: 1,
  },
  {
    id: 'ph-9', section: 'important', kind: 'short', difficulty: 'medium', topic: 'Errors', pages: [7, 8],
    text: 'Distinguish systematic and random errors with one example each.',
    answer: 'Systematic errors follow a definite pattern and can be corrected (e.g., a wrongly zeroed instrument); random errors fluctuate irregularly (e.g., judgement while reading) and are reduced by averaging many readings.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'ph-10', section: 'mcq', kind: 'assertion', difficulty: 'medium', topic: 'Dimensional analysis', pages: [4],
    text: 'A: Dimensions decide whether a quantity is a vector or scalar.\nR: Scalars have only magnitude, vectors need direction too.',
    options: [
      'Both A and R are true and R explains A',
      'Both A and R are true but R does not explain A',
      'A is false but R is true',
      'Both are false',
    ],
    answer: 'A is false but R is true',
    explanation: 'Dimensions never settle vector vs scalar — work (scalar) and torque (vector) share M L² T⁻².',
    source: 'demo', sourceLabel: 'Demo · assertion', marks: 2,
  },
  {
    id: 'ph-11', section: 'important', kind: 'short', difficulty: 'hard', topic: 'Errors', pages: [8],
    text: 'A sphere’s radius is measured as (2.0 ± 0.1) cm. Estimate the percentage error in its volume.',
    answer: 'V ∝ r³, so ΔV/V = 3 Δr/r = 3 × (0.1/2.0) = 0.15 → 15%.',
    explanation: 'For a power r³, the relative error is tripled.',
    source: 'demo', sourceLabel: 'Demo', marks: 3,
  },
  {
    id: 'ph-12', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'Dimensional analysis', pages: [4],
    exam: 'neet', year: 2023,
    text: 'Dimensions of energy are the same as those of —',
    options: ['Force × distance', 'Force / distance', 'Power × time²', 'Momentum × time'],
    answer: 'Force × distance',
    explanation: 'Work = force × distance and energy share dimensions M L² T⁻².',
    source: 'demo', sourceLabel: 'Demo · NEET pattern 2023', marks: 1,
  },
  {
    id: 'ph-13', section: 'pyq', kind: 'mcq', difficulty: 'medium', topic: 'SI system', pages: [1, 2],
    exam: 'jee', year: 2024,
    text: 'Which SI base unit measures the amount of substance?',
    options: ['Candela', 'Mole', 'Kelvin', 'Ampere'],
    answer: 'Mole',
    explanation: 'The mole is the SI base unit for amount of substance.',
    source: 'demo', sourceLabel: 'Demo · JEE pattern 2024', marks: 1,
  },
  {
    id: 'ph-14', section: 'pyq', kind: 'short', difficulty: 'medium', topic: 'Errors', pages: [7],
    exam: 'cbse', year: 2022,
    text: 'What are absolute and relative errors? How is relative error reported as a percentage?',
    answer: 'Absolute error is |true value − measured value|; relative error is absolute error ÷ true value, and percentage error is that ratio × 100.',
    source: 'demo', sourceLabel: 'Demo · Board pattern 2022', marks: 3,
  },
  {
    id: 'ph-15', section: 'pyq', kind: 'numerical', difficulty: 'hard', topic: 'Measurement · instruments', pages: [6],
    exam: 'jee', year: 2021,
    text: 'A screw gauge has 100 divisions on its circular scale and 1 mm pitch. Its least count is —',
    options: ['0.01 mm', '0.001 cm', '0.1 mm', '1 µm'],
    answer: '0.001 cm',
    explanation: 'LC = pitch / circular divisions = 1 mm / 100 = 0.01 mm = 0.001 cm.',
    source: 'demo', sourceLabel: 'Demo · JEE pattern 2021', marks: 2,
  },
];

/* Unmapped, subject-level demo PYQ items (explorer shows them under
   “All chapters” for the subject; never attached to a reader page). */
const GENERAL_PYQS: Seed[] = [
  {
    id: 'gn-1', section: 'pyq', kind: 'mcq', difficulty: 'easy', topic: 'Units & base units', pages: [], chapterId: '', subject: 'physics', exam: 'jee', year: 2020,
    text: 'Which pair consists only of SI base units?',
    options: ['kg, m, s, A', 'N, J, W, Pa', 'V, Ω, C, Hz', 'g, cm, s, cal'],
    answer: 'kg, m, s, A',
    explanation: 'Newton, joule, watt, pascal, volt, ohm, coulomb and hertz are all derived units.',
    source: 'demo', sourceLabel: 'Demo · JEE pattern 2020', marks: 1,
  },
];

/* ------------------------------------------------------------------ */

const withChapter = (chapterId: string, rows: Seed[]): Seed[] =>
  rows.map((r) => ({ ...r, chapterId }));

export const QUESTION_BANK: StudyQuestion[] = [
  ...withChapter('living-world', LIVING_WORLD),
  ...withChapter('biological-classification', CLASSIFICATION),
  ...withChapter('basic-concepts', CHEMISTRY),
  ...withChapter('units-measurements', PHYSICS),
  ...GENERAL_PYQS,
].map(demo);

export type PageContent = {
  important: StudyQuestion[];
  mcq: StudyQuestion[];
  pyq: StudyQuestion[];
};

/** Content attached to one exact page of a chapter. */
export function getPageContent(
  chapterId: string,
  pageNumber: number,
): PageContent {
  const rows = QUESTION_BANK.filter(
    (q) => q.chapterId === chapterId && q.pages.includes(pageNumber),
  );
  return {
    important: rows.filter((q) => q.section === 'important'),
    mcq: rows.filter((q) => q.section === 'mcq'),
    pyq: rows.filter((q) => q.section === 'pyq'),
  };
}

/** All content rows of a chapter (used by chapter drill + quiz config). */
export function bankForChapter(chapterId: string): StudyQuestion[] {
  return QUESTION_BANK.filter((q) => q.chapterId === chapterId);
}

export function chapterBankSize(chapterId: string): number {
  return bankForChapter(chapterId).length;
}

/** PYQ items across the catalogue (chapter-level + general). */
export const PYQ_BANK: StudyQuestion[] = QUESTION_BANK.filter(
  (q) => q.section === 'pyq',
);

/** Distinct PYQ exams / years present in the demo dataset. */
export const PYQ_EXAMS = ['jee', 'neet', 'cbse', 'icse', 'state'] as const;
export const PYQ_YEAR_MIN = 2000;
export const PYQ_YEAR_MAX = 2026;
export const PYQ_YEARS_PRESENT = Array.from(
  new Set(PYQ_BANK.map((q) => q.year).filter((y): y is number => Boolean(y))),
).sort((a, b) => b - a);

/** Question kinds by section for quick reference. */
export const SECTION_LABEL: Record<ReaderSection, string> = {
  important: 'Important',
  mcq: 'MCQs',
  pyq: 'PYQs',
  concept: 'Concepts',
};
