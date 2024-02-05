const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); // Import the Sequelize instance

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Ensure sequelize is synchronized with the database before starting the server
sequelize.sync({ force: false }) // Set force to false to avoid dropping existing tables
  .then(() => {
    // Start the server after successful synchronization
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });
