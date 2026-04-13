const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`breakdoomout dev server on http://localhost:${PORT}`);
});
