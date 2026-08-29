// TODO: reemplazar por el residente autenticado cuando exista sesión real.
// `condominioId` es clave para la privacidad: Condoo administra varios
// condominios y este valor es lo que un backend real usaría (vía el
// token de sesión) para no devolverle a un residente datos de otro
// edificio — ver `residentes/api/residentes.api.ts`.
export const RESIDENTE_ACTUAL = {
  nombre: 'María Pérez',
  unidad: 'A-101',
  condominioId: 'las-palmas',
}
