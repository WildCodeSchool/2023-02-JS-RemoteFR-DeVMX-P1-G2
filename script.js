
// function to open a post it in full size
// const posts = document.querySelector(".active");

// posts.addEventListener("click", () => {
//     const rightSection = document.querySelector(".fullPostIt");
//     const leftSection = document.querySelector(".postItSection");
//     if (window.innerWidth > 600) {
//         rightSection.classList.add('visible');
//         leftSection.classList.add('small');
//     }
//     else {}
// })


document.onclick = (event) => {
    const rightSection = document.querySelector(".fullPostIt");
    const leftSection = document.querySelector(".postItSection");
    if (window.innerWidth > 600 && event.target.classList.contains("postIt")) {
        rightSection.classList.add('visible');
        leftSection.classList.add('small');
    }
    else {}
}
