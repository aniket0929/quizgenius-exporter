
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { extractTextFromPDF } from '@/lib/pdf-extractor';
import { FileText, Upload } from 'lucide-react';

interface FileUploaderProps {
  onContentLoaded: (content: string, type: FileType) => void;
}

const FileUploader = ({ onContentLoaded }: FileUploaderProps) => {
  const [text, setText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTextSubmit = () => {
    if (!text.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter some text before generating questions.",
        variant: "destructive",
      });
      return;
    }
    
    onContentLoaded(text, 'text');
  };
  
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const extractedText = await extractTextFromPDF(file);
      onContentLoaded(extractedText, 'pdf');
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: "Processing error",
        description: "There was a problem processing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Text Input</span>
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>PDF Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="animate-fade-in">
          <Textarea
            placeholder="Paste your text content here..."
            className="min-h-[300px] p-6 text-base resize-none transition-all focus-visible:ring-primary"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleTextSubmit} 
              className="relative overflow-hidden group"
              size="lg"
            >
              <span className="relative z-10">Generate Questions</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="pdf" className="animate-fade-in">
          <div
            className={`
              min-h-[300px] rounded-lg border-2 border-dashed p-6 flex-center flex-col
              transition-all duration-300
              ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-accent/50'}
              ${isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-accent/80 cursor-pointer'}
            `}
            onClick={handleButtonClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileInputChange}
              disabled={isLoading}
            />
            
            <div className="flex-center flex-col gap-4 text-center">
              <div className={`w-16 h-16 rounded-full flex-center bg-primary/10 ${isLoading ? 'animate-pulse-subtle' : ''}`}>
                <Upload className={`w-8 h-8 text-primary ${dragActive ? 'animate-float' : ''}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">
                  {isLoading ? 'Processing PDF...' : 'Upload a PDF file'}
                </h3>
                <p className="text-muted-foreground">
                  {dragActive 
                    ? 'Drop to upload' 
                    : isLoading 
                      ? 'This may take a moment...' 
                      : 'Drag and drop here or click to browse'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileUploader;
