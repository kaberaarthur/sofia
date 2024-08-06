import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import React from 'react';
import { useEffect, useState } from 'react';
import UserOne from '../../images/user/user-01.png';
import config from '../../config/config';



const dummyData = {
  writer: {
    profileImage: UserOne, // Dummy profile image
    name: 'John Doe',
    reviews: '120 Reviews',
    ordersDone: '50 Orders',
  },
  orders: [
    {
      title: 'Order 1',
      pages: '10 pages',
      comment: 'Great work!',
      date: '2024-08-01',
    },
    {
      title: 'Order 2',
      pages: '5 pages',
      comment: 'Very satisfied',
      date: '2024-07-25',
    },
    // Add more dummy orders as needed
  ],
};

interface ApiResponse {
  total: number;
  data: Order[];
  writer: Writer[];
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface Writer{
  writer_id: number;
  writer_fname: string;
  writer_sname: string;
  writer_nickname: string;
  writer_email: string;
  writer_pass: string;
  writer_proimg: string;
  writer_bio: string;
  writer_country: string;
  writer_city: string;
  writer_phone: string;
  writer_citation: string;
  writer_edulevel: string;
  writer_subjects: string;
  writer_lang: string;
  writer_status: string;
  writer_paymethod: string;
  writer_paydetails: string;
  writer_level: string;
  writer_logged: string;
  writer_registered: string;
  writer_site: string;
  writer_authkey: string;
  writer_available: string;
  writer_category: string;
  writer_qsn: string;
  writer_essay: string;
  writer_essayupload: string;
  writer_lastlogged: Date;
}

interface Order {
  order_id: number;
  order_title: string;
  order_alias: string;
  order_tpaper: string;
  order_subject: string;
  ops_aclevel: string;
  order_pages: number;
  order_instructions: string;
  order_dateposted: string;
  order_timezone: string;
  order_deadline: string;
  order_wrdeadline: string;
  order_sources: number;
  order_citation: string;
  order_amount: number;
  order_wramount: number;
  order_wquality: string;
  order_upsells: string;
  order_paid: string;
  order_clientid: number;
  order_status: string;
  order_writer: number;
  order_wrconfirm: number;
  order_wrnickname: string;
  order_period: string;
  order_periodmonth: string;
  order_wrpaid: string;
  order_wrpaiddate: string;
  order_rating: number;
  order_ratecomment: string;
  order_ratedate: string;
  order_site: string;
  order_pptslides: number;
  order_spacing: string;
  order_prefwriter: number;
  order_editor: number;
  order_edamount: number;
  order_edpaid: number;
  order_edpaiddate: string;
  order_coupon: string;
  order_completeddate: string;
  order_approveddate: string;
  order_revision: string;
  order_dispute: string;
  order_note: string;
  order_currency: string;
  order_charts: number;
  order_fine: string;
  order_finereason: string;
  order_bamount: number;
  order_assignedtime: string;
  order_reassignreason: string;
  order_editorcomment: string;
  order_notewriter: string;
  order_extended: number;
  order_payreminded: number;
}

interface Result {
  order: Order;
}


interface UserData {
  client_country: string;
  client_email: string;
  client_id: number;
  client_name: string;
  client_nickname: string;
  client_phone: string;
  client_registered: string;
  client_site: string;
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  name: string;
  updated_at: string;
}

const compliments = [
  "Outstanding work!",
  "Excellent effort!",
  "Fantastic job!",
  "Superb results!",
  "Great attention to detail!",
  "Exceptional performance!",
  "Marvelous execution!",
  "Incredible skills!",
  "Terrific output!",
  "Remarkable creativity!",
  "Amazing dedication!",
  "Splendid contribution!",
  "Brilliant thinking!",
  "Wonderful job!",
  "Impressive achievement!"
];

const getRandomCompliment = () => {
  const randomIndex = Math.floor(Math.random() * compliments.length);
  return compliments[randomIndex];
};


const Main: React.FC = () => {
  const { writerId } = useParams<{ writerId: string }>();
  const [writerData, setWriterData] = useState<Writer | null>(null);
  const [orderData, setOrderData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const orderStatus = 'approved';

  useEffect(() => {
    // Define the async function to fetch writer data
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/opswriters/${writerId}`);
        if (!response.ok) {
            const errorMessage = 'Network response was not ok';
            throw new Error(errorMessage);
        }
        const result: Writer = await response.json();
        setWriterData(result);
        setLoading(false);
        console.log(`Client ID: ${result.writer_fname} ${result.writer_sname}`);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchData();
  }, []);

  // Fetch Writer's Orders Data
  const fetchData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/opsorders?order_writer=${writerId}&order_status=${orderStatus}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orderResult: ApiResponse = await response.json();
      setOrderData(orderResult.data);
      console.log(orderResult.data)
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (writerId !== undefined) {
      fetchData();
    }
  }, [writerId]);

  const orderCount = orderData?.length;

  return (
    <>
      <Breadcrumb pageName={`Writer Details - ${writerId}`} />

      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row">
          {/* Column 1 */}
          <div className="md:w-2/6 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src={dummyData.writer.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">{`${writerData?.writer_fname} ${writerData?.writer_sname}`}</h2>
              <div className="text-yellow-500 mb-2 px-2">
                <table>
                  <tbody>
                    <tr>
                      <td className="py-2 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-2 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-2 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-2 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-2 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {orderCount != null && orderCount > 0 && (
                <p className="text-gray-600">{`${orderCount} Orders`}</p>
              )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="md:w-4/6 p-4">
            <div className="grid gap-4">
              {orderData?.map((order, index) => (
                <div key={index} className="bg-transparent border border-gray-300 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{`${order.order_id} || ${order.order_title}`}</h3>
                  <p className="text-blue-600 mb-2">{`${order.order_tpaper}, ${order.order_subject}, ${order.order_pages}`}</p>
                  <hr className="mb-2"/>
                  <div className="flex justify-between">
                    <p className="text-gray-600">{getRandomCompliment()}</p>
                    <p className="text-gray-600">{order.order_dateposted}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Main;
