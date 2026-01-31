export const storageManager = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading key "${key}" from localStorage:`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  },

  pushToItem(key, newValue) {
    let data = this.get(key) || [];

    if (Array.isArray(data)) {
      data.push(newValue);
      this.set(key, data);
    } else {
      console.warn(`Key "${key}" is not an Array. Cannot push.`);
    }
  },

  remove(key, id) {
    let data = this.get(key);

    if (!Array.isArray(data)) {
      console.error(`Key "${key}" is not an Array. Cannot remove.`);
      return;
    }

    const newData = data.filter((e) => e.id !== id);

    this.set(key, newData);
  },

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
  },
};
