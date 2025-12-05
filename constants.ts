
import { CaseCategory, CaseFile, CaseStatus, UserRole } from "./types";

export const MOCK_CASES: CaseFile[] = [
  {
    id: "CASE-2024-001",
    title: "تظلم طالب من نتيجة مادة القانون التجاري",
    description: "تقدم الطالب بتظلم يفيد بوجود خطأ مادي في رصد درجات أعمال السنة لمادة القانون التجاري مما أدى لرسوبه.",
    category: CaseCategory.GRIEVANCE,
    status: CaseStatus.UNDER_REVIEW,
    plaintiff: "أحمد محمد (طالب)",
    assignedLawyer: "المستشار / علي حسن",
    referralDate: "2024-05-10",
    receiptDate: "2024-05-12",
    logs: [
      { date: "2024-05-10", action: "تم تقديم التظلم", user: "أحمد محمد" },
      { date: "2024-05-12", action: "إحالة للعضو القانوني", user: "السكرتارية" }
    ]
  },
  {
    id: "CASE-2024-002",
    title: "مراجعة عقد توريد أجهزة حاسب آلي",
    description: "مطلوب الرأي القانوني في بنود عقد توريد 500 جهاز حاسب آلي لكلية الهندسة، وتحديداً بند الشروط الجزائية.",
    category: CaseCategory.CONTRACT,
    status: CaseStatus.NEW,
    plaintiff: "إدارة المشتريات",
    assignedLawyer: "المستشار / محمود سعيد",
    referralDate: "2024-05-14",
    logs: [
      { date: "2024-05-14", action: "طلب مراجعة عقد", user: "الرئيس" }
    ]
  },
  {
    id: "CASE-2024-003",
    title: "فتوى بخصوص الجمع بين وظيفتين",
    description: "طلب إبداء الرأي القانوني حول مدى أحقية عضو هيئة تدريس في العمل مستشاراً لجهة خارجية بدوام جزئي.",
    category: CaseCategory.FATWA,
    status: CaseStatus.RESOLVED,
    plaintiff: "عميد كلية الآداب",
    assignedLawyer: "د. سناء يوسف",
    referralDate: "2024-04-01",
    receiptDate: "2024-04-02",
    completionDate: "2024-04-10",
    logs: []
  }
];
