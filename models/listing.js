const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/036/184/847/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
  },
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;