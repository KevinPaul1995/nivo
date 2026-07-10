export const site = {
  name: 'NIVO',
  legalName: 'NIVO Limpieza',
  descriptor: 'Limpieza profesional',
  url: 'https://www.nivolimpieza.com/',
  description:
    'Limpieza profesional de casas, departamentos, oficinas y locales en Ibarra, Atuntaqui, Cotacachi y Otavalo. Servicio con o sin materiales incluidos.',
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
    description: 'Limpieza para hogares que necesitan orden, claridad y una visita bien coordinada.',
    items: ['Cocinas y baños', 'Dormitorios', 'Áreas sociales'],
  },
  {
    title: 'Oficinas',
    description: 'Ambientes de trabajo limpios, presentables y listos para equipos o clientes.',
    items: ['Puestos de trabajo', 'Salas de reunión', 'Zonas comunes'],
  },
  {
    title: 'Empresas',
    description: 'Limpieza para locales, consultorios y espacios donde la imagen importa.',
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
      'Atendemos Ibarra, Atuntaqui, Cotacachi y Otavalo. Si tu sector está cerca de estas ciudades, podemos revisar disponibilidad por WhatsApp.',
  },
  {
    question: '¿Puedo contratar con o sin materiales?',
    answer:
      'Sí. Puedes usar tus propios productos o pedir que NIVO lleve materiales básicos o completos. Lo eliges en el cotizador antes de confirmar.',
  },
  {
    question: '¿Qué espacios limpian?',
    answer:
      'Trabajamos en casas, departamentos, oficinas, locales y espacios de entrega o post obra ligera. El cotizador adapta las preguntas según el tipo de espacio.',
  },
  {
    question: '¿El valor del cotizador es el valor final?',
    answer:
      'Sí, siempre que los datos ingresados sean reales. Al llegar verificamos ambientes, estado del espacio, acceso y extras seleccionados.',
  },
];
