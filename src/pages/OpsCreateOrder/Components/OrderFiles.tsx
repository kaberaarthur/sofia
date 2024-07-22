import React, { useState, ChangeEvent, useEffect } from 'react';
import ErrorAlert from '../../UiElements/ErrorAlert';


interface InstructionsProps {
    orderId: string;
    onFilesSelected: (files: File[]) => void;
  }

interface FileData {
    id?: number;
    original_name: string;
    generated_name: string;
    created_at: string;
    updated_at: string;
    file_orderid: string;
}

interface Result {
    fileData: FileData[];
}

const OrderFiles: React.FC<InstructionsProps> = ({ orderId, onFilesSelected }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);


    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          const files = Array.from(event.target.files);
          setSelectedFiles(Array.from(event.target.files));
          onFilesSelected(files); // Pass the selected files to the parent component
        }
      };
    
      const removeFile = (index: number) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
      };
    
      const clearFiles = () => {
        setSelectedFiles([]);
        setResponses([]);
        // setShowAlert(false);
        (document.getElementById('file') as HTMLInputElement).value = '';
      };
    
      const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
          alert("Please select files to upload");
          return;
        }
    
        const newResponses: string[] = [];
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
    
          try {
            const response = await fetch(`http://127.0.0.1:8000/api/files/upload/${orderId}`, {
              method: 'POST',
              body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
              newResponses.push(`File ${file.name} uploaded successfully. URL: ${result.url}`);
              console.log(`File ${file.name} uploaded successfully. URL: ${result.url}`)
              console.log("This is the Order ID" + orderId)
              setShowAlert(true);
            } else {
              newResponses.push(`Error uploading file ${file.name}: ${result.message}`);
              setShowErrorAlert(true);
            }
          } catch (error) {
            if (error instanceof Error) {
              newResponses.push(`Error uploading file ${file.name}: ${error.message}`);
              setShowErrorAlert(true);
            } else {
              newResponses.push(`Error uploading file ${file.name}: An unknown error occurred`);
              setShowErrorAlert(true);
            }
          }
        }
        window.location.reload();
    
        setResponses(newResponses);
        clearFiles();
        // console.log(newResponses);
      };


    return (
        <>
            <div className="bg-gray-100 p-10">
                <div className="max-w-lg mx-auto bg-white p-5 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-1">Upload Files</h1>
                    <p className="text-red-600 text-sm mb-5">Only files below 50MB allowed</p>
                    <input
                    type="file"
                    id="file"
                    name="file"
                    multiple
                    onChange={handleFileSelect}
                    className="mb-5 p-2 border rounded w-full"
                    />
                    <ul id="file-list" className="mb-5">
                    {selectedFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center py-2">
                        <span className="text-indigo-800">{file.name}</span>
                        <button onClick={() => removeFile(index)} className="text-red-500 text-md">
                            x
                        </button>
                        </li>
                    ))}
                    </ul>
                    {showAlert && (
                    <div className="mt-5">
                        <ErrorAlert/>
                    </div>
                    )}
                    {showErrorAlert && (
                    <div className="mt-5">
                        <ErrorAlert/>
                    </div>
                    )}
                    <div className="flex justify-between">
                        <button className="w-1/3 xl:mr-3 bg-danger text-white p-2 text-sm" onClick={clearFiles}>
                            Clear Files
                        </button>
                        {/* 
                        <button className="w-1/3 xl:mr-3 bg-primary text-white p-2 text-xl" onClick={uploadFiles}>
                            Upload
                        </button>
                        */}
                    </div>
                    <p id="response" className="mt-5 whitespace-pre-line">
                    {responses.join('\n')}
                    </p>
                </div>
            </div>
        </>
    )
};

export default OrderFiles;
