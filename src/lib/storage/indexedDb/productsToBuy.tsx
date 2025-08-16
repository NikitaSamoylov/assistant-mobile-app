import { TBuyProducts } from '@/lib/types/product';
import { openDB } from 'idb';

const DB_NAME = 'shopping-list-db';
const STORE_NAME = 'shopping-products';
const DELETED_STORE_NAME = 'deleted-shopping-products';

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
export async function saveShoppingProducts(products: (TBuyProducts & { isSent?: boolean })[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const product of products) {
    await tx.store.put(product);
  };
  await tx.done;
};

// Получение листа на покупку
export async function getShoppingProducts(value: string = '') {
  const db = await getDB();
  const allItems = await db.getAll(STORE_NAME);
  if (!value) {
    return allItems;
  };
  return allItems.filter(el => el.title.toLowerCase().includes(value.toLowerCase()));
};

// Очистка списка
export async function clearShoppingList() {
  const db = await getDB();
  await db.clear(STORE_NAME);
};

//=====================================удаление из существующих
export async function deleteProductsFromShopping(products: (TBuyProducts & { isSent?: boolean })[]) {
  const db = await getDB();
  const deletePromises = products.map(async (productId) => {
    await db.delete(STORE_NAME, productId?._id as string);
  });
  await Promise.all(deletePromises);
};

//полностью удаляем indexed DB текущую БД
export async function deleteProductsToDB(): Promise<void> {
  const dbName = DB_NAME;
  // Закрываем соединение, если оно есть
  const db = await getDB();
  db.close();
  // Удаляем базу данных полностью
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      console.warn('Удаление базы данных заблокировано');
    };
  });
};
