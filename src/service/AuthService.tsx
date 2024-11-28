import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                localStorage.setItem('loggedIn', JSON.stringify(data));
                return data;
            } else throw new Error("User document not found!");
        } catch (error: any) {
            // Throw an error so `toast.promise` treats it as a failure.
            throw new Error(error.message || "Login failed");
        }
    },
    logout: async () => {
        await signOut(auth);
    },
};

export default AuthService;
