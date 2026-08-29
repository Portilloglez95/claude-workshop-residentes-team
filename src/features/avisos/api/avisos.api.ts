import type { Aviso } from '../types'

function hace(dias: number, horas = 0): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  fecha.setHours(fecha.getHours() - horas)
  return fecha.toISOString()
}

// TODO: reemplazar por `apiClient.get<Aviso[]>('/avisos')` cuando el backend
// esté disponible. Se deja mockeado para que la UI se pueda construir en
// paralelo sin depender de la API.
const MOCK_AVISOS: Aviso[] = [
  {
    id: 'a1',
    titulo: 'Corte de agua programado',
    cuerpo:
      'Les informamos que el próximo sábado se realizará mantenimiento correctivo a la cisterna principal y al sistema de bombeo del condominio. Por este motivo, el servicio de agua potable estará suspendido en todas las torres desde las 8:00 a.m. hasta aproximadamente la 1:00 p.m.\n\nEl trabajo consiste en la limpieza y desinfección de la cisterna, además de la revisión de válvulas y empaques que han presentado fugas menores en las últimas semanas. Recomendamos almacenar agua suficiente para consumo y aseo antes de esa fecha, especialmente si tienen niños pequeños o adultos mayores en casa.\n\nSi el corte se extiende más allá del horario previsto, se les notificará por este mismo medio. Ante cualquier duda o emergencia relacionada con el suministro de agua, pueden comunicarse con administración al (555) 123-4567 o por WhatsApp al (555) 987-6543, en horario de 8:00 a.m. a 5:00 p.m.',
    fecha: hace(0, 3),
    autor: 'Administración',
    categoria: 'emergencia',
    fijado: true,
    leido: false,
  },
  {
    id: 'a2',
    titulo: 'Mantenimiento de ascensores',
    cuerpo:
      'La empresa Elevadores Cóndor realizará mantenimiento preventivo trimestral a los dos ascensores de la Torre A el día miércoles, de 9:00 a.m. a 12:00 p.m. Durante ese horario, ambos ascensores permanecerán fuera de servicio.\n\nSe revisarán los cables de tracción, el sistema de frenos y los sensores de puertas, como parte del programa de mantenimiento preventivo del edificio. Les pedimos utilizar las escaleras de emergencia durante este período y programar con anticipación cualquier mudanza o traslado de mobiliario pesado.\n\nSi tienen alguna condición de movilidad reducida y necesitan apoyo durante el corte de servicio, por favor avisen a conserjería con anticipación al (555) 123-4567, anexo 2, o escriban a mantenimiento@condoo.com.',
    fecha: hace(2),
    autor: 'Administración',
    categoria: 'mantenimiento',
    fijado: false,
    leido: false,
  },
  {
    id: 'a3',
    titulo: 'Convocatoria a asamblea ordinaria',
    cuerpo:
      'Se convoca a todos los propietarios y residentes a la Asamblea Ordinaria de Propietarios, que se llevará a cabo el próximo lunes a las 7:00 p.m. en el salón de eventos del condominio. En caso de no alcanzar el quórum requerido, la asamblea se instalará en segunda convocatoria a las 7:30 p.m. con los propietarios presentes.\n\nEn esta sesión se presentará el informe financiero del segundo trimestre, se someterá a votación el presupuesto de mantenimiento para el próximo año y se discutirá la propuesta de renovación del área de juegos infantiles.\n\nSi no puede asistir, puede designar a otro propietario como representante mediante una carta poder simple, disponible con administración. Les pedimos confirmar su asistencia antes del viernes al correo administracion@condoo.com o al teléfono (555) 123-4567.',
    fecha: hace(5),
    autor: 'Junta Directiva',
    categoria: 'administrativo',
    fijado: false,
    leido: false,
  },
  {
    id: 'a4',
    titulo: 'Celebración de fin de año',
    cuerpo:
      'Este año celebraremos la fiesta de fin de año del condominio a partir de las 6:00 p.m. en el área de piscina y BBQ. Habrá actividades para niños, un DJ en vivo y una cena comunitaria por orden de llegada.\n\nPedimos a cada familia confirmar el número de asistentes e indicar si tienen alguna restricción alimentaria, ya que el menú se está definiendo con el proveedor de catering. También estamos buscando voluntarios para apoyar con la decoración y el sonido; si les interesa colaborar, avísennos.\n\nPara confirmar su asistencia o resolver dudas sobre el evento, escriban al comité social por WhatsApp al (555) 234-5678 antes del viernes.',
    fecha: hace(8),
    autor: 'Comité Social',
    categoria: 'social',
    fijado: false,
    leido: true,
  },
  {
    id: 'a5',
    titulo: 'Fumigación de áreas comunes',
    cuerpo:
      'El equipo de control de plagas de la empresa Fumiplagas S.A. realizará fumigación preventiva en pasillos, áreas comunes y sótanos de estacionamiento el jueves, entre las 6:00 a.m. y las 8:00 a.m.\n\nEl producto utilizado es de baja toxicidad y compatible con mascotas una vez seco, pero por precaución les recomendamos mantener puertas y ventanas de sus unidades cerradas durante ese horario y no permitir que mascotas o niños transiten por las áreas fumigadas hasta las 10:00 a.m.\n\nSi tienen mascotas con sensibilidad respiratoria o alguna condición médica que requiera evitar el contacto con el producto, por favor infórmenlo a administración al (555) 123-4567 para coordinar una alternativa.',
    fecha: hace(12),
    autor: 'Administración',
    categoria: 'mantenimiento',
    fijado: false,
    leido: true,
  },
  {
    id: 'a6',
    titulo: 'Actualización del reglamento interno',
    cuerpo:
      'La Junta Directiva, en sesión reciente, aprobó modificaciones al reglamento interno relacionadas con el uso de áreas comunes, horarios de mudanza y el proceso de autorización para remodelaciones dentro de las unidades.\n\nEntre los cambios más relevantes se incluye la ampliación del horario permitido para mudanzas (ahora de 8:00 a.m. a 6:00 p.m. de lunes a sábado) y un nuevo formulario de solicitud para reservar el salón de eventos con más de 15 días de anticipación.\n\nEl documento completo con el detalle de los cambios estará disponible próximamente en la sección de Documentos. Si tienen observaciones o preguntas, pueden enviarlas por escrito a la Junta Directiva al correo juntadirectiva@condoo.com.',
    fecha: hace(20),
    autor: 'Junta Directiva',
    categoria: 'administrativo',
    fijado: false,
    leido: true,
  },
]

export async function fetchAvisos(): Promise<Aviso[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_AVISOS
}
