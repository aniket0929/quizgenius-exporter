
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, ChevronLeft, BookOpen, Sparkles, Brain } from 'lucide-react';

const Faq = () => {
  const faqItems = [
    {
      question: "What is QuizCraft AI?",
      answer: "QuizCraft AI is an intelligent tool that transforms your PDF documents or text content into high-quality multiple-choice questions. It uses advanced AI to analyze your content and generate relevant questions with answer options."
    },
    {
      question: "How do I use QuizCraft AI?",
      answer: "Simply upload a PDF document or paste your text content, configure the number of questions and difficulty level you want, then click 'Generate Questions'. The AI will analyze your content and create multiple-choice questions that you can review, edit, and export."
    },
    {
      question: "What types of content work best?",
      answer: "QuizCraft AI works best with educational texts, training materials, articles, research papers, and other content with clear factual information. The more structured and informative your content is, the better the quality of generated questions."
    },
    {
      question: "How many questions can I generate?",
      answer: "You can configure the number of questions you want to generate, from a few questions to 20 or more. However, keep in mind that the quality and variety of questions depend on the length and richness of your input content."
    },
    {
      question: "Can I edit the generated questions?",
      answer: "Yes! After questions are generated, you can review and edit any question text, modify answer options, or change which answer is marked as correct before exporting."
    },
    {
      question: "How do I export my questions?",
      answer: "Once you're satisfied with your generated questions, simply click the 'Export to Excel' button. This will download an Excel file containing all your questions, answer options, and marked correct answers in an organized format."
    },
    {
      question: "What difficulty levels are available?",
      answer: "QuizCraft AI offers three difficulty levels: Easy, Medium, and Hard. These settings adjust how challenging the generated questions will be, with harder questions requiring deeper understanding of the content."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-8 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center justify-center mb-2">
              <HelpCircle className="w-8 h-8 mr-2 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Find answers to common questions about QuizCraft AI and how to make the most of our question generation tools.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-8 text-muted-foreground" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-1 overflow-hidden bg-card">
              <AccordionTrigger className="px-4 py-4 hover:bg-muted/40 text-left font-medium text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-primary/10">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">Still have questions?</span>
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link to="/">
                <Brain className="w-4 h-4" />
                <span>Try QuizCraft AI Now</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer will be rendered by Footer component */}
    </div>
  );
};

export default Faq;
