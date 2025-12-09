import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import ShoppingList from './components/ShoppingList';
import { AnalysisResult as AnalysisResultType, UploadStatus } from './types';
import { analyzeInteriorImage, generateVisualizedDesign } from './services/geminiService';
import { RefreshCw, AlertCircle, Wand2, Eye, Layout, Key, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  // App State
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalBase64, setOriginalBase64] = useState<string | null>(null);
  
  const [analysisData, setAnalysisData] = useState<AnalysisResultType | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check API Key on Mount
  useEffect(() => {
    const checkApiKey = async () => {
      // 1. Check if process.env.API_KEY is already available (e.g. local .env)
      if (process.env.API_KEY) {
        setApiKeyReady(true);
        setIsCheckingKey(false);
        return;
      }

      // 2. Check via AI Studio helper (if running in that environment)
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setApiKeyReady(hasKey);
        } catch (e) {
          console.error("Error checking API key status:", e);
          setApiKeyReady(false);
        }
      } else {
        // No key found and not in AI Studio environment
        setApiKeyReady(false);
      }
      setIsCheckingKey(false);
    };
    checkApiKey();
  }, []);

  const handleConnectApiKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success if promise resolves (race condition mitigation as per guidelines)
        setApiKeyReady(true);
      } catch (e) {
        console.error("Failed to select API key:", e);
        // If error contains "Requested entity was not found", we might want to prompt again, 
        // but generally just letting them try clicking again is safe.
      }
    }
  };

  const handleImageSelected = async (base64: string, url: string) => {
    setPreviewUrl(url);
    setOriginalBase64(base64);
    setStatus(UploadStatus.ANALYZING);
    setErrorMessage(null);
    setGeneratedImage(null);
    setIsGeneratingImage(false);
    setShowGenerated(false);

    try {
      // 1. Analyze the image first (Text/JSON)
      const result = await analyzeInteriorImage(base64);
      setAnalysisData(result);
      setStatus(UploadStatus.SUCCESS);

      // 2. Automatically trigger visualization (Image Gen)
      triggerVisualization(base64, result);

    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setStatus(UploadStatus.ERROR);
    }
  };

  const triggerVisualization = async (base64: string, result: AnalysisResultType) => {
    try {
      setIsGeneratingImage(true);
      const itemsToVisualize = result.shoppingList.map(item => item.itemName);
      const newImage = await generateVisualizedDesign(base64, result.designStyle, itemsToVisualize);
      setGeneratedImage(newImage);
      setShowGenerated(true); // Switch to the generated view automatically when ready
    } catch (err) {
      console.error("Visualization failed", err);
      // We don't block the UI if visualization fails, just don't show the toggle
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleReset = () => {
    setStatus(UploadStatus.IDLE);
    setPreviewUrl(null);
    setOriginalBase64(null);
    setAnalysisData(null);
    setGeneratedImage(null);
    setErrorMessage(null);
    setIsGeneratingImage(false);
    setShowGenerated(false);
  };

  // --- Render: Loading State ---
  if (isCheckingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
      </div>
    );
  }

  // --- Render: API Key Setup Screen ---
  if (!apiKeyReady) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 font-sans text-neutral-900">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center space-y-6 animate-fade-in-up">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Key className="w-8 h-8 text-neutral-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-3">Authentication Required</h2>
            {window.aistudio ? (
              <p className="text-neutral-500 text-sm leading-relaxed">
                To use InteriorAI, you need to connect your Google Gemini API key. 
                Please select a project with billing enabled.
              </p>
            ) : (
              <p className="text-neutral-500 text-sm leading-relaxed">
                API Key is missing. Please create a <code>.env</code> file in your project root with <code>API_KEY=your_key_here</code> to continue.
              </p>
            )}
          </div>

          {window.aistudio ? (
            <div className="space-y-4 pt-2">
              <button 
                onClick={handleConnectApiKey}
                className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Connect API Key
              </button>
              <div className="pt-2">
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  Billing Information <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-neutral-100 rounded-lg text-xs font-mono text-neutral-600 break-all">
              process.env.API_KEY is undefined
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Render: Main App ---
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-200">
      <Header />

      <main className="container mx-auto px-6 py-12 md:py-16 flex flex-col items-center">
        
        {/* Intro Text */}
        {status === UploadStatus.IDLE && (
          <div className="text-center mb-10 max-w-2xl animate-fade-in-down">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-neutral-900">
              Transform your space.
            </h2>
            <p className="text-lg text-neutral-500">
              Upload a photo or choose an example below to instantly analyze the style and get curated shopping recommendations tailored to your taste.
            </p>
          </div>
        )}

        {/* Upload Area or Preview */}
        {status === UploadStatus.IDLE ? (
          <ImageUploader 
            onImageSelected={handleImageSelected} 
            isLoading={false} 
          />
        ) : (
          <div className="w-full max-w-4xl animate-fade-in-up space-y-8">
            {/* Image Preview Card */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-100 group">
                
                {/* Main Image Display */}
                {showGenerated && generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="AI Redesign" 
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <img 
                    src={previewUrl || ''} 
                    alt="Original interior" 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Reset Button */}
                {status !== UploadStatus.ANALYZING && (
                  <button 
                    onClick={handleReset}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors shadow-sm text-neutral-600 hover:text-neutral-900 z-10"
                    title="Upload new photo"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}

                {/* Analysis Loading Overlay */}
                {status === UploadStatus.ANALYZING && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium text-neutral-800 animate-pulse">Analyzing Design Style...</p>
                  </div>
                )}

                {/* Visualization Loading Overlay (Subtle) */}
                {isGeneratingImage && status === UploadStatus.SUCCESS && !generatedImage && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md text-white p-3 rounded-lg flex items-center justify-between shadow-lg z-10 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                      <Wand2 className="w-5 h-5 animate-pulse text-purple-300" />
                      <span className="text-sm font-medium">Generating visual preview with recommended items...</span>
                    </div>
                    <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 w-1/2 animate-[shimmer_1s_infinite]"></div>
                    </div>
                  </div>
                )}
                
                {/* Generated Badge */}
                {showGenerated && generatedImage && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-900/80 backdrop-blur text-white text-xs font-medium rounded-full flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3 text-purple-300" />
                    AI Visualization
                  </div>
                )}
              </div>

              {/* View Toggle Controls */}
              {(generatedImage || isGeneratingImage) && status === UploadStatus.SUCCESS && (
                <div className="flex justify-center">
                  <div className="bg-white p-1 rounded-lg border border-neutral-200 shadow-sm inline-flex items-center gap-1">
                    <button
                      onClick={() => setShowGenerated(false)}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                        ${!showGenerated 
                          ? 'bg-neutral-100 text-neutral-900 shadow-sm' 
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                        }
                      `}
                    >
                      <Layout className="w-4 h-4" />
                      Original
                    </button>
                    <button
                      onClick={() => generatedImage && setShowGenerated(true)}
                      disabled={!generatedImage}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 relative
                        ${showGenerated 
                          ? 'bg-neutral-900 text-white shadow-sm' 
                          : 'text-neutral-500'
                        }
                        ${!generatedImage ? 'opacity-50 cursor-not-allowed' : 'hover:text-neutral-900 hover:bg-neutral-50'}
                        ${!generatedImage && !showGenerated ? 'hover:bg-transparent hover:text-neutral-500' : ''}
                      `}
                    >
                      <Wand2 className={`w-4 h-4 ${showGenerated ? 'text-purple-300' : ''}`} />
                      AI Redesign
                      {!generatedImage && isGeneratingImage && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {status === UploadStatus.ERROR && errorMessage && (
              <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 mx-auto max-w-2xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{errorMessage}</p>
                <button 
                  onClick={handleReset} 
                  className="ml-auto text-sm font-semibold hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Analysis Results */}
            {status === UploadStatus.SUCCESS && analysisData && (
              <>
                <AnalysisResult data={analysisData} />
                <ShoppingList items={analysisData.shoppingList} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-neutral-400 border-t border-neutral-200 mt-auto">
        <p>&copy; {new Date().getFullYear()} InteriorAI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;