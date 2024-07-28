import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../../images/cover/cover-01.png';
import config from '../../config/config';

interface ApiResponse {
  data: Coupon[];
}

interface Coupon {
  cpn_id: number;     
  cpn_value: number;  
  cpn_invalue: number;
  cpn_name: string;   
  cpn_active: number;
  cpn_type: string;   
  cpn_times: number;  
  cpn_mode: string;   
  cpn_client: string; 
}

const Main: React.FC = () => {
  const [data, setData] = useState<Coupon[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch Coupons
  const fetchData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/opscoupons`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orderResult: ApiResponse = await response.json();
      setData(orderResult.data);
      console.log("Coupons Data: ", orderResult.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data === null) {
    return <div>Loading...</div>; // Optional: Show a loading indicator while fetching data
  }

  if (data.length === 0) {
    return <div>No Coupons Found</div>;
  }


  return (
    <>
      <Breadcrumb pageName="My Discounts" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="discounts cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              My Discounts
            </h3>
            <p className="font-medium">Below are the available discounts for you to use in your order/orders. Be checking regularly for any available promotional codes. Thank you for your trust on our writing services</p>
          </div>
        </div>
        {/* Start: Table Here */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  #
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Percentage
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Code
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
            {data.map((coupon, index) => (
                <tr key={coupon.cpn_id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-blue-500 dark:text-white">
                      {index + 1}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {coupon.cpn_invalue}%
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {coupon.cpn_name}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {coupon.cpn_active ? 'Active' : 'Expired'}
                    </p>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* End: Table Here */}
      </div>
    </>
  );
};

export default Main;
