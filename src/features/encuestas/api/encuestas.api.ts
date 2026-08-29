import type { Encuesta } from '../types'

function hace(dias: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  return fecha.toISOString()
}

function en(dias: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  return fecha.toISOString()
}

// TODO: reemplazar por `apiClient.get<Encuesta[]>('/encuestas')` cuando el
// backend esté disponible. Se deja mockeado para construir la UI en paralelo
// sin depender de la API.
const MOCK_ENCUESTAS: Encuesta[] = [
  {
    id: 'e1',
    pregunta: '¿Qué horario prefieres para el uso de la alberca?',
    descripcion:
      'Estamos ajustando el horario de la alberca para la temporada de calor. Queremos conocer la preferencia de los residentes antes de definir el nuevo reglamento de uso.',
    fechaApertura: hace(2),
    fechaCierre: en(1),
    autor: 'Administración',
    estado: 'abierta',
    opciones: [
      { id: 'e1-o1', texto: '7:00 a.m. – 9:00 p.m. (ampliado)', votos: 34 },
      { id: 'e1-o2', texto: '8:00 a.m. – 8:00 p.m. (actual)', votos: 12 },
      { id: 'e1-o3', texto: '9:00 a.m. – 6:00 p.m. (reducido)', votos: 5 },
    ],
    opcionVotada: null,
  },
  {
    id: 'e2',
    pregunta: '¿Aprueba la renovación del área de juegos infantiles?',
    descripcion:
      'La propuesta contempla sustituir los juegos actuales por equipo nuevo con piso de caucho, con un costo estimado de $180,000 tomados del fondo de reserva. El resultado se presentará en la próxima asamblea.',
    fechaApertura: hace(5),
    fechaCierre: en(6),
    autor: 'Junta Directiva',
    estado: 'abierta',
    opciones: [
      { id: 'e2-o1', texto: 'A favor', votos: 41 },
      { id: 'e2-o2', texto: 'En contra', votos: 18 },
      { id: 'e2-o3', texto: 'Me abstengo', votos: 7 },
    ],
    opcionVotada: null,
  },
  {
    id: 'e3',
    pregunta: '¿Qué día prefieres para la recolección de reciclaje?',
    descripcion:
      'El proveedor de reciclaje puede pasar un día entre semana. Elegiremos el día con más votos a partir del próximo mes.',
    fechaApertura: hace(9),
    fechaCierre: en(3),
    autor: 'Comité de Sustentabilidad',
    estado: 'abierta',
    opciones: [
      { id: 'e3-o1', texto: 'Martes', votos: 22 },
      { id: 'e3-o2', texto: 'Jueves', votos: 29 },
      { id: 'e3-o3', texto: 'Sábado', votos: 15 },
    ],
    opcionVotada: 'e3-o2',
  },
  {
    id: 'e4',
    pregunta: '¿Debe permitirse el uso del salón de eventos después de las 10 p.m.?',
    descripcion:
      'Consulta previa a la modificación del reglamento interno. Los resultados fueron considerados por la Junta Directiva en la sesión del mes pasado.',
    fechaApertura: hace(40),
    fechaCierre: hace(12),
    autor: 'Junta Directiva',
    estado: 'cerrada',
    opciones: [
      { id: 'e4-o1', texto: 'Sí, hasta la medianoche', votos: 19 },
      { id: 'e4-o2', texto: 'No, mantener el límite actual', votos: 47 },
    ],
    opcionVotada: 'e4-o2',
  },
  {
    id: 'e5',
    pregunta: '¿Qué proveedor de internet prefieres para las áreas comunes?',
    descripcion:
      'Se evaluaron tres proveedores con cobertura en la zona. La opción ganadora fue contratada en junio.',
    fechaApertura: hace(70),
    fechaCierre: hace(45),
    autor: 'Administración',
    estado: 'cerrada',
    opciones: [
      { id: 'e5-o1', texto: 'Telmex', votos: 26 },
      { id: 'e5-o2', texto: 'Totalplay', votos: 38 },
      { id: 'e5-o3', texto: 'Izzi', votos: 9 },
    ],
    opcionVotada: null,
  },
]

export async function fetchEncuestas(): Promise<Encuesta[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_ENCUESTAS
}
