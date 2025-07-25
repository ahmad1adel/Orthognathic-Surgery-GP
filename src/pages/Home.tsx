import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Activity,
  Target
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-32">
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
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3">
                    {t('learnMore')}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="animate-pulse-slow">
                <div className="w-full h-96 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-20 w-20 text-white mx-auto mb-4 animate-float" />
                    <p className="text-white/80 text-lg">Interactive AI Demo</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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

      {/* Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-muted-foreground">
              Leading the way in AI-powered dental diagnostics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:scale-105 transition-transform soft-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Dental Diagnosis?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of dental professionals using our AI platform for accurate 
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3">
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