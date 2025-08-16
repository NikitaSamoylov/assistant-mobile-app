export const objectsAreEqualExceptId = (obj1: any, obj2: any) => {
  // сравниваем все поля, кроме id
  const keys1 = Object.keys(obj1).filter(k => k !== 'id');
  const keys2 = Object.keys(obj2).filter(k => k !== 'id');

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    };
  };
  return true;
};