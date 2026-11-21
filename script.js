// =========================================================
// ตรอ. ออโต้เช็ค พลัส — Template V4 Interactive Script
// =========================================================

(() => {
  // ---------- 1. Mobile Nav & Scroll Topbar ----------
  const topbar = document.getElementById('top');
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  // ---------- 2. Live Open / Closed Status (Mon-Sat 08:00-17:00 TH) ----------
  const statusPill = document.getElementById('liveStatusPill');
  const statusText = document.getElementById('liveStatusText');

  function updateLiveStatus() {
    if (!statusPill || !statusText) return;
    try {
      const now = new Date();
      // Convert to Thailand time (UTC+7)
      const thStr = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
      const th = new Date(thStr);
      const day = th.getDay(); // 0 = Sun, 1..6 = Mon..Sat
      const mins = th.getHours() * 60 + th.getMinutes();
      const openMins = 8 * 60;  // 08:00
      const closeMins = 17 * 60; // 17:00

      if (day >= 1 && day <= 6 && mins >= openMins && mins < closeMins) {
        statusPill.dataset.open = 'true';
        statusText.textContent = 'เปิดให้บริการตอนนี้ · ถึง 17:00 น.';
      } else if (day === 0) {
        statusPill.dataset.open = 'false';
        statusText.textContent = 'วันอาทิตย์ปิดทำการ · เปิดจันทร์ 08:00 น.';
      } else {
        statusPill.dataset.open = 'false';
        statusText.textContent = 'ปิดทำการ · เปิดบริการ จ–ส 08:00–17:00 น.';
      }
    } catch {
      statusPill.dataset.open = 'true';
      statusText.textContent = 'เปิดให้บริการ จ–ส 08:00–17:00 น.';
    }
  }
  updateLiveStatus();

  // ---------- 3. Interactive Fee & P.R.B. Calculator ----------
  const vehicleBtns = document.querySelectorAll('.vehicle-btn');
  const optInspect = document.getElementById('optInspect');
  const optPrb = document.getElementById('optPrb');
  const optTax = document.getElementById('optTax');
  const optGas = document.getElementById('optGas');
  const gasAddonWrap = document.getElementById('gasAddonWrap');

  const priceInspectLabel = document.getElementById('priceInspectLabel');
  const pricePrbLabel = document.getElementById('pricePrbLabel');
  const sumVehicleName = document.getElementById('sumVehicleName');
  const summaryList = document.getElementById('summaryList');
  const summaryTotal = document.getElementById('summaryTotal');
  const copyQuoteBtn = document.getElementById('copyQuoteBtn');
  const copyFeedback = document.getElementById('copyFeedback');

  const TAX_SERVICE_FEE = 150;
  const GAS_CHECK_FEE = 500;

  let selectedVehicle = {
    name: 'รถเก๋ง / SUV / กระบะ 4 ประตู (รย.1)',
    inspect: 200,
    prb: 645.21,
    gasAllowed: true,
  };

  function formatBaht(num) {
    return Number(num).toLocaleString('th-TH', {
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  function renderCalculator() {
    if (!summaryList || !summaryTotal) return;

    priceInspectLabel.textContent = `${formatBaht(selectedVehicle.inspect)} บ.`;
    pricePrbLabel.textContent = `${formatBaht(selectedVehicle.prb)} บ.`;
    sumVehicleName.textContent = selectedVehicle.name;

    if (!selectedVehicle.gasAllowed) {
      optGas.checked = false;
      gasAddonWrap.classList.add('disabled');
    } else {
      gasAddonWrap.classList.remove('disabled');
    }

    const items = [];
    let total = 0;

    if (optInspect.checked) {
      items.push({ label: 'ค่าตรวจสภาพรถ (ตรอ.)', price: selectedVehicle.inspect });
      total += selectedVehicle.inspect;
    }
    if (optPrb.checked) {
      items.push({ label: 'ค่า พ.ร.บ. (อัตราทางการ)', price: selectedVehicle.prb });
      total += selectedVehicle.prb;
    }
    if (optTax.checked) {
      items.push({ label: 'ค่าบริการฝากต่อภาษี', price: TAX_SERVICE_FEE });
      total += TAX_SERVICE_FEE;
    }
    if (optGas.checked && selectedVehicle.gasAllowed) {
      items.push({ label: 'ค่าตรวจถังแก๊ส LPG / NGV', price: GAS_CHECK_FEE });
      total += GAS_CHECK_FEE;
    }

    if (items.length === 0) {
      summaryList.innerHTML = '<li><span>กรุณาเลือกบริการอย่างน้อย 1 รายการ</span><b>฿0</b></li>';
    } else {
      summaryList.innerHTML = items
        .map((it) => `<li><span>${it.label}</span><b>฿${formatBaht(it.price)}</b></li>`)
        .join('');
    }

    summaryTotal.textContent = `฿${formatBaht(total)}`;
  }

  vehicleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      vehicleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedVehicle = {
        name: btn.dataset.name,
        inspect: parseFloat(btn.dataset.inspect),
        prb: parseFloat(btn.dataset.prb),
        gasAllowed: btn.dataset.gas === 'true',
      };
      renderCalculator();
    });
  });

  [optInspect, optPrb, optTax, optGas].forEach((input) => {
    if (input) input.addEventListener('change', renderCalculator);
  });

  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', async () => {
      const lines = [`สวัสดีครับ สอบถามจองคิวตรวจสภาพรถ`, `ประเภทรถ: ${selectedVehicle.name}`];
      if (optInspect.checked) lines.push(`• ตรวจสภาพรถ (ตรอ.): ${formatBaht(selectedVehicle.inspect)} บ.`);
      if (optPrb.checked) lines.push(`• ทำ พ.ร.บ.: ${formatBaht(selectedVehicle.prb)} บ.`);
      if (optTax.checked) lines.push(`• ฝากต่อภาษี (+ค่าบริการ ${TAX_SERVICE_FEE} บ.)`);
      if (optGas.checked && selectedVehicle.gasAllowed) lines.push(`• ตรวจถังแก๊ส LPG/NGV: ${GAS_CHECK_FEE} บ.`);
      lines.push(`ยอดประมาณการเบื้องต้น: ${summaryTotal.textContent}`);

      const msg = lines.join('\n');
      try {
        await navigator.clipboard.writeText(msg);
        copyFeedback.textContent = '✓ คัดลอกรายการเรียบร้อยแล้ว ส่งวางในแชท LINE ได้เลยครับ!';
      } catch {
        copyFeedback.textContent = '✓ พร้อมส่งจองคิวแล้ว ทัก LINE @tro-demo ได้เลยครับ!';
      }
      setTimeout(() => {
        copyFeedback.textContent = '';
      }, 4500);
    });
  }

  renderCalculator();

  // ---------- 4. Lightbox Image Zoom ----------
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');

  function openLightbox(src, caption) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = caption || '';
    lbCaption.textContent = caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox-src]').forEach((el) => {
    el.addEventListener('click', () => {
      openLightbox(el.dataset.lightboxSrc, el.dataset.lightboxCaption);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---------- 5. Smooth Scroll Reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
