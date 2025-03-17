import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {  useReadContract } from 'wagmi'
import { profileContractAddress, profileContractAbi } from './constants';

export function useHasProfile(address?: string) {
  return useReadContract({
    address: profileContractAddress as `0x${string}`, // 👈 Explicitly cast to template literal type
    abi: profileContractAbi,
    functionName: 'hasProfile',
    args: [address as `0x${string}`], // 👈 Explicitly cast to template literal type
  })
}

// ✅ Tailwind Utility Function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
