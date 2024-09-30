function ChatIcon({ size = 24, filled = false }) {
  let paths: any = null;

  if (filled) {
    paths = (
      <>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M17.723 2.96H6.603a4.6 4.6 0 00-4.44 4.71V21.4a1.11 1.11 0 001.9.84l2.37-2.53a2.42 2.42 0 011.73-.75h9.52a4.6 4.6 0 004.48-4.77V7.67a4.6 4.6 0 00-4.44-4.71zm-9.31 5.22h5a.75.75 0 010 1.5h-5a.75.75 0 110-1.5zm0 5.5h7.5a.75.75 0 000-1.5h-7.5a.75.75 0 000 1.5z"
          clipRule="evenodd"
        ></path>
      </>
    );
  } else {
    paths = (
      <>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M6.604 2.96h11.12a4.6 4.6 0 014.44 4.74v6.52a4.6 4.6 0 01-4.48 4.74h-9.52a2.42 2.42 0 00-1.73.78l-2.37 2.53a1.08 1.08 0 01-.78.35 1.15 1.15 0 01-1.12-1.19V7.7a4.6 4.6 0 014.44-4.74zm11.12 14.5a3.1 3.1 0 002.94-3.24V7.7a3.1 3.1 0 00-2.94-3.24H6.604a3.1 3.1 0 00-2.94 3.24v12.8l1.63-1.78a4 4 0 012.87-1.26h9.56z"
          clipRule="evenodd"
        ></path>
        <path fill="currentColor" d="M8.414 9.71h5a.75.75 0 000-1.5h-5a.75.75 0 100 1.5zM15.914 12.21h-7.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5z"></path>
      </>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      {paths}
    </svg>
  );
}

export default ChatIcon;
