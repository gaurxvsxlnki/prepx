/* ============================================================
   Flashcards — demo dataset mirroring the `flashcards` table.
   Rows map to chapter pages so the reader's Concept tab shows
   only cards relevant to the page being read.
   All rows are DEMO (self-authored from the textbook content).
   ============================================================ */

import type { StudyFlashcard } from '../types/study';

export const FLASHCARDS: StudyFlashcard[] = [
  /* Living World */
  { id: 'fc-lw-1', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [3], front: 'Taxonomy', back: 'The science of identifying, naming and classifying organisms.', tag: 'terms', isDemo: true },
  { id: 'fc-lw-2', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [3], front: 'Nomenclature', back: 'The standardised naming of organisms, giving each a unique scientific name.', tag: 'terms', isDemo: true },
  { id: 'fc-lw-3', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [4], front: 'ICBN / ICZN', back: 'International Codes for Botanical / Zoological Nomenclature — the rule books for scientific names.', tag: 'terms', isDemo: true },
  { id: 'fc-lw-4', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [4], front: 'Herbarium', back: 'A storehouse of dried, pressed plant specimens on sheets carrying full label data.', tag: 'aids', isDemo: true },
  { id: 'fc-lw-5', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [5], front: 'Species', back: 'The basic unit of classification: interbreeding natural populations producing fertile offspring.', tag: 'hierarchy', isDemo: true },
  { id: 'fc-lw-6', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [6], front: 'Taxonomic hierarchy (order)', back: 'Species → Genus → Family → Order → Class → Phylum/Division → Kingdom.', tag: 'hierarchy', isDemo: true },
  { id: 'fc-lw-7', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [8], front: 'Taxonomic key', back: 'An analytical aid of couplets — contrasting characters where accepting one rejects the other.', tag: 'aids', isDemo: true },
  { id: 'fc-lw-8', deckId: 'bio-taxonomy', chapterId: 'living-world', subject: 'biology', pages: [2], front: 'Systematics', back: 'Classification plus evolutionary relationships — the broader framework of ordering organisms.', tag: 'terms', isDemo: true },

  /* Biological classification */
  { id: 'fc-bc-1', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [2], front: 'Whittaker’s five kingdoms', back: 'Monera, Protista, Fungi, Plantae, Animalia (1969).', tag: 'kingdoms', isDemo: true },
  { id: 'fc-bc-2', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [3, 4], front: 'Archaebacteria', back: 'Prokaryotes in harsh habitats: halophiles (salt), thermoacidophiles (heat + acid), methanogens (marshes, produce methane).', tag: 'monera', isDemo: true },
  { id: 'fc-bc-3', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [4], front: 'Mycoplasma', back: 'Smallest known free-living cells; no cell wall; can survive without oxygen.', tag: 'monera', isDemo: true },
  { id: 'fc-bc-4', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [4], front: 'Cyanobacteria', back: 'Photosynthetic autotrophs (blue-green algae) — some fix atmospheric nitrogen.', tag: 'monera', isDemo: true },
  { id: 'fc-bc-5', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [5], front: 'Diatoms', back: 'Protists with silicified frustules; deposits form diatomaceous earth.', tag: 'protista', isDemo: true },
  { id: 'fc-bc-6', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [7], front: 'Slime moulds', back: 'Saprophytic protists with amoeboid movement; form fruiting bodies in adverse conditions.', tag: 'protista', isDemo: true },
  { id: 'fc-bc-7', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [8], front: 'Phycomycetes', back: 'Lower fungi — e.g., Rhizopus; aseptate hyphae; found in damp places as saprophytes/parasites.', tag: 'fungi', isDemo: true },
  { id: 'fc-bc-8', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [9], front: 'Basidiomycetes', back: 'Mushrooms, bracket fungi, puffballs, rusts and smuts — reproduce via basidiospores.', tag: 'fungi', isDemo: true },
  { id: 'fc-bc-9', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [9], front: 'Lichen', back: 'Symbiosis of an alga (photosynthesis) and a fungus (shelter + nutrients).', tag: 'symbiosis', isDemo: true },
  { id: 'fc-bc-10', deckId: 'bio-kingdom', chapterId: 'biological-classification', subject: 'biology', pages: [10], front: 'Viruses / viroids / prions', back: 'Viruses: DNA/RNA in a protein coat. Viroids (Diener): naked RNA. Prions: infectious proteins.', tag: 'viruses', isDemo: true },

  /* Chemistry — basic concepts */
  { id: 'fc-chm-1', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [3], front: 'Law of conservation of mass', back: 'Mass is neither created nor destroyed in a chemical reaction (Lavoisier).', tag: 'laws', isDemo: true },
  { id: 'fc-chm-2', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [3], front: 'Law of definite proportions', back: 'A compound always contains the same elements in fixed proportion by mass (Proust).', tag: 'laws', isDemo: true },
  { id: 'fc-chm-3', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [4], front: 'Law of multiple proportions', back: 'Two elements can combine in different simple whole-number ratios (e.g., H₂O vs H₂O₂).', tag: 'laws', isDemo: true },
  { id: 'fc-chm-4', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [5], front: 'Mole', back: 'Amount containing Avogadro’s number (6.022 × 10²³) of entities — atoms, molecules or ions.', tag: 'mole', isDemo: true },
  { id: 'fc-chm-5', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [7], front: 'Molarity (M)', back: 'moles of solute ÷ litres of solution — temperature dependent because volume is.', tag: 'mole', isDemo: true },
  { id: 'fc-chm-6', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [7], front: 'Molality (m)', back: 'moles of solute ÷ kg of solvent — mass-based, so temperature independent.', tag: 'mole', isDemo: true },
  { id: 'fc-chm-7', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [8], front: 'Empirical formula', back: 'The simplest whole-number ratio of atoms in a compound (e.g., CH₂O).', tag: 'formulas', isDemo: true },
  { id: 'fc-chm-8', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [8], front: 'Molecular formula', back: 'Actual number of atoms: (empirical formula)ₙ where n = molar mass ÷ empirical mass.', tag: 'formulas', isDemo: true },
  { id: 'fc-chm-9', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [8, 9], front: 'Limiting reagent', back: 'The reactant fully consumed first; it decides the maximum product formed.', tag: 'stoich', isDemo: true },
  { id: 'fc-chm-10', deckId: 'chem-formulas', chapterId: 'basic-concepts', subject: 'chemistry', pages: [10], front: 'Significant figures', back: 'Meaningful digits of a measurement: leading zeros don’t count; trailing zeros after the decimal do.', tag: 'measurement', isDemo: true },

  /* Physics — units */
  { id: 'fc-ph-1', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [1, 2], front: 'Seven SI base units', back: 'Metre, kilogram, second, ampere, kelvin, mole, candela.', tag: 'si', isDemo: true },
  { id: 'fc-ph-2', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [2, 3], front: 'Supplementary units', back: 'Radian (plane angle) and steradian (solid angle) — dimensionless.', tag: 'si', isDemo: true },
  { id: 'fc-ph-3', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [4], front: 'Dimensional formula', back: 'Expression of a quantity in M, L, T… — e.g., force = [M L T⁻²].', tag: 'dimensions', isDemo: true },
  { id: 'fc-ph-4', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [4, 5], front: 'Parallax method', back: 'Distance measured from the angular shift of a distant object viewed from two separated points.', tag: 'length', isDemo: true },
  { id: 'fc-ph-5', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [5, 6], front: 'Least count', back: 'Smallest measurement an instrument resolves — vernier: 1 MSD ÷ number of vernier divisions.', tag: 'length', isDemo: true },
  { id: 'fc-ph-6', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [6, 7], front: 'Vernier calliper LC', back: 'LC = 1 main-scale division ÷ N vernier divisions (e.g., 1 mm ÷ 50 = 0.02 mm).', tag: 'length', isDemo: true },
  { id: 'fc-ph-7', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [7], front: 'Systematic vs random error', back: 'Systematic: definite pattern, correctable (calibration). Random: fluctuates, reduced by averaging.', tag: 'errors', isDemo: true },
  { id: 'fc-ph-8', deckId: 'phys-units', chapterId: 'units-measurements', subject: 'physics', pages: [8], front: 'Propagation: r³ error', back: 'If V ∝ r³, then relative error in V = 3 × (relative error in r).', tag: 'errors', isDemo: true },
];

export function flashcardsForChapter(chapterId: string): StudyFlashcard[] {
  return FLASHCARDS.filter((f) => f.chapterId === chapterId);
}

/** Concept flashcards attached to one exact page. */
export function flashcardsForPage(
  chapterId: string,
  pageNumber: number,
): StudyFlashcard[] {
  return FLASHCARDS.filter(
    (f) => f.chapterId === chapterId && f.pages.includes(pageNumber),
  );
}

export function flashcardsForDeck(deckId: string): StudyFlashcard[] {
  return FLASHCARDS.filter((f) => f.deckId === deckId);
}

/** Derived deck catalogue (counts come from the dataset). */
export function deckCatalogue() {
  const map = new Map<string, { deckId: string; chapterId: string; subject: StudyFlashcard['subject']; total: number }>();
  for (const f of FLASHCARDS) {
    const cur = map.get(f.deckId) ?? { deckId: f.deckId, chapterId: f.chapterId, subject: f.subject, total: 0 };
    cur.total += 1;
    map.set(f.deckId, cur);
  }
  return Array.from(map.values());
}
