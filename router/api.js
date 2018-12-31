const express = require("express");
const router = express.Router();
const crypto = require("crypto");

router.get("/docs", function(req, res) { 
    res.render("docs.ejs");
})
    .get("/codes/:id", function(req, res) {
        let code = req.client.server.codes.get(req.params.id);
        if(!code) return res.status(404).json({ error: "This code isn't created!" });
        res.status(200).json({
            name: req.params.id,
            code: code.code,
            createdAt: code.createdAt,
            lastEditedAt: code.lastEditedAt
        });
    })
        .post("/codes", async function(req, res) {
            if(!req.body.code) return res.send("You must include a script to save!");
            let codeName = await crypto.randomBytes(16).toString("hex");

            await req.client.server.codes.set(codeName, {
                code: req.body.code,
                createdAt: Date.now(),
                lastEditedAt: Date.now()
            });
            await res.status(200).redirect(`/codes/${codeName}`);
        })
            .put("/codes/:id", async function(req, res) {
                let code = req.client.server.codes.get(req.params.id);
                if(!code) return res.status(404).json({ error: "This code isn't created!" });
                if(!req.body.code) return res.status(400).json({ error: "\"code\" is missing!" });
        
                await req.client.server.codes.set(req.params.id, {
                    code: req.body.code,
                    createdAt: code.createdAt,
                    lastEditedAt: Date.now()
                });
                await res.status(200).json({ message: "Code successfully edited!" });
            });

module.exports = router;
