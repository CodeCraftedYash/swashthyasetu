import bcrypt from "bcrypt";
import { UserRole, Gender, HospitalLevel, HospitalStatus, WardType, DoctorStatus, AmbulanceType, AmbulanceStatus, AlertSeverity, AlertStatus, AlertReporter, AssessmentSeverity, AppointmentType, AppointmentStatus, TokenStatus, CheckInStatus, TeleconsultStatus, FollowUpStatus, SchemeStatus } from "../src/generated/prisma/client";
import prisma from "../src/lib/Prisma";

async function main() {
  console.log("🌱 Starting healthcare database seeding...");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Notification",
      "AuditLog",
      "Consent",
      "BloodInventory",
      "SchemeApplication",
      "HospitalScheme",
      "GovernmentScheme",
      "FollowUpTask",
      "HouseholdMember",
      "Household",
      "AshaWorker",
      "Teleconsultation",
      "QRCheckIn",
      "TokenBooking",
      "Appointment",
      "AssessmentSymptom",
      "SeverityAssessment",
      "Symptom",
      "AlertEvent",
      "Alert",
      "AmbulanceLocation",
      "Ambulance",
      "DoctorSpecialty",
      "DoctorProfile",
      "BedInventory",
      "HospitalSpecialty",
      "Specialty",
      "Hospital",
      "PatientProfile",
      "Session",
      "User"
    RESTART IDENTITY CASCADE;
  `);

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@swasthyasetu.local",
      phone: "+919900000001",
      passwordHash: defaultPasswordHash,
      firstName: "System",
      lastName: "Admin",
      roles: [UserRole.GOVERNMENT_ADMIN, UserRole.SUPER_ADMIN],
      isActive: true,
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      email: "patient@swasthyasetu.local",
      phone: "+919900000002",
      passwordHash: defaultPasswordHash,
      firstName: "Riya",
      lastName: "Sharma",
      roles: [UserRole.PATIENT],
      isActive: true,
    },
  });

  const ashaUser = await prisma.user.create({
    data: {
      email: "asha@swasthyasetu.local",
      phone: "+919900000003",
      passwordHash: defaultPasswordHash,
      firstName: "Meena",
      lastName: "Verma",
      roles: [UserRole.ASHA_WORKER],
      isActive: true,
    },
  });

  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor@swasthyasetu.local",
      phone: "+919900000004",
      passwordHash: defaultPasswordHash,
      firstName: "Ananya",
      lastName: "Patel",
      roles: [UserRole.DOCTOR],
      isActive: true,
    },
  });

  const patientProfile = await prisma.patientProfile.create({
    data: {
      userId: patientUser.id,
      dateOfBirth: new Date("1995-06-12T00:00:00.000Z"),
      gender: Gender.FEMALE,
      bloodGroup: "O+",
      address: "8 Green Park, Jaipur",
      village: "Sunderpur",
      district: "Jaipur",
      state: "Rajasthan",
      emergencyContact: "Father",
      emergencyPhone: "+919900000099",
      medicalNotes: "History of mild asthma; prefers afternoon follow-up.",
    },
  });

  const hospital1 = await prisma.hospital.create({
    data: {
      code: "HOSP-001",
      name: "SwasthyaSetu Trauma Centre",
      area: "Vaishali Nagar",
      address: "Near City Ring Road, Jaipur",
      district: "Jaipur",
      state: "Rajasthan",
      phone: "+919900000010",
      latitude: 26.858,
      longitude: 75.791,
      level: HospitalLevel.LEVEL_I_TRAUMA,
      status: HospitalStatus.AVAILABLE,
      queueLength: 18,
      averageWaitMins: 34,
      isActive: true,
    },
  });

  const hospital2 = await prisma.hospital.create({
    data: {
      code: "HOSP-002",
      name: "Arogya Community Hospital",
      area: "Malviya Nagar",
      address: "12 Sector Road, Jaipur",
      district: "Jaipur",
      state: "Rajasthan",
      phone: "+919900000011",
      latitude: 26.835,
      longitude: 75.801,
      level: HospitalLevel.LEVEL_II,
      status: HospitalStatus.BUSY,
      queueLength: 9,
      averageWaitMins: 22,
      isActive: true,
    },
  });

  await prisma.bedInventory.createMany({
    data: [
      { hospitalId: hospital1.id, wardType: WardType.GENERAL, totalBeds: 80, occupiedBeds: 42 },
      { hospitalId: hospital1.id, wardType: WardType.ICU, totalBeds: 24, occupiedBeds: 12 },
      { hospitalId: hospital1.id, wardType: WardType.VENTILATOR, totalBeds: 10, occupiedBeds: 6 },
      { hospitalId: hospital2.id, wardType: WardType.GENERAL, totalBeds: 55, occupiedBeds: 31 },
      { hospitalId: hospital2.id, wardType: WardType.PEDIATRIC, totalBeds: 20, occupiedBeds: 9 },
    ],
  });

  const doctor = await prisma.doctorProfile.create({
    data: {
      userId: doctorUser.id,
      hospitalId: hospital1.id,
      name: "Dr. Ananya Patel",
      department: "General Medicine",
      licenseNumber: "RJ-MED-1001",
      status: DoctorStatus.AVAILABLE,
      servingToken: 12,
      nextFreeSlot: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const ambulance = await prisma.ambulance.create({
    data: {
      id: "AMB-1001",
      registrationNo: "RJ01AB1001",
      driverName: "Suresh Kumar",
      driverPhone: "+919900000020",
      type: AmbulanceType.ALS,
      baseStation: hospital1.area,
      status: AmbulanceStatus.EN_ROUTE,
      latitude: 26.862,
      longitude: 75.789,
      currentEtaMins: 8,
      hospitalId: hospital1.id,
    },
  });

  const symptom = await prisma.symptom.upsert({
    where: { code: "S-001" },
    update: {},
    create: {
      code: "S-001",
      name: "Difficulty breathing",
      description: "Breathing discomfort or shortness of breath",
      weight: 4,
      isCritical: true,
    },
  });

  const assessment = await prisma.severityAssessment.create({
    data: {
      patientId: patientProfile.id,
      score: 74,
      severity: AssessmentSeverity.SERIOUS,
      recommendation: "Urgent triage and hospital review.",
      locationLat: 26.851,
      locationLng: 75.795,
    },
  });

  await prisma.assessmentSymptom.create({
    data: {
      assessmentId: assessment.id,
      symptomId: symptom.id,
      answer: true,
      notes: "Patient reports shortness of breath and chest pressure.",
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patientProfile.id,
      doctorId: doctor.id,
      hospitalId: hospital1.id,
      assessmentId: assessment.id,
      type: AppointmentType.IN_PERSON,
      status: AppointmentStatus.CONFIRMED,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      reason: "Triage follow-up",
      notes: "Check vitals and review symptoms.",
    },
  });

  const token = await prisma.tokenBooking.create({
    data: {
      tokenNumber: 12,
      patientId: patientProfile.id,
      hospitalId: hospital1.id,
      doctorId: doctor.id,
      appointmentId: appointment.id,
      status: TokenStatus.BOOKED,
      bookedFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  });

  const alert = await prisma.alert.create({
    data: {
      patientId: patientProfile.id,
      reporterUserId: adminUser.id,
      assignedById: adminUser.id,
      hospitalId: hospital1.id,
      ambulanceId: ambulance.id,
      severity: AlertSeverity.CRITICAL,
      status: AlertStatus.AMBULANCE_EN_ROUTE,
      reporter: AlertReporter.APP_SOS,
      note: "Patient reported severe breathing distress and chest pain.",
      latitude: 26.851,
      longitude: 75.795,
    },
  });

  await prisma.alertEvent.create({
    data: {
      alertId: alert.id,
      status: AlertStatus.CREATED,
      note: "Emergency alert received by control desk.",
    },
  });

  const teleconsult = await prisma.teleconsultation.create({
    data: {
      patientId: patientProfile.id,
      doctorId: doctor.id,
      hospitalId: hospital1.id,
      appointmentId: appointment.id,
      status: TeleconsultStatus.SCHEDULED,
      scheduledAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      meetingUrl: "https://meet.example.com/triage-123",
      patientNotes: "Feeling dizzy and faint.",
      doctorNotes: "Proceed with urgent review.",
    },
  });

  const ashaWorker = await prisma.ashaWorker.create({
    data: {
      userId: ashaUser.id,
      workerCode: "ASHA-001",
      village: "Sunderpur",
      district: "Jaipur",
      phone: "+919900000003",
      isActive: true,
    },
  });

  const household = await prisma.household.create({
    data: {
      ashaWorkerId: ashaWorker.id,
      name: "Sharma Family",
      address: "12 Sunderpur Lane",
      village: "Sunderpur",
      district: "Jaipur",
      priority: 2,
    },
  });

  await prisma.householdMember.create({
    data: {
      householdId: household.id,
      patientId: patientProfile.id,
      name: "Riya Sharma",
      relationship: "Self",
      dateOfBirth: new Date("1995-06-12T00:00:00.000Z"),
      phone: patientUser.phone ?? "+919900000002",
    },
  });

  await prisma.followUpTask.create({
    data: {
      patientId: patientProfile.id,
      ashaWorkerId: ashaWorker.id,
      title: "Post-discharge home follow-up",
      description: "Check medication adherence and vitals at home.",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: FollowUpStatus.PENDING,
    },
  });

  const scheme = await prisma.governmentScheme.create({
    data: {
      name: "Ayushman Bharat Support Scheme",
      description: "Coverage support for eligible patients at primary and secondary care centres.",
      benefits: "Cashless treatment and subsidies for emergency care.",
      eligibility: "Residents with valid government beneficiary status.",
      officialUrl: "https://gov.example/scheme/ayushman",
      status: SchemeStatus.ACTIVE,
    },
  });

  await prisma.hospitalScheme.create({
    data: {
      hospitalId: hospital1.id,
      schemeId: scheme.id,
    },
  });

  await prisma.schemeApplication.create({
    data: {
      schemeId: scheme.id,
      patientId: patientProfile.id,
      status: "PENDING",
      notes: "Submitted for verification.",
    },
  });

  await prisma.qRCheckIn.create({
    data: {
      qrToken: "SWASHTYA-QR-1001",
      patientId: patientProfile.id,
      hospitalId: hospital1.id,
      deskName: "Triage Desk 1",
      status: CheckInStatus.CREATED,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.createMany({
    data: [
      { userId: patientUser.id, title: "Appointment confirmed", message: "Your appointment with Dr. Ananya Patel is confirmed.", type: "APPOINTMENT" },
      { userId: patientUser.id, title: "Care alert", message: "A hospital team has been assigned to your emergency alert.", type: "ALERT" },
      { userId: ashaUser.id, title: "Follow-up required", message: "Visit the Sharma household for a post-discharge check-in.", type: "FOLLOW_UP" },
    ],
  });

  console.log("✅ Seed complete: admin, patient, ASHA worker, doctor, hospitals, ambulance, alert, appointment, token, teleconsultation, scheme, QR token, and follow-up data created.");
  console.log(`Hospital 1: ${hospital1.name}`);
  console.log(`Patient: ${patientProfile.userId}`);
  console.log(`Token: ${token.id}`);
  console.log(`Teleconsultation: ${teleconsult.id}`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });