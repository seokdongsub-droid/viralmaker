/**
 * app.js
 * 초간단 제품 링크/미디어 첨부 기반 라이프사이클 및 한/일 복붙용 UI 제어 로직
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 상태 관리 ---
  const state = {
    activeTab: 'input',
    activeChannel: 'threads-kr',
    generatedData: null,
    product: {
      link: 'https://smartstore.naver.com/sample/products/neck-care',
      memo: '하루 15분 거북목 승모근 케어, 깃털 무게 145g 온열 기능',
      name: '무선 온열 넥케어 마사지기',
      mediaSrc: null
    },
    geminiKey: localStorage.getItem('social_promo_gemini_key') || ''
  };

  // --- DOM 캐싱 ---
  const tabViews = document.querySelectorAll('.tab-view');
  const navItems = document.querySelectorAll('.nav-item');
  const toastEl = document.getElementById('toast-msg');

  // Tab 1 (간편 입력)
  const inputLink = document.getElementById('product-link');
  const inputMemo = document.getElementById('product-memo');
  const mediaFileInput = document.getElementById('product-media-file');
  const uploadBox = document.getElementById('upload-box');
  const uploadPreview = document.getElementById('upload-preview');
  const uploadPrompt = document.getElementById('upload-prompt');
  const btnGenerateAll = document.getElementById('btn-generate-all');
  const presetChips = document.querySelectorAll('.preset-chip');

  // Tab 2 (복붙 홍보글)
  const channelPills = document.querySelectorAll('.channel-pill');
  const copyTextarea = document.getElementById('copy-textarea');
  const charCounter = document.getElementById('char-counter');
  const channelInfoText = document.getElementById('channel-info-text');
  const btnCopyText = document.getElementById('btn-copy-text');
  const btnRegenChannel = document.getElementById('btn-regen-channel');

  // Tab 3 (카드뉴스)
  const canvasEl = document.getElementById('cardnews-canvas');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const btnLangKo = document.getElementById('btn-lang-ko');
  const btnLangJa = document.getElementById('btn-lang-ja');
  const ratioBtns = document.querySelectorAll('.ratio-btn');
  const themeChips = document.querySelectorAll('.theme-chip');
  const btnPrevSlide = document.getElementById('btn-prev-slide');
  const btnNextSlide = document.getElementById('btn-next-slide');
  const slideIndicatorText = document.getElementById('slide-indicator-text');
  const inputSlideBadge = document.getElementById('slide-edit-badge');
  const inputSlideTitle = document.getElementById('slide-edit-title');
  const inputSlideSubtitle = document.getElementById('slide-edit-subtitle');
  const btnDownloadSlide = document.getElementById('btn-download-slide');
  const btnDownloadAll = document.getElementById('btn-download-all');
  const btnMobileSave = document.getElementById('btn-mobile-save');

  // Tab 4 (시뮬레이터)
  const instaSimImage = document.getElementById('insta-sim-image');
  const instaSimCaption = document.getElementById('insta-sim-caption');

  // 모달들
  const modalMobileSave = document.getElementById('modal-mobile-save');
  const modalSaveImage = document.getElementById('modal-save-image');
  const btnCloseModal = document.getElementById('btn-close-modal');

  const modalQr = document.getElementById('modal-qr');
  const btnOpenQrModal = document.getElementById('btn-open-qr-modal');
  const btnCloseQrModal = document.getElementById('btn-close-qr-modal');

  const modalApiKey = document.getElementById('modal-api-key');
  const inputApiKey = document.getElementById('input-gemini-key');
  const btnOpenApiModal = document.getElementById('btn-open-api-modal');
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const btnCloseApiModal = document.getElementById('btn-close-api-modal');

  // 채널별 안내 텍스트
  const channelDescriptions = {
    'threads-kr': '⚡ 한국 스레드(Threads): 구매 링크 자동 포함, 500자 이내 일상 후기체 & 댓글 소통 유도',
    'threads-jp': '🇯🇵 일본 스레드(Threads JP): 구매 링크 자동 포함, 현지 바즈(バズり) 문체 및 QOL 추천 톤',
    'naver-blog': '📝 네이버 블로그: 링크 포함, 스마트에디터 최적화 [서론 ➔ 언박싱 ➔ 장점 ➔ 총평/구매링크]',
    'ameba-jp': '🌸 일본 아메바 블로그: 구매 링크 포함, 상냥한 絵文字 문체 & 아메바 인기 해시태그',
    'instagram': '📸 인스타그램 피드: 3줄 불렛포인트, 프로필 링크 CTA 및 인기 해시태그 20선'
  };

  // --- 초기화 ---
  CardNewsStudio.init(canvasEl, canvasWrapper);
  if (state.geminiKey) {
    inputApiKey.value = state.geminiKey;
  }

  // --- 토스트 알림 ---
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  // --- 탭 전환 ---
  function switchTab(tabId) {
    state.activeTab = tabId;

    tabViews.forEach(view => {
      if (view.id === `tab-view-${tabId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (tabId === 'cardnews') {
      updateSlideEditInputs();
      CardNewsStudio.render();
    } else if (tabId === 'preview') {
      updateSimulator();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-tab'));
    });
  });

  // --- 원클릭 샘플 로드 ---
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const index = parseInt(chip.getAttribute('data-preset'), 10);
      const sample = SampleQuickInputs[index];
      if (sample) {
        inputLink.value = sample.link;
        inputMemo.value = sample.memo;
        state.product.name = sample.name;
        state.product.link = sample.link;
        state.product.memo = sample.memo;
        showToast(`'${sample.name}' 샘플이 입력되었습니다!`);
      }
    });
  });

  // --- 사진 / 동영상 첨부 처리 ---
  uploadBox.addEventListener('click', () => {
    mediaFileInput.click();
  });

  mediaFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      showToast('🎬 동영상 썸네일 프레임을 추출하는 중...');
      CardNewsStudio.captureVideoFrame(file, (dataUrl) => {
        state.product.mediaSrc = dataUrl;
        uploadPreview.src = dataUrl;
        uploadPreview.style.display = 'block';
        uploadPrompt.style.display = 'none';
        showToast('동영상 썸네일이 카드뉴스에 적용되었습니다! 🎥');
      });
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        state.product.mediaSrc = dataUrl;
        uploadPreview.src = dataUrl;
        uploadPreview.style.display = 'block';
        uploadPrompt.style.display = 'none';

        CardNewsStudio.setUserMedia(dataUrl);
        showToast('제품 사진이 카드뉴스에 적용되었습니다! 🖼️');
      };
      reader.readAsDataURL(file);
    }
  });

  // --- 1초 일괄 생성 실행 ---
  btnGenerateAll.addEventListener('click', async () => {
    const link = inputLink.value.trim();
    const memo = inputMemo.value.trim();

    if (!link) {
      showToast('⚠️ 제품 링크(URL)를 입력해주세요.');
      inputLink.focus();
      return;
    }

    state.product.link = link;
    state.product.memo = memo;

    btnGenerateAll.disabled = true;
    const origHtml = btnGenerateAll.innerHTML;
    btnGenerateAll.innerHTML = '<span>⚡ 복붙용 글 & 한/일 카드뉴스 생성 중...</span>';

    try {
      const results = await ContentGenerator.generateAll(state.product, state.geminiKey);
      state.generatedData = results;

      // 카드뉴스 슬라이드 적용 (한국어 & 일본어 모두 세팅)
      CardNewsStudio.setGeneratedSlides(results.cardnews_ko, results.cardnews_ja);

      // 복붙 글 업데이트
      updateCopyTextView();

      showToast('🎉 복붙용 글과 한/일 카드뉴스가 완성되었습니다!');
      switchTab('copy');

    } catch (err) {
      console.error(err);
      showToast('생성 중 오류가 발생했습니다: ' + err.message);
    } finally {
      btnGenerateAll.disabled = false;
      btnGenerateAll.innerHTML = origHtml;
    }
  });

  // --- Tab 2: 복붙 글 뷰 갱신 ---
  function updateCopyTextView() {
    const ch = state.activeChannel;
    let text = '';
    if (state.generatedData && state.generatedData.texts && state.generatedData.texts[ch]) {
      text = state.generatedData.texts[ch];
    } else {
      text = ContentGenerator.generateLocalTemplate(ch, state.product);
    }
    copyTextarea.value = text;
    charCounter.textContent = `${text.length}자`;
    channelInfoText.textContent = channelDescriptions[ch] || '';
  }

  channelPills.forEach(pill => {
    pill.addEventListener('click', () => {
      channelPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeChannel = pill.getAttribute('data-channel');
      updateCopyTextView();
    });
  });

  copyTextarea.addEventListener('input', () => {
    charCounter.textContent = `${copyTextarea.value.length}자`;
    if (state.generatedData && state.generatedData.texts) {
      state.generatedData.texts[state.activeChannel] = copyTextarea.value;
    }
  });

  // 원클릭 복사
  btnCopyText.addEventListener('click', async () => {
    const textToCopy = copyTextarea.value;
    if (!textToCopy) {
      showToast('복사할 내용이 없습니다.');
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('📋 클립보드에 복사 완료! 바로 붙여넣으세요 ✨');
    } catch (err) {
      copyTextarea.select();
      document.execCommand('copy');
      showToast('📋 클립보드에 복사 완료! 바로 붙여넣으세요 ✨');
    }
  });

  // 이 글만 다시 작성
  btnRegenChannel.addEventListener('click', async () => {
    const ch = state.activeChannel;
    btnRegenChannel.disabled = true;
    btnRegenChannel.textContent = '재작성 중...';

    try {
      let newText = '';
      if (state.geminiKey) {
        newText = await ContentGenerator.generateWithGemini(ch, state.product, state.geminiKey);
      } else {
        newText = ContentGenerator.generateLocalTemplate(ch, state.product);
      }
      if (state.generatedData && state.generatedData.texts) {
        state.generatedData.texts[ch] = newText;
      }
      copyTextarea.value = newText;
      charCounter.textContent = `${newText.length}자`;
      showToast('✨ 새롭게 재작성되었습니다!');
    } catch (e) {
      showToast('재작성 실패: ' + e.message);
    } finally {
      btnRegenChannel.disabled = false;
      btnRegenChannel.textContent = '🔄 이 글만 다시 작성';
    }
  });

  // --- Tab 3: 카드뉴스 언어 전환 (한국어 vs 일본어) ---
  btnLangKo.addEventListener('click', () => {
    btnLangKo.style.background = 'var(--primary)';
    btnLangKo.style.color = '#fff';
    btnLangJa.style.background = 'none';
    btnLangJa.style.color = 'var(--text-muted)';
    CardNewsStudio.setLanguage('ko');
    updateSlideEditInputs();
    showToast('🇰🇷 한국어 카드뉴스로 전환되었습니다.');
  });

  btnLangJa.addEventListener('click', () => {
    btnLangJa.style.background = 'var(--primary)';
    btnLangJa.style.color = '#fff';
    btnLangKo.style.background = 'none';
    btnLangKo.style.color = 'var(--text-muted)';
    CardNewsStudio.setLanguage('ja');
    updateSlideEditInputs();
    showToast('🇯🇵 日本語 카드뉴스로 전환되었습니다.');
  });

  function updateSlideEditInputs() {
    const curSlide = CardNewsStudio.getCurrentSlide();
    if (curSlide) {
      inputSlideBadge.value = curSlide.badge || '';
      inputSlideTitle.value = curSlide.mainTitle || '';
      inputSlideSubtitle.value = curSlide.subTitle || '';

      const total = CardNewsStudio.slides.length;
      const curNum = CardNewsStudio.currentSlideIndex + 1;
      slideIndicatorText.textContent = `슬라이드 ${curNum} / ${total}`;

      btnPrevSlide.disabled = curNum === 1;
      btnNextSlide.disabled = curNum === total;
    }
  }

  [inputSlideBadge, inputSlideTitle, inputSlideSubtitle].forEach(input => {
    input.addEventListener('input', () => {
      CardNewsStudio.updateCurrentSlide({
        badge: inputSlideBadge.value,
        mainTitle: inputSlideTitle.value,
        subTitle: inputSlideSubtitle.value
      });
    });
  });

  btnPrevSlide.addEventListener('click', () => {
    CardNewsStudio.prevSlide();
    updateSlideEditInputs();
  });

  btnNextSlide.addEventListener('click', () => {
    CardNewsStudio.nextSlide();
    updateSlideEditInputs();
  });

  ratioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ratioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CardNewsStudio.setRatio(btn.getAttribute('data-ratio'));
    });
  });

  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      themeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      CardNewsStudio.setTheme(chip.getAttribute('data-theme'));
    });
  });

  btnDownloadSlide.addEventListener('click', () => {
    CardNewsStudio.downloadCurrentSlide();
    showToast('현재 슬라이드가 다운로드되었습니다 📥');
  });

  btnDownloadAll.addEventListener('click', async () => {
    showToast('전체 5장 슬라이드 일괄 다운로드를 시작합니다...');
    await CardNewsStudio.downloadAllSlides();
    showToast('전체 5장 다운로드 완료! 🎉');
  });

  btnMobileSave.addEventListener('click', () => {
    modalSaveImage.src = CardNewsStudio.getCurrentDataUrl();
    modalMobileSave.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => {
    modalMobileSave.classList.remove('active');
  });

  modalMobileSave.addEventListener('click', (e) => {
    if (e.target === modalMobileSave) modalMobileSave.classList.remove('active');
  });

  // --- QR 코드 모달 제어 ---
  btnOpenQrModal.addEventListener('click', () => {
    modalQr.classList.add('active');
  });

  btnCloseQrModal.addEventListener('click', () => {
    modalQr.classList.remove('active');
  });

  modalQr.addEventListener('click', (e) => {
    if (e.target === modalQr) modalQr.classList.remove('active');
  });

  // --- Tab 4: 피드 시뮬레이터 ---
  function updateSimulator() {
    instaSimImage.src = CardNewsStudio.getCurrentDataUrl();
    const text = state.generatedData?.texts?.['instagram'] || ContentGenerator.generateLocalTemplate('instagram', state.product);
    instaSimCaption.textContent = text;
  }

  // --- Gemini API 모달 ---
  btnOpenApiModal.addEventListener('click', () => {
    modalApiKey.classList.add('active');
  });

  btnCloseApiModal.addEventListener('click', () => {
    modalApiKey.classList.remove('active');
  });

  btnSaveApiKey.addEventListener('click', () => {
    const key = inputApiKey.value.trim();
    state.geminiKey = key;
    if (key) {
      localStorage.setItem('social_promo_gemini_key', key);
      showToast('Gemini AI 키가 저장되었습니다! 🤖');
    } else {
      localStorage.removeItem('social_promo_gemini_key');
      showToast('기본 스마트 모드로 전환되었습니다.');
    }
    modalApiKey.classList.remove('active');
  });

  // 첫 번째 샘플 로드
  presetChips[0]?.click();
});
