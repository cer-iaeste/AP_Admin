import { UserType } from "../types/types";
import { doc, getDoc, getDocs, collection, getFirestore, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from 'react-toastify';

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

export const changeUserStatus = async (uid: string, status: boolean) => {
    try {
      const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            disabled: status,
        })
        toast.success(`User ${status ? 'enabled' : 'disabled'}!`)
        return true
    }
    catch (error) {
        toast.error(`Error updating user status! Message: ${error}`)
        return false
    }
}
 