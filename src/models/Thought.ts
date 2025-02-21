import { Schema, model, Document, default as mongoose } from 'mongoose';

interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
}

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: Schema.Types.ObjectId[];
}

const reactionSchema = new Schema<IReaction>({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: Date): any => timestamp.toDateString(),
    },
});


const thoughtSchema = new Schema<IThought>({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: Date): any => timestamp.toDateString(),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [
       reactionSchema
    ],
});


thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;