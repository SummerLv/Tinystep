(function () {
  const cfg = window.TINYINVOICE_CONFIG || {};
  const UNLOCK_KEY = "tinyinvoice_unlocked_v1";

  const els = {
    fromName: document.getElementById("fromName"),
    fromEmail: document.getElementById("fromEmail"),
    toName: document.getElementById("toName"),
    toEmail: document.getElementById("toEmail"),
    invoiceNo: document.getElementById("invoiceNo"),
    invoiceDate: document.getElementById("invoiceDate"),
    dueDate: document.getElementById("dueDate"),
    currency: document.getElementById("currency"),
    notes: document.getElementById("notes"),
    items: document.getElementById("items"),
    invoice: document.getElementById("invoice"),
    totalLabel: document.getElementById("totalLabel"),
    unlockBadge: document.getElementById("unlockBadge"),
    watermark: document.getElementById("watermark"),
    payBtn: document.getElementById("payBtn"),
    downloadBtn: document.getElementById("downloadBtn"),
    printBtn: document.getElementById("printBtn"),
    copyLinkBtn: document.getElementById("copyLinkBtn"),
    feedbackNudge: document.getElementById("feedbackNudge"),
    dismissNudge: document.getElementById("dismissNudge"),
    payHint: document.getElementById("payHint"),
    payModal: document.getElementById("payModal"),
    confirmPay: document.getElementById("confirmPay"),
    addItem: document.getElementById("addItem"),
  };

  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  function plusDays(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  els.invoiceDate.value = todayISO();
  els.dueDate.value = plusDays(14);

  function money(n, currency) {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);
    } catch {
      return `${currency} ${(n || 0).toFixed(2)}`;
    }
  }

  function isUnlocked() {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  }
  function setUnlocked(v) {
    if (v) localStorage.setItem(UNLOCK_KEY, "1");
    else localStorage.removeItem(UNLOCK_KEY);
    refreshUnlockUI();
  }

  function refreshUnlockUI() {
    const on = isUnlocked();
    els.unlockBadge.textContent = on ? "Unlocked" : "Locked";
    els.unlockBadge.classList.toggle("unlocked", on);
    els.watermark.classList.toggle("hidden", on);
    els.downloadBtn.disabled = !on;
    if (cfg.paymentLink) {
      els.payHint.textContent = on
        ? "Unlocked on this browser. You can download a watermark-free PDF. Feedback is still welcome."
        : "Preview stays free. The $1 button opens a Stripe TEST checkout — not a real charge. Feedback welcome.";
      els.payBtn.disabled = on;
    } else {
      els.payHint.textContent = on
        ? "Demo unlock active (no live payment configured)."
        : "No live Payment Link yet — set window.TINYINVOICE_CONFIG.paymentLink, or use ?demo=1 for local smoke test.";
      els.payBtn.disabled = on;
    }
  }

  function addItemRow(desc = "", qty = 1, rate = 0) {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <label>Description<input class="desc" value="${desc.replace(/"/g, "&quot;")}" /></label>
      <label>Qty<input class="qty" type="number" min="0" step="0.01" value="${qty}" /></label>
      <label>Rate<input class="rate" type="number" min="0" step="0.01" value="${rate}" /></label>
      <button type="button" class="btn ghost danger remove" title="Remove">✕</button>
    `;
    row.querySelector(".remove").addEventListener("click", () => {
      row.remove();
      render();
      maybeShowFeedbackNudge();
    });
    row.querySelectorAll("input").forEach((i) => i.addEventListener("input", () => {
      render();
      maybeShowFeedbackNudge();
    }));
    els.items.appendChild(row);
  }

  function readItems() {
    return [...els.items.querySelectorAll(".item-row")].map((row) => {
      const description = row.querySelector(".desc").value.trim() || "Item";
      const qty = parseFloat(row.querySelector(".qty").value) || 0;
      const rate = parseFloat(row.querySelector(".rate").value) || 0;
      return { description, qty, rate, amount: qty * rate };
    });
  }

  function render() {
    const currency = els.currency.value;
    const items = readItems();
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    els.totalLabel.textContent = `Total ${money(subtotal, currency)}`;

    const rows = items
      .map(
        (i) => `<tr>
        <td>${escapeHtml(i.description)}</td>
        <td class="num">${i.qty}</td>
        <td class="num">${money(i.rate, currency)}</td>
        <td class="num">${money(i.amount, currency)}</td>
      </tr>`
      )
      .join("");

    els.invoice.innerHTML = `
      <div class="inv-top">
        <div>
          <div class="inv-title">INVOICE</div>
          <div style="margin-top:8px;font-size:13px;color:#516074">Generated with TinyInvoice</div>
        </div>
        <div class="inv-meta">
          <div><strong>#</strong> ${escapeHtml(els.invoiceNo.value)}</div>
          <div><strong>Date</strong> ${escapeHtml(els.invoiceDate.value)}</div>
          <div><strong>Due</strong> ${escapeHtml(els.dueDate.value)}</div>
        </div>
      </div>
      <div class="parties">
        <div>
          <h4>From</h4>
          <strong>${escapeHtml(els.fromName.value)}</strong>
          <div>${escapeHtml(els.fromEmail.value)}</div>
        </div>
        <div>
          <h4>Bill to</h4>
          <strong>${escapeHtml(els.toName.value)}</strong>
          <div>${escapeHtml(els.toEmail.value)}</div>
        </div>
      </div>
      <table class="items">
        <thead>
          <tr>
            <th>Description</th>
            <th class="num">Qty</th>
            <th class="num">Rate</th>
            <th class="num">Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals">
        <table>
          <tr><td>Subtotal</td><td style="text-align:right">${money(subtotal, currency)}</td></tr>
          <tr><td class="grand">Total</td><td class="grand" style="text-align:right">${money(subtotal, currency)}</td></tr>
        </table>
      </div>
      <div class="inv-notes">${escapeHtml(els.notes.value)}</div>
    `;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function downloadPdf() {
    if (!isUnlocked()) return;
    const opt = {
      margin: 0.4,
      filename: `${els.invoiceNo.value || "invoice"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    // Temporarily hide watermark for capture if somehow visible
    els.watermark.classList.add("hidden");
    await html2pdf().set(opt).from(els.invoice).save();
  }

  function handleReturnParams() {
    const q = new URLSearchParams(location.search);
    if (q.get("unlocked") === "1" || q.get("paid") === "1") {
      setUnlocked(true);
      history.replaceState({}, "", location.pathname);
      return;
    }
    if (cfg.allowDemoUnlock && q.get("demo") === "1") {
      setUnlocked(true);
      history.replaceState({}, "", location.pathname);
    }
  }

  els.addItem.addEventListener("click", () => {
    addItemRow("New item", 1, 50);
    render();
    maybeShowFeedbackNudge();
  });
  [
    els.fromName, els.fromEmail, els.toName, els.toEmail,
    els.invoiceNo, els.invoiceDate, els.dueDate, els.currency, els.notes,
  ].forEach((el) => el.addEventListener("input", render));
  [els.fromName, els.fromEmail, els.toName, els.toEmail].forEach((el) => {
    el.addEventListener("input", maybeShowFeedbackNudge);
  });

  const SHARE_URL = "https://summerlv.github.io/Tinystep/";
  const ISSUE_URL = "https://github.com/SummerLv/Tinystep/issues/2";
  const NUDGE_KEY = "tinyinvoice_feedback_nudge_v1";
  let meaningfulBaseline = "";
  let nudgeTimer = 0;

  function readNudgeFlag() {
    try {
      return localStorage.getItem(NUDGE_KEY);
    } catch {
      return null;
    }
  }

  function writeNudgeFlag(value) {
    try {
      localStorage.setItem(NUDGE_KEY, value);
    } catch {
      // Storage can be blocked; the note still shows for this page load.
    }
  }

  function meaningfulSignature() {
    const items = [...els.items.querySelectorAll(".item-row")].map((row) => ({
      description: row.querySelector(".desc").value,
      qty: row.querySelector(".qty").value,
      rate: row.querySelector(".rate").value,
    }));
    return JSON.stringify({
      fromName: els.fromName.value,
      fromEmail: els.fromEmail.value,
      toName: els.toName.value,
      toEmail: els.toEmail.value,
      items,
    });
  }

  function hideFeedbackNudge() {
    if (els.feedbackNudge) els.feedbackNudge.hidden = true;
  }

  function showFeedbackNudge() {
    if (!els.feedbackNudge || readNudgeFlag()) return;
    if (meaningfulSignature() === meaningfulBaseline) return;
    writeNudgeFlag("shown");
    els.feedbackNudge.hidden = false;
  }

  function maybeShowFeedbackNudge() {
    if (!els.feedbackNudge || readNudgeFlag()) return;
    clearTimeout(nudgeTimer);
    if (meaningfulSignature() === meaningfulBaseline) return;
    nudgeTimer = setTimeout(showFeedbackNudge, 600);
  }

  function dismissFeedbackNudge() {
    clearTimeout(nudgeTimer);
    writeNudgeFlag("dismissed");
    hideFeedbackNudge();
  }

  document.querySelectorAll('a[href="' + ISSUE_URL + '"]').forEach((link) => {
    link.addEventListener("click", () => {
      clearTimeout(nudgeTimer);
      writeNudgeFlag("opened");
      hideFeedbackNudge();
    });
  });
  els.dismissNudge.addEventListener("click", dismissFeedbackNudge);
  let copyResetTimer = 0;

  async function copyShareLink() {
    const btn = els.copyLinkBtn;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(SHARE_URL);
      } else {
        const field = document.createElement("textarea");
        field.value = SHARE_URL;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("copy failed");
      }
      btn.textContent = "Copied!";
      btn.classList.add("copied");
    } catch {
      btn.textContent = "Copy failed";
      btn.classList.remove("copied");
    }
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      btn.textContent = "Copy link";
      btn.classList.remove("copied");
    }, 1600);
  }

  els.copyLinkBtn.addEventListener("click", () => {
    copyShareLink();
  });
  els.printBtn.addEventListener("click", () => window.print());
  els.downloadBtn.addEventListener("click", () => downloadPdf().catch(console.error));

  async function startCheckout() {
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (r.ok) {
        const data = await r.json();
        if (data.url) { window.location.href = data.url; return true; }
      }
    } catch (_) {}
    return false;
  }

  els.payBtn.addEventListener("click", async () => {
    if (isUnlocked()) return;
    if (await startCheckout()) return;
    if (cfg.paymentLink) {
      els.payModal.showModal();
    } else if (cfg.allowDemoUnlock) {
      // Smoke-test path while payment account missing
      if (confirm("No live Payment Link configured.\n\nUnlock in DEMO mode for local testing? (does not collect $1)")) {
        setUnlocked(true);
      }
    } else {
      alert("Payment is not configured yet.");
    }
  });

  els.confirmPay.addEventListener("click", (e) => {
    e.preventDefault();
    if (!cfg.paymentLink) return;
    const returnUrl = encodeURIComponent(location.origin + location.pathname + "?unlocked=1");
    // Many Payment Links support ?client_reference_id=; success URL is set in Stripe Dashboard.
    // We still open the link; user returns manually or via configured success URL.
    const url = cfg.paymentLink.includes("?")
      ? `${cfg.paymentLink}&prefilled_return=${returnUrl}`
      : `${cfg.paymentLink}?prefilled_return=${returnUrl}`;
    window.location.href = cfg.paymentLink;
    els.payModal.close();
  });

  // Seed sample lines, then remember them so the feedback note waits for a real edit.
  addItemRow("Product design sprint", 1, 900);
  addItemRow("Landing page implementation", 8, 75);
  meaningfulBaseline = meaningfulSignature();
  handleReturnParams();
  refreshUnlockUI();
  render();
})();
