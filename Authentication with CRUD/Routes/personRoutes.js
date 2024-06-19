const express = require('express');
const router = express.Router();
const Person = require('./../models/person');

const { jwtAuthMiddleware, generateToken } = require('./../jwt');
router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log('data saved');
        const payload = {
            id: response.id,
            username: response.username
        }
        const token = generateToken(payload);
        console.log("Token is:", token);
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log({ username: username });
        const user = await Person.findOne({ username: username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        console.log("User Data", userData);
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(500).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const updatedPersonData = req.body;
        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runvalidators: true
        })
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log('Data Updated');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log('Data Deleted');
        res.status(200).json({ message: 'Person Data deleted Successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;