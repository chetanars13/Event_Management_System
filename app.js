const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const path = require("path");

// Routes
const eventRoutes = require("./routes/events");
const attendeeRoutes = require("./routes/attendees");
const taskRoutes = require("./routes/tasks");
const engine = require("ejs-mate");

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/event-management"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
// Set up ejs-mate as the engine for EJS
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes
app.use("/events", eventRoutes);
app.use("/attendees", attendeeRoutes);
app.use("/tasks", taskRoutes);

// Home route
app.get("/", (req, res) => {
  res.redirect("/tasks");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/error-test", (req, res, next) => {
  const err = new Error("Test error");
  err.status = 500;
  next(err);
});

// Test 404 Error
app.get("/test-404", (req, res) => {
  res
    .status(404)
    .render("error", { message: "Page not found", error: { status: 404 } });
});

// Test 500 Error
app.get("/test-500", (req, res) => {
  throw new Error("Test internal server error");
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error", { message: err.message, error: err });
});

module.exports = app;
