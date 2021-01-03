const fs = require('fs')
const chalk = require('chalk')

const getNote = (title) => {
    const notes = loadNotes()
    const requestedNote = notes.find(note => note.title === title)

    requestedNote 
        ? console.log(chalk.inverse(requestedNote.title), requestedNote.body)
        : console.log(chalk.red('Note not found'))
}

const listNotes = () => {
    const notes = loadNotes()

    console.log(chalk.green.inverse('Your notes:'))
    notes.map(note => console.log(chalk.inverse(note.title), note.body))
}

const addNotes = (title, body) => {
    const notes = loadNotes()
    const duplicateNote = notes.find(note => note.title === title)

    if(duplicateNote) {
        console.log(chalk.red.inverse('Duplicate note'))
        return
    }

    notes.push({
        title: title,
        body: body
    })
    
    saveNotes(notes)
    console.log(chalk.green.inverse('Note added'))
}

const updateNote = (title, body) => {
    const notes = loadNotes()
    const noteToBeUpdated = notes.find(note => note.title === title)

    if(!noteToBeUpdated) {
        console.log(chalk.red.inverse('Invalid note. Create it first.'))
        return
    }

    noteToBeUpdated.body = body
    
    saveNotes(notes)
    console.log(chalk.green.inverse('Note updated'))
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (error) {
        return []
    }
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

const removeNotes = (title) => {
    const notes = loadNotes()
    const updatedNotes = notes.filter(note => note.title !== title)

    if(notes.length !== updatedNotes.length) {
        saveNotes(updatedNotes)
        console.log(chalk.green.inverse('Note removed'))
    } else {
        console.log(chalk.red.inverse('Note not found'))
    }
}

module.exports = {
    listNotes,
    getNote,
    addNotes,
    updateNote,
    removeNotes
}