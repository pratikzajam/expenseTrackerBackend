import bcrypt from "bcrypt";

export async function Auth(req, res, next) {
    try {
        let { email, password, confirmPassword } = req.body;

      
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required!",
                data: null,
            });
        }

        email = email?.trim();
        password = password?.trim();
        confirmPassword = confirmPassword?.trim();
 
     
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "error",
                message: "Password and ConfirmPassword do not match",
                data: null,
            });
        }

        let saltRounds = 10; 

      
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        req.body.password = hashedPassword;

        next(); 

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Something went wrong. Contact admin!!!",
            data: null,
        });
    }
}
