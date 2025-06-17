const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchUser')
const { body,validationResult } = require('express-validator');
const Note = require('../models/Note')

//ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes" . Login required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id})
        res.json(notes)
    }catch(error){
        console.log(error.message)
        res.status(500).send("Internal Error Occured")
    }
}) 

//ROUTE 2: Add new notes using: POST "/api/notes/addnotes" . Login required
router.post('/addnotes',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','description have atleast 5 characters').isLength({min:5})
],async(req,res)=>{
    try {
        const {title,description,tag} = req.body
        // If there are errors, send Bad request and errors
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const note = new Note({
            title,description,tag,user: req.user.id 
        })
        const savedNotes = await note.save()
        res.json(savedNotes)
        
    } catch(error){
        console.log(error.message)
        res.status(500).send("Internal Error Occured")
    }
})

//ROUTE 3: Updating an existing note using: PUT "/api/notes/updatenote" . Login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag} = req.body

    try {
        // Create a new note
        const newNote = {};
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
    
        // Find a note to be updated and update it
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
    
        note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
        res.json({note})
        
    } catch(error){
        console.log(error.message)
        res.status(500).send("Internal Error Occured")
    }
})

//ROUTE 4: Deleting an existing note using: DELETE "/api/notes/deletenote" . Login required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
        // Find a note to be deleted and delete it
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }   
    
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been successfully deleted"})
        
    } catch(error){
        console.log(error.message)
        res.status(500).send("Internal Error Occured")
    }
})

module.exports = router