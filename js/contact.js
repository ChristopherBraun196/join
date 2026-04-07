let mobileActiveContact = null;

const AVATAR_COLORS = [
  "#FF7043",  "#E91E8C",  "#9C27B0",  "#3F51B5",  "#00BCD4",  "#4CAF50",  "#FF9800",  "#795548",
];

function openContactDialog() {
  document.getElementById("dialog-overlay").classList.add("active");
}

function closeContactDialog() {
  document.getElementById("dialog-overlay").classList.remove("active");
  clearDialogInputs();
  clearErrors();
  resetDialog();
}

function clearDialogInputs() {
  document.getElementById("input-name").value = "";
  document.getElementById("input-email").value = "";
  document.getElementById("input-phone").value = "";
}

document
  .getElementById("dialog-overlay")
  .addEventListener("click", function (e) {
    if (e.target === this) closeContactDialog();
  });

function generateContactJson(contactID) {
  return {
    id: contactID,
    name: getContactName(),
    email: getContactEmailAdress(),
    phone: getContactPhone(),
    avatarColor: selectRandomAvatarColor(),
  };
}

function getContactName() {
  return document.getElementById("input-name").value.trim();
}

function getContactEmailAdress() {
  return document.getElementById("input-email").value.trim();
}

function getContactPhone() {
  return document.getElementById("input-phone").value.trim();
}

function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
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
  const item = document.createElement("div");
  item.className = "contact-item";
  item.innerHTML = getContactItemTemplate(contact, initials, contact.avatarColor);
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
  Object.keys(grouped)
    .sort()
    .forEach((letter) => {
      list.appendChild(createLetterDivider(letter));
      grouped[letter].forEach((contact) =>
        list.appendChild(createContactItem(contact))
      );
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
    const data = await loadData("/contacts");
    if (!data) return;
    const contacts = Object.entries(data).map(([id, contact]) => ({
      ...contact,
      id,
    }));
    renderContacts(contacts);
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadContacts);

function clearActiveContact() {
  document
    .querySelectorAll(".contact-item")
    .forEach((el) => el.classList.remove("active"));
  const existing = document.querySelector(".contact-detail");
  if (existing) existing.remove();
  document.querySelector(".main_contacts").classList.remove("contact-open");
  document.getElementById("sidebar_contacts").style.display = "";
  document.querySelector(".fab-add-contact").style.display = "";
  mobileActiveContact = null;
}

function appendContactDetail(contact) {
  const main = document.querySelector(".main_contacts");
  const initials = getInitials(contact.name);
  const detail = document.createElement("div");
  detail.className = "contact-detail";
  detail.innerHTML = getContactDetailTemplate(contact, initials, contact.avatarColor);
  main.appendChild(detail);
}

function openContactDetail(contact, event) {
  const clickedItem = event.currentTarget;
  const isAlreadyActive = clickedItem.classList.contains("active");
  clearActiveContact();
  if (isAlreadyActive) return;
  clickedItem.classList.add("active");
  mobileActiveContact = contact;
  appendContactDetail(contact);
  if (window.innerWidth <= 1200) {
    document.querySelector(".main_contacts").classList.add("contact-open");
    document.getElementById("sidebar_contacts").style.display = "none";
    document.querySelector(".fab-add-contact").style.display = "none";
  }
}

function backToContacts() {
  clearActiveContact();
}

async function submitContact() {
  if (!validateInputs()) return;
  try {
    const contactID = "contact-" + generateUUID();
    await putData("/contacts/" + contactID, generateContactJson(contactID));
    closeContactDialog();
    loadContacts();
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
  }
}

async function deleteContact(contactId) {
  try {
    await deleteData("/contacts/" + contactId);
    clearActiveContact();
    loadContacts();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

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
  cancelBtn.onclick = () => {
    deleteContact(contactId);
    closeContactDialog();
  };
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
    id: contactId,
    avatarColor: selectRandomAvatarColor(),
    name: document.getElementById("input-name").value.trim(),
    email: document.getElementById("input-email").value.trim(),
    phone: document.getElementById("input-phone").value.trim(),
  };
  try {
    await putData("/contacts/" + contactId, updatedContact);
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

function validateInputs() {
  const nameInput = document.getElementById("input-name");
  const emailInput = document.getElementById("input-email");
  const phoneInput = document.getElementById("input-phone");
  const phoneRegex = /^[+\d\s\-()]{6,20}$/;
  let isValid = true;

  clearErrors();

  if (!nameInput.value.trim()) {
    showError("input-name", "err-name", "This field is required");
    isValid = false;
  }
  if (!emailInput.checkValidity()) {
    showError("input-email", "err-email", "Please enter a valid email address");
    isValid = false;
  }
  if (!phoneRegex.test(phoneInput.value.trim())) {
    showError("input-phone", "err-phone", "Please enter a valid phone number");
    isValid = false;
  }

  return isValid;
}

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  input.style.borderColor = "var(--error-color)";
  err.textContent = message;
  err.classList.add("visible");
}

function clearErrors() {
  [
    { inputId: "input-name",  errorId: "err-name"  },
    { inputId: "input-email", errorId: "err-email" },
    { inputId: "input-phone", errorId: "err-phone" },
  ].forEach(({ inputId, errorId }) => {
    document.getElementById(inputId).style.borderColor = "";
    const err = document.getElementById(errorId);
    err.textContent = "";
    err.classList.remove("visible");
  });
}
