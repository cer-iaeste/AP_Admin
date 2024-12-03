import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { emptyLocalStorage } from "../global/Global";

const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await userCredential.user.getIdToken() // Firebase ID token
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
            if (userDoc.exists()) {
                const data = userDoc.data()
                localStorage.setItem("loggedIn", JSON.stringify(data))
                localStorage.setItem("authToken", idToken)
                return data;
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
    }
};

export default AuthService;
