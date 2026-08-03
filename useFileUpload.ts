import { useCallback } from 'react';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'done' | 'error' | 'converting';
  progress: number;
  url?: string;
}

export interface UseFileUploadReturn {
  uploadFiles: (
    files: File[],
    category: string,
    onProgress: (fileId: string, progress: number) => void,
    onComplete: (fileId: string, url: string) => void,
    onError: (fileId: string) => void
  ) => void;
  convertDWG: (
    fileId: string,
    onProgress: (progress: number) => void,
    onComplete: (url: string) => void
  ) => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const convertDWG = useCallback(
    (
      fileId: string,
      onProgress: (progress: number) => void,
      onComplete: (url: string) => void
    ) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        if (currentProgress >= 100) {
          clearInterval(interval);
          onProgress(100);
          onComplete(`https://storage.metrio.io/converted/${fileId}.pdf`);
        } else {
          onProgress(currentProgress);
        }
      }, 600);
    },
    []
  );

  const uploadFiles = useCallback(
    (
      files: File[],
      category: string,
      onProgress: (fileId: string, progress: number) => void,
      onComplete: (fileId: string, url: string) => void,
      onError: (fileId: string) => void
    ) => {
      files.forEach((file) => {
        const fileId = `${category}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        let progress = 0;

        const interval = setInterval(() => {
          const step = Math.floor(Math.random() * 15) + 15; // 15-30%
          progress += step;

          if (progress >= 100) {
            clearInterval(interval);
            onProgress(fileId, 100);
            
            // If DWG, send for conversion
            const isDwg = file.name.toLowerCase().endsWith('.dwg');
            if (isDwg) {
              onProgress(fileId, 100);
              const simulatedUrl = `https://storage.metrio.io/uploads/${category}/${file.name}`;
              onComplete(fileId, simulatedUrl);
            } else {
              const simulatedUrl = `https://storage.metrio.io/uploads/${category}/${file.name}`;
              onComplete(fileId, simulatedUrl);
            }
          } else {
            onProgress(fileId, progress);
          }
        }, 200);
      });
    },
    []
  );

  return {
    uploadFiles,
    convertDWG,
  };
}
