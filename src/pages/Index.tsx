
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppConfig, FileType, Question } from '@/types';
import FileUploader from '@/components/FileUploader';
import ConfigOptions from '@/components/ConfigOptions';
import QuestionList from '@/components/QuestionList';
import Footer from '@/components/Footer';
import { generateQuestions } from '@/lib/ai-generator';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Brain, FileText, HelpCircle, Lightbulb, Save, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOCAL_STORAGE_KEYS = {
  UPLOADED_CONTENT: 'quizcraft_uploaded_content',
  FILE_TYPE: 'quizcraft_file_type',
  QUESTIONS: 'quizcraft_questions',
  CONFIG: 'quizcraft_config'
};

const Index = () => {
  const { toast } = useToast();
  const [uploadedContent, setUploadedContent] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    numberOfQuestions: 10,
    difficultyLevel: 'medium',
  });
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEYS.UPLOADED_CONTENT);
      const savedFileType = localStorage.getItem(LOCAL_STORAGE_KEYS.FILE_TYPE) as FileType;
      const savedQuestions = localStorage.getItem(LOCAL_STORAGE_KEYS.QUESTIONS);
      const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEYS.CONFIG);
      
      if (savedContent) setUploadedContent(savedContent);
      if (savedFileType) setFileType(savedFileType);
      if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
      if (savedConfig) setConfig(JSON.parse(savedConfig));
      
      if (savedContent || savedQuestions) {
        toast({
          title: "Data loaded from local storage",
          description: "Your previously saved content and questions have been restored.",
        });
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, [toast]);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (uploadedContent) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.UPLOADED_CONTENT, uploadedContent);
    }
    if (fileType) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FILE_TYPE, fileType);
    }
    if (questions.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [uploadedContent, fileType, questions, config]);
  
  const handleContentLoaded = (content: string, type: FileType) => {
    setUploadedContent(content);
    setFileType(type);
    setQuestions([]);
    
    toast({
      title: `${type === 'pdf' ? 'PDF' : 'Text'} content loaded`,
      description: `${type === 'pdf' ? 'PDF content has been extracted' : 'Text has been received'}. Configure options and generate questions.`,
    });
  };
  
  const handleGenerateQuestions = async () => {
    if (!uploadedContent) {
      toast({
        title: "No content loaded",
        description: "Please upload a PDF or enter text before generating questions.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const generatedQuestions = await generateQuestions(uploadedContent, config);
      
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        toast({
          title: "Questions generated successfully",
          description: `Generated ${generatedQuestions.length} questions from your content.`,
        });
      }
    } catch (error) {
      console.error("Question generation error:", error);
      toast({
        title: "Generation failed",
        description: "There was a problem generating questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleReset = () => {
    // Clear state
    setUploadedContent(null);
    setFileType(null);
    setQuestions([]);
    setConfig({
      numberOfQuestions: 10,
      difficultyLevel: 'medium',
    });
    
    // Clear localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEYS.UPLOADED_CONTENT);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.FILE_TYPE);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CONFIG);
    
    toast({
      title: "Reset complete",
      description: "All content and generated questions have been cleared from local storage.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-10 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center justify-center mb-2">
              <Brain className="w-8 h-8 mr-2 text-primary" />
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              QuizCraft AI
            </h1>
            <p className="text-lg md:text-xl font-medium text-primary/80 mb-1">
              Intelligent MCQ Generator
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Transform your PDF documents or text content into high-quality multiple-choice questions 
              in seconds. Perfect for educators, trainers, and content creators.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Upload PDF or Text</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">AI-Generated Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Export to Excel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Save className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Auto-Save to Local Storage</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <Link to="/faq">
                  <HelpCircle className="w-4 h-4" />
                  <span>Frequently Asked Questions</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10">
        <section className="mb-16">
          {!uploadedContent ? (
            <div className="animate-blur-in">
              <FileUploader onContentLoaded={handleContentLoaded} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Content loaded from {fileType === 'pdf' ? 'PDF' : 'text input'}
                  </div>
                  <h2 className="text-xl font-medium">Configure and Generate</h2>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="text-muted-foreground"
                >
                  Reset
                </Button>
              </div>
              
              <ConfigOptions config={config} onChange={setConfig} />
              
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating}
                  size="lg"
                  className="relative overflow-hidden group py-6 px-8"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
                    {!isGenerating && <Sparkles className="w-4 h-4 ml-1 animate-pulse" />}
                  </span>
                  {isGenerating && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}
        </section>
        
        {questions.length > 0 && (
          <section>
            <Separator className="my-10" />
            <QuestionList 
              questions={questions} 
              onQuestionsUpdate={setQuestions} 
            />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
