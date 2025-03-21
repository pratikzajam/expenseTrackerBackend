import { User } from "../models/userModel.js";
import { Otp } from '../models/otpModel.js'
import nodemailer from 'nodemailer'
import randomInteger from 'random-int';
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
  try {
    let { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required!",
        data: null,
      });
    }


    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already registered!",
        data: null,
      });
    }


    let userData = await User.create({
      email: email,
      password: password,
      isVerified: false
    });

    if (userData) {

      sendOtp(email)

      return res.status(201).json({
        status: "success",
        message: "OTP has been sent for verification to your email!",
        data: {
          id: userData._id,
        }
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong while registering the user.",
        data: null,
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Fatal error. Please contact the admin.",
      data: null,
    });
  }
};


export const Login = async (req, res) => {
  try {
    let { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required!",
        data: null,
      });
    }

    let UserData=await User.findOne({ email: email })


   if(!UserData){
    return res.status(400).json({
      status: false,
      message: "User not found",
      data: null,
    });

   }


    console.log(UserData)

    let storedPassword=UserData.password


    let isPasswordMatch=await bcrypt.compare(password,storedPassword); 

    
   if(isPasswordMatch)
   {
    return res.status(400).json({
      status: true,
      message: "Logged in sucessfully",
      data: null,
    });

   }else{
    return res.status(400).json({
      status: false,
      message: "Password does not match",
      data: null,
    });

   }



  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Fatal error. Please contact the admin.",
      data: null,
    });
  }
};


export const sendOtp = async (email) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zajampratik@gmail.com",
        pass: "razyjjiwqwxxkvsi",
      },
    });




    async function main() {

      let otp = randomInteger(10, 10000);

      const mailOptions = {
        from: '"Pratik Zajam" <your-email@gmail.com>',
        to: email,
        subject: "🔐 OTP Verification - Secure Your Account",
        text: `Hello, 
      
      Your One-Time Password (OTP) for verification is: ${otp}
      
      This OTP is valid for the next 10 minutes. Do not share this code with anyone.
      
      Thank you,
      Your Company Name Support Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 500px;">
            <h2 style="color: #333;">🔐 OTP Verification</h2>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <h1 style="color: #007bff; text-align: center;">${otp}</h1>
            <p>This OTP is valid for the next <strong>10 minutes</strong>. Do not share this code with anyone.</p>
            <hr style="border: 0.5px solid #ddd;">
            <p style="font-size: 14px; color: #666;">If you didn’t request this, please ignore this email.</p>
            <p>Thank you,</p>
            <p><strong>Expense Tracker</strong></p>
          </div>
        `,
      };

      // Send Email
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);

      let OtpData = await Otp.create({
        email: email,
        Otp: otp
      });


    }

    main().catch(console.error);




  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Fatal error. Please contact the admin.",
      data: null,
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        status: true,
        message: "All fields are required",
        data: null,
      });
    }

    let VerifyOtp = await Otp.findOne({ email: email, Otp: otp })

    if (VerifyOtp) {

      const updateUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { verified: true } },
        { new: true, upsert: false }
      );

      if (updateUser) {
        return res.status(400).json({
          status: true,
          message: "Otp verified sucessfully",
          data: null,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Something went wrong",
          data: null,
        });

      }


    } else {
      return res.status(400).json({
        status: false,
        message: "Entered wrong Otp",
        data: null,
      });
    }


  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Fatal error. Please contact the admin.",
      data: null,
    });
  }
};






