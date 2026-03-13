const BASE_URL =
  "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app/";

const CONCTACT_URL =
  "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app/contacts/";

  const TASK_URL =  "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app/tasks";

function loadDatabank() {
  console.log("test");
  // loadData();
  postData("/tasks", { Test: "ABC123",
    Name: "Max",
    Lastname: "Mustermann"

   });
  // deleteData("/-OnOBfp3TMgEPEXlwYyC");
  // putData(path = "", data = {}) 
}

async function loadData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    showMessage(error);
  }
}

async function postData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
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
    let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
    });
    return (responseToJson = await response.json());
    
  } catch (error) {
    showMessage(error);
  }
}

async function putData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
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

