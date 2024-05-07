#! /usr/bin/env node
require("dotenv").config();

console.log(
  "This script populates teas and tea types to your database. Run this script by typing: node populatedb"
);

const Tea = require("./models/tea");
const TeaType = require("./models/teaType");

const teas = [];
const teaTypes = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createTypes();
  await createTeas();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function teaCreate(index, name, category, price, quantity, desc) {
  const teadetail = {
    name: name,
    category: category,
    price: price,
    quantity: quantity,
  };
  if (desc != false) teadetail.description = desc;
  const tea = new Tea(teadetail);
  await tea.save();
  teas[index] = tea;
  console.log(`Added tea: ${name}`);
}

async function typeCreate(index, name, desc) {
  const type = new TeaType({ name: name, description: desc });
  await type.save();
  teaTypes[index] = type;
  console.log(`Added type: ${name}`);
}

async function createTypes() {
  console.log("Adding types");
  await Promise.all([
    typeCreate(
      0,
      "Black tea",
      "Black tea is generally stronger in flavour than other teas."
    ),
    typeCreate(
      1,
      "Green tea",
      "Green tea is a type of tea that is made from Camellia sinensis leaves and buds that have not undergone the same withering and oxidation process"
    ),
    typeCreate(
      2,
      "White tea",
      "White tea may refer to one of several styles of tea which generally feature young or minimally processed leaves of the Camellia sinensis plant."
    ),
  ]);
}

async function createTeas() {
  console.log("Adding Teas");
  await Promise.all([
    teaCreate(
      0,
      "Assam",
      teaTypes[0],
      2,
      20,
      "Assam tea has a deep, rich, full-bodied flavor with malty, earthy, and spicy notes."
    ),
    teaCreate(1, "Ceylon", teaTypes[0], 3, 10, false),
    teaCreate(
      2,
      "Darjeeling",
      teaTypes[0],
      4.5,
      11,
      "Darjeeling tea is a type of black tea produced in India. Darjeeling tea has a fruity aroma and a golden or bronze color, depending on the way it's brewed"
    ),
    teaCreate(3, "Lapsang", teaTypes[0], 5, 14, false),
    teaCreate(
      4,
      "Sencha",
      teaTypes[1],
      7,
      40,
      "Sencha is a type of Japanese ryokucha which is prepared by infusing the processed whole tea leaves in hot water"
    ),
    teaCreate(
      5,
      "Bancha",
      teaTypes[1],
      5,
      30,
      "It has a lower caffeine content and a less grassy flavor than sencha"
    ),
    teaCreate(6, "Gunpowder", teaTypes[1], 3, 100, false),
    teaCreate(
      7,
      "Kukicha",
      teaTypes[1],
      5,
      20,
      "Kukicha green tea, also known as “twig tea” or “bōcha,” is a type of Japanese green tea that is made primarily from the stems"
    ),
    teaCreate(
      8,
      "White Peony",
      teaTypes[2],
      8,
      40,
      "White Peony, also known by the traditional name Bai Mu Dan, is a popular style of white tea made of young tea leaves"
    ),
    teaCreate(
      9,
      "Silver needle",
      teaTypes[2],
      14,
      10,
      "Silver Needle tea is the most expensive variety of white tea since it's only made using top buds that have yet to fully open"
    ),
  ]);
}
