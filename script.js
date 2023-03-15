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

        // A function to remove all previous error messages, if present
        function removeErrorMessages(element)
        {
            let label = element.querySelectorAll('label');
            label.forEach(node =>
            {
                let spanError = node.querySelector('.error');
                if (spanError) node.removeChild(spanError);
            });
        }
            
        // Remove all previous error messages, if present
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