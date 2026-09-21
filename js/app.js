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
      if (window.updateSimulator) window.updateSimulator();
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

  // Tab 1 (2-Way 모드 스위처 & 입력)
  const btnModePreset = document.getElementById('btn-mode-preset');
  const btnModeCustom = document.getElementById('btn-mode-custom');
  const panelModePreset = document.getElementById('panel-mode-preset');
  const panelModeCustom = document.getElementById('panel-mode-custom');

  const inputLink = document.getElementById('product-link');
  const inputMemo = document.getElementById('product-memo');
  const mediaFileInput = document.getElementById('product-media-file');
  const uploadBox = document.getElementById('upload-box');
  const uploadPreview = document.getElementById('upload-preview');
  const uploadPrompt = document.getElementById('upload-prompt');
  const btnGenerateAll = document.getElementById('btn-generate-all');
  const presetChips = document.querySelectorAll('.preset-chip');

  // AI 비전 분석 DOM
  const visionActionPanel = document.getElementById('vision-action-panel');
  const btnVisionAnalyze = document.getElementById('btn-vision-analyze');
  const visionLoading = document.getElementById('vision-loading');
  const visionResult = document.getElementById('vision-result');
  const visionDetectedCat = document.getElementById('vision-detected-cat');
  const visionDetectedTitle = document.getElementById('vision-detected-title');
  const visionDetectedFeatures = document.getElementById('vision-detected-features');

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
  const btnQuickChangePhoto = document.getElementById('btn-quick-change-photo');

  // Tab 4 (시뮬레이터)
  const instaSimImage = document.getElementById('insta-sim-image');
  const instaSimCaption = document.getElementById('insta-sim-caption');

  // 모달들
  const modalGuide = document.getElementById('modal-guide');
  const btnOpenGuideModal = document.getElementById('btn-open-guide-modal');
  const btnCloseGuideModal = document.getElementById('btn-close-guide-modal');
  const btnConfirmGuide = document.getElementById('btn-confirm-guide');

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

  // --- 스마트폰(iOS Safari / Android Chrome) 안전 클립보드 복사 헬퍼 ---
  async function copyToClipboardSafe(text, fallbackEl) {
    if (!text) return false;
    let ok = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (err) {
        console.warn('navigator.clipboard fallback trigger:', err);
      }
    }
    if (!ok && fallbackEl) {
      try {
        fallbackEl.focus();
        fallbackEl.select();
        fallbackEl.setSelectionRange(0, 99999);
        ok = document.execCommand('copy');
        fallbackEl.blur();
      } catch (e) {}
    }
    if (!ok) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ta.setSelectionRange(0, 99999);
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {}
    }
    return ok;
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
  const selectedPlatformBadge = document.getElementById('selected-platform-badge');
  const platformSearchButtons = document.getElementById('platform-search-buttons');
  const modeBDetectedBadge = document.getElementById('mode-b-detected-badge');
  const btnRandomPick = document.getElementById('btn-random-pick');
  const viralCatBtns = document.querySelectorAll('.viral-cat-btn');

  let currentViralCat = 'kitchen';
  let currentViralItem = null;
  let currentActivePlatform = 'coupang';

  const PlatformPresets = [
    { id: 'coupang', label: '쿠팡 🚀', colorClass: 'coupang', sampleDomain: 'link.coupang.com/a/' },
    { id: 'ohou', label: '오늘의집 🏠', colorClass: 'ohou', sampleDomain: 'ohou.se/productions/' },
    { id: 'kurly', label: '마켓컬리 💜', colorClass: 'kurly', sampleDomain: 'www.kurly.com/goods/' },
    { id: 'oasis', label: '오아시스 🌱', colorClass: 'oasis', sampleDomain: 'www.oasis.co.kr/product/detail/' },
    { id: 'toss', label: '토스쇼핑 ⚡', colorClass: 'toss', sampleDomain: 'toss.im/p/' },
    { id: 'smartstore', label: '네이버 🛍️', colorClass: 'smartstore', sampleDomain: 'smartstore.naver.com/sample/' }
  ];

  function renderPlatformSearchToolbar(item, activePlatId) {
    if (!platformSearchButtons) return;
    platformSearchButtons.innerHTML = '';
    const query = item.search || item.coupangSearch || item.name;

    PlatformPresets.forEach(plat => {
      const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[plat.id]) 
        ? AffiliatePlatforms[plat.id] 
        : null;
      const searchUrl = (platMeta && typeof platMeta.searchUrl === 'function')
        ? platMeta.searchUrl(query)
        : `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`;

      const btn = document.createElement('a');
      btn.className = `platform-quick-btn ${plat.colorClass} ${plat.id === activePlatId ? 'active' : ''}`;
      btn.href = searchUrl;
      btn.target = '_blank';
      btn.innerHTML = `<span>${plat.label}</span> <span style="font-size: 9px; opacity: 0.8;">↗</span>`;
      btn.title = `${plat.label} 검색창 열기 + ${plat.label} 카피로 즉시 전환`;

      btn.addEventListener('click', () => {
        selectPlatformForItem(item, plat.id);
      });

      platformSearchButtons.appendChild(btn);
    });
  }

  function selectPlatformForItem(item, platId) {
    currentActivePlatform = platId;
    const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId]) 
      ? AffiliatePlatforms[platId] 
      : null;

    const platPreset = PlatformPresets.find(p => p.id === platId);
    const sampleLink = `https://${platPreset ? platPreset.sampleDomain : 'link.coupang.com/a/'}${encodeURIComponent(item.search || 'item')}`;

    inputLink.value = sampleLink;
    inputMemo.value = item.memo;
    state.product.name = item.name;
    state.product.link = sampleLink;
    state.product.memo = item.memo;
    state.product.platform = platId;
    state.generatedData = null;

    if (selectedViralTitle) selectedViralTitle.textContent = item.name;
    if (selectedPlatformBadge && platMeta) {
      selectedPlatformBadge.textContent = `${platMeta.icon} ${platMeta.shortName} 모드`;
      selectedPlatformBadge.style.color = platMeta.color;
      selectedPlatformBadge.style.borderColor = platMeta.color + '66';
      selectedPlatformBadge.style.backgroundColor = platMeta.color + '22';
    }

    if (platformSearchButtons) {
      platformSearchButtons.querySelectorAll('.platform-quick-btn').forEach(btn => {
        if (btn.classList.contains(platId)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    updateModeBBadge();
    if (typeof updateCopyTextView === 'function') {
      updateCopyTextView();
    }
    showToast(`'${platMeta ? platMeta.name : platId}' 스타일로 전환되었습니다! ✨`);
  }

  function applyViralItem(item) {
    if (!item) return;
    currentViralItem = item;
    const initialPlat = item.defaultPlatform || 'coupang';
    renderPlatformSearchToolbar(item, initialPlat);
    selectPlatformForItem(item, initialPlat);
  }

  // Mode B URL 실시간 플랫폼 감지
  function updateModeBBadge() {
    if (!inputLink || !modeBDetectedBadge) return;
    const url = inputLink.value.trim();
    const platId = (typeof ContentGenerator !== 'undefined') ? ContentGenerator.detectPlatform(url) : 'general';
    const plat = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId])
      ? AffiliatePlatforms[platId]
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['general'] : null);
    
    if (plat) {
      modeBDetectedBadge.textContent = `${plat.icon} ${plat.shortName} 감지`;
      modeBDetectedBadge.style.color = plat.color;
      modeBDetectedBadge.style.borderColor = plat.color + '66';
      modeBDetectedBadge.style.backgroundColor = plat.color + '22';
    }
  }

  if (inputLink) {
    inputLink.addEventListener('input', () => {
      updateModeBBadge();
      const url = inputLink.value.trim();
      if (url) {
        state.product.link = url;
        state.product.platform = (typeof ContentGenerator !== 'undefined') ? ContentGenerator.detectPlatform(url) : 'general';
        state.generatedData = null;
        if (typeof updateCopyTextView === 'function') {
          updateCopyTextView();
        }
      }
    });
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

  // --- 🎯 2-Way 입력 모드 전환 (1초 추천템 vs 내 상품 링크) ---
  if (btnModePreset && btnModeCustom && panelModePreset && panelModeCustom) {
    btnModePreset.addEventListener('click', () => {
      btnModePreset.classList.add('active');
      btnModeCustom.classList.remove('active');
      panelModePreset.style.display = 'block';
      panelModeCustom.style.display = 'none';
    });

    btnModeCustom.addEventListener('click', () => {
      btnModeCustom.classList.add('active');
      btnModePreset.classList.remove('active');
      panelModeCustom.style.display = 'block';
      panelModePreset.style.display = 'none';
      if (inputLink) inputLink.focus();
    });
  }

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

        // AI 비전 분석 버튼 활성화
        if (visionActionPanel) {
          visionActionPanel.style.display = 'block';
          if (btnVisionAnalyze) btnVisionAnalyze.style.display = 'flex';
          if (visionResult) visionResult.style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // --- AI 비전 분석 버튼 클릭 이벤트 ---
  if (btnVisionAnalyze) {
    btnVisionAnalyze.addEventListener('click', async () => {
      if (!state.product.mediaSrc) {
        showToast('⚠️ 먼저 제품 사진이나 상세페이지 캡처를 선택해주세요.');
        return;
      }

      if (!state.geminiKey) {
        showToast('💡 AI 이미지 분석을 위해 무료 Gemini API 키를 먼저 입력해주세요! 🔑');
        if (modalApiKey) modalApiKey.classList.add('active');
        return;
      }

      btnVisionAnalyze.disabled = true;
      btnVisionAnalyze.style.display = 'none';
      if (visionLoading) visionLoading.style.display = 'flex';
      if (visionResult) visionResult.style.display = 'none';

      try {
        const analysis = await ContentGenerator.analyzeProductImageWithVision(state.product.mediaSrc, state.geminiKey);

        if (analysis.productName) {
          state.product.name = analysis.productName;
          if (selectedViralTitle) selectedViralTitle.textContent = analysis.productName;
        }
        if (analysis.viralMemo) {
          state.product.memo = analysis.viralMemo;
          if (inputMemo) inputMemo.value = analysis.viralMemo;
        }

        if (visionResult) {
          visionResult.style.display = 'flex';
          if (visionDetectedTitle) visionDetectedTitle.textContent = analysis.productName;
          if (visionDetectedCat) visionDetectedCat.textContent = `카테고리: ${analysis.suggestedCategory || 'kitchen'}`;
          if (visionDetectedFeatures && analysis.keyFeatures) {
            visionDetectedFeatures.innerHTML = analysis.keyFeatures.map(f => `<div>• ${f}</div>`).join('') + 
              `<div style="margin-top: 6px; color: var(--text-main); font-style: italic;">"${analysis.viralMemo}"</div>`;
          }
        }

        state.generatedData = null;
        if (typeof updateCopyTextView === 'function') {
          updateCopyTextView();
        }

        showToast(`✨ '${analysis.productName}' 분석 완료! 제품명과 장점이 자동 입력되었습니다. 🎉`);

        if (btnGenerateAll) {
          btnGenerateAll.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        console.error('Vision analysis error:', err);
        showToast('❌ 이미지 분석 실패: ' + err.message);
        btnVisionAnalyze.style.display = 'flex';
      } finally {
        btnVisionAnalyze.disabled = false;
        if (visionLoading) visionLoading.style.display = 'none';
      }
    });
  }

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
      const ok = await copyToClipboardSafe(textToCopy, threadsBodyTextarea);
      if (ok) {
        showToast('📋 [1단계: 본문] 복사 완료! 사진/영상과 함께 스레드에 업로드하세요 🚀');
      } else {
        showToast('⚠️ 복사 실패. 텍스트를 길게 눌러 직접 복사해주세요.');
      }
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
      const ok = await copyToClipboardSafe(textToCopy, threadsCommentTextarea);
      if (ok) {
        showToast('💬 [2단계: 댓글] 복사 완료! 방금 올린 스레드 글에 바로 댓글로 붙여넣으세요 🔗');
      } else {
        showToast('⚠️ 복사 실패. 텍스트를 길게 눌러 직접 복사해주세요.');
      }
    });
  }

  // 스레드 전체 일괄 복사
  if (btnCopyThreadsAll) {
    btnCopyThreadsAll.addEventListener('click', async () => {
      const fullText = (state.generatedData && state.generatedData.texts && state.generatedData.texts[state.activeChannel]) ||
        (threadsBodyTextarea.value + '\n\n' + threadsCommentTextarea.value);
      const ok = await copyToClipboardSafe(fullText, threadsBodyTextarea);
      if (ok) {
        showToast('📋 스레드 본문+댓글 전체 복사 완료!');
      } else {
        showToast('⚠️ 복사 실패. 텍스트를 직접 복사해주세요.');
      }
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

    const ok = await copyToClipboardSafe(textToCopy, copyTextarea);
    if (ok) {
      showToast('📋 클립보드에 복사 완료! 바로 붙여넣으세요 ✨');
    } else {
      showToast('⚠️ 복사 실패. 텍스트를 직접 복사해주세요.');
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
      if (typeof updateSimulator === 'function') updateSimulator();
    });
  });

  btnPrevSlide.addEventListener('click', () => {
    CardNewsStudio.prevSlide();
    updateSlideEditInputs();
    if (typeof updateSimulator === 'function') updateSimulator();
  });

  btnNextSlide.addEventListener('click', () => {
    CardNewsStudio.nextSlide();
    updateSlideEditInputs();
    if (typeof updateSimulator === 'function') updateSimulator();
  });

  ratioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ratioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CardNewsStudio.setRatio(btn.getAttribute('data-ratio'));
      if (typeof updateSimulator === 'function') updateSimulator();
    });
  });

  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      themeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      CardNewsStudio.setTheme(chip.getAttribute('data-theme'));
      if (typeof updateSimulator === 'function') updateSimulator();
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

  btnMobileSave.addEventListener('click', async () => {
    showToast('📱 사진첩 저장 / 공유 준비 중...');
    const shared = await CardNewsStudio.shareOrSaveCurrentSlide((dataUrl) => {
      modalSaveImage.src = dataUrl;
      modalMobileSave.classList.add('active');
    });
    if (shared) {
      showToast('🎉 사진첩 저장 또는 공유가 완료되었습니다!');
    }
  });

  // 상단 최신 버전 강제 새로고침 버튼 (캐시 100% 날리기)
  const btnForceRefresh = document.getElementById('btn-force-refresh');
  if (btnForceRefresh) {
    btnForceRefresh.addEventListener('click', () => {
      showToast('🔄 최신 버전으로 강력 새로고침 중...');
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.href = cleanUrl + '?v=2.5_' + Date.now();
    });
  }

  // --- 초보자 30초 사용법 가이드 모달 제어 ---
  if (modalGuide) {
    if (btnOpenGuideModal) {
      btnOpenGuideModal.addEventListener('click', () => {
        modalGuide.classList.add('active');
      });
    }
    if (btnCloseGuideModal) {
      btnCloseGuideModal.addEventListener('click', () => {
        modalGuide.classList.remove('active');
      });
    }
    if (btnConfirmGuide) {
      btnConfirmGuide.addEventListener('click', () => {
        modalGuide.classList.remove('active');
      });
    }
    modalGuide.addEventListener('click', (e) => {
      if (e.target === modalGuide) modalGuide.classList.remove('active');
    });
  }

  if (btnCloseModal && modalMobileSave) {
    btnCloseModal.addEventListener('click', () => {
      modalMobileSave.classList.remove('active');
    });
  }

  if (btnQuickChangePhoto) {
    btnQuickChangePhoto.addEventListener('click', () => {
      if (mediaFileInput) mediaFileInput.click();
    });
  }

  if (modalMobileSave) {
    modalMobileSave.addEventListener('click', (e) => {
      if (e.target === modalMobileSave) modalMobileSave.classList.remove('active');
    });
  }

  // --- QR 코드 모달 제어 ---
  if (btnOpenQrModal && modalQr) {
    btnOpenQrModal.addEventListener('click', () => {
      modalQr.classList.add('active');
    });
  }

  if (btnCloseQrModal && modalQr) {
    btnCloseQrModal.addEventListener('click', () => {
      modalQr.classList.remove('active');
    });
  }

  if (modalQr) {
    modalQr.addEventListener('click', (e) => {
      if (e.target === modalQr) modalQr.classList.remove('active');
    });
  }

  // --- Tab 4: 피드 시뮬레이터 ---
  function updateSimulator() {
    if (!instaSimImage || typeof CardNewsStudio === 'undefined') return;
    try {
      instaSimImage.src = CardNewsStudio.getCurrentDataUrl();
      const text = state.generatedData?.texts?.['instagram'] || (typeof ContentGenerator !== 'undefined' ? ContentGenerator.generateLocalTemplate('instagram', state.product) : '');
      if (instaSimCaption) instaSimCaption.textContent = text;
    } catch (e) {
      console.warn('updateSimulator error:', e);
    }
  }
  window.updateSimulator = updateSimulator;
  window.updateSlideEditInputs = updateSlideEditInputs;

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
