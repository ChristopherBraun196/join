const URL = "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
  try {
    let response = await fetch(URL + path + ".json");
    return await response.json();
  } catch (error) {
    showMessage(error);
  }
}

async function postData(path = "", data = {}) {
  try {
    let response = await fetch(URL + path + ".json", {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    return (responseToJson = await response.json());

  } catch (error) {
    showMessage(error);
  }
}

async function deleteData(path="") {
  try {
    let response = await fetch(URL + path + ".json", {
      method: "DELETE",
    });
    return (responseToJson = await response.json());
    
  } catch (error) {
    showMessage(error);
  }
}

async function putData(path = "", data = {}) {
  try {
    let response = await fetch(URL + path + ".json", {
      method: "PUT",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return (responseToJson = await response.json());
  } catch (error) {
    showMessage(error);
  }
}

