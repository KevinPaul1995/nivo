export const site = {
  name: 'NIVO',
  legalName: 'NIVO Limpieza',
  descriptor: 'Limpieza profesional',
  url: 'https://www.nivolimpieza.com/',
  description:
    'Limpieza profesional de casas, oficinas y empresas en Ibarra, Atuntaqui, Cotacachi y Otavalo. Servicio con o sin materiales incluidos.',
  serviceAreas: ['Ibarra', 'Atuntaqui', 'Cotacachi', 'Otavalo'],
  navItems: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Cobertura', href: '#calidad' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Contacto', href: '#contacto' },
  ],
  contact: {
    phoneLabel: '0996583089',
    phoneHref: 'tel:+593996583089',
    phoneInternational: '+593996583089',
    whatsappLabel: 'Cotizar por WhatsApp',
    whatsappHref:
      'https://wa.me/593996583089?text=Hola%20NIVO%2C%20quiero%20cotizar%20un%20servicio%20de%20limpieza.',
    email: 'contacto@nivolimpieza.com',
  },
};

export const coverageItems = [
  { city: 'Ibarra' },
  { city: 'Atuntaqui' },
  { city: 'Cotacachi' },
  { city: 'Otavalo' },
];

export const services = [
  {
    title: 'Casas',
    description:
      'Para mantener tu hogar limpio sin reorganizar tu día alrededor de la limpieza.',
    items: ['Cocinas y baños', 'Dormitorios', 'Áreas sociales'],
  },
  {
    title: 'Oficinas',
    description:
      'Ambientes de trabajo limpios, ordenados y presentables para equipos y visitas.',
    items: ['Puestos de trabajo', 'Salas de reunión', 'Zonas comunes'],
  },
  {
    title: 'Empresas',
    description:
      'Limpieza para locales, consultorios y espacios donde la imagen importa.',
    items: ['Áreas de atención', 'Superficies de contacto', 'Mantenimiento'],
  },
];

export const serviceNotes = [
  'Con o sin materiales incluidos',
  'Cotización por WhatsApp',
  'Revisión final del espacio',
];

export const faqItems = [
  {
    question: '¿En qué ciudades trabaja NIVO?',
    answer:
      'Atendemos Ibarra, Atuntaqui, Cotacachi y Otavalo. Si tu ubicación está cerca de estas zonas, puedes escribirnos para revisar disponibilidad y coordinar el horario más conveniente.',
  },
  {
    question: '¿El servicio puede incluir materiales?',
    answer:
      'Sí. Podemos cotizar con materiales incluidos o trabajar con los productos que ya tienes en tu casa, oficina o empresa. Lo definimos antes de agendar para que el alcance quede claro.',
  },
  {
    question: '¿Qué tipo de espacios limpian?',
    answer:
      'Trabajamos en casas, oficinas, locales, consultorios y empresas. El servicio puede ser puntual o recurrente, según el uso del espacio y el nivel de mantenimiento que necesitas.',
  },
  {
    question: '¿Qué información ayuda para cotizar mejor?',
    answer:
      'Escríbenos al 0996583089 o a contacto@nivolimpieza.com con ciudad, tipo de espacio, tamaño aproximado, frecuencia deseada y si prefieres limpieza con o sin materiales incluidos. Si puedes enviar fotos, la cotización será más precisa.',
  },
];
