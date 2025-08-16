import { TReceipe } from '@/lib/types/recipe';
import { openDB } from 'idb';

const DB_NAME = 'receipe-existing-products';
const STORE_NAME = 'receipe-existing-products';
const DELETED_STORE_NAME = 'deleted-receipe-existing-products';

export async function getDB() {
  return openDB(DB_NAME, 3, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: '_id' });
        };
      };
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(DELETED_STORE_NAME)) {
          db.createObjectStore(DELETED_STORE_NAME, { keyPath: '_id' });
        };
      };
    },
  });
};

// Сохранение продуктов
export async function saveRecipe(recipes: TReceipe[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const recipe of recipes) {
    await tx.store.put(recipe);
  };
  await tx.done;
};

export async function getRecipes(): Promise<TReceipe[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.store;
  const recipes = await store.getAll();
  await tx.done;
  return recipes;
};
