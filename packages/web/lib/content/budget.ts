// Datele de buget din documentul FutureMinds. Conținut static — nu în DB.

export type Row = { label: string; cols: string[]; strong?: boolean }
export type Table = { caption: string; note?: string; head: string[]; rows: Row[] }

export const expenseTables: Table[] = [
  {
    caption: "Taxe de studii (doar pentru studenții la taxă)",
    note: "Taxele de școlarizare și de confirmare a locului se aplică doar studenților admiși la taxă.",
    head: ["Tip taxă", "UBB", "UTCN"],
    rows: [
      { label: "Taxa de admitere", cols: ["400 lei", "400 lei"] },
      { label: "Taxa de școlarizare", cols: ["3.000 – 5.000 lei", "4.200 – 5.100 lei"] },
      { label: "Alte taxe", cols: ["–", "300 lei (confirmare loc)"] },
      { label: "Total taxe / an", cols: ["3.400 – 5.400 lei", "4.900 – 5.800 lei"], strong: true },
    ],
  },
  {
    caption: "Cazare (calcul pe 10 luni)",
    head: ["Categorie", "Cost lunar", "Total / an"],
    rows: [
      { label: "Cămine de stat UBB", cols: ["140 – 350 lei", "1.400 – 3.500 lei"] },
      { label: "Cămine de stat UTCN", cols: ["260 – 356 lei", "2.700 – 3.660 lei"] },
      { label: "Cămine private", cols: ["750 – 1.400 lei", "7.500 – 14.000 lei"] },
    ],
  },
  {
    caption: "Masă (felul 1 + 2 + desert + băutură, 22 zile/lună, 10 luni)",
    head: ["Categorie", "Preț", "Total / an"],
    rows: [
      { label: "Cantine studențești", cols: ["15 – 30 lei / masă", "3.300 – 6.600 lei"] },
      { label: "Cantine locale", cols: ["30 – 50 lei / masă", "6.600 – 11.000 lei"] },
      { label: "Abonament UTCN (meniul zilei)", cols: ["300 lei / lună", "3.000 lei"] },
    ],
  },
  {
    caption: "Materiale didactice",
    note: "Laptop recomandat: procesor i7, 16GB RAM, SSD minim 256GB.",
    head: ["Articol", "Cost"],
    rows: [
      { label: "Laptop nou", cols: ["5.000 – 5.500 lei"] },
      { label: "Laptop second-hand", cols: ["3.800 – 4.500 lei"] },
      { label: "Mouse nou", cols: ["60 – 120 lei"] },
      { label: "Rechizite & materiale", cols: ["~1.000 lei / an"] },
      { label: "Total materiale / an", cols: ["4.860 – 6.620 lei"], strong: true },
    ],
  },
  {
    caption: "Cheltuieli de trai (zi cu zi, 10 luni)",
    head: ["Nivel de trai", "Cost / an"],
    rows: [
      { label: "Trai minim", cols: ["4.500 – 5.500 lei"] },
      { label: "Trai confortabil", cols: ["6.000 – 6.500 lei"] },
      { label: "Trai bun", cols: ["7.000 – 7.500 lei"] },
    ],
  },
]

// Ce include bursa FutureMinds — valoare de ~6.000 € / an.
export type Inclusion = { title: string; body: string }

export const scholarshipIncludes: Inclusion[] = [
  { title: "Cazare în cămin", body: "Plata integrală a căminului, pe toată durata studiilor." },
  { title: "Masă zilnică", body: "Mâncare în fiecare zi, la cantina studențească sau locală." },
  { title: "Bani de buzunar", body: "Sprijin lunar pentru cheltuielile de zi cu zi." },
  { title: "Taxe de studii", body: "Taxa de școlarizare acoperită integral, pentru locurile la taxă." },
  { title: "Laptop & materiale", body: "Laptop, mouse, rechizite și materialele didactice necesare." },
]
