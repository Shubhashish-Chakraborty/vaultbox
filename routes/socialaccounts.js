const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');

const { SocialAccountModel, UserModel } = require("../dbSchema")

const { userAuthentication } = require("../middlewares/userAuth");

const socialAccountRouter = Router();

// authenticated endpoint:
socialAccountRouter.post('/add' , userAuthentication , async (req , res) => {
    // INPUT VALIDATION VIA ZOD
    
    const requiredBody = z.object({
        accountName: z.string(),
        description: z.string(),
        password: z.string()
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

    const { accountName , description , password } = parsedDataWithSuccess.data;
    const userId = req.userId;

    const hashedPassword = await bcrypt.hash(password , 5);

    const socialaccount = await SocialAccountModel.create({
        accountName: accountName,
        description: description,
        password: hashedPassword, // Storing the hased password of that account to the database!        
        userId: userId
    })

    res.json({
        message: `${accountName} is saved securely in VALULTBOX!`,
        socialAccountId: socialaccount._id,
    })  
})


socialAccountRouter.post('/search' , userAuthentication , async (req , res) => {

})


module.exports = {
    socialAccountRouter: socialAccountRouter
}