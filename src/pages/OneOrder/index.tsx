import { useEffect, useState } from 'react';
import Instructions from './Components/Instructions';
import OrderFiles from './Components/OrderFiles';
import Messages from './Components/Messages';
import { useParams } from 'react-router-dom';

const Main = () => {
    const [content, setContent] = useState<JSX.Element | null>(null);
    const { orderId } = useParams<{ orderId: string }>();

    useEffect(() => {
        setContent(<Instructions orderId={`${orderId}`} />);
    }, []);



    return (
        <div>
            <div className="flex justify-between mb-4">
            <button
                onClick={() => setContent(<Instructions orderId={`${orderId}`} />)}
                className="bg-primary text-white font-semibold py-2 px-4 rounded"
            >
                Instructions
            </button>
            <button
                onClick={() => setContent(<OrderFiles />)}
                className="bg-primary text-white font-semibold py-2 px-4 rounded"
            >
                Order Files
            </button>
            <button
                onClick={() => setContent(<Messages />)}
                className="bg-primary text-white font-semibold py-2 px-4 rounded"
            >
                Messages
            </button>
            </div>
            <div>
            {content}
            </div>
        </div>
    );
};

export default Main;
