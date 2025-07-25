import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Conditions from "./pages/Conditions";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Chatbot from "./pages/Chatbot";
import CNNUpload from "./pages/CNNUpload";
import GANUpload from "./pages/GANUpload";
import Gallery from "./pages/Gallery";
import FindClinics from "./pages/FindClinics";
import AILab from "./pages/AILab";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientProfile from "./pages/PatientProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/conditions" element={<Conditions />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/cnn-upload" element={<CNNUpload />} />
                <Route path="/gan-upload" element={<GANUpload />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/find-clinics" element={<FindClinics />} />
                <Route path="/ai-lab" element={<AILab />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/patient-profile" element={<PatientProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
