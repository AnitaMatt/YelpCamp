const mongoose = require("mongoose");
const cities = require('./cities')
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground")

//mongoose.connect('mongodb://localhost:27017/yelp-camp');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "6362456ef98b578bb13c6072",
            location: `${cities[random1000].city.replace("'","")}, ${cities[random1000].state.replace("'","")}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:
            {
                type: 'Point',
                coordinates: [
                    +`${cities[random1000].longitude}`,
                    +`${cities[random1000].latitude}`
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqmkqy0rj/image/upload/v1668608960/Yelpcamp/kljhuqp3bfpfj1fp6pgo.avif',
                },
                {
                    url: 'https://res.cloudinary.com/dqmkqy0rj/image/upload/v1668608960/Yelpcamp/txmafprxkxrqrcthpuhw.avif',
                    filename: 'Yelpcamp/mkw06bzhoq83qque44ky',
                }

            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore beatae at, illo amet exercitationem similique, expedita aut fuga voluptatibus eum perspiciatis maiores nobis eius modi possimus officia pariatur nisi consequuntur?',
            price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})