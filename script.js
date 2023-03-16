// HEADER JS --- START
document.getElementById("toggle").addEventListener("click", function () {
    document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
});
// HEADER JS --- START
// FOOTER JS --- START
function openFormContact() {
    const form = document.getElementById('formContact');
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
}

// FOOTER JS --- END
