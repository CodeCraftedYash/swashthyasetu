import * as bcrypt from "bcrypt"

class PasswordService {

static async hashPassword (password:string){
    const saltRounds = 12;
    return await bcrypt.hash(password,saltRounds);
}

static async comparePassword (password:string,hashedPassword:string) {
    return await bcrypt.compare(password,hashedPassword);
}
}

export default PasswordService;