const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Router } = require('express');

const { UserModel } = require('../dbSchema');

const userRouter = Router();


userRouter.post('/signup' , async (req , res) => {
    // INPUT VALIDATION VIA ZOD
    
    const requiredBody = z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        email: z.string().email(),
        phoneNumber: z.number(),
        username: z.string().min(3).max(20),
        password: z.string().min(6)
    })

    // parse the req.body

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        res.status(400).json({
            message: "Invaid Format Data Given",
            errors: parsedDataWithSuccess.error.issues
        })
        return
    }


    // UPTILL here input validation is done

    const { firstName , lastName , email , phoneNumber , username , password } = parsedDataWithSuccess.data;

    let errorFound = false;
    try {
        // password hashing!

        const hashedPassword = await bcrypt.hash(password , 10);

        await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: hashedPassword
        });
    } catch(e) {
        res.status(400).json({
            message: `${username} Already Registered to our database!`
        })
        errorFound = true;
    }

    if (!errorFound) {
        res.json({
            message: `${username} Successfully SignedUP to VaultBox`
        })
    }
})

userRouter.post('/signin' , async (req , res) => {
    // INPUT VALIDATION VIA ZOD
    
    const requiredBody = z.object({
        username: z.string().min(3).max(20),
        password: z.string().min(6)
    })

    // parse the req.body

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        res.status(400).json({
            message: "Invaid Format Data Given",
            errors: parsedDataWithSuccess.error.issues
        })
        return
    }


    // UPTILL here input validation is done

    const { username , password } = parsedDataWithSuccess.data;

    // CHECKING WHETHER THE USER EXITS IN THE DATABASE OR NOT!

    const user = await UserModel.findOne({
        username: username
    })

    if (!user) {
        res.status(401).json({
            message: `${username} Does Not Exists in the Database!`
        })
        return
    }

    // CHECK THE CREDENTIALS ARE CORRECT!

    const decryptedPassoword = await bcrypt.compare(password , user.password);

    if (!decryptedPassoword) {
        res.status(403).json({
            message: "User not Found, Incorrect Credentials!"
        })
    }
    else { // JWT token Assignment
        const token = jwt.sign({
            id: user._id
        } , process.env.JWT_USER_SECRET);

        res.json({
            message: `${user.firstName} ${user.lastName} Successfully LoggedIN to vaultbox!!`,
            email: user.email,
            token: token
        })
    }
})


module.exports = {
    userRouter: userRouter
}