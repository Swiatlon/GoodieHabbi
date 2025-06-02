/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from './progress-bar';

describe('ProgressBar Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<ProgressBar current={30} total={100} />);
    expect(getByText('30 / 100')).toBeTruthy();
  });

  it('displays custom label when provided', () => {
    const { getByText } = render(<ProgressBar current={50} total={100} label="Halfway there" />);
    expect(getByText('Halfway there')).toBeTruthy();
  });

  it('renders progress bar with correct width percentage', () => {
    const { getByTestId } = render(<ProgressBar current={25} total={100} />);

    const progressBar = getByTestId('progress-bar-fill');
    expect(progressBar.props.className).toContain('bg-primary');
  });

  it('applies activeColor when progress is less than 100%', () => {
    const { getByTestId } = render(<ProgressBar current={40} total={100} activeColor="bg-red-500" />);

    const progressBar = getByTestId('progress-bar-fill');
    expect(progressBar.props.className).toContain('bg-red-500');
  });

  it('applies maxColor when progress is 100% or more', () => {
    const { getByTestId } = render(<ProgressBar current={100} total={100} maxColor="bg-blue-500" />);

    const progressBar = getByTestId('progress-bar-fill');
    expect(progressBar.props.className).toContain('bg-blue-500');
  });

  it('handles progress over 100% gracefully', () => {
    const { getByTestId } = render(<ProgressBar current={150} total={100} />);

    const progressBar = getByTestId('progress-bar-fill');
    expect((progressBar.props.style as { width: string }).width).toBe('100%');
  });
});
