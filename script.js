// HEADER JS --- START
document.getElementById("toggle").addEventListener("click", function () {
    document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
});
// HEADER JS --- START
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
function addGroup(group, settings = '#4da4d6')
{
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
    return (tasks.get('settings').has(group) && tasks.get('groups').has(group))? true: 'Le regroupement de tâches n’a pas pu être créé.';
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
function removeGroup(group)
{
    // Remove the concerned group, if present, and update the storage
    if (!tasks.get('groups').has(group)) return 'Le regroupement que vous avez demandé à supprimer n’a pas été trouvé.';
    tasks.get('settings').delete(group);
    tasks.get('groups').delete(group);

    // Return true if the group has been added successfully, otherwise a warning message
    return (!tasks.get('settings').has(group) && !tasks.get('groups').has(group))? true: 'L’application a rencontré un problème et le regroupement de tâches n’a pas pu être correctement supprimé.';
}

// Add task
function addTask(group, task)
{
    // Clean the task by removing all the whitespaces at the start and the end of the string
    task = task.trim();

    // The task must not be empty
    if (!task) return 'La tâche doit comporter au moins un mot.';
    
    // If the group of tasks does not exist yet, create it with the default settings
    if (!tasks.get('groups').has(group))
    {
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
    return (tasks.get('groups').get(group).has(task))? true: 'L’application a rencontré un problème et la tâche n’a pas pu être ajoutée à la liste.';
}

// Remove task
function removeTask(group, task)
{
    // Get the tasks list for the concerned group
    let listedTasks = tasks.get('groups').get(group);

    // Remove the concerned task, if present, and update the storage
    if (!listedTasks.has(task)) return 'La tâche que vous avez demandé à supprimer n’a pas été trouvée dans la liste.';
    listedTasks.delete(task);
    tasks.get('groups').set(group, listedTasks);

    // Return true if the task has been removed successfully, otherwise a warning message
    return (!tasks.get('groups').get(group).has(task))? true: 'L’application a rencontré un problème et la tâche n’a pas pu être supprimée de la liste.';
}

// Checking the contact form
const contact = document.querySelector('.contact');

if (contact)
{
    contact.addEventListener('submit', e =>
    {
        // Just to prevent the form to behave normally when submitted
        e.preventDefault();

        // A function to remove all previous error messages and `aria-invalid="true"` attributes, if present
        function removeErrorMessages(element)
        {
            let label = element.querySelectorAll('label');
            label.forEach(node =>
            {
                let spanError = node.querySelector('.error'),
                    field = node.nextSibling;
                while (field.nodeName === '#text')
                {
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
        aFields.forEach(node =>
        {
            if (!node.value || node.value.match(/^\s+$/m) !== null) emptyFields.set(node, 'Le champ doit être rempli.');
            
            // An e-mail address is of a certain type, so it has to match the regexp
            if (node.type == 'email' && !node.value.match(/^[-_.0-9a-z]+@[-.0-9a-z]+\.[a-z]+$/i)) emptyFields.set(node, 'L’adresse <span lang="en">mail</span> n’est pas correctement renseignée.');
        });

        // At least one field is empty
        if (emptyFields.size > 0)
        {
            for (let [node, errorMessage] of emptyFields)
            {
                let label = node.parentNode.getElementsByTagName('label')[0],
                    span = document.createElement('span');
                    span.className = 'error';
                node.setAttribute('aria-invalid', 'true');
                span.innerHTML = errorMessage;
                label.appendChild(span);
            }
        }

        // All fields are filled
        else
        {
            // Remove all previous error messages, if present
            removeErrorMessages(contact);

            // Confirm the e-mail sending
            console.log('Votre message a été envoyé et sera traité dans les plus brefs délais.');

            // And the great reset of the form (no, this is not a conspiracy theory :-D )
            contact.reset();
        }
    });
}
 

document.onclick = (event) => {
    const rightSection = document.querySelector(".fullPostIt");
    const leftSection = document.querySelector(".postItSection");
    if (window.innerWidth > 600 && (event.target.parentElement.classList.contains("postIt") || event.target.classList.contains("postIt"))) {
        rightSection.classList.add('visible');
        leftSection.classList.add('small');
    }
}

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
