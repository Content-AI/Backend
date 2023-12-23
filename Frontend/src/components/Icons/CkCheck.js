function CkCheck({ classes, color = "#FFFFFF", bg = "#38A169" }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classes}
    >
      <rect width="32" height="32" rx="16" fill={bg} />
      <path
        d="M14.0007 19.172L23.1927 9.979L24.6077 11.393L14.0007 22L7.63672 15.636L9.05072 14.222L14.0007 19.172Z"
        fill={color}
      />
    </svg>
  );
}

export default CkCheck;
