import { User } from "../models/userModel.js";
import { Otp } from '../models/otpModel.js'
import Transaction from '../models/transactionModel.js'
import nodemailer from 'nodemailer'
import randomInteger from 'random-int';
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      console.error("Validation Error: All fields are required.");
      return res.status(400).json({
        status: "error",
        message: "All fields are required!",
        data: null,
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`User already exists with email: ${email}`);
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
      sendOtp(email);
      return res.status(201).json({
        status: "success",
        message: "OTP has been sent for verification to your email!",
        data: { id: userData._id },
      });
    } else {
      console.error("Database Error: User registration failed.");
      return res.status(500).json({
        status: "error",
        message: "Something went wrong while registering the user.",
        data: null,
      });
    }
  } catch (error) {
    console.error("Server Error:", error); // Logs the error in the console
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

    let UserData = await User.findOne({ email: email })


    if (!UserData) {
      return res.status(400).json({
        status: false,
        message: "User not found",
        data: null,
      });

    }


    console.log(UserData)

    let storedPassword = UserData.password


    let isPasswordMatch = await bcrypt.compare(password, storedPassword);


    if (isPasswordMatch) {
      return res.status(201).json({
        status: true,
        message: "Logged in sucessfully",
        data: {
         userId:UserData._id

        },
      });

    } else {
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
    console.log(`📧 Attempting to send OTP to: ${email}`);

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,  // Use 587 instead of 465
  secure: false, // STARTTLS (explicit TLS)
  auth: {
    user: "zajampratik@gmail.com",
    pass: "aubtysoqveyqrlkd",
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed certificate errors
  },
});


async function main() {
  try {
    let otp = randomInteger(1000, 9999);
    console.log(`🔢 Generated OTP: ${otp} for email: ${email}`);

    const mailOptions = {
      from: '"Pratik Zajam" zajampratik@gmail.com',
      to: email,
      subject: "🔐 OTP Verification - Secure Your Account",
      text: `Your One-Time Password (OTP) for verification is: ${otp}`,
      html: `<div>OTP: <strong>${otp}</strong></div>`,
    };

    // Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);

    let OtpData = await Otp.create({ email: email, Otp: otp });
    console.log(`✅ OTP saved in database for ${email}: ${OtpData.Otp}`);

  } catch (error) {
    console.error("❌ Error in main():", error);
  }
}

// Call main with proper error handling
main().catch((err) => console.error("❌ Unhandled error in main():", err));
  } catch (error) {
    console.error(" Fatal Error in sendOtp:", error);

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
        return res.status(201).json({
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




export const addTransaction = async (req, res) => {
  try {

    const { userId, type, amount, date, description, category } = req.body






    if (!userId || !type || !amount || !date || !description || !category) {
      return res.status(400).json({
        status: false,
        message: "All the fields are required",
        data: null,
      });
    }

   

    const dateObject = new Date(date);

    const NewDate = dateObject.toISOString();


    if (typeof (amount) != "number") {
      return res.status(400).json({
        status: false,
        message: "Amount should be a number",
        data: null,
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        status: false,
        message: "Amount should be a positive number",
        data: null,
      });
    }

    let addTransaction = await Transaction.create({
      userId: userId,
      type: type,
      amount: amount,
      date: NewDate,
      description: description,
      category: category
    });


    if (addTransaction) {
      return res.status(201).json({
        status: false,
        message: "Transaction added sucessfully",
        data: null,
      });

    } else {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
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



export const deleteTransaction = async (req, res) => {
  try {

    const { transactionId } = req.body

    if (!transactionId) {
      return res.status(400).json({
        status: false,
        message: "Transaction id not found",
        data: null,
      });
    }

    let RemoveTransaction = await Transaction.findOneAndDelete(transactionId)

    if (RemoveTransaction) {

      return res.status(201).json({
        status: false,
        message: "Transaction Deleted sucessfully",
        data: null,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
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



export const updateTransaction = async (req, res) => {
  try {

    const { transactionId,type,amount,date,description,category} = req.body

    if (!transactionId) {
      return res.status(400).json({
        status: false,
        message: "Transaction id not found",
        data: null,
      });
    }

    const updatedUser = await Transaction.findOneAndUpdate(
      { _id: transactionId },  
      { 
        $set: {
          type:type,
          amount:amount,
          date:date,
          description:description,
          category:category
        }
      },
      { new: true, runValidators: true }
    );

    console.log(updatedUser)
    

    if (updatedUser) {

      return res.status(201).json({
        status: false,
        message: "Transaction details updated sucessfully",
        data: null,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
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













