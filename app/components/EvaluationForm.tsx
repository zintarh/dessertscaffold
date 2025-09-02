'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  topicAtom, 
  keywordsAtom, 
  statusAtom, 
  errorAtom,
  setTopicAtom,
  addKeywordAtom,
  removeKeywordAtom,
  evaluateTopicAtom,
  resetAtom,
  initializeFromStorageAtom
} from '@/lib/stores/evaluationStore';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Loader2, Plus, X, Search, RotateCcw } from 'lucide-react';

/**
 * Research Topic Evaluation Form Component
 * Provides UI for submitting research topics and keywords for evaluation
 */

export function EvaluationForm() {
  const [topic, setTopic] = useAtom(topicAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const [status] = useAtom(statusAtom);
  const [error] = useAtom(errorAtom);
  
  const [, updateTopic] = useAtom(setTopicAtom);
  const [, addKeyword] = useAtom(addKeywordAtom);
  const [, removeKeyword] = useAtom(removeKeywordAtom);
  const [, evaluateTopic] = useAtom(evaluateTopicAtom);
  const [, reset] = useAtom(resetAtom);
  const [, initializeFromStorage] = useAtom(initializeFromStorageAtom);

  const [newKeyword, setNewKeyword] = useState('');
  const [topicError, setTopicError] = useState('');

  const isLoading = status === 'loading';
  const canSubmit = topic.trim().length >= 3 && topic.trim().length <= 200 && !isLoading;

  // Initialize from localStorage on mount
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  const handleTopicChange = (value: string) => {
    updateTopic(value);
    
    // Validate topic length
    if (value.trim().length < 3 && value.trim().length > 0) {
      setTopicError('Topic must be at least 3 characters long');
    } else if (value.trim().length > 200) {
      setTopicError('Topic must be less than 200 characters');
    } else {
      setTopicError('');
    }
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed.length >= 2 && trimmed.length <= 50) {
      addKeyword(trimmed);
      setNewKeyword('');
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      await evaluateTopic();
    }
  };

  const handleReset = () => {
    reset();
    setNewKeyword('');
    setTopicError('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Research Topic Evaluation
        </CardTitle>
        <CardDescription>
          Enter your research topic and optional keywords to get a comprehensive evaluation 
          including novelty, trends, methodology, and funding potential.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Research Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Research Topic *
            </Label>
            <Input
              id="topic"
              type="text"
              placeholder="e.g., Machine learning in agriculture"
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className={topicError ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {topicError && (
              <p className="text-sm text-red-600">{topicError}</p>
            )}
            <p className="text-xs text-gray-500">
              {topic.length}/200 characters
            </p>
          </div>

          {/* Keywords Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Additional Keywords (Optional)
            </Label>
            
            {/* Add Keyword Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., crop yield prediction"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                className="flex-1"
                disabled={isLoading || keywords.length >= 10}
                maxLength={50}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddKeyword}
                disabled={
                  isLoading || 
                  keywords.length >= 10 || 
                  newKeyword.trim().length < 2 ||
                  keywords.includes(newKeyword.trim())
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Keywords Display */}
            {keywords.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        disabled={isLoading}
                        className="ml-1 hover:text-red-600 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {keywords.length}/10 keywords
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Evaluate Topic
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Loading State Info */}
          {isLoading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 mb-2 font-medium">
                Analyzing your research topic...
              </p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>• Querying academic databases (OpenAlex, Semantic Scholar, CORE, Crossref)</p>
                <p>• Searching funding opportunities (NIH, CORDIS, Grants.gov)</p>
                <p>• Processing and deduplicating results</p>
                <p>• Generating AI-powered evaluation</p>
                <p>• Creating HTML and PDF reports</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                This typically takes 15-30 seconds...
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
