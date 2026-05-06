const dock = document.getElementById("dock");
const menu = document.getElementById("contextMenu");

let favorites = JSON.parse(localStorage.getItem("dockApps")) || [];
let selectedApp = null;

/* OPEN APP */
function openApp(appName) {
    window.location.href = appName + "/";
}

/* RENDER DOCK */
function renderDock() {
    dock.innerHTML = "";

    favorites.forEach(app => {
        const el = document.createElement("div");
        el.className = "app";
        el.innerHTML = `
            <img src="appcover/${app.toLowerCase()}.png">
            <span class="label">${app}</span>
        `;
        el.onclick = () => openApp(app);
        dock.appendChild(el);
    });

    localStorage.setItem("dockApps", JSON.stringify(favorites));
}

renderDock();

/* DRAG TO FAVORITE */
document.querySelectorAll(".app").forEach(app => {

    app.addEventListener("dragstart", () => {
        app.classList.add("dragging");
    });

    app.addEventListener("dragend", () => {
        app.classList.remove("dragging");
    });

    /* CLICK OPEN */
    app.addEventListener("click", () => {
        openApp(app.dataset.app);
    });

    /* RIGHT CLICK MENU */
    app.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        selectedApp = app.dataset.app;

        menu.style.display = "flex";
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
    });
});

/* CLOSE MENU ON CLICK */
window.addEventListener("click", () => {
    menu.style.display = "none";
});

/* DROP INTO DOCK */
dock.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dock.addEventListener("drop", () => {
    const dragging = document.querySelector(".dragging");
    const appName = dragging.dataset.app;

    if (!favorites.includes(appName)) {
        favorites.push(appName);
        renderDock();
    }
});

/* MENU ACTIONS */
function favoriteApp() {
    if (selectedApp && !favorites.includes(selectedApp)) {
        favorites.push(selectedApp);
        renderDock();
    }
    menu.style.display = "none";
}

function unfavoriteApp() {
    favorites = favorites.filter(a => a !== selectedApp);
    renderDock();
    menu.style.display = "none";
}

function openAppFromMenu() {
    openApp(selectedApp);
}
