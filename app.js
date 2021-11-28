require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Article = require(__dirname + "/models/article");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_KEY);

//Requests targeting all articles

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            res.send(foundArticles);
        })
    })
    .post(function (req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function (err) {
            if (!err) res.send("Posted succesfully");
            else res.send("Something went wrong " + err + " }), try again");
        });
    })

//Requests targeting a specific article

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        },
            function (err, foundArticle) {
                if (foundArticle) res.send(foundArticle);
                else res.send("No such article (" + req.params.articleTitle + ")");
            })
    })
    .delete(function (req, res) {
        Article.deleteOne({
            title: req.params.articleTitle
        }, function (err) {
            if (!err) res.send("Succesfully deleted article " + req.params.articleTitle);
            else res.send(err);
        })
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
})