import data from '../sets/search-sku.set.json';
import type { SkuItem } from '../models/search.model';

const DATA: SkuItem[] = data as SkuItem[];

function normalizar(alias: string) {
  return alias.trim().toLowerCase().replace(/\s+/g, '_');
}

/** Devuelve todos los SKUs disponibles */
export function getSkus(): SkuItem[] {
  return DATA;
}

/** Busca por alias (case/space insensitive). Lanza error si no existe. */
export function getSkuByAlias(alias: string): SkuItem {
  const a = normalizar(alias);
  const found = DATA.find(x => normalizar(x.alias) === a);
  if (!found) {
    throw new Error(`No existe SKU con alias "${alias}". Revisa src/data/sets/search-sku.set.json`);
  }
  return found;
}

/** Devuelve el string del SKU por alias (azúcar sintáctica) */
export function sku(alias: string): string {
  return getSkuByAlias(alias).sku;
}
