import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import IntroStep from '@/components/kamdata/IntroStep';
import TestStep from '@/components/kamdata/TestStep';
import ResultsStep from '@/components/kamdata/ResultsStep';
import Footer from '@/components/kamdata/Footer';
import WhatsAppButton from '@/components/kamdata/WhatsAppButton';
import KamdataLogo from '@/components/kamdata/KamdataLogo';
import CommunityModal from '@/components/kamdata/CommunityModal';
import { supabase } from '@/lib/supabaseClient';
import { questions, sectionNames, sectionDescriptions } from '@/components/kamdata/testConfig';

const LOGO_URL_TRANSPARENT_BG = "https://horizons-cdn.hostinger.com/523ce8ca-63e1-4ac1-8cb2-73d544b3a60a/674667508ba54599274e5c8783c3c5bd.png";
const KAMDATA_BRAND_LOGO = "https://storage.googleapis.com/hostinger-horizons-assets-prod/523ce8ca-63e1-4ac1-8cb2-73d544b3a60a/321c660b51e356d0c9c9d16f6eaa1792.png";

export const SECTION_COLORS = {
  agil: '#0492C2', // Cerulean
  crecimiento: '#FC4C4E', // Strawberry
  exponencial: '#E8AC41', // Hunyadi Yellow
  default: '#EA4E51' // Kamdata Red (fallback or general)
};

function App() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
    empresa: '',
    roles: [],
    rol_otro_texto: '',
    ciudad: '',
    fuente_test: '',
    fuente_test_detalle_texto: '',
    fuente_test_detalle_red_social: '',
    terminos: false,
    info_mentorias: false,
  });
  const [currentSection, setCurrentSection] = useState('agil');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    agil: Array(questions.agil.length).fill(0),
    crecimiento: Array(questions.crecimiento.length).fill(0),
    exponencial: Array(questions.exponencial.length).fill(0)
  });
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const totalQuestions = Object.values(questions).flat().length;
    const answeredQuestions = Object.values(answers).flat().filter(ans => ans !== 0).length;
    setProgress((answeredQuestions / totalQuestions) * 100);
  }, [answers]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terminos || formData.nombre === '' || formData.celular === '' || formData.email === '' || formData.empresa === '' || formData.roles.length === 0 ) {
      toast({
        title: "⚠️ Faltan campos obligatorios",
        description: "Por favor, completa todos los campos marcados con * para continuar.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep('test');
    toast({
      title: "¡Perfecto! 🎉",
      description: "Comenzando tu evaluación de Chip Digital..."
    });
  };

  const calculateRawScore = (sectionAnswers) => {
    if (!sectionAnswers || sectionAnswers.length === 0) return 0;
    return sectionAnswers.reduce((sum, score) => sum + (score || 0), 0);
  };

  const calculateScorePercent = (sectionAnswers) => {
    if (!sectionAnswers || sectionAnswers.length === 0) return 0;
    const total = sectionAnswers.reduce((sum, score) => sum + (score || 0), 0);
    const maxPossibleScore = sectionAnswers.length * 4;
    if (maxPossibleScore === 0) return 0;
    return Math.round((total / maxPossibleScore) * 100);
  };

  const getOverallScorePercent = () => {
    const agilScore = calculateScorePercent(answers.agil);
    const crecimientoScore = calculateScorePercent(answers.crecimiento);
    const exponencialScore = calculateScorePercent(answers.exponencial);

    const validSections = [answers.agil, answers.crecimiento, answers.exponencial].filter(s => s.length > 0 && s.some(ans => ans !== 0));
    if (validSections.length === 0) return 0;

    return Math.round((agilScore + crecimientoScore + exponencialScore) / 3);
  };

  const saveResults = async (finalAnswers) => {
    const agilScore = calculateScorePercent(finalAnswers.agil);
    const crecimientoScore = calculateScorePercent(finalAnswers.crecimiento);
    const exponencialScore = calculateScorePercent(finalAnswers.exponencial);
    const overallScore = getOverallScorePercent();

    const resultData = {
      ...formData,
      answers_agil: finalAnswers.agil,
      answers_crecimiento: finalAnswers.crecimiento,
      answers_exponencial: finalAnswers.exponencial,
      score_agil: agilScore,
      score_crecimiento: crecimientoScore,
      score_exponencial: exponencialScore,
      overall_score: overallScore,
      completed_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('kamdata_test_results')
      .insert([resultData]);

    return { error };
  };

  const handleAnswer = async (score) => {
    const newAnswers = { ...answers };
    newAnswers[currentSection][currentQuestion] = score;
    setAnswers(newAnswers);

    const sections = ['agil', 'crecimiento', 'exponencial'];
    const isLastQuestionOfSection = currentQuestion === questions[currentSection].length - 1;
    const isLastSection = sections.indexOf(currentSection) === sections.length - 1;

    if (isLastQuestionOfSection && isLastSection) {
      setIsSubmitting(true);
      toast({
        title: "💾 Guardando y calculando resultados...",
        description: "Un momento por favor, estamos procesando tu perfil."
      });

      const { error } = await saveResults(newAnswers);

      if (error) {
        toast({
          title: "Error 😥",
          description: `No se pudieron guardar tus resultados: ${error.message}. Inténtalo de nuevo.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
      } else {
        toast({
          title: "¡Resultados Listos! ✅",
          description: "Mostrando tu perfil de Chip Digital."
        });
        setCurrentStep('results');
        setIsSubmitting(false);
      }
    } else if (isLastQuestionOfSection) {
      const currentIndex = sections.indexOf(currentSection);
      setCurrentSection(sections[currentIndex + 1]);
      setCurrentQuestion(0);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getScoreLevel = (scorePercent) => {
    if (scorePercent >= 85) return { level: 'Avanzado', color: SECTION_COLORS.agil, emoji: '🚀' }; // Avanzado usa color Ágil (Cerulean)
    if (scorePercent >= 60) return { level: 'Intermedio', color: SECTION_COLORS.exponencial, emoji: '⚡' }; // Intermedio usa color Exponencial (Hunyadi Yellow)
    return { level: 'Inicial', color: SECTION_COLORS.crecimiento, emoji: '🛠️' }; // Inicial usa color Crecimiento (Strawberry)
  };

  const getInterpretation = (rawScore, sectionKey) => {
    const maxScoreForSection = questions[sectionKey].length * 4;
    const percent = (rawScore / maxScoreForSection) * 100;

    if (percent >= 80) return "Bien activada. ¡Sigue potenciándola!";
    if (percent >= 60) return "En buen camino. Fortalece hábitos.";
    if (percent >= 40) return "En transición. La conciencia es el primer paso.";
    return "Gran oportunidad de crecimiento.";
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Toaster />

      <div className={`w-full py-4 flex justify-center items-center ${currentStep !== 'test' ? 'bg-[#0492C2]' : 'bg-transparent'}`}>
        {currentStep !== 'test' && currentStep !== 'results' && (
            <KamdataLogo
                src={LOGO_URL_TRANSPARENT_BG}
                alt="Kamdata Logo"
                width={250}
                height={83}
                className="my-4"
            />
        )}
        {currentStep === 'results' && (
           <KamdataLogo
                src={KAMDATA_BRAND_LOGO}
                alt="Kamdata Brand Logo"
                width={250}
                height={83}
                className="my-4"
            />
        )}
      </div>


      <main className="flex-grow">
        {currentStep === 'intro' && (
          <IntroStep
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
          />
        )}

        {currentStep === 'test' && (
          <TestStep
            currentSection={currentSection}
            currentQuestion={currentQuestion}
            progress={progress}
            questions={questions}
            sectionNames={sectionNames}
            sectionDescriptions={sectionDescriptions}
            onAnswer={handleAnswer}
            logoSrc={LOGO_URL_TRANSPARENT_BG}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'results' && (
          <ResultsStep
            formData={formData}
            answers={answers}
            calculateRawScore={calculateRawScore}
            calculateScorePercent={calculateScorePercent}
            getScoreLevel={getScoreLevel}
            getOverallScorePercent={getOverallScorePercent}
            getInterpretation={getInterpretation}
            logoSrc={KAMDATA_BRAND_LOGO}
            onOpenCommunityModal={() => setShowCommunityModal(true)}
          />
        )}
      </main>
      <Footer logoSrc={KAMDATA_BRAND_LOGO} />
      <WhatsAppButton />
      {showCommunityModal && (
        <CommunityModal onClose={() => setShowCommunityModal(false)} />
      )}
    </div>
  );
}

export default App;