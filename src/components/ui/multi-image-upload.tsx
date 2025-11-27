'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';

interface MultiImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  className = '',
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        convertToBase64Multiple(imageFiles);
      }
    },
    [value]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        convertToBase64Multiple(imageFiles);
      }
    },
    [value]
  );

  const convertToBase64Multiple = (files: File[]) => {
    const remainingSlots = maxImages - value.length;
    const filesToProcess = files.slice(0, remainingSlots);

    Promise.all(
      filesToProcess.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((base64Images) => {
      onChange([...value, ...base64Images]);
    });
  };

  const handleClick = () => {
    if (value.length < maxImages) {
      document.getElementById('multi-image-upload-input')?.click();
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Image Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {value.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image
                    src={image}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        {value.length < maxImages && (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              {value.length === 0 ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each (max {maxImages} images)
                  </p>
                </>
              ) : (
                <>
                  <Plus className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Add more images ({value.length}/{maxImages})
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <input
          id="multi-image-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
