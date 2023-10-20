const jwt = require("jsonwebtoken") 

const generateTokenAndSetCookie = (userId, res ) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    }) 

    res.cookie("jwt", token , {
        httpOnly: true, // cookie will not be accessible to browser via javascript
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        sameSite: "strict", // cookie will only be sent in a first-party context and not be sent along with requests initiated by third party websites
    }) 

    return token  

}

module.exports = generateTokenAndSetCookie

