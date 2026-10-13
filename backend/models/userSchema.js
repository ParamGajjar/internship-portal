import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },

    phone: {
      type: String,
      required: [true, "Please enter your phone number."],
    },

    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 8,
      maxlength: 100,
      select: false,
    },

    role: {
      type: String,
      required: [true, "Please select a role."],
      enum: ["Student", "Company", "College", "Admin"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    studentProfile: {
      college: {
        type: String,
        default: "",
      },

      branch: {
        type: String,
        default: "",
      },

      semester: {
        type: Number,
      },

      cgpa: {
        type: Number,
        min: 0,
        max: 10,
      },

      skills: {
        type: [String],
        default: [],
      },

      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
        },
      ],

      certifications: [
        {
          name: String,
          organization: String,
          year: Number,
        },
      ],

      linkedin: {
        type: String,
        default: "",
      },

      github: {
        type: String,
        default: "",
      },

      resume: {
        public_id: String,
        url: String,
      },
    },

    companyProfile: {
      companyName: String,
      description: String,
      website: String,
      industry: String,
      location: String,
      logo: {
        public_id: String,
        url: String,
      },
    },

    collegeProfile: {
      collegeName: String,
      university: String,
      address: String,
      placementCoordinator: String,
      departments: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getJWTToken = function () {
  const secret = process.env.JWT_SECRET_KEY || "local-development-secret-change-before-deployment";
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
      secret,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};
export const User = mongoose.model("User", userSchema);
