const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const client = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

client.setConfig({apiKey: process.env.API_key,  server: process.env.API_server,});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fNames;
  const lastName = req.body.lName;
  const email = req.body.email;

  const subscribingUser = {firstName: firstName, lastName: lastName, email: email};

  const run = async () => {
    try {
      const response = await client.lists.addListMember("9a0d580c71", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };

  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
