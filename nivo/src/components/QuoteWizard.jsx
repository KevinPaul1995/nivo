import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  businessCounters,
  businessServiceTypes,
  cityOptions,
  conditionOptions,
  delicateSurfaceOptions,
  extraOptions,
  frequencyOptions,
  getCityOption,
  getConditionOption,
  getDelicateSurfaceOption,
  getExtraOption,
  getMaterialOption,
  getServiceType,
  getSizeOption,
  getUrgencyOption,
  materialOptions,
  moveOutCounters,
  petCounters,
  postConstructionCounters,
  quoteConfig,
  residentialCounters,
  serviceTypes,
  sizeOptions,
  urgencyOptions,
} from '../data/quoteContent';

const singleQuantityExtras = new Set([
  'heavyGrease',
  'highDust',
  'lightTrash',
  'odorDetail',
  'delicateSurfaces',
  'difficultAccess',
]);

const quoteFlow = [
  {
    eyebrow: 'Paso 1 de 7',
    title: 'Elige tu espacio',
    description: 'Toca una tarjeta y presiona Continuar.',
  },
  {
    eyebrow: 'Paso 2 de 7',
    title: 'Cuenta los ambientes',
    description: 'Usa + y - para ajustar cantidades.',
  },
  {
    eyebrow: 'Paso 3 de 7',
    title: 'Define el alcance',
    description: 'Selecciona tamaño, estado actual y frecuencia.',
  },
  {
    eyebrow: 'Paso 4 de 7',
    title: 'Detalles de la visita',
    description: 'Indica materiales, mascotas y fecha deseada.',
  },
  {
    eyebrow: 'Paso 5 de 7',
    title: 'Extras',
    description: 'Agrega solo lo que necesitas.',
  },
  {
    eyebrow: 'Paso 6 de 7',
    title: 'Ubicación',
    description: 'Indica ciudad, sector y cualquier dato importante.',
  },
  {
    eyebrow: 'Resultado',
    title: 'Valor calculado',
    description: 'Envía el resumen por WhatsApp para coordinar la visita.',
  },
];

const interfaceCopy = {
  es: {
    back: 'Anterior',
    next: 'Continuar',
    decrease: 'Restar',
    increase: 'Sumar',
    finish: 'Finalizar',
    liveValue: 'Valor en vivo',
    calculatedValue: 'Valor calculado',
    service: 'Servicio',
    initialState: 'Estado inicial',
    frequency: 'Frecuencia',
    city: 'Ciudad',
    estimatedTime: 'Tiempo estimado',
    clientSummary: 'Resumen de tu servicio',
    included: 'Alcance seleccionado',
    edit: 'Editar datos',
    confirmWhatsapp: 'Confirmar por WhatsApp',
    verifiedTitle: 'Confirmo que los datos ingresados son verdaderos.',
    verifiedText:
      'El personal de NIVO verificará ambientes, estado del espacio, extras, acceso y condiciones al llegar. Si la información no coincide, el valor puede ajustarse antes de iniciar el servicio.',
    infoLabel: 'Más información',
    noExtras: 'Sin extras',
    noAreas: 'Sin ambientes seleccionados',
    helpSuffix: 'Úsalo solo si aplica; nos ayuda a calcular el alcance real sin pedirte datos innecesarios.',
    sections: {
      size: 'Tamaño aproximado',
      condition: 'Estado actual',
      frequency: 'Frecuencia',
      materials: 'Materiales',
      pets: 'Mascotas',
      urgency: 'Fecha deseada',
      city: 'Ciudad',
      sector: 'Sector o referencia',
      notes: 'Observaciones opcionales',
      surfaceType: 'Tipo de superficie',
      materialName: 'Indica el material',
    },
    placeholders: {
      sector: 'Ej. Centro de Ibarra, Los Ceibos, cerca del parque...',
      notes: 'Ej. grasa en cocina, gatos, vidrios altos, polvo acumulado, acceso difícil o muebles delicados...',
      surfaceOther: 'Ej. porcelanato, granito, cuero, pieza decorativa...',
    },
  },
  en: {
    back: 'Back',
    next: 'Continue',
    decrease: 'Decrease',
    increase: 'Increase',
    finish: 'Finish',
    liveValue: 'Live estimate',
    calculatedValue: 'Calculated value',
    service: 'Service',
    initialState: 'Initial condition',
    frequency: 'Frequency',
    city: 'City',
    estimatedTime: 'Estimated time',
    clientSummary: 'Service summary',
    included: 'Selected scope',
    edit: 'Edit details',
    confirmWhatsapp: 'Confirm on WhatsApp',
    verifiedTitle: 'I confirm that the information entered is true.',
    verifiedText:
      'NIVO staff will verify rooms, space condition, extras, access and conditions on arrival. If the information does not match, the value may be adjusted before the service starts.',
    infoLabel: 'More information',
    noExtras: 'No extras',
    noAreas: 'No rooms selected',
    helpSuffix: 'Use it only if it applies; it helps us calculate the real scope without asking for unnecessary data.',
    sections: {
      size: 'Approximate size',
      condition: 'Current condition',
      frequency: 'Frequency',
      materials: 'Materials',
      pets: 'Pets',
      urgency: 'Preferred date',
      city: 'City',
      sector: 'Sector or reference',
      notes: 'Optional notes',
      surfaceType: 'Surface type',
      materialName: 'Specify the material',
    },
    placeholders: {
      sector: 'Ex. downtown Ibarra, Los Ceibos, near the park...',
      notes: 'Ex. grease in kitchen, cats, high windows, accumulated dust, difficult access or delicate furniture...',
      surfaceOther: 'Ex. porcelain tile, granite, leather, decorative piece...',
    },
  },
};

const quoteFlowEn = [
  {
    eyebrow: 'Step 1 of 7',
    title: 'Choose your space',
    description: 'Tap a card and press Continue.',
  },
  {
    eyebrow: 'Step 2 of 7',
    title: 'Count the rooms',
    description: 'Use + and - to adjust quantities.',
  },
  {
    eyebrow: 'Step 3 of 7',
    title: 'Define the scope',
    description: 'Select size, current condition and frequency.',
  },
  {
    eyebrow: 'Step 4 of 7',
    title: 'Visit details',
    description: 'Choose materials, pets and preferred timing.',
  },
  {
    eyebrow: 'Step 5 of 7',
    title: 'Extras',
    description: 'Add only what you need.',
  },
  {
    eyebrow: 'Step 6 of 7',
    title: 'Location',
    description: 'Enter city, sector and important notes.',
  },
  {
    eyebrow: 'Result',
    title: 'Calculated value',
    description: 'Send the summary by WhatsApp to coordinate the visit.',
  },
];

const englishLabels = {
  Casa: 'House',
  Departamento: 'Apartment',
  Oficina: 'Office',
  'Local comercial': 'Commercial space',
  'Mudanza / entrega': 'Move-in / move-out',
  'Post obra': 'Post-construction',
  Compacto: 'Compact',
  Mediano: 'Medium',
  Amplio: 'Large',
  'Muy amplio': 'Very large',
  Ordenado: 'Tidy',
  General: 'General',
  Profunda: 'Deep',
  Intensiva: 'Intensive',
  'Una sola vez': 'One-time',
  Quincenal: 'Biweekly package',
  Mensual: 'Monthly package',
  'Usar materiales del cliente': 'Use client materials',
  'NIVO básico': 'NIVO basic',
  'NIVO completo': 'NIVO complete',
  Flexible: 'Flexible',
  'Próximas 48 horas': 'Next 48 hours',
  'Hoy / urgente': 'Today / urgent',
  Habitaciones: 'Bedrooms',
  Sala: 'Living room',
  Comedor: 'Dining room',
  Cocina: 'Kitchen',
  'Baños completos': 'Full bathrooms',
  'Medios baños': 'Half bathrooms',
  'Área de máquinas': 'Laundry area',
  'Bodega / cuarto de guardado': 'Storage room',
  'Patio / balcón / terraza': 'Patio / balcony / terrace',
  'Habitaciones vacías': 'Empty bedrooms',
  'Sala / comedor vacío': 'Empty living / dining area',
  'Cocina vacía': 'Empty kitchen',
  Baños: 'Bathrooms',
  'Patio / balcón': 'Patio / balcony',
  'Bodega vacía': 'Empty storage room',
  'Ambientes con polvo': 'Dusty rooms',
  'Baños de obra': 'Construction bathrooms',
  'Cocinas / mesones': 'Kitchens / countertops',
  'Ventanas y marcos': 'Windows and frames',
  'Patio / garaje': 'Patio / garage',
  'Puestos de trabajo': 'Workstations',
  'Salas de reunión': 'Meeting rooms',
  'Recepción / atención': 'Reception / customer area',
  'Cafetería / kitchenette': 'Coffee area / kitchenette',
  'Vitrinas / estanterías': 'Displays / shelves',
  'Bodega / archivo': 'Storage / archive',
  'Patio / acceso exterior': 'Patio / outdoor access',
  Perros: 'Dogs',
  Gatos: 'Cats',
  'Vidrios interiores': 'Interior windows',
  'Vidrios exteriores accesibles': 'Accessible exterior windows',
  'Mamparas / puertas de vidrio': 'Glass doors / partitions',
  'Espejos grandes': 'Large mirrors',
  'Tendido de camas': 'Bed making',
  'Limpieza de muebles': 'Furniture cleaning',
  'Interior de anaqueles': 'Cabinet interiors',
  Colchones: 'Mattresses',
  'Alfombras pequeñas': 'Small rugs',
  'Horno / microondas': 'Oven / microwave',
  Refrigeradora: 'Refrigerator',
  'Grasa marcada en cocina': 'Heavy kitchen grease',
  'Polvo en zonas altas': 'High dust',
  'Retiro ligero de basura': 'Light trash removal',
  'Olores fuertes en local/oficina': 'Strong odors in business space',
  'Superficies delicadas': 'Delicate surfaces',
  'Acceso difícil': 'Difficult access',
};

const optionCopy = {
  es: {
    casa: {
      label: 'Casa',
      detail: 'Hogar familiar con habitaciones, baños, cocina y áreas sociales.',
      info: 'Elige esta opción si el espacio está habitado y hay muebles u objetos de uso diario. Aumenta el trabajo cuando hay más baños, cocina con uso frecuente, mascotas o patios.',
    },
    departamento: {
      label: 'Departamento',
      detail: 'Vivienda compacta o mediana dentro de edificio o conjunto.',
      info: 'Suele requerir menos recorrido que una casa, pero el tiempo depende de baños, cocina, accesos y estado actual.',
    },
    oficina: {
      label: 'Oficina',
      detail: 'Puestos de trabajo, salas, baños y áreas comunes.',
      info: 'Cuenta escritorios, salas, baños y zonas de atención. Si hay mucho tránsito de personas, cafetería o vitrinas, el trabajo aumenta.',
    },
    local: {
      label: 'Local comercial',
      detail: 'Tiendas, consultorios, vitrinas y zonas de atención.',
      info: 'Pensado para espacios donde la imagen al público importa. Aumenta si hay vitrinas, perchas, ingreso exterior o baños de clientes.',
    },
    mudanza: {
      label: 'Mudanza / entrega',
      detail: 'Limpieza de entrada o salida de inmueble.',
      info: 'Úsalo cuando el espacio está vacío o casi vacío. No se calcula igual que una casa habitada: hay menos objetos, pero más detalle en rincones, muebles fijos y baños.',
    },
    postobra: {
      label: 'Post obra',
      detail: 'Polvo fino, residuos ligeros y limpieza inicial después de obra.',
      info: 'No incluye retiro de escombros pesados, pintura pegada compleja ni trabajos de riesgo en altura. Si hay mucho residuo, conviene enviar fotos.',
    },
    compacto: {
      label: 'Compacto',
      detail: 'Hasta 60 m² o pocos ambientes.',
      info: 'Para suites, departamentos pequeños o espacios con recorrido corto.',
    },
    medio: {
      label: 'Mediano',
      detail: 'Entre 60 y 120 m² aproximadamente.',
      info: 'Es la referencia normal para una vivienda u oficina promedio.',
    },
    amplio: {
      label: 'Amplio',
      detail: 'Entre 120 y 200 m² aproximadamente.',
      info: 'Aumenta el tiempo por mayor recorrido, más superficies y más revisión final.',
    },
    muyAmplio: {
      label: 'Muy amplio',
      detail: 'Más de 200 m² o muchos ambientes.',
      info: 'Úsalo si el espacio tiene varias áreas, más de una planta o requiere más recorrido.',
    },
    mantenimiento: {
      label: 'Ordenado',
      detail: 'Se limpió hace pocos días y necesita un repaso.',
      info: 'Reduce el trabajo cuando no hay acumulación de polvo, grasa o manchas. Ideal para mantenimiento frecuente.',
    },
    general: {
      label: 'General',
      detail: 'Última limpieza hace 1 a 2 semanas, con uso normal.',
      info: 'Es el punto medio para casas, oficinas o locales con mantenimiento regular.',
    },
    profunda: {
      label: 'Profunda',
      detail: 'Más de 2 semanas o zonas con polvo, manchas o grasa.',
      info: 'Aumenta el trabajo porque se requiere más detalle en baños, cocina, esquinas, superficies y acumulación visible.',
    },
    intensiva: {
      label: 'Intensiva',
      detail: 'Más de un mes o suciedad fuerte acumulada.',
      info: 'Para espacios con acumulación fuerte. Puede requerir más tiempo y verificación al llegar.',
    },
    puntual: {
      label: 'Una sola vez',
      detail: 'Una visita única con el estado que selecciones.',
      info: 'Calcula una sola visita. Útil para limpieza puntual, entrega de casa o apoyo ocasional.',
    },
    quincenal: {
      label: 'Quincenal',
      detail: 'Dos visitas al mes, pagadas por adelantado.',
      info: 'La primera visita usa el estado que selecciones. La siguiente se calcula como limpieza general porque el espacio ya queda en mantenimiento.',
    },
    mensual: {
      label: 'Mensual',
      detail: 'Cuatro visitas al mes, una por semana.',
      info: 'Incluye descuento por paquete. La primera visita usa el estado seleccionado y las siguientes quedan como limpieza general.',
    },
    cliente: {
      label: 'Usar mis materiales',
      detail: 'Tú provees productos y herramientas.',
      info: 'Elige esto si tienes escoba, trapeador, paños y productos adecuados. Si falta algo importante, se coordina antes de iniciar.',
    },
    nivoBasico: {
      label: 'NIVO básico',
      detail: 'Productos básicos para limpieza general.',
      info: 'NIVO lleva lo necesario para una limpieza normal de baños, cocina, pisos y superficies comunes.',
    },
    nivoCompleto: {
      label: 'NIVO completo',
      detail: 'Productos, paños y herramientas con mejor cobertura.',
      info: 'Recomendado si no tienes materiales o si prefieres que NIVO lleve todo preparado.',
    },
    normal: {
      label: 'Flexible',
      detail: 'Puede coordinarse según agenda.',
      info: 'No requiere atención inmediata. Permite coordinar mejor horario y disponibilidad.',
    },
    pronto: {
      label: 'Próximas 48 horas',
      detail: 'Requiere prioridad de agenda.',
      info: 'Úsalo si necesitas el servicio pronto y tienes cierta flexibilidad de horario.',
    },
    hoy: {
      label: 'Hoy / urgente',
      detail: 'Sujeto a disponibilidad.',
      info: 'Para casos urgentes. La visita depende de agenda, distancia y hora de solicitud.',
    },
    Atuntaqui: {
      label: 'Atuntaqui',
      detail: 'Base operativa inicial de NIVO.',
      info: 'Selecciona esta opción si el servicio es dentro de Atuntaqui.',
    },
    Natabuela: {
      label: 'Natabuela',
      detail: 'Cobertura en Natabuela; indica el sector exacto.',
      info: 'Selecciona esta opción si el servicio es en Natabuela.',
    },
    'Andrade Marín / San Roque': {
      label: 'Andrade Marín / San Roque',
      detail: 'Sectores de Antonio Ante cercanos a Atuntaqui.',
      info: 'Usa esta opción si el servicio es en Andrade Marín o San Roque.',
    },
    Ibarra: {
      label: 'Ibarra',
      detail: 'Cobertura urbana y zonas cercanas.',
      info: 'Indica el sector exacto para coordinar llegada y horario.',
    },
    Otavalo: {
      label: 'Otavalo',
      detail: 'Cobertura hacia el sur de Imbabura.',
      info: 'Indica barrio, referencia y disponibilidad de acceso.',
    },
    Cotacachi: {
      label: 'Cotacachi',
      detail: 'Cobertura hacia Cotacachi y zonas cercanas.',
      info: 'Indica sector exacto para confirmar movilización y horario.',
    },
    Urcuquí: {
      label: 'Urcuquí',
      detail: 'Movilización más larga; confirmar sector exacto.',
      info: 'Puede requerir coordinación adicional según distancia y acceso.',
    },
    'Otro sector de Imbabura': {
      label: 'Otro sector de Imbabura',
      detail: 'Se confirma disponibilidad antes de cerrar.',
      info: 'Escribe el sector o comunidad para revisar si podemos atenderlo.',
    },
    bedrooms: { label: 'Habitaciones', detail: 'Dormitorios o cuartos privados.', info: 'Cuenta solo habitaciones que deben limpiarse.' },
    livingRooms: { label: 'Sala', detail: 'Sala principal o sala de estar.', info: 'Incluye superficies visibles, piso y orden ligero de paso.' },
    diningRooms: { label: 'Comedor', detail: 'Comedor independiente o integrado.', info: 'Cuenta el comedor si requiere limpieza propia, aunque esté junto a la sala.' },
    kitchens: { label: 'Cocina', detail: 'Mesones, fregadero, exteriores de muebles y piso.', info: 'La cocina suele tomar más tiempo por grasa, manchas y superficies de contacto.' },
    fullBathrooms: { label: 'Baños completos', detail: 'Inodoro, ducha, lavamanos, espejo y piso.', info: 'Cuenta baños con ducha o tina.' },
    halfBathrooms: { label: 'Medios baños', detail: 'Baño social sin ducha.', info: 'Cuenta baños pequeños de visitas o de oficina.' },
    laundryAreas: { label: 'Área de lavado', detail: 'Lavandería, lavadora o zona de lavado.', info: 'Cuenta esta área si requiere limpieza de piso, polvo o superficies.' },
    storageAreas: { label: 'Bodega / cuarto de guardado', detail: 'Barrido y retiro de polvo visible.', info: 'No incluye inventario, mover carga pesada ni reorganizar objetos personales.' },
    balconies: { label: 'Patio / balcón / terraza', detail: 'Barrido y limpieza superficial. No es jardinería.', info: 'Incluye barrido y residuos ligeros. No incluye cortar césped, podar plantas ni lavado a presión.' },
    emptyBedrooms: { label: 'Habitaciones vacías', detail: 'Dormitorios sin cama ni muebles grandes.', info: 'Para mudanza o entrega de inmueble.' },
    emptyLivingAreas: { label: 'Sala / comedor vacío', detail: 'Área social sin mobiliario o con pocos objetos.', info: 'Cuenta salas o comedores que deben quedar listos para entrega.' },
    emptyKitchens: { label: 'Cocina vacía', detail: 'Mesones, fregadero, exteriores de muebles y piso.', info: 'Si hay grasa acumulada, marca también el extra de grasa.' },
    emptyBathrooms: { label: 'Baños', detail: 'Baños completos o sociales del inmueble.', info: 'Cuenta todos los baños que deben entregarse limpios.' },
    emptyOutdoorAreas: { label: 'Patio / balcón', detail: 'Barrido y limpieza superficial. No es jardinería.', info: 'No incluye escombros, podas ni lavado especializado.' },
    emptyStorageAreas: { label: 'Bodega vacía', detail: 'Barrido, polvo visible y piso de bodega.', info: 'Si hay carga pesada u objetos acumulados, se confirma por WhatsApp.' },
    postRooms: { label: 'Ambientes con polvo', detail: 'Habitaciones, salas o locales con polvo fino de obra.', info: 'Cuenta ambientes con polvo de construcción, no escombros pesados.' },
    postBathrooms: { label: 'Baños de obra', detail: 'Baños con polvo o restos ligeros de instalación.', info: 'No incluye retirar cemento o pintura pegada difícil.' },
    postKitchens: { label: 'Cocinas / mesones', detail: 'Mesones, muebles y superficies de cocina.', info: 'Cuenta cocinas con polvo de obra o instalación reciente.' },
    postWindows: { label: 'Ventanas y marcos', detail: 'Vidrios, rieles y marcos accesibles.', info: 'Cuenta zonas de ventanas accesibles sin riesgo de altura.' },
    postOutdoorAreas: { label: 'Patio / garaje', detail: 'Barrido de polvo de obra y residuos ligeros.', info: 'No incluye jardinería, escombros pesados ni lavado a presión.' },
    workstations: { label: 'Puestos de trabajo', detail: 'Escritorios, sillas y entorno inmediato.', info: 'Cuenta escritorios o puestos que deben quedar listos para uso.' },
    meetingRooms: { label: 'Salas de reunión', detail: 'Mesas, sillas, superficies y piso.', info: 'Cuenta salas cerradas o espacios de reunión.' },
    receptions: { label: 'Recepción / atención', detail: 'Mostrador, espera o zona de clientes.', info: 'Marca esta opción si hay ingreso o zona visible para clientes.' },
    businessBathrooms: { label: 'Baños', detail: 'Baños de clientes o personal.', info: 'Cuenta todos los baños de oficina o local.' },
    kitchenettes: { label: 'Cafetería / kitchenette', detail: 'Área de café, lavaplatos o comedor del personal.', info: 'Cuenta zonas donde se preparan bebidas o alimentos.' },
    displayAreas: { label: 'Vitrinas / estanterías', detail: 'Perchas, vitrinas o exhibición.', info: 'Para superficies visibles al público que requieren más detalle.' },
    businessStorage: { label: 'Bodega / archivo', detail: 'Barrido y limpieza superficial. No incluye inventario.', info: 'No incluye mover carga pesada ni ordenar inventario.' },
    businessOutdoorAreas: { label: 'Patio / acceso exterior', detail: 'Barrido y residuos ligeros. No es jardinería.', info: 'Para ingreso, patio pequeño o área exterior de local/oficina.' },
    dogs: { label: 'Perros', detail: 'Perros que viven dentro o pasan mucho tiempo en casa.', info: 'Ayuda a calcular pelo, huellas y limpieza adicional en pisos.' },
    cats: { label: 'Gatos', detail: 'Gatos, areneros o zonas donde descansan.', info: 'Ayuda a calcular pelo, polvo de arenero y limpieza de zonas frecuentes.' },
    interiorGlass: { label: 'Vidrios interiores', detail: 'Ventanas internas o vidrios accesibles por dentro.', info: 'Marca esta opción si quieres limpiar vidrios por dentro en habitaciones y cocina.' },
    exteriorGlass: { label: 'Vidrios exteriores accesibles', detail: 'Vidrios por fuera, siempre que no haya riesgo de altura.', info: 'No incluye trabajos en altura ni acceso peligroso.' },
    glassDoors: { label: 'Mamparas / puertas de vidrio', detail: 'Cristal de baño, divisiones o accesos de vidrio.', info: 'Úsalo para puertas o mamparas que requieren limpieza aparte.' },
    largeMirrors: { label: 'Espejos grandes', detail: 'Espejos decorativos o de baño grandes.', info: 'Marca espejos grandes o delicados que toman más detalle.' },
    beds: { label: 'Tendido de camas', detail: 'Camas que deben quedar tendidas.', info: 'No incluye lavado de sábanas; solo tender la cama.' },
    furniture: { label: 'Limpieza de muebles', detail: 'Sofás, sillones, mesas o muebles visibles.', info: 'Limpieza superficial exterior. No incluye lavado profundo ni aspirado.' },
    cabinetInterior: { label: 'Interior de anaqueles', detail: 'Muebles o módulos que se limpiarán por dentro.', info: 'Ideal si los anaqueles están vacíos o se pueden vaciar fácilmente.' },
    mattresses: { label: 'Colchones', detail: 'Limpieza superficial exterior del colchón.', info: 'No incluye lavado profundo ni aspirado.' },
    smallCarpets: { label: 'Alfombras pequeñas', detail: 'Sacudido y limpieza superficial.', info: 'Solo alfombras pequeñas que se puedan mover fácilmente.' },
    ovenMicrowave: { label: 'Horno / microondas', detail: 'Interior y exterior de horno o microondas.', info: 'Marca si el equipo debe limpiarse por dentro.' },
    fridge: { label: 'Refrigeradora', detail: 'Interior y exterior de refrigeradora.', info: 'Aplica aunque esté vacía o con pocos productos; se coordina antes de mover alimentos.' },
    heavyGrease: { label: 'Grasa fuerte en cocina', detail: 'Campana, cerámica, paredes cercanas o muebles.', info: 'Marca si hay grasa pegada o acumulada.' },
    highDust: { label: 'Polvo en zonas altas', detail: 'Repisas, muebles altos o marcos accesibles.', info: 'Solo zonas accesibles con seguridad.' },
    lightTrash: { label: 'Retiro ligero de basura', detail: 'Sacar fundas al basurero o juntar en un punto.', info: 'No incluye escombros, carga pesada ni residuos peligrosos.' },
    odorDetail: { label: 'Olores fuertes en local/oficina', detail: 'Olores persistentes en espacios de trabajo.', info: 'Aplica para locales u oficinas; puede requerir revisión por fotos.' },
    delicateSurfaces: { label: 'Superficies delicadas', detail: 'Acabados que requieren cuidado especial.', info: 'Marca si hay madera, mármol, piedra, metal delicado u otro material sensible.' },
    difficultAccess: { label: 'Acceso difícil', detail: 'Parqueo lejano, pisos altos sin ascensor o más de 800 m desde transporte público.', info: 'Ayuda a coordinar llegada y traslado de materiales.' },
  },
  en: {
    casa: { label: 'House', detail: 'Family home with bedrooms, bathrooms, kitchen and living areas.', info: 'Choose this if the space is lived in and has daily-use furniture or objects.' },
    departamento: { label: 'Apartment', detail: 'Compact or medium home inside a building or complex.', info: 'Usually less walking than a house, but time depends on bathrooms, kitchen, access and condition.' },
    oficina: { label: 'Office', detail: 'Workstations, meeting rooms, bathrooms and shared areas.', info: 'Select this for desks, rooms, bathrooms and common work areas.' },
    local: { label: 'Commercial space', detail: 'Stores, consulting rooms, displays and customer areas.', info: 'For spaces where the public-facing image matters.' },
    mudanza: { label: 'Move-in / move-out', detail: 'Cleaning before receiving or handing over a property.', info: 'For empty or almost empty spaces with more detail in corners, fixed furniture and bathrooms.' },
    postobra: { label: 'Post-construction', detail: 'Fine dust, light debris and first cleaning after work.', info: 'Does not include heavy rubble, complex paint removal or risky height work.' },
    compacto: { label: 'Compact', detail: 'Up to 60 m² or a few rooms.', info: 'For suites, small apartments or short walking distances.' },
    medio: { label: 'Medium', detail: 'Approximately 60 to 120 m².', info: 'Normal reference for an average home or office.' },
    amplio: { label: 'Large', detail: 'Approximately 120 to 200 m².', info: 'Adds time because there are more surfaces and walking distance.' },
    muyAmplio: { label: 'Very large', detail: 'More than 200 m² or many rooms.', info: 'Use this for several areas, more than one floor or longer walking distance.' },
    mantenimiento: { label: 'Tidy', detail: 'Cleaned a few days ago; needs a light refresh.', info: 'For spaces without visible buildup of dust, grease or stains.' },
    general: { label: 'General', detail: 'Last cleaning 1 to 2 weeks ago, normal use.', info: 'The standard level for regular home, office or store cleaning.' },
    profunda: { label: 'Deep', detail: 'More than 2 weeks or visible dust, stains or grease.', info: 'Adds detail in bathrooms, kitchen, corners and visible buildup.' },
    intensiva: { label: 'Intensive', detail: 'More than a month or heavy accumulated dirt.', info: 'For stronger buildup. It may require verification on arrival.' },
    puntual: { label: 'One-time', detail: 'One visit with the condition you select.', info: 'Calculates one cleaning visit.' },
    quincenal: { label: 'Biweekly', detail: 'Two visits per month, paid in advance.', info: 'The first visit uses your selected condition; the next is calculated as general cleaning.' },
    mensual: { label: 'Monthly', detail: 'Four visits per month, one per week.', info: 'Includes package discount. Follow-up visits are calculated as general cleaning.' },
    cliente: { label: 'Use my materials', detail: 'You provide products and tools.', info: 'Choose this if you already have suitable products and basic tools.' },
    nivoBasico: { label: 'NIVO basic', detail: 'Basic products for general cleaning.', info: 'NIVO brings what is needed for standard cleaning.' },
    nivoCompleto: { label: 'NIVO complete', detail: 'Products, cloths and tools with better coverage.', info: 'Recommended if you prefer NIVO to arrive fully prepared.' },
    normal: { label: 'Flexible', detail: 'Can be coordinated according to schedule.', info: 'No immediate priority required.' },
    pronto: { label: 'Next 48 hours', detail: 'Needs schedule priority.', info: 'Use this if you need the service soon and have some schedule flexibility.' },
    hoy: { label: 'Today / urgent', detail: 'Subject to availability.', info: 'For urgent cases, depending on schedule, distance and request time.' },
    Atuntaqui: { label: 'Atuntaqui', detail: 'NIVO initial operating base.', info: 'Choose this option if the service is within Atuntaqui.' },
    Natabuela: { label: 'Natabuela', detail: 'Coverage in Natabuela; add the exact sector.', info: 'Choose this option if the service is in Natabuela.' },
    'Andrade Marín / San Roque': { label: 'Andrade Marín / San Roque', detail: 'Antonio Ante areas close to Atuntaqui.', info: 'Choose this option if the service is in Andrade Marín or San Roque.' },
    Ibarra: { label: 'Ibarra', detail: 'Urban coverage and nearby areas.', info: 'Add the exact sector to coordinate arrival and schedule.' },
    Otavalo: { label: 'Otavalo', detail: 'Coverage toward southern Imbabura.', info: 'Add neighborhood, reference and access availability.' },
    Cotacachi: { label: 'Cotacachi', detail: 'Coverage toward Cotacachi and nearby areas.', info: 'Add the exact sector to confirm travel and schedule.' },
    Urcuquí: { label: 'Urcuquí', detail: 'Longer travel; exact sector must be confirmed.', info: 'May require additional coordination depending on distance and access.' },
    'Otro sector de Imbabura': { label: 'Other area in Imbabura', detail: 'Availability is confirmed before closing.', info: 'Write the sector or community so we can check coverage.' },
  },
};

function getOptionKey(option) {
  return option.id ?? option.value ?? option.label;
}

function getOptionText(option, field, lang) {
  const key = getOptionKey(option);

  if (lang === 'en') {
    if (optionCopy.en?.[key]?.[field]) {
      return optionCopy.en[key][field];
    }

    if (field === 'label') {
      return englishLabels[option.label] ?? option.label ?? '';
    }

    return '';
  }

  return optionCopy.es[key]?.[field] ?? option[field] ?? '';
}

function translateLabel(optionOrValue, lang) {
  if (typeof optionOrValue === 'object' && optionOrValue !== null) {
    return getOptionText(optionOrValue, 'label', lang);
  }

  return lang === 'en' ? englishLabels[optionOrValue] ?? optionOrValue : optionOrValue;
}

function buildInitialCounts() {
  const counters = [
    ...residentialCounters,
    ...moveOutCounters,
    ...postConstructionCounters,
    ...businessCounters,
    ...petCounters,
  ];

  return counters.reduce((accumulator, counter) => {
    accumulator[counter.id] = counter.defaultValue ?? 0;
    return accumulator;
  }, {});
}

function getInitialAnswers() {
  return {
    serviceType: serviceTypes[0].value,
    size: sizeOptions[1].value,
    condition: conditionOptions[1].value,
    frequency: frequencyOptions[0].value,
    materials: materialOptions[1].value,
    urgency: urgencyOptions[0].value,
    city: cityOptions[0].value,
    delicateSurface: delicateSurfaceOptions[0].value,
    delicateSurfaceOther: '',
    sector: '',
    notes: '',
    counts: buildInitialCounts(),
    extras: {},
  };
}

function isBusinessService(serviceType) {
  return businessServiceTypes.includes(serviceType);
}

function isMoveOutService(serviceType) {
  return serviceType === 'mudanza';
}

function isPostConstructionService(serviceType) {
  return serviceType === 'postobra';
}

function shouldShowPets(serviceType) {
  return serviceType === 'casa' || serviceType === 'departamento';
}

function getVisibleCounters(serviceType) {
  if (isMoveOutService(serviceType)) {
    return moveOutCounters;
  }

  if (isPostConstructionService(serviceType)) {
    return postConstructionCounters;
  }

  return isBusinessService(serviceType) ? businessCounters : residentialCounters;
}

function getVisibleExtras(serviceType) {
  return extraOptions.filter((extra) => !extra.services || extra.services.includes(serviceType));
}

function getVisibleFrequencies(serviceType) {
  if (isMoveOutService(serviceType) || isPostConstructionService(serviceType)) {
    return frequencyOptions.filter((option) => option.value === 'puntual');
  }

  return frequencyOptions;
}

function getSelectedFrequency(answers) {
  const visibleFrequencies = getVisibleFrequencies(answers.serviceType);

  return visibleFrequencies.find((option) => option.value === answers.frequency) ?? visibleFrequencies[0];
}

function formatMoney(value) {
  return `${quoteConfig.currency}${value}`;
}

function roundTo(value, step = quoteConfig.rounding) {
  return Math.round(value / step) * step;
}

function clampNumber(value, min, max) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numericValue));
}

function getExtraMaxQuantity(extraId, answers) {
  const extra = getExtraOption(extraId);

  if (extra?.pricingMode === 'roomBased') {
    return 1;
  }

  if (singleQuantityExtras.has(extraId)) {
    return 1;
  }

  if (extraId === 'beds') {
    return Math.max(1, Number(answers.counts.bedrooms || 1));
  }

  if (extraId === 'furniture') {
    return 12;
  }

  if (extraId === 'interiorGlass' || extraId === 'exteriorGlass') {
    return 20;
  }

  return 10;
}

function getExtraUnitLabel(extraId, lang = 'es') {
  if (lang === 'en') {
    const englishUnits = {
      interiorGlass: 'sections',
      exteriorGlass: 'sections',
      glassDoors: 'units',
      largeMirrors: 'mirrors',
      beds: 'beds',
      furniture: 'pieces',
      cabinetInterior: 'modules',
      mattresses: 'mattresses',
      smallCarpets: 'rugs',
      ovenMicrowave: 'appliances',
      fridge: 'appliance',
      heavyGrease: 'service',
      highDust: 'service',
      lightTrash: 'service',
      odorDetail: 'service',
      delicateSurfaces: 'service',
      difficultAccess: 'service',
    };

    return englishUnits[extraId] ?? 'units';
  }

  const labels = {
    interiorGlass: 'secciones',
    exteriorGlass: 'secciones',
    glassDoors: 'unidades',
    largeMirrors: 'espejos',
    beds: 'camas',
    furniture: 'muebles',
    cabinetInterior: 'módulos',
    mattresses: 'colchones',
    smallCarpets: 'alfombras',
    ovenMicrowave: 'equipos',
    fridge: 'equipo',
    heavyGrease: 'servicio',
    highDust: 'servicio',
    lightTrash: 'servicio',
    odorDetail: 'servicio',
    delicateSurfaces: 'servicio',
    difficultAccess: 'servicio',
  };

  return labels[extraId] ?? 'unidades';
}

function getRoomBasedUnits(extra, context) {
  if (extra.roomSource === 'bedroomKitchen') {
    if (isPostConstructionService(context.answers.serviceType)) {
      return Math.max(1, Number(context.answers.counts.postWindows || 0));
    }

    if (isMoveOutService(context.answers.serviceType)) {
      return Math.max(
        1,
        Number(context.answers.counts.emptyBedrooms || 0) + Number(context.answers.counts.emptyKitchens || 0),
      );
    }

    if (isBusinessService(context.answers.serviceType)) {
      return Math.max(
        1,
        Number(context.answers.counts.meetingRooms || 0) +
          Number(context.answers.counts.receptions || 0) +
          Number(context.answers.counts.kitchenettes || 0),
      );
    }

    return Math.max(
      1,
      Number(context.answers.counts.bedrooms || 0) + Number(context.answers.counts.kitchens || 0),
    );
  }

  return 1;
}

function calculateExtraMetrics(extra, quantity, context) {
  if (extra.pricingMode === 'roomBased') {
    const billableUnits = getRoomBasedUnits(extra, context);

    return {
      quantity: billableUnits,
      price: roundTo(billableUnits * extra.roomRate, quoteConfig.rounding),
      minutes: extra.minutes * billableUnits,
      appliesMultipliers: extra.appliesMultipliers === true,
    };
  }

  const surface = extra.requiresDetail === 'delicateSurface'
    ? getDelicateSurfaceOption(context.answers.delicateSurface)
    : null;
  const surfaceMultiplier = surface?.multiplier ?? 1;

  return {
    quantity,
    price: roundTo(extra.price * quantity * surfaceMultiplier, 0.5),
    minutes: Math.round(extra.minutes * quantity * surfaceMultiplier),
    appliesMultipliers: extra.appliesMultipliers === true,
    detailLabel: surface
      ? surface.value === 'otros' && context.answers.delicateSurfaceOther
        ? `${surface.label}: ${context.answers.delicateSurfaceOther}`
        : surface.label
      : null,
  };
}

function getPetItems(answers) {
  if (!shouldShowPets(answers.serviceType)) {
    return [];
  }

  return petCounters
    .map((counter) => {
      const quantity = Number(answers.counts[counter.id] || 0);

      return {
        id: counter.id,
        label: counter.label,
        quantity,
        price: counter.price * quantity,
        minutes: counter.minutes * quantity,
      };
    })
    .filter((item) => item.quantity > 0);
}

function getPetSummary(petItems) {
  if (!petItems.length) {
    return 'Sin mascotas';
  }

  return petItems.map((item) => `${item.label}: ${item.quantity}`).join(', ');
}

function calculateQuote(answers) {
  const serviceType = getServiceType(answers.serviceType);
  const size = getSizeOption(answers.size);
  const condition = getConditionOption(answers.condition);
  const frequency = getSelectedFrequency(answers);
  const followUpCondition = getConditionOption(frequency.followUpCondition ?? condition.value);
  const visitCount = frequency.visitCount ?? 1;
  const followUpVisitCount = Math.max(0, visitCount - 1);
  const materials = getMaterialOption(answers.materials);
  const urgency = getUrgencyOption(answers.urgency);
  const city = getCityOption(answers.city);
  const counters = getVisibleCounters(answers.serviceType);
  const visibleExtraIds = new Set(getVisibleExtras(answers.serviceType).map((extra) => extra.id));

  const areaItems = counters
    .map((counter) => {
      const quantity = Number(answers.counts[counter.id] || 0);

      return {
        id: counter.id,
        label: counter.label,
        quantity,
        price: counter.price * quantity,
        minutes: counter.minutes * quantity,
      };
    })
    .filter((item) => item.quantity > 0);

  const areaTotal = areaItems.reduce((total, item) => total + item.price, 0);

  const extraItems = Object.entries(answers.extras)
    .map(([extraId, quantity]) => {
      const extra = getExtraOption(extraId);
      const numericQuantity = Number(quantity || 0);

      if (!extra || !visibleExtraIds.has(extraId) || numericQuantity <= 0) {
        return null;
      }

      const metrics = calculateExtraMetrics(extra, numericQuantity, {
        answers,
      });

      return {
        id: extraId,
        label: extra.label,
        summaryLabel: metrics.detailLabel ? `${extra.label} (${metrics.detailLabel})` : extra.label,
        quantity: metrics.quantity,
        price: metrics.price,
        minutes: metrics.minutes,
        appliesMultipliers: metrics.appliesMultipliers,
      };
    })
    .filter(Boolean);

  const petItems = getPetItems(answers);
  const petTotal = petItems.reduce((total, item) => total + item.price, 0);
  const petMinutes = petItems.reduce((total, item) => total + item.minutes, 0);
  const variableExtraTotal = extraItems
    .filter((item) => item.appliesMultipliers)
    .reduce((total, item) => total + item.price, 0);
  const fixedExtraTotal = extraItems
    .filter((item) => !item.appliesMultipliers)
    .reduce((total, item) => total + item.price, 0);
  const extraTotal = variableExtraTotal + fixedExtraTotal;
  const laborSubtotal = serviceType.basePrice + areaTotal + variableExtraTotal + petTotal;
  const operationalFixedCharges = materials.price + city.travelFee;
  const fixedCharges = fixedExtraTotal + operationalFixedCharges;
  const firstVisitMultiplier = serviceType.multiplier * size.multiplier * condition.multiplier;
  const followUpVisitMultiplier = serviceType.multiplier * size.multiplier * followUpCondition.multiplier;
  const packageMultiplier = frequency.multiplier ?? 1;
  const firstVisitPriceMultiplier = urgency.multiplier;
  const baseSubtotal = laborSubtotal + fixedCharges;

  const minutes = [...areaItems, ...extraItems].reduce((total, item) => total + item.minutes, petMinutes);
  const firstVisitMinutes = Math.max(90, Math.round(minutes * firstVisitMultiplier));
  const followUpVisitMinutes = Math.max(90, Math.round(minutes * followUpVisitMultiplier));
  const firstVisitLaborValue = laborSubtotal * firstVisitMultiplier * firstVisitPriceMultiplier;
  const followUpVisitLaborValue = laborSubtotal * followUpVisitMultiplier;
  const packageLaborTotal = firstVisitLaborValue + (followUpVisitLaborValue * followUpVisitCount);
  const serviceFixedTotal = operationalFixedCharges * visitCount;
  const extraFixedTotal = fixedExtraTotal * visitCount;
  const packageFixedTotal = serviceFixedTotal + extraFixedTotal;
  const packageDiscount = packageLaborTotal * (1 - packageMultiplier);
  const firstVisitValue = firstVisitLaborValue + fixedCharges;
  const followUpVisitValue = followUpVisitLaborValue + fixedCharges;
  const serviceTotalBeforeExtras = (packageLaborTotal * packageMultiplier) + serviceFixedTotal;
  const estimated = roundTo(
    Math.max(quoteConfig.minPrice * visitCount, serviceTotalBeforeExtras) + extraFixedTotal,
  );
  const low = estimated;
  const high = estimated;

  const firstVisitDisplayMinutes = firstVisitMinutes + quoteConfig.timeSafetyBufferMinutes;
  const followUpVisitDisplayMinutes = followUpVisitMinutes + quoteConfig.timeSafetyBufferMinutes;
  const longestVisitDisplayMinutes = Math.max(
    firstVisitDisplayMinutes,
    followUpVisitCount > 0 ? followUpVisitDisplayMinutes : firstVisitDisplayMinutes,
  );
  const longestVisitHours = Math.max(2, Math.ceil((longestVisitDisplayMinutes / 60) * 2) / 2);
  const peopleByDuration = Math.ceil(longestVisitHours / quoteConfig.maxHoursPerPerson);
  const suggestedPeople = Math.max(quoteConfig.defaultTeamSize, peopleByDuration);
  const firstVisitHours = Math.max(
    1.5,
    Math.ceil(((firstVisitDisplayMinutes / 60) / suggestedPeople) * 2) / 2,
  );
  const followUpVisitHours = Math.max(
    1.5,
    Math.ceil(((followUpVisitDisplayMinutes / 60) / suggestedPeople) * 2) / 2,
  );
  const visitHours = firstVisitHours;
  const totalDisplayMinutes = firstVisitDisplayMinutes + (followUpVisitDisplayMinutes * followUpVisitCount);
  const totalHours = Math.max(2, Math.ceil((totalDisplayMinutes / 60) * 2) / 2);

  return {
    estimated,
    low,
    high,
    serviceType,
    size,
    condition,
    frequency,
    materials,
    petItems,
    petSummary: getPetSummary(petItems),
    urgency,
    city,
    areaItems,
    extraItems,
    areaTotal,
    extraTotal,
    baseSubtotal,
    laborSubtotal,
    variableExtraTotal,
    fixedExtraTotal,
    fixedCharges,
    firstVisitMultiplier,
    followUpVisitMultiplier,
    packageMultiplier,
    packageLaborTotal,
    packageFixedTotal,
    packageDiscount,
    visitCount,
    followUpVisitCount,
    firstVisitValue,
    followUpVisitValue,
    firstVisitDisplayMinutes,
    followUpVisitDisplayMinutes,
    totalDisplayMinutes,
    suggestedPeople,
    totalHours,
    visitHours,
    firstVisitHours,
    followUpVisitHours,
    followUpCondition,
  };
}

function getFrequencySummary(quote) {
  if (quote.visitCount <= 1) {
    return '1 visita';
  }

  return `${quote.visitCount} visitas con descuento: primera ${quote.condition.label}, siguientes ${quote.followUpCondition.label}`;
}

function getFrequencySummaryText(quote, lang = 'es') {
  if (quote.visitCount <= 1) {
    return lang === 'en' ? '1 visit' : '1 visita';
  }

  if (lang === 'en') {
    return `${quote.visitCount} visits with package discount`;
  }

  return `${quote.visitCount} visitas con descuento`;
}

function getTimeSummary(quote, lang = 'es') {
  if (quote.visitCount <= 1) {
    return lang === 'en'
      ? `Approx. ${quote.firstVisitHours} h per visit`
      : `Aprox. ${quote.firstVisitHours} h por visita`;
  }

  return lang === 'en'
    ? `First visit approx. ${quote.firstVisitHours} h; next visits approx. ${quote.followUpVisitHours} h`
    : `Primera visita aprox. ${quote.firstVisitHours} h; siguientes aprox. ${quote.followUpVisitHours} h`;
}

function buildWhatsappHref(answers, quote, lang = 'es') {
  const areaSummary = quote.areaItems.length
    ? quote.areaItems.map((item) => `${translateLabel(item.label, lang)}: ${item.quantity}`).join('\n')
    : lang === 'en' ? 'No rooms selected' : 'Sin ambientes seleccionados';

  const extraSummary = quote.extraItems.length
    ? quote.extraItems.map((item) => `${translateLabel(item.summaryLabel ?? item.label, lang)}: ${item.quantity}`).join('\n')
    : lang === 'en' ? 'No extras' : 'Sin extras';
  const petSummary = quote.petItems.length
    ? quote.petItems.map((item) => `${translateLabel(item.label, lang)}: ${item.quantity}`).join(', ')
    : lang === 'en' ? 'No pets' : 'Sin mascotas';

  if (lang === 'en') {
    const message = [
      'Hello NIVO, I want to confirm a guided cleaning quote.',
      '',
      `Space type: ${translateLabel(quote.serviceType, lang)}`,
      `Size: ${translateLabel(quote.size, lang)}`,
      `Initial condition: ${translateLabel(quote.condition, lang)}`,
      quote.followUpVisitCount > 0 ? 'Following visits: general cleaning' : null,
      `Frequency: ${translateLabel(quote.frequency, lang)} (${getFrequencySummaryText(quote, lang)})`,
      `Materials: ${translateLabel(quote.materials, lang)}`,
      `Pets: ${petSummary}`,
      `Timing: ${translateLabel(quote.urgency, lang)}`,
      '',
      'Rooms / areas:',
      areaSummary,
      '',
      'Extras:',
      extraSummary,
      '',
      `City: ${quote.city.label}`,
      `Sector / reference: ${answers.sector || 'To confirm'}`,
      `Calculated value: ${formatMoney(quote.estimated)}`,
      `Estimated time: ${getTimeSummary(quote, lang)}`,
      '',
      answers.notes ? `Notes: ${answers.notes}` : 'Notes: To confirm with photos.',
      '',
      'I understand that the information will be verified on arrival.',
    ].filter(Boolean).join('\n');

    return `${quoteConfig.whatsappBase}?text=${encodeURIComponent(message)}`;
  }

  const message = [
    'Hola NIVO, quiero confirmar una cotización guiada de limpieza.',
    '',
    `Tipo de espacio: ${translateLabel(quote.serviceType, lang)}`,
    `Tamaño: ${translateLabel(quote.size, lang)}`,
    `Estado primera visita: ${translateLabel(quote.condition, lang)}`,
    quote.followUpVisitCount > 0 ? 'Estado visitas siguientes: General' : null,
    `Frecuencia: ${translateLabel(quote.frequency, lang)} (${getFrequencySummaryText(quote, lang)})`,
    `Materiales: ${translateLabel(quote.materials, lang)}`,
    `Mascotas: ${petSummary}`,
    `Fecha deseada: ${translateLabel(quote.urgency, lang)}`,
    '',
    'Ambientes:',
    areaSummary,
    '',
    'Extras:',
    extraSummary,
    '',
    `Ciudad: ${quote.city.label}`,
    `Sector / referencia: ${answers.sector || 'Por confirmar'}`,
    `Valor calculado: ${formatMoney(quote.estimated)}`,
    `Tiempo estimado: ${getTimeSummary(quote, lang)}`,
    '',
    answers.notes ? `Observaciones: ${answers.notes}` : 'Observaciones: Por confirmar con fotos.',
    '',
    'Entiendo que el personal verificará los datos al llegar.',
  ].filter(Boolean).join('\n');

  return `${quoteConfig.whatsappBase}?text=${encodeURIComponent(message)}`;
}

function getOptionHelp(option, suffix) {
  return [option.info, option.detail, suffix].filter(Boolean).join(' ');
}

function InfoButton({ label, text }) {
  const [isOpen, setIsOpen] = useState(false);
  const infoId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef(null);
  const closeLabel = label.startsWith('More information') ? 'Close help' : 'Cerrar ayuda';

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  if (!text) {
    return null;
  }

  return (
    <div className="quote-info">
      <button
        aria-label={label}
        className="quote-info-button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        i
      </button>
      {isOpen
        ? createPortal(
            <div className="quote-info-dialog-backdrop" onMouseDown={() => setIsOpen(false)}>
              <section
                aria-describedby={descriptionId}
                aria-labelledby={infoId}
                aria-modal="true"
                className="quote-info-dialog"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="quote-info-dialog__header">
                  <span id={infoId}>{label}</span>
                  <button
                    aria-label={closeLabel}
                    className="quote-info-close"
                    onClick={() => setIsOpen(false)}
                    ref={closeButtonRef}
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <p id={descriptionId}>{text}</p>
              </section>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function ChoiceCard({ checked, detail, info, infoLabel, label, name, onChange, value }) {
  return (
    <article className="quote-choice" data-active={checked ? 'true' : 'false'}>
      <label className="quote-choice__label">
        <input checked={checked} name={name} onChange={onChange} type="radio" value={value} />
        <span className="quote-choice__mark" aria-hidden="true" />
        <span>
          <strong>{label}</strong>
          {detail ? <small>{detail}</small> : null}
        </span>
      </label>
      <InfoButton label={`${infoLabel}: ${label}`} text={info} />
    </article>
  );
}

function CounterCard({ counter, decreaseLabel, detail, increaseLabel, info, infoLabel, label, onChange, value }) {
  const currentValue = Number(value || 0);

  return (
    <article className="quote-counter">
      <div className="quote-counter__header">
        <div>
          <strong>{label}</strong>
          <small>{detail}</small>
        </div>
        <InfoButton label={`${infoLabel}: ${label}`} text={info} />
      </div>

      <div className="quote-counter__control" aria-label={counter.label}>
        <button
          type="button"
          onClick={() => onChange(counter.id, currentValue - 1)}
          aria-label={`${decreaseLabel} ${label}`}
        >
          −
        </button>
        <input
          inputMode="numeric"
          max={counter.max}
          min="0"
          onChange={(event) => onChange(counter.id, event.target.value)}
          type="number"
          value={currentValue}
        />
        <button
          type="button"
          onClick={() => onChange(counter.id, currentValue + 1)}
          aria-label={`${increaseLabel} ${label}`}
        >
          +
        </button>
      </div>
    </article>
  );
}

function StepHeader({ activeStep, lang }) {
  const current = lang === 'en' ? quoteFlowEn[activeStep] : quoteFlow[activeStep];

  return (
    <div className="quote-step-header">
      <span>{current.eyebrow}</span>
      <h1>{current.title}</h1>
      <p>{current.description}</p>
    </div>
  );
}

export default function QuoteWizard() {
  const [answers, setAnswers] = useState(getInitialAnswers);
  const [activeStep, setActiveStep] = useState(0);
  const [summaryReady, setSummaryReady] = useState(false);
  const [truthConfirmed, setTruthConfirmed] = useState(false);
  const [lang, setLang] = useState('es');

  const visibleCounters = useMemo(() => getVisibleCounters(answers.serviceType), [answers.serviceType]);
  const quote = useMemo(() => calculateQuote(answers), [answers]);
  const whatsappHref = useMemo(() => buildWhatsappHref(answers, quote, lang), [answers, quote, lang]);
  const progress = summaryReady ? 100 : ((activeStep + 1) / quoteFlow.length) * 100;
  const copy = interfaceCopy[lang] ?? interfaceCopy.es;

  useEffect(() => {
    const currentLanguage = window.localStorage.getItem('nivo-language') || document.documentElement.lang || 'es';
    const normalizedLanguage = currentLanguage === 'en' ? 'en' : 'es';

    setLang(normalizedLanguage);

    function handleLanguageChange(event) {
      setLang(event.detail?.lang === 'en' ? 'en' : 'es');
    }

    window.addEventListener('nivo:language', handleLanguageChange);

    return () => window.removeEventListener('nivo:language', handleLanguageChange);
  }, []);

  function updateField(field, value) {
    setAnswers((current) => ({
      ...current,
      [field]: value,
      ...(field === 'serviceType' && !getVisibleFrequencies(value).some((option) => option.value === current.frequency)
        ? { frequency: frequencyOptions[0].value }
        : {}),
    }));
  }

  function updateCount(counterId, value) {
    const counter = [
      ...residentialCounters,
      ...moveOutCounters,
      ...postConstructionCounters,
      ...businessCounters,
      ...petCounters,
    ].find((item) => item.id === counterId);
    const nextValue = clampNumber(value, 0, counter?.max ?? 99);

    setAnswers((current) => ({
      ...current,
      counts: {
        ...current.counts,
        [counterId]: nextValue,
      },
    }));
  }

  function toggleExtra(extraId) {
    setAnswers((current) => {
      const exists = Object.prototype.hasOwnProperty.call(current.extras, extraId);
      const nextExtras = { ...current.extras };

      if (exists) {
        delete nextExtras[extraId];
      } else {
        nextExtras[extraId] = 1;
      }

      return {
        ...current,
        extras: nextExtras,
      };
    });
  }

  function updateExtraQuantity(extraId, value) {
    const maxQuantity = getExtraMaxQuantity(extraId, answers);
    const nextValue = clampNumber(value, 1, maxQuantity);

    setAnswers((current) => ({
      ...current,
      extras: {
        ...current.extras,
        [extraId]: nextValue,
      },
    }));
  }

  function goNext() {
    setActiveStep((current) => Math.min(current + 1, quoteFlow.length - 1));
  }

  function goBack() {
    setSummaryReady(false);
    setTruthConfirmed(false);
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function finishQuote() {
    setTruthConfirmed(false);
    setSummaryReady(true);
  }

  function editQuote() {
    setTruthConfirmed(false);
    setSummaryReady(false);
  }

  function renderChoiceGrid(name, options, columns = 'auto') {
    return (
      <div className="quote-choice-grid" data-columns={columns}>
        {options.map((option) => (
          <ChoiceCard
            checked={answers[name] === option.value}
            detail={getOptionText(option, 'detail', lang)}
            info={getOptionHelp(
              {
                detail: getOptionText(option, 'detail', lang),
                info: getOptionText(option, 'info', lang),
              },
              copy.helpSuffix,
            )}
            infoLabel={copy.infoLabel}
            key={option.value}
            label={getOptionText(option, 'label', lang)}
            name={name}
            onChange={() => updateField(name, option.value)}
            value={option.value}
          />
        ))}
      </div>
    );
  }

  function renderStep() {
    if (activeStep === 0) {
      return renderChoiceGrid('serviceType', serviceTypes);
    }

    if (activeStep === 1) {
      return (
        <div className="quote-counter-grid">
          {visibleCounters.map((counter) => (
            <CounterCard
              counter={counter}
              decreaseLabel={copy.decrease}
              detail={getOptionText(counter, 'detail', lang)}
              increaseLabel={copy.increase}
              info={getOptionHelp(
                {
                  detail: getOptionText(counter, 'detail', lang),
                  info: getOptionText(counter, 'info', lang),
                },
                lang === 'en'
                  ? 'Increasing this quantity increases the estimated cleaning time.'
                  : 'Al aumentar la cantidad, sube el tiempo estimado de limpieza.',
              )}
              infoLabel={copy.infoLabel}
              key={counter.id}
              label={getOptionText(counter, 'label', lang)}
              onChange={updateCount}
              value={answers.counts[counter.id]}
            />
          ))}
        </div>
      );
    }

    if (activeStep === 2) {
      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>{copy.sections.size}</h2>
            {renderChoiceGrid('size', sizeOptions, 'four')}
          </section>

          <section>
            <h2>{copy.sections.condition}</h2>
            {renderChoiceGrid('condition', conditionOptions, 'four')}
          </section>

          <section>
            <h2>{copy.sections.frequency}</h2>
            {renderChoiceGrid('frequency', getVisibleFrequencies(answers.serviceType), 'three')}
          </section>
        </div>
      );
    }

    if (activeStep === 3) {
      const showPets = shouldShowPets(answers.serviceType);

      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>{copy.sections.materials}</h2>
            {renderChoiceGrid('materials', materialOptions, 'three')}
          </section>

          {showPets ? (
            <section>
              <h2>{copy.sections.pets}</h2>
              <div className="quote-counter-grid">
                {petCounters.map((counter) => (
                  <CounterCard
                    counter={counter}
                    decreaseLabel={copy.decrease}
                    detail={getOptionText(counter, 'detail', lang)}
                    increaseLabel={copy.increase}
                    info={getOptionHelp(
                      {
                        detail: getOptionText(counter, 'detail', lang),
                        info: getOptionText(counter, 'info', lang),
                      },
                      lang === 'en'
                        ? 'Increasing this quantity increases the estimated cleaning time.'
                        : 'Al aumentar la cantidad, sube el tiempo estimado de limpieza.',
                    )}
                    infoLabel={copy.infoLabel}
                    key={counter.id}
                    label={getOptionText(counter, 'label', lang)}
                    onChange={updateCount}
                    value={answers.counts[counter.id]}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2>{copy.sections.urgency}</h2>
            {renderChoiceGrid('urgency', urgencyOptions, 'three')}
          </section>
        </div>
      );
    }

    if (activeStep === 4) {
      const visibleExtras = getVisibleExtras(answers.serviceType);

      return (
        <div className="quote-extra-grid">
          {visibleExtras.map((extra) => {
            const selected = Object.prototype.hasOwnProperty.call(answers.extras, extra.id);
            const quantity = answers.extras[extra.id] ?? 1;
            const maxQuantity = getExtraMaxQuantity(extra.id, answers);
            const extraLabel = getOptionText(extra, 'label', lang);
            const extraDetail = getOptionText(extra, 'detail', lang);
            const extraInfo = getOptionHelp(
              {
                detail: extraDetail,
                info: getOptionText(extra, 'info', lang),
              },
              copy.helpSuffix,
            );

            return (
              <article className="quote-extra" data-active={selected ? 'true' : 'false'} key={extra.id}>
                <div className="quote-extra__header">
                  <label>
                    <input checked={selected} onChange={() => toggleExtra(extra.id)} type="checkbox" />
                    <span>
                      <strong>{extraLabel}</strong>
                      {extraDetail ? <small>{extraDetail}</small> : null}
                    </span>
                  </label>
                  <InfoButton label={`${copy.infoLabel}: ${extraLabel}`} text={extraInfo} />
                </div>

                {selected && maxQuantity > 1 ? (
                  <div className="quote-extra__quantity">
                    <span>{getExtraUnitLabel(extra.id, lang)}</span>
                    <div className="quote-counter__control">
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(extra.id, Number(quantity) - 1)}
                        aria-label={`${copy.decrease} ${extraLabel}`}
                      >
                        −
                      </button>
                      <input
                        inputMode="numeric"
                        max={maxQuantity}
                        min="1"
                        onChange={(event) => updateExtraQuantity(extra.id, event.target.value)}
                        type="number"
                        value={quantity}
                      />
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(extra.id, Number(quantity) + 1)}
                        aria-label={`${copy.increase} ${extraLabel}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}

                {selected && extra.requiresDetail === 'delicateSurface' ? (
                  <div className="quote-extra__detail">
                    <label className="quote-field quote-field--compact">
                      <span>{copy.sections.surfaceType}</span>
                      <select
                        onChange={(event) => updateField('delicateSurface', event.target.value)}
                        value={answers.delicateSurface}
                      >
                        {delicateSurfaceOptions.map((surface) => (
                          <option key={surface.value} value={surface.value}>
                            {getOptionText(surface, 'label', lang)}
                          </option>
                        ))}
                      </select>
                    </label>

                    {answers.delicateSurface === 'otros' ? (
                      <label className="quote-field quote-field--compact">
                        <span>{copy.sections.materialName}</span>
                        <input
                          onChange={(event) => updateField('delicateSurfaceOther', event.target.value)}
                          placeholder={copy.placeholders.surfaceOther}
                          type="text"
                          value={answers.delicateSurfaceOther}
                        />
                      </label>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      );
    }

    if (activeStep === 5) {
      return (
        <div className="quote-location-grid">
          <section>
            <h2>{copy.sections.city}</h2>
            {renderChoiceGrid('city', cityOptions)}
          </section>

          <label className="quote-field">
            <span>{copy.sections.sector}</span>
            <input
              onChange={(event) => updateField('sector', event.target.value)}
              placeholder={copy.placeholders.sector}
              type="text"
              value={answers.sector}
            />
          </label>

          <label className="quote-field quote-field--wide">
            <span>{copy.sections.notes}</span>
            <textarea
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder={copy.placeholders.notes}
              value={answers.notes}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="quote-final">
        <div className="quote-final__price">
          <span>{copy.calculatedValue}</span>
          <strong>{formatMoney(quote.estimated)}</strong>
          <p>
            {quote.visitCount <= 1
              ? `${getTimeSummary(quote, lang)}.`
              : `${getFrequencySummaryText(quote, lang)} · ${getTimeSummary(quote, lang)}.`}
          </p>
        </div>

        <div className="quote-final__grid">
          <article>
            <span>{copy.service}</span>
            <strong>{translateLabel(quote.serviceType, lang)}</strong>
          </article>
          <article>
            <span>{copy.initialState}</span>
            <strong>{translateLabel(quote.condition, lang)}</strong>
          </article>
          <article>
            <span>{copy.frequency}</span>
            <strong>{getFrequencySummaryText(quote, lang)}</strong>
          </article>
          <article>
            <span>{copy.city}</span>
            <strong>{quote.city.label}</strong>
          </article>
        </div>

        <div className="quote-breakdown">
          <h2>{copy.included}</h2>
          <ul>
            {quote.areaItems.map((item) => (
              <li key={item.id}>{translateLabel(item.label, lang)}: {item.quantity}</li>
            ))}
            {quote.extraItems.map((item) => (
              <li key={item.id}>{translateLabel(item.summaryLabel ?? item.label, lang)}: {item.quantity}</li>
            ))}
          </ul>
        </div>

      </div>
    );
  }

  if (summaryReady) {
    return (
      <div className="quote-page-wizard quote-page-wizard--summary">
        <div className="quote-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <article className="quote-summary-card">
          <div className="quote-summary-card__header">
            <span>{lang === 'en' ? 'Quote ready' : 'Cotización lista'}</span>
            <h1>{lang === 'en' ? 'Cleaning summary' : 'Resumen de tu limpieza'}</h1>
            <strong>{formatMoney(quote.estimated)}</strong>
            <p>{getFrequencySummaryText(quote, lang)} · {getTimeSummary(quote, lang)}</p>
          </div>

          <div className="quote-final__grid">
            <article>
              <span>{copy.service}</span>
              <strong>{translateLabel(quote.serviceType, lang)}</strong>
            </article>
            <article>
              <span>{copy.initialState}</span>
              <strong>{translateLabel(quote.condition, lang)}</strong>
            </article>
            <article>
              <span>{copy.city}</span>
              <strong>{quote.city.label}</strong>
            </article>
            <article>
              <span>{copy.estimatedTime}</span>
              <strong>{getTimeSummary(quote, lang)}</strong>
            </article>
          </div>

          <div className="quote-breakdown">
            <h2>{copy.clientSummary}</h2>
            <ul>
              {quote.areaItems.map((item) => (
                <li key={item.id}>{translateLabel(item.label, lang)}: {item.quantity}</li>
              ))}
              {quote.extraItems.map((item) => (
                <li key={item.id}>{translateLabel(item.summaryLabel ?? item.label, lang)}: {item.quantity}</li>
              ))}
            </ul>
          </div>

          <label className="quote-verification-check">
            <input
              checked={truthConfirmed}
              onChange={(event) => setTruthConfirmed(event.target.checked)}
              type="checkbox"
            />
            <span>
              <strong>{copy.verifiedTitle}</strong>
              <small>{copy.verifiedText}</small>
            </span>
          </label>

          <div className="quote-summary-actions">
            <button className="quote-nav-button quote-nav-button--ghost" onClick={editQuote} type="button">
              {copy.edit}
            </button>
            {truthConfirmed ? (
              <a className="quote-result__button" href={whatsappHref} target="_blank" rel="noreferrer">
                {copy.confirmWhatsapp}
              </a>
            ) : (
              <button className="quote-result__button" disabled type="button">
                {copy.confirmWhatsapp}
              </button>
            )}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="quote-page-wizard">
      <div className="quote-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="quote-wizard-panel">
        <div className="quote-main-panel">
          <StepHeader activeStep={activeStep} lang={lang} />
          {renderStep()}

          <div className="quote-navigation">
            <button className="quote-nav-button quote-nav-button--ghost" disabled={activeStep === 0} onClick={goBack} type="button">
              {copy.back}
            </button>

            {activeStep < quoteFlow.length - 1 ? (
              <button className="quote-nav-button" onClick={goNext} type="button">
                {copy.next}
              </button>
            ) : (
              <button className="quote-nav-button" onClick={finishQuote} type="button">
                {copy.finish}
              </button>
            )}
          </div>
        </div>

        <aside className="quote-live-summary" aria-live="polite">
          <span className="quote-live-summary__label">{copy.liveValue}</span>
          <strong>{formatMoney(quote.estimated)}</strong>
          <p>{getFrequencySummaryText(quote, lang)}</p>
          <p className="quote-live-summary__time">{getTimeSummary(quote, lang)}</p>
        </aside>
      </div>
    </div>
  );
}
