document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Scroll Fade-in Animation
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => observer.observe(el));

    // 2. Gallery Modal Slider (Using Fancybox for perfect mobile swipe)
    const galleryItems = document.querySelectorAll(".gallery-item");
    const fancyboxImages = Array.from(galleryItems).map(item => ({
        src: item.src,
        type: "image"
    }));

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", function() {
            Fancybox.show(fancyboxImages, {
                startIndex: index,
                Toolbar: {
                    display: {
                        left: ["infobar"],
                        middle: [],
                        right: ["close"],
                    },
                },
                Images: {
                    zoom: true,
                }
            });
        });
    });

    // 3. Accordion for Account Numbers
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(acc => {
        acc.addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    });

    // 4. D-Day Countdown Timer
    const weddingDate = new Date("2026-09-20T14:00:00").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById("d-days").innerText = "00";
            document.getElementById("d-hours").innerText = "00";
            document.getElementById("d-mins").innerText = "00";
            document.getElementById("d-secs").innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("d-days").innerText = String(days).padStart(2, '0');
        document.getElementById("d-hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("d-mins").innerText = String(minutes).padStart(2, '0');
        document.getElementById("d-secs").innerText = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
});

// 4. Copy Account Number Function
function copyAccount(text) {
    // navigator.clipboard API is modern and recommended
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert("계좌번호가 복사되었습니다.");
        }).catch(err => {
            console.error('Failed to copy!', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? '계좌번호가 복사되었습니다.' : '복사에 실패했습니다.';
        alert(msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

// 5. Copy AI Schedule Prompt
function copySchedulePrompt() {
    const promptText = "2026년 9월 20일 일요일 오후 2시, 대전 라도무스 아트센터 3층 아트리움홀에서 열리는 나학채와 노영아의 결혼식 일정을 내 캘린더에 추가해줘.";
    
    const textArea = document.createElement("textarea");
    textArea.value = promptText;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("일정 추가 내용이 복사되었습니다.\n제미나이나 챗GPT 등 AI 채팅창에 붙여넣기 해보세요!");
        } else {
            alert("복사에 실패했습니다.");
        }
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

// 6. RSVP & Guestbook Handling
const rsvpBtn = document.getElementById('rsvp-btn');
const rsvpModal = document.getElementById('rsvp-modal');
const closeRsvp = document.querySelector('.close-rsvp');
const rsvpForm = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const guestbookMessages = document.getElementById('guestbook-messages');
const guestbookForm = document.getElementById('guestbook-form');
const gbSubmitBtn = document.getElementById('guestbook-submit-btn');

// 구글 스프레드시트 Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzA52K_ElrNdar11nP-_cPmXTH53OlMX2Tb30ftBSAL4IXsAEUh0KQrtHKCVAcwT1c/exec"; 

// 1) 실시간 방명록 불러오기 (GET)
function loadGuestbook() {
    if (!guestbookMessages) return;
    
    guestbookMessages.innerHTML = '<p style="text-align:center; font-size:13px; color:#aaa; padding:20px;">방명록을 불러오는 중입니다...</p>';
    
    fetch(GOOGLE_SCRIPT_URL)
        .then(res => res.json())
        .then(resData => {
            if (resData.result === 'success' && resData.data) {
                const messages = resData.data;
                if (messages.length === 0) {
                    guestbookMessages.innerHTML = '<p style="text-align:center; font-size:13px; color:#aaa; padding:20px;">아직 작성된 메시지가 없습니다. 첫 번째 축하를 남겨주세요!</p>';
                    return;
                }
                
                guestbookMessages.innerHTML = '';
                messages.forEach(msg => {
                    const dateObj = new Date(msg.timestamp);
                    const dateStr = !isNaN(dateObj) ? `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2,'0')}.${String(dateObj.getDate()).padStart(2,'0')}` : '';
                    
                    const card = document.createElement('div');
                    card.className = 'message-card';
                    
                    const safeName = msg.name ? msg.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "익명";
                    const safeSide = msg.side ? msg.side.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    const safeMsg = msg.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>');
                    
                    const sideHtml = safeSide ? ` <span style="font-size:11px; color:#d19b75; font-weight:normal;">(${safeSide})</span>` : '';
                    
                    card.innerHTML = `
                        <div class="msg-header">
                            <p class="msg-author">${safeName}${sideHtml}</p>
                            <button class="msg-delete-btn" onclick="deleteMessage('${msg.timestamp}')">✕ 삭제</button>
                        </div>
                        <p class="msg-text">${safeMsg}</p>
                        <p class="msg-date">${dateStr}</p>
                    `;
                    guestbookMessages.appendChild(card);
                });
            } else {
                guestbookMessages.innerHTML = '<p style="text-align:center; font-size:13px; color:#aaa; padding:20px;">방명록 데이터를 아직 불러올 수 없습니다.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            guestbookMessages.innerHTML = '<p style="text-align:center; font-size:13px; color:#aaa; padding:20px;">* 방명록 실시간 연동 대기 중입니다.</p>';
        });
}

// 1-1) 초기 로딩 시 호출
loadGuestbook();

// 2) 방명록 폼 전송 (POST - 이름, 내용만 전송)
if (guestbookForm) {
    guestbookForm.addEventListener('submit', e => {
        e.preventDefault();

        gbSubmitBtn.innerText = '등록 중...';
        gbSubmitBtn.disabled = true;

        const formData = new FormData(guestbookForm);
        const urlEncodedData = new URLSearchParams(formData).toString();
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncodedData
        })
        .then(response => {
            alert('방명록 메시지가 등록되었습니다. 감사합니다!');
            guestbookForm.reset();
            // 전송 완료 후 방명록 즉시 새로고침
            loadGuestbook();
        })
        .catch(error => {
            alert('등록에 실패했습니다. 인터넷 연결을 확인해 주세요.');
            console.error('Error!', error);
        })
        .finally(() => {
            gbSubmitBtn.innerText = '메시지 남기기';
            gbSubmitBtn.disabled = false;
        });
    });
}

// 3) 팝업 모달 열기/닫기 (참석여부)
if (rsvpBtn && rsvpModal && closeRsvp) {
    rsvpBtn.addEventListener('click', () => {
        rsvpModal.style.display = 'block';
    });
    closeRsvp.addEventListener('click', () => {
        rsvpModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target == rsvpModal) {
            rsvpModal.style.display = 'none';
        }
    });
}

// 4) RSVP 폼 전송 (POST - 구분, 이름, 참석여부, 동행인)
if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
        e.preventDefault();

        submitBtn.innerText = '전송 중...';
        submitBtn.disabled = true;

        const formData = new FormData(rsvpForm);
        const urlEncodedData = new URLSearchParams(formData).toString();
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncodedData
        })
        .then(response => {
            alert('참석 여부가 성공적으로 전달되었습니다. 감사합니다!');
            rsvpModal.style.display = 'none';
            rsvpForm.reset();
        })
        .catch(error => {
            alert('전송에 실패했습니다. 인터넷 연결을 확인해 주세요.');
            console.error('Error!', error);
        })
        .finally(() => {
            submitBtn.innerText = '전송하기';
            submitBtn.disabled = false;
        });
    });
}

// 5) 방명록 삭제 요청 로직
function deleteMessage(timestamp) {
    const pwd = prompt("방명록 작성 시 입력한 숫자 4자리 비밀번호를 입력해주세요.\n(삭제를 원치 않으시면 취소를 눌러주세요.)");
    if (pwd === null) return; // 취소 누름
    if (pwd.trim() === "") {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    if (!confirm("정말 이 메시지를 삭제하시겠습니까?")) return;

    // 삭제 버튼들 비활성화 (다중 클릭 방지)
    const delBtns = document.querySelectorAll('.msg-delete-btn');
    delBtns.forEach(btn => btn.disabled = true);

    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("timestamp", timestamp);
    formData.append("password", pwd);

    const urlEncodedData = new URLSearchParams(formData).toString();

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
    })
    .then(res => res.json())
    .then(data => {
        if (data.result === 'success') {
            alert('메시지가 성공적으로 삭제되었습니다.');
            loadGuestbook(); // 게시판 새로고침
        } else {
            alert(data.message || '비밀번호가 틀렸거나 삭제에 실패했습니다.');
        }
    })
    .catch(err => {
        alert('삭제 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
        console.error(err);
    })
    .finally(() => {
        delBtns.forEach(btn => btn.disabled = false);
    });
}

// 6) 메인 화면 인터랙티브 효과 (하트 내리기)
function createFallingHeart() {
    const container = document.getElementById('falling-hearts-container');
    if (!container) return;

    const heart = document.createElement('div');
    heart.innerHTML = '♥';
    heart.className = 'falling-heart';
    
    // 무작위 위치 및 애니메이션 속성
    const startPos = Math.random() * 100; // 0 ~ 100% 가로 위치
    const duration = Math.random() * 4 + 4; // 4초 ~ 8초 사이로 천천히 떨어짐
    const size = Math.random() * 6 + 10; // 10px ~ 16px 크기
    const opacity = Math.random() * 0.4 + 0.3; // 0.3 ~ 0.7 투명도

    heart.style.left = `${startPos}%`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.fontSize = `${size}px`;
    heart.style.color = `rgba(255, 182, 193, ${opacity})`;

    container.appendChild(heart);

    // 애니메이션이 끝나면 DOM에서 제거
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// 0.8초마다 하트 하나씩 생성
setInterval(createFallingHeart, 800);
