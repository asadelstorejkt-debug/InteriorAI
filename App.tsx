import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import ShoppingList from './components/ShoppingList';
import { AnalysisResult as AnalysisResultType, UploadStatus } from './types';
import { analyzeInteriorImage } from './services/geminiService';
import { RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = async (base64: string, url: string) => {
    setPreviewUrl(url);
    setStatus(UploadStatus.ANALYZING);
    setErrorMessage(null);

    try {
      const result = await analyzeInteriorImage(base64);
      setAnalysisData(result);
      setStatus(UploadStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setStatus(UploadStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(UploadStatus.IDLE);
    setPreviewUrl(null);
    setAnalysisData(null);
    setErrorMessage(null);
  };

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
          <div className="w-full max-w-4xl animate-fade-in-up">
            {/* Image Preview Card */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-white">
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Uploaded interior" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Reset Button */}
              {status !== UploadStatus.ANALYZING && (
                <button 
                  onClick={handleReset}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors shadow-sm text-neutral-600 hover:text-neutral-900"
                  title="Upload new photo"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}

              {/* Loading Overlay */}
              {status === UploadStatus.ANALYZING && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium text-neutral-800 animate-pulse">Analyzing Design Style...</p>
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