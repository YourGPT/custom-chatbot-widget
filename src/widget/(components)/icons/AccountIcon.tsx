function AccountIcon({ size = 24, filled = false }) {
  let content = <></>;

  if (filled) {
    content = (
      <>
        <circle cx="4" cy="4" r="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5" transform="matrix(-1 0 0 1 16.334 3.5)"></circle>
        <path
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M5.333 17.435c0-.86.541-1.628 1.352-1.917v0a16.794 16.794 0 0111.297 0v0a2.036 2.036 0 011.352 1.917v1.315c0 1.188-1.052 2.1-2.228 1.932l-.954-.136a27.002 27.002 0 00-7.637 0l-.954.136a1.951 1.951 0 01-2.228-1.932v-1.315z"
        ></path>
      </>
    );
  } else {
    content = (
      <>
        <circle cx="4" cy="4" r="4" stroke="currentColor" strokeWidth="1.5" transform="matrix(-1 0 0 1 16.334 3.5)"></circle>
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          d="M5.333 17.435c0-.86.541-1.628 1.352-1.917v0a16.794 16.794 0 0111.297 0v0a2.036 2.036 0 011.352 1.917v1.315c0 1.188-1.052 2.1-2.228 1.932l-.954-.136a27.002 27.002 0 00-7.637 0l-.954.136a1.951 1.951 0 01-2.228-1.932v-1.315z"
        ></path>
      </>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      {content}
    </svg>
  );
}

export default AccountIcon;
