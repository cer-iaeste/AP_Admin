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
    try {
        const querySnapshot = await getDocs(collection(db, "users"))
        return querySnapshot.docs.map(doc => doc.data() as UserType);
    } catch (error) {
        toast.error(`Error fetching users! Message: ${error}`)
        return []
    }
}

export const fetchCountryUsers = async (countryName: string): Promise<UserType[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"))
        return querySnapshot.docs.map(doc => doc.data() as UserType)
            .filter(user => user.country === countryName && !user.test) ?? []
    } catch (error) {
        toast.error(`Error fetching users! Message: ${error}`)
        return []
    }
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