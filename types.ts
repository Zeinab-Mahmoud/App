
export enum UserRole {
  STUDENT = 'طالب',
  LAWYER = 'عضو قانوني', // Represents "Member of Admin" in notes
  PRESIDENT = 'رئيس الجامعة'
}

export enum CaseCategory {
  JUDICIAL = 'قسم القضايا',
  FATWA = 'فتاوى',
  CONTRACT = 'عقود',
  GRIEVANCE = 'تظلمات',
  OTHER = 'أعمال قانونية أخرى'
}

export enum CaseStatus {
  NEW = 'جديد',
  UNDER_REVIEW = 'قيد الدراسة', // Checking opinion
  PENDING_DOCS = 'بانتظار مستندات',
  RESOLVED = 'تم الفصل' // Final disposal
}

export interface CaseLog {
  date: string;
  action: string;
  user: string;
}

export interface CaseFile {
  id: string;
  title: string;
  description: string;
  category: CaseCategory;
  status: CaseStatus;
  plaintiff: string; // The specific "Member" or Student
  assignedLawyer?: string; // The "Name of Member" distributed to
  
  // Dates from the handwritten notes (Right image)
  referralDate: string; // Date of referral
  receiptDate?: string; // Date of receiving
  completionDate?: string; // Date of completion/disposal

  // AI Analysis
  aiSummary?: string;
  
  logs: CaseLog[];
}

export interface Stats {
  total: number;
  resolved: number;
  pending: number;
  byCategory: { name: string; value: number }[];
}
