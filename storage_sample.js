export function setItemInLocalStorage(key, data) {
    data = encodeURIComponent(JSON.stringify(data));
    localStorage.setItem(key, data);
  }
  
  export function getItemFromLocalStorage(key) {
    const data = JSON.parse(decodeURIComponent(localStorage.getItem(key)));
    return data;
  }
  
  export function removeItemFromLocalStorage(key) {
    localStorage.removeItem(key);
  }
  
  export function clearLocalStorage() {
    localStorage.clear();
  }
  