export const homeHeroContent = {
  title: 'La red hace posible el evento',
  description:
    'Redeventos ayuda a comunidades de Pereira y Dosquebradas a realizar eventos gratuitos o de bajo costo. Publicas el evento, dices qué necesitas y los espacios y aliados te proponen cómo cubrirlo.',
  primaryCta: { label: 'Publicar evento', to: '/register?role=organizer' },
  secondaryCta: { label: 'Ofrecer espacio o apoyo', to: '/register' },
} as const

export const homeProblemContent = {
  id: 'problema',
  headline: 'El problema',
  title: 'El evento se traba antes de existir',
  description:
    'En Pereira y Dosquebradas cuesta encontrar espacio, apoyo y una vía clara para que un negocio local se sume. Redeventos no es una agenda: responde cómo el evento consigue lo que necesita.',
  items: [
    {
      title: 'Falta de espacios',
      description:
        'Un evento gratuito o de bajo costo no siempre encuentra un lugar. Hay espacios disponibles y no hay un sitio único para descubrirlos y proponerles el evento.',
      icon: 'i-lucide-building-2',
    },
    {
      title: 'Apoyo difícil de conseguir',
      description:
        'Hacen falta alimentación, equipos, materiales, servicios o difusión. Quien organiza no siempre sabe qué negocios locales querrían apoyar.',
      icon: 'i-lucide-hand-helping',
    },
    {
      title: 'Pocas vías para el negocio local',
      description:
        'Un negocio puede querer darse a conocer o apoyar una comunidad, y no tiene un mecanismo simple para encontrar eventos relevantes.',
      icon: 'i-lucide-store',
    },
  ],
} as const

export const homeHowContent = {
  id: 'como-funciona',
  headline: 'Cómo funciona',
  title: 'La plataforma registra. Las personas cierran el match.',
  description:
    'No hay un operador en el medio. Cualquiera de los dos lados propone. Al aceptar, queda un compromiso y se revelan los contactos directos.',
  steps: [
    {
      title: 'Publicas la necesidad',
      description: 'El organizador describe el evento, el enlace de inscripción y qué hace falta, con cantidad.',
      icon: 'i-lucide-megaphone',
    },
    {
      title: 'Llega una propuesta',
      description: 'El organizador o el sponsor propone cubrir una necesidad, con cantidad y fecha.',
      icon: 'i-lucide-send',
    },
    {
      title: 'Queda el compromiso',
      description: 'La otra parte acepta. El compromiso dice qué, cuánto y cuándo.',
      icon: 'i-lucide-handshake',
    },
    {
      title: 'Coordinan fuera',
      description: 'Se revelan WhatsApp y teléfono. No hay chat dentro de Redeventos.',
      icon: 'i-lucide-phone',
    },
  ],
} as const

export const homeProfilesContent = {
  id: 'perfiles',
  headline: 'Tres perfiles',
  title: 'Una cuenta puede tener más de un rol',
  description:
    'Organizador, venue sponsor y local sponsor conviven en la misma persona. Sponsor y aliado local son el mismo tipo de usuario: cambia el aporte, no la cuenta. El asistente no se registra.',
  profiles: [
    {
      title: 'Organizador',
      description:
        'Estamos creando Redeventos para ayudar a comunidades de Pereira y Dosquebradas a realizar eventos gratuitos o de bajo costo. Publicas el evento, dices qué necesitas y los espacios y aliados te proponen cómo cubrirlo.',
      cta: 'Publicar evento',
      to: '/register?role=organizer',
      icon: 'i-lucide-calendar-plus',
    },
    {
      title: 'Venue sponsor',
      description:
        'Hay organizadores buscando espacio. Publica el tuyo, con su capacidad y sus condiciones, y recibe propuestas de eventos que pueden encajar.',
      cta: 'Publicar espacio',
      to: '/register?role=venue_sponsor',
      icon: 'i-lucide-building',
    },
    {
      title: 'Local sponsor',
      description:
        'Puedes apoyar un evento con productos, alimentación, equipos, servicios o difusión. Ves oportunidades concretas y envías una propuesta. A cambio, el evento ofrece visibilidad y activación.',
      cta: 'Ofrecer apoyo',
      to: '/register?role=local_sponsor',
      icon: 'i-lucide-hand-heart',
    },
  ],
} as const

export const homeTrustContent = {
  id: 'confianza',
  headline: 'En el piloto',
  title: 'Reglas claras, sin dinero de por medio',
  items: [
    {
      title: 'Sin pagos ni comisión',
      description: 'Los aportes se anotan como cantidad o descripción. No hay montos, pasarela ni retención.',
      icon: 'i-lucide-ban',
    },
    {
      title: 'La inscripción vive fuera',
      description:
        'El enlace de RSVP es obligatorio. Redeventos no crea la lista de asistentes ni pide cuenta al público.',
      icon: 'i-lucide-external-link',
    },
    {
      title: 'Contacto en dos momentos',
      description: 'Correo, Instagram y web son públicos. WhatsApp y teléfono aparecen solo al aceptar el match.',
      icon: 'i-lucide-shield',
    },
    {
      title: 'Pereira y Dosquebradas',
      description: 'El piloto es en español, con fechas en hora de Bogotá. Otras ciudades quedan para después.',
      icon: 'i-lucide-map-pin',
    },
  ],
} as const

export const homeCtaContent = {
  title: 'Empieza por el evento que ya quieres hacer',
  description:
    'La red inicial se construye con organizadores que tienen una necesidad real. Publica el evento y deja que espacios y aliados te propongan cómo cubrirlo.',
  primaryCta: { label: 'Crear cuenta y publicar', to: '/register?role=organizer' },
  secondaryCta: { label: 'Ya tengo cuenta', to: '/login' },
} as const
