'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import API from '../utils/api';

interface TopicIntensity {
  topic: string;
  intensity: number;
}

interface Props {
  filters: Record<string, string>;
}

export default function TopicIntensityChart({ filters }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<TopicIntensity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v)
        );
        const res = await API.get('/topic-intensity', { params });
        const payload: TopicIntensity[] = res.data || [];
        payload.sort((a, b) => b.intensity - a.intensity);
        setData(payload);
      } catch (e) {
        setError('Failed to load data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!data.length) return;

    const width = 600;
    const barHeight = 25;
    const margin = { top: 20, right: 20, bottom: 30, left: 150 };
    const height = margin.top + margin.bottom + barHeight * data.length;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.intensity) || 0])
      .range([margin.left, width - margin.right])
      .nice();

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.topic))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', margin.left)
      .attr('y', (d) => y(d.topic)!)
      .attr('height', y.bandwidth())
      .attr('width', (d) => x(d.intensity) - margin.left)
      .attr('fill', '#06b6d4');

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '0.75rem')
      .style('fill', '#ccc');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .style('font-size', '0.75rem')
      .style('fill', '#ccc');
  }, [data]);

  return (
    <div className="mt-6 bg-gray-900 rounded p-4 shadow">
      <h2 className="text-xl font-semibold mb-2 text-cyan-400">Topic Intensity</h2>
      {loading && (
        <div className="flex justify-center p-4">
          <div className="w-6 h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-gray-400">No data found</p>
      )}
      <svg ref={svgRef} className={data.length ? 'w-full h-[400px]' : 'w-full h-0'} />
    </div>
  );
}

