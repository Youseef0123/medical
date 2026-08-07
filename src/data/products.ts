import type { Product } from "@/types";

/**
 * Real Pharmaceutical Products Data for Medisave.
 * Extracted accurately from Medisave Product List Presentation PDF.
 */
export const products: Product[] = [
  {
    slug: "orgistrok",
    name: "Orgistrok",
    ingredient: "Clopidogrel 75 mg",
    dosage: "75 mg — 30 tablets",
    category: "Cardiology",
    type: "Prescription",
    description: "مضاد للصفائح الدموية (Antiplatelet) يزيد سيولة الدم ويمنع التجلط وتكون الجلطات الضارة.",
    image: "/images/products/orgistrok.png",
  },
  {
    slug: "cipramaline",
    name: "Cipramaline",
    ingredient: "Escitalopram 10 mg",
    dosage: "10 mg — 20 tablets",
    category: "Mental Health",
    type: "Prescription",
    description: "مضاد اكتئاب فعال (SSRI) يُستخدم لعلاج الاكتئاب واضطرابات القلق والوسواس القهري.",
    image: "/images/products/cipramaline.png",
  },
  {
    slug: "quebolm",
    name: "Quebolm",
    ingredient: "Quetiapine Fumarate 25 mg / 100 mg",
    dosage: "25 mg / 100 mg — 20 tablets",
    category: "Mental Health",
    type: "Prescription",
    description: "مضاد ذهاني غير نمطي يُستخدم لعلاج الفصام واضطراب ثنائي القطب والاكتئاب الحاد.",
    image: "/images/products/quebolm.png",
  },
  {
    slug: "arilobe",
    name: "Arilobe",
    ingredient: "Aripiprazole 30 mg",
    dosage: "30 mg — 20 tablets",
    category: "Mental Health",
    type: "Prescription",
    description: "مضاد ذهاني غير نمطي يُستخدم لعلاج اضطراب ثنائي القطب والفصام بطريقة متوازنة.",
    image: "/images/products/arilobe.png",
  },
  {
    slug: "clozavitone",
    name: "Clozavitone",
    ingredient: "Clozapine 100 mg / 25 mg",
    dosage: "100 mg / 25 mg — 20 tablets",
    category: "Neurology",
    type: "Prescription",
    description: "مضاد ذهاني غير نمطي متقدم للفصام المقاوم للعلاج والاضطرابات الذهانية المصاحبة لمرضى باركنسون.",
    image: "/images/products/clozavitone.png",
  },
  {
    slug: "gincofar",
    name: "Gincofar",
    ingredient: "Ginkgo Biloba dry extract 40 mg",
    dosage: "40 mg — 20 tablets",
    category: "Neurology",
    type: "OTC",
    description: "مستخلص عشبي طبيعي يقوي الذاكرة، يقاوم الدوخة، يحسّن الدورة الدموية للمخ، ويحتوي على مضادات أكسدة تساعد في إبطاء تطور الزهايمر.",
    image: "/images/products/gincofar.png",
  },
];
