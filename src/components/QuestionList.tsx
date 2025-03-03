
import { useState } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DownloadCloud, Edit, Save, Trash } from 'lucide-react';
import { generateExcelFile } from '@/lib/excel-generator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface QuestionListProps {
  questions: Question[];
  onQuestionsUpdate: (questions: Question[]) => void;
}

const QuestionList = ({ questions, onQuestionsUpdate }: QuestionListProps) => {
  const { toast } = useToast();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  
  const handleEditClick = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditForm({ ...question });
  };
  
  const handleSaveEdit = () => {
    if (!editForm) return;
    
    const updatedQuestions = questions.map(q => 
      q.id === editForm.id ? { ...editForm } : q
    );
    
    onQuestionsUpdate(updatedQuestions);
    setEditingQuestionId(null);
    setEditForm(null);
    
    toast({
      title: "Question updated",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    onQuestionsUpdate(updatedQuestions);
    
    toast({
      title: "Question deleted",
      description: "The question has been removed from the list.",
    });
  };
  
  const handleExport = () => {
    generateExcelFile(questions);
  };
  
  const handleEditChange = (
    field: keyof Question, 
    value: string | string[], 
    optionIndex?: number
  ) => {
    if (!editForm) return;
    
    if (field === 'options' && typeof optionIndex === 'number') {
      const newOptions = [...editForm.options];
      newOptions[optionIndex] = value as string;
      setEditForm({ ...editForm, options: newOptions });
    } else {
      setEditForm({ ...editForm, [field]: value });
    }
  };
  
  const handleCorrectAnswerChange = (index: number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, correctAnswer: index });
  };
  
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">Generated Questions</h2>
        <Button 
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>Export to Excel</span>
        </Button>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <Card key={question.id} className="w-full overflow-hidden animate-scale-in border shadow-subtle">
            <CardHeader className="bg-secondary/50 flex flex-row items-start justify-between gap-4 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-0 text-xs font-medium">
                  Q{qIndex + 1}
                </Badge>
                {editingQuestionId === question.id ? (
                  <Input
                    value={editForm?.text || ''}
                    onChange={(e) => handleEditChange('text', e.target.value)}
                    className="flex-1 min-w-0 font-medium text-base"
                  />
                ) : (
                  <h3 className="text-base font-medium">{question.text}</h3>
                )}
              </div>
              {editingQuestionId === question.id ? (
                <Button 
                  onClick={handleSaveEdit} 
                  size="sm" 
                  className="min-w-[80px] px-2"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(question)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="grid gap-3">
                {(editForm?.id === question.id ? editForm.options : question.options).map((option, i) => (
                  <div 
                    key={i} 
                    className={`
                      flex items-center gap-3 p-3 rounded-md transition-colors
                      ${question.correctAnswer === i && editingQuestionId !== question.id 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' 
                        : 'bg-background border border-input'}
                      ${editForm?.correctAnswer === i && editingQuestionId === question.id
                        ? 'ring-1 ring-primary' 
                        : ''}
                    `}
                  >
                    <div className={`
                      w-6 h-6 flex-center rounded-full text-xs font-medium border
                      ${question.correctAnswer === i && editingQuestionId !== question.id
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                        : 'border-input bg-muted'}
                      ${editForm?.correctAnswer === i && editingQuestionId === question.id
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : ''}
                    `}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    
                    {editingQuestionId === question.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => handleEditChange('options', e.target.value, i)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant={editForm?.correctAnswer === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCorrectAnswerChange(i)}
                          className="h-9 px-3"
                        >
                          Correct
                        </Button>
                      </div>
                    ) : (
                      <span className={question.correctAnswer === i ? 'font-medium' : ''}>
                        {option}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
