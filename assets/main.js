// Pipeline Animation
function runPipeline() {
    const pulse = document.querySelector('.playground-pulse');
    pulse.style.width = '0%';
    setTimeout(() => { pulse.style.width = '100%'; }, 100);
}

// Contact Form Logic
function showNextStage(stageId) {
    document.querySelectorAll('.contact-form-stage').forEach(s => s.classList.remove('active'));
    document.getElementById(stageId).classList.add('active');
}
