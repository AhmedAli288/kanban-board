const express = require("express")
const router = express.Router()
const {Tasks, Lists} = require("../models/kanbanModels")

// TASKS APIs
// GET Requests
router.get('/gettasks', async (req, res) => {
    try{
        const tasks = await Tasks.find({})
        res.status(200).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
});

router.get('/gettask/:id', async (req, res) => {
    try{
        const _id = req.params.id
        const task = await Tasks.findById({_id:_id})
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
});


// POST Requests
router.post('/createtask', async(req, res) => {
    try{
        const addTask = new Tasks(req.body)
        const insertTask = await addTask.save()
        const list = await Lists.findOne({ name: req.body.status })
        list.items.push(insertTask._id)
        await list.save()
        res.status(201).send(insertTask)
    }catch(e){
        res.status(400).send(e)
    }
});


// PATCH Requests
router.patch('/updatetask/:id', async (req, res) => {
    try{
        const _id = req.params.id
        const updateTask = await Tasks.findByIdAndUpdate(_id, req.body)
        res.status(200).send(`${updateTask}`)
    }catch(e){
        res.status(400).send(e)
    }
});

// Delete Requests
router.delete('/deletetask/:id', async (req, res) => {
    try{
        const _id = req.params.id

        await Tasks.findByIdAndDelete(_id)

        res.status(200).send("Task Deleted Successfully")
        
    }catch(e){
        res.status(500).send(e)
    }
})



// LIST APIs
// GET Requests
router.get('/getlists', async (req, res) => {
    try{
        const lists = await Lists.find({}).populate("items")
        res.status(200).send(lists)
    }catch(e){
        res.status(400).send(e)
    }
});

router.get('/getlist/:id', async (req, res) => {
    try{
        const _id = req.params.id
        const list = await Lists.findById({_id:_id})
        res.status(200).send(list)
    }catch(e){
        res.status(400).send(e)
    }
});


// POST Requests
router.post('/createlist', async(req, res) => {
    try{
        const addList = new Lists(req.body)
        const insertList = await addList.save()
        res.status(201).send(insertList)
    }catch(e){
        res.status(400).send(e)
    }
});


// PATCH Requests
router.patch('/updatelists/:idOne/:idTwo', async (req, res) => {
    try{

        const { idOne, idTwo } = req.params
        const { colOne, colTwo } = req.body
        const listOne = await Lists.findById(idOne)
        const listTwo = await Lists.findById(idTwo)
        listOne.items = colOne
        listTwo.items = colTwo
        await listOne.save()
        await listTwo.save()

        res.status(200).send("Successfully updated lists")

    }catch(e){

        res.status(400).send(e)

    }
});

router.patch('/updatelist/:id', async (req, res) => {
    try{

        const _id = req.params.id
        const list = await Lists.findByIdAndUpdate(_id, req.body)

        res.status(200).send(list)
    
    }catch(e){
    
        res.status(400).send(e)
    
    }
});

router.patch('/editlist/:id', async(req, res)=>{
    try{

        const _id = req.params.id
        const {name} = req.body

        const body = {
            name: name,
            statuses: [name]
        }

        const list = await Lists.findById(_id)
        const oldName = list.name
        await Lists.findByIdAndUpdate(_id, body)
        const task = await Tasks.updateMany({ status: oldName }, { $set: { status:name }})

        res.status(200).send(task)

    }catch(e){

        res.status(400).send(`err res: ${e}`)
    
    }
})

// Delete Requests
router.delete('/deletelist/:id', async (req, res) => {
    try{
        const _id = req.params.id

        const list = await Lists.findById(_id)

        // console.log("list.statuses[0]", list.statuses[0])

        await Lists.findByIdAndDelete(_id)
        Tasks.remove({"status": list.statuses[0]}, (err, json)=>{
            if(err){
                console.log("err", err);
            }
        })

        res.status(200).send("List deleted Successfully")
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router;