'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface DataPoint {
  country?: string;
  intensity?: number;
}

interface ChartProps {
  data: DataPoint[];
}

export default function ChartContainer({ data }: ChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length || !chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove(); // clear previous chart

    const width = 600;
    const height = 400;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Step 1: Aggregate total intensity by country
    const aggregated = d3.rollups(
      data,
      (v) => d3.sum(v, (d) => d.intensity ?? 0),
      (d) => d.country || 'Unknown'
    );

    const x = d3.scaleBand()
      .domain(aggregated.map(([key]) => key))
      .range([40, width - 20])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregated, ([, val]) => val)!])
      .nice()
      .range([height - 30, 20]);

    // Bars
    svg.append('g')
      .selectAll('rect')
      .data(aggregated)
      .join('rect')
      .attr('x', ([key]) => x(key)!)
      .attr('y', ([, val]) => y(val))
      .attr('width', x.bandwidth())
      .attr('height', ([, val]) => y(0) - y(val))
      .attr('fill', '#06b6d4');

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - 30})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '0.75rem')
      .style('fill', '#ccc');

    // Y Axis
    svg.append('g')
      .attr('transform', `translate(40, 0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '0.75rem')
      .style('fill', '#ccc');
  }, [data]);

  return (
    <div className="mt-6 bg-gray-900 rounded p-4 shadow">
      <h2 className="text-xl font-semibold mb-2 text-cyan-400">
        Total Intensity by Country
      </h2>
      <svg ref={chartRef} className="w-full h-[400px]" />
    </div>
  );
}
