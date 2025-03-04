const mongoose = require('mongoose'); // Fixed typo: moongose -> mongoose
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isAdmin: { type: Boolean, default: false }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            const hashedPassword = await bcrypt.hash(update.password, 10);
            this.setUpdate({ ...update, password: hashedPassword }); // Update the password
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}


module.exports = mongoose.model('User', UserSchema);
