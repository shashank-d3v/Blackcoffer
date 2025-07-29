'use client';

import { useEffect, useState } from 'react';
import API from '../utils/api';

type Filters = Record<string, string>;
type Options = Record<string, string[]>;

interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const [options, setOptions] = useState<Options>({});

  useEffect(() => {
    API.get('/filters')
      .then((res) => setOptions(res.data))
      .catch((err) => console.error('Failed to fetch filters', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4">
      {Object.entries(options).map(([key, values]) => (
        <div key={key}>
          <label className="block mb-1 text-sm text-gray-300 capitalize">{key}</label>
          <select
            name={key}
            onChange={handleChange}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">All</option>
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
