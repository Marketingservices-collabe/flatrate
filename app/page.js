'use client';
import { useEffect, useState } from 'react';

export default function MasterDashboard() {
  const [activeTab, setActiveTab] = useState('rates'); // 'rates' or 'customers'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Re-fetch data whenever user clicks a different tab
  useEffect(() => {
    setLoading(true);
    setError(null);

    const targetApi = activeTab === 'rates' ? '/api/rates' : '/api/customers';

    fetch(targetApi)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data from API route.');
        return res.json();
      })
      .then((resData) => {
        if (resData.error) {
          setError(resData.error);
        } else {
          setData(resData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Zentrades Data Hub</h1>
          <p className="text-sm text-gray-500 mt-1">Live automated data portal syncing from Metabase</p>
        </div>

        {/* Dynamic Tab Navigation Buttons */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-all ${activeTab === 'rates'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            📋 Flat Rates List
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-all ${activeTab === 'customers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            👤 Customer Details ({data.length})
          </button>
        </div>

        {/* Loading and Error Conditional States */}
        {loading && (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
            Fetching active records...
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <h3 className="font-bold text-lg mb-1">Data Retrieval Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Data Tables */}
        {!loading && !error && (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
            <div className="overflow-x-auto"> {/* This enables horizontal scrolling for wide columns */}

              {activeTab === 'rates' ? (
                /* Flat Rates Table View Layout */
                <table className="min-w-full divide-y divide-gray-300 text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Sell Price</th>
                      <th className="px-6 py-4">Section</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                    {data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono font-medium text-gray-900">{item.code || '—'}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{item.description || '—'}</td>
                        <td className="px-6 py-4 font-semibold text-emerald-600">${Number(item.rate || 0).toFixed(2)}</td>
                        <td className="px-6 py-4">{item.sectionType || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600'
                            }`}>
                            {item.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* COMPREHENSIVE CUSTOMER DETAILS TABLE VIEW */
                <table className="min-w-full divide-y divide-gray-300 text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3 whitespace-nowrap">Unique ID</th>
                      <th className="px-4 py-3 whitespace-nowrap">Customer Name</th>
                      <th className="px-4 py-3 whitespace-nowrap">Additional Name</th>
                      <th className="px-4 py-3 whitespace-nowrap">Property Type</th>
                      <th className="px-4 py-3 whitespace-nowrap">Email Address</th>
                      <th className="px-4 py-3 whitespace-nowrap">Contact Numbers</th>
                      <th className="px-4 py-3 whitespace-nowrap">Address Line 2</th>
                      <th className="px-4 py-3 whitespace-nowrap">City</th>
                      <th className="px-4 py-3 whitespace-nowrap">State</th>
                      <th className="px-4 py-3 whitespace-nowrap">Zip Code</th>
                      <th className="px-4 py-3 whitespace-nowrap">Country</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                    {data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        {/* Unique ID */}
                        <td className="px-4 py-3 font-mono font-medium text-gray-900 whitespace-nowrap">
                          {item.customerUniqueId || '—'}
                        </td>

                        {/* Customer Name */}
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                          {`${item.firstName || ''} ${item.lastName || ''}`.trim() || '—'}
                        </td>

                        {/* Additional Name */}
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {item.additionalName || '—'}
                        </td>

                        {/* Property Type Relation Name */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                            {item.customerType || '—'}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-blue-600 font-medium whitespace-nowrap">
                          {item.email || '—'}
                        </td>

                        {/* Cellphone & Landline Split Cells */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">📱 {item.mobile || '—'}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">☎️ {item.landline || '—'}</div>
                        </td>

                        {/* Address Line 2 */}
                        <td className="px-4 py-3 max-w-xs truncate">
                          {item.addressLine2 || '—'}
                        </td>

                        {/* City */}
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                          {item.city || '—'}
                        </td>

                        {/* State */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.state || '—'}
                        </td>

                        {/* Zip Code */}
                        <td className="px-4 py-3 font-mono whitespace-nowrap">
                          {item.zipCode || '—'}
                        </td>

                        {/* Country */}
                        <td className="px-4 py-3 whitespace-nowrap uppercase tracking-wider font-semibold text-gray-400">
                          {item.country || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>

            {data.length === 0 && (
              <div className="p-8 text-center text-gray-400">This dataset contains zero record entries.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}