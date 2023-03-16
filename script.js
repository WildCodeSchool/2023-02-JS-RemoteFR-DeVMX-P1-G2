
document.onclick = (event) => {
    const rightSection = document.querySelector(".fullPostIt");
    const leftSection = document.querySelector(".postItSection");
    if (window.innerWidth > 600 && (event.target.parentElement.classList.contains("postIt") || event.target.classList.contains("postIt"))) {
        rightSection.classList.add('visible');
        leftSection.classList.add('small');
    }
}
