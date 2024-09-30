function ScanIcon({ size = 24 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M21 9.14V7.29a4 4 0 00-4-4h-1.85M21 15.44v1.85a4 4 0 01-4 4h-1.85m-6.3 0H7a4 4 0 01-4-4v-1.85m0-6.3V7.29a4 4 0 014-4h1.85"></path>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 12.29H2"></path>
      <path fill="currentColor" fillRule="evenodd" d="M6 9.29a3 3 0 013-3h6a3 3 0 013 3v1.25H6V9.29zm0 2.75v.5h12v-.5H6zm0 2h12v1.25a3 3 0 01-3 3H9a3 3 0 01-3-3v-1.25z" clipRule="evenodd"></path>
    </svg>
  );
}

export default ScanIcon;
