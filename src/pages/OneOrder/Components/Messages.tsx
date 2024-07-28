import React from 'react';
import { useEffect, useState, ChangeEvent } from 'react';
import UserTwentyFour from '../../../images/user/user-24.png';
import config from '../../../config/config';


interface InstructionsProps {
    orderId: string;
}

interface Result {
    data: OrderMessage[];
}

interface OrderMessage {
    msg_id?: number; // optional because it is auto-incremented
    msg_orderid: number;
    msg_to: string;
    msg_senderid: number;
    msg_sendername: string;
    msg_body: string;
    msg_date: string; // ISO 8601 date string
    msg_sendertype: string;
    msg_adread: number;
    msg_clread: number;
    msg_wrread: number;
}

const Messages: React.FC<InstructionsProps> = ({ orderId }) => {
    const [orderMessageData, setOrderMessageData] = useState<OrderMessage[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [editorData, setEditorData] = useState("");

    const clientId = localStorage.getItem('order_clientid');


    // Fetch Messages
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${config.apiBaseUrl}/opsordermsg?msg_orderid=${orderId}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const result: Result = await response.json();
            setOrderMessageData(result.data);
            console.log("Order Messages")
            console.log(`${orderId} - Messages Data: `, result)
            setLoading(false);
          } catch (error) {
            setError(error as Error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, [orderId]);

      // Handle sending a message
    const sendMessage = async () => {
        try {
        const token = "2|4xdF9NrlcXq6flcsf4KdQrgfFBAKWFn92UPJMd5I6cf58807";
        const csrfToken = "rpLf22otwPUx6VOE2Pz0fInVCzxdaehpXHodCr9Y"

        const response = await fetch(`${config.apiBaseUrl}/opsordermsg`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
            msg_orderid: orderId,
            msg_to: 'support', // Define the recipient if needed
            msg_senderid: clientId,
            msg_sendername: 'Client Name', // Replace with actual sender name
            msg_body: editorData,
            msg_sendertype: 'client', // Define sender type if needed
            msg_adread: 0,
            msg_clread: 0,
            msg_wrread: 0,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        // Update the message list with the new message
        const newMessage: OrderMessage = await response.json();
        setOrderMessageData(prevMessages => prevMessages ? [...prevMessages, newMessage] : [newMessage]);
        setEditorData(""); // Clear editor after sending

        // Optionally, fetch updated messages again to ensure consistency
        // fetchMessages();
        } catch (error) {
        console.error('Error sending message:', error);
        // Handle error state or notification to user
        }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditorData(event.target.value);
      };

    return(
        <>
            <div className="px-5 pt-5 pb-16 bg-gray-100">
                {orderMessageData?.map((msg, index) => (
                    <div
                    key={index}
                    className={`lg:${`${msg.msg_senderid}` === `${clientId}` ? 'mr-[51%]' : 'ml-[51%]'} pl-6 lg:pl-0 lg:pr-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 ${`${msg.msg_senderid}` === `${clientId}`  ? 'before:right-[60px]' : 'before:left-[60px]'} before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]`}
                    >
                    <div className="bg-blue-100 dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-x-0 before:ml-0.5 lg:before:ml-auto before:mr-auto before:dark:bg-darkmode-300 after:content-[''] after:absolute after:w-3 after:h-3 after:bg-slate-50 after:rounded-full after:inset-x-0 after:ml-1.5 lg:after:ml-auto after:mr-auto after:mt-1 after:dark:bg-darkmode-200">
                        <div className="mr-3">
                        <div className="w-12 h-12 image-fit">
                            <img
                            alt="Profile"
                            className="rounded-full"
                            src={UserTwentyFour}
                            />
                        </div>
                        </div>
                        <div>
                        <a href="#" className="font-medium text-primary">
                            {`${msg.msg_sendername} `}
                        </a>
                        {/*msg.msg_body*/}
                        <div dangerouslySetInnerHTML={{ __html: msg.msg_body }} />
                        <div className="text-slate-500 text-xs mt-1.5">
                            {msg.msg_date}
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
                <div className="mt-3">
                <div className="mt-2">
                    <textarea
                        value={editorData}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Type here..."
                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    ></textarea>
                </div>
                </div>
                <div className="mt-5 text-right pb-16">
                <button
                    className="w-24 mr-1 bg-danger text-white p-2 text-xl"
                    onClick={() => setEditorData("<p>Type here...</p>")}
                >
                    Clear
                </button>
                <button className="w-24 bg-primary text-white p-2 text-xl" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </>
    )
};

export default Messages;
