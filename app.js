const express = require("express");
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => { //Se apeleaza cand apelam pagina de root "/"
  res.sendFile(__dirname + "/signup.html"); //Serverul transmite catre noi file-ul HTML
});
app.post("/", (req, res) => { //Se apeleaza cand apasam butonul de submit in forma creata
      var firstName = req.body.FirstName;
      var lastName = req.body.LastName;
      var email = req.body.Email;
      console.log(firstName + lastName + email);
      var data = {
        members: [{
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }]
      }

      var jsonData = JSON.stringify(data);
      var url = "https://us17.api.mailchimp.com/3.0/lists/s5c4784eb5e/";
      const options = {
        method: "POST",
        auth: "Constantin:4f923714441696a70ac482e02b0f1de2-us17"
      }
      const request = https.request(url, options, function(response) {
        if(response.statusCode=== 200) {
          res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data) {
          console.log(JSON.parse(data));

        })

       })
      request.write(jsonData);
      request.end();
 });
 app.post("/failure", function(req,res) {
   res.redirect("/");
 });

    app.listen(process.env.port||3000, () => console.log("Server listening on port 3000"));

    //API MailChimp appid
    //4f923714441696a70ac482e02b0f1de2-us17
    //List ID
    //5c4784eb5e
