'use client';

import { useEffect, useState } from 'react';
import FilterPanel from '../components/FilterPanel';
import ChartContainer from '../components/ChartContainer';
import TopicIntensityChart from '../components/TopicIntensityChart';
import API from '../utils/api';

type DataPoint = {
  end_year?: string;
  topic?: string;
  sector?: string;
  region?: string;
  pestle?: string;
  source?: string;
  swot?: string;
  country?: string;
  city?: string;
  intensity?: number;
  likelihood?: number;
  relevance?: number;
};

export default function Dashboard() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, val]) => val)
      );
      try {
        const res = await API.get('/data', { params });
        setData(res.data);
      } catch (err) {
        console.error('API error:', err);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-cyan-400">
          Visualization Dashboard
        </h1>
        <p className="text-sm text-gray-400">Filtered insight from JSON data</p>
      </header>

      <section className="bg-gray-900 p-4 rounded mb-6 shadow-md">
        <FilterPanel filters={filters} setFilters={setFilters} />
      </section>

      <TopicIntensityChart filters={filters} />

      <section className="bg-gray-900 p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">
          Showing {data.length} entries
        </h2>
        <div className="overflow-auto max-h-[400px] bg-gray-800 p-3 rounded text-sm">
          <pre>{JSON.stringify(data.slice(0, 5), null, 2)}</pre>
        </div>
      </section>
      <ChartContainer data={data} />
    </main>
  );
}
