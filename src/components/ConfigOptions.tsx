
import { AppConfig } from '@/types';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface ConfigOptionsProps {
  config: AppConfig;
  onChange: (config: AppConfig) => void;
}

const ConfigOptions = ({ config, onChange }: ConfigOptionsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl p-6 glass-card animate-scale-in">
      <div className="flex items-center gap-2 mb-5">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-medium">Customization Options</h2>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="question-count" className="text-base font-medium">
              Number of Questions: {config.numberOfQuestions}
            </Label>
          </div>
          <Slider
            id="question-count"
            min={5}
            max={20}
            step={5}
            value={[config.numberOfQuestions]}
            onValueChange={(values) => onChange({ ...config, numberOfQuestions: values[0] })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base font-medium">Difficulty Level</Label>
          <RadioGroup
            value={config.difficultyLevel}
            onValueChange={(value) => onChange({ ...config, difficultyLevel: value as AppConfig['difficultyLevel'] })}
            className="flex items-center gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ConfigOptions;
