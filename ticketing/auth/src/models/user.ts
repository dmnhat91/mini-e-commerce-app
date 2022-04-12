import mongoose from 'mongoose';
import {Password} from '../services/password';

// An interface that describes the properties
// that are required by a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

// define schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(done){
    //check if we've modified other the user properties (in case in future we retrieve user then save it back - aka. if we want to change email, we don't want to rehash the password)
    //(if statement is true IF something is modified EXCEPT password)
    if (this.isModified('password')){ 
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };