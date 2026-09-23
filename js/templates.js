/**
 * templates.js
 * 카드뉴스 테마, 샘플 데이터, 한국어/일본어 카드뉴스 슬라이드 및 복붙용 템플릿 사전
 */

// 🛍️ 제휴 마케팅 플랫폼 사전 (쿠팡, 오늘의집, 마켓컬리, 오아시스, 토스, 네이버 스마트스토어 등)
const AffiliatePlatforms = {
  coupang: {
    id: 'coupang',
    name: '쿠팡 (쿠팡 파트너스)',
    shortName: '쿠팡',
    icon: '🚀',
    color: '#E42528',
    badgeText: '🚀 로켓배송 내돈내산',
    deliveryBenefit: '로켓배송으로 다음 날 아침 문앞 바로 도착!',
    disclaimer: '※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.',
    portalUrl: 'https://partners.coupang.com',
    portalName: '쿠팡 파트너스 공식 웹사이트',
    commissionRate: '구매 결제액의 3% 무제한 현금 입금',
    guideHowTo: '1. 쿠팡 파트너스(partners.coupang.com) 로그인\n2. 상단 검색창에 상품명 검색 후 [간편 링크 생성] 클릭\n3. 복사한 링크를 아래 [내 제휴마케팅 링크] 칸에 붙여넣기',
    linkPlaceholder: '내 쿠팡 파트너스 링크 붙여넣기 (예: https://link.coupang.com/a/...)',
    tipText: '💡 쿠팡 파트너스에서 [링크 생성]하여 붙여넣으세요! 구매 발생 시 3% 수수료가 내 계좌로 입금됩니다.',
    searchUrl: (q) => `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(q)}`
  },
  ohou: {
    id: 'ohou',
    name: '오늘의집 (큐레이터)',
    shortName: '오늘의집',
    icon: '🏠',
    color: '#35C5F0',
    badgeText: '🏠 오늘의집 감성픽',
    deliveryBenefit: '오늘의집 단독 특가 & 감성 인테리어 만족도 1위!',
    disclaimer: '※ 본 게시물은 오늘의집 큐레이터/크리에이터 활동을 통해 일정 수수료를 제공받을 수 있습니다.',
    portalUrl: 'https://ohou.se',
    portalName: '오늘의집 큐레이터 프로그램',
    commissionRate: '가구/인테리어/살림템 판매 건당 3%~5% 현금 정산',
    guideHowTo: '1. 오늘의집 앱 ➔ 마이페이지 ➔ [큐레이터 신청] (누구나 1초 승인)\n2. 추천하고 싶은 상품 페이지에서 우측 상단 [공유] ➔ [큐레이터 링크 복사]\n3. 복사한 링크를 아래 칸에 붙여넣기',
    linkPlaceholder: '내 오늘의집 큐레이터 링크 붙여넣기 (예: https://ohou.se/productions/...)',
    tipText: '💡 오늘의집 상품 페이지에서 [공유 ➔ 큐레이터 링크 복사]를 붙여넣으세요! 구매 발생 시 3~5% 수익이 내 통장으로 입금됩니다.',
    searchUrl: (q) => `https://ohou.se/productions/feed?query=${encodeURIComponent(q)}`
  },
  kurly: {
    id: 'kurly',
    name: '마켓컬리 (샛별배송)',
    shortName: '마켓컬리',
    icon: '💜',
    color: '#9333EA',
    badgeText: '💜 컬리 샛별배송',
    deliveryBenefit: '내일 아침 7시 전 신선하게 문앞 도착하는 샛별배송!',
    disclaimer: '※ 본 포스팅은 마켓컬리 추천인/제휴 활동의 일환으로 일정 혜택을 제공받을 수 있습니다.',
    portalUrl: 'https://www.kurly.com',
    portalName: '마켓컬리 친구초대 & 크리에이터',
    commissionRate: '친구초대 첫 주문 시 건당 5,000원 적립금 & 제휴 리워드',
    guideHowTo: '1. 마켓컬리 앱 ➔ [마이컬리] ➔ [친구초대 5,000원 적립]\n2. 친구초대 전용 링크(또는 컬리 크리에이터 제휴 링크) 복사\n3. 복사한 링크를 아래 칸에 붙여넣기',
    linkPlaceholder: '내 마켓컬리 초대/제휴 링크 붙여넣기 (예: https://www.kurly.com/...)',
    tipText: '💡 마이컬리 [친구초대 링크]나 크리에이터 링크를 붙여넣으세요! 첫 주문 시 건당 5,000원 적립금(현금처럼 사용)이 들어옵니다.',
    searchUrl: (q) => `https://www.kurly.com/search?sword=${encodeURIComponent(q)}`
  },
  oasis: {
    id: 'oasis',
    name: '오아시스마켓 (새벽배송)',
    shortName: '오아시스',
    icon: '🌱',
    color: '#10B981',
    badgeText: '🌱 오아시스 새벽배송',
    deliveryBenefit: '산지직송 안심 유기농·친환경 새벽 신선배송!',
    disclaimer: '※ 본 게시물은 오아시스마켓 추천/서포터즈 활동의 일환으로 일정 혜택을 받을 수 있습니다.',
    portalUrl: 'https://www.oasis.co.kr',
    portalName: '오아시스마켓 추천인 & 서포터즈',
    commissionRate: '추천 가입 및 첫 주문 시 건당 5,000원 쿠폰/포인트 적립',
    guideHowTo: '1. 오아시스마켓 앱/웹 ➔ 마이페이지 ➔ [친구 추천 이벤트]\n2. 내 추천인 링크 복사\n3. 복사한 링크를 아래 칸에 붙여넣기',
    linkPlaceholder: '내 오아시스마켓 추천 링크 붙여넣기 (예: https://www.oasis.co.kr/...)',
    tipText: '💡 오아시스마켓 [친구추천 링크]를 붙여넣으세요! 추천받은 사람이 가입 후 주문하면 건당 5,000원 포인트가 적립됩니다.',
    searchUrl: (q) => `https://www.oasis.co.kr/product/search?keyword=${encodeURIComponent(q)}`
  },
  toss: {
    id: 'toss',
    name: '토스쇼핑 (쉐어링크)',
    shortName: '토스쇼핑',
    icon: '⚡',
    color: '#0064FF',
    badgeText: '⚡ 토스쇼핑 쉐어링크 핫딜',
    deliveryBenefit: '토스쇼핑 단독 특가 & 토스페이 포인트 추가 적립 혜택!',
    disclaimer: '※ 본 게시물은 토스쇼핑 쉐어링크/제휴 활동의 일환으로 일정 혜택을 제공받을 수 있습니다.',
    portalUrl: 'https://toss.im',
    portalName: '토스쇼핑 쉐어링크 (토스 앱)',
    commissionRate: '구매 결제액의 2%~5% 토스포인트 즉시 적립 (현금 1:1 출금 가능)',
    guideHowTo: '1. 스마트폰 [토스 앱] 실행 ➔ 하단 [토스쇼핑] 탭 이동\n2. 핫딜 상품 상세페이지에서 [공유하고 포인트 받기] 버튼 터치\n3. 복사된 쉐어링크를 아래 칸에 붙여넣기',
    linkPlaceholder: '내 토스쇼핑 쉐어링크 붙여넣기 (예: https://toss.im/...)',
    tipText: '💡 토스 앱 ➔ 토스쇼핑 ➔ 상품 [공유하고 포인트 받기] 링크를 붙여넣으세요! 구매 발생 시 2~5% 토스포인트(현금 1:1 출금)가 즉시 적립됩니다.',
    searchUrl: (q) => `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q + ' 토스쇼핑')}`
  },
  smartstore: {
    id: 'smartstore',
    name: '네이버 스마트스토어',
    shortName: '스마트스토어',
    icon: '🛍️',
    color: '#03C75A',
    badgeText: '📦 네이버 도착보장',
    deliveryBenefit: '네이버 도착보장 & 공식 스토어 찐리뷰 보장!',
    disclaimer: '※ 본 포스팅은 공식 제휴/서포터즈 활동의 일환으로 작성되었습니다.',
    portalUrl: 'https://sell.smartstore.naver.com',
    portalName: '네이버 스마트스토어 센터',
    commissionRate: '스토어 판매 수익 및 네이버페이 포인트 혜택',
    guideHowTo: '1. 내 스마트스토어 상품 URL 또는 네이버 제휴 링크 복사\n2. 복사한 링크를 아래 칸에 붙여넣기',
    linkPlaceholder: '내 스마트스토어 링크 붙여넣기 (예: https://smartstore.naver.com/...)',
    tipText: '💡 내 스마트스토어 상품 링크나 네이버 제휴 링크를 붙여넣으시면 네이버 도착보장/정품인증 스타일로 자동 세팅됩니다.',
    searchUrl: (q) => `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`
  },
  amazon_jp: {
    id: 'amazon_jp',
    name: 'Amazon JP (아마존 어소시에이트)',
    shortName: 'Amazon JP',
    icon: '🇯🇵',
    color: '#FF9900',
    badgeText: 'Amazonベストセラー 🔥',
    deliveryBenefit: 'Amazonプライム翌日配送対応！',
    disclaimer: '※ 当アカウントはAmazonアソシエイト・プログラムの参加者です。',
    portalUrl: 'https://affiliate.amazon.co.jp',
    portalName: 'Amazon アソシエイト・プログラム',
    commissionRate: '売上の 2%~10% 現金またはAmazonギフト券還元',
    guideHowTo: '1. Amazonアソシエイトにログインし商品URLから短縮アソシエイトリンク(amzn.to/...)を生成\n2. 下記の入力欄に貼り付け',
    linkPlaceholder: 'Amazonアソシエイトリンク (例: https://amzn.to/...)',
    tipText: '💡 Amazonアソシエイトの短縮リンクを入力すると、日本の薬機法および景表法に準拠した文面が自動生成されます。',
    searchUrl: (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}`
  },
  general: {
    id: 'general',
    name: '인포크링크 / 기타 자유링크',
    shortName: '일반/기타',
    icon: '🔗',
    color: '#6366F1',
    badgeText: 'MY FAVORITE 🤍',
    deliveryBenefit: '직접 써보고 너무 만족스러워서 공유하는 찐추천템 🥹',
    disclaimer: '※ 링크 내 상품은 제휴 활동에 따른 일정 수수료를 제공받을 수 있습니다.',
    portalUrl: 'https://inpock.co.kr',
    portalName: '인포크링크 / 링크트리',
    commissionRate: '프로필 링크를 통한 다중 상품 바이럴 판매',
    guideHowTo: '인포크링크, 링크온, 링크트리 등 내 멀티링크 주소를 복사해 입력하세요.',
    linkPlaceholder: '내 프로필 링크 붙여넣기 (예: https://inpock.co.kr/...)',
    tipText: '💡 인포크링크나 개인 블로그/스토어 주소를 넣으시면 감성 찐후기 스타일로 맞춤 생성됩니다.',
    searchUrl: (q) => `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`
  }
};

const CardNewsThemes = {
  'photo-overlay': {
    name: '📸 인스타 포토 감성 (Dayz 스타일)',
    bg: '#000000',
    cardBg: 'rgba(0, 0, 0, 0.4)',
    primary: '#FFFFFF',
    secondary: '#F43F5E',
    textMain: '#FFFFFF',
    textSub: '#F1F5F9',
    accentBadge: '#F43F5E',
    badgeText: '#FFFFFF',
    borderColor: 'transparent'
  },
  'modern-dark': {
    name: '모던 다크 (Modern Dark)',
    bg: '#0F172A',
    cardBg: '#1E293B',
    primary: '#38BDF8',
    secondary: '#818CF8',
    textMain: '#FFFFFF',
    textSub: '#94A3B8',
    accentBadge: '#F43F5E',
    badgeText: '#FFFFFF',
    borderColor: '#334155'
  },
  'warm-minimal': {
    name: '감성 웜 베이지 (Warm Minimal)',
    bg: '#FAF7F2',
    cardBg: '#FFFFFF',
    primary: '#B45309',
    secondary: '#D97706',
    textMain: '#292524',
    textSub: '#78716C',
    accentBadge: '#B45309',
    badgeText: '#FFFFFF',
    borderColor: '#E7E5E4'
  },
  'clean-white': {
    name: '스튜디오 화이트 (Clean Studio)',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    primary: '#2563EB',
    secondary: '#3B82F6',
    textMain: '#0F172A',
    textSub: '#64748B',
    accentBadge: '#2563EB',
    badgeText: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  'vivid-sale': {
    name: '비비드 특가 (Vivid Sale)',
    bg: '#18181B',
    cardBg: '#27272A',
    primary: '#FACC15',
    secondary: '#FB923C',
    textMain: '#FFFFFF',
    textSub: '#E4E4E7',
    accentBadge: '#EF4444',
    badgeText: '#FFFFFF',
    borderColor: '#3F3F46'
  },
  'japanese-zen': {
    name: '재팬 젠 감성 (Japanese Zen)',
    bg: '#F4F5F0',
    cardBg: '#FFFFFF',
    primary: '#475569',
    secondary: '#64748B',
    textMain: '#1E293B',
    textSub: '#64748B',
    accentBadge: '#E11D48',
    badgeText: '#FFFFFF',
    borderColor: '#E2E8F0'
  }
};

// 원클릭 초간단 테스트용 샘플 데이터 (기본 호환용)
const SampleQuickInputs = [
  {
    title: '사각 계란말이팬',
    link: 'https://link.coupang.com/a/sample-eggpan',
    memo: '똥손도 호텔 조식 비주얼 계란말이 3분 컷! 세라믹 논스틱 코팅이라 기름 조금만 둘러도 스르륵 말림',
    name: '사각 딥 계란말이팬'
  },
  {
    title: '유리 오일 스프레이',
    link: 'https://link.coupang.com/a/sample-oilspray',
    memo: '숟가락으로 식용유 붓다가 기름바다 칼로리 폭탄 맞던 사람 필수템! 안개 분사로 기름 90% 줄여주고 에어프라이어 요리 필수',
    name: '유리 안개분사 오일 스프레이'
  },
  {
    title: '무선 마늘 다지기',
    link: 'https://link.coupang.com/a/sample-chopper',
    memo: '볶음밥/파스타 할 때 눈물 흘리며 칼질 10분 하던 거 버튼 누르면 3초 만에 끝냄! 세척도 물로 슥 헹구면 됨',
    name: '무선 원터치 미니 야채 마늘 다지기'
  }
];

// 🔥 바이럴 검증 추천템 라이브러리 (요리/조리도구·식재료, 살림/수납/인테리어, 자취/삶의질/초특가)
const ViralProductLibrary = {
  kitchen: [
    {
      icon: '🍳',
      name: '사각 딥 계란말이팬',
      title: '사각 계란말이팬',
      search: '사각 계란말이팬',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-eggpan',
      imageUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=1080&auto=format&fit=crop&q=80',
      memo: '똥손도 호텔 조식 비주얼 계란말이 3분 컷! 세라믹 논스틱 코팅이라 기름 조금만 둘러도 스르륵 말림'
    },
    {
      icon: '💨',
      name: '유리 안개분사 오일 스프레이',
      title: '오일 스프레이',
      search: '유리 오일 스프레이',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-oilspray',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1080&auto=format&fit=crop&q=80',
      memo: '숟가락으로 식용유 붓다가 기름바다 칼로리 폭탄 맞던 사람 필수템! 안개 분사로 기름 90% 줄여주고 에어프라이어 요리 필수'
    },
    {
      icon: '🔪',
      name: '무선 원터치 미니 야채 마늘 다지기',
      title: '무선 마늘 다지기',
      search: '무선 마늘 다지기',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-chopper',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1080&auto=format&fit=crop&q=80',
      memo: '볶음밥/파스타 할 때 눈물 흘리며 칼질 10분 하던 거 버튼 누르면 3초 만에 끝냄! 세척도 물로 슥 헹구면 됨'
    },
    {
      icon: '💜',
      name: '컬리 저당 굴소스 & 저칼로리 스리라차',
      title: '컬리 저당 굴소스',
      search: '저당 굴소스',
      defaultPlatform: 'kurly',
      link: 'https://www.kurly.com/goods/sample-oyster-sauce',
      memo: '식단 관리/다이어터 필수템! 당류 0g대인데 감칠맛 폭발해서 볶음밥, 닭가슴살 요리가 1초 만에 고급 레스토랑 맛 됨'
    },
    {
      icon: '🌱',
      name: '오아시스 무농약 국산 콩나물 & 손두부',
      title: '오아시스 손두부·콩나물',
      search: '오아시스 국산 손두부',
      defaultPlatform: 'oasis',
      link: 'https://www.oasis.co.kr/product/detail/sample-tofu',
      memo: '일반 마트 두부랑 고소함의 차원이 다름! 오아시스 찐단골들이 장바구니에 무조건 쟁이는 유기농 새벽배송 1위'
    },
    {
      icon: '🥩',
      name: '오아시스 무항생제 한우 다짐육',
      title: '무항생제 한우 다짐육',
      search: '오아시스 무항생제 한우 다짐육',
      defaultPlatform: 'oasis',
      link: 'https://www.oasis.co.kr/product/detail/sample-beef',
      memo: '잡내 0% 산지직송 무항생제라 아이 유아식 볶음밥이나 파스타 라구소스 만들 때 무조건 이것만 씀! 새벽 문앞 도착'
    },
    {
      icon: '🍝',
      name: '컬리 바질페스토 & 통밀 푸실리 파스타',
      title: '컬리 바질페스토 파스타',
      search: '바질페스토 통밀 푸실리',
      defaultPlatform: 'kurly',
      link: 'https://www.kurly.com/goods/sample-basil-pesto',
      memo: '주말 아침 10분 만에 성수동 브런치 카페 비주얼 완성! 샛별배송으로 신선하게 와서 향긋함이 차원이 다름'
    },
    {
      icon: '🛡️',
      name: '기름튐 방지 미세 실리콘 덮개',
      title: '기름튐 방지 덮개',
      search: '기름튐 방지 덮개',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-splatter',
      memo: '삼겹살이나 볶음 요리할 때 가스레인지 벽면 기름바다 되는 거 100% 차단! 수증기는 빠져나가서 바삭함 유지'
    },
    {
      icon: '🥕',
      name: '스텐 일체형 만능 채칼 슬라이서',
      title: '스텐 만능 채칼',
      search: '스텐 만능 채칼',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-slicer',
      memo: '당근라페, 양배추채 10초 만에 식당 퀄리티로 완성! 칼질 서툰 사람도 손 안 다치고 얇게 썰어줌'
    },
    {
      icon: '🍲',
      name: '세라믹 논스틱 올인원 멀티팬',
      title: '세라믹 올인원팬',
      search: '세라믹 멀티팬',
      defaultPlatform: 'ohou',
      link: 'https://ohou.se/productions/sample-multipan',
      memo: '냄비랑 프라이팬 하나로 합쳐진 딥 디자인! 볶음, 국물, 파스타 다 되고 감성 화이트라 플레이팅 필요 없음'
    },
    {
      icon: '🥣',
      name: '컬리 시그니처 수제 꾸덕 그릭요거트 & 유기농 그래놀라',
      title: '컬리 수제 그릭요거트',
      search: '수제 그릭요거트 유기농 그래놀라',
      defaultPlatform: 'kurly',
      link: 'https://www.kurly.com/goods/sample-greek-yogurt',
      memo: '크림치즈처럼 쫀득꾸덕 단백질 폭탄! 꿀이랑 그래놀라 올려서 아침 1분 만에 먹으면 카페 요거트볼 저리 가라'
    },
    {
      icon: '🍅',
      name: '오아시스 유기농 스테비아 방울토마토 & 제주 감귤',
      title: '오아시스 유기농 방울토마토',
      search: '오아시스 유기농 방울토마토',
      defaultPlatform: 'oasis',
      link: 'https://www.oasis.co.kr/product/detail/sample-tomato',
      memo: '설탕 뿌린 것처럼 달콤한데 당류 부담 제로! 아이들 간식, 다이어트 야식으로 새벽 문앞 배송 1위'
    }
  ],
  living: [
    {
      icon: '🏠',
      name: '오늘의집 미니멀 틈새 이동식 트롤리 선반',
      title: '틈새 이동식 트롤리',
      search: '틈새 이동식 트롤리 수납선반',
      defaultPlatform: 'ohou',
      link: 'https://ohou.se/productions/sample-trolley',
      imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1080&auto=format&fit=crop&q=80',
      memo: '냉장고 옆이나 세탁실 15cm 죽은 틈새 공간 살려주는 수납 구원템! 바퀴 굴림 부드럽고 오늘의집 감성 인테리어 완성'
    },
    {
      icon: '🗄️',
      name: '슬라이딩 싱크대 하부장 2단 수납랙',
      title: '싱크대 슬라이딩 수납랙',
      search: '싱크대 하부장 슬라이딩 선반',
      defaultPlatform: 'ohou',
      link: 'https://ohou.se/productions/sample-rack',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1080&auto=format&fit=crop&q=80',
      memo: '어둡고 깊어서 냄비 꺼내기 힘들었던 하부장이 서랍처럼 스르륵 나옴! 공간 2배로 넓어지는 수납 혁명'
    },
    {
      icon: '🧲',
      name: '자석 부착형 배수구 실리콘 덮개',
      title: '배수구 실리콘 덮개',
      search: '배수구 실리콘 덮개',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-drain',
      memo: '싱크대 악취랑 날파리 완벽 차단! 자석으로 1초 탈부착되고 물때 안 끼는 위생 실리콘'
    },
    {
      icon: '🧽',
      name: 'PVA 고밀도 워터블럭 물기제거 스펀지',
      title: 'PVA 워터블럭',
      search: 'PVA 워터블럭',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-waterblock',
      memo: '욕실 거울, 싱크대 물때 슥 닦으면 물방울 하나 없이 광남! 휴지 낭비 없이 1초 만에 물기 싹 흡수'
    },
    {
      icon: '🔄',
      name: '360도 회전식 냉장고 양념통 트레이',
      title: '회전 양념통 트레이',
      search: '회전 양념통 트레이',
      defaultPlatform: 'ohou',
      link: 'https://ohou.se/productions/sample-rotary',
      memo: '냉장고 안쪽 깊숙이 박힌 양념통 찾느라 다 꺼낼 필요 없음! 돌리면 1초 만에 나와서 삶의 질 수직상승'
    },
    {
      icon: '✨',
      name: '무타공 싱크대 틈새 양념통 슬라이딩 선반',
      title: '무타공 슬라이딩 양념선반',
      search: '무타공 싱크대 양념통 선반',
      defaultPlatform: 'ohou',
      link: 'https://ohou.se/productions/sample-shelf',
      memo: '못 박을 필요 1도 없이 1초 초간편 설치! 지저분하던 주방 상판이 호텔 조리대처럼 깔끔해지는 마법'
    },
    {
      icon: '🧻',
      name: '컬리 무형광 3겹 천연펄프 프리미엄 롤화장지',
      title: '컬리 3겹 천연펄프 화장지',
      search: '무형광 3겹 천연펄프 롤화장지',
      defaultPlatform: 'kurly',
      link: 'https://www.kurly.com/goods/sample-tissue',
      memo: '먼지 날림 0% 피부 자극 없는 100% 천연펄프! 마켓컬리 샛별배송 장바구니 필수 쟁여템'
    }
  ],
  lifestyle: [
    {
      icon: '⚡',
      name: '토스쇼핑 1초 원터치 무선 진공 밀폐 포장기',
      title: '토스쇼핑 무선 진공포장기',
      search: '원터치 무선 진공포장기',
      defaultPlatform: 'toss',
      link: 'https://toss.im/sample/vacuum-sealer',
      memo: '남은 식재료, 과자봉지 1초 만에 공기 싹 빼서 완벽 밀봉! 토스쇼핑 쉐어링크 특가 떴을 때 쟁여야 할 가성비 끝판왕'
    },
    {
      icon: '💆',
      name: '무선 온열 넥케어 마사지기',
      title: '무선 온열 목마사지기',
      search: '무선 온열 목마사지기',
      defaultPlatform: 'coupang',
      link: 'https://link.coupang.com/a/sample-neck',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1080&auto=format&fit=crop&q=80',
      memo: '하루 종일 폰/컴퓨터 보느라 돌덩이 된 승모근 15분 만에 살살 녹여줌! 145g 깃털 무게에 온열 기능 힐링'
    },
    {
      icon: '🗑️',
      name: '스마트 모션인식 센서 휴지통',
      title: '스마트 센서 휴지통',
      search: '스마트 센서 휴지통',
      defaultPlatform: 'ohou',
      link: 'https://ohou.se/productions/sample-trash',
      memo: '요리하다 손에 양념 묻었을 때 무릎만 갖다 대면 스르륵 열림! 냄새 완벽 밀폐 자취방 필수템'
    },
    {
      icon: '💧',
      name: '시카 판테놀 리페어 수분 앰플',
      title: '시카 판테놀 앰플',
      search: '시카 수분 앰플',
      defaultPlatform: 'smartstore',
      link: 'https://brand.naver.com/sample/cica-ampoule',
      memo: '병풀 78% 붉은기 즉각 진정! 속건조 0% 저자극 K-뷰티 대란템 1+1 기획'
    },
    {
      icon: '🌬️',
      name: '접이식 초경량 저소음 무선 목걸이 선풍기',
      title: '초경량 무선 목걸이 선풍기',
      search: '접이식 무선 목걸이 선풍기',
      defaultPlatform: 'toss',
      link: 'https://toss.im/sample/portable-fan',
      memo: '주머니에 쏙 들어가는 90g 초경량! 출퇴근 만원 지하철에서 나 혼자 시원함. 3단 풍속에 배터리 종일 감'
    },
    {
      icon: '🔫',
      name: '토스 공동구매 초경량 4단 미니 마사지건',
      title: '토스 초경량 미니 마사지건',
      search: '토스쇼핑 초경량 미니 마사지건',
      defaultPlatform: 'toss',
      link: 'https://toss.im/sample/massage-gun',
      memo: '스마트폰 크기 360g인데 분당 3200RPM 파워 타격! 승모근, 종아리 알 5분 만에 싹 풀리는 쉐어링크 핫딜'
    },
    {
      icon: '🧶',
      name: '토스쇼핑 6중날 강력 충전식 보풀제거기',
      title: '토스 6중날 보풀제거기',
      search: '6중날 충전식 보풀제거기',
      defaultPlatform: 'toss',
      link: 'https://toss.im/sample/lint-remover',
      memo: '보풀 가득하던 니트, 코트 1분 만에 새 옷 비주얼로 부활! 원단 손상 없이 슥 지나가면 끝'
    },
    {
      icon: '🥩',
      name: '오아시스 무항생제 1등급 한돈 칼집 삼겹살',
      title: '오아시스 무항생제 삼겹살',
      search: '오아시스 무항생제 한돈 삼겹살',
      defaultPlatform: 'oasis',
      link: 'https://www.oasis.co.kr/product/detail/sample-pork',
      memo: '육즙 팡팡 터지는 당일 도축 새벽배송! 잡내 1도 없고 겉바속촉 에어프라이어 구이 최강자'
    }
  ]
};

// 일본 현지 SNS 문체 및 해시태그 사전
const JapaneseCopyVocab = {
  hashtagsJP: {
    threads: ['#おすすめ', '#買ってよかった', '#便利グッズ', '#QOL向上', '#ライフハック', '#正直レビュー'],
    ameba: ['#アメブロ', '#購入品紹介', '#正直レビュー', '#便利アイテム', '#プチプラ', '#お気に入り', '#暮らしを楽しむ']
  }
};

