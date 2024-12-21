const { z } = require('zod');
const bcrypt = require('bcrypt');

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


module.exports = {
    userRouter: userRouter
}