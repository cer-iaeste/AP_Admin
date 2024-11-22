import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
    user: any;
    role: string;
    country?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState<string>("")
    const [country, setCountry] = useState<string>("")

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("FB user: ", firebaseUser)
            if (firebaseUser) {
                setUser(firebaseUser)

                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
                if (userDoc.exists()) {
                    const role = userDoc.data().role
                    setRole(role)
                    setCountry(role === "user" ? userDoc.data().country : "")
                }
            } else {
                setUser(null)
                setRole("")
                setCountry("")
            }
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, role, country }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)