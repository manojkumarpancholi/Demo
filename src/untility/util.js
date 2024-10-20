import AsyncStorage from '@react-native-async-storage/async-storage';

const setStarage = async (key, value) => {
  const stringObj = JSON.stringify(value);
  await AsyncStorage.setItem(key, stringObj);
};

const getStorage = async key => {
  const value = (await AsyncStorage.getItem(key)) || '';
  //   return JSON.parse(value);
  return value ? JSON.parse(value) : '';
};


// const removeItemFromStorage = async (key, itemId) => {
//   const existingArr = await getStorage(key);
//   const newArr = existingArr.filter(item => item !== itemId);
  
//   await setStarage(key, newArr);
// };
const removeItemFromStorage = async (key, itemToRemove) => {
  try {
    const existingArr = await getStorage(key);
    console.log('Existing array before removal:', existingArr);

    // Filter out the item to remove
    const newArr = existingArr.filter(item => item !== itemToRemove);
    console.log('New array after removal:', newArr);

    // Save the updated array back to AsyncStorage
    await setStarage(key, newArr);
    console.log(`Item removed: ${itemToRemove}`);
  } catch (error) {
    console.error('Error removing item from storage:', error);
  }
};

export {setStarage, getStorage, removeItemFromStorage};
