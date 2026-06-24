import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Brain,
  Scan,
  ImageIcon,
  MessageCircle,
  MapPin,
  Users,
  Award,
  Shield,
  ArrowRight,
  Stethoscope,
  Target,
  CheckCircle2,
  Zap,
  Lock,
  HeartPulse,
  FlaskConical,
  ChevronRight,
  Star,
  TrendingUp,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: 'CNN Classification',
      description: 'Advanced neural network analysis for jaw shape classification',
      link: '/cnn-upload',
      color: 'text-primary'
    },
    {
      icon: ImageIcon,
      title: 'GAN Restoration',
      description: 'AI-powered jaw deformity correction and visualization',
      link: '/gan-upload',
      color: 'text-accent'
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot',
      description: 'Expert dental consultation powered by RAG technology',
      link: '/chatbot',
      color: 'text-success'
    },
    {
      icon: MapPin,
      title: 'Find Clinics',
      description: 'Locate nearby dental specialists and clinics',
      link: '/find-clinics',
      color: 'text-warning'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Patients Analyzed' },
    { icon: Scan, value: '95%', label: 'Accuracy Rate' },
    { icon: Award, value: '50+', label: 'Partner Clinics' },
    { icon: Shield, value: '100%', label: 'HIPAA Compliant' }
  ];

  const conditions = [
    {
      icon: AlertCircle,
      title: 'Agnathia',
      tag: 'Severe',
      tagColor: 'bg-red-100 text-red-700',
      description: 'A rare congenital condition characterized by the complete absence or severe underdevelopment of one or both jaws, often requiring complex surgical intervention.',
      symptoms: ['Inability to chew', 'Speech difficulties', 'Breathing problems'],
    },
    {
      icon: TrendingUp,
      title: 'Macrognathia',
      tag: 'Moderate',
      tagColor: 'bg-yellow-100 text-yellow-700',
      description: 'An abnormal enlargement of the jaw resulting in excessive protrusion. This condition affects facial symmetry, bite alignment, and can cause significant functional impairment.',
      symptoms: ['Protruding jaw', 'Misaligned bite', 'TMJ discomfort'],
    },
    {
      icon: Target,
      title: 'Micrognathia',
      tag: 'Common',
      tagColor: 'bg-blue-100 text-blue-700',
      description: 'An underdevelopment of the lower or upper jaw that results in a receded chin or overbite. It is one of the most frequently diagnosed orthognathic conditions.',
      symptoms: ['Recessed chin', 'Crowded teeth', 'Sleep apnea risk'],
    },
    {
      icon: HeartPulse,
      title: 'Prognathism',
      tag: 'Moderate',
      tagColor: 'bg-yellow-100 text-yellow-700',
      description: 'A protrusion of the lower jaw beyond the normal facial profile. It can be skeletal or dental in origin and may require orthognathic surgery for correction.',
      symptoms: ['Underbite', 'Facial imbalance', 'Chewing difficulty'],
    },
    {
      icon: BookOpen,
      title: 'Open Bite',
      tag: 'Common',
      tagColor: 'bg-blue-100 text-blue-700',
      description: 'A malocclusion where upper and lower teeth do not make contact when the mouth is closed. Can be anterior or posterior and is often linked to jaw skeletal discrepancies.',
      symptoms: ['Visible gap when biting', 'Lisping', 'Food biting issues'],
    },
    {
      icon: FlaskConical,
      title: 'Asymmetry',
      tag: 'Variable',
      tagColor: 'bg-purple-100 text-purple-700',
      description: 'Facial or jaw asymmetry occurs when the left and right sides of the jaw develop unevenly. Our AI detects subtle asymmetry patterns invisible to the naked eye.',
      symptoms: ['Uneven facial features', 'Crooked smile', 'Uneven bite'],
    },
  ];

  const steps = [
    {
      step: '01',
      icon: ImageIcon,
      title: 'Upload Your X-Ray',
      description: 'Securely upload your jaw X-ray or CBCT scan. Our system accepts standard DICOM and image formats.',
    },
    {
      step: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our CNN model analyzes the image in seconds, classifying jaw type and detecting deformity patterns.',
    },
    {
      step: '03',
      icon: FlaskConical,
      title: 'GAN Restoration',
      description: 'The GAN model generates a corrected visualization showing the expected post-surgery outcome.',
    },
    {
      step: '04',
      icon: Stethoscope,
      title: 'Consult & Plan',
      description: 'Review results with our AI chatbot or share the report with a nearby specialist for treatment planning.',
    },
  ];

  const faqs = [
    {
      q: 'How accurate is the CNN jaw classification model?',
      a: 'Our CNN model achieves a classification accuracy of 95% across the main jaw deformity categories (concave, convex, and normal). The model was trained on thousands of validated clinical X-rays and undergoes continuous improvement as more data is processed.',
    },
    {
      q: 'What types of images does the platform accept?',
      a: 'The platform accepts standard image formats (JPG, PNG, WEBP) as well as DICOM files commonly used in dental and orthognathic radiology. Lateral cephalometric X-rays and panoramic radiographs yield the best classification results.',
    },
    {
      q: 'Is my medical data secure and private?',
      a: 'Absolutely. Our platform is 100% HIPAA compliant. All uploaded images and patient data are encrypted in transit (TLS 1.3) and at rest (AES-256). We do not share patient data with any third parties, and you can request deletion of your data at any time.',
    },
    {
      q: 'What is the difference between the Patient and Doctor accounts?',
      a: 'Patient accounts give access to the AI chatbot powered by Groq LLaMA, which answers orthognathic-surgery-related questions in plain language. Doctor accounts unlock the full RAG-powered chatbot with source citations from dental literature, as well as detailed classification reports suitable for clinical use.',
    },
    {
      q: 'Do I need to install any software?',
      a: 'No installation is required. DentalAI is a fully web-based platform. You only need a modern browser (Chrome, Firefox, Edge, or Safari). All AI processing happens server-side — no GPU or special hardware is needed on your end.',
    },
    {
      q: 'Can the AI replace a consultation with a surgeon?',
      a: 'No — and it is not designed to. DentalAI is a decision-support tool that helps patients understand their condition and helps doctors accelerate preliminary analysis. All diagnoses and treatment plans must be confirmed by a licensed maxillofacial or orthognathic surgeon.',
    },
  ];

  const whyUs = [
    { icon: Zap, title: 'Instant Results', description: 'Get AI analysis in under 5 seconds, not days.' },
    { icon: Lock, title: 'Fully Secure', description: 'HIPAA-compliant with end-to-end encryption.' },
    { icon: CheckCircle2, title: 'Clinically Validated', description: 'Models trained on peer-reviewed datasets.' },
    { icon: Star, title: 'Expert-Backed', description: 'Developed with orthognathic surgery specialists.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-24 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary-light opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="animate-float">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Stethoscope className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">AI-Powered Dental Analysis</span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/ai-lab">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 glow-effect">
                    {t('getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary font-semibold px-8 py-3">
                    {t('learnMore')}
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start">
                {[
                  { label: '95% Accuracy', icon: CheckCircle2 },
                  { label: 'HIPAA Compliant', icon: Shield },
                  { label: '10K+ Patients', icon: Users },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <badge.icon className="h-4 w-4 text-white" />
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 grid grid-cols-2 gap-4 glow-effect">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/20 transition-colors animate-float"
                    style={{ animationDelay: `${index * 0.4}s` }}
                  >
                    <feature.icon className="h-9 w-9 text-white mx-auto mb-3" />
                    <p className="text-white font-medium text-sm">{feature.title}</p>
                  </div>
                ))}
              </div>

              <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float border border-white/20" style={{ animationDelay: '1s' }}>
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float border border-white/20" style={{ animationDelay: '2s' }}>
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
              Our Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive AI-Powered Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge artificial intelligence with medical expertise to provide
              accurate diagnosis and treatment planning for jaw deformities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:scale-105 transition-all duration-300 soft-shadow hover:medical-shadow">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mx-auto mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
              How It Works
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              From Upload to Insight in 4 Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined workflow makes AI-assisted orthognathic analysis accessible to both patients and clinicians.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-primary/20 z-0" />

            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg mb-5 text-2xl font-bold">
                  {step.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
              Conditions
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Jaw Conditions We Analyze
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI is trained to detect and assess a spectrum of orthognathic deformities — from common misalignments to rare congenital abnormalities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((condition, index) => (
              <Card key={index} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <condition.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${condition.tagColor}`}>
                      {condition.tag}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold">{condition.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{condition.description}</p>
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Key Symptoms</p>
                    <ul className="space-y-1">
                      {condition.symptoms.map((symptom, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/cnn-upload">
              <Button size="lg" className="gap-2">
                Analyze Your Jaw Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
                Why DentalAI
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Built for Accuracy. Designed for People.
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                We combine state-of-the-art deep learning with clinical knowledge to give you results you can actually trust — whether you're a patient seeking answers or a surgeon planning a procedure.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {whyUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover:scale-105 transition-transform soft-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about DentalAI — from how the models work to data privacy and account types.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center p-8 bg-secondary/50 rounded-2xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Our AI chatbot can answer your orthognathic surgery questions instantly.</p>
            <Link to="/chatbot">
              <Button className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Ask the AI Chatbot
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Stethoscope className="h-5 w-5 text-white" />
            <span className="text-white font-medium text-sm">Start Today — It's Free</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Dental Diagnosis?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of dental professionals and patients using our AI platform for accurate
            jaw deformity analysis and treatment planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="font-semibold px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary font-semibold px-8 py-3">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
