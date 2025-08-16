import { TProduct } from '@/lib/types/product';
import { openDB } from 'idb';
import { detectProductTimeLeft } from '../../../utils/detectProductTimeLeft';

const DB_NAME = 'existing-products-db';
const STORE_NAME = 'existing-products';
const DELETED_STORE_NAME = 'deleted-products';

export async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: '_id' });
        }
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(DELETED_STORE_NAME)) {
          db.createObjectStore(DELETED_STORE_NAME, { keyPath: '_id' });
        };
      };
    },
  });
};

export async function saveProductsToIDB(products: (TProduct & { isSent?: boolean })[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const product of products) {
    await tx.store.put(product);
  }
  await tx.done;
};

//=============================== Items List for get and for upalod while get online

export async function getProductsFromIDB(key: 'fresh' | 'deadline' | 'expired' | 'all', searchValue: string = '') {
  const db = await getDB();
  const allItems = await db.getAll(STORE_NAME);
  if (key === 'all') {
    if (!searchValue) {
      return allItems;
    };
    return allItems.filter(el => el.title.toLowerCase().includes(searchValue.toLowerCase()));
  };
  const filteredItemsByKey = allItems.filter(item => {
    const detectedItem = detectProductTimeLeft(item?.expiredDate);
    return detectedItem === key;
  })
  return filteredItemsByKey;
};

//=================== clear IDB
export async function clearIDB() {
  const db = await getDB();
  await db.clear(STORE_NAME);
};

//=====================================удаление из существующих
export async function deleteProductsFromStore(products: (TProduct & { isSent?: boolean })[]) {
  const db = await getDB();

  const deletePromises = products.map(async (productId) => {
    await db.delete(STORE_NAME, productId?._id as string);
  });

  await Promise.all(deletePromises);
};

//полностью удаляем indexed DB текущую БД
export async function deleteExistingProductsDB(): Promise<void> {
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