import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, unique: true },
  females: { type: Number, required: true },
  males: { type: Number, required: true },
  parentLocation: { type: String, required: false }
});

export default mongoose.model('message', messageSchema);
