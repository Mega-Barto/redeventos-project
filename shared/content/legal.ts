import { COMMITMENT_VERSION, PRIVACY_VERSION } from '../constants/domain'

export const privacyContent = {
  title: 'Aviso de privacidad',
  version: PRIVACY_VERSION,
  intro:
    'Borrador del piloto. El responsable del tratamiento es una persona natural. Este texto debe revisarse antes de producción.',
  sections: [
    {
      title: 'Qué datos recogemos',
      body: 'Nombre, correo, Instagram y sitio web como contacto público. WhatsApp y teléfono como contacto directo. Datos del evento, del espacio, de las propuestas y de la evidencia de realización.',
    },
    {
      title: 'Para qué',
      body: 'Crear tu cuenta, mostrar oportunidades a sponsors, registrar propuestas y compromisos, y revelar WhatsApp y teléfono solo a la otra parte cuando una propuesta se acepta.',
    },
    {
      title: 'Quién los ve',
      body: 'Correo, Instagram y web pueden verse en tu perfil y en la oportunidad. WhatsApp y teléfono no salen en el sello, en la ficha pública ni en el material del local. El asistente no crea cuenta y no entrega datos a Redeventos para inscribirse.',
    },
    {
      title: 'Territorio y conservación',
      body: 'El piloto opera en Pereira y Dosquebradas. Los datos se conservan mientras la cuenta esté activa. Si el moderador desafilia una cuenta, el perfil deja de mostrarse en la red.',
    },
  ],
} as const

export const commitmentContent = {
  title: 'Compromiso de registro',
  version: COMMITMENT_VERSION,
  intro:
    'Se acepta al crear la cuenta, antes de publicar un evento, un espacio o un aporte. Es distinto del compromiso de match, que nace al aceptar una propuesta.',
  rules: [
    'Publicar información veraz sobre el evento, el espacio o el aporte.',
    'No usar la plataforma para fiestas privadas, eventos masivos o corporativos cerrados.',
    'No registrar montos, pagos ni comisiones: el piloto solo anota aportes en especie o difusión.',
    'Coordinar por los contactos directos después del match y cumplir lo aceptado: qué, cuánto y cuándo.',
    'No publicar WhatsApp ni teléfono de otra persona, ni pedirlos antes de que haya un match aceptado.',
    'Aceptar que incumplir el compromiso de registro o el de match es causal de desafiliación.',
  ],
  closing:
    'El moderador revisa evidencias, contenido reportado y desafiliaciones. No aprueba publicaciones ni matches.',
} as const

export const matchCommitmentContent = {
  title: 'Compromiso de match',
  body: 'Al aceptar, las dos partes se comprometen con el aporte concreto de esta propuesta: qué se cubre, en qué cantidad y en qué fecha. Incumplirlo es causal para que el moderador desafilie a quien falló.',
} as const
