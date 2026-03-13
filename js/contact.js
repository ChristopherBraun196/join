// Dialog

function openContactDialog() {
  document.getElementById('dialog-overlay').classList.add('active');
}

function closeContactDialog() {
  document.getElementById('dialog-overlay').classList.remove('active');
  clearDialogInputs();
  resetDialog();
}

function clearDialogInputs() {
  document.getElementById('input-name').value = '';
  document.getElementById('input-email').value = '';
  document.getElementById('input-phone').value = '';
}

document.getElementById('dialog-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeContactDialog();
});


// Contact List Rendering

const DB_URL = "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app";

const AVATAR_COLORS = [
  "#FF7043", "#E91E8C", "#9C27B0", "#3F51B5",
  "#00BCD4", "#4CAF50", "#FF9800", "#795548"
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

function groupContactsByLetter(contacts) {
  const sorted = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const grouped = {};
  sorted.forEach((contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact);
  });
  return grouped;
}

function createContactItem(contact) {
  const initials = getInitials(contact.name);
  const color = getAvatarColor(contact.name);
  const item = document.createElement("div");
  item.className = "contact-item";
  item.innerHTML = getContactItemTemplate(contact, initials, color);
  item.addEventListener("click", (event) => openContactDetail(contact, event));
  return item;
}

function createLetterDivider(letter) {
  const divider = document.createElement("div");
  divider.className = "contact-divider";
  divider.innerHTML = `
    <span class="contact-letter">${letter}</span>
    <hr class="contact-divider-line">
  `;
  return divider;
}

function buildContactList(grouped) {
  const list = document.createElement("div");
  list.className = "contacts-list";
  Object.keys(grouped).sort().forEach((letter) => {
    list.appendChild(createLetterDivider(letter));
    grouped[letter].forEach((contact) => list.appendChild(createContactItem(contact)));
  });
  return list;
}

function renderContacts(contacts) {
  const sidebar = document.getElementById("sidebar_contacts");
  const existingList = sidebar.querySelector(".contacts-list");
  if (existingList) existingList.remove();
  const grouped = groupContactsByLetter(contacts);
  sidebar.appendChild(buildContactList(grouped));
}

async function loadContacts() {
  try {
    const response = await fetch(`${DB_URL}/contacts.json`);
    const data = await response.json();
    if (!data) return;
    const contacts = Object.entries(data).map(([id, contact]) => ({ id, ...contact }));
    renderContacts(contacts);
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadContacts);


// Contact Detail

function clearActiveContact() {
  document.querySelectorAll(".contact-item").forEach((el) => el.classList.remove("active"));
  const existing = document.querySelector(".contact-detail");
  if (existing) existing.remove();
}

function appendContactDetail(contact) {
  const main = document.querySelector(".main_contacts");
  const initials = getInitials(contact.name);
  const color = getAvatarColor(contact.name);
  const detail = document.createElement("div");
  detail.className = "contact-detail";
  detail.innerHTML = getContactDetailTemplate(contact, initials, color);
  main.appendChild(detail);
}

function openContactDetail(contact, event) {
  const clickedItem = event.currentTarget;
  const isAlreadyActive = clickedItem.classList.contains("active");
  clearActiveContact();
  if (isAlreadyActive) return;
  clickedItem.classList.add("active");
  appendContactDetail(contact);
}


// Contact Submit

async function submitContact() {
  if (!validateInputs()) return;
  const newContact = {
    name: document.getElementById("input-name").value.trim(),
    email: document.getElementById("input-email").value.trim(),
    phone: document.getElementById("input-phone").value.trim(),
  };
  try {
    await fetch(`${DB_URL}/contacts.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    closeContactDialog();
    loadContacts();
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
  }
}


// Contact Delete

async function deleteContact(contactId) {
  try {
    await fetch(`${DB_URL}/contacts/${contactId}.json`, { method: "DELETE" });
    clearActiveContact();
    loadContacts();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}


// Contact Edit

function getActiveContactData(contactId) {
  let currentContact = null;
  document.querySelectorAll(".contact-item").forEach((item) => {
    if (item.classList.contains("active")) {
      currentContact = {
        id: contactId,
        name: item.querySelector(".contact-name").textContent,
        email: item.querySelector(".contact-email").textContent,
      };
    }
  });
  return currentContact;
}

function fillEditDialogInputs(currentContact) {
  document.getElementById("input-name").value = currentContact?.name || "";
  document.getElementById("input-email").value = currentContact?.email || "";
  const phoneEl = document.getElementById("detail-phone");
  document.getElementById("input-phone").value = phoneEl ? phoneEl.textContent : "";
}

function setEditDialogButtons(contactId) {
  const cancelBtn = document.querySelector(".btn-cancel");
  const submitBtn = document.querySelector(".btn-submit");
  cancelBtn.textContent = "Delete ✕";
  cancelBtn.onclick = () => { deleteContact(contactId); closeContactDialog(); };
  submitBtn.textContent = "Save ✓";
  submitBtn.onclick = () => saveContact(contactId);
  document.querySelector(".close-btn").onclick = () => closeContactDialog();
  document.querySelector(".dialog-left h1").textContent = "Edit contact";
}

function editContact(contactId) {
  const currentContact = getActiveContactData(contactId);
  openContactDialog();
  fillEditDialogInputs(currentContact);
  setEditDialogButtons(contactId);
}

async function saveContact(contactId) {
  if (!validateInputs()) return;
  const updatedContact = {
    name: document.getElementById("input-name").value.trim(),
    email: document.getElementById("input-email").value.trim(),
    phone: document.getElementById("input-phone").value.trim(),
  };
  try {
    await fetch(`${DB_URL}/contacts/${contactId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    });
    closeContactDialog();
    clearActiveContact();
    loadContacts();
  } catch (error) {
    console.error("Fehler beim Speichern des Kontakts:", error);
  }
}

function resetDialog() {
  const cancelBtn = document.querySelector(".btn-cancel");
  const submitBtn = document.querySelector(".btn-submit");
  cancelBtn.textContent = "Cancel ✕";
  cancelBtn.onclick = closeContactDialog;
  submitBtn.textContent = "Create contact ✓";
  submitBtn.onclick = submitContact;
  document.querySelector(".close-btn").onclick = closeContactDialog;
  document.querySelector(".dialog-left h1").textContent = "Add contact";
}


// Input Validation

function validateInputs() {
  const nameInput = document.getElementById("input-name");
  const emailInput = document.getElementById("input-email");
  const phoneInput = document.getElementById("input-phone");
  const phoneRegex = /^[+\d\s\-()]{6,20}$/;
  if (!nameInput.value.trim()) {
    alert("Bitte einen Namen eingeben.");
    return false;
  }
  if (!emailInput.checkValidity()) {
    alert("Bitte eine gültige E-Mail Adresse eingeben.");
    return false;
  }
  if (!phoneRegex.test(phoneInput.value.trim())) {
    alert("Bitte eine gültige Telefonnummer eingeben.");
    return false;
  }
  return true;
}