export default class StorageManager {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading key "${key}" from localStorage:`, error);
      return null;
    }
  }

  set(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  pushToItem(key, newValue) {
    let data = this.get(key) || [];

    if (Array.isArray(data)) {
      data.push(newValue);
      this.set(key, data);
    } else {
      console.warn(`Key "${key}" is not an Array. Cannot push.`);
    }
  }

  remove(key, id) {
    let data = this.get(key);

    if (!Array.isArray(data)) {
      console.error(`Key "${key}" is not an Array. Cannot remove.`);
      return;
    }

    const newData = data.filter((e) => e.id !== id);

    this.set(key, newData);
  }

  update(key, value) {
    let data = this.get(key),
      flag = false;
    // console.log(value);

    if (!Array.isArray(data)) {
      this.set(key, value);
      return;
    }

    const UpdatedData = data.map((item) => {
      if (item.id === value.id) {
        flag = true;
        return value;
      }
      return item;
    });

    !flag
      ? console.error(`This ${key} cannot be updated`)
      : this.set(key, UpdatedData);
  }

  // save cookie
  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  // get any cookie by its name
  getCookie(name) {
    const CookieName = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(CookieName) == 0)
        return c.substring(CookieName.length, c.length);
    }
    return null;
  }

  // delete any cookie by its name
  eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999; path=/;";
  }
}
