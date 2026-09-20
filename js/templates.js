/**
 * templates.js
 * 카드뉴스 테마, 샘플 데이터, 한국어/일본어 카드뉴스 슬라이드 및 복붙용 템플릿 사전
 */

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

// 🔥 바이럴 검증 추천템 라이브러리 (요리/조리도구, 살림/수납, 자취/삶의질)
const ViralProductLibrary = {
  kitchen: [
    {
      icon: '🍳',
      name: '사각 딥 계란말이팬',
      title: '사각 계란말이팬',
      coupangSearch: '사각 계란말이팬',
      link: 'https://link.coupang.com/a/sample-eggpan',
      memo: '똥손도 호텔 조식 비주얼 계란말이 3분 컷! 세라믹 논스틱 코팅이라 기름 조금만 둘러도 스르륵 말림'
    },
    {
      icon: '💨',
      name: '유리 안개분사 오일 스프레이',
      title: '오일 스프레이',
      coupangSearch: '유리 오일 스프레이',
      link: 'https://link.coupang.com/a/sample-oilspray',
      memo: '숟가락으로 식용유 붓다가 기름바다 칼로리 폭탄 맞던 사람 필수템! 안개 분사로 기름 90% 줄여주고 에어프라이어 요리 필수'
    },
    {
      icon: '🔪',
      name: '무선 원터치 미니 야채 마늘 다지기',
      title: '무선 마늘 다지기',
      coupangSearch: '무선 마늘 다지기',
      link: 'https://link.coupang.com/a/sample-chopper',
      memo: '볶음밥/파스타 할 때 눈물 흘리며 칼질 10분 하던 거 버튼 누르면 3초 만에 끝냄! 세척도 물로 슥 헹구면 됨'
    },
    {
      icon: '🛡️',
      name: '기름튐 방지 미세 실리콘 덮개',
      title: '기름튐 방지 덮개',
      coupangSearch: '기름튐 방지 덮개',
      link: 'https://link.coupang.com/a/sample-splatter',
      memo: '삼겹살이나 볶음 요리할 때 가스레인지 벽면 기름바다 되는 거 100% 차단! 수증기는 빠져나가서 바삭함 유지'
    },
    {
      icon: '🥕',
      name: '스텐 일체형 만능 채칼 슬라이서',
      title: '스텐 만능 채칼',
      coupangSearch: '스텐 만능 채칼',
      link: 'https://link.coupang.com/a/sample-slicer',
      memo: '당근라페, 양배추채 10초 만에 식당 퀄리티로 완성! 칼질 서툰 사람도 손 안 다치고 얇게 썰어줌'
    },
    {
      icon: '🍲',
      name: '세라믹 논스틱 올인원 멀티팬',
      title: '세라믹 올인원팬',
      coupangSearch: '세라믹 멀티팬',
      link: 'https://link.coupang.com/a/sample-multipan',
      memo: '냄비랑 프라이팬 하나로 합쳐진 딥 디자인! 볶음, 국물, 파스타 다 되고 감성 화이트라 플레이팅 필요 없음'
    }
  ],
  living: [
    {
      icon: '🧲',
      name: '자석 부착형 배수구 실리콘 덮개',
      title: '배수구 실리콘 덮개',
      coupangSearch: '배수구 실리콘 덮개',
      link: 'https://link.coupang.com/a/sample-drain',
      memo: '싱크대 악취랑 날파리 완벽 차단! 자석으로 1초 탈부착되고 물때 안 끼는 위생 실리콘'
    },
    {
      icon: '🗄️',
      name: '슬라이딩 싱크대 하부장 2단 수납랙',
      title: '싱크대 슬라이딩 수납랙',
      coupangSearch: '싱크대 하부장 슬라이딩 선반',
      link: 'https://link.coupang.com/a/sample-rack',
      memo: '어둡고 깊어서 냄비 꺼내기 힘들었던 하부장이 서랍처럼 스르륵 나옴! 공간 2배로 넓어지는 수납 혁명'
    },
    {
      icon: '🧽',
      name: 'PVA 고밀도 워터블럭 물기제거 스펀지',
      title: 'PVA 워터블럭',
      coupangSearch: 'PVA 워터블럭',
      link: 'https://link.coupang.com/a/sample-waterblock',
      memo: '욕실 거울, 싱크대 물때 슥 닦으면 물방울 하나 없이 광남! 휴지 낭비 없이 1초 만에 물기 싹 흡수'
    },
    {
      icon: '🔄',
      name: '360도 회전식 냉장고 양념통 트레이',
      title: '회전 양념통 트레이',
      coupangSearch: '회전 양념통 트레이',
      link: 'https://link.coupang.com/a/sample-rotary',
      memo: '냉장고 안쪽 깊숙이 박힌 양념통 찾느라 다 꺼낼 필요 없음! 돌리면 1초 만에 나와서 삶의 질 수직상승'
    }
  ],
  lifestyle: [
    {
      icon: '💆',
      name: '무선 온열 넥케어 마사지기',
      title: '무선 온열 목마사지기',
      coupangSearch: '무선 온열 목마사지기',
      link: 'https://link.coupang.com/a/sample-neck',
      memo: '하루 종일 폰/컴퓨터 보느라 돌덩이 된 승모근 15분 만에 살살 녹여줌! 145g 깃털 무게에 온열 기능 힐링'
    },
    {
      icon: '🗑️',
      name: '스마트 모션인식 센서 휴지통',
      title: '스마트 센서 휴지통',
      coupangSearch: '스마트 센서 휴지통',
      link: 'https://link.coupang.com/a/sample-trash',
      memo: '요리하다 손에 양념 묻었을 때 무릎만 갖다 대면 스르륵 열림! 냄새 완벽 밀폐 자취방 필수템'
    },
    {
      icon: '💧',
      name: '시카 판테놀 리페어 수분 앰플',
      title: '시카 판테놀 앰플',
      coupangSearch: '시카 수분 앰플',
      link: 'https://brand.naver.com/sample/cica-ampoule',
      memo: '병풀 78% 붉은기 즉각 진정! 속건조 0% 저자극 K-뷰티 대란템 1+1 기획'
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

