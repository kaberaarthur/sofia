import React, {useEffect, useState} from 'react';

interface ApiResponse {
    data: ACLevel[];
}

interface PpTypesResponse {
    data: PpType[];
}

interface ACLevel {
    aclevel_id: number;
    aclevel_value: string;
    aclevel_name: string;
    aclevel_checked: boolean;
}

interface PpType {
    pptype_id: number;
    pptype_pvalue: number;
    pptype_name: string;
}

const Main: React.FC = () => {
    const [ACLevels, setACLevels] = useState<ACLevel[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Handle PP Types
    const [PpTypes, setPpTypes] = useState<PpType[]>([]);
    const [selectedPpType, setSelectedPpType] = useState<string>('Essay (Any Type)');
    const [ppTypeValue, setPpTypeValue] = useState<number>(1.0);
    const [ppTypeName, setPpTypeName] = useState<string>('Essay (Any Type)');

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchACLevelsData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opsaclevels`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const aclevelsResult: ApiResponse = await response.json();
            setACLevels(aclevelsResult.data);

            // Set the default selected button based on aclevel_checked field
            const defaultSelected = aclevelsResult.data.find(level => level.aclevel_checked);
            setSelectedId(defaultSelected ? defaultSelected.aclevel_id : null);

            setLoading(false);
        } catch (error) {
            setError(error as Error);
            setLoading(false);
        }
    };

    const fetchPptypesData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opspptypes`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const pptypesResult: PpTypesResponse = await response.json();
            setPpTypes(pptypesResult.data);
            setLoading(false);

            console.log(pptypesResult.data)
        } catch (error) {
            setError(error as Error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchACLevelsData();
        fetchPptypesData();
    }, []);

    const selectButton = (buttonId: number) => {
        setSelectedId(buttonId);
    };

    if (!ACLevels) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row w-full md:w-4/6 space-y-4 md:space-y-0 md:space-x-4">
                {/* First Column */}
                <div className="w-full md:w-2/3 p-4 bg-white shadow rounded">
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 md:text-md text-gray-700 mb-2 md:mb-0 font-bold pr-2">Academic Level</label>
                        <div id="button-group" className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            {ACLevels.map((level, index) => (
                                <button
                                    key={level.aclevel_id}
                                    onClick={() => selectButton(level.aclevel_id)}
                                    className={`btn w-full md:w-auto px-2 py-2 text-gray-900 bg-white border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                        selectedId === level.aclevel_id ? 'bg-blue-950 text-white' : ''
                                    }`}
                                >
                                    {level.aclevel_name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Type of Paper</label>
                        <div id="button-group" className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <select 
                                id="paperType" 
                                className="w-11/12 p-2 border border-gray-300 rounded" 
                                onChange={(e) => {
                                    const selectedIndex = e.target.selectedIndex;

                                    // Find the selected PpType object
                                    const selectedPpType = PpTypes[selectedIndex];
                                    console.log(selectedPpType);
                                    console.log(selectedPpType["pptype_pvalue"]);
                                    console.log(selectedPpType["pptype_name"]);

                                    if(selectedPpType) {
                                        setPpTypeValue(selectedPpType["pptype_pvalue"]);
                                        setPpTypeName(selectedPpType["pptype_name"]);
                                    }
                                    
                                }}
                            >
                                {PpTypes.map((type) => (
                                    <option key={type.pptype_id} value={type.pptype_pvalue}>{type.pptype_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <label htmlFor="email" className="w-1/4 text-gray-700">Email:</label>
                        <input 
                            type="text" 
                            id="email" 
                            className="w-4/5 p-2 border border-gray-300 rounded" 
                        />
                    </div>
                    <div className="flex items-center pb-4">
                        <label htmlFor="fullname" className="w-1/4 text-gray-700">Fullname:</label>
                        <input 
                            type="text" 
                            id="fullname" 
                            className="w-4/5 p-2 border border-gray-300 rounded" 
                        />
                    </div>
                    <div className="flex items-center pb-4">
                        <label htmlFor="paperType" className="w-1/4 text-gray-700">Type of Paper:</label>
                        <select id="paperType" className="w-4/5 p-2 border border-gray-300 rounded">
                            <option value="">Select Type</option>
                            <option value="essay">Essay</option>
                            <option value="research">Research Paper</option>
                            <option value="report">Report</option>
                        </select>
                    </div>
                </div>

                {/* Second Column */}
                <div className="w-full md:w-1/3 p-4 bg-green-100 shadow h-1/6">
                    <div className="mb-2 text-base text-gray-700">Total: <span className='font-semibold text-gray-900'>$24</span></div>
                    <div className="mb-2 text-base text-gray-700">Assignment <span className='font-semibold text-gray-900'>$24</span></div>
                    <div className="mb-2 text-base text-gray-700">2 Pages x 12.50 <span className='font-semibold text-gray-900'>USD 52.50</span></div>
                    <div className="mb-2 text-base text-gray-700">1 PPT Slide <span className='font-semibold text-gray-900'>USD 7.50</span></div>
                    <div className="absolute inset-x-0 top-0 border-t border-gray-700 my-2"></div>
                    <div className="mb-2 text-base text-gray-700">Total Price <span className='font-semibold text-gray-900'>USD 60</span></div>
                    <div className="absolute inset-x-0 top-0 border-b border-gray-700 my-2"></div>
                    <div className="flex items-center">
                        <input 
                            type="text" 
                            placeholder="Enter Coupon" 
                            className="w-2/3 p-2 border border-gray-300 rounded" 
                        />
                        <button className="w-1/3 p-2 ml-2 text-white bg-blue-950 rounded hover:bg-blue-700">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
