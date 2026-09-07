/* ============================================================
   Minecraft Patch Downloads — script.js
   Standalone version: no server, no build step.
   Data is stored in the browser (localStorage) and falls back
   to the seed list below on first visit / after clearing data.
   ============================================================ */
"use strict";

/* ============================================================
   1) Icons (inline SVG, lucide-style)
   ============================================================ */
var ICONS = {
  blocks:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  download:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  externalLink:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  imagePlus:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" y1="5" x2="22" y2="11"/><line x1="22" y1="5" x2="16" y2="11"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  pencil:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  trash:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  upload:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
};

/* ============================================================
   2) Seed data (edit these defaults if you like — changes made
      from the Control Panel are saved in the browser instead)
   ============================================================ */
var STORAGE_KEY = "minecraft_patches_v1";
var SEED_IMAGE = "minecraft-patch.jpg"; // file next to index.html

var DEFAULT_AD_CODE =
  '<div style="text-align:center;font-family:sans-serif">\n' +
  '  <div style="display:inline-block;padding:14px 22px;background:linear-gradient(135deg,#ffd6e8,#ffb3d1);border-radius:12px;border:2px dashed #ec4899">\n' +
  '    <div style="font-size:18px;font-weight:bold;color:#be185d">AD SPOT \u2014 728\u00d790</div>\n' +
  '    <div style="font-size:12px;color:#9d174d">Replace this with your ad code in Edit mode</div>\n' +
  "  </div>\n" +
  "</div>";

var SEED_PATCHES = [
  {
    id: "seed-lucky-block",
    name: "Minecraft Patch — Lucky Block Extreme",
    version: "v1.2",
    description:
      "Adds over 300 lucky blocks with brand-new drops, custom events and secret rewards. Works in survival and multiplayer. Drop the .zip into your patches folder and enjoy!",
    mediafireUrl: "https://www.mediafire.com/file/example-lucky-block/patch.zip",
    adCode: DEFAULT_AD_CODE,
    image: SEED_IMAGE,
    sortOrder: 0
  },
  {
    id: "seed-ultra-shaders",
    name: "Minecraft Patch — Ultra Realistic Shaders",
    version: "v3.0",
    description:
      "Cinematic lighting, soft shadows, waving water and full ray-traced reflections. Optimized preset included for low-end PCs. Recommended: OptiFine 1.20+.",
    mediafireUrl: "https://www.mediafire.com/file/example-shaders/shaders.zip",
    adCode: DEFAULT_AD_CODE,
    image: SEED_IMAGE,
    sortOrder: 1
  },
  {
    id: "seed-pocket-tools",
    name: "Minecraft Patch — Pocket Edit Tools",
    version: "v2.4",
    description:
      "A handy toolkit for quick world editing: sphere builder, custom brushes, block replacer and a mini-map widget. Lightweight and easy to install.",
    mediafireUrl: "https://www.mediafire.com/file/example-tools/tools.zip",
    adCode: DEFAULT_AD_CODE,
    image: SEED_IMAGE,
    sortOrder: 2
  }
];

/* ============================================================
   3) State
   ============================================================ */
var patches = [];            // all patches (source of truth)
var armed = {};              // patchId -> true after 1st download click
var storageOk = true;        // false if localStorage is unavailable
var uploadTargetId = null;   // panel image-change target
var deleteTargetId = null;   // confirm-dialog target
var editingId = null;        // null = adding a new patch
var openOverlays = [];       // stack of open overlay ids ("panel" / "edit" / "confirm")

/* ============================================================
   4) Helpers
   ============================================================ */
function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function uid() {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function findPatch(id) {
  for (var i = 0; i < patches.length; i++) if (patches[i].id === id) return patches[i];
  return null;
}

/* ---------- persistence (localStorage) ---------- */
function savePatches() {
  if (!storageOk) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patches));
  } catch (e) {
    storageOk = false; // quota exceeded / private mode — keep working in memory
  }
}

function loadPatches() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        patches = parsed;
        return;
      }
    }
  } catch (e) {
    /* corrupted or unavailable — fall through to seeds */
  }
  patches = JSON.parse(JSON.stringify(SEED_PATCHES)); // deep copy
  savePatches();
}

/* ---------- image resize (max 1280px, JPEG 0.85) ---------- */
var MAX_IMAGE_DIM = 1280;
var JPEG_QUALITY = 0.85;

function fileToDataUrl(file, cb, onError) {
  if (!file) return;
  if (!file.type || file.type.indexOf("image/") !== 0) {
    onError("Please choose an image file (PNG, JPG, WEBP or GIF).");
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    onError("Image is too large. Please pick one under 15 MB.");
    return;
  }

  var reader = new FileReader();
  reader.onerror = function () { onError("Could not read the file."); };
  reader.onload = function () {
    var rawDataUrl = reader.result;
    var img = new Image();
    img.onerror = function () { onError("Could not load the image."); };
    img.onload = function () {
      var scale = Math.min(1, MAX_IMAGE_DIM / Math.max(img.width, img.height));
      var w = Math.max(1, Math.round(img.width * scale));
      var h = Math.max(1, Math.round(img.height * scale));

      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      if (!ctx) { cb(rawDataUrl); return; }

      var isPng = file.type === "image/png";
      if (!isPng) {
        ctx.fillStyle = "#ffffff"; // flatten transparency for JPEG
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);

      var out = isPng
        ? canvas.toDataURL("image/png")
        : canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      cb(out && out.length > 0 ? out : rawDataUrl);
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   5) Toasts
   ============================================================ */
function toast(title, description, variant) {
  var root = $("#toast-root");
  var el = document.createElement("div");
  el.className = "toast" + (variant === "destructive" ? " toast-destructive" : "");
  el.innerHTML =
    '<div class="toast-title">' + escapeHtml(title) + "</div>" +
    (description ? '<div class="toast-desc">' + escapeHtml(description) + "</div>" : "");
  root.appendChild(el);
  setTimeout(function () {
    el.classList.add("toast-out");
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
  }, 4000);
}

/* ============================================================
   6) Overlays (modals)
   ============================================================ */
function openOverlay(id) {
  var overlay = document.getElementById(id + "-overlay");
  if (!overlay || !overlay.hidden) return;
  overlay.hidden = false;
  openOverlays.push(id);
  document.body.classList.add("modal-open");
}

function closeOverlay(id) {
  var overlay = document.getElementById(id + "-overlay");
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  openOverlays = openOverlays.filter(function (x) { return x !== id; });
  if (openOverlays.length === 0) document.body.classList.remove("modal-open");
}

/* close on backdrop click / X buttons */
document.addEventListener("click", function (e) {
  var t = e.target;
  if (t.classList && t.classList.contains("overlay")) {
    // clicked the dark backdrop itself
    var id = t.id.replace("-overlay", "");
    if (id === "confirm") closeOverlay("confirm");
    else closeOverlay(id);
    return;
  }
  var closer = t.closest ? t.closest("[data-close]") : null;
  if (closer) closeOverlay(closer.getAttribute("data-close"));
});

/* Escape closes the top-most overlay */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && openOverlays.length > 0) {
    closeOverlay(openOverlays[openOverlays.length - 1]);
  }
});

/* ============================================================
   7) Public view rendering
   ============================================================ */
function renderPatches() {
  var grid = $("#patches-grid");
  var empty = $("#empty-state");
  var how = $("#how-it-works");
  var pill = $("#patch-count-pill");

  pill.textContent = patches.length > 0
    ? patches.length + (patches.length === 1 ? " patch available" : " patches available")
    : "New patches coming soon";

  how.hidden = patches.length === 0;
  empty.hidden = patches.length !== 0;

  grid.innerHTML = "";
  patches.forEach(function (p) {
    grid.appendChild(buildCard(p));
  });
}

function buildCard(p) {
  var hasAd = p.adCode && p.adCode.trim();
  var card = document.createElement("article");
  card.className = "card" + (armed[p.id] ? " armed" : "");
  card.setAttribute("data-id", p.id);

  card.innerHTML =
    /* image area */
    '<div class="card-media">' +
      '<div class="media-fallback">' + ICONS.blocks + "<span>No image</span></div>" +
      (p.image ? '<img src="' + escapeHtml(p.image) + '" alt="Preview of ' + escapeHtml(p.name) + '" />' : "") +
      (p.version ? '<span class="version-badge">' + escapeHtml(p.version) + "</span>" : "") +
    "</div>" +
    /* info + inline ad */
    '<div class="card-body">' +
      '<h3 class="card-name">' + escapeHtml(p.name) + "</h3>" +
      (p.description ? '<p class="card-desc">' + escapeHtml(p.description) + "</p>" : "") +
      '<div class="ad-slot"' + (armed[p.id] ? "" : " hidden") + ' role="complementary" aria-label="Advertisement">' +
        '<p class="ad-label">Advertisement</p>' +
        '<div class="ad-content">' +
          (hasAd ? p.adCode : '<p class="ad-empty">No ad configured for this patch.</p>') +
        "</div>" +
      "</div>" +
    "</div>" +
    /* download (identical look in both states) */
    '<div class="card-footer">' +
      '<button type="button" class="btn btn-download">' + ICONS.download + "Download Patch</button>" +
      '<p class="card-hint">' +
        (armed[p.id] ? "Click Download again to get your link" : "Click to start — view a short ad") +
      "</p>" +
    "</div>";

  /* if the image file is missing, drop the <img> so the fallback shows */
  var img = card.querySelector(".card-media img");
  if (img) {
    img.addEventListener("error", function () { img.remove(); });
  }

  card.querySelector(".btn-download").addEventListener("click", function () {
    handleDownload(p.id);
  });

  return card;
}

function updateCardArmed(id) {
  var card = $('.card[data-id="' + id + '"]');
  if (!card) return;
  var p = findPatch(id);
  var isArmed = Boolean(armed[id]);
  card.classList.toggle("armed", isArmed);

  var slot = card.querySelector(".ad-slot");
  if (slot) slot.hidden = !isArmed;

  var hint = card.querySelector(".card-hint");
  if (hint) hint.textContent = isArmed
    ? "Click Download again to get your link"
    : "Click to start — view a short ad";
}

/* ============================================================
   8) Two-step download flow
   1st click -> the ad code expands inline above the button
   2nd click -> the download link opens in a new tab
   ============================================================ */
function handleDownload(id) {
  var p = findPatch(id);
  if (!p) return;

  if (armed[id]) {
    window.open(p.mediafireUrl, "_blank", "noopener,noreferrer");
    armed[id] = false;
    updateCardArmed(id);
    toast("Opening your download…", "Your file is opening in a new tab.");
  } else {
    armed[id] = true;
    updateCardArmed(id);
  }
}

/* ============================================================
   9) Hidden Control Panel — opens ONLY by adding #panel to the
   page URL (e.g. index.html#panel). Nothing else triggers it.
   ============================================================ */
function isPanelUrl() {
  return window.location.hash.toLowerCase() === "#panel";
}

function checkPanelUrl() {
  if (isPanelUrl()) showPanel();
}

window.addEventListener("hashchange", checkPanelUrl);
window.addEventListener("popstate", checkPanelUrl);

function showPanel() {
  if (openOverlays.indexOf("panel") === -1) {
    openOverlay("panel");
    renderPanelList();
    toast("Control Panel unlocked", "Only you can see this — visitors never will.");
  }
}

/* The header logo is purely decorative — clicking it does nothing. */

/* ============================================================
   10) Control Panel rendering + actions
   ============================================================ */
function renderPanelList() {
  var list = $("#panel-list");
  var count = $("#panel-count");
  count.textContent = patches.length + (patches.length === 1 ? " patch total" : " patches total");

  list.innerHTML = "";
  if (patches.length === 0) {
    list.innerHTML =
      '<div class="panel-empty">' +
        '<span class="panel-empty-icon">' + ICONS.blocks + "</span>" +
        "<p>No patches yet — add your first one!</p>" +
      "</div>";
    return;
  }

  patches.forEach(function (p) {
    var row = document.createElement("div");
    row.className = "panel-row";
    row.setAttribute("data-id", p.id);
    row.innerHTML =
      '<div class="row-thumb">' +
        '<div class="thumb-fallback">' + ICONS.blocks + "</div>" +
        (p.image ? '<img src="' + escapeHtml(p.image) + '" alt="" />' : "") +
      "</div>" +
      '<div class="row-info">' +
        '<p class="row-name">' + escapeHtml(p.name) + "</p>" +
        '<p class="row-meta">' + (p.version ? "Version " + escapeHtml(p.version) : "No version set") + "</p>" +
      "</div>" +
      '<div class="row-actions">' +
        '<button type="button" class="btn btn-outline btn-sm" data-act="image">' +
          ICONS.imagePlus + (p.image ? "Change image" : "Add image") +
        "</button>" +
        (p.image
          ? '<button type="button" class="btn btn-outline btn-sm" data-act="remove-image">' + ICONS.trash + "Remove image</button>"
          : "") +
        '<button type="button" class="btn btn-outline btn-sm" data-act="open-link" title="Open the MediaFire link in a new tab">' +
          ICONS.externalLink + "Open link</button>" +
        '<button type="button" class="btn btn-outline btn-sm" data-act="edit">' + ICONS.pencil + "Edit</button>" +
        '<button type="button" class="btn btn-outline-danger btn-sm" data-act="delete">' + ICONS.trash + "Delete</button>" +
      "</div>";

    var img = row.querySelector(".row-thumb img");
    if (img) img.addEventListener("error", function () { img.remove(); });

    list.appendChild(row);
  });
}

$("#panel-list").addEventListener("click", function (e) {
  var btn = e.target.closest ? e.target.closest("button[data-act]") : null;
  if (!btn) return;
  var row = btn.closest(".panel-row");
  var id = row.getAttribute("data-id");
  var p = findPatch(id);
  if (!p) return;

  switch (btn.getAttribute("data-act")) {
    case "image":
      uploadTargetId = id;
      hidePanelError();
      $("#panel-file-input").value = "";
      $("#panel-file-input").click();
      break;

    case "remove-image":
      p.image = null;
      savePatches();
      renderAll();
      toast("Image removed", p.name);
      break;

    case "open-link":
      window.open(p.mediafireUrl, "_blank", "noopener,noreferrer");
      break;

    case "edit":
      openEditDialog(p);
      break;

    case "delete":
      deleteTargetId = id;
      $("#confirm-text").textContent = "\u201C" + p.name + "\u201D and its image will be removed permanently. This cannot be undone.";
      openOverlay("confirm");
      break;
  }
});

function hidePanelError() {
  var el = $("#panel-error");
  el.hidden = true;
  el.textContent = "";
}
function showPanelError(msg) {
  var el = $("#panel-error");
  el.textContent = msg;
  el.hidden = false;
}

/* panel image upload */
$("#panel-file-input").addEventListener("change", function () {
  var file = this.files && this.files[0];
  var p = findPatch(uploadTargetId);
  if (!file || !p) { uploadTargetId = null; return; }
  fileToDataUrl(
    file,
    function (dataUrl) {
      p.image = dataUrl;
      savePatches();
      renderAll();
      toast("Image updated", p.name);
      uploadTargetId = null;
      $("#panel-file-input").value = "";
    },
    function (err) {
      showPanelError(err);
      uploadTargetId = null;
      $("#panel-file-input").value = "";
    }
  );
});

/* delete confirmation */
$("#confirm-delete-btn").addEventListener("click", function () {
  var p = findPatch(deleteTargetId);
  closeOverlay("confirm");
  deleteTargetId = null;
  if (!p) return;
  patches = patches.filter(function (x) { return x.id !== p.id; });
  delete armed[p.id];
  savePatches();
  renderAll();
  if (openOverlays.indexOf("panel") !== -1) renderPanelList();
  toast("Patch deleted", p.name);
});

/* add patch button */
$("#add-patch-btn").addEventListener("click", function () {
  openEditDialog(null);
});

/* ============================================================
   11) Add / Edit dialog
   ============================================================ */
var form = { name: "", version: "", description: "", mediafireUrl: "https://www.mediafire.com", adCode: "", image: null };

function openEditDialog(p) {
  editingId = p ? p.id : null;
  hideFormError();

  if (p) {
    form.name = p.name;
    form.version = p.version || "";
    form.description = p.description || "";
    form.mediafireUrl = p.mediafireUrl || "";
    form.adCode = p.adCode || "";
    form.image = p.image || null;
    $("#edit-title").textContent = "Edit patch";
    $("#edit-desc").textContent = "Update the details, MediaFire link, ad code or image.";
    $("#save-patch-btn").textContent = "Save changes";
  } else {
    form.name = "";
    form.version = "";
    form.description = "";
    form.mediafireUrl = "https://www.mediafire.com";
    form.adCode = DEFAULT_AD_CODE;
    form.image = null;
    $("#edit-title").textContent = "Add a new patch";
    $("#edit-desc").textContent = "Fill in the details — the image and ad code can be customized later too.";
    $("#save-patch-btn").textContent = "Add patch";
  }

  fillFormFields();
  renderFormImage();
  openOverlay("edit");
  setTimeout(function () { $("#f-name").focus(); }, 50);
}

function fillFormFields() {
  $("#f-name").value = form.name;
  $("#f-version").value = form.version;
  $("#f-description").value = form.description;
  $("#f-url").value = form.mediafireUrl;
  $("#f-adcode").value = form.adCode;
}

function readFormFields() {
  form.name = $("#f-name").value.trim();
  form.version = $("#f-version").value.trim();
  form.description = $("#f-description").value.trim();
  form.mediafireUrl = $("#f-url").value.trim();
  form.adCode = $("#f-adcode").value;
}

function renderFormImage() {
  var box = $("#form-image-preview");
  box.innerHTML = form.image
    ? '<img src="' + escapeHtml(form.image) + '" alt="Patch preview" />'
    : '<div class="preview-fallback">' + ICONS.imagePlus + "<span>No image</span></div>";
  var img = box.querySelector("img");
  if (img) img.addEventListener("error", function () { img.remove(); });

  $("#form-remove-image-btn").hidden = !form.image;
  $("#form-upload-label").textContent = form.image ? "Replace image" : "Upload image";
}

/* upload image inside the edit form */
$("#form-upload-btn").addEventListener("click", function () {
  $("#form-file-input").click();
});

$("#form-file-input").addEventListener("change", function () {
  var file = this.files && this.files[0];
  if (!file) return;
  var btn = $("#form-upload-btn");
  var oldIcon = btn.innerHTML;
  btn.disabled = true;
  fileToDataUrl(
    file,
    function (dataUrl) {
      form.image = dataUrl;
      renderFormImage();
      btn.disabled = false;
      btn.innerHTML = oldIcon;
      $("#form-file-input").value = "";
    },
    function (err) {
      showFormError(err);
      btn.disabled = false;
      btn.innerHTML = oldIcon;
      $("#form-file-input").value = "";
    }
  );
});

$("#form-remove-image-btn").addEventListener("click", function () {
  form.image = null;
  renderFormImage();
});

function hideFormError() {
  var el = $("#form-error");
  el.hidden = true;
  el.textContent = "";
}
function showFormError(msg) {
  var el = $("#form-error");
  el.textContent = msg;
  el.hidden = false;
}

/* save */
$("#save-patch-btn").addEventListener("click", function () {
  readFormFields();

  if (!form.name) {
    showFormError("Please give the patch a name.");
    $("#f-name").focus();
    return;
  }
  if (!form.mediafireUrl) {
    showFormError("Please add the MediaFire link (used by the Download button).");
    $("#f-url").focus();
    return;
  }

  if (editingId) {
    var p = findPatch(editingId);
    if (p) {
      p.name = form.name;
      p.version = form.version;
      p.description = form.description;
      p.mediafireUrl = form.mediafireUrl;
      p.adCode = form.adCode;
      p.image = form.image;
      savePatches();
      renderAll();
      renderPanelList();
      toast("Patch updated", p.name);
    }
  } else {
    var np = {
      id: uid(),
      name: form.name,
      version: form.version,
      description: form.description,
      mediafireUrl: form.mediafireUrl,
      adCode: form.adCode,
      image: form.image,
      sortOrder: patches.length
    };
    patches.push(np);
    savePatches();
    renderAll();
    renderPanelList();
    toast("Patch added", np.name);
  }

  closeOverlay("edit");
});

/* live-clear the error while typing */
["f-name", "f-url"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", hideFormError);
});

/* ============================================================
   12) Init
   ============================================================ */
function renderAll() {
  renderPatches();
  renderPanelList();
}

$("#footer-year").textContent = String(new Date().getFullYear());

loadPatches();
renderAll();
checkPanelUrl();
