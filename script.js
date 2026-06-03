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

    // 2. Gallery Modal Slider
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const closeModal = document.querySelector(".close-modal");
    
    let currentIndex = 0;

    function showImage(index, direction = 'next') {
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentIndex = index;
        
        // 드래그로 변경된 인라인 스타일 초기화
        modalImg.style.transform = '';
        modalImg.style.transition = '';
        
        // 애니메이션 초기화 후 재시작 (Reflow 트릭)
        modalImg.classList.remove('slide-in-right', 'slide-in-left');
        void modalImg.offsetWidth;
        
        // 스와이프 방향에 따른 애니메이션 클래스 추가
        if (direction === 'next') {
            modalImg.classList.add('slide-in-right');
        } else {
            modalImg.classList.add('slide-in-left');
        }

        modalImg.src = galleryItems[currentIndex].src;
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", function() {
            modal.style.display = "block";
            showImage(index, 'next');
        });
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Touch events for swiping (Interactive Slide)
    let touchStartX = 0;
    let isDragging = false;

    modalImg.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        isDragging = true;
        modalImg.style.transition = 'none'; // 드래그 중 부드러운 움직임을 위해 트랜지션 끄기
        modalImg.classList.remove('slide-in-right', 'slide-in-left'); // 기존 애니메이션 해제
    });

    modalImg.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const currentX = e.changedTouches[0].screenX;
        const deltaX = currentX - touchStartX;
        modalImg.style.transform = `translateX(${deltaX}px)`; // 손가락 따라 사진 이동
    });

    modalImg.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        
        const touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;
        const swipeThreshold = 50; // 이만큼 움직여야 넘어감
        
        if (deltaX < -swipeThreshold) {
            // 왼쪽으로 스와이프 (다음 사진)
            showImage(currentIndex + 1, 'next');
        } else if (deltaX > swipeThreshold) {
            // 오른쪽으로 스와이프 (이전 사진)
            showImage(currentIndex - 1, 'prev');
        } else {
            // 원위치 복귀 (조금만 움직였을 때)
            modalImg.style.transition = 'transform 0.3s ease-out';
            modalImg.style.transform = 'translateX(0)';
        }
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
