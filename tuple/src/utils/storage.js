import AsyncStorage from '@react-native-async-storage/async-storage';

// 데이터 저장
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Error storing data:', e);
    return false;
  }
};

// 데이터 불러오기
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting data:', e);
    return null;
  }
};

// 데이터 삭제
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing data:', e);
    return false;
  }
};

// 모든 데이터 삭제
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing data:', e);
    return false;
  }
};

