import React, {useEffect, useState} from 'react';
import OrderFiles from './Components/OrderFiles';
import { Link, useNavigate } from 'react-router-dom';


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

type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
  };

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    console.log("User Token", token)

    const [ACLevels, setACLevels] = useState<ACLevel[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [acLevelValue, setACLevelValue] = useState<number | null>(null);
    const [acLevelName, setACLevelName] = useState<string>('Undergraduate');

    // Handle PP Types
    const [PpTypes, setPpTypes] = useState<PpType[]>([]);
    const [selectedPpType, setSelectedPpType] = useState<string>('Essay (Any Type)');
    const [ppTypeValue, setPpTypeValue] = useState<number>(1.0);
    const [ppTypeName, setPpTypeName] = useState<string>('Essay (Any Type)');

    // Handle Subjects
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectValue, setSubjectValue] = useState<number>(1.0);
    const [subjectName, setSubjectName] = useState<string>('Archeology');

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

    // Create Order
    // First get the User Details
    const [user, setUser] = useState<User | null>(null);
    const [dlPricing, setDLPricing] = useState<number>(5.79);

    const fetchUser = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                }
              });
      
              if (!response.ok) {
                throw new Error('Failed to fetch user details');
              }
      
              const userData = await response.json();
              setUser(userData);
              console.log(userData.name)
        } catch (error) {
            console.log("Unable to Fetch User")
        }
    }

    const createOrder= async () => {
        try {
            // First Create the Order and get Order Number
            // Calculate prices considering Coupon e.t.c
            // Use Order ID to upload the files
            console.log("Creating Order")
            uploadFiles();
        } catch (error) {
            console.log("Error Creating Order");
            setOverError("Error Creating Order");
        }
    }

    const [cpnName, setCPNName] = useState<string>('');
    const [cpnValue, setCPNValue] = useState<number>(0);
    const [cpnInValue, setCPNInValue] = useState<number>(0);

    const fetchCoupon = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opscoupons?cpn_name=${cpnName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch coupon data');
            }
            
            const cpnResponse = await response.json();
            if (cpnResponse.data && cpnResponse.data.length > 0) {
                setCPNValue(cpnResponse.data[0].cpn_value);
                setCPNInValue(cpnResponse.data[0].cpn_invalue);
            } else {
                console.log('No coupons found');
            }
        } catch(error) {
            setError(error as Error);
        }
    }

    const fetchACLevelsData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/opsaclevels`);
            if (!response.ok) {
                throw new Error('Network response was not ok: Academic Levels');
            }
            const aclevelsResult: ApiResponse = await response.json();
            setACLevels(aclevelsResult.data);

            // Set the default selected button based on aclevel_checked field
            const defaultSelected = aclevelsResult.data.find(level => level.aclevel_checked);
            setSelectedId(defaultSelected ? defaultSelected.aclevel_id : null);
            
            // Print the data of the default selected
            if (defaultSelected) {
                console.log("Default selected academic level:", defaultSelected.aclevel_value);
                setACLevelValue(Number(defaultSelected.aclevel_value))
            }

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

            // console.log(pptypesResult.data)
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

            // console.log(subjectsResult.data)
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

            // Set the default selected button based on aclevel_checked field
            const defaultSelected = pricingsResult.data.find(level => level.pricing_checked);
            setSelectedPricingId(defaultSelected ? defaultSelected.pricing_id : null);
            
            // Print the data of the default selected
            if (defaultSelected) {
                console.log("Default selected academic level:", defaultSelected.pricing_value);
                setDLPricing(Number(defaultSelected.pricing_value))

                const calculatedTime = addTime(`${defaultSelected.pricing_urgency}${defaultSelected.pricing_duration}`);
                setNewTime(calculatedTime);
            }

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

    const selectButton = (buttonId: number, acLevelNameHere: string) => {
        setSelectedId(buttonId);
        setACLevelName(acLevelNameHere)
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

    const clearFiles = () => {
        setSelectedFiles([]);
        setResponses([]);
        // setShowAlert(false);
        (document.getElementById('file') as HTMLInputElement).value = '';
    };

    // Upload Files
    const [responses, setResponses] = useState<string[]>([]);
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
            } else {
              newResponses.push(`Error uploading file ${file.name}: ${result.message}`);
            }
          } catch (error) {
            if (error instanceof Error) {
              newResponses.push(`Error uploading file ${file.name}: ${error.message}`);
            } else {
              newResponses.push(`Error uploading file ${file.name}: An unknown error occurred`);
            }
          }
        }
        // window.location.reload();
    
        setResponses(newResponses);
        clearFiles();
        // console.log(newResponses);
    };

    // Handle Deadline
    const [deadlineString, setDeadlineString] = useState<string>('');

    const addTime = (duration: string): Date => {
        const currentTime = new Date();
    
        const regex = /^(\d+)(Hours|Days)$/;
        const match = duration.match(regex);
    
        if (!match) {
            throw new Error("Invalid duration format. Use '48Hours' or '5Days'.");
        }
    
        const value = parseInt(match[1], 10);
        const unit = match[2];
    
        switch (unit) {
            case 'Hours':
                currentTime.setHours(currentTime.getHours() + value);
                break;
            case 'Days':
                currentTime.setDate(currentTime.getDate() + value);
                break;
            default:
                throw new Error("Invalid time unit. Use 'Hours' or 'Days'.");
        }
    
        return currentTime;
    };

    const [newTime, setNewTime] = useState<Date | null>(null);

    const handleCalculateNewTime = () => {
        try {
            const calculatedTime = addTime(deadlineString);
            setNewTime(calculatedTime);
        } catch (error) {
            setOverError('Error calculating Time');
            console.log('Error calculating Time');
        }
    };

    const selectPricingButton = (pricingButtonId: number, pricingUrgency: number, pricingDuration: string) => {
        setSelectedPricingId(pricingButtonId);
        setDeadlineString(`${pricingUrgency}${pricingDuration}`);
        console.log(deadlineString);
    };

    const firstFivePricings = pricings.slice(0, 5);
    const lastFivePricings = pricings.slice(5, 10);

    // Handle Signup/Signin
    const [activeTab, setActiveTab] = useState<string>('new');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    // User Management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [overError, setOverError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showFieldsError, setShowFieldsError] = useState(false);
    const [requestError, setRequestError] = useState(false);
    const domain = window.location.hostname;


    
    // console.log("User Token: ", token)

    useEffect(() => {
        if (token) {
            // If the token is populated, run your function here
            fetchUser();
        }
    }, [token]);


    const handleLogin = async () => {

        // Check if all fields are entered
        if (!email || !password) {
          console.log('All fields are required.');
          setShowFieldsError(true);
          return;
        }
    
        // Send data to the API
        try {
          const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('storedUser', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data);

            // Do Not Redirect
            // navigate('/sofia/opsdashboard')
          } else {
            const errorData = await response.json();
            console.log('Login failed: ', errorData.message);
            setRequestError(errorData.message);
            setLoginError(errorData.message);
          }
        } catch (error) {
          console.error('Error during registration:', error);
        }
      };
    
      const handleRegister = async () => {
        // Check if all fields are entered
        if (!email || !name || !phone || !password || !passwordConfirmation) {
          console.log('All fields are required.');
          setShowFieldsError(true);
          return;
        }
    
        // Check if passwords match
        if (password !== passwordConfirmation) {
          console.log('Passwords do not match.');
          setRequestError(true);
          setOverError('Passwords do not match.');
          return;
        }
    
        // Log the values of the fields entered
        console.log('Email:', email);
        console.log('Full Name:', name);
        console.log('Phone Number:', phone);
        console.log('Password:', password);
        console.log('Password Confirmation:', passwordConfirmation);
    
        // Send data to the API
        try {
          const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              email: email,
              password: password,
              password_confirmation: passwordConfirmation,
              client_phone: phone,
              client_site: domain,
              client_country: 'United States',
            }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('storedUser', data.user);
            setToken(data.token);
            setUser(data);
            // Do not Redirect
            // navigate('/sofia/opsdashboard');
          } else {
            const errorData = await response.json();
            console.log('Registration failed:', errorData);
            setRequestError(true)
            setOverError("Registration has Failed");
          }
        } catch (error) {
          console.error('Error during registration:', error);
        }
      };
    
    



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
                                    onClick={() => {
                                        selectButton(level.aclevel_id, level.aclevel_name);
                                        setACLevelValue(Number(level.aclevel_value));
                                        // console.log("AC Level Value", level.aclevel_value);
                                    }}
                                    className={`btn w-full md:w-auto px-2 py-2 border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                        selectedId === level.aclevel_id ? 'bg-blue-950 text-white' : 'text-gray-900 bg-white'
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
                                        console.log("Subject Name: ", selectedSubject["sub_name"]);
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
                                    className={`btn w-full md:w-auto px-2 py-2 border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                        selectedCitationId === level.citation_id ? 'bg-blue-950 text-white' : 'text-gray-900 bg-white'
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
                                className={`btn w-full md:w-auto px-4 py-2 border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                    spacingValue === 1.0 ? 'bg-blue-950 text-white' : 'text-gray-900 bg-white'
                                }`}
                            >
                                Double Spacing
                            </button>
                            <button
                                onClick={() => handleSpacingChange(2.0, 'Single Spacing')}
                                className={`btn w-full md:w-auto px-4 py-2 border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                    spacingValue === 2.0 ? 'bg-blue-950 text-white' : 'text-gray-900 bg-white'
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
                        <div id="button-group" className="flex flex-col w-full space-y-2">
                            {/* First Row */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {firstFivePricings.map((level) => (
                                    <button
                                        key={level.pricing_id}
                                        onClick={() => {
                                            selectPricingButton(level.pricing_id, level.pricing_urgency, level.pricing_duration);
                                            setDLPricing(level.pricing_value);
                                            const calculatedTime = addTime(`${level.pricing_urgency}${level.pricing_duration}`);
                                            setNewTime(calculatedTime);
                                        }}
                                        className={`btn flex-1 min-w-[calc(20%-0.5rem)] px-2 py-2 border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                            selectedPricingId === level.pricing_id ? 'bg-blue-950 text-white' : 'text-gray-900 bg-white'
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
                                        onClick={() => {
                                            selectPricingButton(level.pricing_id, level.pricing_urgency, level.pricing_duration);
                                            setDLPricing(level.pricing_value);
                                            const calculatedTime = addTime(`${level.pricing_urgency}${level.pricing_duration}`);
                                            setNewTime(calculatedTime);
                                        }}
                                        className={`btn flex-1 min-w-[calc(20%-0.5rem)] px-2 py-2 border border-gray-300 hover:bg-blue-950 hover:text-white ${
                                            selectedPricingId === level.pricing_id ? 'bg-blue-950 text-white' : 'text-gray-900 bg-white'
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
                            <p className='text-sm'>{newTime?.toLocaleString()}</p>
                        </div>
                    </div>
                    
                    {/* Deadline */}

                    

                    {/* Sign up/Sign in */}
                    {token ? (
                        <div>
                            {/* Continue Button */}
                            <div className="flex flex-col md:flex-row pb-4">
                                <button className='border border-blue-950 w-full py-4 text-2xl hover:text-blue-950 hover:bg-transparent bg-blue-950 text-white' onClick={createOrder}>Place Order</button>
                            </div>
                        </div>
                    ) : (
                    <>
                    {/* Sign In Title */}
                    <div className="flex flex-col md:flex-row pb-8 pt-8">
                        <button className="border border-blue-950 border-l-2 border-t-2 border-r-0 border-b-2 text-blue-950 py-4 px-8 text-xl font-base">
                            3. Sign Up/Login
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row pb-4">
                            <div className="w-full">
                                <div className="flex border-b border-gray-300 mb-4">
                                    <button
                                        className={`px-4 py-2 text-gray-800 ${
                                            activeTab === 'new' ? 'border-b-2 border-blue-500' : ''
                                        }`}
                                        onClick={() => handleTabClick('new')}
                                    >
                                        New Customer
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-gray-800 ${
                                            activeTab === 'returning' ? 'border-b-2 border-blue-500' : ''
                                        }`}
                                        onClick={() => handleTabClick('returning')}
                                    >
                                        Returning Customer
                                    </button>
                                </div>
                                <div className="p-4">
                                    {activeTab === 'new' && (
                                        <>
                                        {/* Name */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Full Name</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <input 
                                                    type="text" 
                                                    id="email" 
                                                    className="w-full p-2 border border-gray-300 rounded" 
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Email Address</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <input 
                                                    type="text" 
                                                    id="email" 
                                                    className="w-full p-2 border border-gray-300 rounded" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Phone</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <input 
                                                    type="text" 
                                                    id="email" 
                                                    className="w-full p-2 border border-gray-300 rounded" 
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Password</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <div className='relative'>
                                                    <input
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter your password"
                                                        className="w-full rounded-sm border border-stroke border-blue-950 bg-transparent py-4 pl-2 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    />

                                                    <span className="absolute right-4 top-4"  onClick={() => setShowPassword(!showPassword)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password Confirmation */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Re-type Password</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <div className='relative'>
                                                    <input
                                                        value={passwordConfirmation}
                                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                        required
                                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                                        placeholder="Enter your password"
                                                        className="w-full rounded-sm border border-stroke border-blue-950 bg-transparent py-4 pl-2 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    />

                                                    <span className="absolute right-4 top-4"  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Agree to Terms */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2"></label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <p>By registering to this website, you automatically agree to the <span className='text-red-500 text-sm'>Terms and Conditions</span></p>
                                            </div>
                                        </div>

                                        {/* Registration Error */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <p className='text-sm text-red-500'>{overError}</p>
                                        </div>

                                        {/* Continue Button */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <button className='border border-blue-950 w-full py-4 text-2xl hover:text-blue-950 hover:bg-transparent bg-blue-950 text-white' onClick={handleRegister}>Sign Up</button>
                                        </div>
                                        </>
                                    )}
                                    {activeTab === 'returning' && (
                                        <>
                                        {/* Email */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Email Address</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <input 
                                                    type="text" 
                                                    id="signinemail" 
                                                    className="w-full p-2 border border-gray-300 rounded" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <label htmlFor="title" className="w-full md:w-1/4 text-gray-700 mb-2 md:mb-0 font-bold pr-2">Password</label>
                                            <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                                                <input 
                                                    type="password" 
                                                    id="signinpassword" 
                                                    className="w-full p-2 border border-gray-300 rounded" 
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* lOGIN Error */}
                                        <div className="flex flex-col md:flex-row pb-4">
                                            <p className='text-sm text-red-500'>{loginError}</p>
                                        </div>

                                        {/* Sign in Button */}
                                        <div className="flex flex-col md:flex-row pb-4 pt-4">
                                            <button 
                                                className='border border-blue-950 w-full py-4 text-2xl hover:bg-transparent hover:text-blue-950 bg-blue-950 text-white'
                                                onClick={handleLogin}
                                            >
                                                Login
                                            </button>
                                        </div>
                                        </>
                                    )}
                                </div>
                            </div>
                    </div>
                    </>
                    )}
                    {/* Title Area */}
                </div>

                {/* Second Column */}
                <div className="w-full md:w-1/3 p-4 bg-green-100 shadow h-1/6">
                    <div className="mb-2 text-lg font-semibold text-gray-700">
                        {acLevelName}
                        <hr className="border-gray-300 my-4" />
                    </div>
                    <div className="mb-2 text-base text-gray-700">{ppTypeName}</div>
                    <div className="mb-2 text-base text-gray-700">{subjectName}</div>
                    <div className="mb-2 text-base text-gray-700">{citationtName}</div>
                    {acLevelValue && (
                        <div className="mb-2 text-base text-gray-700">{count} Pages x {Number((acLevelValue * ppTypeValue * dlPricing * spacingValue).toFixed(2))} <span className='font-semibold text-gray-900'>USD {Number((acLevelValue * count * ppTypeValue * dlPricing * spacingValue).toFixed(2))}</span></div>
                    )}
                    {slides > 0 && acLevelValue && (
                        <div className="mb-2 text-base text-gray-700">
                            {slides} PPT Slide <span className='font-semibold text-gray-900'>USD {Number((slides * acLevelValue * ppTypeValue * 3.50).toFixed(2))}</span>
                        </div>
                    )}
                    {cpnValue > 0 && acLevelValue && cpnInValue > 0 && (
                        <div className="mb-2 text-base text-gray-700">
                            <div className="mb-2 text-base text-gray-700">{`Discount (${cpnInValue}%) `} 
                                <span className='font-semibold text-gray-900'>
                                    USD {
                                        (() => {
                                            const totalPrice = Number(((acLevelValue * count * ppTypeValue * dlPricing * spacingValue) + (slides * acLevelValue * ppTypeValue * 3.50)).toFixed(2));
                                            const discountPercentage = cpnInValue / 100; // cpnInValue is 20 for a 20% discount
                                            const discountAmount = totalPrice * discountPercentage;
                                            return discountAmount.toFixed(2);
                                        })()
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-x-0 top-0 border-t border-gray-700 my-2"></div>
                    {acLevelValue && (
                        <div className="mb-2 text-base text-gray-700">{`Total Price `}
                            <span className='font-semibold text-gray-900'>
                                USD {
                                    (() => {
                                        const totalAmount = Number(((acLevelValue * count * ppTypeValue * dlPricing * spacingValue) + (slides * acLevelValue * ppTypeValue * 3.50)).toFixed(2));
                                        if (cpnInValue > 0) {
                                            const discountPercentage = cpnInValue / 100; // cpnInValue is 20 for a 20% discount
                                            const discountAmount = totalAmount * discountPercentage;
                                            const discountedPrice = totalAmount - discountAmount;
                                            return discountedPrice.toFixed(2);
                                        } else {
                                            return totalAmount.toFixed(2);
                                        }
                                    })()
                                }
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-x-0 top-0 border-b border-gray-700 my-2"></div>
                    <div className="flex items-center">
                        <input
                            value={cpnName}
                            onChange={(e) => setCPNName(e.target.value)}
                            type="text" 
                            placeholder="Enter Coupon Code" 
                            className="w-2/3 p-2 border border-gray-300 rounded" 
                        />
                        <button 
                            className="w-1/3 p-2 ml-2 text-white bg-blue-950 rounded hover:bg-blue-700"
                            onClick={fetchCoupon}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
