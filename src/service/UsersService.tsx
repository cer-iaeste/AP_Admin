import { UserType } from "../types/types";
import { doc, getDoc, getDocs, collection, getFirestore, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface DBUser {
    uid: string
    email: string
    created: string
    signedIn: string
}

export const fetchUsersData = async (): Promise<UserType[]> => {
    const querySnapshot = await getDocs(collection(db, "users"))
    const result: UserType[] = []
    querySnapshot.forEach((doc) => {
        const data = doc.data() as UserType
        result.push(data)
    })
    return result
}
