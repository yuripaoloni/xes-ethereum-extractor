type RemoveIconProps = {
  height?: number;
  width?: number;
};

const RemoveIcon = ({ height = 30, width = 30 }: RemoveIconProps) => {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      height={height}
      width={width}
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm4.253 9.25h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"
        fillRule="nonzero"
        fill="#6B7280"
      />
    </svg>
  );
};

export default RemoveIcon;
