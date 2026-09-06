/* ============================================================
   Important diagrams — demo dataset mirroring the `diagrams`
   table. Every diagram image is a REAL NCERT page render; the
   record points to the figure page. Labels/captions are part of
   diagram QA (delivered with the content drop) — the dataset is
   explicit about what exists today.
   ============================================================ */

import type { DiagramItem } from '../types/study';

export const DIAGRAMS: DiagramItem[] = [
  {
    id: 'dg-taxa-hierarchy',
    bookId: 'bio-11',
    title: 'Taxonomic hierarchy — categories of classification',
    subject: 'biology',
    chapterId: 'living-world',
    pageNumber: 4,
    imageUrl: '/assets/pages/bio-11-living-world/p004.jpg',
    caption: 'NCERT Fig. — “Taxonomical Hierarchy”. Real page 4 of The Living World.',
    labels: [
      { id: 'h1', text: 'Species → Genus → Family (text sections, top half)', x: 50, y: 26 },
      { id: 'h2', text: 'Order → Class → Phylum → Kingdom', x: 50, y: 44 },
      { id: 'h3', text: 'Higher category examples (Man, Housefly, Mango)', x: 50, y: 66 },
    ],
    examRelevance: 'NEET & Boards frequently ask hierarchy ordering and example placement.',
    isDemo: true,
  },
  {
    id: 'dg-fungi-types',
    bookId: 'bio-11',
    title: 'Kingdom Fungi — representative types',
    subject: 'biology',
    chapterId: 'biological-classification',
    pageNumber: 8,
    imageUrl: '/assets/pages/bio-11-classification/p008.jpg',
    caption: 'NCERT Fig. 2.2 — variety of fungi. Real page 8 of Biological Classification.',
    labels: [
      { id: 'f1', text: 'Phycomycetes examples (Rhizopus)', x: 50, y: 30 },
      { id: 'f2', text: 'Ascomycetes (Penicillium, Aspergillus)', x: 50, y: 55 },
    ],
    examRelevance: 'Match-the-following on fungal classes appears across NEET years.',
    isDemo: true,
  },
  {
    id: 'dg-diatoms',
    bookId: 'bio-11',
    title: 'Diatoms — silicified cell walls',
    subject: 'biology',
    chapterId: 'biological-classification',
    pageNumber: 5,
    imageUrl: '/assets/pages/bio-11-classification/p005.jpg',
    caption: 'Real page 5 of Biological Classification (Protista — diatoms).',
    labels: [{ id: 'd1', text: 'Diatom shells (frustule) discussion', x: 50, y: 40 }],
    examRelevance: 'Diatomaceous earth & silica walls are a recurring NEET fact.',
    isDemo: true,
  },
  {
    id: 'dg-vernier',
    bookId: 'phys-11',
    title: 'Measuring length — vernier callipers',
    subject: 'physics',
    chapterId: 'units-measurements',
    pageNumber: 6,
    imageUrl: '/assets/pages/phys-11-units/p006.jpg',
    caption: 'Real page 6 of Units and Measurements (instruments of length).',
    labels: [{ id: 'v1', text: 'Vernier calliper description & least count', x: 50, y: 42 }],
    examRelevance: 'JEE numericals on least count appear regularly.',
    isDemo: true,
  },
];

export const DEMO_LABEL_NOTE =
  'Diagram region labels are being QA-verified figure-by-figure. The viewer below is live; labelled hotspots arrive with the QA content drop.';
