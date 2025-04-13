
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { getOpenAIApiKey, setOpenAIApiKey, clearOpenAIApiKey } from '@/lib/ai-generator';
import { Key, Check, X } from 'lucide-react';

const APIKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const storedKey = getOpenAIApiKey();
    setHasKey(!!storedKey);
    if (storedKey) {
      // Don't show the actual key, just a placeholder
      setApiKey('•'.repeat(16));
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey || apiKey.trim() === '' || apiKey === '•'.repeat(16)) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    try {
      setOpenAIApiKey(apiKey.trim());
      setIsOpen(false);
      setHasKey(true);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    clearOpenAIApiKey();
    setApiKey('');
    setHasKey(false);
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasKey ? "outline" : "secondary"}
          className="flex items-center gap-2"
          size="sm"
        >
          <Key className="h-4 w-4" />
          {hasKey ? "API Key Set" : "Set OpenAI API Key"}
          {hasKey && <Check className="h-4 w-4 text-green-500" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">Enter your OpenAI API key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Your API key is stored locally in your browser and is never sent to our servers.
            You can get an API key from <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noreferrer" className="text-primary underline">OpenAI's website</a>.
          </p>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-between">
          {hasKey && (
            <Button variant="outline" onClick={handleClear} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Remove Key
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeySettings;
