 import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '@/config/firebase';
import { RegistrationData } from '@/context/RegistrationContext';

export async function createFirebaseUser(email: string, password: string): Promise<string> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user.uid;
}

export async function createDriverDocument(
  uid: string,
  email: string
): Promise<void> {
  try {
    const driverRef = doc(firestore, 'drivers', uid);
    await setDoc(driverRef, {
      uid,
      email,
      createdAt: serverTimestamp(),
      verificationStatus: 'draft',
      registrationCompleted: false,
      registrationStep: 1,
    });
  } catch (error) {
    console.error('Error creating driver document:', error);
    throw error;
  }
}

export async function updateDriverData(
  uid: string,
  data: Partial<RegistrationData>,
  step: number
): Promise<void> {
  try {
    const driverRef = doc(firestore, 'drivers', uid);

    const updateData: any = {
      registrationStep: step,
      updatedAt: serverTimestamp(),
    };

    if (data.phone) {
      updateData.phone = data.phone;
    }

    if (data.profile) {
      updateData.profile = {
        firstName: data.profile.firstName || '',
        lastName: data.profile.lastName || '',
        dob: data.profile.dob || '',
        profilePicture: data.profile.profilePicture || '',
      };
    }

    if (data.license) {
      updateData.license = {
        number: data.license.number || '',
        expiry: data.license.expiry || '',
        licenseImage: data.license.licenseImage || '',
        selfieWithLicense: data.license.selfieWithLicense || '',
      };
    }

    if (data.idCard) {
      updateData.idCard = {
        idNumber: data.idCard.idNumber || '',
        idImage: data.idCard.idImage || '',
      };
    }

    if (data.vehicleCategory) {
      updateData.vehicleCategory = data.vehicleCategory;
    }

    if (data.vehicle) {
      updateData.vehicle = {
        type: data.vehicle.type || '',
        brand: data.vehicle.brand || '',
        model: data.vehicle.model || '',
        productionYear: data.vehicle.productionYear || '',
        color: data.vehicle.color || '',
        plateNumber: data.vehicle.plateNumber || '',
        registrationCertificate: data.vehicle.registrationCertificate || '',
        carImage: data.vehicle.carImage || '',
        seats: data.vehicle.seats || 0,
      };
    }

    if (data.operation) {
      updateData.operation = {
        place: data.operation.place || '',
        available: data.operation.available || false,
      };
    }

    if (data.role) {
      updateData.role = data.role;
    }

    await updateDoc(driverRef, updateData);
  } catch (error) {
    console.error('Error updating driver data:', error);
    throw error;
  }
}

export async function completeDriverRegistration(uid: string): Promise<void> {
  try {
    const driverRef = doc(firestore, 'drivers', uid);
    await updateDoc(driverRef, {
      verificationStatus: 'pending',
      registrationCompleted: true,
      registrationStep: 7,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error completing driver registration:', error);
    throw error;
  }
}
