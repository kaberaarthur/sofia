import React, { useState, ChangeEvent, useEffect } from 'react';
import ErrorAlert from '../../UiElements/ErrorAlert';
import config from '../../../config/config';


interface InstructionsProps {
    orderId: string;
  }

interface FileData {
    id?: number;
    original_name: string;
    generated_name: string;
    created_at: string;
    updated_at: string;
    file_orderid: string;
    file_title: string;
    file_update: string;
    file_name: string;
    file_url: string;
}

interface Result {
    fileData: FileData[];
}

const OrderFiles: React.FC<InstructionsProps> = ({ orderId }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [fileData, setFileData] = useState<FileData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);



    // Fetch File Data
    useEffect(() => {
        const fetchFileData = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/opsorderfiles?file_orderid=${orderId}`);
            if (!response.ok) {
            throw new Error('Failed to fetch file data');
            }
            const result: FileData[] = await response.json();
            setFileData(result);
            setLoading(false);
            console.log("File Data:", result); // Debug file data
        } catch (error) {
            setError(error as Error);
            setLoading(false);
        }
        };

        if (orderId) {
        fetchFileData();
        }
    }, [orderId]);


    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          setSelectedFiles(Array.from(event.target.files));
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
            const response = await fetch(`${config.apiBaseUrl}/files/upload/${orderId}`, {
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

      const handleDownload = (file_generatedname: string) => {
        // console.log(`Download Button Clicked: ${file_generatedname}`);
    
        // const downloadUrl = `https://masterswriters.us/sofia/storage/uploads/${file_generatedname}`;
        const downloadUrl = `http://127.0.0.1/sofia/storage/uploads/${file_generatedname}`;
        console.log(downloadUrl)
    
        // Open the download URL in a new window
        window.open(downloadUrl, '_blank');
      };

      const handleClick = (fileName: string) => {
        const fullUrl = `${config.fileHostUrl}${fileName}`;
        console.log(fullUrl);
        window.open(fullUrl, '_blank');
    };

    return (
        <>
            {/* Display Files */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                #
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                File Name
                            </th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                Uploaded On
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Download
                            </th>
                        </tr>
                    </thead>
                        <tbody>
                        {fileData && fileData.map((file, index) => (
                            <tr key={file.id}>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {index + 1}
                                    </h5>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {file.file_title}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {file.file_update}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <button className="w-full xl:mr-3 bg-success text-white p-2 text-xl" onClick={() => handleClick(file.file_name)}>
                                    Download
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Display Files*/}
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
                    <button className="w-1/3 xl:mr-3 bg-danger text-white p-2 text-xl" onClick={clearFiles}>
                            Clear
                        </button>
                    <button className="w-1/3 xl:mr-3 bg-primary text-white p-2 text-xl" onClick={uploadFiles}>
                            Upload
                        </button>
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
