import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, previewUrl: string) => void;
  isLoading: boolean;
}

const DEMO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600&auto=format&fit=crop",
    label: "Bohemian Living"
  },
  {
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop",
    label: "Modern Industrial"
  },
  {
    url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600&auto=format&fit=crop",
    label: "Scandi Kitchen"
  }
];

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingDemoIndex, setLoadingDemoIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const previewUrl = URL.createObjectURL(file);
      onImageSelected(base64, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleClick = () => {
    if (!isLoading && loadingDemoIndex === null) {
      fileInputRef.current?.click();
    }
  };

  const handleDemoClick = async (url: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent dropzone click
    if (isLoading || loadingDemoIndex !== null) return;

    setLoadingDemoIndex(index);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageSelected(base64, url);
        setLoadingDemoIndex(null);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error loading demo image", error);
      setLoadingDemoIndex(null);
      alert("Could not load the demo image. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div 
        className={`
          relative w-full h-64 md:h-80 
          border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center gap-4 group
          ${isDragging 
            ? 'border-neutral-800 bg-neutral-50' 
            : 'border-neutral-300 hover:border-neutral-400 bg-white'
          }
          ${isLoading || loadingDemoIndex !== null ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          className="hidden" 
          accept="image/*"
          disabled={isLoading || loadingDemoIndex !== null}
        />

        <div className="p-4 bg-neutral-100 rounded-full group-hover:scale-110 transition-transform duration-300">
          {isLoading || loadingDemoIndex !== null ? (
            <Loader2 className="w-8 h-8 text-neutral-600 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-neutral-600" />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-lg font-medium text-neutral-800">
            {isLoading ? 'Analyzing Room...' : 'Upload an interior photo'}
          </p>
          <p className="text-sm text-neutral-500">
            {isLoading ? 'This may take a few seconds' : 'Drag and drop or click to browse'}
          </p>
        </div>

        {!isLoading && loadingDemoIndex === null && (
          <div className="absolute bottom-4 flex gap-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3"/> JPG, PNG, WEBP</span>
          </div>
        )}
      </div>

      {/* Demo Section */}
      {!isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium justify-center">
            <Sparkles className="w-4 h-4" />
            <span>Or try an example</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {DEMO_IMAGES.map((img, index) => (
              <button
                key={index}
                onClick={(e) => handleDemoClick(img.url, index, e)}
                disabled={loadingDemoIndex !== null}
                className={`
                  group relative overflow-hidden rounded-lg aspect-[4/3] border border-neutral-200
                  hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2 transition-all
                  ${loadingDemoIndex === index ? 'ring-2 ring-neutral-800 ring-offset-2' : ''}
                  ${loadingDemoIndex !== null && loadingDemoIndex !== index ? 'opacity-50' : ''}
                `}
              >
                <img 
                  src={img.url} 
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-xs font-medium text-white truncate w-full text-left">
                    {img.label}
                  </span>
                </div>
                {loadingDemoIndex === index && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;