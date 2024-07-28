import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import config from '../../config/config';

interface ApiResponse {
  total: number;
  data: Order[];
  next_page_url: string | null;
  prev_page_url: string | null;
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

const Main: React.FC = () => {
  const [orderData, setOrderData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [orderClientId, setOrderClientId] = useState<number>();
  const [requestPage, setRequestPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(1);

  const [nextPageURL, setNextPageURL] = useState<string | null>(null);
  const [prevPageURL, setPrevPageURL] = useState<string | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);

  const perPage = 10;
  const orderStatus = 'editing';

  const [user, setUser] = useState(null);

  // Get the Token stored in Local Storage
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('storedUser');
  const storedUserData = storedUser ? JSON.parse(storedUser) : null;

  // Get the User Details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/user`, {
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
        setOrderClientId(userData.id);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [token]);

  // Fetch Orders Data
  const fetchData = async (page: number) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/opsorders?page=${page}&order_clientid=${orderClientId}&per_page=${perPage}&order_status=${orderStatus}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orderResult: ApiResponse = await response.json();
      // console.log("Prev Page: " + orderResult.prev_page_url);
      // console.log("Next Page: " + orderResult.next_page_url);

      setTotalPosts(orderResult.total);
      setPrevPageURL(orderResult.prev_page_url);
      setNextPageURL(orderResult.next_page_url);
      setOrderData(orderResult.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderClientId !== undefined) {
      fetchData(requestPage);
    }
  }, [orderClientId, requestPage]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const handlePayment = (amount: number) => {
    // Your code to handle the payment goes here, using the 'amount' parameter
    console.log(`Processing payment for amount: ${amount}`);
  }

  const handleNext = () => {
    if (nextPageURL) {
      setRequestPage(requestPage + 1);
    }
  };

  const handlePrevious = () => {
    if (requestPage > 1) {
      setRequestPage(requestPage - 1);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Editing Orders" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Order ID
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Topic
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Level
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Pages
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Price
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order, index) => (
              <tr key={order.order_id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    <Link to={`/sofia/opsoneorder/${order.order_id}`} className="text-blue-500">{order.order_id}</Link>
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.order_title}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.ops_aclevel}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.order_pages} {" (" + order.order_pages * 300 + " Words)"}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  $ {order.order_amount}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {
                      order.order_paid === 'unpaid' ? (
                        <button
                          className="w-full xl:mr-3 text-white bg-primary p-2"
                          onClick={() => handlePayment(order.order_amount)}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          className="w-full xl:mr-3 text-white bg-success p-2"
                          onClick={() => console.log('Paid')}
                        >
                          Already Paid
                        </button>
                      )
                    }
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BEGIN: Previous Next */}
        <div className="text-center pt-8 pb-8">
          {prevPageURL && (
            <button className="w-36 mr-2 bg-primary text-white p-2 font-semibold" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {nextPageURL && (
            <button className="w-36 ml-2 bg-primary text-white p-2 font-semibold" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
        {/* END: Previous Next */}
      </div>
    </div>
    </>
  );
};

export default Main;
