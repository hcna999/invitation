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

// 6. RSVP Form Handling
const rsvpBtn = document.getElementById('rsvp-btn');
const rsvpModal = document.getElementById('rsvp-modal');
const closeRsvp = document.querySelector('.close-rsvp');
const rsvpForm = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');

// 구글 스프레드시트 앱스 스크립트 Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2V1zOyrmfbfAxZxGuOdhsGT7H8YRkGAltT6lhhQ6CxbUVZvE1AhFyCffFYyEz0ag/exec"; 

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

if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
        e.preventDefault();
        
        if (!GOOGLE_SCRIPT_URL) {
            alert('아직 구글 스프레드시트가 연결되지 않았습니다!\n(스크립트 URL 입력이 필요합니다)');
            return;
        }

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
            alert('소중한 마음이 잘 전달되었습니다. 감사합니다!');
            rsvpModal.style.display = 'none';
            rsvpForm.reset();
        })
        .catch(error => {
            alert('전송에 실패했습니다. (설정 또는 네트워크 오류)');
            console.error('Error!', error);
        })
        .finally(() => {
            submitBtn.innerText = '전송하기';
            submitBtn.disabled = false;
        });
    });
}
