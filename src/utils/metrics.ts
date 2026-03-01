export function calculateSuggestedLimit(peso: number, altura: number): number {
  // Cálculo del IMC (Índice de Masa Corporal) según la OMS
  const alturaMetros = altura / 100;
  const imc = peso / (alturaMetros * alturaMetros);
  
  // La OMS y guías internacionales sugieren un máximo de 14 unidades estándar por semana
  // para consumo de bajo riesgo. Ajustamos esto basado en el IMC.
  let limiteBase = 10;

  if (imc < 18.5) {
    // Bajo peso: menor tolerancia
    limiteBase = 7;
  } else if (imc >= 18.5 && imc < 25) {
    // Peso normal
    limiteBase = 10;
  } else if (imc >= 25 && imc < 30) {
    // Sobrepeso: mayor volumen de distribución, pero posibles riesgos metabólicos
    limiteBase = 12;
  } else {
    // Obesidad: se reduce el límite sugerido por mayor riesgo de comorbilidades hepáticas
    limiteBase = 8;
  }

  // Ajuste fino por peso absoluto (capacidad de metabolización hepática)
  // Tomamos 70kg como referencia para el límite base
  const limiteCalculado = Math.round((peso / 70) * limiteBase);

  // Restringimos el límite entre 5 y 14 unidades semanales (recomendación de bajo riesgo)
  return Math.min(14, Math.max(5, limiteCalculado));
}
