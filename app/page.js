'use client';
import { useEffect, useState } from 'react';

export default function FlatRatesDashboard() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/rates')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load API data');
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setRates(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-500 animate-pulse">Loading Flat Rates Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md bg-red-50 border border-red-200 rounded-lg text-red-800">
          <h2 className="font-bold text-lg mb-2">Configuration Error</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Veseind Flat Rates</h1>
            <p className="text-sm text-gray-500 mt-1">Live data synced from Metabase via Google Sheets</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
            {rates.length} Items Loaded
          </span>
        </div>

        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
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
              {rates.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900 whitespace-nowrap">{item.code || 'N/A'}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.description || '—'}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 whitespace-nowrap">
                    {item.sellPrice ? `$${Number(item.sellPrice).toFixed(2)}` : '$0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.section || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${String(item.isActive).toUpperCase() === 'TRUE'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                      {String(item.isActive).toUpperCase() === 'TRUE' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}