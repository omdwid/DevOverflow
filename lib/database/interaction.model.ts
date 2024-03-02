// this interaction model will help in getting the data about the 
// interaction of the user so that we can use it again
// for example we can add the recommendations based on the interactions
import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
}

const interactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question'},
  answer: { type: Schema.Types.ObjectId, ref: 'Answer'},
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag'}],
});

const Interaction = models.Interaction || model("Interaction", interactionSchema);

export default Interaction;
