
import { GoogleGenAI } from "@google/genai";
import { CaseFile } from "../types";

// Initialize Gemini
// Note: In a real app, API_KEY should be secure. Here we use process.env as requested.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeCaseLegally = async (caseItem: CaseFile): Promise<string> => {
  if (!process.env.API_KEY) return "مفتاح API غير متوفر. يرجى ضبط الإعدادات.";

  try {
    const prompt = `
      بصفتك مساعداً قانونياً ذكياً، قم بتلخيص هذه القضية القانونية الجامعية بشكل موجز ودقيق:
      
      العنوان: ${caseItem.title}
      التصنيف: ${caseItem.category}
      المدعي: ${caseItem.plaintiff}
      التفاصيل: ${caseItem.description}
      
      المطلوب: ملخص تنفيذي قانوني في 3 نقاط يوضح جوهر المشكلة والإجراء المطلوب.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "لم يتم إنشاء ملخص.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء الاتصال بالمساعد الذكي.";
  }
};

export const draftLegalOpinion = async (caseItem: CaseFile, pointOfView: string): Promise<string> => {
  if (!process.env.API_KEY) return "مفتاح API غير متوفر.";

  try {
    const prompt = `
      اكتب مسودة رأي قانوني (مذكرة) بخصوص القضية التالية:
      نوع القضية: ${caseItem.category}
      الموضوع: ${caseItem.description}
      وجهة النظر المطلوبة: ${pointOfView}
      
      اكتب بصياغة قانونية رسمية باللغة العربية موجهة لرئيس الجامعة أو اللجنة المختصة.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "لم يتم إنشاء المسودة.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء الإنشاء.";
  }
};
