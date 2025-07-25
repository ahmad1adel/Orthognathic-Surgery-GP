import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation object (simplified for demo)
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About Us',
    conditions: 'Conditions',
    faqs: 'FAQs',
    contact: 'Contact',
    chatbot: 'AI Chatbot',
    cnn: 'CNN Analysis',
    gan: 'GAN Restoration',
    gallery: 'Gallery',
    findClinics: 'Find Clinics',
    aiLab: 'AI Lab',
    login: 'Login',
    signup: 'Sign Up',
    dashboard: 'Dashboard',
    profile: 'Profile',
    
    // Common
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    uploadXray: 'Upload X-Ray',
    analyze: 'Analyze',
    patient: 'Patient',
    doctor: 'Doctor',
    email: 'Email',
    password: 'Password',
    submit: 'Submit',
    cancel: 'Cancel',
    
    // Hero
    heroTitle: 'AI-Powered Dental Analysis',
    heroSubtitle: 'Advanced jaw deformity detection and restoration using cutting-edge artificial intelligence',
    
    // Conditions
    agnathia: 'Agnathia',
    macrognathia: 'Macrognathia', 
    micrognathia: 'Micrognathia',
    
    // AI Lab
    cnnTitle: 'CNN Classification',
    ganTitle: 'GAN Restoration',
    chatbotTitle: 'AI Assistant'
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'من نحن',
    conditions: 'الحالات',
    faqs: 'الأسئلة الشائعة',
    contact: 'اتصل بنا',
    chatbot: 'المساعد الذكي',
    cnn: 'تحليل CNN',
    gan: 'استعادة GAN',
    gallery: 'المعرض',
    findClinics: 'العثور على عيادات',
    aiLab: 'مختبر الذكاء الاصطناعي',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    
    // Common
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    uploadXray: 'رفع الأشعة السينية',
    analyze: 'تحليل',
    patient: 'مريض',
    doctor: 'طبيب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    submit: 'إرسال',
    cancel: 'إلغاء',
    
    // Hero
    heroTitle: 'تحليل الأسنان بالذكاء الاصطناعي',
    heroSubtitle: 'الكشف المتقدم عن تشوهات الفك والاستعادة باستخدام الذكاء الاصطناعي المتطور',
    
    // Conditions
    agnathia: 'عدم تكوّن الفك',
    macrognathia: 'كبر الفك',
    micrognathia: 'صغر الفك',
    
    // AI Lab
    cnnTitle: 'تصنيف CNN',
    ganTitle: 'استعادة GAN',
    chatbotTitle: 'المساعد الذكي'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};