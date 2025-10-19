// This interface defines all the data required for the complete, multi-stage registration flow.
export interface RegistrationData {
    // Stage 1: Personal Details
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: string; // Format YYYY-MM-DD

    // Stage 2: Country Selection 
    country: string;

    // Stage 3: Address and Location Pinning
    addressLine1: string;
    addressLine2: string;
    cityValue: string; 
    areaValue: string; 
    phoneNumber: string; 
    mapSearchTerm: string; 
    mapSelectResult: string; 
}
