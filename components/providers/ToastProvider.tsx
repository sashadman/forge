//creating a provider folder/file to solve the react toast noification issue in server components. This provider will be used in the layout.tsx file to wrap the entire application and provide the toast notification functionality to all components.
'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '14px',
          borderRadius: '8px',
        },
      }}
    />
  )
}