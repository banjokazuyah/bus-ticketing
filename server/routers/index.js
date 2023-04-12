
const adminRouter = require("./admin");
const tripRouter = require("./trip");
const locationRouter = require("./location");
const ticketRouter = require("./ticket");

const allRouters = [adminRouter, tripRouter, locationRouter, ticketRouter];

module.exports = allRouters;