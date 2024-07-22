import React, {useEffect, useState} from 'react';
import OrderFiles from './Components/OrderFiles';


interface ApiResponse {
    data: ACLevel[];
}

interface PpTypesResponse {
    data: PpType[];
}

interface SubjectResponse {
    data: Subject[];
}

interface CitationResponse {
    data: Citation[];
}

interface PricingResponse {
    data: Pricing[];
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

interface Subject {
    sub_id: number;
    sub_pvalue: number;
    sub_name: string;
    sub_site: string;
    xx: number;
}

interface Citation {
    citation_name: string;
    citation_value: number;
    citation_id: number;
}

interface Pricing {
    pricing_id: number;
    pricing_value: number;
    pricing_urgency: number;
    pricing_duration: string;
    pricing_checked: string;
    pricing_site: string;
    xx: number;
}

const Main: React.FC = () => {
    const [ACLevels, setACLevels] = useState<ACLevel[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Handle PP Types
    const [PpTypes, setPpTypes] = useState<PpType[]>([]);
    const [selectedPpType, setSelectedPpType] = useState<string>('Essay (Any Type)');
    const [ppTypeValue, setPpTypeValue] = useState<number>(1.0);
    const [ppTypeName, setPpTypeName] = useState<string>('Essay (Any Type)');

    // Handle Subjects
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectValue, setSubjectValue] = useState<number>(1.0);
    const [subjectName, setSubjectName] = useState<string>('Essay (Any Type)');

    // Handle Title
    const [title, setTitle] = useState('');

    // Handle Instructions
    const [instructions, setInstructions] = useState('');

    // Handle File Uploads
    const [ orderId, setOrderId ] = useState<string>('2');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Handle Citations
    const citations: Citation[] = [
        { citation_name: 'APA', citation_value: 1, citation_id: 1 },
        { citation_name: 'MLA', citation_value: 2, citation_id: 2 },
        { citation_name: 'Harvard', citation_value: 3, citation_id: 3 },
        { citation_name: 'Chicago', citation_value: 4, citation_id: 4 },
        { citation_name: 'Turabian', citation_value: 5, citation_id: 5 },
        { citation_name: 'Other', citation_value: 6, citation_id: 6 },
    ];
    const citationResponse: CitationResponse = {
        data: citations
    };
    const [citationValue, setCitationValue] = useState<number>(1.0);
    const [citationtName, setCitationName] = useState<string>('APA');
    const [selectedCitationId, setSelectedCitationId] = useState<number>(1.0);

    // Handle Page Counter
    const [count, setCount] = useState<number>(1);

    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };

    const decrement = () => {
        setCount(prevCount => (prevCount > 1 ? prevCount - 1 : prevCount));
    };

    // Handle Spacing
    const [spacingValue, setSpacingValue] = useState<number>(1.0);
    const [spacingtName, setSpacingName] = useState<string>('Double');
    // Handler function to update spacing
    const handleSpacingChange = (value: number, name: string) => {
        setSpacingValue(value);
        setSpacingName(name);
    };

    // Handle Sources Counter
    const [sources, setSources] = useState<number>(0);

    const sourcesIncrement = () => {
        setSources(prevSources => prevSources + 1);
    };

    const sourcesDecrement = () => {
        setSources(prevSources => (prevSources > 0 ? prevSources - 1 : prevSources));
    };


    // Handle Slides Counter
    const [slides, setSlides] = useState<number>(0);

    const slidesIncrement = () => {
        setSlides(prevSlides => prevSlides + 1);
    };

    const slidesDecrement = () => {
        setSlides(prevSlides => (prevSlides > 0 ? prevSlides - 1 : prevSlides));
    };

    // Handle Pricing
    const [pricings, setPricings] = useState<Pricing[]>([]);
    const [selectedPricingId, setSelectedPricingId] = useState<number | null>(null);


    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchACLevelsData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opsaclevels`);
            if (!response.ok) {
                throw new Error('Network response was not ok: Academic Levels');
            }
            const aclevelsResult: ApiResponse = await response.json();
            setACLevels(aclevelsResult.data);
            // console.log();

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
                throw new Error('Network response was not ok: Paper Types');
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

    const fetchSubjectsData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opssubjects`);
            if (!response.ok) {
                throw new Error('Network response was not ok: Subjects');
            }
            const subjectsResult: SubjectResponse = await response.json();
            setSubjects(subjectsResult.data);
            setLoading(false);

            console.log(subjectsResult.data)
        } catch (error) {
            setError(error as Error);
            setLoading(false);
        }
    };


    const fetchPricingsData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opspricing`);
            if (!response.ok) {
                throw new Error('Network response was not ok: Subjects');
            }
            const pricingsResult: PricingResponse = await response.json();
            setPricings(pricingsResult.data);
            setLoading(false);

            console.log(pricingsResult.data)
        } catch (error) {
            setError(error as Error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchACLevelsData();
        fetchPptypesData();
        fetchSubjectsData();
        fetchPricingsData();
    }, []);

    const selectButton = (buttonId: number) => {
        setSelectedId(buttonId);
    };

    const selectCitationButton = (buttonName: string, buttonId: number) => {
        setCitationName(buttonName);
        setSelectedCitationId(buttonId);
        console.log(buttonName);
    };

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
        console.log('Selected files received in parent component:', files);
      };

    // Pricing Button
    const selectPricingButton = (pricingButtonId: number) => {
        setSelectedPricingId(pricingButtonId);
    };

    const firstFivePricings = pricings.slice(0, 5);
    const lastFivePricings = pricings.slice(5, 10);

    if (!ACLevels) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row w-full md:w-5/6 space-y-4 md:space-y-0 md:space-x-4">
                {/* First Column */}
                <div className="w-full md:w-2/3 p-4 bg-white shadow rounded">
                    <div className="flex flex-col md:flex-row pb-8">
                        <button className="border border-blue-950 border-l-2 border-t-2 border-r-0 border-b-2 text-blue-950 py-4 px-8 text-xl font-base">
                            1. Place an Order
                        </button>
                    </div>
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
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <select 
                                id="paperType" 
                                className="w-full p-2 border border-gray-300 rounded" 
                                onChange={(e) => {
                                    const selectedIndex = e.target.selectedIndex;

                                    // Find the selected PpType object
                                    const selectedPpType = PpTypes[selectedIndex];
                                    // console.log(selectedPpType);
                                    // console.log(selectedPpType["pptype_pvalue"]);
                                    // console.log(selectedPpType["pptype_name"]);

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
                    {/* Subject Area */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Subject Area</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <select 
                                id="paperType" 
                                className="w-full p-2 border border-gray-300 rounded" 
                                onChange={(e) => {
                                    const selectedIndex = e.target.selectedIndex;

                                    // Find the selected PpType object
                                    const selectedSubject = subjects[selectedIndex];
                                    // console.log(selectedSubject);
                                    // console.log(selectedSubject["sub_pvalue"]);
                                    // console.log(selectedSubject["sub_name"]);

                                    if(selectedSubject) {
                                        setSubjectValue(selectedSubject["sub_pvalue"]);
                                        setSubjectName(selectedSubject["sub_name"]);
                                        console.log("Instructions: ", instructions);
                                    }
                                    
                                }}
                            >
                                {subjects.map((type) => (
                                    <option key={type.sub_id} value={type.sub_pvalue}>{type.sub_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Subject Area */}

                    {/* Title Area */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Title</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                        <input 
                            type="text" 
                            id="email" 
                            className="w-full p-2 border border-gray-300 rounded" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        </div>
                    </div>
                    {/* Title Area */}

                    {/* Instructions Area */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Paper Instructions</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <textarea 
                                id="instructions" 
                                className="w-full p-2 border border-gray-300 rounded" 
                                value={instructions}
                                onChange={(e) => {
                                    setInstructions(e.target.value);
                                }}
                                rows={4}
                            />
                        </div>
                    </div>
                    {/* Instructions Area */}

                    {/* File Upload Area */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Order Files</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <OrderFiles orderId={`${orderId}`} onFilesSelected={handleFilesSelected} />
                        </div>
                    </div>
                    {/* IFile Upload Area */}

                    {/* Files List */}
                    {/*
                    <div className="flex items-center pb-4">
                        <label htmlFor="fullname" className="w-1/4 text-gray-700">Selected Files</label>
                        <ul>
                            {selectedFiles.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                    */}
                    {/* Files List */}

                    {/* Paper Format */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 md:text-md text-gray-700 mb-2 md:mb-0 font-bold pr-2">Paper Format</label>
                        <div id="button-group" className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            {citations.map((level, index) => (
                                <button
                                    key={level.citation_id}
                                    onClick={() => selectCitationButton(level.citation_name, level.citation_id)}
                                    className={`btn w-full md:w-auto px-2 py-2 text-gray-900 bg-white border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                        selectedCitationId === level.citation_id ? 'bg-blue-950 text-white' : ''
                                    }`}
                                >
                                    {level.citation_name}
                                </button>
                            ))}  
                        </div>
                    </div>
                    {/* Paper Format */}

                    {/* Pricing Details */}
                    <div className="flex flex-col md:flex-row pb-8 pt-8">
                        <button className="border border-blue-950 border-l-2 border-t-2 border-r-0 border-b-2 text-blue-950 py-4 px-8 text-xl font-base">
                            2. Pricing Details
                        </button>
                    </div>

                    {/* No. of Pages */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">No. of Pages</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <div className="flex w-full items-center">
                                <button 
                                    onClick={decrement} 
                                    className="px-8 text-xl py-2 bg-white border border-gray-300 text-red-300 hover:bg-blue-950 hover:text-white rounded-l-lg"
                                >
                                    -
                                </button>
                                <div 
                                    className="px-8 text-xl py-2 bg-white border-t border-b border-gray-300 text-center"
                                >
                                    {count}
                                </div>
                                <button 
                                    onClick={increment} 
                                    className="px-8 text-xl py-2 bg-white border border-gray-300 text-red-300 hover:bg-blue-950 hover:text-white rounded-r-lg"
                                >
                                    +
                                </button>
                            </div>
                            <p className='text-sm'>{`${count * spacingValue * 300} words approx`}</p>
                        </div>
                    </div>
                    {/* No. of Pages */}

                    {/* Word Spacing */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Word Spacing</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                        <button
                            onClick={() => handleSpacingChange(1.0, 'Double Spacing')}
                            className={`btn w-full md:w-auto px-4 py-2 text-gray-900 bg-white border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                spacingValue === 1.0 ? 'bg-blue-950 text-white' : ''
                            }`}
                        >
                            Double Spacing
                        </button>
                        <button
                            onClick={() => handleSpacingChange(2.0, 'Single Spacing')}
                            className={`btn w-full md:w-auto px-4 py-2 text-gray-900 bg-white border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                spacingValue === 2.0 ? 'bg-blue-950 text-white' : ''
                            }`}
                        >
                            Single Spacing
                        </button>
                        </div>
                    </div>
                    {/* Word Spacing */}

                    {/* No. of Sources */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">No. of Sources</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <div className="flex w-full items-center">
                                <button 
                                    onClick={sourcesDecrement} 
                                    className="px-8 text-xl py-2 bg-white border border-gray-300 text-red-300 hover:bg-blue-950 hover:text-white rounded-l-lg"
                                >
                                    -
                                </button>
                                <div 
                                    className="px-8 text-xl py-2 bg-white border-t border-b border-gray-300 text-center"
                                >
                                    {sources}
                                </div>
                                <button 
                                    onClick={sourcesIncrement} 
                                    className="px-8 text-xl py-2 bg-white border border-gray-300 text-red-300 hover:bg-blue-950 hover:text-white rounded-r-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* No. of Sources */}

                    {/* No. of Slides */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">No. of Slides</label>
                        <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <div className="flex w-full items-center">
                                <button 
                                    onClick={slidesDecrement} 
                                    className="px-8 text-xl py-2 bg-white border border-gray-300 text-red-300 hover:bg-blue-950 hover:text-white rounded-l-lg"
                                >
                                    -
                                </button>
                                <div 
                                    className="px-8 text-xl py-2 bg-white border-t border-b border-gray-300 text-center"
                                >
                                    {slides}
                                </div>
                                <button 
                                    onClick={slidesIncrement} 
                                    className="px-8 text-xl py-2 bg-white border border-gray-300 text-red-300 hover:bg-blue-950 hover:text-white rounded-r-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* No. of Slides */}

                    {/* Deadline */}
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Deadline</label>
                        <div id="button-group" className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            {/* First Row */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {firstFivePricings.map((level) => (
                                    <button
                                        key={level.pricing_id}
                                        onClick={() => selectPricingButton(level.pricing_id)}
                                        className={`btn flex-1 min-w-[calc(20%-0.5rem)] px-2 py-2 text-gray-900 bg-white border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                            selectedPricingId === level.pricing_id ? 'bg-blue-950 text-white' : ''
                                        }`}
                                    >
                                        {level.pricing_urgency} {level.pricing_duration}
                                    </button>
                                ))}
                            </div>

                            {/* Second Row */}
                            <div className="flex flex-wrap gap-2">
                                {lastFivePricings.map((level) => (
                                    <button
                                        key={level.pricing_id}
                                        onClick={() => selectPricingButton(level.pricing_id)}
                                        className={`btn flex-1 min-w-[calc(20%-0.5rem)] px-2 py-2 text-gray-900 bg-white border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                            selectedPricingId === level.pricing_id ? 'bg-blue-950 text-white' : ''
                                        }`}
                                    >
                                        {level.pricing_urgency} {level.pricing_duration}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row pb-4">
                        <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2"></label>
                        <div id="button-group" className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                            <p className='text-sm'>Mon Jul 22 2024 13:01:23 GMT+0300 (East Africa Time)</p>
                        </div>
                    </div>
                    
                    {/* Deadline */}

                    {/* Pricing Details */}
                    <div className="flex flex-col md:flex-row pb-8 pt-8">
                        <button className="border border-blue-950 border-l-2 border-t-2 border-r-0 border-b-2 text-blue-950 py-4 px-8 text-xl font-base">
                            3. Sign Up/ Login
                        </button>
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
