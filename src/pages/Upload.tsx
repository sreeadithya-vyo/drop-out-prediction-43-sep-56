import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload as UploadIcon, 
  FileSpreadsheet, 
  Download, 
  CheckCircle,
  AlertCircle,
  FileText,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function Upload() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const sampleData = [
    { name: 'Rahul Verma', class: '10A', attendance: 62, grade: 'B', phone: '9812345601' },
    { name: 'Sara Patel', class: '12C', attendance: 89, grade: 'A', phone: '9812345603' },
    { name: 'Amit Kumar', class: '11B', attendance: 74, grade: 'C', phone: '9812345605' },
    { name: 'Priya Sharma', class: '9A', attendance: 45, grade: 'D', phone: '9812345607' },
    { name: 'Ravi Gupta', class: '10B', attendance: 91, grade: 'A', phone: '9812345609' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus('processing');
          
          // Simulate processing
          setTimeout(() => {
            setUploadStatus('success');
            setUploadedData(sampleData);
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    // In a real app, this would download an actual Excel template
    const csvContent = "Student Name,Class,Section,Attendance %,Current Grade,Student Phone,Parent Phone,Parent Email\n" +
                      "John Doe,10A,A,85,B,9812345678,9812345679,parent@email.com\n" +
                      "Jane Smith,11B,B,92,A,9812345680,9812345681,parent2@email.com";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadedData([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Data Upload</h1>
        <p className="text-muted-foreground">
          Upload student data to update risk assessments and contact information
        </p>
      </div>

      {/* Upload Instructions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Upload Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Supported Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• CSV files (.csv)</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Maximum 1,000 student records</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Required Fields</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Student Name</li>
                <li>• Class & Section</li>
                <li>• Attendance Percentage</li>
                <li>• Current Grade</li>
                <li>• Contact Information</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={downloadTemplate} className="gap-2">
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="w-5 h-5" />
            Upload Student Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadStatus === 'idle' && (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your Excel or CSV file, or click to browse
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button">
                  Choose File
                </Button>
              </label>
            </div>
          )}

          {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <UploadIcon className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {uploadStatus === 'uploading' ? 'Uploading File...' : 'Processing Data...'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {uploadStatus === 'uploading' 
                  ? 'Please wait while we upload your file'
                  : 'Analyzing student data and calculating risk scores'
                }
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={uploadProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-risk-low/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-risk-low" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-risk-low">Upload Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Your data has been processed and risk levels have been updated
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={resetUpload} variant="outline">
                  Upload Another File
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  View Dashboard
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-risk-high/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-risk-high" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-risk-high">Upload Failed</h3>
              <p className="text-muted-foreground mb-4">
                There was an error processing your file. Please check the format and try again.
              </p>
              <Button onClick={resetUpload} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadStatus === 'success' && uploadedData.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Upload Summary
            </CardTitle>
            <CardDescription>
              Preview of processed student data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-risk-low">{uploadedData.length}</div>
                <div className="text-sm text-muted-foreground">Records Processed</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-risk-high">2</div>
                <div className="text-sm text-muted-foreground">High Risk Detected</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Class</th>
                    <th className="text-left p-2 font-medium">Attendance</th>
                    <th className="text-left p-2 font-medium">Grade</th>
                    <th className="text-left p-2 font-medium">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedData.map((student, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">
                        <Badge variant="outline">{student.class}</Badge>
                      </td>
                      <td className="p-2">{student.attendance}%</td>
                      <td className="p-2">
                        <Badge variant="secondary">{student.grade}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge 
                          className={
                            student.attendance >= 80 ? 'bg-risk-low text-white' :
                            student.attendance >= 60 ? 'bg-risk-medium text-white' : 'bg-risk-high text-white'
                          }
                        >
                          {student.attendance >= 80 ? 'Low' : student.attendance >= 60 ? 'Medium' : 'High'} Risk
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}