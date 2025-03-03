
import { Question } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function generateExcelFile(questions: Question[]): void {
  // In a real implementation, we would use a library like SheetJS/xlsx
  // For now, we'll generate a CSV file which Excel can open
  
  try {
    // Create CSV content
    let csvContent = "Question,Option A,Option B,Option C,Option D,Correct Answer\n";
    
    questions.forEach((question) => {
      // Format each question for CSV
      const correctLetter = ['A', 'B', 'C', 'D'][question.correctAnswer];
      
      // Escape commas and quotes in text fields
      const escapedQuestion = question.text.replace(/"/g, '""');
      const escapedOptions = question.options.map(opt => opt.replace(/"/g, '""'));
      
      // Add row to CSV
      csvContent += `"${escapedQuestion}","${escapedOptions[0]}","${escapedOptions[1]}","${escapedOptions[2]}","${escapedOptions[3]}","${correctLetter}"\n`;
    });
    
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create URL for download
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mcq-questions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your questions have been exported to an Excel-compatible file.",
    });
  } catch (error) {
    console.error("Excel generation error:", error);
    toast({
      title: "Export failed",
      description: "There was a problem generating your export file. Please try again.",
      variant: "destructive",
    });
  }
}
