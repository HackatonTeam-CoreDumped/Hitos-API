"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
const enumerated = require("../middlewares/enumStructures");
const Milestone = require("./milestone");

const UserSchema = new Schema({
  //_id: { type: String  },
  userName: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  role: { type: String, enum: enumerated.role, default: enumerated.role[3] },
  team: { type: String, enum: enumerated.teams, default: enumerated.teams[0] },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  idTelegram: { type: String, required: true },
  githubURL: { type: String },
  //pendingDesign: { type: Number  },
  //pendingDeveloper: { type: Number },
  //pendingGame: { type: Number },
  //doneDesign: { type: Number  },
  //doneDeveloper: { type: Number },
  //doneGame: { type: Number },
  //meetingsAsisted: { type: Number },
  milestonesCollection: [
    {
      _id: false,
      milestone: {},
      status: {
        type: String,
        enum: enumerated.status,
        default: enumerated.status[0]
      }
    }
  ],
  personalLinks: [
    {
      text: { type: String },
      url: { type: String }
    }
  ],
  creation: { type: Date, default: Date.now() },
  lastLogin: { type: Date, default: Date.now() },
  active: { type: Boolean, default: true }
});

UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model(enumerated.modelsName.user, UserSchema);
