export interface SkuItem {
  /** Identificador corto para referenciarlo desde specs (no sensible a espacios) */
  alias: string;
  /** SKU exacto que se escribirá en la barra de búsqueda */
  sku: string;
  /** (opcional) descripción para documentación o asserts futuros */
  descripcion?: string;
}
