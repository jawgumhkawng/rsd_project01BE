const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");

router.get("/verify", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: res.locals.user.id },
    });

    res.json(user);
});

router.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: {
                    orderBy: { id: "desc" },
                    include: {
                        user: true,
                        likes: true,
                        comments: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
 });

router.post("/users", async (req, res) => {
	const { name, username, bio, password } = req.body;
	if (!name || !username || !password) {
		return res
			.status(400)
			.json({ msg: "name, username and password are required" });
	}

    const hash = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: { name, username, bio, password: hash },
	});

	res.status(201).json(user);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: "username and password are required" });
    }

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return res.status(404).json({ msg: "user not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
        
         res.json({
                     token: jwt.sign(user, process.env.JWT_SECRET),
                     user,
     });
        
    } else {
         res.status(401).json({ msg: "invalid password" });
    }
   
});

module.exports = { usersRouter: router };