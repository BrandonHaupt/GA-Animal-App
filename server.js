/////////////////////////////////////////
//         IMPORTANT STUFF             //
/////////////////////////////////////////
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const PORT = process.env.PORT // ALlows us to hide and use are port
const mongoose = require('mongoose') // Allows us to use Mongoose
const app = express()


/////////////////////////////////////////
//             MIDDLEWARE              //
/////////////////////////////////////////
app.use(morgan('tiny')) // Logging errors and stuff
app.use(methodOverride('_method')) // Allows us to use DELETE and other methods
app.use(express.urlencoded({extended: true})) // Allows us to grab and use form data
app.use('/static', express.static('public')) // Allows the use for css


/////////////////////////////////////////
//               ROUTES                //
/////////////////////////////////////////
app.get('/', (req,res) => {
    res.send('Your server is running!')
})


/////////////////
//    SEED    //
////////////////
app.get('/animals/seed', (req,res) => {

    // DEFINE DATA WE WANT TO PUT IN THE DATABASE
    const startingAnimals = [
        {species: "Aardwolf", extinct: false, location: "Savannas and Grasslands", lifeExpectancy: 15},
        {species: "Danios", extinct: false, location: "Streams and Ponds", lifeExpectancy: 5},
        {species: "Mammoth", extinct: true, location: "Tundra", lifeExpectancy: 35},
        {species: "Fruit Bat", extinct: false, location: "Forest and Savannas", lifeExpectancy: 30},
        {species: "Frog", extinct: false, location: "Rainforest and swampland", lifeExpectancy: 8},
    ]

    // DELETES ALL ANIMALS
    Animal.deleteMany({}, (err, data) => {
        // SEED STARTER ANIMALS
        Animal.create(startingAnimals, (err, data) => {
            // send created animals as reponse to confirm creation
            res.json(data)
        })
    })
})




//////////////////
//    INDEX    //
/////////////////
app.get('/animals', (req,res) => {
    // Get all animals from  mongo and sends them back
    Animal.find({}, (err,animals) => {
        res.render("animals/index.ejs", {animals})
    })
})





////////////////
//    NEW    //
///////////////
app.get('/animals/new', (req,res) => {
    res.render('animals/new.ejs')
})




///////////////////
//    CREATE    //
//////////////////
app.post("/animals", (req,res) => {
    const body = req.body
    // Checks if the extinct property should be true or false
    body.extinct = body.extinct === "on" ? true : false

    // Create the new animals
    Animal.create(body, (err, animal) => {
        // redirects the user back to the main animals page after creation
        res.redirect('/animals')
    })
})




//////////////////
//    EDIT     //
/////////////////
app.get('/animals/:id/edit' ,(req,res) => {
    // gets the id from params
    const id = req.params.id
    
    // get the animal from the database
    Animal.findById(id, (err, animal) => {
        // Renders the templatte and send it to animal
        res.render('animals/edit.ejs', {animal})
    })
})


///////////////////
//    UPDATE    //
//////////////////
app.put('/animals/:id', (req,res) => {

    // Get the ID from params
    const id = req.params.id
    const body = req.body

    //checks if the 
    body.extinct = body.extinct === "on" ? true : false

    //update the animal
    Animal.findByIdAndUpdate(id, body, {new: true}, (err, animal)=> {
        res.redirect('/animals')
    })
})



///////////////////
//    DELETE    //
//////////////////
app.delete('/animals/:id', (req,res) => {
    const id = req.params.id

    Animal.findByIdAndDelete(id, (err, animal) => {
        res.redirect('/animals')
    })
})







/////////////////
//    SHOW    //
////////////////
//***** KEEP THIS AT BOTTOM *****
app.get('/animals/:id', (req, res) => {

    // get the id from Params
    const id = req.params.id

    // Find the particulkar animal from the database
    Animal.findById(id, (err, animal) => {
        // render the template with the data from the database
        res.render("animals/show.ejs", {animal})
    })
})



/////////////////////////////////////////
//         DATABASE CONNECTION         //
/////////////////////////////////////////

const DATABASE_URL = process.env.DATABASE_URL // Allows us to hide and use our database
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


// ESTABLISH OUR CONNECTION
mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', ()=> console.log('Disconnected from Mongoose'))
    .on('error', (error) => console.log(error))




/////////////////////////////////////////
//         ANIMAL MODELS               //
/////////////////////////////////////////

const {Schema, model} = mongoose // Destructuring, grabbing model and schema off mongoose variable
// Like saying
// mongoose.Schema
// mongoose.model


// How our data will need to look when putting it into the database, it wont accept anything else unless we change it here.
const animalsSchema = new Schema({
    species: String,
    location: String,
    lifeExpectancy: Number,
    extinct: Boolean
})

const Animal = model('animal', animalsSchema)






/////////////////////////////////////////
//          PORT LISTENER              //
/////////////////////////////////////////
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})