import React from 'react';
import { render } from '@testing-library/react-native';
import RatioBar from './ratio-bar';

describe('RatioBar Component', () => {
  it('renders nothing if total value is 0', () => {
    const segments = [
      { label: 'A', value: 0, color: 'red' },
      { label: 'B', value: 0, color: 'blue' },
    ];
    const { toJSON } = render(<RatioBar segments={segments} />);
    expect(toJSON()).toBeNull();
  });

  it('renders all segments with correct widths and colors', () => {
    const segments = [
      { label: 'A', value: 1, color: 'red' },
      { label: 'B', value: 3, color: 'blue' },
    ];
    const { getByText } = render(<RatioBar segments={segments} />);

    expect(getByText('25%')).toBeTruthy();
    expect(getByText('75%')).toBeTruthy();
  });

  it('renders segment labels as percentage of total', () => {
    const segments = [
      { label: 'X', value: 2, color: 'green' },
      { label: 'Y', value: 2, color: 'orange' },
    ];
    const { getAllByText } = render(<RatioBar segments={segments} />);
    expect(getAllByText('50%').length).toBe(2);
  });

  it('rounds the displayed percentage correctly', () => {
    const segments = [
      { label: 'P1', value: 1, color: 'purple' },
      { label: 'P2', value: 2, color: 'pink' },
      { label: 'P3', value: 7, color: 'cyan' },
    ];
    const { getByText } = render(<RatioBar segments={segments} />);

    expect(getByText('10%')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('70%')).toBeTruthy();
  });
});

describe('RatioBar Component', () => {
  it('renders nothing if total value is 0', () => {
    const segments = [
      { label: 'A', value: 0, color: 'red' },
      { label: 'B', value: 0, color: 'blue' },
    ];
    const { toJSON } = render(<RatioBar segments={segments} />);
    expect(toJSON()).toBeNull();
  });

  it('renders all segments with correct widths and colors', () => {
    const segments = [
      { label: 'A', value: 1, color: 'red' },
      { label: 'B', value: 3, color: 'blue' },
    ];
    const { getByText } = render(<RatioBar segments={segments} />);

    expect(getByText('25%')).toBeTruthy();
    expect(getByText('75%')).toBeTruthy();
  });

  it('renders segment labels as percentage of total', () => {
    const segments = [
      { label: 'X', value: 2, color: 'green' },
      { label: 'Y', value: 2, color: 'orange' },
    ];
    const { getAllByText } = render(<RatioBar segments={segments} />);
    expect(getAllByText('50%').length).toBe(2);
  });

  it('rounds the displayed percentage correctly', () => {
    const segments = [
      { label: 'P1', value: 1, color: 'purple' },
      { label: 'P2', value: 2, color: 'pink' },
      { label: 'P3', value: 7, color: 'cyan' },
    ];
    const { getByText } = render(<RatioBar segments={segments} />);

    expect(getByText('10%')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('70%')).toBeTruthy();
  });
});
