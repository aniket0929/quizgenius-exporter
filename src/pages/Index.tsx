
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppConfig, FileType, Question } from '@/types';
import FileUploader from '@/components/FileUploader';
import ConfigOptions from '@/components/ConfigOptions';
import QuestionList from '@/components/QuestionList';
import { generateQuestions } from '@/lib/ai-generator';
import { useToast } from '@/components/ui/use-toast';

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
    setUploadedContent(null);
    setFileType(null);
    setQuestions([]);
    setConfig({
      numberOfQuestions: 10,
      difficultyLevel: 'medium',
    });
    
    toast({
      title: "Reset complete",
      description: "All content and generated questions have been cleared.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-8 bg-gradient-to-r from-secondary/80 to-secondary">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 text-balance">
              AI-Powered MCQ Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Transform your PDF documents or text content into high-quality multiple-choice questions. 
              Perfect for educators, trainers, and content creators.
            </p>
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
                  className="relative overflow-hidden group py-6"
                >
                  <span className="relative z-10">
                    {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
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
      
      <footer className="py-6 border-t">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              AI-Powered MCQ Generator - Transform your content into questions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
