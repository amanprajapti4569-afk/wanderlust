const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("connected to DB"))
    .catch((err) => console.error(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
    res.send("Hii, I am root");
});

// Index route
app.get(["/listing", "/listings"], async (req, res) => {
    try {
        const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to load listings");
    }
});

// New route
app.get(["/listing/new", "/listings/new"], (req, res) => {
    res.render("listings/new.ejs");
});

// Create route
app.post(["/listing", "/listings"], async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(400).send("Unable to create listing");
    }
});

// Show route
app.get(["/listing/:id", "/listings/:id"], async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error(err);
        res.status(400).send("Invalid listing ID");
    }
});

// Edit route
app.get(["/listing/:id/edit", "/listings/:id/edit"], async (req, res) => {
    try {
        const id = req.params.id.trim();
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send("Invalid listing ID");
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        } 

        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        console.error(err);
        res.status(400).send("Unable to load listing for editing");
    }
});

// Delete route
app.delete(["/listing/:id", "/listings/:id"], async (req, res) => {
    try {
        const id = req.params.id.trim();
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send("Invalid listing ID");
        }

        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).send("Listing not found");
        }

        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(400).send("Unable to delete listing");
    }
});

// Update route
app.post(["/listing/:id/edit", "/listings/:id/edit"], async (req, res) => {
    try {
        const id = req.params.id.trim();
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send("Invalid listing ID");
        }

        await Listing.findByIdAndUpdate(id, req.body.listing, {
            runValidators: true,
        });
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(400).send("Unable to update listing");
    }
});



app.listen(8000, () => {
    console.log("server is listening on port 8000");
});


