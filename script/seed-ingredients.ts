import { readFile } from "fs/promises";
import { db } from "../server/db";
import { ingredients } from "../shared/schema";

interface IngredientData {
  id: string;
  trade_name: string;
  inci_name: string;
  supplier: string;
  physical_form: string;
  function: string;
  chemical_class: string;
  charge: string;
  solubility: string;
  ph_min: number | null;
  ph_max: number | null;
  hlb: number | null;
  required_hlb: number | null;
  iodine_value: number | null;
  oxidation_risk: string;
  pka: number | null;
  process_temp: string;
  notes: string | null;
}

async function seedIngredients() {
  try {
    console.log("Reading seed data...");
    const seedData = JSON.parse(
      await readFile("shared/seed-ingredients.json", "utf-8")
    ) as IngredientData[];

    console.log(`Seeding ${seedData.length} ingredients...`);

    for (const ingredient of seedData) {
      await db
        .insert(ingredients)
        .values({
          id: ingredient.id,
          tradeName: ingredient.trade_name,
          inciName: ingredient.inci_name,
          supplier: ingredient.supplier,
          physicalForm: ingredient.physical_form,
          function: ingredient.function,
          chemicalClass: ingredient.chemical_class,
          charge: ingredient.charge,
          solubility: ingredient.solubility,
          phMin: ingredient.ph_min,
          phMax: ingredient.ph_max,
          hlb: ingredient.hlb,
          requiredHlb: ingredient.required_hlb,
          iodineValue: ingredient.iodine_value,
          oxidationRisk: ingredient.oxidation_risk,
          pka: ingredient.pka,
          processTemp: ingredient.process_temp,
          notes: ingredient.notes,
        })
        .onConflictDoUpdate({
          target: ingredients.id,
          set: {
            tradeName: ingredient.trade_name,
            inciName: ingredient.inci_name,
            supplier: ingredient.supplier,
            physicalForm: ingredient.physical_form,
            function: ingredient.function,
            chemicalClass: ingredient.chemical_class,
            charge: ingredient.charge,
            solubility: ingredient.solubility,
            phMin: ingredient.ph_min,
            phMax: ingredient.ph_max,
            hlb: ingredient.hlb,
            requiredHlb: ingredient.required_hlb,
            iodineValue: ingredient.iodine_value,
            oxidationRisk: ingredient.oxidation_risk,
            pka: ingredient.pka,
            processTemp: ingredient.process_temp,
            notes: ingredient.notes,
          },
        });
      console.log(`✓ Seeded: ${ingredient.trade_name} (${ingredient.id})`);
    }

    console.log(`\n✅ Successfully seeded ${seedData.length} ingredients!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ingredients:", error);
    process.exit(1);
  }
}

seedIngredients();
