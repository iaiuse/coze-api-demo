"use client";

import React, { useState } from 'react';
import { Settings, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FileResponse = {
  code: number;
  msg: string;
  data: {
    id: string;
    bytes: number;
    created_at: number;
    file_name: string;
  };
};

const FileUploadTest = () => {
  const [apiKey, setApiKey] = useState('');
  const [uploadResult, setUploadResult] = useState<FileResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.coze.cn/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      setUploadResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">文件上传测试</h2>
        <Dialog>
          <DialogTrigger>
            <Settings className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>设置</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label className="block mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="输入你的 API Key"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="mb-4">
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
        </div>
        <label className="block">
          <span className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
            选择文件上传
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.csv,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.tiff,.wav,.ogg"
          />
        </label>
        <p className="mt-2 text-sm text-gray-500">
          支持的格式：文档、图片、音频文件（最大 512MB）
        </p>
      </div>

      {isUploading && (
        <div className="mt-4 text-center text-gray-600">
          正在上传...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
          上传失败: {error}
        </div>
      )}

      {uploadResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">上传结果：</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileUploadTest; 