const express = require("express");
const mongoose = require("mongoose");

const app = express()

mongoose.set('strictQuery', true);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.static("public"))


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
};

const articleSchema = { title: { type: String }, content: { type: String } };
const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////////////////////////for many articles/////////////////////////////////////////

app.route("/articles")

    .get((req, res) => {
        Article.find({}, (err, results) => {
            if (!err) {
                res.send(results);
            } else {
                console.log(err);
            };
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Succcess added a new article");
            } else {
                res.send(err);
            };
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully deleted all the articles");
            } else {
                res.send(err);
            };
        });
    });

////////////////////////////////////////////////////////////to handle single article/////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, result) => {
            if (result) {
                res.send(result)
            } else {
                res.send("No articles matching that title was found")
            };
        });
    })

    .put((req, res) => {
        Article.replaceOne({ title: req.params.articleTitle }, req.body, (err) => {
            if (!err) res.send("Successfully updated the article.");
        });
    })

    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, req.body, (err) => {
            if (!err) res.send("Successfully updated the article.");
        });
    })

    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) res.send("Successfully Deleted The article");
        });
    });







app.listen(3000, (req, res) => console.log("Server started at port 3000"));
