export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName?: string;
  roles?: Array<
    | "PATIENT"
    | "DOCTOR"
    | "ASHA_WORKER"
    | "HOSPITAL_STAFF"
    | "POLICE_RESPONDER"
    | "AMBULANCE_DRIVER"
    | "GOVERNMENT_ADMIN"
    | "SUPER_ADMIN"
  >;
}
