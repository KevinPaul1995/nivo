export const quoteConfig = {
  whatsappBase: 'https://wa.me/593996583089',
  currency: '$',

  // Ajustado para Imbabura:
  // Evita servicios demasiado pequeños que no cubren traslado,
  // coordinación, desgaste de herramientas y tiempo muerto.
  minPrice: 15,

  // Redondeo comercial con medios dólares para extras pequeños como tendido de cama.
  rounding: 0.5,

  // Referencia local:
  // tareas simples cerca de $3/h y tareas difíciles cerca de $4/h.
  hourlyRateMin: 3,
  hourlyRateMax: 4,
  hourlyReference: 3.5,

  // Atuntaqui es la base operativa inicial.
  // NIVO opera con una cuadrilla base de dos personas.
  defaultTeamSize: 2,

  // Evita planificar jornadas demasiado largas para una sola persona.
  maxHoursPerPerson: 5,

  // No se suma margen de seguridad al tiempo mostrado.
  timeSafetyBufferMinutes: 0,

  businessName: 'NIVO',
};

export const serviceTypes = [
  {
    value: 'casa',
    label: 'Casa',
    shortLabel: 'Casa',
    detail: 'Limpieza residencial completa o por áreas.',
    basePrice: 2,
    multiplier: 1,
  },
  {
    value: 'departamento',
    label: 'Departamento',
    shortLabel: 'Departamento',
    detail: 'Ideal para espacios compactos o medianos.',
    basePrice: 1,
    multiplier: 0.96,
  },
  {
    value: 'oficina',
    label: 'Oficina',
    shortLabel: 'Oficina',
    detail: 'Puestos de trabajo, salas, baños y zonas comunes.',
    basePrice: 3,
    multiplier: 1.05,
  },
  {
    value: 'local',
    label: 'Local comercial',
    shortLabel: 'Local',
    detail: 'Tiendas, consultorios, vitrinas y áreas de atención.',
    basePrice: 4,
    multiplier: 1.08,
  },
  {
    value: 'mudanza',
    label: 'Mudanza / entrega',
    shortLabel: 'Mudanza',
    detail: 'Entrada o salida de inmueble con limpieza más detallada.',
    basePrice: 5,
    multiplier: 1.18,
  },
  {
    value: 'postobra',
    label: 'Post obra',
    shortLabel: 'Post obra',
    detail: 'Polvo fino, residuos ligeros y limpieza técnica inicial.',
    basePrice: 12,
    multiplier: 1.55,
  },
];

export const sizeOptions = [
  {
    value: 'compacto',
    label: 'Compacto',
    detail: 'Hasta 60 m² o pocas áreas.',
    multiplier: 0.92,
  },
  {
    value: 'medio',
    label: 'Mediano',
    detail: 'Entre 60 y 120 m² aproximadamente.',
    multiplier: 1,
  },
  {
    value: 'amplio',
    label: 'Amplio',
    detail: 'Entre 120 y 200 m² aproximadamente.',
    multiplier: 1.15,
  },
  {
    value: 'muyAmplio',
    label: 'Muy amplio',
    detail: 'Más de 200 m² o muchas áreas.',
    multiplier: 1.35,
  },
];

export const conditionOptions = [
  {
    value: 'mantenimiento',
    label: 'Ordenado',
    detail: 'Se limpió hace pocos días y solo necesita un repaso.',
    multiplier: 0.85,
  },
  {
    value: 'general',
    label: 'General',
    detail: 'Última limpieza hace 1 a 2 semanas, con uso normal.',
    multiplier: 1,
  },
  {
    value: 'profunda',
    label: 'Profunda',
    detail: 'Más de 2 semanas o zonas con polvo, manchas o grasa.',
    multiplier: 1.25,
  },
  {
    value: 'intensiva',
    label: 'Intensiva',
    detail: 'Más de un mes o suciedad fuerte acumulada.',
    multiplier: 1.55,
  },
];

export const frequencyOptions = [
  {
    value: 'puntual',
    label: 'Una sola vez',
    detail: 'Una visita única con el estado que selecciones.',
    multiplier: 1,
    visitCount: 1,
  },
  {
    value: 'quincenal',
    label: 'Quincenal',
    detail: 'Dos visitas: una por semana, pagadas por adelantado con descuento.',
    multiplier: 0.95,
    visitCount: 2,
    followUpCondition: 'general',
  },
  {
    value: 'mensual',
    label: 'Mensual',
    detail: 'Cuatro visitas: una por semana, pagadas por adelantado con mayor descuento.',
    multiplier: 0.9,
    visitCount: 4,
    followUpCondition: 'general',
  },
];

export const materialOptions = [
  {
    value: 'cliente',
    label: 'Usar materiales del cliente',
    detail: 'El cliente provee productos y herramientas.',
    price: -2,
  },
  {
    value: 'nivoBasico',
    label: 'NIVO básico',
    detail: 'Productos básicos para limpieza general.',
    price: 3,
  },
  {
    value: 'nivoCompleto',
    label: 'NIVO completo',
    detail: 'Productos, paños, herramientas y mejor cobertura.',
    price: 6,
  },
];

export const petCounters = [
  {
    id: 'dogs',
    label: 'Perros',
    detail: 'Cuenta perros que viven dentro o pasan mucho tiempo en casa.',
    unitLabel: 'perro',
    price: 1,
    minutes: 12,
    defaultValue: 0,
    max: 8,
  },
  {
    id: 'cats',
    label: 'Gatos',
    detail: 'Cuenta gatos, areneros o zonas donde suelen descansar.',
    unitLabel: 'gato',
    price: 1.25,
    minutes: 14,
    defaultValue: 0,
    max: 8,
  },
];

export const urgencyOptions = [
  {
    value: 'normal',
    label: 'Flexible',
    detail: 'Puede coordinarse según agenda.',
    multiplier: 1,
  },
  {
    value: 'pronto',
    label: 'Próximas 48 horas',
    detail: 'Requiere prioridad de agenda.',
    multiplier: 1.08,
  },
  {
    value: 'hoy',
    label: 'Hoy / urgente',
    detail: 'Sujeto a disponibilidad y recargo.',
    multiplier: 1.18,
  },
];

export const cityOptions = [
  {
    value: 'Atuntaqui',
    label: 'Atuntaqui',
    detail: 'Base operativa inicial de NIVO.',
    travelFee: 0,
  },
  {
    value: 'Natabuela',
    label: 'Natabuela',
    detail: 'Cobertura en Natabuela; indica el sector exacto.',
    travelFee: 2,
  },
  {
    value: 'Andrade Marín / San Roque',
    label: 'Andrade Marín / San Roque',
    detail: 'Sectores de Antonio Ante cercanos a Atuntaqui.',
    travelFee: 2,
  },
  {
    value: 'Ibarra',
    label: 'Ibarra',
    detail: 'Cobertura urbana y zonas cercanas.',
    travelFee: 5,
  },
  {
    value: 'Otavalo',
    label: 'Otavalo',
    detail: 'Movilización desde Atuntaqui hacia el sur de Imbabura.',
    travelFee: 5,
  },
  {
    value: 'Cotacachi',
    label: 'Cotacachi',
    detail: 'Movilización desde Atuntaqui hacia Cotacachi.',
    travelFee: 5,
  },
  {
    value: 'Urcuquí',
    label: 'Urcuquí',
    detail: 'Movilización más larga; confirmar sector exacto.',
    travelFee: 7,
  },
  {
    value: 'Otro sector de Imbabura',
    label: 'Otro sector de Imbabura',
    detail: 'Se confirma movilización antes de cerrar.',
    travelFee: 10,
  },
];

export const residentialCounters = [
  {
    id: 'bedrooms',
    label: 'Habitaciones',
    detail: 'Dormitorios o cuartos privados.',
    unitLabel: 'hab.',
    price: 2,
    minutes: 30,
    defaultValue: 2,
    max: 12,
  },
  {
    id: 'livingRooms',
    label: 'Sala',
    detail: 'Sala principal o sala de estar.',
    unitLabel: 'sala',
    price: 2,
    minutes: 25,
    defaultValue: 1,
    max: 8,
  },
  {
    id: 'diningRooms',
    label: 'Comedor',
    detail: 'Comedor independiente o integrado.',
    unitLabel: 'comedor',
    price: 2,
    minutes: 20,
    defaultValue: 1,
    max: 6,
  },
  {
    id: 'kitchens',
    label: 'Cocina',
    detail: 'Mesones, fregadero, exteriores y piso.',
    unitLabel: 'cocina',
    price: 4,
    minutes: 60,
    defaultValue: 1,
    max: 4,
  },
  {
    id: 'fullBathrooms',
    label: 'Baños completos',
    detail: 'Inodoro, ducha, lavamanos, espejo y piso.',
    unitLabel: 'baño',
    price: 4,
    minutes: 45,
    defaultValue: 1,
    max: 12,
  },
  {
    id: 'halfBathrooms',
    label: 'Medios baños',
    detail: 'Baño social sin ducha.',
    unitLabel: 'medio baño',
    price: 2,
    minutes: 25,
    defaultValue: 0,
    max: 10,
  },
  {
    id: 'laundryAreas',
    label: 'Área de máquinas',
    detail: 'Lavandería, lavadora, secadora o zona de lavado.',
    unitLabel: 'área',
    price: 2,
    minutes: 30,
    defaultValue: 0,
    max: 5,
  },
  {
    id: 'storageAreas',
    label: 'Bodega / cuarto de guardado',
    detail: 'Barrido, retiro de polvo visible y orden ligero de paso.',
    info: 'No incluye inventariar, mover carga pesada ni reorganizar objetos personales. Aumenta si hay polvo acumulado o muchos objetos en el piso.',
    unitLabel: 'bodega',
    price: 2,
    minutes: 28,
    defaultValue: 0,
    max: 6,
  },
  {
    id: 'balconies',
    label: 'Patio / balcón / terraza',
    detail: 'Barrido y limpieza superficial. No es jardinería.',
    info: 'Cubre barrido, retiro de polvo y residuos ligeros. No incluye cortar césped, podar plantas, lavar patios con máquina ni jardinería.',
    unitLabel: 'área',
    price: 2,
    minutes: 25,
    defaultValue: 0,
    max: 8,
  },
];

export const moveOutCounters = [
  {
    id: 'emptyBedrooms',
    label: 'Habitaciones vacías',
    detail: 'Dormitorios sin cama ni muebles grandes.',
    unitLabel: 'hab.',
    price: 1.5,
    minutes: 22,
    defaultValue: 2,
    max: 12,
  },
  {
    id: 'emptyLivingAreas',
    label: 'Sala / comedor vacío',
    detail: 'Áreas sociales sin mobiliario o con pocos objetos.',
    unitLabel: 'área',
    price: 2,
    minutes: 28,
    defaultValue: 1,
    max: 8,
  },
  {
    id: 'emptyKitchens',
    label: 'Cocina vacía',
    detail: 'Mesones, muebles exteriores, fregadero y piso.',
    unitLabel: 'cocina',
    price: 4,
    minutes: 55,
    defaultValue: 1,
    max: 4,
  },
  {
    id: 'emptyBathrooms',
    label: 'Baños',
    detail: 'Baños completos o sociales del inmueble.',
    unitLabel: 'baño',
    price: 3.5,
    minutes: 38,
    defaultValue: 1,
    max: 12,
  },
  {
    id: 'emptyOutdoorAreas',
    label: 'Patio / balcón',
    detail: 'Barrido y limpieza superficial. No es jardinería.',
    info: 'Para entrega de inmueble: barrido, retiro de polvo visible y residuos ligeros. No incluye jardinería ni escombros.',
    unitLabel: 'área',
    price: 2,
    minutes: 24,
    defaultValue: 0,
    max: 8,
  },
  {
    id: 'emptyStorageAreas',
    label: 'Bodega vacía',
    detail: 'Barrido, polvo visible y piso de bodega.',
    info: 'Aplica cuando la bodega está vacía o casi vacía. Si hay carga pesada u objetos acumulados, se confirma antes de cerrar.',
    unitLabel: 'bodega',
    price: 1.5,
    minutes: 22,
    defaultValue: 0,
    max: 6,
  },
];

export const postConstructionCounters = [
  {
    id: 'postRooms',
    label: 'Ambientes con polvo',
    detail: 'Habitaciones, salas o locales con polvo fino de obra.',
    unitLabel: 'amb.',
    price: 6,
    minutes: 55,
    defaultValue: 2,
    max: 20,
  },
  {
    id: 'postBathrooms',
    label: 'Baños de obra',
    detail: 'Baños con polvo, restos de instalación o manchas ligeras.',
    unitLabel: 'baño',
    price: 8,
    minutes: 75,
    defaultValue: 1,
    max: 12,
  },
  {
    id: 'postKitchens',
    label: 'Cocinas / mesones',
    detail: 'Mesones, muebles, fregadero y superficies de cocina.',
    unitLabel: 'cocina',
    price: 9,
    minutes: 85,
    defaultValue: 1,
    max: 6,
  },
  {
    id: 'postWindows',
    label: 'Ventanas y marcos',
    detail: 'Vidrios, rieles y marcos accesibles con polvo de obra.',
    unitLabel: 'zona',
    price: 5,
    minutes: 45,
    defaultValue: 1,
    max: 20,
  },
  {
    id: 'postOutdoorAreas',
    label: 'Patio / garaje',
    detail: 'Barrido de polvo de obra y residuos ligeros. No es jardinería.',
    info: 'Aplica para polvo o residuos ligeros de obra en patios o garajes. No incluye escombros pesados, jardinería ni lavado a presión.',
    unitLabel: 'área',
    price: 5,
    minutes: 50,
    defaultValue: 0,
    max: 10,
  },
];

export const businessCounters = [
  {
    id: 'workstations',
    label: 'Puestos de trabajo',
    detail: 'Escritorios, sillas y entorno inmediato.',
    unitLabel: 'puesto',
    price: 1,
    minutes: 8,
    defaultValue: 4,
    max: 60,
  },
  {
    id: 'meetingRooms',
    label: 'Salas de reunión',
    detail: 'Mesas, sillas, superficies y piso.',
    unitLabel: 'sala',
    price: 2,
    minutes: 22,
    defaultValue: 1,
    max: 12,
  },
  {
    id: 'receptions',
    label: 'Recepción / atención',
    detail: 'Mostrador, espera o zona de clientes.',
    unitLabel: 'zona',
    price: 2,
    minutes: 22,
    defaultValue: 1,
    max: 8,
  },
  {
    id: 'businessBathrooms',
    label: 'Baños',
    detail: 'Baños de clientes o personal.',
    unitLabel: 'baño',
    price: 4,
    minutes: 35,
    defaultValue: 1,
    max: 20,
  },
  {
    id: 'kitchenettes',
    label: 'Cafetería / kitchenette',
    detail: 'Área de café, lavaplatos o comedor del personal.',
    unitLabel: 'área',
    price: 3,
    minutes: 35,
    defaultValue: 0,
    max: 8,
  },
  {
    id: 'displayAreas',
    label: 'Vitrinas / estanterías',
    detail: 'Muebles, perchas, vitrinas o exhibición.',
    unitLabel: 'módulo',
    price: 2,
    minutes: 20,
    defaultValue: 0,
    max: 30,
  },
  {
    id: 'businessStorage',
    label: 'Bodega / archivo',
    detail: 'Barrido y limpieza superficial de paso. No incluye inventario.',
    info: 'Para bodegas de local, archivo u oficina. No incluye mover carga pesada ni ordenar inventario.',
    unitLabel: 'zona',
    price: 2,
    minutes: 25,
    defaultValue: 0,
    max: 12,
  },
  {
    id: 'businessOutdoorAreas',
    label: 'Patio / acceso exterior',
    detail: 'Barrido y residuos ligeros. No es jardinería.',
    info: 'Cubre ingreso, patio pequeño o área exterior de local/oficina. No incluye jardinería, escombros ni lavado especializado.',
    unitLabel: 'área',
    price: 2.5,
    minutes: 28,
    defaultValue: 0,
    max: 10,
  },
];

export const extraOptions = [
  {
    id: 'interiorGlass',
    label: 'Vidrios interiores',
    detail: '',
    price: 0,
    pricingMode: 'roomBased',
    roomRate: 1,
    roomSource: 'bedroomKitchen',
    appliesMultipliers: true,
    minutes: 12,
    pricingNote: 'Se cobra por ambientes principales porque en Imbabura muchas viviendas tienen ventanas por dormitorio y cocina, no por paños exactos.',
  },
  {
    id: 'exteriorGlass',
    label: 'Vidrios exteriores accesibles',
    detail: '',
    price: 0,
    pricingMode: 'roomBased',
    roomRate: 1.5,
    roomSource: 'bedroomKitchen',
    appliesMultipliers: true,
    minutes: 16,
    pricingNote: 'Cuesta un poco más que el vidrio interior por acceso, polvo exterior y mayor cuidado. Si hay riesgo de altura se coordina fuera del cotizador.',
  },
  {
    id: 'glassDoors',
    label: 'Mamparas / puertas de vidrio',
    detail: 'Cristal de baño, divisiones, oficinas o accesos.',
    price: 1.5,
    appliesMultipliers: true,
    minutes: 18,
    pricingNote: 'Se cobra por unidad porque el tiempo depende de cada mampara o puerta, no del tamaño total del inmueble.',
  },
  {
    id: 'largeMirrors',
    label: 'Espejos grandes',
    detail: 'Espejos decorativos o de baño que requieren más detalle.',
    price: 1,
    appliesMultipliers: true,
    minutes: 12,
    pricingNote: 'Se cobra por espejo grande para no castigar viviendas pequeñas con un espejo puntual.',
  },
  {
    id: 'beds',
    label: 'Tendido de camas',
    detail: 'Camas que deben quedar tendidas durante la visita.',
    price: 0.5,
    appliesMultipliers: true,
    services: ['casa', 'departamento'],
    minutes: 5,
    pricingNote: 'Cargo por cama que aumenta junto con el tiempo cuando el estado o el tamaño del servicio requieren más trabajo.',
  },
  {
    id: 'furniture',
    label: 'Limpieza de muebles',
    detail: 'Sofás, sillones, mesas o muebles de uso frecuente.',
    price: 2,
    appliesMultipliers: true,
    services: ['casa', 'departamento', 'oficina', 'local'],
    minutes: 20,
    pricingNote: 'Limpieza superficial exterior por pieza visible; no incluye lavado profundo ni aspirado.',
  },
  {
    id: 'cabinetInterior',
    label: 'Interior de anaqueles',
    detail: 'Anaqueles, muebles altos o módulos que se limpiarán por dentro.',
    price: 1.5,
    appliesMultipliers: true,
    services: ['casa', 'departamento', 'oficina', 'local', 'mudanza'],
    minutes: 20,
    pricingNote: 'Cargo por módulo pequeño o mediano; si requiere vaciar muchos objetos se confirma antes de cerrar.',
  },
  {
    id: 'mattresses',
    label: 'Colchones',
    detail: 'Limpieza superficial exterior del colchón.',
    price: 1.5,
    appliesMultipliers: true,
    services: ['casa', 'departamento'],
    minutes: 18,
    pricingNote: 'No incluye lavado profundo; solo limpieza superficial posible con herramientas actuales.',
  },
  {
    id: 'smallCarpets',
    label: 'Alfombras pequeñas',
    detail: 'Sacudido, retiro manual de polvo visible y limpieza superficial.',
    price: 1.5,
    appliesMultipliers: true,
    services: ['casa', 'departamento', 'oficina', 'local'],
    minutes: 18,
    pricingNote: 'Se limita a alfombras pequeñas que se puedan mover o tratar superficialmente.',
  },
  {
    id: 'ovenMicrowave',
    label: 'Horno / microondas',
    detail: 'Interior y exterior de horno, microondas o equipo similar.',
    price: 2.5,
    appliesMultipliers: true,
    services: ['casa', 'departamento', 'mudanza'],
    minutes: 30,
    pricingNote: 'Se cobra por equipo porque la grasa interior puede tomar más tiempo que una superficie común.',
  },
  {
    id: 'fridge',
    label: 'Refrigeradora',
    detail: 'Interior y exterior de refrigeradora.',
    price: 3,
    appliesMultipliers: true,
    services: ['casa', 'departamento', 'mudanza'],
    minutes: 35,
    pricingNote: 'Incluye coordinación para mover alimentos u objetos antes de limpiar.',
  },
  {
    id: 'heavyGrease',
    label: 'Grasa marcada en cocina',
    detail: 'Campana, cerámica, paredes cercanas o muebles de cocina.',
    price: 4.5,
    appliesMultipliers: true,
    services: ['casa', 'departamento', 'oficina', 'local', 'mudanza'],
    minutes: 60,
    pricingNote: 'Recargo por tiempo y producto cuando la grasa está pegada o acumulada.',
  },
  {
    id: 'highDust',
    label: 'Polvo en zonas altas',
    detail: 'Repisas, muebles altos, marcos o superficies elevadas accesibles.',
    price: 2.5,
    appliesMultipliers: true,
    minutes: 30,
    pricingNote: 'Se cobra como extra porque requiere más tiempo, escalera o cuidado de seguridad.',
  },
  {
    id: 'lightTrash',
    label: 'Retiro ligero de basura',
    detail: 'Sacar al basurero de la calle o juntar en un basurero grande de la casa.',
    price: 1.5,
    appliesMultipliers: true,
    minutes: 15,
    pricingNote: 'Solo basura ligera de limpieza; no incluye escombros, residuos peligrosos ni carga pesada.',
  },
  {
    id: 'odorDetail',
    label: 'Olores fuertes en local/oficina',
    detail: 'Olores persistentes en espacios de trabajo o atención al público.',
    price: 3,
    appliesMultipliers: true,
    services: ['oficina', 'local'],
    minutes: 30,
    pricingNote: 'No se muestra en casas o departamentos porque suele requerir diagnóstico distinto y expectativas más delicadas.',
  },
  {
    id: 'delicateSurfaces',
    label: 'Superficies delicadas',
    detail: 'Acabados que requieren cuidado especial o producto específico.',
    price: 2.5,
    appliesMultipliers: true,
    minutes: 30,
    requiresDetail: 'delicateSurface',
    pricingNote: 'La superficie seleccionada ajusta el cuidado y el tiempo sin exponer precios al cliente.',
  },
  {
    id: 'difficultAccess',
    label: 'Acceso difícil',
    detail: 'Parqueo lejano, pisos altos sin ascensor o más de 800 m desde transporte público.',
    price: 2.5,
    appliesMultipliers: true,
    minutes: 25,
    pricingNote: 'Recargo por tiempo muerto y esfuerzo de traslado de materiales, común en sectores alejados o calles de acceso irregular.',
  },
];

export const delicateSurfaceOptions = [
  {
    value: 'madera',
    label: 'Madera',
    detail: 'Muebles, puertas, pisos o acabados de madera.',
    multiplier: 1,
  },
  {
    value: 'marmolPiedra',
    label: 'Mármol / piedra',
    detail: 'Mesones, pisos o piezas de piedra natural.',
    multiplier: 1.2,
  },
  {
    value: 'metal',
    label: 'Metal especial',
    detail: 'Acero, aluminio, cromados o piezas delicadas.',
    multiplier: 1.1,
  },
  {
    value: 'vidrioDecorativo',
    label: 'Vidrio decorativo',
    detail: 'Vidrio decorativo, vitrinas o piezas frágiles.',
    multiplier: 1,
  },
  {
    value: 'otros',
    label: 'Otros',
    detail: 'Indica el material para preparar productos y cuidado.',
    multiplier: 1.15,
  },
];

export const residentialServiceTypes = [
  'casa',
  'departamento',
  'mudanza',
  'postobra',
];

export const businessServiceTypes = ['oficina', 'local'];

export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function getServiceType(value) {
  return serviceTypes.find((option) => option.value === value) ?? serviceTypes[0];
}

export function getSizeOption(value) {
  return sizeOptions.find((option) => option.value === value) ?? sizeOptions[1];
}

export function getConditionOption(value) {
  return conditionOptions.find((option) => option.value === value) ?? conditionOptions[1];
}

export function getMaterialOption(value) {
  return materialOptions.find((option) => option.value === value) ?? materialOptions[1];
}

export function getUrgencyOption(value) {
  return urgencyOptions.find((option) => option.value === value) ?? urgencyOptions[0];
}

export function getCityOption(value) {
  return cityOptions.find((option) => option.value === value) ?? cityOptions[0];
}

export function getExtraOption(id) {
  return extraOptions.find((option) => option.id === id);
}

export function getDelicateSurfaceOption(value) {
  return delicateSurfaceOptions.find((option) => option.value === value) ?? delicateSurfaceOptions[0];
}
