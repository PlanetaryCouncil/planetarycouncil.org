// PalestineAuction — render listings + handle buy / best-offer messaging.
// Static site: no backend. Offers are composed into a mailto: to the seller.

(function () {
  "use strict";

  var FORM_ENDPOINT = "https://formspree.io/f/mzdlyegj";

  var grid = document.getElementById("grid");
  var backdrop = document.getElementById("modalBackdrop");
  var modalTitle = document.getElementById("modalTitle");
  var modalSub = document.getElementById("modalSub");
  var amountInput = document.getElementById("offerAmount");
  var fromInput = document.getElementById("offerFrom");
  var msgInput = document.getElementById("offerMsg");
  var sendBtn = document.getElementById("modalSend");
  var cancelBtn = document.getElementById("modalCancel");
  var statusEl = document.getElementById("modalStatus");

  var active = null; // the item currently in the modal

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function money(n) {
    return "£" + Number(n).toLocaleString("en-GB");
  }

  function render() {
    if (typeof LISTINGS === "undefined" || !LISTINGS.length) {
      grid.innerHTML =
        '<p style="color:#6b6b6b">No items listed right now. Check back soon.</p>';
      return;
    }

    grid.innerHTML = LISTINGS.map(function (item) {
      var photo = item.image
        ? '<img src="' + esc(item.image) + '" alt="' + esc(item.title) + '" />'
        : esc(item.emoji || "📦");

      var forWhom = item.forWhom
        ? '<p class="for-whom">' + esc(item.forWhom) + "</p>"
        : "";

      return (
        '<article class="card">' +
        '<div class="photo">' +
        photo +
        "</div>" +
        '<div class="body">' +
        "<h3>" +
        esc(item.title) +
        "</h3>" +
        '<div class="price-row">' +
        '<span class="price">' +
        money(item.price) +
        "</span>" +
        '<span class="area" title="Postcode area">' +
        esc(item.area) +
        "</span>" +
        "</div>" +
        '<p class="desc">' +
        esc(item.description) +
        "</p>" +
        forWhom +
        '<div class="actions">' +
        '<button class="btn primary" data-action="open" data-id="' +
        esc(item.id) +
        '">Buy now or make an offer</button>' +
        "</div>" +
        "</div>" +
        "</article>"
      );
    }).join("");
  }

  function findItem(id) {
    for (var i = 0; i < LISTINGS.length; i++) {
      if (LISTINGS[i].id === id) return LISTINGS[i];
    }
    return null;
  }

  function openModal(item) {
    active = item;
    modalTitle.textContent = item.title;
    modalSub.textContent =
      "Asking price " + money(item.price) + " · area " + item.area +
      " — pay the asking price, or put in a lower offer.";
    amountInput.value = item.price;
    fromInput.value = "";
    msgInput.value = "";
    statusEl.textContent = "";
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    backdrop.classList.add("open");
    amountInput.focus();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    active = null;
  }

  function send() {
    if (!active) return;
    var item = active;
    var amount = amountInput.value.trim();
    var from = fromInput.value.trim();
    var note = msgInput.value.trim();

    if (!amount) {
      statusEl.textContent = "Please enter an amount.";
      amountInput.focus();
      return;
    }
    if (!from || from.indexOf("@") === -1) {
      statusEl.textContent = "Please enter your email so the seller can reply.";
      fromInput.focus();
      return;
    }

    var isFullPrice = Number(amount) >= Number(item.price);

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    statusEl.textContent = "";

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _subject:
          "PalestineAuction — " +
          (isFullPrice ? "Buy now" : "Offer") +
          ": " +
          item.title,
        item: item.title + " (" + item.id + ")",
        asking_price: "£" + item.price,
        offer: "£" + amount,
        type: isFullPrice ? "buy now" : "offer",
        area: item.area,
        seller_contact: item.contact,
        email: from,
        message: note,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        sendBtn.textContent = "Sent ✓";
        statusEl.textContent =
          "Sent. The seller will get back to you by email.";
        setTimeout(closeModal, 1600);
      })
      .catch(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
        statusEl.textContent =
          "Couldn't send — please check your connection and try again.";
      });
  }

  // Event wiring
  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var item = findItem(btn.getAttribute("data-id"));
    if (item) openModal(item);
  });

  sendBtn.addEventListener("click", send);
  cancelBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && backdrop.classList.contains("open")) closeModal();
  });

  render();
})();
