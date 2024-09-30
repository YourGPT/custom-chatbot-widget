function HomeIcon({ size = 24, filled = false }) {
  const filledD = `M14.615 4.763l5.002 3.695a3.733 3.733 0 011.545 3.003v6.689a3.903 3.903 0 01-3.989 3.79H7.16a3.903 3.903 0 01-3.998-3.79V11.46a3.733 3.733 0 011.544-3.003l5.002-3.695a4.15 4.15 0 014.907 0zM7.898 17.932h8.527a.71.71 0 100-1.421H7.898a.71.71 0 100 1.42z`;
  const outlineD = `M20.452 7.96l-5.56-4.11a4.63 4.63 0 00-5.46 0l-5.55 4.11a4.14 4.14 0 00-1.72 3.34v7.43a4.34 4.34 0 004.44 4.23h11.12a4.34 4.34 0 004.44-4.23v-7.44a4.15 4.15 0 00-1.71-3.33zm.21 10.77a2.84 2.84 0 01-2.94 2.73H6.602a2.85 2.85 0 01-2.94-2.73V11.3a2.65 2.65 0 011.11-2.14l5.55-4.1a3.12 3.12 0 013.68 0l5.55 4.11a2.61 2.61 0 011.11 2.12v7.44zm-13-2.02h9a.75.75 0 010 1.5h-9a.75.75 0 010-1.5z"
    `;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fillRule="evenodd" d={filled ? filledD : outlineD} clipRule="evenodd"></path>
    </svg>
  );
}

export default HomeIcon;
