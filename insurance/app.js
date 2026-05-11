// 보험놀이터 모바일 웹앱 - SPA 라우터 및 전체 로직
const app = document.getElementById('app');

// ===== 상태 관리 =====
const state = {
  currentPage: 'home',
  menuOpen: false,
  consultStep: 1,
  consultData: { value: '', history: '', details: '' },
};

// ===== 렌더링 =====
function render() {
  app.innerHTML = `
    ${renderNavbar()}
    ${renderPage('home', renderHome())}
    ${renderPage('dashboard', renderDashboard())}
    ${renderPage('consultation', renderConsultation())}
    ${renderPage('products', renderProducts())}
    ${renderPage('news', renderNews())}
    ${renderTabBar()}
    <div class="nav-overlay ${state.menuOpen ? 'show' : ''}" id="overlay"></div>
  `;
  bindEvents();
}

function renderPage(name, content) {
  return `<div class="page ${state.currentPage === name ? 'active' : ''}" id="page-${name}">${content}</div>`;
}

// ===== 네비게이션 바 =====
function renderNavbar() {
  return `
    <nav class="navbar">
      <div class="navbar-inner">
        <a class="nav-logo" data-page="home">보험놀이터</a>
        <button class="hamburger ${state.menuOpen ? 'active' : ''}" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav-menu ${state.menuOpen ? 'open' : ''}" id="nav-menu">
        <a data-page="products">📊 상품 분석</a>
        <a data-page="news">📰 실무 뉴스</a>
        <a data-page="dashboard">💼 내 보험</a>
        <a data-page="consultation">🎯 맞춤 상담</a>
      </div>
    </nav>`;
}

// ===== 하단 탭바 =====
function renderTabBar() {
  const tabs = [
    { id: 'home', icon: '🏠', label: '홈' },
    { id: 'dashboard', icon: '💼', label: '내 보험' },
    { id: 'consultation', icon: '🎯', label: '상담' },
    { id: 'products', icon: '📊', label: '상품' },
    { id: 'news', icon: '📰', label: '뉴스' },
  ];
  return `
    <div class="tab-bar">
      ${tabs.map(t => `
        <button class="tab-item ${state.currentPage === t.id ? 'active' : ''}" data-page="${t.id}">
          <span class="tab-icon">${t.icon}</span>
          ${t.label}
        </button>
      `).join('')}
    </div>`;
}

// ===== 홈 페이지 =====
function renderHome() {
  return `
    <section class="hero">
      <h1 class="hero-title animate">나에게 딱 맞는 보험,<br>이제 <em>보험놀이터</em>에서 찾으세요</h1>
      <p class="hero-sub animate" style="animation-delay:0.1s">숨은 내 보험 찾기부터 매달 업데이트되는 추천 상품까지, 복잡한 보험을 쉽고 투명하게 설계해 드립니다.</p>
      <div class="hero-buttons animate" style="animation-delay:0.2s">
        <button class="btn btn-primary" data-page="dashboard">내 보험 확인하기</button>
        <button class="btn btn-secondary" data-page="consultation">가치 기반 상담받기</button>
      </div>
    </section>
    <section class="features">
      <div class="feature-card glass animate" style="animation-delay:0.25s">
        <div class="feature-icon">🔍</div>
        <div>
          <h3>숨은 내 보험 조회</h3>
          <p>내가 가입한 모든 보험을 한눈에 모아보고, 중복 보장이나 부족한 보장을 스마트하게 분석합니다.</p>
        </div>
      </div>
      <div class="feature-card glass animate" style="animation-delay:0.35s">
        <div class="feature-icon">✨</div>
        <div>
          <h3>이달의 신규 추천 보험</h3>
          <p>보험사마다 새롭게 출시되는 유망한 상품들을 엄선하여 매월 직관적인 표로 비교 분석해 드립니다.</p>
        </div>
      </div>
      <div class="feature-card glass animate" style="animation-delay:0.45s">
        <div class="feature-icon">🎯</div>
        <div>
          <h3>초개인화 맞춤형 매칭</h3>
          <p>나의 나이, 건강 상태, 재무 목표를 바탕으로 가입 자격을 확인하고 최적의 상품을 매칭합니다.</p>
        </div>
      </div>
    </section>`;
}

// ===== 대시보드 페이지 =====
function renderDashboard() {
  return `
    <div class="dash-header animate">
      <h1>내 보험 확인하기</h1>
      <p>현재 가입된 보험 내역과 월 납입 보험료를 확인하세요.</p>
    </div>
    <div class="summary-row">
      <div class="summary-card glass animate" style="animation-delay:0.1s">
        <span class="label">총 가입 건수</span>
        <span class="value">0건</span>
      </div>
      <div class="summary-card glass animate" style="animation-delay:0.15s">
        <span class="label">월 보험료</span>
        <span class="value">0원</span>
      </div>
    </div>
    <div class="empty-state animate" style="animation-delay:0.2s">
      <div class="empty-icon">📑</div>
      <h3>아직 연결된 보험이 없어요.</h3>
      <p>'내 정보 등록하기' 버튼을 눌러 보험사 정보를 불러와 보세요.</p>
    </div>
    <button class="btn-register animate" style="animation-delay:0.3s" id="btn-register">
      내 정보 등록하기
    </button>`;
}

// ===== 상담 페이지 =====
function renderConsultation() {
  const { consultStep: step, consultData: data } = state;

  if (step === 4) {
    return `
      <div class="consult-page">
        <div class="survey-card glass animate">
          <div class="result-view">
            <div class="result-icon">🎉</div>
            <h2 class="result-title">상담 신청 완료!</h2>
            <p style="font-size:0.95rem;margin-bottom:1.5rem;line-height:1.6">
              선택해주신 가치(<strong>${data.value}</strong>)와 병력 정보를 바탕으로,
              전문 상담사가 최적의 상품을 분석하여 곧 연락드리겠습니다.
            </p>
            <button class="btn btn-primary" data-page="home">홈으로 돌아가기</button>
          </div>
        </div>
      </div>`;
  }

  let stepContent = '';
  if (step === 1) {
    const options = ['저렴한 보험료', '폭넓은 보장 범위', '빠른 보상 청구', '미래를 위한 저축성'];
    stepContent = `
      <h2 class="question">보험에서 가장 중요하게 생각하는 가치는 무엇인가요?</h2>
      <div class="options">
        ${options.map(o => `<button class="option-btn ${data.value === o ? 'selected' : ''}" data-option="value" data-val="${o}">${o}</button>`).join('')}
      </div>`;
  } else if (step === 2) {
    const options = ['아니오, 없습니다 (우량체/표준체 가입 가능)', '예, 있습니다 (유병자 보험 추천 대상)'];
    stepContent = `
      <h2 class="question">최근 5년 이내 입원이나 수술 이력이 있으신가요?</h2>
      <p style="text-align:center;margin-bottom:1.5rem;color:var(--text-secondary);font-size:0.85rem">가입 자격 확인을 위해 필요한 정보입니다.</p>
      <div class="options">
        ${options.map(o => `<button class="option-btn ${data.history === o ? 'selected' : ''}" data-option="history" data-val="${o}">${o}</button>`).join('')}
      </div>`;
  } else if (step === 3) {
    stepContent = `
      <h2 class="question">추가로 상담받고 싶은 내용을 적어주세요</h2>
      <textarea class="form-textarea" id="consult-detail" placeholder="예: 기존 보험이 너무 비싼 것 같은데 리모델링이 가능할까요?">${data.details}</textarea>`;
  }

  return `
    <div class="consult-page">
      <h1 class="animate">맞춤 상담 및 자격 확인</h1>
      <p class="animate" style="animation-delay:0.05s">몇 가지 질문을 통해 나에게 딱 맞는 보험을 찾아드립니다.</p>
      <div class="survey-card glass animate" style="animation-delay:0.1s">
        <div class="step-dots">
          ${[1,2,3].map(i => `<div class="step-dot ${step >= i ? 'active' : ''}"></div>`).join('')}
        </div>
        ${stepContent}
        <div class="action-row">
          <button class="btn btn-secondary" id="consult-prev" style="visibility:${step === 1 ? 'hidden' : 'visible'}">이전</button>
          <button class="btn btn-primary" id="consult-next" ${(step === 1 && !data.value) || (step === 2 && !data.history) ? 'disabled' : ''}>
            ${step === 3 ? '상담 신청하기' : '다음'}
          </button>
        </div>
      </div>
    </div>`;
}

// ===== 상품 페이지 =====
function renderProducts() {
  const products = [
    { tag: '종합보험', name: '무배당 건강보험 프리미엄', desc: '3대 질병(암, 뇌, 심장) 집중 보장 + 입원/수술비 특약 결합 가능', company: '삼성화재' },
    { tag: '실손보험', name: '4세대 실손의료비보험', desc: '자기부담금 20~30%, 보험료 갱신 안정형 설계', company: '현대해상' },
    { tag: '저축성', name: '무배당 연금보험 플러스', desc: '10년 이상 유지 시 비과세 혜택, 공시이율 연동형', company: '한화생명' },
    { tag: '운전자', name: '운전자보험 안심플랜', desc: '교통사고 처리지원금 + 벌금/변호사선임 특약', company: 'DB손해보험' },
  ];
  return `
    <div class="info-page">
      <h1 class="animate">📊 이달의 추천 상품</h1>
      <p class="animate" style="animation-delay:0.05s">2026년 5월 엄선된 보험 상품입니다.</p>
      ${products.map((p, i) => `
        <div class="info-card glass animate" style="animation-delay:${0.1 + i * 0.08}s">
          <span class="tag">${p.tag}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <p style="color:var(--brand-primary);font-size:0.8rem;font-weight:600;margin-top:0.35rem">${p.company}</p>
        </div>
      `).join('')}
    </div>`;
}

// ===== 뉴스 페이지 =====
function renderNews() {
  const news = [
    { tag: '법규', title: '보험업법 개정안 국회 통과', desc: '디지털 보험 판매 규제 완화 및 소비자 보호 강화 조치가 포함되었습니다.' },
    { tag: '시장', title: '상반기 보험사 실적 전망', desc: '금리 인하 기조에 따른 저축성 보험 수요 증가 예상.' },
    { tag: '실무', title: 'GA 수수료 체계 개편', desc: '금감원이 GA 판매 수수료 투명성 강화를 위한 가이드라인을 발표했습니다.' },
    { tag: '상품', title: '4세대 실손보험 갱신료 안내', desc: '7월 갱신 예정 실손보험료 평균 인상률 및 대응 방안 정리.' },
  ];
  return `
    <div class="info-page">
      <h1 class="animate">📰 실무 뉴스</h1>
      <p class="animate" style="animation-delay:0.05s">보험 설계사를 위한 최신 업계 소식입니다.</p>
      ${news.map((n, i) => `
        <div class="info-card glass animate" style="animation-delay:${0.1 + i * 0.08}s">
          <span class="tag">${n.tag}</span>
          <h3>${n.title}</h3>
          <p>${n.desc}</p>
        </div>
      `).join('')}
    </div>`;
}

// ===== 이벤트 바인딩 =====
function bindEvents() {
  // 페이지 전환
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentPage = el.dataset.page;
      state.menuOpen = false;
      if (el.dataset.page === 'consultation' && state.consultStep === 4) {
        state.consultStep = 1;
        state.consultData = { value: '', history: '', details: '' };
      }
      render();
      window.scrollTo(0, 0);
    });
  });

  // 햄버거 메뉴
  document.getElementById('hamburger-btn')?.addEventListener('click', () => {
    state.menuOpen = !state.menuOpen;
    render();
  });

  // 오버레이
  document.getElementById('overlay')?.addEventListener('click', () => {
    state.menuOpen = false;
    render();
  });

  // 상담 옵션 선택
  document.querySelectorAll('[data-option]').forEach(el => {
    el.addEventListener('click', () => {
      state.consultData[el.dataset.option] = el.dataset.val;
      render();
    });
  });

  // 상담 이전/다음
  document.getElementById('consult-prev')?.addEventListener('click', () => {
    state.consultStep = Math.max(1, state.consultStep - 1);
    render();
  });
  document.getElementById('consult-next')?.addEventListener('click', () => {
    if (state.consultStep === 3) {
      const textarea = document.getElementById('consult-detail');
      if (textarea) state.consultData.details = textarea.value;
      state.consultStep = 4;
    } else {
      state.consultStep = Math.min(3, state.consultStep + 1);
    }
    render();
    window.scrollTo(0, 0);
  });

  // 보험 등록 버튼
  document.getElementById('btn-register')?.addEventListener('click', () => {
    alert('보험사 연동 인증 프로세스를 시작합니다.\n(시뮬레이션 기능 준비 중)');
  });
}

// ===== 초기 렌더링 =====
render();
