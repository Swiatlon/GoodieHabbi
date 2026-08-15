import { NullableString } from '@/types/global-types';

export const formatOneRepMax = (value: number | null, unit: string): NullableString => (value == null ? null : `${Math.round(value)} ${unit}`);
