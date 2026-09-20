// 전역 탭 전환 함수 (어떤 상황에서도 즉시 탭 전환 보장)
window.switchTab = function(tabId) {
  const tabViews = document.querySelectorAll('.tab-view');
  const navItems = document.querySelectorAll('.nav-item');

  tabViews.forEach(view => {
    if (view.id === 'tab-view-' + tabId) {
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

  try {
    if (tabId === 'cardnews' && window.CardNewsStudio) {
      if (window.updateSlideEditInputs) window.updateSlideEditInputs();
      window.CardNewsStudio.render();
    } else if (tabId === 'preview' && window.updateSimulator) {
      window.updateSimulator();
    }
  } catch (err) {
    console.warn('switchTab render error:', err);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function startViralMakerApp() {
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

  // Tab 2 - Threads 전용 DOM
  const threadsContainer = document.getElementById('threads-copy-container');
  const standardContainer = document.getElementById('standard-copy-container');
  const threadsBodyTextarea = document.getElementById('threads-body-textarea');
  const threadsCommentTextarea = document.getElementById('threads-comment-textarea');
  const threadsBodyCounter = document.getElementById('threads-body-counter');
  const threadsCommentCounter = document.getElementById('threads-comment-counter');
  const btnCopyThreadsBody = document.getElementById('btn-copy-threads-body');
  const btnCopyThreadsComment = document.getElementById('btn-copy-threads-comment');
  const btnRegenThreads = document.getElementById('btn-regen-threads');
  const btnCopyThreadsAll = document.getElementById('btn-copy-threads-all');

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
    'threads-kr': '⚡ 한국 스레드(Threads): 구매 링크 자동 분리, 계정 보호 2단계 업로드 (본문 ➔ 첫 댓글)',
    'threads-jp': '🇯🇵 일본 스레드(Threads JP): 구매 링크 자동 분리, 계정 보호 2단계 업로드 (本文 ➔ 返信コメント)',
    'naver-blog': '📝 네이버 블로그: 링크 포함, 스마트에디터 최적화 [서론 ➔ 언박싱 ➔ 장점 ➔ 총평/구매링크]',
    'ameba-jp': '🌸 일본 아메바 블로그: 구매 링크 포함, 상냥한 絵文字 문체 & 아메바 인기 해시태그',
    'instagram': '📸 인스타그램 피드: 3줄 불렛포인트, 프로필 링크 CTA 및 인기 해시태그 20선'
  };

  // --- 초기화 ---
  try {
    if (canvasEl) CardNewsStudio.init(canvasEl, canvasWrapper);
  } catch (e) {
    console.warn('CardNewsStudio init warning:', e);
  }

  if (state.geminiKey && inputApiKey) {
    inputApiKey.value = state.geminiKey;
  }

  // --- 토스트 알림 ---
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  // navItems 클릭 이벤트
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      window.switchTab(tabId);
    });
  });

  // --- 🔥 오늘 뭐 팔지? 바이럴 검증 추천템 치트키 라이브러리 연동 ---
  const viralItemsContainer = document.getElementById('viral-items-container');
  const selectedViralTitle = document.getElementById('selected-viral-title');
  const btnCoupangSearch = document.getElementById('btn-coupang-search');
  const btnRandomPick = document.getElementById('btn-random-pick');
  const viralCatBtns = document.querySelectorAll('.viral-cat-btn');

  let currentViralCat = 'kitchen';

  function applyViralItem(item) {
    if (!item) return;
    inputLink.value = item.link;
    inputMemo.value = item.memo;
    state.product.name = item.name;
    state.product.link = item.link;
    state.product.memo = item.memo;

    if (selectedViralTitle) selectedViralTitle.textContent = item.name;
    if (btnCoupangSearch) {
      const q = encodeURIComponent(item.coupangSearch || item.name);
      btnCoupangSearch.href = `https://www.coupang.com/np/search?component=&q=${q}`;
    }
    showToast(`'${item.name}' 꿀템이 세팅되었습니다! 🚀`);
  }

  function renderViralCategory(catKey) {
    if (!viralItemsContainer || typeof ViralProductLibrary === 'undefined') return;
    const items = ViralProductLibrary[catKey] || [];
    viralItemsContainer.innerHTML = '';

    items.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `preset-chip ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `${item.icon || '✨'} ${item.title || item.name}`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        viralItemsContainer.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        applyViralItem(item);
      });
      viralItemsContainer.appendChild(btn);
    });

    if (items.length > 0) {
      applyViralItem(items[0]);
    }
  }

  viralCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viralCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViralCat = btn.getAttribute('data-cat') || 'kitchen';
      renderViralCategory(currentViralCat);
    });
  });

  if (btnRandomPick) {
    btnRandomPick.addEventListener('click', () => {
      if (typeof ViralProductLibrary === 'undefined') return;
      const allCats = Object.keys(ViralProductLibrary);
      const randCat = allCats[Math.floor(Math.random() * allCats.length)];
      const items = ViralProductLibrary[randCat];
      const randItem = items[Math.floor(Math.random() * items.length)];

      viralCatBtns.forEach(b => {
        if (b.getAttribute('data-cat') === randCat) b.classList.add('active');
        else b.classList.remove('active');
      });

      renderViralCategory(randCat);
      applyViralItem(randItem);
      showToast(`🎲 랜덤 픽: '${randItem.name}' 추천!`);
    });
  }

  // 초기 요리/조리도구 추천템 즉시 렌더링
  renderViralCategory('kitchen');

  // --- 사진 / 동영상 첨부 처리 (라벨이 네이티브로 파일창을 엽니다) ---

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

    if (channelInfoText) {
      channelInfoText.textContent = channelDescriptions[ch] || '';
    }

    if (ch === 'threads-kr' || ch === 'threads-jp') {
      if (threadsContainer) threadsContainer.style.display = 'block';
      if (standardContainer) standardContainer.style.display = 'none';

      const split = ContentGenerator.splitThreadsPost(text);
      if (threadsBodyTextarea) threadsBodyTextarea.value = split.body;
      if (threadsCommentTextarea) threadsCommentTextarea.value = split.comment;
      if (threadsBodyCounter) threadsBodyCounter.textContent = `${split.body.length}자 (사진/영상과 함께 업로드)`;
      if (threadsCommentCounter) threadsCommentCounter.textContent = `${split.comment.length}자 (내 글에 답글 달기)`;
    } else {
      if (threadsContainer) threadsContainer.style.display = 'none';
      if (standardContainer) standardContainer.style.display = 'block';

      if (copyTextarea) copyTextarea.value = text;
      if (charCounter) charCounter.textContent = `${text.length}자`;
    }
  }

  // 스레드 실시간 입력 동기화
  if (threadsBodyTextarea && threadsCommentTextarea) {
    const syncThreadsData = () => {
      const b = threadsBodyTextarea.value;
      const c = threadsCommentTextarea.value;
      if (threadsBodyCounter) threadsBodyCounter.textContent = `${b.length}자 (사진/영상과 함께 업로드)`;
      if (threadsCommentCounter) threadsCommentCounter.textContent = `${c.length}자 (내 글에 답글 달기)`;

      const isJP = state.activeChannel === 'threads-jp';
      const combined = isJP
        ? `📌【ステップ1：本文投稿用】（動画・写真と一緒に投稿／リンクなしでアカウント保護🛡️）\n─────────────────────\n${b}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💬【ステップ2：最初の返信コメント用】（投稿後、自分の投稿にリプライで登録🔗）\n─────────────────────\n${c}`
        : `📌 [1단계: 본문 포스팅에 복붙] (사진/영상 첨부, 외부 링크 없음으로 계정 보호 🛡️)\n─────────────────────\n${b}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💬 [2단계: 첫 번째 댓글에 바로 복붙] (업로드 후 내 글에 답글로 등록 🔗)\n─────────────────────\n${c}`;

      if (state.generatedData && state.generatedData.texts) {
        state.generatedData.texts[state.activeChannel] = combined;
      }
    };
    threadsBodyTextarea.addEventListener('input', syncThreadsData);
    threadsCommentTextarea.addEventListener('input', syncThreadsData);
  }

  // 스레드 1단계 본문 복사
  if (btnCopyThreadsBody) {
    btnCopyThreadsBody.addEventListener('click', async () => {
      const textToCopy = (threadsBodyTextarea.value || '').trim();
      if (!textToCopy) {
        showToast('복사할 본문 내용이 없습니다.');
        return;
      }
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (e) {
        threadsBodyTextarea.select();
        document.execCommand('copy');
      }
      showToast('📋 [1단계: 본문] 복사 완료! 사진/영상과 함께 스레드에 업로드하세요 🚀');
    });
  }

  // 스레드 2단계 댓글 복사
  if (btnCopyThreadsComment) {
    btnCopyThreadsComment.addEventListener('click', async () => {
      const textToCopy = (threadsCommentTextarea.value || '').trim();
      if (!textToCopy) {
        showToast('복사할 댓글 내용이 없습니다.');
        return;
      }
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (e) {
        threadsCommentTextarea.select();
        document.execCommand('copy');
      }
      showToast('💬 [2단계: 댓글] 복사 완료! 방금 올린 스레드 글에 바로 댓글로 붙여넣으세요 🔗');
    });
  }

  // 스레드 전체 일괄 복사
  if (btnCopyThreadsAll) {
    btnCopyThreadsAll.addEventListener('click', async () => {
      const fullText = (state.generatedData && state.generatedData.texts && state.generatedData.texts[state.activeChannel]) ||
        (threadsBodyTextarea.value + '\n\n' + threadsCommentTextarea.value);
      try {
        await navigator.clipboard.writeText(fullText);
      } catch (e) {
        threadsBodyTextarea.select();
        document.execCommand('copy');
      }
      showToast('📋 스레드 본문+댓글 전체 복사 완료!');
    });
  }

  // 스레드 글 재작성
  if (btnRegenThreads) {
    btnRegenThreads.addEventListener('click', async () => {
      const ch = state.activeChannel;
      btnRegenThreads.disabled = true;
      btnRegenThreads.textContent = '재작성 중...';
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
        updateCopyTextView();
        showToast('✨ 스레드 글이 새롭게 재작성되었습니다!');
      } catch (e) {
        showToast('재작성 실패: ' + e.message);
      } finally {
        btnRegenThreads.disabled = false;
        btnRegenThreads.textContent = '🔄 이 글만 다시 작성';
      }
    });
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startViralMakerApp);
} else {
  startViralMakerApp();
}
