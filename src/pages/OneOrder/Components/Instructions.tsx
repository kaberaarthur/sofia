import React from 'react';
import { useEffect, useState } from 'react';

interface InstructionsProps {
    orderId: string;
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


const Instructions: React.FC<InstructionsProps> = ({ orderId }) => {
    
    const [orderData, setOrderData] = useState<Order | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Define the async function to fetch data
        const fetchData = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/api/opsorders/${orderId}`);
            if (!response.ok) {
                const errorMessage = 'Network response was not ok';
                throw new Error(errorMessage);
            }
            const result: Order = await response.json();
            setOrderData(result);
            setLoading(false);
            console.log(result);
          } catch (error) {
            setError(error as Error);
            setLoading(false);
          }
        };
    
        // Call the fetch function
        fetchData();
      }, []);

    if(!orderData){
        return <div>Loading...</div>;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Item
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    Order ID
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData.order_id}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Type of Service
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_tpaper}, {orderData?.order_subject}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Format
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_citation}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Amount
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_amount}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Writer ID
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_writer}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Pages
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_pages}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  # of Slides
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_pptslides}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  # of Charts
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_charts}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  # of Pages
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_pages}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Deadline
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_deadline}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Academic Level
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.ops_aclevel}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Number of Sources
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                  {orderData?.order_sources}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                  Instructions
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white" dangerouslySetInnerHTML={{ __html: orderData?.order_instructions ?? '' }}></p>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
    );
};

export default Instructions;
