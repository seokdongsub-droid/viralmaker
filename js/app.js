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
    slideCount: 4, // 3, 4 (기본: 데이즈홈), 5
    ratio: '4:5', // 4:5 (기본: 인스타 세로), 9:16 (숏폼), 1:1 (정사각)
    monetizationMode: 'link', // 'link' (기본: 프로필/댓글 링크) | 'dm' (쿠팡 자동 DM)
    threadsType: 'type1', // type1: 공포/반전, type2: 1초컷, type3: 찡찡이, type4: 훈수/장비병
    threadsLang: 'ko', // 'ko' | 'ja'
    activeCardSubtab: 'canvas', // 'canvas' | 'prompts'
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

  // Tab 1 (통합 상품 & 제휴 설정)
  const inputProductName = document.getElementById('input-product-name');
  const inputLink = document.getElementById('product-link');
  const inputMemo = document.getElementById('product-memo');
  const mediaFileInput = document.getElementById('product-media-file');
  const uploadBox = document.getElementById('upload-box');
  const uploadPreview = document.getElementById('upload-preview');
  const uploadPrompt = document.getElementById('upload-prompt');
  const btnGenerateAll = document.getElementById('btn-generate-all');
  const presetChips = document.querySelectorAll('.preset-chip');

  // v3.4 상단 셀렉터 DOM (슬라이드 장수 드롭다운 & 수익화 방식)
  const btnToggleSlideCount = document.getElementById('btn-toggle-slide-count');
  const lblSlideCount = document.getElementById('lbl-slide-count');
  const selectSlideCount = document.getElementById('select-slide-count');
  const inputCustomSlideCount = document.getElementById('input-custom-slide-count');
  const selectSlideCountTop = selectSlideCount;
  const inputCustomSlideCountTop = inputCustomSlideCount;
  const monetizeModeChips = document.querySelectorAll('#monetize-mode-group .chip-btn');
  const labelMonetizeHint = document.getElementById('label-monetize-hint');

  // 🚀 제휴몰 사진 1초 첨부 (URL 복붙 / 클립보드 / 파일 / 4컷 분할)
  const btnTabMethodUrl = document.getElementById('btn-tab-method-url');
  const btnTabMethodClipboard = document.getElementById('btn-tab-method-clipboard');
  const btnTabMethodFile = document.getElementById('btn-tab-method-file');
  const btnTabMethodCollage = document.getElementById('btn-tab-method-collage');
  const panelPhotoUrl = document.getElementById('panel-photo-url');
  const inputImageUrl = document.getElementById('input-image-url');
  const btnApplyImageUrl = document.getElementById('btn-apply-image-url');
  const btnQuickSplit4grid = document.getElementById('btn-quick-split-4grid');
  const slideCollageFileInput = document.getElementById('slide-collage-file-input');

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
  const standardPanelTitle = document.getElementById('standard-panel-title');

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
  const threadsTypeChips = document.querySelectorAll('#threads-type-pills .threads-type-chip');
  const btnThreadsLangKo = document.getElementById('btn-threads-lang-ko');
  const btnThreadsLangJa = document.getElementById('btn-threads-lang-ja');

  // Tab 2 - 에디토리얼 HTML DOM
  const editorialCopyContainer = document.getElementById('editorial-copy-container');
  const editorialHtmlPreview = document.getElementById('editorial-html-preview');
  const editorialAltTextarea = document.getElementById('editorial-alt-textarea');
  const btnCopyEditorialHtml = document.getElementById('btn-copy-editorial-html');
  const btnCopyAltTags = document.getElementById('btn-copy-alt-tags');

  // Tab 2 - 쿠팡 자동 DM 키트 DOM
  const coupangDmContainer = document.getElementById('coupang-dm-container');
  const dmKeywordsContent = document.getElementById('dm-keywords-content');
  const dmReplyContent = document.getElementById('dm-reply-content');
  const dmFollowerContent = document.getElementById('dm-follower-content');
  const dmNonfollowerContent = document.getElementById('dm-nonfollower-content');
  const btnCopyDmKeywords = document.getElementById('btn-copy-dm-keywords');
  const btnCopyDmReply = document.getElementById('btn-copy-dm-reply');
  const btnCopyDmFollower = document.getElementById('btn-copy-dm-follower');
  const btnCopyDmNonfollower = document.getElementById('btn-copy-dm-nonfollower');

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
  const btnMobileSaveAll = document.getElementById('btn-mobile-save-all');
  const btnQuickChangePhoto = document.getElementById('btn-quick-change-photo');
  const btnQuickUrlPhoto = document.getElementById('btn-quick-url-photo');
  const slideSingleFileInput = document.getElementById('slide-single-file-input');
  const slideQuickChips = document.querySelectorAll('.slide-quick-chip');
  const btnRegenSlideAi = document.getElementById('btn-regen-slide-ai');
  const slideSceneIcon = document.getElementById('slide-scene-icon');
  const slideSceneLabel = document.getElementById('slide-scene-label');
  const slideSceneStatus = document.getElementById('slide-scene-status');

  // Tab 3 - 서브탭 & 퀵 툴바 DOM
  const btnSubtabCanvas = document.getElementById('btn-subtab-canvas');
  const btnSubtabPrompts = document.getElementById('btn-subtab-prompts');
  const panelSubtabCanvas = document.getElementById('panel-subtab-canvas');
  const panelSubtabPrompts = document.getElementById('panel-subtab-prompts');
  const promptCountBadge = document.getElementById('prompt-count-badge');
  const geminiPromptsList = document.getElementById('gemini-prompts-list');
  const btnCopyAllGeminiPrompts = document.getElementById('btn-copy-all-gemini-prompts');
  const quickMemoChips = document.querySelectorAll('.quick-memo-chip');

  const btnToggleTextPos = document.getElementById('btn-toggle-text-pos');
  const lblTextPos = document.getElementById('lbl-text-pos');
  const btnToggleFont = document.getElementById('btn-toggle-font');
  const lblFontFamily = document.getElementById('lbl-font-family');

  // AI 5단 사진 프로그레스 DOM
  const aiPhotoProgress = document.getElementById('ai-photo-progress');
  const aiPhotoStatusTitle = document.getElementById('ai-photo-status-title');
  const aiPhotoStatusDesc = document.getElementById('ai-photo-status-desc');

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
    'threads-kr': '⚡ 스레드(Threads) 4종 젬: 본문 외부 링크·해시태그 제외(피드 도달 극대화), 1댓글 3회 링크 반복 안전 배치',
    'threads-jp': '🇯🇵 日本語 スレッズ (Threads JP): タメ口 2ステップ 投稿 (本文 ➔ 返信コメント3回リンク)',
    'instagram': '📸 인스타그램: 감성 헤드카피, 3가지 실사용 반전, 프로필/댓글 링크 유도',
    'naver-blog': '📝 네이버 블로그 상세리뷰: 1200x900 사진 삽입 가이드, 3단계 사용법, 꿀팁, 공정위 문구 포함',
    'editorial-html': '🌿 에디토리얼 인라인 HTML: 피스타치오&크림 톤 감성 디자인, 아메바/티스토리 1초 복붙',
    'coupang-dm': '💬 쿠팡 인플루언서 자동 DM: 키워드 트리거, 피드 답글, 팔로워/미팔로워 맞춤 DM',
    'ameba-jp': '🌸 일본 아메바 블로그: 아마존 재팬 제휴, 상냥한 絵文字 문체 & 아메바 인기 해시태그'
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

  // --- 🎨 5단 슬라이드 스토리별 장면 메타데이터 및 상태 바 갱신 ---
  const sceneDescriptions = [
    { num: 1, icon: '🌟', title: '1번 표지', desc: '시선 강탈 대표 히어로 컷' },
    { num: 2, icon: '🤔', title: '2번 고민/문제', desc: '사용 전 불편한 순간 비포 컷' },
    { num: 3, icon: '💡', title: '3번 해결/실사용', desc: '실제 사용하는 인액션 컷' },
    { num: 4, icon: '🔍', title: '4번 디테일/특징', desc: '핵심 기능·재질 초근접 컷' },
    { num: 5, icon: '🎁', title: '5번 만족/결과', desc: '감성 라이프스타일 애프터 컷' }
  ];

  function updateSlideSceneBar() {
    const idx = CardNewsStudio.currentSlideIndex;
    const scene = sceneDescriptions[idx] || sceneDescriptions[0];
    if (slideSceneIcon) slideSceneIcon.textContent = scene.icon;
    if (slideSceneLabel) slideSceneLabel.textContent = `${scene.title} (${scene.desc})`;

    if (slideSceneStatus) {
      if (CardNewsStudio.slideImages && CardNewsStudio.slideImages[idx]) {
        slideSceneStatus.textContent = '개별 사진 적용됨 📸';
        slideSceneStatus.style.color = '#34d399';
      } else if (CardNewsStudio.userImage) {
        slideSceneStatus.textContent = `${scene.desc} (5단 앵글 연출 ✨)`;
        slideSceneStatus.style.color = 'var(--primary-light)';
      } else {
        slideSceneStatus.textContent = '스튜디오 그래픽 🎨';
        slideSceneStatus.style.color = 'var(--text-muted)';
      }
    }
  }

  // AI 텍스트 생성 기반 - 사진은 실제 첨부 사진 5단 앵글 연출 및 다중 첨부로 동작
  async function trigger5SceneAiPhotoGeneration(product) {
    // 사용자의 피드백에 따라 왜곡된 환각 AI 사진 생성 대신 실제 제품 사진 5단 앵글 연출을 우선 사용합니다.
    updateSlideSceneBar();
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
  const platformFilterChips = document.querySelectorAll('#platform-filter-group .platform-filter-chip');

  let currentViralCat = 'all';
  let currentPlatformFilter = 'all';
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

  const labelModeALinkTitle = document.getElementById('label-mode-a-link-title');
  const tipModeALink = document.getElementById('tip-mode-a-link');

  function selectPlatformForItem(item, platId) {
    currentActivePlatform = platId;
    const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId]) 
      ? AffiliatePlatforms[platId] 
      : null;

    const platPreset = PlatformPresets.find(p => p.id === platId);
    const sampleLink = `https://${platPreset ? platPreset.sampleDomain : 'link.coupang.com/a/'}${encodeURIComponent(item.search || 'item')}`;

    if (inputProductName) {
      inputProductName.value = item.name;
    }
    inputLink.value = sampleLink;
    inputMemo.value = item.memo;
    state.product.name = item.name;
    state.product.link = sampleLink;
    state.product.memo = item.memo;
    state.product.platform = platId;
    state.generatedData = null;

    if (inputModeARealLink) {
      inputModeARealLink.value = sampleLink;
      updateModeALinkStatus(sampleLink);
    }

    if (labelModeALinkTitle && platMeta) {
      labelModeALinkTitle.textContent = `💰 내 ${platMeta.shortName} 링크 (수익 입금용):`;
    }
    if (inputModeARealLink && platMeta && platMeta.linkPlaceholder) {
      inputModeARealLink.placeholder = platMeta.linkPlaceholder;
    }
    if (tipModeALink && platMeta && platMeta.tipText) {
      tipModeALink.innerHTML = platMeta.tipText;
    }

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

  // 💰 Mode A 실시간 제휴 링크 상태 판별 & 동기화
  const inputModeARealLink = document.getElementById('input-mode-a-real-link');
  const btnPasteModeARealLink = document.getElementById('btn-paste-mode-a-real-link');
  const badgeModeALinkStatus = document.getElementById('badge-mode-a-link-status');

  function updateModeALinkStatus(url) {
    if (!badgeModeALinkStatus) return;
    const isSample = !url || url.includes('/a/item') || url.includes('sample') || url.endsWith('/a/') || /%[0-9A-Fa-f]{2}/.test(url);
    if (isSample) {
      badgeModeALinkStatus.textContent = '⚠️ 샘플 링크 (교체 권장)';
      badgeModeALinkStatus.style.background = 'rgba(245, 158, 11, 0.2)';
      badgeModeALinkStatus.style.color = '#fbbf24';
    } else {
      badgeModeALinkStatus.textContent = '✅ 내 제휴 링크 적용됨 (수익 적립 OK)';
      badgeModeALinkStatus.style.background = 'rgba(16, 185, 129, 0.2)';
      badgeModeALinkStatus.style.color = '#34d399';
    }
  }

  if (inputModeARealLink) {
    inputModeARealLink.addEventListener('input', () => {
      const val = inputModeARealLink.value.trim();
      if (val) {
        inputLink.value = val;
        state.product.link = val;
        updateModeALinkStatus(val);
        updateModeBBadge();
        if (typeof updateCopyTextView === 'function') updateCopyTextView();
      }
    });
  }

  if (btnPasteModeARealLink) {
    btnPasteModeARealLink.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.startsWith('http')) {
          if (inputModeARealLink) inputModeARealLink.value = text.trim();
          if (inputLink) inputLink.value = text.trim();
          state.product.link = text.trim();
          updateModeALinkStatus(text.trim());
          updateModeBBadge();
          if (typeof updateCopyTextView === 'function') updateCopyTextView();
          showToast('내 제휴 링크가 적용되었습니다! 수익 적립 준비 완료 🎉');
        } else {
          if (inputLink) inputLink.focus();
          showToast('입력창을 꾹 눌러 복사한 제휴 링크를 붙여넣으세요.');
        }
      } catch (err) {
        if (inputLink) inputLink.focus();
        showToast('입력창을 꾹 눌러 복사한 제휴 링크를 붙여넣으세요.');
      }
    });
  }

  function applyViralItem(item) {
    if (!item) return;
    currentViralItem = item;
    const initialPlat = item.defaultPlatform || 'coupang';
    renderPlatformSearchToolbar(item, initialPlat);
    selectPlatformForItem(item, initialPlat);

    // 💡 제품군별 최적 카드뉴스 장수 자동 추천 및 세팅 (조리도구/뷰티 4컷, 수납/레시피 3컷)
    if (typeof ContentGenerator !== 'undefined' && ContentGenerator.recommendCutCount) {
      const rec = ContentGenerator.recommendCutCount({ name: item.name || item.title, memo: item.memo || '' });
      if (rec && typeof syncSlideCountUI === 'function') {
        syncSlideCountUI(rec.count);
        const labelSlideCountHint = document.getElementById('label-slide-count-hint');
        if (labelSlideCountHint) {
          labelSlideCountHint.textContent = `${rec.badge}`;
          labelSlideCountHint.title = rec.reason;
        }
      }
    }

    // 추천템에 감성 실사 사진이 등록되어 있으면 카드뉴스 및 업로드 미리보기에 즉시 자동 연출
    if (item.imageUrl) {
      state.product.mediaSrc = item.imageUrl;
      if (uploadPreview && uploadPrompt) {
        uploadPreview.src = item.imageUrl;
        uploadPreview.style.display = 'block';
        uploadPrompt.style.display = 'none';
      }
      CardNewsStudio.clearSlideImages();
      CardNewsStudio.setUserMedia(item.imageUrl);
      updateSlideSceneBar();
    }
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

        // 제휴몰 링크 입력 시 제품 대표 이미지 자동 추출 시도 (디바운스 600ms)
        if (autoFetchTimer) clearTimeout(autoFetchTimer);
        autoFetchTimer = setTimeout(() => {
          if (typeof autoFetchProductImage === 'function') {
            autoFetchProductImage(url);
          }
        }, 600);
      }
    });
  }

  function renderViralCategory(catKey, platFilter) {
    if (!viralItemsContainer || typeof ViralProductLibrary === 'undefined') return;
    if (catKey !== undefined) currentViralCat = catKey;
    if (platFilter !== undefined) currentPlatformFilter = platFilter;

    let pool = [];
    if (currentViralCat === 'all') {
      const allKeys = Object.keys(ViralProductLibrary);
      allKeys.forEach(k => {
        if (Array.isArray(ViralProductLibrary[k])) {
          pool.push(...ViralProductLibrary[k]);
        }
      });
      // 중복 제거
      const seen = new Set();
      pool = pool.filter(item => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    } else {
      pool = ViralProductLibrary[currentViralCat] || [];
    }

    // 제휴쇼핑몰 플랫폼 필터 적용
    if (currentPlatformFilter !== 'all') {
      pool = pool.filter(item => (item.defaultPlatform || 'coupang') === currentPlatformFilter);
    }

    viralItemsContainer.innerHTML = '';

    if (pool.length === 0) {
      viralItemsContainer.innerHTML = '<div style="font-size: 11.5px; color: var(--text-dim); padding: 14px 8px; width: 100%; text-align: center;">선택하신 조건의 상품이 없습니다. 다른 카테고리를 누르시거나 [🌟 전체 몰]을 눌러보세요.</div>';
      return;
    }

    pool.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `preset-chip ${idx === 0 ? 'active' : ''}`;

      const itemPlat = item.defaultPlatform || 'coupang';
      const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[itemPlat])
        ? AffiliatePlatforms[itemPlat]
        : null;
      const platTag = platMeta ? `<span style="font-size: 9.5px; opacity: 0.9; margin-right: 3px;">[${platMeta.shortName}]</span>` : '';

      btn.innerHTML = `${item.icon || '✨'} ${platTag}<strong>${item.title || item.name}</strong>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        viralItemsContainer.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        applyViralItem(item);
      });
      viralItemsContainer.appendChild(btn);
    });

    if (pool.length > 0) {
      applyViralItem(pool[0]);
    }
  }

  // 🏬 5대 제휴쇼핑몰 모아보기 필터 클릭 리스너
  if (platformFilterChips && platformFilterChips.length > 0) {
    platformFilterChips.forEach(btn => {
      btn.addEventListener('click', () => {
        platformFilterChips.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const plat = btn.getAttribute('data-platform') || 'all';

        // 제휴몰 필터 변경 시 모든 카테고리에서 해당 쇼핑몰 상품을 볼 수 있도록 카테고리 'all'로 리셋
        currentViralCat = 'all';
        viralCatBtns.forEach(b => {
          if (b.getAttribute('data-cat') === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });

        renderViralCategory('all', plat);

        const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[plat])
          ? AffiliatePlatforms[plat]
          : null;
        if (plat !== 'all' && platMeta) {
          showToast(`${platMeta.icon} ${platMeta.name} 모드로 전환되었습니다! (추천템 & 맞춤 카피 연동) ✨`);
        } else {
          showToast('🌟 전체 5대 제휴쇼핑몰 추천템을 모아봅니다! ✨');
        }
      });
    });
  }

  // 카테고리 탭 클릭 리스너
  viralCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viralCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat') || 'all';
      renderViralCategory(cat, currentPlatformFilter);
    });
  });

  if (btnRandomPick) {
    btnRandomPick.addEventListener('click', () => {
      if (typeof ViralProductLibrary === 'undefined') return;
      let allItems = [];
      Object.keys(ViralProductLibrary).forEach(k => {
        if (Array.isArray(ViralProductLibrary[k])) allItems.push(...ViralProductLibrary[k]);
      });
      if (allItems.length === 0) return;
      const randItem = allItems[Math.floor(Math.random() * allItems.length)];

      currentViralCat = 'all';
      currentPlatformFilter = 'all';
      viralCatBtns.forEach(b => {
        if (b.getAttribute('data-cat') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
      if (platformFilterChips) {
        platformFilterChips.forEach(b => {
          if (b.getAttribute('data-platform') === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
      }

      renderViralCategory('all', 'all');
      applyViralItem(randItem);
      showToast(`🎲 랜덤 픽: '${randItem.name}' 추천!`);
    });
  }

  // 초기 전체 카테고리 + 전체 몰 추천템 즉시 렌더링
  renderViralCategory('all', 'all');

  // --- ✍️ 상품명 & 메모 직접 수정 및 1초 키워드 칩 연동 ---
  if (inputProductName) {
    inputProductName.addEventListener('input', () => {
      const val = inputProductName.value.trim();
      if (val) {
        state.product.name = val;
        if (selectedViralTitle) selectedViralTitle.textContent = val;
        if (currentViralItem) currentViralItem.name = val;
        renderPlatformSearchToolbar({ name: val, search: val, coupangSearch: val }, currentActivePlatform);
        if (typeof updateCopyTextView === 'function') {
          updateCopyTextView();
        }
      }
    });
  }

  if (inputMemo) {
    inputMemo.addEventListener('input', () => {
      state.product.memo = inputMemo.value;
      if (typeof updateCopyTextView === 'function') {
        updateCopyTextView();
      }
    });
  }

  if (quickMemoChips && quickMemoChips.length > 0) {
    quickMemoChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const memoText = chip.getAttribute('data-memo');
        if (memoText && inputMemo) {
          if (inputMemo.value && !inputMemo.value.includes(memoText)) {
            inputMemo.value = `${inputMemo.value}, ${memoText}`;
          } else if (!inputMemo.value) {
            inputMemo.value = memoText;
          }
          state.product.memo = inputMemo.value;
          if (typeof updateCopyTextView === 'function') {
            updateCopyTextView();
          }
          showToast('✍️ 메모에 핵심 어필 키워드가 추가되었습니다! ✨');
        }
      });
    });
  }

  // --- 사진 / 동영상 첨부 처리 (라벨이 네이티브로 파일창을 엽니다) ---

  mediaFileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length === 1) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        showToast('🎬 동영상 썸네일 프레임을 추출하는 중...');
        CardNewsStudio.captureVideoFrame(file, (dataUrl) => {
          state.product.mediaSrc = dataUrl;
          uploadPreview.src = dataUrl;
          uploadPreview.style.display = 'block';
          uploadPrompt.style.display = 'none';
          CardNewsStudio.clearSlideImages();
          CardNewsStudio.setUserMedia(dataUrl);
          updateSlideSceneBar();
          showToast('동영상 썸네일로 5단 앵글 연출이 적용되었습니다! 🎥');
        });
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          state.product.mediaSrc = dataUrl;
          uploadPreview.src = dataUrl;
          uploadPreview.style.display = 'block';
          uploadPrompt.style.display = 'none';

          // 단일 사진 등록 시 5개 슬라이드에 5가지 앵글(풀샷/줌/디테일) 자동 연출
          CardNewsStudio.clearSlideImages();
          CardNewsStudio.setUserMedia(dataUrl);
          updateSlideSceneBar();
          showToast('📸 사진 1장으로 5단 맞춤 앵글(풀샷·줌·접사)이 자동 완성되었습니다! ✨');

          // AI 비전 분석 버튼 활성화
          if (visionActionPanel) {
            visionActionPanel.style.display = 'block';
            if (btnVisionAnalyze) btnVisionAnalyze.style.display = 'flex';
            if (visionResult) visionResult.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      // 2장 이상 다중 사진 선택 시 (최대 5장 슬라이드 1~5번에 자동 순차 배분)
      showToast(`📸 ${files.length}장의 사진을 슬라이드별로 배분하는 중...`);
      const readPromises = files.slice(0, 5).map(f => {
        return new Promise((resolve) => {
          const r = new FileReader();
          r.onload = ev => resolve(ev.target.result);
          r.readAsDataURL(f);
        });
      });

      const dataUrls = await Promise.all(readPromises);
      CardNewsStudio.clearSlideImages();
      dataUrls.forEach((url, i) => {
        CardNewsStudio.setSlideImage(i, url);
      });
      state.product.mediaSrc = dataUrls[0];
      CardNewsStudio.setUserMedia(dataUrls[0]);
      uploadPreview.src = dataUrls[0];
      uploadPreview.style.display = 'block';
      uploadPrompt.style.display = 'none';

      CardNewsStudio.render();
      updateSlideSceneBar();
      showToast(`🎉 ${dataUrls.length}장의 사진이 슬라이드 1~${dataUrls.length}번에 각각 배분되었습니다!`);

      if (visionActionPanel) {
        visionActionPanel.style.display = 'block';
        if (btnVisionAnalyze) btnVisionAnalyze.style.display = 'flex';
        if (visionResult) visionResult.style.display = 'none';
      }
    }
  });

  // --- 🌐 제휴 쇼핑몰 사진 1초 첨부 엔진 (URL 복붙, 클립보드, 자동 추출) ---

  function applyImageUrlDirectly(imgUrl) {
    if (!imgUrl) return;
    const trimmed = imgUrl.trim();
    if (!trimmed || (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/'))) {
      showToast('⚠️ 올바른 이미지 웹 주소(http 또는 https)를 입력해주세요.');
      return;
    }

    showToast('🌐 제휴몰 사진을 불러와 5단 앵글로 연출하는 중...');

    // Image 객체로 사전 로드
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      state.product.mediaSrc = trimmed;
      if (uploadPreview && uploadPrompt) {
        uploadPreview.src = trimmed;
        uploadPreview.style.display = 'block';
        uploadPrompt.style.display = 'none';
      }
      CardNewsStudio.clearSlideImages();
      CardNewsStudio.setUserMedia(trimmed);
      updateSlideSceneBar();
      if (typeof updateSimulator === 'function') updateSimulator();
      showToast('🎉 제휴몰 제품 사진이 5단 카드뉴스에 즉시 적용되었습니다! (5단 앵글 연출 ON)');

      if (visionActionPanel) {
        visionActionPanel.style.display = 'block';
        if (btnVisionAnalyze) btnVisionAnalyze.style.display = 'flex';
      }
    };
    img.onerror = () => {
      state.product.mediaSrc = trimmed;
      if (uploadPreview && uploadPrompt) {
        uploadPreview.src = trimmed;
        uploadPreview.style.display = 'block';
        uploadPrompt.style.display = 'none';
      }
      CardNewsStudio.clearSlideImages();
      CardNewsStudio.setUserMedia(trimmed);
      updateSlideSceneBar();
      if (typeof updateSimulator === 'function') updateSimulator();
      showToast('🎉 제품 사진이 카드뉴스에 적용되었습니다!');
    };
    img.src = trimmed;
  }

  // 1. [적용] 버튼 및 엔터키
  if (btnApplyImageUrl && inputImageUrl) {
    btnApplyImageUrl.addEventListener('click', () => {
      applyImageUrlDirectly(inputImageUrl.value);
    });
    inputImageUrl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyImageUrlDirectly(inputImageUrl.value);
      }
    });
  }

  // 2. 3-Way 방식 탭 제어
  if (btnTabMethodUrl && btnTabMethodClipboard && btnTabMethodFile) {
    btnTabMethodUrl.addEventListener('click', () => {
      btnTabMethodUrl.classList.add('active');
      btnTabMethodClipboard.classList.remove('active');
      btnTabMethodFile.classList.remove('active');
      if (btnTabMethodCollage) btnTabMethodCollage.classList.remove('active');
      if (panelPhotoUrl) panelPhotoUrl.style.display = 'block';
      if (inputImageUrl) inputImageUrl.focus();
    });

    btnTabMethodClipboard.addEventListener('click', async () => {
      btnTabMethodClipboard.classList.add('active');
      btnTabMethodUrl.classList.remove('active');
      btnTabMethodFile.classList.remove('active');
      if (btnTabMethodCollage) btnTabMethodCollage.classList.remove('active');
      if (panelPhotoUrl) panelPhotoUrl.style.display = 'none';
      await pasteImageFromClipboard();
    });

    btnTabMethodFile.addEventListener('click', () => {
      btnTabMethodFile.classList.add('active');
      btnTabMethodUrl.classList.remove('active');
      btnTabMethodClipboard.classList.remove('active');
      if (btnTabMethodCollage) btnTabMethodCollage.classList.remove('active');
      if (panelPhotoUrl) panelPhotoUrl.style.display = 'none';
      if (mediaFileInput) mediaFileInput.click();
    });
  }

  // 3. 클립보드 이미지 붙여넣기
  async function pasteImageFromClipboard() {
    if (!navigator.clipboard) {
      showToast('💡 텍스트창에서 길게 눌러 붙여넣기하거나 [이미지 주소 복붙]을 이용해주세요.');
      return;
    }

    try {
      if (navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const reader = new FileReader();
              reader.onload = (e) => {
                const dataUrl = e.target.result;
                state.product.mediaSrc = dataUrl;
                if (uploadPreview && uploadPrompt) {
                  uploadPreview.src = dataUrl;
                  uploadPreview.style.display = 'block';
                  uploadPrompt.style.display = 'none';
                }
                CardNewsStudio.clearSlideImages();
                CardNewsStudio.setUserMedia(dataUrl);
                updateSlideSceneBar();
                if (typeof updateSimulator === 'function') updateSimulator();
                showToast('📋 클립보드 사진이 카드뉴스에 적용되었습니다! ✨');
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
        }
      }

      if (navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText && (clipText.startsWith('http://') || clipText.startsWith('https://'))) {
          if (inputImageUrl) inputImageUrl.value = clipText.trim();
          applyImageUrlDirectly(clipText);
          return;
        }
      }

      showToast('⚠️ 클립보드에 사진이 없습니다. 쇼핑몰에서 사진을 꾹 눌러 [이미지 복사] 후 다시 눌러주세요.');
    } catch (err) {
      console.warn('Clipboard read error:', err);
      showToast('💡 [이미지 주소 복붙] 입력창에 복사한 주소를 붙여넣어 주세요!');
    }
  }

  // 4. 전역 붙여넣기(Paste) 이벤트 지원 (스마트폰/PC 어디서나 사진 복사 후 붙여넣으면 즉시 감지)
  window.addEventListener('paste', (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      for (const item of e.clipboardData.items) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const dataUrl = ev.target.result;
              state.product.mediaSrc = dataUrl;
              if (uploadPreview && uploadPrompt) {
                uploadPreview.src = dataUrl;
                uploadPreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
              }
              CardNewsStudio.clearSlideImages();
              CardNewsStudio.setUserMedia(dataUrl);
              updateSlideSceneBar();
              if (typeof updateSimulator === 'function') updateSimulator();
              showToast('📋 복사한 제품 사진이 카드뉴스에 즉시 적용되었습니다! ✨');
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    }
  });

  // 5. 제휴 상품 링크 입력 시 대표 이미지 자동 추출 (오픈그래프 og:image 탐색)
  let autoFetchTimer = null;
  async function autoFetchProductImage(url) {
    if (!url || !url.startsWith('http')) return;
    if (state.product.mediaSrc && state.product.mediaSrc.startsWith('data:image')) return;

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) return;
      const data = await resp.json();
      if (!data.contents) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');

      const ogImg = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
                 || doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
                 || doc.querySelector('link[rel="image_src"]')?.getAttribute('href');

      if (ogImg && ogImg.startsWith('http')) {
        if (inputImageUrl) inputImageUrl.value = ogImg;
        applyImageUrlDirectly(ogImg);
        showToast('🎉 제휴 링크에서 제품 대표 사진을 자동으로 가져왔습니다!');
      }
    } catch (e) {
      // CORS 실패 시 조용히 넘김
    }
  }

  // --- AI 비전 분석 버튼 클릭 이벤트 ---
  if (btnVisionAnalyze) {
    btnVisionAnalyze.addEventListener('click', async () => {
      if (!state.product.mediaSrc) {
        showToast('⚠️ 먼저 제품 사진이나 상세페이지 캡처를 선택해주세요.');
        return;
      }

      if (!state.geminiKey) {
        showToast('💡 API 키 없이도 바로 아래 초록색 [✨ 1초 만에 완성하기]를 누르시면 모든 글과 카드뉴스가 즉시 완성됩니다! (API 불필요)');
        if (btnGenerateAll) {
          btnGenerateAll.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
    state.product.slideCount = state.slideCount;
    state.product.monetizationMode = state.monetizationMode;

    btnGenerateAll.disabled = true;
    const origHtml = btnGenerateAll.innerHTML;
    btnGenerateAll.innerHTML = '<span>⚡ 복붙용 글 & 한/일 카드뉴스 생성 중...</span>';

    try {
      const results = await ContentGenerator.generateAll(state.product, state.geminiKey, state.slideCount, state.monetizationMode);
      state.generatedData = results;

      // 카드뉴스 슬라이드 적용 (한국어 & 일본어 모두 세팅)
      CardNewsStudio.setGeneratedSlides(results.cardnews_ko, results.cardnews_ja);

      // 제미나이 씬별 프롬프트 목록 렌더링
      renderGeminiPromptsList(results.geminiPrompts || []);

      // 복붙 글 업데이트
      updateCopyTextView();

      // 사진이 등록되어 있지 않고 현재 선택된 추천템에 감성 이미지가 있는 경우 자동 연동
      if (!CardNewsStudio.userImage && currentViralItem && currentViralItem.imageUrl) {
        CardNewsStudio.setUserMedia(currentViralItem.imageUrl);
      }

      showToast(`🎉 복붙용 글과 ${state.slideCount}장 카드뉴스 & 제미나이 프롬프트가 완성되었습니다!`);
      switchTab('copy');

    } catch (err) {
      console.error(err);
      showToast('생성 중 오류가 발생했습니다: ' + err.message);
    } finally {
      btnGenerateAll.disabled = false;
      btnGenerateAll.innerHTML = origHtml;
    }
  });

  // --- 제미나이 씬별 프롬프트 렌더링 함수 ---
  function renderGeminiPromptsList(prompts) {
    if (!geminiPromptsList) return;
    geminiPromptsList.innerHTML = '';
    if (!prompts || prompts.length === 0) {
      geminiPromptsList.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 24px; font-size: 12px;">[✨ 1초 만에 완성하기] 버튼을 누르면 슬라이드별 제미나이 프롬프트가 자동 생성됩니다.</div>';
      return;
    }

    const individualCount = prompts.filter(p => p.slideNum !== 'ALL').length;
    if (promptCountBadge) promptCountBadge.textContent = `${individualCount}장`;

    prompts.forEach((p, idx) => {
      const isAll = p.slideNum === 'ALL';
      const title = p.title || p.role || (isAll ? '4컷 콜라주 올인원' : `슬라이드 ${idx + 1}`);
      const promptText = p.promptText || p.prompt || '';
      const previewHint = p.previewHint || (isAll ? '1초 분할 연동 ✂️' : '4:5 인스타 | 첨부 이미지 참조');

      const card = document.createElement('div');
      card.className = `prompt-card-item ${isAll ? 'prompt-card-allinone' : ''}`;
      if (isAll) {
        card.style.border = '1px solid #10b981';
        card.style.background = 'rgba(16, 185, 129, 0.06)';
        card.style.borderRadius = '10px';
        card.style.padding = '12px';
        card.style.marginBottom = '14px';
      }

      card.innerHTML = `
        <div class="prompt-card-header">
          <div class="prompt-card-title">
            <span>📷 ${isAll ? '⚡' : `슬라이드 ${p.slideNum || idx + 1}`}: ${title}</span>
            <span class="prompt-card-badge" style="${isAll ? 'background: #10b981; color: #fff; font-weight: 800;' : ''}">${previewHint}</span>
          </div>
          <button type="button" class="prompt-copy-btn" id="btn-copy-prompt-${idx}" style="${isAll ? 'background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #34d399;' : ''}">
            <span>📋 ${isAll ? '올인원 프롬프트 복사' : '프롬프트 복사'}</span>
          </button>
        </div>
        <textarea class="prompt-textarea" id="prompt-text-${idx}" readonly style="${isAll ? 'min-height: 110px; border-color: rgba(16, 185, 129, 0.3);' : ''}">${promptText}</textarea>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 10.5px; color: var(--text-dim);">
          <span>💡 제미나이에 <strong>제품 상세페이지/사진을 첨부</strong>하고 프롬프트를 전송하세요!</span>
          <a href="https://gemini.google.com/" target="_blank" style="color: var(--primary-light); text-decoration: none; font-weight: 700;">제미나이 열기 ↗</a>
        </div>
      `;

      const copyBtn = card.querySelector(`#btn-copy-prompt-${idx}`);
      copyBtn.addEventListener('click', async () => {
        const txt = promptText;
        const textarea = card.querySelector(`#prompt-text-${idx}`);
        const ok = await copyToClipboardSafe(txt, textarea);
        if (ok) {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<span>✓ 복사 완료! ✨</span>';
          showToast(`'${title}' 프롬프트가 복사되었습니다! 제미나이에 제품 사진과 함께 붙여넣으세요 🚀`);
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `<span>📋 ${isAll ? '올인원 프롬프트 복사' : '프롬프트 복사'}</span>`;
          }, 2200);
        } else {
          showToast('복사 실패: 텍스트를 길게 눌러 직접 복사해주세요.');
        }
      });

      geminiPromptsList.appendChild(card);
    });
  }

  // --- 스레드 전용 텍스트 뷰 갱신 ---
  function updateThreadsTextView() {
    let feedObj = null;
    if (state.generatedData && state.generatedData.threads) {
      feedObj = state.generatedData.threads[state.threadsType] || state.generatedData.threads.type1;
    } else {
      const prodName = ContentGenerator.inferProductName(state.product);
      const affPlat = (typeof ContentGenerator !== 'undefined') ? ContentGenerator.detectPlatform(state.product.link) : 'general';
      const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[affPlat]) ? AffiliatePlatforms[affPlat] : { ftcNotice: '※ 본 포스팅은 제휴마케팅 수수료를 제공받을 수 있습니다.' };
      const ftc = platMeta.ftcNotice;
      feedObj = {
        body: `솔직히 ${prodName} 이거 쓸 때마다 드는 생각인데...\n왜 진작 안 샀나 싶음 ㅋㅋㅋ\n삶의 질 수직 상승함 진짜 ✨`,
        firstComment: `질문 많아서 링크 남겨둘게!\n👉 ${state.product.link}\n\n${ftc}`,
        commentWithLinks: `질문 많아서 링크 남겨둘게!\n👉 ${state.product.link}\n\n👇 혹시 위 링크 안 열리면 여기로!\n👉 ${state.product.link}\n\n${ftc}`,
        jaBody: `正直、${prodName}これ使い始めてから人生変わった...\nなんで早く買わなかったんだろw\nめっちゃ便利すぎて手放せない✨`,
        jaComment: `質問多かったからリンク貼っとくね！\n👉 ${state.product.link}\n\n👇リンク見れない人はこっちから！\n👉 ${state.product.link}\n\n※PR・アフィリエイトリンクを含みます`
      };
    }

    const isJa = state.threadsLang === 'ja' || state.activeChannel === 'threads-jp';
    const body = isJa ? (feedObj.jaBody || feedObj.body) : feedObj.body;
    const comment = isJa ? (feedObj.jaComment || feedObj.commentWithLinks) : feedObj.commentWithLinks;

    if (threadsBodyTextarea) threadsBodyTextarea.value = body;
    if (threadsCommentTextarea) threadsCommentTextarea.value = comment;
    if (threadsBodyCounter) threadsBodyCounter.textContent = `${body.length}자 (사진/영상과 함께 업로드)`;
    if (threadsCommentCounter) threadsCommentCounter.textContent = `${comment.length}자 (내 글에 답글 달기)`;
  }

  // --- Tab 2: 복붙 글 뷰 갱신 ---
  function updateCopyTextView() {
    const ch = state.activeChannel;
    if (channelInfoText) {
      channelInfoText.textContent = channelDescriptions[ch] || '';
    }

    // 모든 컨테이너 우선 숨김
    if (threadsContainer) threadsContainer.style.display = 'none';
    if (standardContainer) standardContainer.style.display = 'none';
    if (editorialCopyContainer) editorialCopyContainer.style.display = 'none';
    if (coupangDmContainer) coupangDmContainer.style.display = 'none';

    if (ch === 'threads-kr' || ch === 'threads-jp') {
      if (threadsContainer) threadsContainer.style.display = 'block';
      state.threadsLang = ch === 'threads-jp' ? 'ja' : 'ko';
      if (btnThreadsLangKo && btnThreadsLangJa) {
        if (state.threadsLang === 'ja') {
          btnThreadsLangJa.classList.add('active');
          btnThreadsLangKo.classList.remove('active');
        } else {
          btnThreadsLangKo.classList.add('active');
          btnThreadsLangJa.classList.remove('active');
        }
      }
      updateThreadsTextView();
    } else if (ch === 'editorial-html') {
      if (editorialCopyContainer) editorialCopyContainer.style.display = 'block';
      const ed = state.generatedData?.editorialHtml || ContentGenerator.generateEditorialHtml(state.product);
      if (editorialHtmlPreview) editorialHtmlPreview.innerHTML = ed.html || '';
      if (editorialAltTextarea) editorialAltTextarea.value = (ed.altList || []).join('\n');
    } else if (ch === 'coupang-dm') {
      if (coupangDmContainer) coupangDmContainer.style.display = 'block';
      const dm = state.generatedData?.coupangAutoDmKit || state.generatedData?.coupangDmKit || ContentGenerator.generateCoupangAutoDmKit(state.product);
      if (dmKeywordsContent) dmKeywordsContent.textContent = dm.triggerKeywords || dm.keywordsText || '나도, 나두, 링크, 정보, 513, 구매처';
      if (dmReplyContent) dmReplyContent.textContent = dm.autoReplyComment || dm.autoReply || '';
      if (dmFollowerContent) dmFollowerContent.textContent = dm.followerDm || '';
      if (dmNonfollowerContent) dmNonfollowerContent.textContent = dm.nonFollowerDm || '';
    } else {
      // standard: instagram, naver-blog, ameba-jp
      if (standardContainer) standardContainer.style.display = 'block';
      let text = '';
      if (ch === 'instagram') {
        if (standardPanelTitle) standardPanelTitle.textContent = '📸 인스타그램 캡션 & 인기 해시태그 20선';
        text = state.generatedData?.instagram?.raw || (state.generatedData?.texts?.['instagram'] || ContentGenerator.generateLocalTemplate('instagram', state.product));
      } else if (ch === 'naver-blog') {
        if (standardPanelTitle) standardPanelTitle.textContent = '📝 네이버 블로그 상세리뷰 (1200x900 사진 삽입 가이드)';
        text = state.generatedData?.naverBlog?.raw || (state.generatedData?.texts?.['naver-blog'] || ContentGenerator.generateLocalTemplate('naver-blog', state.product));
      } else {
        if (standardPanelTitle) standardPanelTitle.textContent = '📄 원클릭 복붙 텍스트 (수정 가능)';
        text = state.generatedData?.texts?.[ch] || ContentGenerator.generateLocalTemplate(ch, state.product);
      }

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





  // v3.0 스레드 4종 젬 스타일 선택 (type1, type2, type3, type4)
  threadsTypeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      threadsTypeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.threadsType = chip.getAttribute('data-type') || 'type1';
      updateThreadsTextView();
      showToast(`스레드 스타일: '${chip.textContent.trim()}' 적용! 🔥`);
    });
  });

  // v3.0 스레드 언어 토글 (한국어 vs 일본어 타메구치)
  if (btnThreadsLangKo && btnThreadsLangJa) {
    btnThreadsLangKo.addEventListener('click', () => {
      btnThreadsLangKo.classList.add('active');
      btnThreadsLangJa.classList.remove('active');
      state.threadsLang = 'ko';
      updateThreadsTextView();
      showToast('🇰🇷 한국어 스레드 글로 전환되었습니다.');
    });

    btnThreadsLangJa.addEventListener('click', () => {
      btnThreadsLangJa.classList.add('active');
      btnThreadsLangKo.classList.remove('active');
      state.threadsLang = 'ja';
      updateThreadsTextView();
      showToast('🇯🇵 日本語 (タメ口) スレッズ投稿に切り替えました。');
    });
  }

  // v3.0 에디토리얼 HTML 복사 버튼
  if (btnCopyEditorialHtml) {
    btnCopyEditorialHtml.addEventListener('click', async () => {
      const html = (state.generatedData && state.generatedData.editorialHtml && state.generatedData.editorialHtml.html) || '';
      if (!html) {
        showToast('복사할 HTML 코드가 없습니다. [1초 완성하기]를 먼저 눌러주세요.');
        return;
      }
      const ok = await copyToClipboardSafe(html);
      if (ok) showToast('📋 에디토리얼 HTML 전체 복사 완료! 블로그 HTML 모드에 붙여넣으세요 ✨');
      else showToast('⚠️ 복사 실패: 직접 복사해주세요.');
    });
  }

  if (btnCopyAltTags) {
    btnCopyAltTags.addEventListener('click', async () => {
      const altText = editorialAltTextarea ? editorialAltTextarea.value : '';
      if (!altText) {
        showToast('복사할 Alt 태그가 없습니다.');
        return;
      }
      const ok = await copyToClipboardSafe(altText, editorialAltTextarea);
      if (ok) showToast('📋 이미지 Alt 태그 목록 복사 완료!');
      else showToast('⚠️ 복사 실패');
    });
  }

  // v3.0 쿠팡 자동 DM 키트 개별 복사 버튼들
  if (btnCopyDmKeywords && dmKeywordsContent) {
    btnCopyDmKeywords.addEventListener('click', async () => {
      const ok = await copyToClipboardSafe(dmKeywordsContent.textContent.trim());
      if (ok) showToast('📋 트리거 키워드 복사 완료!');
    });
  }
  if (btnCopyDmReply && dmReplyContent) {
    btnCopyDmReply.addEventListener('click', async () => {
      const ok = await copyToClipboardSafe(dmReplyContent.textContent.trim());
      if (ok) showToast('📋 댓글 자동 답글 복사 완료!');
    });
  }
  if (btnCopyDmFollower && dmFollowerContent) {
    btnCopyDmFollower.addEventListener('click', async () => {
      const ok = await copyToClipboardSafe(dmFollowerContent.textContent.trim());
      if (ok) showToast('📋 팔로워 전용 발송 DM 복사 완료!');
    });
  }
  if (btnCopyDmNonfollower && dmNonfollowerContent) {
    btnCopyDmNonfollower.addEventListener('click', async () => {
      const ok = await copyToClipboardSafe(dmNonfollowerContent.textContent.trim());
      if (ok) showToast('📋 미팔로워 발송 DM 복사 완료!');
    });
  }

  // v3.0 카드뉴스 서브탭 전환 (📸 캔버스 vs 📋 제미나이 프롬프트)
  if (btnSubtabCanvas && btnSubtabPrompts && panelSubtabCanvas && panelSubtabPrompts) {
    btnSubtabCanvas.addEventListener('click', () => {
      btnSubtabCanvas.classList.add('active');
      btnSubtabPrompts.classList.remove('active');
      panelSubtabCanvas.style.display = 'block';
      panelSubtabPrompts.style.display = 'none';
      state.activeCardSubtab = 'canvas';
      if (window.CardNewsStudio) window.CardNewsStudio.render();
    });

    btnSubtabPrompts.addEventListener('click', () => {
      btnSubtabPrompts.classList.add('active');
      btnSubtabCanvas.classList.remove('active');
      panelSubtabPrompts.style.display = 'block';
      panelSubtabCanvas.style.display = 'none';
      state.activeCardSubtab = 'prompts';
    });
  }

  // v3.0 캔버스 퀵 툴바 (자막 위치 전환 & 폰트 전환)
  if (btnToggleTextPos && lblTextPos) {
    btnToggleTextPos.addEventListener('click', () => {
      if (window.CardNewsStudio && window.CardNewsStudio.toggleTextPosition) {
        const newPos = window.CardNewsStudio.toggleTextPosition();
        const posMap = { top: '상단 (과일롤 스타일)', center: '중앙', bottom: '하단 (데이즈홈)' };
        lblTextPos.textContent = posMap[newPos] || newPos;
        showToast(`자막 위치: ${posMap[newPos] || newPos}로 전환! ↕️`);
      }
    });
  }

  if (btnToggleFont && lblFontFamily) {
    btnToggleFont.addEventListener('click', () => {
      if (window.CardNewsStudio && window.CardNewsStudio.toggleFontFamily) {
        const newFont = window.CardNewsStudio.toggleFontFamily();
        const fontMap = { gothic: '볼드 고딕체', serif: '감성 명조체 (Dayz)' };
        lblFontFamily.textContent = fontMap[newFont] || newFont;
        showToast(`폰트: ${fontMap[newFont] || newFont}로 전환! 🎨`);
      }
    });
  }

  function syncSlideCountUI(count) {
    count = parseInt(count, 10) || 4;
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    state.slideCount = count;

    if (typeof CardNewsStudio !== 'undefined' && CardNewsStudio.setSlideCount) {
      CardNewsStudio.setSlideCount(count);
    }
    const countMap = {
      1: '1장 (원컷 피드)',
      2: '2장 (비포&애프터)',
      3: '3장 (스피드)',
      4: '4장 (인스타 표준)',
      5: '5장 (스토리)',
      6: '6장 (비교/디테일)',
      7: '7장 (스펙 풀버전)',
      8: '8장 (심층 매뉴얼)',
      10: '10장 (풀캐러셀)'
    };
    if (lblSlideCount) {
      lblSlideCount.textContent = countMap[count] || `${count}장`;
      lblSlideCount.style.color = count === 4 ? '#34d399' : (count === 3 ? '#fbbf24' : '#818cf8');
    }
    const labelSlideCountHint = document.getElementById('label-slide-count-hint');
    if (labelSlideCountHint) {
      labelSlideCountHint.textContent = count === 4 ? '4장 (추천)' : `${count}장`;
    }
    if (selectSlideCount && parseInt(selectSlideCount.value, 10) !== count) {
      selectSlideCount.value = String(count);
    }
    if (inputCustomSlideCount && parseInt(inputCustomSlideCount.value, 10) !== count) {
      inputCustomSlideCount.value = count;
    }

    if (promptCountBadge) promptCountBadge.textContent = `${count}장`;
    
    // 모바일/다운로드 버튼 텍스트 동적 동기화
    const lblSaveAll = document.getElementById('lbl-save-all-count');
    if (lblSaveAll) {
      lblSaveAll.textContent = `내 폰 사진첩에 ${count}장 한 번에 저장 (추천)`;
    }
    const lblDlAll = document.getElementById('lbl-download-all-count');
    if (lblDlAll) {
      lblDlAll.textContent = `📦 ${count}장 일괄 ZIP/다운`;
    }

    updateSlideQuickBar(count);
    updateSlideEditInputs();
    updateSlideSceneBar();
    if (typeof updateSimulator === 'function') updateSimulator();
  }
  window.syncSlideCountUI = syncSlideCountUI;

  // 1. 드롭다운 선택 리스너
  if (selectSlideCount) {
    selectSlideCount.addEventListener('change', () => {
      const val = parseInt(selectSlideCount.value, 10) || 4;
      syncSlideCountUI(val);
      showToast(`🎞️ 카드뉴스 장수: ${val}장으로 선택되었습니다!`);
    });
  }

  // 2. 장수 숫자 직접입력 리스너
  if (inputCustomSlideCount) {
    inputCustomSlideCount.addEventListener('change', () => {
      let val = parseInt(inputCustomSlideCount.value, 10) || 4;
      if (val < 1) val = 1;
      if (val > 10) val = 10;
      inputCustomSlideCount.value = val;
      syncSlideCountUI(val);
      showToast(`🎞️ 카드뉴스 장수: ${val}장으로 설정되었습니다!`);
    });
  }

  // 3. 캔버스 툴바 토글 버튼 리스너
  if (btnToggleSlideCount) {
    btnToggleSlideCount.addEventListener('click', () => {
      if (window.CardNewsStudio && window.CardNewsStudio.toggleSlideCount) {
        const next = window.CardNewsStudio.toggleSlideCount();
        syncSlideCountUI(next);
        showToast(`🎞️ 카드뉴스 장수: ${next}장으로 즉시 전환되었습니다!`);
      }
    });
  }

  // Tab 1 수익화 방식 칩 클릭 리스너 (프로필 링크 vs 댓글 자동 DM)
  if (monetizeModeChips) {
    monetizeModeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const mode = chip.getAttribute('data-mode') || 'link';
        state.monetizationMode = mode;
        monetizeModeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const labelMonetizeHint = document.getElementById('label-monetize-hint');
        if (labelMonetizeHint) {
          labelMonetizeHint.textContent = mode === 'dm' ? '댓글 자동 DM' : '프로필 링크 (무료)';
          labelMonetizeHint.style.color = mode === 'dm' ? 'var(--accent-pink)' : 'var(--success)';
        }
        showToast(mode === 'dm' ? '💬 수익화: 댓글 자동 DM 모드로 전환되었습니다.' : '🔗 수익화: 프로필 링크 (기본/무료) 모드로 전환되었습니다.');
      });
    });
  }

  // Tab 1 화면 비율 칩 클릭 리스너 (4:5, 9:16, 1:1)
  const tab1RatioChips = document.querySelectorAll('.tab1-ratio-chip');
  tab1RatioChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const r = chip.getAttribute('data-ratio');
      if (r && typeof CardNewsStudio !== 'undefined' && CardNewsStudio.setAspectRatio) {
        CardNewsStudio.setAspectRatio(r);
        tab1RatioChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const ratioBtns = document.querySelectorAll('.ratio-btn');
        ratioBtns.forEach(btn => {
          if (btn.getAttribute('data-ratio') === r) btn.classList.add('active');
          else btn.classList.remove('active');
        });
        showToast(`화면 비율: ${r}로 변경되었습니다! 📐`);
      }
    });
  });

  // 슬라이드 퀵 바 동적 렌더링 헬퍼 (1장 ~ 10장 대응)
  function updateSlideQuickBar(count) {
    const bar = document.getElementById('slide-quick-bar');
    if (!bar) return;
    bar.innerHTML = '';
    const labels1 = ['1. 원컷 피드(풀샷)'];
    const labels2 = ['1. 비포(고민/문제)', '2. 애프터(완벽해결)'];
    const labels3 = ['1. 표지(풀샷)', '2. 고민(과정)', '3. 완성(CTA)'];
    const labels4 = ['1. 표지(풀샷)', '2. 스와치(액션)', '3. 디테일(질감)', '4. 완성(CTA)'];
    const labels5 = ['1. 표지(풀샷)', '2. 고민(줌)', '3. 사용(액션)', '4. 디테일(접사)', '5. 완성(CTA)'];
    let labels = [];
    if (count === 1) labels = labels1;
    else if (count === 2) labels = labels2;
    else if (count === 3) labels = labels3;
    else if (count === 4) labels = labels4;
    else if (count === 5) labels = labels5;
    else {
      labels = ['1. 표지(풀샷)', '2. 고민(줌)', '3. 사용(액션)', '4. 디테일(접사)'];
      for (let i = 5; i < count; i++) {
        labels.push(`${i}. 디테일 0${i}`);
      }
      labels.push(`${count}. 완성(CTA)`);
    }

    labels.forEach((lbl, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `slide-quick-chip ${idx === CardNewsStudio.currentSlideIndex ? 'active' : ''}`;
      btn.setAttribute('data-slide', idx);
      btn.textContent = lbl;
      btn.addEventListener('click', () => {
        CardNewsStudio.currentSlideIndex = idx;
        CardNewsStudio.render();
        updateSlideEditInputs();
        if (typeof updateSimulator === 'function') updateSimulator();
      });
      bar.appendChild(btn);
    });
  }

  // 🚀 직장인 1초 터치 키워드 자동 입력기
  if (quickMemoChips) {
    quickMemoChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const memoTxt = chip.getAttribute('data-memo') || '';
        if (inputMemo) {
          if (inputMemo.value.trim()) {
            inputMemo.value += ', ' + memoTxt;
          } else {
            inputMemo.value = memoTxt;
          }
          state.product.memo = inputMemo.value;
          showToast(`✨ '${chip.textContent.trim()}' 키워드가 자동 추가되었습니다!`);
        }
      });
    });
  }

  // 🚀 제미나이 전체 프롬프트 한방에 일괄 복사 (초고속 1회 완료)
  if (btnCopyAllGeminiPrompts) {
    btnCopyAllGeminiPrompts.addEventListener('click', async () => {
      const allPrompts = state.generatedData?.geminiPrompts || [];
      if (!allPrompts || allPrompts.length === 0) {
        showToast('생성된 프롬프트가 없습니다. 먼저 [✨ 1초 만에 완성하기]를 눌러주세요.');
        return;
      }
      // ALL(콜라주) 제외한 개별 씬 프롬프트 필터링
      const individual = allPrompts.filter(p => p.slideNum !== 'ALL');
      const count = individual.length;
      const combined = [
        `[📌 제미나이(Gemini) 4:5 인스타그램 카드뉴스 생성 가이드]`,
        `※ 스마트폰으로 캡처한 제품 사진이나 상세페이지를 첨부한 뒤, 아래 ${count}가지 장면을 순서대로 각각 4:5 세로 비율(1080x1350)의 고화질 포토리얼리스틱 실사로 생성해줘:\n`,
        ...individual.map((p, i) => `--- 📷 [장면 ${i + 1}: ${p.title || p.role}] ---\n${p.promptText || p.prompt}\n`)
      ].join('\n');

      const ok = await copyToClipboardSafe(combined);
      if (ok) {
        showToast(`🎉 ${count}장 전체 프롬프트 일괄 복사 완료! 제미나이에 제품 사진 첨부 후 붙여넣으세요 🚀`);
      } else {
        showToast('⚠️ 복사 실패: 개별 프롬프트 복사를 이용해주세요.');
      }
    });
  }

  // 📸 캔버스 상단 갤러리/사진 교체 (1장 단독 또는 2~5장 다중 일괄 배분)
  if (btnQuickChangePhoto && slideSingleFileInput) {
    btnQuickChangePhoto.addEventListener('click', () => {
      slideSingleFileInput.click();
    });

    slideSingleFileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      if (files.length === 1) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          const curIdx = CardNewsStudio.currentSlideIndex;
          CardNewsStudio.setSlideImage(curIdx, dataUrl);
          updateSlideSceneBar();
          if (typeof updateSimulator === 'function') updateSimulator();
          showToast(`📸 슬라이드 ${curIdx + 1}번 사진이 교체되었습니다!`);
        };
        reader.readAsDataURL(file);
      } else {
        // 다중 파일 선택 시 (최대 5장 순차 자동 배분)
        showToast(`📸 ${files.length}장의 사진을 슬라이드 1~${files.length}번에 각각 배분하는 중...`);
        const readPromises = files.slice(0, CardNewsStudio.slides.length).map(f => {
          return new Promise(resolve => {
            const r = new FileReader();
            r.onload = ev => resolve(ev.target.result);
            r.readAsDataURL(f);
          });
        });

        const dataUrls = await Promise.all(readPromises);
        CardNewsStudio.clearSlideImages();
        dataUrls.forEach((url, i) => {
          CardNewsStudio.setSlideImage(i, url);
        });
        state.product.mediaSrc = dataUrls[0];
        CardNewsStudio.setUserMedia(dataUrls[0]);
        if (uploadPreview && uploadPrompt) {
          uploadPreview.src = dataUrls[0];
          uploadPreview.style.display = 'block';
          uploadPrompt.style.display = 'none';
        }
        CardNewsStudio.render();
        updateSlideSceneBar();
        if (typeof updateSimulator === 'function') updateSimulator();
        showToast(`🎉 ${dataUrls.length}장의 사진이 슬라이드 1~${dataUrls.length}번에 순서대로 배분되었습니다! ✨`);
      }
    });
  }

  // 🔗 캔버스 상단 URL로 사진 변경
  if (btnQuickUrlPhoto) {
    btnQuickUrlPhoto.addEventListener('click', () => {
      const url = prompt('교체할 이미지의 웹 주소(URL)를 입력하세요:');
      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/'))) {
        const curIdx = CardNewsStudio.currentSlideIndex;
        CardNewsStudio.setSlideImage(curIdx, url.trim());
        updateSlideSceneBar();
        if (typeof updateSimulator === 'function') updateSimulator();
        showToast(`슬라이드 ${curIdx + 1}번 사진이 URL로 변경되었습니다! ✨`);
      }
    });
  }

  // ✂️ 제미나이 2x2 4분할 격자 콜라주 사진 1초 분할 핸들러
  function handleCollageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    showToast('✂️ 제미나이 4컷 콜라주 사진을 4장의 개별 슬라이드로 1초 분할 중...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      CardNewsStudio.splitAndSet4GridCollage(dataUrl, (splitUrls) => {
        state.slideCount = 4;
        slideCountChips.forEach(c => {
          if (c.getAttribute('data-count') === '4') c.classList.add('active');
          else c.classList.remove('active');
        });
        applyRatio('4:5', false);
        updateSlideQuickBar(4);
        updateSlideEditInputs();
        if (typeof updateSimulator === 'function') updateSimulator();

        if (uploadPreview && uploadPrompt) {
          uploadPreview.src = splitUrls[0];
          uploadPreview.style.display = 'block';
          uploadPrompt.style.display = 'none';
        }

        showToast('🎉 제미나이 4컷 사진이 슬라이드 1~4번에 1초 만에 자동 분할되었습니다! 🚀');
        switchTab('cardnews');
      });
    };
    reader.readAsDataURL(file);
  }

  if (slideCollageFileInput) {
    slideCollageFileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleCollageFile(files[0]);
      }
    });
  }

  if (btnTabMethodCollage) {
    btnTabMethodCollage.addEventListener('click', () => {
      btnTabMethodCollage.classList.add('active');
      if (btnTabMethodUrl) btnTabMethodUrl.classList.remove('active');
      if (btnTabMethodClipboard) btnTabMethodClipboard.classList.remove('active');
      if (btnTabMethodFile) btnTabMethodFile.classList.remove('active');
      if (panelPhotoUrl) panelPhotoUrl.style.display = 'none';
      if (slideCollageFileInput) slideCollageFileInput.click();
    });
  }

  if (btnQuickSplit4grid) {
    btnQuickSplit4grid.addEventListener('click', () => {
      if (slideCollageFileInput) slideCollageFileInput.click();
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

      // 5개 퀵 슬라이드 칩 활성화 상태 동기화
      if (slideQuickChips) {
        slideQuickChips.forEach(chip => {
          const sIdx = parseInt(chip.getAttribute('data-slide'), 10);
          if (sIdx === CardNewsStudio.currentSlideIndex) {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        });
      }

      // 상단 장면 상태 바 갱신
      updateSlideSceneBar();
    }
  }

  // 5개 슬라이드 퀵 칩 터치 시 슬라이드 즉시 전환
  if (slideQuickChips) {
    slideQuickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const sIdx = parseInt(chip.getAttribute('data-slide'), 10);
        if (!isNaN(sIdx) && sIdx >= 0 && sIdx < CardNewsStudio.slides.length) {
          CardNewsStudio.currentSlideIndex = sIdx;
          CardNewsStudio.render();
          updateSlideEditInputs();
          if (typeof updateSimulator === 'function') updateSimulator();
        }
      });
    });
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

  // 📐 화면 규격(비율) 통합 적용 함수 (Tab 1, Tab 3 상단 바, Tab 3 서랍 완벽 동기화)
  function applyRatio(ratio, showToastMsg = false) {
    if (!ratio) return;
    state.ratio = ratio;
    if (typeof CardNewsStudio !== 'undefined' && CardNewsStudio.setRatio) {
      CardNewsStudio.setRatio(ratio);
    }

    // 모든 비율 버튼 active 상태 동기화 (Tab 1 칩, Tab 3 퀵 바, Tab 3 서랍 토글)
    document.querySelectorAll('.ratio-btn, .tab1-ratio-chip').forEach(btn => {
      if (btn.getAttribute('data-ratio') === ratio) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const ratioMeta = {
      '4:5': { label: '4:5 인스타 피드', size: '1080×1350', color: '#34d399', desc: '인스타 세로 황금비율' },
      '9:16': { label: '9:16 숏폼·릴스', size: '1080×1920', color: '#818cf8', desc: '틱톡/클립/릴스 전용' },
      '1:1': { label: '1:1 정사각 피드', size: '1080×1080', color: '#f472b6', desc: '정사각형 피드 규격' }
    };
    const meta = ratioMeta[ratio] || ratioMeta['4:5'];

    // 1. Tab 1 힌트 라벨 갱신
    const labelRatioHint = document.getElementById('label-ratio-hint');
    if (labelRatioHint) {
      labelRatioHint.textContent = `${meta.label} (${meta.size})`;
      labelRatioHint.style.color = meta.color;
    }

    // 2. Tab 3 캔버스 바로 위 라벨 갱신
    const currentRatioLabel = document.getElementById('current-ratio-label');
    if (currentRatioLabel) {
      currentRatioLabel.textContent = `${meta.label} (${meta.size})`;
      currentRatioLabel.style.color = meta.color;
    }

    // 3. Tab 3 캔버스 우측 상단 플로팅 뱃지 갱신
    const canvasRatioBadge = document.getElementById('canvas-ratio-badge');
    if (canvasRatioBadge) {
      canvasRatioBadge.textContent = `🖼️ ${meta.label} (${meta.size})`;
      canvasRatioBadge.style.color = meta.color;
      canvasRatioBadge.style.borderColor = meta.color;
    }

    // 4. Tab 3 세팅 아코디언 헤더 갱신 (더 이상 9:16에 고정되지 않음!)
    const accordionRatioSummary = document.getElementById('accordion-ratio-summary');
    if (accordionRatioSummary) {
      accordionRatioSummary.textContent = `⚙️ 화면 비율 (${meta.label}) • 테마 • 자막 수정`;
    }

    if (typeof updateSimulator === 'function') updateSimulator();

    if (showToastMsg) {
      showToast(`🎉 화면 규격이 [${meta.label} (${meta.size})]로 즉시 변경되었습니다! ✨`);
    }
  }
  window.applyRatio = applyRatio;

  // Tab 1 및 Tab 3의 모든 비율 버튼 클릭 이벤트 연결
  document.querySelectorAll('.ratio-btn, .tab1-ratio-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = btn.getAttribute('data-ratio');
      applyRatio(r, true);
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

  if (btnDownloadSlide) {
    btnDownloadSlide.addEventListener('click', () => {
      CardNewsStudio.downloadCurrentSlide();
      showToast('현재 슬라이드가 다운로드되었습니다 📥');
    });
  }

  if (btnDownloadAll) {
    btnDownloadAll.addEventListener('click', async () => {
      showToast('📦 전체 카드뉴스 ZIP 압축 다운로드를 시작합니다...');
      const ok = await CardNewsStudio.downloadAllAsZip();
      if (ok) {
        showToast('전체 카드뉴스 ZIP 다운로드 완료! 🎉');
      } else {
        await CardNewsStudio.downloadAllSlides();
        showToast('전체 다운로드 완료! 🎉');
      }
    });
  }

  if (btnMobileSave) {
    btnMobileSave.addEventListener('click', async () => {
      showToast('📱 현재 1장 사진첩 저장 / 공유 준비 중...');
      const shared = await CardNewsStudio.shareOrSaveCurrentSlide((dataUrl) => {
        const modalSaveTitle = document.getElementById('modal-save-title');
        const modalSaveTip = document.getElementById('modal-save-tip');
        const modalGalleryContainer = document.getElementById('modal-gallery-container');

        if (modalSaveTitle) modalSaveTitle.textContent = '📸 현재 슬라이드 사진첩 저장';
        if (modalSaveTip) modalSaveTip.innerHTML = '💡 이미지를 1~2초간 꾹 누른 뒤<br>[사진 앱에 추가] 또는 [이미지 저장]을 선택하세요!';
        if (modalSaveImage) {
          modalSaveImage.src = dataUrl;
          modalSaveImage.style.display = 'block';
        }
        if (modalGalleryContainer) modalGalleryContainer.style.display = 'none';
        if (modalMobileSave) modalMobileSave.classList.add('active');
      });
      if (shared) {
        showToast('🎉 사진첩 저장 또는 공유가 완료되었습니다!');
      }
    });
  }

  // 📱 직장인 모바일 일괄 사진첩 저장 버튼 (Web Share 미지원/인앱 브라우저 시 세이프 갤러리 모달)
  if (btnMobileSaveAll) {
    btnMobileSaveAll.addEventListener('click', async () => {
      const totalCount = state.slideCount || 4;
      showToast(`📱 사진첩 ${totalCount}장 일괄 저장 / 공유 준비 중...`);
      const shared = await CardNewsStudio.shareOrSaveAllSlides((dataUrls) => {
        const modalSaveTitle = document.getElementById('modal-save-title');
        const modalSaveTip = document.getElementById('modal-save-tip');
        const modalGalleryContainer = document.getElementById('modal-gallery-container');

        if (modalSaveTitle) modalSaveTitle.textContent = `📱 카드뉴스 ${dataUrls.length}장 세이프 갤러리`;
        if (modalSaveTip) modalSaveTip.innerHTML = `💡 아래 카드들을 <strong>1~2초 꾹 눌러 사진첩에 저장</strong>하시거나<br>하단 <strong>[📦 ZIP 일괄 다운]</strong> 버튼을 누르세요!`;

        if (modalSaveImage) modalSaveImage.style.display = 'none';

        if (modalGalleryContainer) {
          modalGalleryContainer.style.display = 'flex';
          modalGalleryContainer.innerHTML = '';

          dataUrls.forEach((url, i) => {
            const item = document.createElement('div');
            item.className = 'modal-gallery-item';

            const header = document.createElement('div');
            header.className = 'modal-gallery-item-header';

            const title = document.createElement('span');
            title.className = 'modal-gallery-item-title';
            title.textContent = `카드 #${i + 1}`;

            const btnSave = document.createElement('button');
            btnSave.type = 'button';
            btnSave.className = 'modal-gallery-btn-save';
            btnSave.textContent = '📥 저장';
            btnSave.onclick = () => {
              const link = document.createElement('a');
              link.download = `card_news_${i + 1}.png`;
              link.href = url;
              link.click();
              showToast(`카드 #${i + 1} 다운로드를 시작했습니다.`);
            };

            header.appendChild(title);
            header.appendChild(btnSave);

            const img = document.createElement('img');
            img.src = url;
            img.alt = `카드 뉴스 슬라이드 ${i + 1}`;

            const hint = document.createElement('div');
            hint.className = 'modal-gallery-item-hint';
            hint.textContent = '👆 꾹 눌러서 [사진 앱에 추가]';

            item.appendChild(header);
            item.appendChild(img);
            item.appendChild(hint);

            modalGalleryContainer.appendChild(item);
          });
        }

        if (modalMobileSave) modalMobileSave.classList.add('active');
      });
      if (shared) {
        showToast(`🎉 사진첩 ${totalCount}장 저장 또는 공유가 완료되었습니다!`);
      }
    });
  }

  // 🎲 현재 슬라이드 AI 사진만 단독 재생성 버튼
  if (btnRegenSlideAi) {
    btnRegenSlideAi.addEventListener('click', async () => {
      const idx = CardNewsStudio.currentSlideIndex;
      const prodName = ContentGenerator.inferProductName(state.product);
      const category = state.product.category || 'living';
      const prompts = ContentGenerator.generate5ScenePrompts(prodName, category);
      const prompt = prompts[idx] || prompts[0];

      showToast(`슬라이드 ${idx + 1}번 AI 사진을 다시 생성하고 있습니다... 🎨`);
      btnRegenSlideAi.disabled = true;
      const origText = btnRegenSlideAi.textContent;
      btnRegenSlideAi.textContent = '생성 중...';

      try {
        const seed = Math.floor(Math.random() * 999999) + 10;
        const newUrl = await ContentGenerator.fetchAiImageBlobUrl(prompt, seed);
        CardNewsStudio.setSlideImage(idx, newUrl);
        updateSlideSceneBar();
        if (typeof updateSimulator === 'function') updateSimulator();
        showToast(`슬라이드 ${idx + 1}번 사진이 새로 바뀌었습니다! ✨`);
      } catch (err) {
        showToast('사진 재생성 실패: ' + err.message);
      } finally {
        btnRegenSlideAi.disabled = false;
        btnRegenSlideAi.textContent = origText;
      }
    });
  }

  // 상단 최신 버전 강제 새로고침 버튼 (캐시 100% 날리기 v3.4)
  const btnForceRefresh = document.getElementById('btn-force-refresh');
  if (btnForceRefresh) {
    btnForceRefresh.addEventListener('click', () => {
      showToast('🔄 v3.4 최신 버전으로 강력 새로고침 중...');
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.href = cleanUrl + '?v=3.4_' + Date.now();
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

  const btnCloseModalX = document.getElementById('btn-close-modal-x');
  if (btnCloseModalX && modalMobileSave) {
    btnCloseModalX.addEventListener('click', () => {
      modalMobileSave.classList.remove('active');
    });
  }

  const btnModalZip = document.getElementById('btn-modal-zip-download');
  if (btnModalZip) {
    btnModalZip.addEventListener('click', async () => {
      showToast('📦 전체 카드뉴스 ZIP 압축 생성 중...');
      const ok = await CardNewsStudio.downloadAllAsZip();
      if (ok) {
        showToast('🎉 ZIP 다운로드가 완료되었습니다!');
      }
    });
  }

  // Tab 3 슬라이드별 1-Tap 개별 사진 교체 (갤러리)
  if (btnQuickChangePhoto && slideSingleFileInput) {
    btnQuickChangePhoto.addEventListener('click', () => {
      slideSingleFileInput.click();
    });

    slideSingleFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const curIdx = CardNewsStudio.currentSlideIndex;
        CardNewsStudio.setSlideImage(curIdx, dataUrl);
        updateSlideSceneBar();
        if (typeof updateSimulator === 'function') updateSimulator();
        showToast(`📷 ${curIdx + 1}번 슬라이드 사진이 변경되었습니다! ✨`);
      };
      reader.readAsDataURL(file);
      slideSingleFileInput.value = '';
    });
  }

  // Tab 3 슬라이드별 제휴몰 사진 주소(URL)로 변경
  if (btnQuickUrlPhoto) {
    btnQuickUrlPhoto.addEventListener('click', () => {
      const curIdx = CardNewsStudio.currentSlideIndex;
      const curScene = sceneDescriptions[curIdx] || sceneDescriptions[0];
      const url = prompt(`[${curIdx + 1}번 ${curScene.title}]에 넣을 쇼핑몰 제품 사진 주소(URL)를 붙여넣으세요:`);
      if (url && url.trim().startsWith('http')) {
        CardNewsStudio.setSlideImage(curIdx, url.trim());
        updateSlideSceneBar();
        if (typeof updateSimulator === 'function') updateSimulator();
        showToast(`📷 ${curIdx + 1}번 슬라이드 사진이 URL로 변경되었습니다! ✨`);
      }
    });
  }

  if (modalMobileSave) {
    modalMobileSave.addEventListener('click', (e) => {
      if (e.target === modalMobileSave) modalMobileSave.classList.remove('active');
    });
  }

  // --- QR 코드 모달 제어 (현재 브라우저 접속 URL 실시간 동적 생성) ---
  if (btnOpenQrModal && modalQr) {
    btnOpenQrModal.addEventListener('click', () => {
      const qrImg = document.getElementById('qr-code-img');
      const qrText = document.getElementById('qr-url-text');
      const currentUrl = window.location.href.split('#')[0];
      if (qrText) qrText.textContent = currentUrl;
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
      }
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

  // --- 🏬 5대 제휴쇼핑몰 포털 & 수익화 가이드 모달 제어 ---
  const modalAffiliatePortal = document.getElementById('modal-affiliate-portal');
  const btnOpenAffiliateModal = document.getElementById('btn-open-affiliate-modal');
  const btnCloseAffiliateModal = document.getElementById('btn-close-affiliate-modal');
  const btnConfirmAffiliateModal = document.getElementById('btn-confirm-affiliate-modal');
  const btnQuickOpenAffiliateGuide = document.getElementById('btn-quick-open-affiliate-guide');

  if (modalAffiliatePortal) {
    if (btnOpenAffiliateModal) {
      btnOpenAffiliateModal.addEventListener('click', () => {
        modalAffiliatePortal.classList.add('active');
      });
    }
    if (btnQuickOpenAffiliateGuide) {
      btnQuickOpenAffiliateGuide.addEventListener('click', () => {
        modalAffiliatePortal.classList.add('active');
      });
    }
    if (btnCloseAffiliateModal) {
      btnCloseAffiliateModal.addEventListener('click', () => {
        modalAffiliatePortal.classList.remove('active');
      });
    }
    if (btnConfirmAffiliateModal) {
      btnConfirmAffiliateModal.addEventListener('click', () => {
        modalAffiliatePortal.classList.remove('active');
      });
    }
    modalAffiliatePortal.addEventListener('click', (e) => {
      if (e.target === modalAffiliatePortal) modalAffiliatePortal.classList.remove('active');
    });

    // 모달 내부 각 플랫폼 상품 모아보기 바로가기 버튼
    modalAffiliatePortal.querySelectorAll('.btn-filter-to-platform').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPlat = btn.getAttribute('data-target-platform');
        modalAffiliatePortal.classList.remove('active');
        if (targetPlat) {
          currentPlatformFilter = targetPlat;
          if (platformFilterChips) {
            platformFilterChips.forEach(chip => {
              if (chip.getAttribute('data-platform') === targetPlat) chip.classList.add('active');
              else chip.classList.remove('active');
            });
          }
          currentViralCat = 'all';
          viralCatBtns.forEach(b => {
            if (b.getAttribute('data-cat') === 'all') b.classList.add('active');
            else b.classList.remove('active');
          });
          renderViralCategory('all', targetPlat);
          const meta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[targetPlat]) ? AffiliatePlatforms[targetPlat] : null;
          showToast(`'${meta ? meta.name : targetPlat}' 전용관 상품으로 필터링되었습니다! 🛍️`);
          const panelPreset = document.getElementById('panel-mode-preset');
          if (panelPreset) panelPreset.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // 기본 화면 규격 4:5 (인스타 세로 황금비율) 초기화
  applyRatio('4:5', false);

  // 첫 번째 샘플 로드
  presetChips[0]?.click();
  updateSlideSceneBar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startViralMakerApp);
} else {
  startViralMakerApp();
}
