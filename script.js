// =========================================================
// STATE
// =========================================================
const state = {
  speakerName: '',
  avatarSrc: null,
  avatarDataUrl: null,
  sourceLang: 'vi-VN',
  targetLang: 'en',
  translateApiKey: '67f3eb20-d04b-4021-8cb9-355538ad67a9:fx',
  firebaseConfig: {
    apiKey: "AIzaSyAHIrVVcWhilGQmEqn19VAjNOpYZ6kJg8Y",
    authDomain: "translator-conference.firebaseapp.com",
    databaseURL: "https://translator-conference-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "translator-conference",
    storageBucket: "translator-conference.firebasestorage.app",
    messagingSenderId: "414600908356",
    appId: "1:414600908356:web:8942de62b57bf615687611",
    measurementId: "G-MP392ECQGJ",
  },
  sessionId: null,
  isPresenting: false,
  isMicOn: false,
  recognition: null,
  db: null,
  sessionRef: null,
  translationLog: [],
  viewerCount: 0,
  isAutoTTS: true,
  silenceTimer: null,
  isTranslating: false,
};

// Bảng ánh xạ ngôn ngữ đích sang mã BCP-47 phù hợp cho SpeechSynthesis
const TTS_LANG_MAP = {
  'en': 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'vi': 'vi-VN',
  'vi-VN': 'vi-VN',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'ja': 'ja-JP',
  'ja-JP': 'ja-JP',
  'ko': 'ko-KR',
  'ko-KR': 'ko-KR',
  'fr': 'fr-FR',
  'fr-FR': 'fr-FR',
  'de': 'de-DE',
  'de-DE': 'de-DE',
  'es': 'es-ES',
  'es-ES': 'es-ES',
  'th': 'th-TH',
  'th-TH': 'th-TH',
  'pt': 'pt-BR',
  'pt-BR': 'pt-BR',
};

const LANG_NAMES = {
  'vi-VN': 'Tiếng Việt', 'en-US': 'English', 'en-GB': 'English',
  'zh-CN': '中文', 'ja-JP': '日本語', 'ko-KR': '한국어',
  'fr-FR': 'Français', 'de-DE': 'Deutsch', 'es-ES': 'Español', 'th-TH': 'ภาษาไทย',
  'vi': 'VI', 'en': 'EN', 'zh': 'ZH', 'ja': 'JA', 'ko': 'KO',
  'fr': 'FR', 'de': 'DE', 'es': 'ES', 'th': 'TH', 'pt': 'PT',
};


// =========================================================
// ROUTING — check URL for session viewer
// =========================================================
function init() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  if (sessionId) {
    startViewerMode(sessionId);
  } else {
    showPage('setup-page');
  }
}


// =========================================================
// AVATAR HANDLING
// =========================================================
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.avatarDataUrl = e.target.result;
    state.avatarSrc = null;
    updateAvatarPreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function handleAvatarUrl(url) {
  if (!url) return;
  state.avatarSrc = url;
  state.avatarDataUrl = null;
  updateAvatarPreview(url);
}

function updateAvatarPreview(src) {
  const el = document.getElementById('avatar-preview');
  el.textContent = '';
  const img = document.createElement('img');
  img.src = src;
  img.onerror = () => { el.textContent = '🧑‍💼'; };
  el.appendChild(img);
}

function renderAvatar(el, src, fallback = '🧑‍💼') {
  el.textContent = '';
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.onerror = () => { el.textContent = fallback; };
    el.appendChild(img);
  } else {
    el.textContent = fallback;
  }
}

// =========================================================
// PROCEED TO LOBBY
// =========================================================
function proceedToLobby() {
  const name = document.getElementById('speaker-name').value.trim();
  if (!name) {
    showError('setup-error', 'Vui lòng nhập tên diễn giả.');
    return;
  }

  state.speakerName = name;
  state.sourceLang = document.getElementById('source-lang').value;
  state.targetLang = document.getElementById('target-lang').value;

  hideError('setup-error');
  state.sessionId = generateSessionId();

  // Chạy luôn vào lobby vì QR và Firebase tạm thời chỉ là demo UI
  buildLobby();
  showPage('lobby-page');
  initFirebaseForSpeaker();
  warmUpSpeechAPI();
}

function generateSessionId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').substring(0, 8).toUpperCase();
}


function updateViewerDisplay(count) {
  const lobbyEl = document.getElementById('viewer-count-lobby');
  const footerEl = document.getElementById('footer-viewers');
  if (lobbyEl) lobbyEl.textContent = count + ' người đang theo dõi';
  if (footerEl) footerEl.textContent = count + ' viewers';
}

// =========================================================
// BUILD LOBBY
// =========================================================
function buildLobby() {
  document.getElementById('lobby-name').textContent = state.speakerName;

  const srcName = LANG_NAMES[state.sourceLang] || state.sourceLang;
  const tgtName = LANG_NAMES[state.targetLang] || state.targetLang;
  document.getElementById('lobby-langs').textContent = `${srcName} → ${tgtName}`;

  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  renderAvatar(document.getElementById('lobby-avatar'), avatarSrc);

  const sessionId = state.sessionId;
  document.getElementById('session-id-display').textContent = sessionId;

  // URL ngắn gọn - Firebase config đã được hardcode trong script.js, không cần nhúng vào URL
  const viewerUrl = window.location.origin + window.location.pathname
    + '?session=' + sessionId;
  document.getElementById('session-url-display').textContent = viewerUrl;

  // Generate QR
  const qrContainer = document.getElementById('qr-container');
  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: viewerUrl,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.L,
  });
}

function goBack() {
  if (state.sessionRef) {
    state.sessionRef.remove();
    state.sessionRef = null;
  }
  showPage('setup-page');
}

// Khởi tạo Firebase và tạo session cho diễn giả
function initFirebaseForSpeaker() {
  if (!state.firebaseConfig || !state.firebaseConfig.apiKey) return;
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(state.firebaseConfig);
    }
    state.db = firebase.database();
    state.sessionRef = state.db.ref('sessions/' + state.sessionId);
    state.sessionRef.set({
      speakerName: state.speakerName,
      avatarSrc: state.avatarSrc || state.avatarDataUrl || null,
      sourceLang: state.sourceLang,
      targetLang: state.targetLang,
      status: 'waiting',
      viewerCount: 0,
      translations: null,
      interim: '',
      updatedAt: Date.now(),
    });
    // Theo dõi số người xem
    state.sessionRef.child('viewerCount').on('value', snap => {
      const count = snap.val() || 0;
      state.viewerCount = count;
      updateViewerDisplay(count);
    });
    // Xóa session khi đóng trang
    window.addEventListener('beforeunload', () => {
      if (state.sessionRef) state.sessionRef.remove();
    });
  } catch (e) {
    console.error('Firebase init error:', e);
  }
}


// =========================================================
// START PRESENTATION
// =========================================================
function startPresentation() {
  state.isPresenting = true;
  state.translationLog = [];
  state.isTranslating = false;

  // Update Firebase
  if (state.sessionRef) {
    state.sessionRef.update({ status: 'presenting', translations: null, interim: '' });
  }

  // Build present page
  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  renderAvatar(document.getElementById('present-avatar'), avatarSrc);
  document.getElementById('present-name').textContent = state.speakerName;

  const srcShort = state.sourceLang.split('-')[0].toUpperCase();
  const tgtShort = state.targetLang.toUpperCase();
  document.getElementById('present-src-lang').textContent = srcShort;
  document.getElementById('present-tgt-lang').textContent = tgtShort;
  document.getElementById('footer-session').textContent = 'SESSION: ' + state.sessionId;
  updateViewerDisplay(state.viewerCount);

  // Xóa nội dung trình chiếu cũ
  document.getElementById('translation-scroll').innerHTML = '';
  document.getElementById('interim-display').innerHTML = '<em class="text-muted">Văn bản đang nhận diện sẽ hiển thị tại đây...</em>';
  const chip = document.getElementById('status-chip');
  chip.className = 'status-chip idle';
  chip.textContent = '⏸ Đang chờ';

  showPage('present-page');
  document.getElementById('present-page').style.display = 'flex';

  // Try fullscreen
  const el = document.getElementById('present-page');
  if (el.requestFullscreen) el.requestFullscreen().catch(() => { });
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
}

function stopPresentation() {
  state.isPresenting = false;
  stopMic();
  if (state.sessionRef) state.sessionRef.update({ status: 'ended' });
  if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
  showPage('lobby-page');
  // Warm-up lại để session tiếp theo không bị delay
  warmUpSpeechAPI();
}

// Khởi động Web Speech API trước để trình duyệt thiết lập kết nối với server nhận diện,
// tránh độ trễ cold-start khi diễn giả bấm bắt đầu thu âm lần đầu trong session.
function warmUpSpeechAPI() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  try {
    const warmup = new SpeechRecognition();
    warmup.lang = state.sourceLang || 'vi-VN';
    warmup.interimResults = false;
    warmup.continuous = false;
    warmup.maxAlternatives = 1;
    warmup.onresult = () => { warmup.stop(); };
    warmup.onerror = () => { warmup.stop(); };
    warmup.onend = () => { };
    warmup.start();
    // Tắt sau 800ms — đủ để thiết lập kết nối mà không ảnh hưởng UX
    setTimeout(() => {
      try { warmup.stop(); } catch (e) { }
    }, 800);
  } catch (e) { }
}

// =========================================================
// SPEECH RECOGNITION
// =========================================================
function toggleMic() {
  if (state.isMicOn) {
    stopMic();
  } else {
    startMic();
  }
}

function startMic() {
  // Dọn dẹp đối tượng SpeechRecognition cũ trước khi tạo mới để tránh memory leak và giữ sạch event listeners
  if (state.recognition) {
    try {
      state.recognition.onstart = null;
      state.recognition.onresult = null;
      state.recognition.onerror = null;
      state.recognition.onend = null;
      state.recognition.stop();
    } catch (e) { }
    state.recognition = null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Trình duyệt không hỗ trợ Web Speech API. Vui lòng dùng Chrome hoặc Edge.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.sourceLang;
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    state.isTranslating = false;
  };

  recognition.onresult = (event) => {
    if (state.isTranslating) return;

    let interim = '';
    let finalText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript + ' '; // Thêm khoảng trắng để tránh dính chữ
      } else {
        interim += transcript;
      }
    }

    if (interim) {
      document.getElementById('interim-display').textContent = interim;
      if (state.sessionRef) state.sessionRef.update({ interim });
      // Viewer interim
      const vInterim = document.getElementById('viewer-interim');
      if (vInterim) vInterim.textContent = interim;

      // Tự động dịch sau khoảng lặng ngừng nói
      clearTimeout(state.silenceTimer);
      state.silenceTimer = setTimeout(() => {
        if (state.isMicOn && interim.trim()) {
          triggerAutoTranslation(interim);
        }
      }, 1500);
    }

    if (finalText.trim()) {
      clearTimeout(state.silenceTimer);
      triggerAutoTranslation(finalText);
    }
  };

  recognition.onerror = (e) => {
    console.warn('Speech error:', e.error);
    if (e.error === 'not-allowed') {
      alert('Microphone bị từ chối. Vui lòng cho phép quyền mic trong trình duyệt.');
      stopMic();
    }
    // Không tự động tắt mic nếu gặp lỗi mạng (network) hoặc không nhận diện được giọng nói (no-speech)
    // Sự kiện onend sẽ tự động khởi động lại
  };

  recognition.onend = () => {
    // Nếu đang dịch/TTS, không restart ngay — speakTranslation.onend sẽ tự gọi startMic()
    if (state.isTranslating) return;
    // Tự động khởi động lại (Continuous listen)
    if (state.isMicOn) {
      setTimeout(() => {
        if (state.isMicOn && !state.isTranslating) {
          try {
            startMic();
          } catch (err) {
            console.warn('Auto-restart error:', err);
          }
        }
      }, 200);
    }
  };

  try {
    recognition.start();
    state.recognition = recognition;
    state.isMicOn = true;

    const micBtn = document.getElementById('mic-btn');
    micBtn.classList.add('active');
    micBtn.textContent = '🔴';
    micBtn.setAttribute('aria-pressed', 'true');
    micBtn.setAttribute('aria-label', 'Tắt mic');
    document.getElementById('mic-label').textContent = 'Đang nghe... (nhấn để tắt)';
    setStatus('listening', '● Đang nghe');
  } catch (err) {
    console.error('Lỗi khi khởi động mic:', err);
    alert('Có lỗi khi khởi động microphone. Vui lòng tải lại trang.');
  }
}

function stopMic() {
  clearTimeout(state.silenceTimer);
  state.isTranslating = false;
  if (state.recognition) {
    state.recognition.onend = null;
    state.recognition.stop();
    state.recognition = null;
  }
  state.isMicOn = false;
  const micBtn = document.getElementById('mic-btn');
  micBtn.classList.remove('active');
  micBtn.textContent = '🎙️';
  micBtn.setAttribute('aria-pressed', 'false');
  micBtn.setAttribute('aria-label', 'Bật mic');
  document.getElementById('mic-label').textContent = 'Nhấn để bật mic';
  setStatus('idle', '⏸ Đang chờ');
  document.getElementById('interim-display').innerHTML = '<em class="text-muted">Văn bản đang nhận diện sẽ hiển thị tại đây...</em>';
}

async function triggerAutoTranslation(text) {
  if (!text || !text.trim() || state.isTranslating) return;

  // Đánh dấu đang xử lý để chặn các lệnh dịch trùng lặp
  state.isTranslating = true;
  clearTimeout(state.silenceTimer);

  // Dừng nhận diện để làm sạch buffer cho câu nói tiếp theo
  // onend sẽ không restart vì isTranslating = true
  if (state.isMicOn && state.recognition) {
    try {
      state.recognition.stop();
    } catch (err) {
      console.warn('Lỗi khi tạm dừng mic để restart:', err);
    }
  }

  // Cập nhật giao diện sang trạng thái đang dịch
  document.getElementById('interim-display').innerHTML = '<em class="text-muted">Đang dịch...</em>';
  setStatus('translating', '⟳ Đang dịch...');
  if (state.sessionRef) state.sessionRef.update({ interim: '' });

  // Thực hiện dịch thuật; mic sẽ restart sau khi TTS đọc xong
  await translateText(text.trim());
}

function setStatus(type, text) {
  const chip = document.getElementById('status-chip');
  chip.className = 'status-chip ' + type;
  chip.textContent = text;
}

// =========================================================
// TEXT-TO-SPEECH (TTS) — Đọc bản dịch tự động
// =========================================================
function toggleTTS() {
  state.isAutoTTS = !state.isAutoTTS;
  const btn = document.getElementById('tts-btn');
  const label = document.getElementById('tts-label');
  if (state.isAutoTTS) {
    btn.classList.add('active');
    btn.textContent = '🔊';
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Tắt tự động đọc');
    label.textContent = 'Tự động đọc: BẬT';
  } else {
    btn.classList.remove('active');
    btn.textContent = '🔇';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Bật tự động đọc');
    label.textContent = 'Tự động đọc: TẮT';
    window.speechSynthesis.cancel();
  }
}

function speakTranslation(text, langCode) {
  if (!state.isAutoTTS || !text) {
    // Nếu TTS tắt, reset ngay để mic bắt đầu lại
    if (state.isMicOn) {
      state.isTranslating = false;
      startMic();
    }
    return;
  }
  if (text.startsWith('[')) {
    // Bỏ qua thông báo lỗi, reset mic ngay
    if (state.isMicOn) {
      state.isTranslating = false;
      startMic();
    }
    return;
  }

  const ttsLang = TTS_LANG_MAP[langCode] || TTS_LANG_MAP[langCode.split('-')[0]] || langCode;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = ttsLang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Thử chọn voice tốt nhất cho ngôn ngữ đích
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = ttsLang.split('-')[0].toLowerCase();
  const bestVoice = voices.find(v => v.lang === ttsLang)
    || voices.find(v => v.lang.toLowerCase().startsWith(langPrefix))
    || null;
  if (bestVoice) utterance.voice = bestVoice;

  // Sau khi TTS đọc xong, reset cờ và khởi động lại mic
  utterance.onend = () => {
    if (state.isMicOn) {
      state.isTranslating = false;
      // Delay 600ms để buffer audio bị xóa, tránh mic thu lại âm thanh TTS vừa phát
      setTimeout(() => { if (state.isMicOn) startMic(); }, 600);
    }
  };

  // Phòng trường hợp TTS bị lỗi hoặc bị huỷ
  utterance.onerror = () => {
    if (state.isMicOn) {
      state.isTranslating = false;
      setTimeout(() => { if (state.isMicOn) startMic(); }, 600);
    }
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Preload voices (một số trình duyệt cần sự kiện này)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// =========================================================
// TRANSLATION
// =========================================================
async function translateText(originalText) {
  // Ưu tiên Google Translate trực tiếp (không cần proxy, nhanh hơn)
  const translatedText = await fallbackGoogleTranslate(originalText);

  const entry = {
    original: originalText,
    translated: translatedText,
    srcLang: state.sourceLang.split('-')[0].toUpperCase(),
    tgtLang: state.targetLang.toUpperCase(),
    timestamp: Date.now(),
  };

  state.translationLog.push(entry);
  appendTranslationEntry(entry);
  setStatus('listening', '● Đang nghe');

  // Tự động đọc bản dịch
  speakTranslation(translatedText, state.targetLang);

  // Push to Firebase
  if (state.sessionRef) {
    state.sessionRef.child('translations').push(entry);
  }

  // Auto-scroll
  const scroll = document.getElementById('translation-scroll');
  setTimeout(() => { scroll.scrollTop = scroll.scrollHeight; }, 100);
}

// Hàm dự phòng dùng Google Translate API miễn phí không cần proxy
async function fallbackGoogleTranslate(textToTranslate) {
  try {
    const sourceLang = state.sourceLang.split('-')[0];
    const targetLang = state.targetLang.split('-')[0];
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) return '[Lỗi kết nối dịch thuật]';

    const data = await response.json();
    let translatedText = "";
    if (data && data[0]) {
      data[0].forEach(part => {
        if (part[0]) translatedText += part[0];
      });
    }
    return translatedText || '[Lỗi dịch]';
  } catch (error) {
    console.error("Google Translate Fallback Error:", error);
    return '[Lỗi kết nối dịch thuật]';
  }
}

function appendTranslationEntry(entry) {
  const scroll = document.getElementById('translation-scroll');
  const div = document.createElement('div');
  div.className = 'translation-entry';
  div.innerHTML = `
    <div class="entry-original">
      <div class="lang-tag">${entry.srcLang} · Nguyên bản</div>
      ${escapeHtml(entry.original)}
    </div>
    <div class="entry-translated">
      <div class="lang-tag">${entry.tgtLang} · Bản dịch</div>
      ${escapeHtml(entry.translated)}
    </div>
  `;
  scroll.appendChild(div);
}

// =========================================================
// VIEWER MODE
// =========================================================
function startViewerMode(sessionId) {
  showPage('viewer-page');
  document.getElementById('viewer-speaker-name').textContent = 'Session: ' + sessionId;

  const tryFb = () => {
    if (typeof firebase === 'undefined') {
      // SDK chưa tải xong, thử lại sau
      setTimeout(tryFb, 300);
      return;
    }
    try {
      // Dùng firebaseConfig có sẵn trong script (không cần URL param)
      if (!firebase.apps.length) {
        firebase.initializeApp(state.firebaseConfig);
      }
      listenToSession(firebase.database(), sessionId);
    } catch (e) {
      console.error('Firebase viewer init error:', e);
      showViewerOfflineMessage();
    }
  };

  setTimeout(tryFb, 500);
}

function showViewerOfflineMessage() {
  const waiting = document.getElementById('viewer-waiting');
  waiting.innerHTML = `
    <div class="waiting-icon">📵</div>
    <div class="waiting-title">Không thể kết nối</div>
    <div class="waiting-sub">Trang này cần Firebase để đồng bộ. Yêu cầu diễn giả chia sẻ QR code được tạo từ ứng dụng đã cấu hình Firebase.</div>
  `;
}

function listenToSession(db, sessionId) {
  const sessionRef = db.ref('sessions/' + sessionId);

  // Register as viewer
  sessionRef.child('viewerCount').transaction(count => (count || 0) + 1);
  window.addEventListener('beforeunload', () => {
    sessionRef.child('viewerCount').transaction(count => Math.max((count || 0) - 1, 0));
  });

  // Listen to session data
  sessionRef.on('value', snap => {
    const data = snap.val();
    if (!data) {
      showViewerOfflineMessage();
      return;
    }

    // Update speaker info
    document.getElementById('viewer-speaker-name').textContent = data.speakerName || 'Diễn Giả';
    if (data.avatarSrc) {
      renderAvatar(document.getElementById('viewer-avatar'), data.avatarSrc);
    }

    // Status
    const statusDot = document.getElementById('viewer-status-dot');
    const statusText = document.getElementById('viewer-status-text');
    if (data.status === 'presenting') {
      statusDot.style.background = 'var(--green)';
      statusText.textContent = 'Đang phát sóng';
      document.getElementById('viewer-waiting').style.display = 'none';
    } else if (data.status === 'ended') {
      statusDot.style.background = 'var(--red)';
      statusText.textContent = 'Phiên đã kết thúc';
    }

    // Interim
    if (data.interim) {
      document.getElementById('viewer-interim').textContent = data.interim;
    } else {
      document.getElementById('viewer-interim').innerHTML = '<em class="text-muted">Đang lắng nghe...</em>';
    }
  });

  // Listen to translations
  let firstLoad = true;
  sessionRef.child('translations').on('child_added', snap => {
    if (firstLoad) return;
    const entry = snap.val();
    appendViewerEntry(entry);
  });
  setTimeout(() => {
    firstLoad = false;
    // Load existing translations
    sessionRef.child('translations').once('value', snap => {
      const data = snap.val();
      if (data) {
        Object.values(data).forEach(entry => appendViewerEntry(entry));
      }
    });
  }, 100);
}

function appendViewerEntry(entry) {
  const waiting = document.getElementById('viewer-waiting');
  if (waiting) waiting.style.display = 'none';

  const scroll = document.getElementById('viewer-scroll');
  const div = document.createElement('div');
  div.className = 'viewer-entry';
  div.innerHTML = `
    <div class="viewer-original">${escapeHtml(entry.original)}</div>
    <div class="viewer-translated">${escapeHtml(entry.translated)}</div>
  `;
  scroll.appendChild(div);
  setTimeout(() => { scroll.scrollTop = scroll.scrollHeight; }, 100);
}

// =========================================================
// UTILS
// =========================================================
function showPage(id) {
  ['setup-page', 'lobby-page', 'present-page', 'viewer-page'].forEach(p => {
    const el = document.getElementById(p);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = id === 'present-page' ? 'flex' : 'flex';
    target.style.display = 'flex';
  }
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



// =========================================================
// BOOT
// =========================================================
window.addEventListener('DOMContentLoaded', init);