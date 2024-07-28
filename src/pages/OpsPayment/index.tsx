import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config/config';

declare global {
  interface Window {
    paypal: any;
  }
}

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

interface OrderDetails {
  ops_aclevel: string;
  order_alias: string;
  order_timezone: string;
  order_upsells: string | null;
  order_wrnickname: string;
  order_period: string;
  order_periodmonth: string;
  order_ratecomment: string;
  order_revision: string | null;
  order_dispute: string | null;
  order_note: string | null;
  order_fine: string | null;
  order_finereason: string | null;
  order_reassignreason: string | null;
  order_editorcomment: string | null;
  order_notewriter: string | null;
  order_amount: number;
  order_approveddate: string;
  order_assignedtime: string;
  order_bamount: number;
  order_charts: number;
  order_citation: string;
  order_clientid: number;
  order_completeddate: string;
  order_coupon: string;
  order_currency: string;
  order_dateposted: string;
  order_deadline: string;
  order_edamount: number;
  order_editor: number;
  order_edpaid: number;
  order_edpaiddate: string;
  order_extended: number;
  order_instructions: string;
  order_pages: number;
  order_paid: string;
  order_payreminded: number;
  order_pptslides: number;
  order_prefwriter: number;
  order_ratedate: string;
  order_rating: number;
  order_site: string;
  order_sources: number;
  order_spacing: string;
  order_status: string;
  order_subject: string;
  order_title: string;
  order_tpaper: string;
  order_wquality: string;
  order_wramount: number;
  order_wrconfirm: number;
  order_wrdeadline: string;
  order_writer: number;
  order_wrpaid: string;
  order_wrpaiddate: string;
  order_id: number;
}

interface PaymentDetails {
  pay_method: string;
  pay_site: string;
  pay_payerid: string;
  pay_payername: string;
  pay_email: string;
  pay_itemname: string;
  pay_itemid: string;
  pay_itemprice: string;
  pay_currency: string;
  pay_itemcurrency: string;
  pay_amount: string;
  pay_txnid: string;
  pay_status: string;
  pay_created: string; // Assuming this is a date in string format, you can use Date type if it's a Date object
  pay_modified: string; // Assuming this is a date in string format, you can use Date type if it's a Date object
  pay_type: string;
}

const OpsPayment: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // console.log(token);

  const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Function to Post Payment Details
  const handlePayment = async () => {
    // if (!paymentDetails) return;
    
    const url = `${config.apiBaseUrl}/opspayments`;
    // console.log("Payment Details Object: ", paymentDetails);

     
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentDetails)
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const result = await response.json();
      // console.log("Payment recorded successfully:", result);
      updateOrder();

    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
      
  };

  // Update Order Details
  const updateOrder = async () => {
    const url = `${config.apiBaseUrl}/opsorders/${orderId}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "order_paid": "paid" })
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Order updated successfully:", result);
      navigate(`/sofia/opsoneorder/${orderId}`)

    } catch (error) {
      console.error('Error updating order details:', error);
      throw error;
    }
  };

  // Function to fetch order details
  const fetchOrder = async (orderId: number) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/opsorders/${orderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: OrderDetails = await response.json();
      setOrderData(data);
      console.log("Order Object", data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
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
      console.log(userData.name);
    } catch (error) {
      console.log("Unable to Fetch User");
    }
  }

  useEffect(() => {
    fetchUser();
    if (orderId) {
      fetchOrder(Number(orderId));
    }
  }, [orderId]);

  // Update payment details whenever orderData or user changes
  useEffect(() => {
    if (orderData && user) {
      setPaymentDetails({
        pay_method: 'System',
        pay_site: window.location.hostname,
        pay_payerid: String(user.id),
        pay_payername: String(user.name),
        pay_email: String(user.email),
        pay_itemname: String(orderData.order_title),
        pay_itemid: String(orderData.order_id),
        pay_itemprice: String(orderData.order_amount),
        pay_currency: 'usd',
        pay_itemcurrency: 'usd',
        pay_amount: String(orderData.order_amount),
        pay_txnid: 'txnid',
        pay_status: 'succeeded',
        pay_created: getCurrentDateTime(),
        pay_modified: getCurrentDateTime(),
        pay_type: 'purchase',
      });
    }
  }, [orderData, user]);

  useEffect(() => {
    // Load the PayPal script
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AdPRHZZ3Rsf9Ts4jBzDYnkRnD9u--sKJ3Pf77pWc5KVVw2S95zNvpZDifhOHLdR_P4cPDEhGBHgrbqir';
    script.async = true;
    script.onload = () => {
      initPayPalButtons();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup the script
      document.body.removeChild(script);
    };
  }, [orderData]);

  const initPayPalButtons = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: orderData ? Number(orderData.order_amount) : 1
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          return actions.order.capture().then(async (details: any) => {
            // console.log('Payment completed:', details);
            setLoading(true);
            try {
              console.log("Start Payment Update");
              handlePayment();  // Ensure handlePayment is awaited
            } catch (error) {
              console.error('Error handling payment:', error);
            }
          });
        },
        onError: (err: any) => {
          console.error('Error during payment:', err);
        }
      }).render('#paypal-button-container');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-md">
        <p>Pay USD {orderData ? Number(orderData.order_amount) : 1}</p>
        <div id="paypal-button-container" className="mt-4"></div>
        <button 
          className='bg-blue-500 px-4 py-2 w-full text-white rounded-sm font-semibold'  
          onClick={() => navigate(`/sofia/opsoneorder/${orderId}`)}
          // onClick={() => {updateOrder();}}
        >
          Skip to Order
        </button>
      </div>
    </div>
  );
};

export default OpsPayment;
