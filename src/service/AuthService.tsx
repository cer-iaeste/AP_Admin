import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { emptyLocalStorage } from "../global/Global";

const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await userCredential.user.getIdToken() // Firebase ID token
            const userRef = doc(db, "users", userCredential.user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const data = userDoc.data()
                if (!data.disabled) {
                    const lastLoggedIn = Date.now()
                    data["lastLoggedIn"] = lastLoggedIn
                    await updateDoc(userRef, {
                        "lastLoggedIn": lastLoggedIn
                    })

                    localStorage.setItem("loggedIn", JSON.stringify(data))
                    localStorage.setItem("authToken", idToken)
                    
                    return data;
                } else throw new Error("User is disabled!")
            } else throw new Error("User document not found!")
        } catch (error: any) {
            // Throw an error so `toast.promise` treats it as a failure.
            throw new Error(error.message || "Login failed")
        }
    },
    logout: async () => {
        await signOut(auth)
        emptyLocalStorage()
    },
    refreshToken: async () => {
        try {
            const currentUser = auth.currentUser
            if (currentUser) {
                const newToken = await currentUser.getIdToken(true)
                localStorage.setItem("authToken", newToken)
                return newToken
            } else {
                throw new Error("No authenticated user found!")
            }
        } catch (error: any) {
            throw new Error(error.message || "Token refresh failed")
        }
    },
    signup: async (email: string, password: string, country: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await setDoc(doc(db, "users", user.uid), {
                country,
                role: "user",
                uid: user.uid,
                email,
                createdAt: Date.now()
            })

            return true
        } catch (error) {
            console.error("Error during signup: ", error)
            return false
        }
    }
};

export default AuthService;
