const BASE_URL =
  "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app/";

function loadDatabank() {
  console.log("test");
  // loadData();
  postData("/name", { BANANA: "RAMA" });
  // deleteData("/-OnOBfp3TMgEPEXlwYyC");
  // putData(path = "", data = {}) 
}

async function loadData() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();

  console.log(responseToJson);
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return (responseToJson = await response.json());
}

async function deleteData(path="") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return (responseToJson = await response.json());
}

