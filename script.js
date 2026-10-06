(() => {
  'use strict';
  let step = 0;
  const backdrop = document.getElementById('backdrop');
  const results = document.getElementById('results');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const metrics = [...document.querySelectorAll('.metric')];
  const labels = ['Backdrop lễ tổng kết dự án Risk STP', 'Những con số ấn tượng', '8800', '96,1%', '15%'];
  const lastStep = labels.length - 1;
  const backdropPicker = document.getElementById('backdrop-picker');
  const backdropImage = document.getElementById('backdrop-image');
  const versionButtons = [...document.querySelectorAll('[data-version]')];
  const backdropVersions = {
    '1': 'assets/backdrop.png',
    '2': 'assets/backdrop-v2.png',
    '3': 'assets/backdrop-v3.png',
    '4': 'assets/backdrop-v4.png',
    '5': 'assets/backdrop-v5.png',
    '6': 'assets/backdrop-v6.png'
  };

  function chooseBackdrop(version) {
    if (!Object.prototype.hasOwnProperty.call(backdropVersions, version)) return;
    backdropImage.src = backdropVersions[version];
    backdropImage.alt = `Backdrop V${version} — MSB và Risk STP — Đồng hành khát vọng, bản lĩnh tiên phong. Lễ tổng kết dự án Risk STP.`;
    versionButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.version === version)));
    document.getElementById('announcement').textContent = `Đã chọn backdrop V${version}`;
    try { localStorage.setItem('risk-stp-backdrop-version', version); } catch { /* Selection still works without storage. */ }
  }
  versionButtons.forEach(button => button.addEventListener('click', () => chooseBackdrop(button.dataset.version)));
  try {
    const savedVersion = localStorage.getItem('risk-stp-backdrop-version');
    if (savedVersion) chooseBackdrop(savedVersion);
  } catch { /* Keep V1 when browser storage is unavailable. */ }

  function goTo(value) {
    step = Math.max(0, Math.min(lastStep, value));
    backdrop.hidden = step !== 0;
    backdropPicker.hidden = step !== 0;
    results.hidden = step === 0;
    // Commit the initial hidden state before animating the first reveal.
    if (step === 1) void results.offsetWidth;
    metrics.forEach(metric => {
      const visible = Number(metric.dataset.step) <= step;
      metric.classList.toggle('revealed', visible);
      metric.setAttribute('aria-hidden', String(!visible));
    });
    previous.disabled = step === 0;
    next.innerHTML = `<span aria-hidden="true">${step === lastStep ? '↺' : '→'}</span>`;
    next.setAttribute('aria-label', step === lastStep ? 'Xem lại' : 'Tiếp theo');
    next.title = step === lastStep ? 'Xem lại từ đầu' : 'Tiếp theo (→)';
    document.getElementById('announcement').textContent = labels[step];
  }

  function advance() { if (step < lastStep) goTo(step + 1); }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else document.getElementById('announcement').textContent = 'Trình duyệt này không hỗ trợ chế độ toàn màn hình.';
    } catch {
      document.getElementById('announcement').textContent = 'Không thể bật toàn màn hình. Bạn có thể dùng F11 của trình duyệt.';
    }
  }

  document.getElementById('presentation').addEventListener('click', advance);
  next.addEventListener('click', () => step === lastStep ? goTo(0) : advance());
  previous.addEventListener('click', () => goTo(step - 1));
  document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    document.getElementById('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Thoát toàn màn hình' : 'Toàn màn hình');
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select')) return;
    if (event.key === ' ' && event.target.closest('button, a')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); advance(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(step - 1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    else if (event.key.toLowerCase() === 'f') toggleFullscreen();
  });
})();
