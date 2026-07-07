export const quoteConfig = {
  whatsappBase: 'https://wa.me/593996583089',
  basePrices: {
    casa: 35,
    oficina: 45,
    empresa: 60,
  },
  sizeAdjustments: {
    pequeno: 0,
    mediano: 18,
    grande: 38,
  },
  materialAdjustments: {
    incluidos: 16,
    propios: 0,
  },
  frequencyDiscounts: {
    puntual: 1,
    semanal: 0.88,
    quincenal: 0.93,
    mensual: 0.97,
  },
};

export const quoteSteps = [
  {
    id: 'space',
    label: 'Tipo de espacio',
    question: '¿Qué espacio necesitas limpiar?',
    options: [
      { value: 'casa', label: 'Casa', detail: 'Hogar, departamento o área residencial.' },
      { value: 'oficina', label: 'Oficina', detail: 'Espacios de trabajo, salas y zonas comunes.' },
      { value: 'empresa', label: 'Empresa', detail: 'Local, consultorio o espacio comercial.' },
    ],
  },
  {
    id: 'size',
    label: 'Tamaño',
    question: '¿Qué tamaño describe mejor el espacio?',
    options: [
      { value: 'pequeno', label: 'Pequeño', detail: 'Hasta 2 habitaciones o área compacta.' },
      { value: 'mediano', label: 'Mediano', detail: 'Espacio familiar u oficina regular.' },
      { value: 'grande', label: 'Grande', detail: 'Varias áreas, local amplio o alta circulación.' },
    ],
  },
  {
    id: 'materials',
    label: 'Materiales',
    question: '¿Quieres incluir materiales de limpieza?',
    options: [
      { value: 'incluidos', label: 'Con materiales', detail: 'NIVO lleva productos básicos para el servicio.' },
      { value: 'propios', label: 'Sin materiales', detail: 'Usamos los productos disponibles en tu espacio.' },
    ],
  },
  {
    id: 'frequency',
    label: 'Frecuencia',
    question: '¿Con qué frecuencia necesitas el servicio?',
    options: [
      { value: 'puntual', label: 'Una vez', detail: 'Limpieza puntual o de prueba.' },
      { value: 'semanal', label: 'Semanal', detail: 'Mantenimiento frecuente.' },
      { value: 'quincenal', label: 'Quincenal', detail: 'Rutina balanceada.' },
      { value: 'mensual', label: 'Mensual', detail: 'Apoyo periódico.' },
    ],
  },
  {
    id: 'city',
    label: 'Ciudad',
    question: '¿En qué ciudad estás?',
    options: [
      { value: 'Ibarra', label: 'Ibarra', detail: 'Cobertura urbana y zonas cercanas.' },
      { value: 'Atuntaqui', label: 'Atuntaqui', detail: 'Coordinación según disponibilidad.' },
      { value: 'Cotacachi', label: 'Cotacachi', detail: 'Coordinación según disponibilidad.' },
      { value: 'Otavalo', label: 'Otavalo', detail: 'Coordinación según disponibilidad.' },
    ],
  },
];
