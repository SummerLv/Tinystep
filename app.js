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
    nudgeFeedbackLink: document.getElementById("nudgeFeedbackLink"),
    dismissNudge: document.getElementById("dismissNudge"),
    payHint: document.getElementById("payHint"),
    payModal: document.getElementById("payModal"),
    confirmPay: document.getElementById("confirmPay"),
    addItem: document.getElementById("addItem"),
    fillSampleBtn: document.getElementById("fillSampleBtn"),
    openDemoBtn: document.getElementById("openDemoBtn"),
    firstTryBtn: document.getElementById("firstTryBtn"),
    peekParties: document.getElementById("peekParties"),
    peekTotal: document.getElementById("peekTotal"),
    fromField: document.getElementById("fromField"),
  };

  const LANG_KEY = "tinyinvoice_lang_v1";
  const I18N = {
    en: {
      pageTitle: "TinyInvoice — Free invoice preview (feedback welcome)",
      tag: "Free preview · feedback welcome",
      langGroup: "Language",
      feedbackCta: "Leave feedback",
      shareOnX: "Share on X",
      shareText: "TinyInvoice: free live invoice preview in the browser — no signup. Looking for feedback: https://summerlv.github.io/Tinystep/",
      copyLink: "Copy link",
      copied: "Copied!",
      copyFailed: "Copy failed",
      locked: "Locked",
      unlocked: "Unlocked",
      h1: "Try a free invoice preview in 60 seconds",
      fillSample: "Fill sample invoice",
      sampleFilled: "Sample filled",
      openDemo: "Open demo draft",
      demoOpened: "Demo draft open",
      seePreview: "See preview",
      firstTryTitle: "See a finished invoice",
      firstTryBody: "One tap opens the demo draft and the live preview. No signup.",
      firstTryCta: "Open demo draft",
      lede: "Fill the form → <strong>live preview is free</strong> (no signup). Optional $1 PDF unlock uses a <strong>Stripe TEST</strong> checkout, not a real charge. Feedback welcome — tell us what feels broken.",
      peekKicker: "Live preview · tap to open",
      ctaBanner: 'Fill sample invoice, or edit From, Bill to, or a line item — the live preview is free. <a id="bannerFeedbackLink" href="https://github.com/SummerLv/Tinystep/issues/2" target="_blank" rel="noopener noreferrer">Leave a one-line comment on Issue #2</a>. PDF unlock is optional (Stripe test).',
      fromYou: "From (you)",
      fromEmail: "From email",
      billTo: "Bill to",
      clientEmail: "Client email",
      invoiceNo: "Invoice #",
      date: "Date",
      currency: "Currency",
      dueDate: "Due date",
      lineItems: "Line items",
      description: "Description",
      qty: "Qty",
      rate: "Rate",
      remove: "Remove",
      addLine: "+ Add line",
      notes: "Notes",
      phFromName: "Acme Studio",
      phFromEmail: "alex@example.com",
      phToName: "Client Co.",
      phToEmail: "ap@client.com",
      phNotes: "Payment terms, bank details…",
      payBtn: "Unlock PDF — $1 test",
      downloadBtn: "Download PDF",
      printBtn: "Print preview",
      hintFree: "Preview stays free. The $1 button opens a Stripe TEST checkout — not a real charge. Feedback welcome.",
      hintUnlocked: "Unlocked on this browser. You can download a watermark-free PDF. Feedback is still welcome.",
      hintDemoOn: "Demo unlock active (no live payment configured).",
      hintDemoOff: "No live Payment Link yet — set window.TINYINVOICE_CONFIG.paymentLink, or use ?demo=1 for local smoke test.",
      livePreview: "Live preview",
      you: "You",
      client: "Client",
      from: "From",
      invoiceWord: "INVOICE",
      generated: "Generated with TinyInvoice",
      due: "Due",
      subtotal: "Subtotal",
      total: "Total",
      amount: "Amount",
      itemFallback: "Item",
      watermark: "PREVIEW · TinyInvoice",
      footer: "TinyInvoice · free preview · optional $1 test PDF · no account",
      privacy: "Privacy",
      modalTitle: "Optional PDF unlock ($1 test)",
      modalBody: "This opens a <strong>Stripe TEST</strong> checkout. It is not a live charge and does not require an account. The free preview stays available either way.",
      cancel: "Cancel",
      continuePay: "Continue to test checkout",
      nudgeTitle: "Preview updated.",
      nudgeBody: "A one-line comment on Issue #2 helps — what felt off? No signup.",
      nudgeCta: "Comment on Issue #2",
      notNow: "Not now",
      demoConfirm: "No live Payment Link configured.\n\nUnlock in DEMO mode for local testing? (does not collect $1)",
      payMissing: "Payment is not configured yet.",
    },
    zh: {
      pageTitle: "TinyInvoice — 免费发票预览（欢迎反馈）",
      tag: "免费预览 · 欢迎反馈",
      langGroup: "语言",
      feedbackCta: "留下反馈",
      shareOnX: "分享到 X",
      shareText: "TinyInvoice：浏览器里免费实时发票预览，无需注册。欢迎反馈：https://summerlv.github.io/Tinystep/",
      copyLink: "复制链接",
      copied: "已复制",
      copyFailed: "复制失败",
      locked: "未解锁",
      unlocked: "已解锁",
      h1: "60 秒免费试用发票预览",
      fillSample: "填入示例发票",
      sampleFilled: "已填入示例",
      openDemo: "打开演示草稿",
      demoOpened: "演示已打开",
      seePreview: "查看预览",
      firstTryTitle: "先看一张填好的发票",
      firstTryBody: "点一下打开演示草稿和实时预览，无需注册。",
      firstTryCta: "打开演示草稿",
      lede: "填写表单 → <strong>实时预览免费</strong>（无需注册）。可选的 $1 PDF 解锁使用 <strong>Stripe 测试</strong>结账，不会真实扣款。欢迎反馈——告诉我们哪里不顺手。",
      peekKicker: "实时预览 · 点按打开",
      ctaBanner: '填入示例发票，或修改开票方、账单接收方或一行明细——实时预览免费。<a id="bannerFeedbackLink" href="https://github.com/SummerLv/Tinystep/issues/2" target="_blank" rel="noopener noreferrer">在 Issue #2 留一句评论</a>。PDF 解锁可选（Stripe 测试）。',
      fromYou: "开票方（你）",
      fromEmail: "开票方邮箱",
      billTo: "账单接收方",
      clientEmail: "客户邮箱",
      invoiceNo: "发票编号",
      date: "日期",
      currency: "币种",
      dueDate: "到期日",
      lineItems: "明细",
      description: "描述",
      qty: "数量",
      rate: "单价",
      remove: "删除",
      addLine: "+ 添加一行",
      notes: "备注",
      phFromName: "你的工作室",
      phFromEmail: "you@example.com",
      phToName: "客户公司",
      phToEmail: "client@example.com",
      phNotes: "付款条款、银行信息…",
      payBtn: "解锁 PDF — $1 测试",
      downloadBtn: "下载 PDF",
      printBtn: "打印预览",
      hintFree: "预览始终免费。$1 按钮打开的是 Stripe 测试结账，不会真实扣款。欢迎反馈。",
      hintUnlocked: "已在此浏览器解锁。可以下载无水印 PDF。仍然欢迎反馈。",
      hintDemoOn: "演示解锁已开启（未配置真实支付）。",
      hintDemoOff: "尚未配置 Payment Link — 请设置 window.TINYINVOICE_CONFIG.paymentLink，或使用 ?demo=1 做本地测试。",
      livePreview: "实时预览",
      you: "你",
      client: "客户",
      from: "开票方",
      invoiceWord: "发票",
      generated: "由 TinyInvoice 生成",
      due: "到期",
      subtotal: "小计",
      total: "合计",
      amount: "金额",
      itemFallback: "项目",
      watermark: "预览 · TinyInvoice",
      footer: "TinyInvoice · 免费预览 · 可选 $1 测试 PDF · 无需账户",
      privacy: "隐私",
      modalTitle: "可选 PDF 解锁（$1 测试）",
      modalBody: "这将打开 <strong>Stripe 测试</strong>结账。不是真实扣款，也不需要账户。免费预览始终可用。",
      cancel: "取消",
      continuePay: "继续测试结账",
      nudgeTitle: "预览已更新。",
      nudgeBody: "在 Issue #2 留一句评论很有帮助——哪里不顺手？无需注册。",
      nudgeCta: "在 Issue #2 评论",
      notNow: "暂时不用",
      demoConfirm: "尚未配置 Payment Link。\n\n是否以演示模式解锁以便本地测试？（不会收取 $1）",
      payMissing: "支付尚未配置。",
    },
  };

  function detectLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "en" || saved === "zh") return saved;
    } catch (_) {}
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("zh") ? "zh" : "en";
  }

  let lang = detectLang();

  function t(key) {
    const pack = I18N[lang] || I18N.en;
    return pack[key] || I18N.en[key] || key;
  }

  function shareHref() {
    const text = t("shareText").replace(SHARE_URL, currentShareUrl());
    return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  }

  function applyTransientLabels() {
    const copyBtn = els.copyLinkBtn;
    if (copyBtn.classList.contains("copied")) copyBtn.textContent = t("copied");
    else if (copyBtn.dataset.failed === "1") copyBtn.textContent = t("copyFailed");
    else copyBtn.textContent = t("copyLink");
    if (els.fillSampleBtn) {
      els.fillSampleBtn.textContent = els.fillSampleBtn.classList.contains("filled")
        ? t("sampleFilled")
        : t("fillSample");
    }
    if (els.openDemoBtn) {
      els.openDemoBtn.textContent = els.openDemoBtn.classList.contains("opened")
        ? t("demoOpened")
        : t("openDemo");
    }
  }

  function applyChrome() {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = t(el.getAttribute("data-i18n-title"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    const share = document.getElementById("shareOnX");
    if (share) share.href = shareHref();
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
    applyTransientLabels();
    refreshUnlockUI();
    render();
  }

  function setLang(next) {
    if (next !== "en" && next !== "zh") return;
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
    applyChrome();
  }

  const SAMPLE_INVOICE = {
    fromName: "Maya Chen",
    fromEmail: "hello@mayachen.studio",
    toName: "Northline Goods",
    toEmail: "accounts@northlinegoods.example",
    invoiceNo: "INV-2048",
    currency: "USD",
    notes:
      "Payment due within 14 days of the invoice date.\n" +
      "ACH or wire. Please include INV-2048 on the transfer.\n" +
      "Covers brand identity, marketing site design, and frontend implementation for the spring launch.\n" +
      "Thank you — Maya Chen Studio.",
    items: [
      { description: "Brand workshop and discovery", qty: 1, rate: 1200 },
      { description: "Visual identity system", qty: 1, rate: 2800 },
      { description: "Marketing site design and build", qty: 36, rate: 110 },
    ],
  };

  // Fixed dates keep the public demo #d= link stable. Fill sample still uses today.
  function demoDraft() {
    return {
      fromName: SAMPLE_INVOICE.fromName,
      fromEmail: SAMPLE_INVOICE.fromEmail,
      toName: SAMPLE_INVOICE.toName,
      toEmail: SAMPLE_INVOICE.toEmail,
      invoiceNo: SAMPLE_INVOICE.invoiceNo,
      invoiceDate: "2026-10-21",
      dueDate: "2026-11-04",
      currency: SAMPLE_INVOICE.currency,
      notes: SAMPLE_INVOICE.notes,
      items: SAMPLE_INVOICE.items.map((item) => ({
        description: item.description,
        qty: item.qty,
        rate: item.rate,
      })),
    };
  }

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
    els.unlockBadge.textContent = on ? t("unlocked") : t("locked");
    els.unlockBadge.classList.toggle("unlocked", on);
    els.watermark.classList.toggle("hidden", on);
    els.downloadBtn.disabled = !on;
    if (cfg.paymentLink) {
      els.payHint.textContent = on ? t("hintUnlocked") : t("hintFree");
      els.payBtn.disabled = on;
    } else {
      els.payHint.textContent = on ? t("hintDemoOn") : t("hintDemoOff");
      els.payBtn.disabled = on;
    }
  }

  function addItemRow(desc = "", qty = 1, rate = 0) {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <label><span data-i18n="description">${t("description")}</span><input class="desc" /></label>
      <label><span data-i18n="qty">${t("qty")}</span><input class="qty" type="number" min="0" step="0.01" /></label>
      <label><span data-i18n="rate">${t("rate")}</span><input class="rate" type="number" min="0" step="0.01" /></label>
      <button type="button" class="btn ghost danger remove" data-i18n-title="remove" title="${t("remove")}">✕</button>
    `;
    row.querySelector(".desc").value = desc;
    row.querySelector(".qty").value = qty;
    row.querySelector(".rate").value = rate;
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
      const description = row.querySelector(".desc").value.trim() || t("itemFallback");
      const qty = parseFloat(row.querySelector(".qty").value) || 0;
      const rate = parseFloat(row.querySelector(".rate").value) || 0;
      return { description, qty, rate, amount: qty * rate };
    });
  }

  function render() {
    const currency = els.currency.value;
    const items = readItems();
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const totalText = `${t("total")} ${money(subtotal, currency)}`;
    els.totalLabel.textContent = totalText;
    if (els.peekTotal) els.peekTotal.textContent = totalText;
    if (els.peekParties) {
      const from = els.fromName.value.trim() || t("you");
      const to = els.toName.value.trim() || t("client");
      els.peekParties.textContent = `${from} → ${to}`;
    }

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
          <div class="inv-title">${escapeHtml(t("invoiceWord"))}</div>
          <div style="margin-top:8px;font-size:13px;color:#516074">${escapeHtml(t("generated"))}</div>
        </div>
        <div class="inv-meta">
          <div><strong>#</strong> ${escapeHtml(els.invoiceNo.value)}</div>
          <div><strong>${escapeHtml(t("date"))}</strong> ${escapeHtml(els.invoiceDate.value)}</div>
          <div><strong>${escapeHtml(t("due"))}</strong> ${escapeHtml(els.dueDate.value)}</div>
        </div>
      </div>
      <div class="parties">
        <div>
          <h4>${escapeHtml(t("from"))}</h4>
          <strong>${escapeHtml(els.fromName.value)}</strong>
          <div>${escapeHtml(els.fromEmail.value)}</div>
        </div>
        <div>
          <h4>${escapeHtml(t("billTo"))}</h4>
          <strong>${escapeHtml(els.toName.value)}</strong>
          <div>${escapeHtml(els.toEmail.value)}</div>
        </div>
      </div>
      <table class="items">
        <thead>
          <tr>
            <th>${escapeHtml(t("description"))}</th>
            <th class="num">${escapeHtml(t("qty"))}</th>
            <th class="num">${escapeHtml(t("rate"))}</th>
            <th class="num">${escapeHtml(t("amount"))}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals">
        <table>
          <tr><td>${escapeHtml(t("subtotal"))}</td><td style="text-align:right">${money(subtotal, currency)}</td></tr>
          <tr><td class="grand">${escapeHtml(t("total"))}</td><td class="grand" style="text-align:right">${money(subtotal, currency)}</td></tr>
        </table>
      </div>
      <div class="inv-notes">${escapeHtml(els.notes.value)}</div>
    `;
    const share = document.getElementById("shareOnX");
    if (share) share.href = shareHref();
    syncDraftHash();
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

  let sampleResetTimer = 0;
  let sampleFlashTimer = 0;

  function fillSampleInvoice() {
    els.fromName.value = SAMPLE_INVOICE.fromName;
    els.fromEmail.value = SAMPLE_INVOICE.fromEmail;
    els.toName.value = SAMPLE_INVOICE.toName;
    els.toEmail.value = SAMPLE_INVOICE.toEmail;
    els.invoiceNo.value = SAMPLE_INVOICE.invoiceNo;
    els.currency.value = SAMPLE_INVOICE.currency;
    els.invoiceDate.value = todayISO();
    els.dueDate.value = plusDays(14);
    els.notes.value = SAMPLE_INVOICE.notes;
    els.items.replaceChildren();
    SAMPLE_INVOICE.items.forEach((item) => {
      addItemRow(item.description, item.qty, item.rate);
    });
    render();
    if (els.fromField) els.fromField.classList.add("sample-ready");

    const btn = els.fillSampleBtn;
    btn.textContent = t("sampleFilled");
    btn.classList.add("filled");
    els.invoice.classList.add("just-filled");
    clearTimeout(sampleResetTimer);
    clearTimeout(sampleFlashTimer);
    sampleResetTimer = setTimeout(() => {
      btn.textContent = t("fillSample");
      btn.classList.remove("filled");
    }, 1600);
    sampleFlashTimer = setTimeout(() => {
      els.invoice.classList.remove("just-filled");
    }, 1200);

    scrollToPreview();
  }

  function scrollToPreview() {
    const preview = document.getElementById("livePreview");
    const form = document.querySelector(".form-panel");
    if (!preview || !form || !window.matchMedia("(max-width: 960px)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = Math.max(0, form.getBoundingClientRect().bottom + window.scrollY);
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.querySelectorAll('a[href="#livePreview"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const mobile = window.matchMedia("(max-width: 960px)").matches;
      // Keep a draft hash in the address bar. Native #livePreview navigation would replace it.
      if (!mobile && !location.hash.startsWith("#d=")) return;
      event.preventDefault();
      if (mobile) scrollToPreview();
      else document.getElementById("livePreview")?.scrollIntoView({ block: "nearest" });
    });
  });

  els.fillSampleBtn.addEventListener("click", fillSampleInvoice);
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-set-lang")));
  });
  [
    els.fromName, els.fromEmail, els.toName, els.toEmail,
    els.invoiceNo, els.invoiceDate, els.dueDate, els.currency, els.notes,
  ].forEach((el) => el.addEventListener("input", () => {
    render();
    if (el === els.fromName && els.fromField) els.fromField.classList.add("edited");
  }));

  const formPanel = document.querySelector(".form-panel");
  formPanel.addEventListener("focusin", (event) => {
    if (event.target.matches("input, textarea, select")) document.body.classList.add("keyboard-open");
  });
  formPanel.addEventListener("focusout", (event) => {
    const next = event.relatedTarget;
    if (next && formPanel.contains(next) && next.matches("input, textarea, select")) return;
    document.body.classList.remove("keyboard-open");
  });
  [els.fromName, els.fromEmail, els.toName, els.toEmail].forEach((el) => {
    el.addEventListener("input", maybeShowFeedbackNudge);
  });

  const SHARE_URL = "https://summerlv.github.io/Tinystep/";
  // #d=<base64url JSON>. Hash is not sent to the server. Ignore anything past a typical shareable URL.
  const MAX_SHARE_URL = 8000;
  const MAX_DRAFT_ITEMS = 40;
  const MAX_DRAFT_FIELD = 4000;
  const CURRENCIES = new Set(["USD", "CNY", "HKD", "EUR", "GBP", "SGD"]);
  let defaultDraft = null;

  function base64UrlEncode(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function base64UrlDecode(text) {
    const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const bin = atob(b64 + pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function readDraft() {
    const items = [...els.items.querySelectorAll(".item-row")].map((row) => {
      const qty = Number(row.querySelector(".qty").value);
      const rate = Number(row.querySelector(".rate").value);
      return {
        description: row.querySelector(".desc").value,
        qty: Number.isFinite(qty) ? qty : 0,
        rate: Number.isFinite(rate) ? rate : 0,
      };
    });
    return {
      fromName: els.fromName.value,
      fromEmail: els.fromEmail.value,
      toName: els.toName.value,
      toEmail: els.toEmail.value,
      invoiceNo: els.invoiceNo.value,
      invoiceDate: els.invoiceDate.value,
      dueDate: els.dueDate.value,
      currency: els.currency.value,
      notes: els.notes.value,
      items,
    };
  }

  function isISODate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }

  function boundedString(value, max) {
    if (typeof value !== "string" || value.length > max) return null;
    return value;
  }

  function draftFromPayload(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const fromName = boundedString(data.fn, MAX_DRAFT_FIELD);
    const fromEmail = boundedString(data.fe, MAX_DRAFT_FIELD);
    const toName = boundedString(data.tn, MAX_DRAFT_FIELD);
    const toEmail = boundedString(data.te, MAX_DRAFT_FIELD);
    const invoiceNo = boundedString(data.no, MAX_DRAFT_FIELD);
    const invoiceDate = boundedString(data.dt, 10);
    const dueDate = boundedString(data.du, 10);
    const currency = boundedString(data.c, 8);
    const notes = boundedString(data.nt, MAX_DRAFT_FIELD);
    if ([fromName, fromEmail, toName, toEmail, invoiceNo, invoiceDate, dueDate, currency, notes].includes(null)) return null;
    if (!isISODate(invoiceDate) || !isISODate(dueDate) || !CURRENCIES.has(currency)) return null;
    if (!Array.isArray(data.i) || data.i.length > MAX_DRAFT_ITEMS) return null;
    const items = [];
    for (const row of data.i) {
      if (!Array.isArray(row) || row.length < 3) return null;
      const description = boundedString(row[0], MAX_DRAFT_FIELD);
      const qty = typeof row[1] === "number" ? row[1] : NaN;
      const rate = typeof row[2] === "number" ? row[2] : NaN;
      if (description === null || !Number.isFinite(qty) || !Number.isFinite(rate)) return null;
      if (qty < 0 || rate < 0 || qty > 1e9 || rate > 1e9) return null;
      items.push({ description, qty, rate });
    }
    return { fromName, fromEmail, toName, toEmail, invoiceNo, invoiceDate, dueDate, currency, notes, items };
  }

  function encodeDraft(draft) {
    return base64UrlEncode(JSON.stringify({
      fn: draft.fromName,
      fe: draft.fromEmail,
      tn: draft.toName,
      te: draft.toEmail,
      no: draft.invoiceNo,
      dt: draft.invoiceDate,
      du: draft.dueDate,
      c: draft.currency,
      nt: draft.notes,
      i: draft.items.map((item) => [item.description, item.qty, item.rate]),
    }));
  }

  function isBlankDraft(draft) {
    const texts = [draft.fromName, draft.fromEmail, draft.toName, draft.toEmail, draft.invoiceNo, draft.notes];
    if (texts.some((value) => String(value).trim())) return false;
    return draft.items.every((item) => !String(item.description).trim() && !item.qty && !item.rate);
  }

  function draftFragment() {
    if (!defaultDraft) return "";
    const draft = readDraft();
    if (JSON.stringify(draft) === JSON.stringify(defaultDraft) || isBlankDraft(draft)) return "";
    try {
      const fragment = "#d=" + encodeDraft(draft);
      if ((SHARE_URL + fragment).length > MAX_SHARE_URL) return "";
      return fragment;
    } catch {
      return "";
    }
  }

  function currentShareUrl() {
    const fragment = draftFragment();
    return fragment ? SHARE_URL + fragment : SHARE_URL;
  }

  function syncDraftHash() {
    const fragment = draftFragment();
    if (location.hash !== fragment && (fragment || location.hash.startsWith("#d="))) {
      history.replaceState(null, "", location.pathname + location.search + fragment);
    }
    document.documentElement.classList.toggle("has-draft", location.hash.startsWith("#d="));
  }

  function applyDraft(draft) {
    els.fromName.value = draft.fromName;
    els.fromEmail.value = draft.fromEmail;
    els.toName.value = draft.toName;
    els.toEmail.value = draft.toEmail;
    els.invoiceNo.value = draft.invoiceNo;
    els.invoiceDate.value = draft.invoiceDate;
    els.dueDate.value = draft.dueDate;
    els.currency.value = draft.currency;
    els.notes.value = draft.notes;
    els.items.replaceChildren();
    draft.items.forEach((item) => addItemRow(item.description, item.qty, item.rate));
  }

  function hashFragment() {
    let hash = location.hash || "";
    if (!hash.startsWith("#")) return "";
    try { hash = decodeURIComponent(hash); } catch { /* keep the raw hash */ }
    return hash;
  }

  function loadDraftFromHash() {
    const hash = hashFragment();
    if (!hash.startsWith("#d=")) return;
    const payload = hash.slice(3).replace(/=+$/g, "");
    if (!payload || !/^[A-Za-z0-9_-]+$/.test(payload)) return;
    if ((SHARE_URL.length + 3 + payload.length) > MAX_SHARE_URL) return;
    try {
      const draft = draftFromPayload(JSON.parse(base64UrlDecode(payload)));
      if (!draft) return;
      applyDraft(draft);
    } catch {
      // Broken or oversized hash: keep the default form.
    }
  }

  let demoResetTimer = 0;
  let demoFlashTimer = 0;

  function openDemoDraft() {
    const draft = demoDraft();
    const fragment = "#d=" + encodeDraft(draft);
    applyDraft(draft);
    if (els.fromField) els.fromField.classList.add("sample-ready");
    // Publish the same #d= fragment Copy link shares. replaceState matches
    // syncDraftHash so the address bar updates without a scroll jump.
    if (location.hash !== fragment) {
      history.replaceState(null, "", location.pathname + location.search + fragment);
    }
    const link = els.openDemoBtn;
    link.textContent = t("demoOpened");
    link.classList.add("opened");
    els.invoice.classList.add("just-filled");
    clearTimeout(demoResetTimer);
    clearTimeout(demoFlashTimer);
    demoResetTimer = setTimeout(() => {
      link.textContent = t("openDemo");
      link.classList.remove("opened");
    }, 1600);
    demoFlashTimer = setTimeout(() => {
      els.invoice.classList.remove("just-filled");
    }, 1200);
    render();
    scrollToPreview();
  }
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

  els.nudgeFeedbackLink.addEventListener("click", () => {
    clearTimeout(nudgeTimer);
    writeNudgeFlag("opened");
    hideFeedbackNudge();
  });
  els.dismissNudge.addEventListener("click", dismissFeedbackNudge);
  let copyResetTimer = 0;

  async function copyShareLink() {
    const btn = els.copyLinkBtn;
    const url = currentShareUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const field = document.createElement("textarea");
        field.value = url;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("copy failed");
      }
      delete btn.dataset.failed;
      btn.textContent = t("copied");
      btn.classList.add("copied");
    } catch {
      btn.dataset.failed = "1";
      btn.textContent = t("copyFailed");
      btn.classList.remove("copied");
    }
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      delete btn.dataset.failed;
      btn.textContent = t("copyLink");
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
      if (confirm(t("demoConfirm"))) {
        setUnlocked(true);
      }
    } else {
      alert(t("payMissing"));
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

  // Seed the default lines, remember that empty state, then apply a shared draft if the hash is valid.
  addItemRow("Product design sprint", 1, 900);
  addItemRow("Landing page implementation", 8, 75);
  defaultDraft = readDraft();
  loadDraftFromHash();
  meaningfulBaseline = meaningfulSignature();
  handleReturnParams();
  applyChrome();
  if (els.openDemoBtn) {
    const fragment = "#d=" + encodeDraft(demoDraft());
    els.openDemoBtn.setAttribute("href", fragment);
    els.openDemoBtn.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openDemoDraft();
    });
    if (els.firstTryBtn) {
      els.firstTryBtn.setAttribute("href", fragment);
      els.firstTryBtn.addEventListener("click", (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openDemoDraft();
      });
    }
  }
})();
