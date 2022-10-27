const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    messageText : {type: String, required: true},
    postAuthor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    datePosted: {type: Date, required: true},
});

MessageSchema
.virtual('date')
.get(function() {
  return this.datePosted ? DateTime.fromJSDate(this.datePosted).toLocaleString(DateTime.DATE_MED) : '';
});

MessageSchema
virtual("deleteUrl")
.get(function() {
  return `/delete/${this._id}`
})

module.exports = mongoose.model("Message", MessageSchema);