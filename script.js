const desktop = document.getElementById("desktop");
const dock = document.getElementById("dock");
const menu = document.getElementById("contextMenu");
const folderWindow = document.getElementById("folderWindow");
const folderContent = document.getElementById("folderContent");

let apps = ["HopePlayer", "HopeTXT"];
let favorites = JSON.parse(localStorage.getItem("dockApps")) || [];
let deletedApps = JSON.parse(localStorage.getItem("deletedApps")) || [];
let folders = JSON.parse(localStorage.getItem("folders")) || [];

let selectedApp = null;
let selectedFolder = null;

/* RENDER DESKTOP */
function renderDesktop() {
    desktop.innerHTML = "";

    apps.forEach(app => {
        const el = createApp(app);
        desktop.appendChild(el);
    });

    folders.forEach(folder => {
        const el = createFolder(folder);
        desktop.appendChild(el);
    });
}

/* CREATE APP */
function createApp(name) {
    const div = document.createElement("div");
    div.className = "app";
    div.dataset.app = name;

    div.innerHTML = `
        <img src="appcover/${name.toLowerCase()}.png">
        <span class="label">${name}</span>
    `;

    div.onclick = () => window.location.href = name + "/";

    div.oncontextmenu = (e) => {
        e.preventDefault();
        openMenu(e, name, "app");
    };

    div.draggable = true;

    div.ondragstart = () => div.classList.add("dragging");
    div.ondragend = () => div.classList.remove("dragging");

    return div;
}

/* CREATE FOLDER */
function createFolder(folder) {
    const div = document.createElement("div");
    div.className = "app";

    div.innerHTML = `
        <img src="assets/foldericon.png">
        <span class="label">${folder.name}</span>
    `;

    div.onclick = () => openFolder(folder);

    div.oncontextmenu = (e) => {
        e.preventDefault();
        openMenu(e, folder.name, "folder");
    };

    return div;
}

/* DOCK */
function renderDock() {
    dock.innerHTML = "";

    favorites.forEach(app => {
        const el = document.createElement("div");
        el.className = "app";
        el.innerHTML = `
            <img src="appcover/${app.toLowerCase()}.png">
            <span class="label">${app}</span>
        `;
        dock.appendChild(el);
    });

    localStorage.setItem("dockApps", JSON.stringify(favorites));
}

/* CONTEXT MENU */
function openMenu(e, name, type) {
    selectedApp = name;
    selectedFolder = name;

    menu.style.display = "flex";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";

    menu.innerHTML = "";

    if (type === "app") {
        menu.innerHTML = `
            <div onclick="favoriteApp()">Favorite</div>
            <div onclick="deleteApp()">Delete</div>
            <div onclick="openApp()">Open</div>
        `;
    } else {
        menu.innerHTML = `
            <div onclick="renameFolder()">Rename</div>
            <div onclick="deleteFolder()">Delete Folder</div>
        `;
    }
}

/* APP ACTIONS */
function openApp() {
    window.location.href = selectedApp + "/";
}

function favoriteApp() {
    if (!favorites.includes(selectedApp)) {
        favorites.push(selectedApp);
    }
    renderDock();
    menu.style.display = "none";
}

function deleteApp() {
    deletedApps.push(selectedApp);
    apps = apps.filter(a => a !== selectedApp);
    renderDesktop();
    menu.style.display = "none";
}

/* RECYCLE */
document.getElementById("recycleBin").onclick = () => {
    menu.style.display = "flex";
    menu.style.left = "auto";
    menu.style.right = "20px";
    menu.style.bottom = "100px";

    menu.innerHTML = deletedApps.map(app =>
        `<div onclick="restore('${app}')">Reinstall ${app}</div>`
    ).join("");
};

function restore(app) {
    apps.push(app);
    deletedApps = deletedApps.filter(a => a !== app);
    renderDesktop();
}

/* FOLDERS */
function openFolder(folder) {
    folderWindow.classList.remove("hidden");

    folderContent.innerHTML = "";

    folder.apps.forEach(app => {
        const el = createApp(app);
        el.ondragend = () => removeFromFolder(folder, app);
        folderContent.appendChild(el);
    });
}

function renameFolder() {
    const newName = prompt("Rename folder:");
    if (!newName) return;

    const folder = folders.find(f => f.name === selectedFolder);
    folder.name = newName;
    renderDesktop();
    menu.style.display = "none";
}

function deleteFolder() {
    folders = folders.filter(f => f.name !== selectedFolder);
    renderDesktop();
    menu.style.display = "none";
}

/* CREATE FOLDER (hold empty space) */
let holdTimer;

desktop.addEventListener("mousedown", (e) => {
    if (e.target !== desktop) return;

    holdTimer = setTimeout(() => {
        const name = prompt("Folder name?");
        if (!name) return;

        folders.push({ name, apps: [] });
        renderDesktop();
    }, 600);
});

desktop.addEventListener("mouseup", () => clearTimeout(holdTimer));

/* INIT */
renderDesktop();
renderDock();
