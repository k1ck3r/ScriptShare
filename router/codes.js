const express = require("express");
const router = express.Router();
const crypto = require("crypto");

router.get("/:id", function(req, res) {
    if(!req.client.server.codes.get(req.params.id)) return res.redirect("/"); 
    res.render("codes.ejs", {
        codeObject: req.client.server.codes.get(req.params.id),
        codeName: req.params.id
    });
})
    .post("/:id", async function(req, res) {
        let code = req.client.server.codes.get(req.params.id);
        if(!req.body.code) return res.send("You must include a script to save!");
        if(!code) return res.redirect("/"); 

        await req.client.server.codes.set(req.params.id, {
            code: req.body.code,
            createdAt: code.createdAt,
            lastEditedAt: Date.now()
        });
        await res.redirect(`/codes/${req.params.id}`);
    });

module.exports = router;