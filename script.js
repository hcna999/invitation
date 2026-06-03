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
