import { User } from "../models/userModel.js";
import { Otp } from '../models/otpModel.js'
import Transaction from '../models/transactionModel.js'
import nodemailer from 'nodemailer'
import randomInteger from 'random-int';
import bcrypt from "bcrypt";
import moment from "moment";

export const Register = async (req, res) => {
  try {
    let { name,email, password } = req.body;

    if (!name||!email || !password) {
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
      name:name,
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
          name:UserData.name,
          userId: UserData._id,
          email: UserData.email

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


export const getTransactionByUserid = async (req, res) => {

  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "user id not found",
        data: null,
      });

    }

    let TransactionData = await Transaction.find({ userId: userId }).lean();

    if (TransactionData.length == 0) {

      return res.status(400).json({
        status: false,
        message: "No Data Found",
        data: null,
      });
    }

    TransactionData = TransactionData.map((transaction) => {
      return {
        ...transaction,
        date: new Date(transaction.date).toISOString().split("T")[0],
      };
    });

    return res.status(201).json({
      status: false,
      message: "Data fetched sucessfully",
      data: TransactionData,
    });

  } catch (error) {


    return res.status(400).json({
      status: false,
      message: error.message,
      data: null,
    });

  }









};


export const getStatisticsByid = async (req, res) => {

  const { userId } = req.body;

  try {

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "user id not found",
        data: null,
      });

    }

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    let IncomeData = await Transaction.find({
      userId: userId, type: "income", date: { $gte: startOfMonth, $lt: endOfMonth }
    }).lean();

    let ExpenseData = await Transaction.find({
      userId: userId, type: "expense", date: { $gte: startOfMonth, $lt: endOfMonth }
    }).lean();

    const TotalIncome = IncomeData.reduce((acc, transaction) => acc + transaction.amount, 0);
    const TotalExpense = ExpenseData.reduce((acc, transaction) => acc + transaction.amount, 0);
    let TotalSavings = TotalIncome - TotalExpense

    if (TotalSavings < 0) {
      TotalSavings = 0;
    }

    let statData = {
      totalIncome: TotalIncome,
      totalExpense: TotalExpense,
      totalSavings: TotalSavings
    }

    return res.status(201).json({
      status: false,
      message: "Data fetched sucessfully",
      data: statData,
    });

  } catch (error) {
    console.log(error)
  }


};




export const updateTransaction = async (req, res) => {
  try {

    const { transactionId, type, amount, date, description, category } = req.body

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
          type: type,
          amount: amount,
          date: date,
          description: description,
          category: category
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



export const getuserDeatilsByid = async (req, res) => {
  try {

    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        data: null,
      });
    }

    let getUserDetails = await User.findById(userId);

    if (!getUserDetails) {
      return res.status(400).json({
        status: false,
        message: "User Not Found",
        data: null,
      });
    }

    let userEmail = getUserDetails.email;


    return res.status(400).json({
      status: false,
      message: "data fetched sucessfully",
      data: {
        email: userEmail
      }
    });


  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Fatal error. Please contact the admin.",
      data: null,
    });
  }
};












