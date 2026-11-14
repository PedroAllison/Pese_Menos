// Banco de alimentos aproximado (valores médios por 100 g / 100 ml – base TACO/USDA, arredondados)
export type Category = 'proteina' | 'carboidrato' | 'salada' | 'fruta' | 'laticinio' | 'gordura' | 'bebida' | 'doce' | 'lanche';

export interface Food {
  id: string;
  name: string;
  category: Category;
  kcal: number; // por 100 g ou 100 ml
  protein: number;
  carbs: number;
  fat: number;
  liquid?: boolean;
  tags?: string[]; // alérgenos / tipos: gluten, lactose, ovo, amendoim, frutos_do_mar, soja, castanhas, acucar, fritura, ultraprocessado
}

export interface Measure { id: string; label: string; grams: number; }

// Medidas caseiras médias (g ou ml)
export const MEASURES: Measure[] = [
  { id: 'g', label: 'gramas (balança)', grams: 1 },
  { id: 'colher_cha', label: 'colher de chá', grams: 5 },
  { id: 'colher_sobremesa', label: 'colher de sobremesa', grams: 10 },
  { id: 'colher_sopa', label: 'colher de sopa', grams: 15 },
  { id: 'colher_servir', label: 'colher de servir / arroz', grams: 45 },
  { id: 'concha', label: 'concha média', grams: 100 },
  { id: 'escumadeira', label: 'escumadeira', grams: 60 },
  { id: 'unidade_p', label: 'unidade pequena', grams: 50 },
  { id: 'unidade', label: 'unidade média', grams: 100 },
  { id: 'unidade_g', label: 'unidade grande', grams: 150 },
  { id: 'fatia', label: 'fatia', grams: 25 },
  { id: 'file', label: 'filé / bife médio', grams: 120 },
  { id: 'prato_raso', label: 'prato raso (folhas)', grams: 40 },
  { id: 'xicara', label: 'xícara', grams: 160 },
  { id: 'copo', label: 'copo (200 ml)', grams: 200 },
  { id: 'copo_g', label: 'copo grande (300 ml)', grams: 300 },
  { id: 'lata', label: 'lata (350 ml)', grams: 350 },
  { id: 'garrafa', label: 'garrafa (500 ml)', grams: 500 },
];

export const FOODS: Food[] = [
  // Proteínas
  { id: 'frango_grelhado', name: 'Peito de frango grelhado', category: 'proteina', kcal: 159, protein: 32, carbs: 0, fat: 2.5 },
  { id: 'frango_frito', name: 'Frango frito', category: 'proteina', kcal: 250, protein: 27, carbs: 6, fat: 13, tags: ['fritura', 'gluten'] },
  { id: 'carne_moida', name: 'Carne moída refogada', category: 'proteina', kcal: 212, protein: 27, carbs: 0, fat: 11 },
  { id: 'bife_patinho', name: 'Bife de patinho grelhado', category: 'proteina', kcal: 219, protein: 36, carbs: 0, fat: 7 },
  { id: 'picanha', name: 'Picanha assada', category: 'proteina', kcal: 289, protein: 26, carbs: 0, fat: 20 },
  { id: 'porco_lombo', name: 'Lombo de porco assado', category: 'proteina', kcal: 210, protein: 32, carbs: 0, fat: 8 },
  { id: 'linguica', name: 'Linguiça calabresa', category: 'proteina', kcal: 296, protein: 16, carbs: 2, fat: 25, tags: ['ultraprocessado'] },
  { id: 'tilapia', name: 'Tilápia grelhada', category: 'proteina', kcal: 128, protein: 26, carbs: 0, fat: 2.7 },
  { id: 'salmao', name: 'Salmão grelhado', category: 'proteina', kcal: 208, protein: 22, carbs: 0, fat: 13 },
  { id: 'atum', name: 'Atum em lata (água)', category: 'proteina', kcal: 116, protein: 26, carbs: 0, fat: 1 },
  { id: 'camarao', name: 'Camarão cozido', category: 'proteina', kcal: 99, protein: 24, carbs: 0, fat: 0.3, tags: ['frutos_do_mar'] },
  { id: 'ovo_cozido', name: 'Ovo cozido (unid ≈ 50 g)', category: 'proteina', kcal: 146, protein: 13, carbs: 0.6, fat: 9.5, tags: ['ovo'] },
  { id: 'ovo_frito', name: 'Ovo frito', category: 'proteina', kcal: 240, protein: 15, carbs: 1, fat: 19, tags: ['ovo', 'fritura'] },
  { id: 'omelete', name: 'Omelete simples', category: 'proteina', kcal: 154, protein: 11, carbs: 1, fat: 12, tags: ['ovo'] },
  { id: 'tofu', name: 'Tofu', category: 'proteina', kcal: 76, protein: 8, carbs: 2, fat: 4.8, tags: ['soja'] },
  { id: 'whey', name: 'Whey protein (pó)', category: 'proteina', kcal: 400, protein: 80, carbs: 8, fat: 6, tags: ['lactose'] },
  // Carboidratos
  { id: 'arroz_branco', name: 'Arroz branco cozido', category: 'carboidrato', kcal: 128, protein: 2.5, carbs: 28, fat: 0.2 },
  { id: 'arroz_integral', name: 'Arroz integral cozido', category: 'carboidrato', kcal: 124, protein: 2.6, carbs: 26, fat: 1 },
  { id: 'feijao', name: 'Feijão carioca cozido', category: 'carboidrato', kcal: 76, protein: 4.8, carbs: 13.6, fat: 0.5 },
  { id: 'feijoada', name: 'Feijoada', category: 'carboidrato', kcal: 117, protein: 8.7, carbs: 11.6, fat: 6.5 },
  { id: 'macarrao', name: 'Macarrão cozido', category: 'carboidrato', kcal: 157, protein: 5.8, carbs: 31, fat: 0.9, tags: ['gluten'] },
  { id: 'batata_cozida', name: 'Batata cozida', category: 'carboidrato', kcal: 52, protein: 1.2, carbs: 12, fat: 0 },
  { id: 'batata_frita', name: 'Batata frita', category: 'carboidrato', kcal: 312, protein: 3.4, carbs: 41, fat: 15, tags: ['fritura'] },
  { id: 'batata_doce', name: 'Batata-doce cozida', category: 'carboidrato', kcal: 77, protein: 0.6, carbs: 18, fat: 0.1 },
  { id: 'mandioca', name: 'Mandioca cozida', category: 'carboidrato', kcal: 125, protein: 0.6, carbs: 30, fat: 0.3 },
  { id: 'pao_frances', name: 'Pão francês (unid ≈ 50 g)', category: 'carboidrato', kcal: 300, protein: 8, carbs: 58, fat: 3.1, tags: ['gluten'] },
  { id: 'pao_integral', name: 'Pão integral (fatia ≈ 25 g)', category: 'carboidrato', kcal: 253, protein: 9.4, carbs: 50, fat: 3.7, tags: ['gluten'] },
  { id: 'tapioca', name: 'Tapioca (goma)', category: 'carboidrato', kcal: 240, protein: 0, carbs: 60, fat: 0 },
  { id: 'cuscuz', name: 'Cuscuz de milho', category: 'carboidrato', kcal: 113, protein: 2.2, carbs: 25, fat: 0.7 },
  { id: 'aveia', name: 'Aveia em flocos', category: 'carboidrato', kcal: 394, protein: 14, carbs: 67, fat: 8.5, tags: ['gluten'] },
  { id: 'farofa', name: 'Farofa', category: 'carboidrato', kcal: 406, protein: 2, carbs: 80, fat: 9 },
  { id: 'lasanha', name: 'Lasanha à bolonhesa', category: 'carboidrato', kcal: 165, protein: 9, carbs: 15, fat: 8, tags: ['gluten', 'lactose'] },
  // Saladas e legumes
  { id: 'alface', name: 'Alface', category: 'salada', kcal: 11, protein: 1.3, carbs: 1.7, fat: 0.2 },
  { id: 'tomate', name: 'Tomate', category: 'salada', kcal: 15, protein: 1.1, carbs: 3.1, fat: 0.2 },
  { id: 'cenoura', name: 'Cenoura crua', category: 'salada', kcal: 34, protein: 1.3, carbs: 7.7, fat: 0.2 },
  { id: 'brocolis', name: 'Brócolis cozido', category: 'salada', kcal: 25, protein: 2.1, carbs: 4.4, fat: 0.5 },
  { id: 'pepino', name: 'Pepino', category: 'salada', kcal: 10, protein: 0.9, carbs: 2, fat: 0 },
  { id: 'abobrinha', name: 'Abobrinha refogada', category: 'salada', kcal: 30, protein: 1.1, carbs: 4.4, fat: 1 },
  { id: 'salada_mista', name: 'Salada mista (sem molho)', category: 'salada', kcal: 18, protein: 1, carbs: 3, fat: 0.2 },
  { id: 'azeite', name: 'Azeite de oliva', category: 'gordura', kcal: 884, protein: 0, carbs: 0, fat: 100 },
  { id: 'manteiga', name: 'Manteiga', category: 'gordura', kcal: 726, protein: 0.4, carbs: 0, fat: 82, tags: ['lactose'] },
  { id: 'requeijao', name: 'Requeijão', category: 'gordura', kcal: 257, protein: 9.6, carbs: 2.4, fat: 23, tags: ['lactose'] },
  { id: 'amendoim', name: 'Pasta de amendoim', category: 'gordura', kcal: 588, protein: 25, carbs: 20, fat: 50, tags: ['amendoim'] },
  { id: 'castanha', name: 'Castanha-do-pará', category: 'gordura', kcal: 643, protein: 14.5, carbs: 15, fat: 63, tags: ['castanhas'] },
  // Frutas
  { id: 'banana', name: 'Banana (unid ≈ 100 g)', category: 'fruta', kcal: 98, protein: 1.3, carbs: 26, fat: 0.1 },
  { id: 'maca', name: 'Maçã (unid ≈ 130 g)', category: 'fruta', kcal: 56, protein: 0.3, carbs: 15, fat: 0 },
  { id: 'mamao', name: 'Mamão', category: 'fruta', kcal: 40, protein: 0.5, carbs: 10, fat: 0.1 },
  { id: 'laranja', name: 'Laranja', category: 'fruta', kcal: 37, protein: 1, carbs: 9, fat: 0.1 },
  { id: 'morango', name: 'Morango', category: 'fruta', kcal: 30, protein: 0.9, carbs: 6.8, fat: 0.3 },
  { id: 'abacate', name: 'Abacate', category: 'fruta', kcal: 96, protein: 1.2, carbs: 6, fat: 8.4 },
  { id: 'melancia', name: 'Melancia', category: 'fruta', kcal: 33, protein: 0.9, carbs: 8, fat: 0 },
  { id: 'acai', name: 'Açaí na tigela (com xarope)', category: 'fruta', kcal: 247, protein: 1.5, carbs: 36, fat: 11, tags: ['acucar'] },
  // Laticínios
  { id: 'leite_integral', name: 'Leite integral', category: 'laticinio', kcal: 61, protein: 3.2, carbs: 4.7, fat: 3.3, liquid: true, tags: ['lactose'] },
  { id: 'leite_desnatado', name: 'Leite desnatado', category: 'laticinio', kcal: 35, protein: 3.4, carbs: 4.9, fat: 0.1, liquid: true, tags: ['lactose'] },
  { id: 'iogurte_natural', name: 'Iogurte natural', category: 'laticinio', kcal: 61, protein: 4, carbs: 4.7, fat: 3, tags: ['lactose'] },
  { id: 'queijo_minas', name: 'Queijo minas frescal', category: 'laticinio', kcal: 264, protein: 17, carbs: 3, fat: 20, tags: ['lactose'] },
  { id: 'queijo_mussarela', name: 'Queijo muçarela', category: 'laticinio', kcal: 330, protein: 22, carbs: 3, fat: 25, tags: ['lactose'] },
  // Lanches / doces
  { id: 'pizza', name: 'Pizza (fatia ≈ 110 g)', category: 'lanche', kcal: 266, protein: 11, carbs: 33, fat: 10, tags: ['gluten', 'lactose', 'ultraprocessado'] },
  { id: 'hamburguer', name: 'Hambúrguer completo', category: 'lanche', kcal: 254, protein: 13, carbs: 24, fat: 12, tags: ['gluten', 'ultraprocessado'] },
  { id: 'coxinha', name: 'Coxinha', category: 'lanche', kcal: 290, protein: 9, carbs: 32, fat: 14, tags: ['gluten', 'fritura'] },
  { id: 'pao_queijo', name: 'Pão de queijo', category: 'lanche', kcal: 363, protein: 5, carbs: 34, fat: 24, tags: ['lactose', 'ovo'] },
  { id: 'biscoito_recheado', name: 'Biscoito recheado', category: 'doce', kcal: 472, protein: 6, carbs: 70, fat: 20, tags: ['gluten', 'acucar', 'ultraprocessado'] },
  { id: 'chocolate', name: 'Chocolate ao leite', category: 'doce', kcal: 540, protein: 7.2, carbs: 60, fat: 30, tags: ['lactose', 'acucar'] },
  { id: 'bolo', name: 'Bolo simples', category: 'doce', kcal: 330, protein: 5, carbs: 52, fat: 11, tags: ['gluten', 'ovo', 'acucar'] },
  { id: 'sorvete', name: 'Sorvete de massa', category: 'doce', kcal: 210, protein: 3.5, carbs: 25, fat: 11, tags: ['lactose', 'acucar'] },
  { id: 'acucar', name: 'Açúcar', category: 'doce', kcal: 387, protein: 0, carbs: 100, fat: 0, tags: ['acucar'] },
];

// Bebidas (aba de líquidos)
export interface Drink { id: string; name: string; kcalPer100ml: number; hydration: number; tags?: string[]; }
export const DRINKS: Drink[] = [
  { id: 'agua', name: 'Água', kcalPer100ml: 0, hydration: 1 },
  { id: 'agua_coco', name: 'Água de coco', kcalPer100ml: 22, hydration: 1 },
  { id: 'suco_natural', name: 'Suco natural (sem açúcar)', kcalPer100ml: 45, hydration: 0.9 },
  { id: 'suco_acucar', name: 'Suco com açúcar', kcalPer100ml: 70, hydration: 0.9, tags: ['acucar'] },
  { id: 'suco_caixinha', name: 'Suco de caixinha', kcalPer100ml: 55, hydration: 0.9, tags: ['acucar', 'ultraprocessado'] },
  { id: 'refri', name: 'Refrigerante', kcalPer100ml: 42, hydration: 0.8, tags: ['acucar', 'ultraprocessado'] },
  { id: 'refri_zero', name: 'Refrigerante zero', kcalPer100ml: 0, hydration: 0.8 },
  { id: 'cafe', name: 'Café sem açúcar', kcalPer100ml: 2, hydration: 0.8 },
  { id: 'cafe_acucar', name: 'Café com açúcar', kcalPer100ml: 35, hydration: 0.8, tags: ['acucar'] },
  { id: 'cha', name: 'Chá sem açúcar', kcalPer100ml: 1, hydration: 1 },
  { id: 'leite', name: 'Leite integral', kcalPer100ml: 61, hydration: 0.9, tags: ['lactose'] },
  { id: 'cerveja', name: 'Cerveja', kcalPer100ml: 43, hydration: 0.5 },
  { id: 'isotonico', name: 'Isotônico', kcalPer100ml: 24, hydration: 1 },
];

export const ALLERGENS = [
  { id: 'gluten', label: 'Glúten' },
  { id: 'lactose', label: 'Lactose' },
  { id: 'ovo', label: 'Ovo' },
  { id: 'amendoim', label: 'Amendoim' },
  { id: 'castanhas', label: 'Castanhas' },
  { id: 'frutos_do_mar', label: 'Frutos do mar' },
  { id: 'soja', label: 'Soja' },
];

export const findFood = (id: string) => FOODS.find(f => f.id === id);
export const findDrink = (id: string) => DRINKS.find(d => d.id === id);
