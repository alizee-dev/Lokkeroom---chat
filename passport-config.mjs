//import { Strategy as LocalStrategy } from 'passport-local';
//import bcrypt from 'bcrypt'

//const initialize = (passport, getUserByEmail, getUserById) => {
//    const authenticateUser = async(email, password, done) => {
//        const user = getUserByEmail(email)
//        if (user == null) {
//            return done(null, false, { message : "No user with that email" })
//        } 
//        try {
//            if (await bcrypt.compare(password, user.password)) {
//                return done(null, user )
//            } else {
//                return done(null, false, { message : "Incorrect password"})
//            }
//        } catch (err) {
//            return done(err)
//        }
//    }
//    passport.use(new LocalStrategy({ usernameField : 'email' }, authenticateUser))
//    passport.serializeUser((user, done) => done(null, user.id))
//    passport.deserializeUser((id, done) => {
//        return done(null, getUserById(id))
//    })
//}

//export default initialize

import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

const initialize = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        try {
            // On attend la réponse de la base de données
            const user = await getUserByEmail(email)
            if (user == null) {
                return done(null, false, { message: "Aucun utilisateur avec cet email" })
            }
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Mot de passe incorrect" })
            }
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id)
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    })
}

export default initialize