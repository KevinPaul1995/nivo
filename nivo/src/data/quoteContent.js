export const quoteConfig = {
  whatsappBase: 'https://wa.me/593996583089',
  currency: '$',
  minPrice: 30,
  rounding: 5,
  hourlyReference: 7.5,
  defaultTeamSize: 2,
  businessName: 'NIVO',
};

export const serviceTypes = [
  {
    value: 'casa',
    label: 'Casa',
    shortLabel: 'Casa',
    detail: 'Limpieza residencial completa o por áreas.',
    basePrice: 24,
    multiplier: 1,
  },
  {
    value: 'departamento',
    label: 'Departamento',
    shortLabel: 'Departamento',
    detail: 'Ideal para espacios compactos o medianos.',
    basePrice: 20,
    multiplier: 0.96,
  },
  {
    value: 'oficina',
    label: 'Oficina',
    shortLabel: 'Oficina',
    detail: 'Puestos de trabajo, salas, baños y zonas comunes.',
    basePrice: 32,
    multiplier: 1.08,
  },
  {
    value: 'local',
    label: 'Local comercial',
    shortLabel: 'Local',
    detail: 'Tiendas, consultorios, vitrinas y áreas de atención.',
    basePrice: 36,
    multiplier: 1.12,
  },
  {
    value: 'mudanza',
    label: 'Mudanza / entrega',
    shortLabel: 'Mudanza',
    detail: 'Entrada o salida de inmueble con limpieza más detallada.',
    basePrice: 44,
    multiplier: 1.18,
  },
  {
    value: 'postobra',
    label: 'Post obra',
    shortLabel: 'Post obra',
    detail: 'Polvo fino, residuos ligeros y limpieza técnica inicial.',
    basePrice: 60,
    multiplier: 1.34,
  },
];

export const sizeOptions = [
  {
    value: 'compacto',
    label: 'Compacto',
    detail: 'Hasta 60 m² o pocas áreas.',
    multiplier: 0.94,
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
    multiplier: 1.2,
  },
  {
    value: 'muyAmplio',
    label: 'Muy amplio',
    detail: 'Más de 200 m² o muchas áreas.',
    multiplier: 1.45,
  },
];

export const conditionOptions = [
  {
    value: 'mantenimiento',
    label: 'Mantenimiento',
    detail: 'Ordenado, sin grasa ni suciedad acumulada.',
    multiplier: 0.86,
  },
  {
    value: 'general',
    label: 'General',
    detail: 'Uso normal, requiere limpieza completa.',
    multiplier: 1,
  },
  {
    value: 'profunda',
    label: 'Profunda',
    detail: 'Polvo acumulado, manchas, grasa o mucho detalle.',
    multiplier: 1.28,
  },
  {
    value: 'intensiva',
    label: 'Intensiva',
    detail: 'Suciedad fuerte, acumulación, olores o mucho tiempo sin limpiar.',
    multiplier: 1.58,
  },
];

export const frequencyOptions = [
  {
    value: 'puntual',
    label: 'Una sola vez',
    detail: 'Servicio puntual o primera visita.',
    multiplier: 1,
  },
  {
    value: 'semanal',
    label: 'Semanal',
    detail: 'Mejor precio por rutina constante.',
    multiplier: 0.88,
  },
  {
    value: 'quincenal',
    label: 'Quincenal',
    detail: 'Mantenimiento equilibrado.',
    multiplier: 0.92,
  },
  {
    value: 'mensual',
    label: 'Mensual',
    detail: 'Apoyo programado cada mes.',
    multiplier: 0.96,
  },
];

export const materialOptions = [
  {
    value: 'cliente',
    label: 'Usar materiales del cliente',
    detail: 'El cliente provee productos y herramientas.',
    price: -4,
  },
  {
    value: 'nivoBasico',
    label: 'NIVO básico',
    detail: 'Productos básicos para limpieza general.',
    price: 8,
  },
  {
    value: 'nivoCompleto',
    label: 'NIVO completo',
    detail: 'Productos, paños, herramientas y mejor cobertura.',
    price: 16,
  },
  {
    value: 'desinfeccion',
    label: 'Limpieza + desinfección',
    detail: 'Incluye productos para sanitización de superficies.',
    price: 24,
  },
];

export const petOptions = [
  {
    value: 'ninguna',
    label: 'Sin mascotas',
    detail: 'No hay pelo ni olores asociados a mascotas.',
    multiplier: 1,
  },
  {
    value: 'perro',
    label: 'Perro',
    detail: 'Puede requerir más tiempo por pelo y olor.',
    multiplier: 1.08,
  },
  {
    value: 'gato',
    label: 'Gato',
    detail: 'Pelo fino, arenero o zonas de descanso.',
    multiplier: 1.1,
  },
  {
    value: 'perroGato',
    label: 'Perro y gato',
    detail: 'Mayor carga de aspirado y detalle.',
    multiplier: 1.16,
  },
  {
    value: 'varias',
    label: 'Varias mascotas',
    detail: 'Mayor tiempo de limpieza y control de olor.',
    multiplier: 1.23,
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
    multiplier: 1.1,
  },
  {
    value: 'hoy',
    label: 'Hoy / urgente',
    detail: 'Sujeto a disponibilidad y recargo.',
    multiplier: 1.22,
  },
];

export const cityOptions = [
  {
    value: 'Ibarra',
    label: 'Ibarra',
    detail: 'Cobertura urbana y zonas cercanas.',
    travelFee: 0,
  },
  {
    value: 'Atuntaqui / Antonio Ante',
    label: 'Atuntaqui / Antonio Ante',
    detail: 'Coordinación según disponibilidad.',
    travelFee: 5,
  },
  {
    value: 'Otavalo',
    label: 'Otavalo',
    detail: 'Coordinación según disponibilidad.',
    travelFee: 8,
  },
  {
    value: 'Cotacachi',
    label: 'Cotacachi',
    detail: 'Coordinación según disponibilidad.',
    travelFee: 8,
  },
  {
    value: 'Urcuquí',
    label: 'Urcuquí',
    detail: 'Coordinación según disponibilidad.',
    travelFee: 10,
  },
  {
    value: 'Otro sector de Imbabura',
    label: 'Otro sector de Imbabura',
    detail: 'Se confirma movilización antes de cerrar.',
    travelFee: 15,
  },
];

export const residentialCounters = [
  {
    id: 'bedrooms',
    label: 'Habitaciones',
    detail: 'Dormitorios o cuartos privados.',
    unitLabel: 'hab.',
    price: 8,
    minutes: 22,
    defaultValue: 2,
    max: 12,
  },
  {
    id: 'livingRooms',
    label: 'Sala',
    detail: 'Sala principal o sala de estar.',
    unitLabel: 'sala',
    price: 10,
    minutes: 28,
    defaultValue: 1,
    max: 6,
  },
  {
    id: 'diningRooms',
    label: 'Comedor',
    detail: 'Comedor independiente o integrado.',
    unitLabel: 'comedor',
    price: 7,
    minutes: 18,
    defaultValue: 1,
    max: 6,
  },
  {
    id: 'kitchens',
    label: 'Cocina',
    detail: 'Mesones, fregadero, exteriores y piso.',
    unitLabel: 'cocina',
    price: 16,
    minutes: 42,
    defaultValue: 1,
    max: 4,
  },
  {
    id: 'fullBathrooms',
    label: 'Baños completos',
    detail: 'Inodoro, ducha, lavamanos, espejo y piso.',
    unitLabel: 'baño',
    price: 12,
    minutes: 32,
    defaultValue: 1,
    max: 12,
  },
  {
    id: 'halfBathrooms',
    label: 'Medios baños',
    detail: 'Baño social sin ducha.',
    unitLabel: 'medio baño',
    price: 7,
    minutes: 18,
    defaultValue: 0,
    max: 10,
  },
  {
    id: 'laundryAreas',
    label: 'Área de máquinas',
    detail: 'Lavandería, lavadora, secadora o zona de lavado.',
    unitLabel: 'área',
    price: 9,
    minutes: 22,
    defaultValue: 0,
    max: 5,
  },
  {
    id: 'balconies',
    label: 'Balcón / terraza',
    detail: 'Balcón, patio pequeño o terraza.',
    unitLabel: 'área',
    price: 9,
    minutes: 24,
    defaultValue: 0,
    max: 8,
  },
];

export const businessCounters = [
  {
    id: 'workstations',
    label: 'Puestos de trabajo',
    detail: 'Escritorios, sillas y entorno inmediato.',
    unitLabel: 'puesto',
    price: 3,
    minutes: 7,
    defaultValue: 4,
    max: 60,
  },
  {
    id: 'meetingRooms',
    label: 'Salas de reunión',
    detail: 'Mesas, sillas, superficies y piso.',
    unitLabel: 'sala',
    price: 11,
    minutes: 24,
    defaultValue: 1,
    max: 12,
  },
  {
    id: 'receptions',
    label: 'Recepción / atención',
    detail: 'Mostrador, espera o zona de clientes.',
    unitLabel: 'zona',
    price: 12,
    minutes: 28,
    defaultValue: 1,
    max: 8,
  },
  {
    id: 'businessBathrooms',
    label: 'Baños',
    detail: 'Baños de clientes o personal.',
    unitLabel: 'baño',
    price: 12,
    minutes: 32,
    defaultValue: 1,
    max: 20,
  },
  {
    id: 'kitchenettes',
    label: 'Cafetería / kitchenette',
    detail: 'Área de café, lavaplatos o comedor del personal.',
    unitLabel: 'área',
    price: 12,
    minutes: 28,
    defaultValue: 0,
    max: 8,
  },
  {
    id: 'displayAreas',
    label: 'Vitrinas / estanterías',
    detail: 'Muebles, perchas, vitrinas o exhibición.',
    unitLabel: 'módulo',
    price: 7,
    minutes: 16,
    defaultValue: 0,
    max: 30,
  },
];

export const extraOptions = [
  {
    id: 'interiorGlass',
    label: 'Vidrios interiores',
    detail: 'Ventanas internas, divisiones o puertas de vidrio.',
    price: 7,
    minutes: 18,
  },
  {
    id: 'exteriorGlass',
    label: 'Vidrios exteriores accesibles',
    detail: 'Vidrios exteriores sin riesgo de altura.',
    price: 10,
    minutes: 24,
  },
  {
    id: 'glassDoors',
    label: 'Mamparas / puertas de vidrio',
    detail: 'Cristal de baño, oficinas o accesos.',
    price: 8,
    minutes: 18,
  },
  {
    id: 'largeMirrors',
    label: 'Espejos grandes',
    detail: 'Espejos decorativos o de baño de gran tamaño.',
    price: 5,
    minutes: 12,
  },
  {
    id: 'beds',
    label: 'Tendido / limpieza de camas',
    detail: 'Ordenado, tendido y limpieza superficial del área.',
    price: 4,
    minutes: 10,
  },
  {
    id: 'furniture',
    label: 'Limpieza de muebles',
    detail: 'Sofás, sillones y muebles de sala por superficie.',
    price: 14,
    minutes: 28,
  },
  {
    id: 'cabinetInterior',
    label: 'Interior de anaqueles',
    detail: 'Requiere vaciar o coordinar objetos antes.',
    price: 12,
    minutes: 30,
  },
  {
    id: 'mattresses',
    label: 'Colchones',
    detail: 'Aspirado o limpieza superficial según material.',
    price: 10,
    minutes: 22,
  },
  {
    id: 'smallCarpets',
    label: 'Alfombras pequeñas',
    detail: 'Aspirado y limpieza superficial.',
    price: 9,
    minutes: 20,
  },
  {
    id: 'ovenMicrowave',
    label: 'Horno / microondas',
    detail: 'Limpieza interior y exterior.',
    price: 12,
    minutes: 28,
  },
  {
    id: 'fridge',
    label: 'Refrigeradora',
    detail: 'Exterior e interior si está vacía.',
    price: 15,
    minutes: 34,
  },
  {
    id: 'heavyGrease',
    label: 'Grasa marcada en cocina',
    detail: 'Campana, cerámica, paredes cercanas o muebles.',
    price: 18,
    minutes: 42,
  },
  {
    id: 'highDust',
    label: 'Polvo en zonas altas',
    detail: 'Superficies elevadas, repisas o detalles altos.',
    price: 14,
    minutes: 32,
  },
  {
    id: 'lightTrash',
    label: 'Retiro ligero de basura',
    detail: 'No incluye escombros ni residuos peligrosos.',
    price: 10,
    minutes: 18,
  },
  {
    id: 'odorDetail',
    label: 'Olores fuertes',
    detail: 'Requiere más ventilación, productos y tiempo.',
    price: 14,
    minutes: 28,
  },
  {
    id: 'delicateSurfaces',
    label: 'Superficies delicadas',
    detail: 'Mármol, madera, piedra, metal especial o acabados finos.',
    price: 12,
    minutes: 24,
  },
  {
    id: 'difficultAccess',
    label: 'Acceso difícil',
    detail: 'Parqueo lejano, pisos altos sin ascensor o traslado largo.',
    price: 12,
    minutes: 20,
  },
];

export const residentialServiceTypes = ['casa', 'departamento', 'mudanza', 'postobra'];
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

export function getFrequencyOption(value) {
  return frequencyOptions.find((option) => option.value === value) ?? frequencyOptions[0];
}

export function getMaterialOption(value) {
  return materialOptions.find((option) => option.value === value) ?? materialOptions[1];
}

export function getPetOption(value) {
  return petOptions.find((option) => option.value === value) ?? petOptions[0];
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
