const saveButton = document.querySelector('#btnSave');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const notesContainer = document.querySelector('#notes_container')
const deleteButton = document.querySelector('#btnDelete')

function clearForm(){
    titleInput.value = '';
    descriptionInput.value = '';
    deleteButton.classList.remove('hidden');
}

function displayNotesInForm(note){
    titleInput.value = note.title;
    descriptionInput.value = note.description;
    deleteButton.classList.remove('hidden');
    deleteButton.setAttribute('data-id' , note.id);
    saveButton.setAttribute('data-id' , note.id);
}

function getNoteByid(id){
    fetch(`https://localhost:7108/api/Notes/Get/${id}`)
    .then(data => data.json())
    .then(response => displayNotesInForm(response))
}

function populateForm(id){
    getNoteByid(id);
}

function addNote(title, description) {

    const body = {
        title: title,
        description: description,
        isVisible: true
    }
    const option = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }
    fetch('https://localhost:7108/api/Notes/CreateNote', option)
        .then(data => data.json())
        .then(response => {
            clearForm();
            getAllNotes();
        });
}

function displayNotes(notes){

    let allNotes = '';

    notes.forEach(note => {
        const noteElement =`
                            <div class="note" data-id="${note.id}">
                                <h3>${note.title}</h3>
                                <p>${note.description}</P>
                            </div>
                            `;
        allNotes += noteElement;
    });
    notesContainer.innerHTML = allNotes;


    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('click' , function (){
            populateForm(note.dataset.id);
        });
    })
}

function getAllNotes(){
    fetch('https://localhost:7108/api/Notes/GetAll')
    .then(data => data.json())
    .then(response => displayNotes(response))
}

getAllNotes();

function updateNote(id , title , description){
    const body = {
        title: title,
        description: description,
        isVisible: true
    }

    fetch(`https://localhost:7108/api/Notes/Update/${id}` , {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        getAllNotes();
    });
}

saveButton.addEventListener('click', function () {
    const id = saveButton.dataset.id;
    if (id) {
        updateNote(id , titleInput.value , descriptionInput.value)
    }
    else{
        addNote(titleInput.value, descriptionInput.value);
    }
});

function deleteNote(id){
    fetch(`https://localhost:7108/api/Notes/Delete/${id}` , {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => {
        clearForm();
        getAllNotes();
    });
}

deleteButton.addEventListener('click' , function(){
    const id = deleteButton.dataset.id;
    deleteNote(id);
})