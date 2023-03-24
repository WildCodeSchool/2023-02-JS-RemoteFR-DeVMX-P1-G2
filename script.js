// HEADER JS --- START

document.getElementById("toggle").addEventListener("click", function () {
    document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
});

// HEADER JS --- START


// OPEN POST-IT FULL SCREEN MOBILE --- START

// function openPostIt() {
//     const postIt = document.getElementById('postIt active');
//     const application = document.querySelector('.application');
//     if (postIt.style.display === 'block') {
//         postIt.style.display = 'none';
//         application.style = '';
//     } else {
//         postIt.style.display = 'block';
//         application.style.display = 'none';
//     }
// }

// OPEN POST-IT FULL SCREEN MOBILE --- END



// FOOTER JS --- START

function openFormContact() {
    const form = document.getElementById('formContact');
    const application = document.querySelector('.application');
    if (form.style.display === 'block') {
        form.style.display = 'none';
        application.style = '';
    } else {
        form.style.display = 'block';
        application.style.display = 'none';
    }
}

// FOOTER JS --- END


// Tasks storage
const tasks = new Map();
tasks.set('settings', new Map());
tasks.set('groups', new Map());

// Add group
function addGroup(group, settings = '#4da4d6') {
    // Clean the group name by removing all the whitespaces at the start and the end of the string
    group = group.trim();

    // The group name must not be empty
    if (!group) return 'Le regroupement doit comporter au moins un mot.';

    // If the settings are not valid (i.e. a CSS hexadecimal colour code), use the default ones
    if (!settings.match(/#[0-9a-f]{6}/i)) settings = '#4da4d6';

    // Create the group with the settings
    tasks.get('settings').set(group, settings);
    tasks.get('groups').set(group, new Set());

    // Return true if the group has been added successfully, otherwise a warning message
    return (tasks.get('settings').has(group) && tasks.get('groups').has(group)) ? true : 'Le regroupement de tâches n’a pas pu être créé.';
}

// Update group
function updateGroup(group, background)
{
    // Update the settings of the concerned group, if present
    if (!tasks.get('settings').has(group)) return 'Le regroupement que vous avez demandé à mettre à jour n’a pas été trouvé.';
    tasks.get('settings').set(group, background);

    // Return true
    return true;
}

// Remove group
function removeGroup(group) {
    // Remove the concerned group, if present, and update the storage
    if (!tasks.get('groups').has(group)) return 'Le regroupement que vous avez demandé à supprimer n’a pas été trouvé.';
    tasks.get('settings').delete(group);
    tasks.get('groups').delete(group);

    // Return true if the group has been added successfully, otherwise a warning message
    return (!tasks.get('settings').has(group) && !tasks.get('groups').has(group)) ? true : 'L’application a rencontré un problème et le regroupement de tâches n’a pas pu être correctement supprimé.';
}

// Add task
function addTask(group, task) {
    // Clean the task by removing all the whitespaces at the start and the end of the string
    task = task.trim();

    // The task must not be empty
    if (!task) return 'La tâche doit comporter au moins un mot.';

    // If the group of tasks does not exist yet, create it with the default settings
    if (!tasks.get('groups').has(group)) {
        let addedGroup = addGroup(group, '#4da4d6');

        // In case the addition has failed
        if (addedGroup !== true) return addedGroup;
    }

    // Get the tasks list for the concerned group
    let listedTasks = tasks.get('groups').get(group);

    // Add the task, if not present yet, and update the storage
    if (listedTasks.has(task)) return `La tâche figure déjà sur la liste «&nbsp;${group}&nbsp;».`;
    listedTasks.add(task);
    tasks.get('groups').set(group, listedTasks);

    // Return true if the task has been added successfully, otherwise a warning message
    return (tasks.get('groups').get(group).has(task)) ? true : 'L’application a rencontré un problème et la tâche n’a pas pu être ajoutée à la liste.';
}

// Remove task
function removeTask(group, task) {
    // Get the tasks list for the concerned group
    let listedTasks = tasks.get('groups').get(group);

    // Remove the concerned task, if present, and update the storage
    if (!listedTasks.has(task)) return 'La tâche que vous avez demandé à supprimer n’a pas été trouvée dans la liste.';
    listedTasks.delete(task);
    tasks.get('groups').set(group, listedTasks);

    // Return true if the task has been removed successfully, otherwise a warning message
    return (!tasks.get('groups').get(group).has(task)) ? true : 'L’application a rencontré un problème et la tâche n’a pas pu être supprimée de la liste.';
}

// Checking the contact form
const contact = document.querySelector('.contact');

if (contact) {
    contact.addEventListener('submit', e => {
        // Just to prevent the form to behave normally when submitted
        e.preventDefault();

        // A function to remove all previous error messages and `aria-invalid="true"` attributes, if present
        function removeErrorMessages(element) {
            let label = element.querySelectorAll('label');
            label.forEach(node => {
                let spanError = node.querySelector('.error'),
                    field = node.nextSibling;
                while (field.nodeName === '#text') {
                    field = field.nextSibling; // To ensure the sibling in question is really an `input` or `textarea` element, not a text node
                }
                if (spanError) node.removeChild(spanError);
                field.removeAttribute('aria-invalid');
            });
        }

        // Remove all previous error messages and `aria-invalid="true"` attributes, if present
        removeErrorMessages(contact);

        // Let’s check the fields to see if at least one is empty (to fill with spaces only is not to fill)
        let aFields = contact.querySelectorAll('[required]'),
            emptyFields = new Map();
        aFields.forEach(node => {
            if (!node.value || node.value.match(/^\s+$/m) !== null) emptyFields.set(node, 'Le champ doit être rempli.');

            // An e-mail address is of a certain type, so it has to match the regexp
            if (node.type == 'email' && !node.value.match(/^[-_.0-9a-z]+@[-.0-9a-z]+\.[a-z]+$/i)) emptyFields.set(node, 'L’adresse <span lang="fr">mail</span> n’est pas correctement renseignée.');
        });

        // At least one field is empty
        if (emptyFields.size > 0) {
            for (let [node, errorMessage] of emptyFields) {
                let label = node.parentNode.getElementsByTagName('label')[0],
                    span = document.createElement('span');
                span.className = 'error';
                node.setAttribute('aria-invalid', 'true');
                span.innerHTML = errorMessage;
                label.appendChild(span);
            }
        }

        // All fields are filled
        else {
            // Remove all previous error messages, if present
            removeErrorMessages(contact);

            // Confirm the e-mail sending
            console.log('Votre message a été envoyé et sera traité dans les plus brefs délais.');

            // And the great reset of the form (no, this is not a conspiracy theory :-D )
            contact.reset();
        }
    });
}
 
// click on a post it to display it at the right on full size
const existingPosts = document.querySelectorAll(".active");
const rightSection = document.querySelector(".fullPostIt");
const leftSection = document.querySelector(".postItSection");

for (let i=0; i < existingPosts.length; i++) {
    existingPosts[i].onclick = (event) => {
        if (window.innerWidth > 600) {// && (event.target.parentElement.classList.contains("postIt") || event.target.classList.contains("postIt"))) {
            rightSection.classList.add('visible');
            leftSection.classList.add('small');
        }
        else {}
}}

// close post it
const closePostIt = document.querySelector(".closePostIt");
closePostIt.onclick = () => {
    rightSection.classList.toggle('visible');
    leftSection.classList.remove('small');
}

// adding a task inside the post it
let addTaskBtn = document.querySelector(".addTaskBtn");
const newTask = document.querySelector("#myInput");

newTask.addEventListener("keydown", (e) => {
     if (e.key === "Enter") {
        e.preventDefault();
        addTaskBtn.click();
    }
});

//const taskForm = document.querySelector("#taskForm");
// addTaskBtn.onclick = (e) => {
//     e.preventDefault();
//     if (newTask.value) {
//         const text = <li class="item">
//             <i class="co fa fa-circle-thin" job="complete"></i>
//             <p class="text"> ${toDo}</p>
//             <i class="de fa fa-trash-o" job="delete"></i>
//         </li>
//         const position = "beforeend";
//         list.insertAdjacentHTML(position, text);
//     }
// }
addTaskBtn.onclick = (e) => {
    e.preventDefault();
    if (newTask.value) {
        const taskList = document.querySelector(".taskList")
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "checkbox";
        const label = document.createElement("label");
        label.classList.add("task");
        label.innerHTML = newTask.value;
        input.appendChild(label);
        li.appendChild(input);
        taskList.appendChild(li);
        list.insertAdjacentHTML("beforeend", li);
        newTask.value = "";
    }
}

// Create a "close" button and append it to each list item
let li = document.getElementsByTagName("li");
for (let i = 0; i < li.length; i++) {
  let closeTask = document.createElement("button");
  let txt = document.createTextNode("\u00D7");
  closeTask.className = "close";
  closeTask.appendChild(txt);
  li[i].appendChild(closeTask);
}

// Click on a close button to hide the current list item
const close = document.getElementsByClassName("close");
for (let i = 0; i < close.length; i++) {
  close[i].onclick = () => {
    close[i].parentElement.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
const checkBox = document.querySelector("input[type='checkbox']");
for (let i = 0; i < checkBox.length; i++) {
    checkBox[i].addEventListener('click', (e) => {
        checkBox[i].classList.toggle('checked');//e.target.classList.toggle('checked');
})}

// ----- OPEN POST-IT --- END

// Colour picker buttons
const colourPickerButtons = document.querySelectorAll('#colour-picker-buttons button');
for (let button of colourPickerButtons)
{
    // On click, change the post-it colour
    button.addEventListener('click', () =>
    {
        const colour = button.dataset.color,
            activePostIt = document.querySelectorAll('.postIt.active, .fullPostIt'),
            activePostItTitle = document.querySelector('.postIt.active h1').innerText;
        for (let postIt of activePostIt)
        {
            postIt.dataset.color = colour;
            postIt.style.background = postIt.dataset.color;
            updateGroup(activePostItTitle, postIt.dataset.color);
        }
    });
}

// Add post-it
const addPostItButton = document.querySelector('.postItSection .btnAddTask');
// On click, add the post-it
addPostItButton.addEventListener('click', () =>
{
    const fullPostIt = document.querySelector('.fullPostIt');

    // remove the active class from any oth post-it
    const activePostIt = document.querySelectorAll('.postIt.active');
    for (let active of activePostIt)
    {
        active.classList.remove('active');
    }

    // Add the new post-it to the section showing the post-it blocks
    const postItSection = document.querySelector('.postItSection'),
        newPostIt = document.createElement('div');
    newPostIt.classList.add('postIt', 'active');
    newPostIt.innerHTML = `<h1>Nouveau post-it</h1>`;
    postItSection.appendChild(newPostIt);

    // Make the full post-it visible
    fullPostIt.classList.add('visible');
    document.querySelector('.postItSection').classList.add('small');
});

// Delete post-it
const deletePostItButton = document.querySelector('.fullPostIt .btn-garbage');
// On click, delete the post-it
deletePostItButton.addEventListener('click', () =>
{
    const activePostIt = document.querySelector('.postIt.active'),
        fullPostIt = document.querySelector('.fullPostIt'),
        activePostItTitle = activePostIt.querySelector('h1').innerText;
    removeGroup(activePostItTitle);

    // Remove the active post-it from the list and make the full post-it invisible
    activePostIt.remove();
    fullPostIt.classList.remove('visible');
    document.querySelector('.postItSection').classList.remove('small');
});
