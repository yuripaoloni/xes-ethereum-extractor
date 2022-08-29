type AddIconProps = {
  height?: number;
  width?: number;
};

const AddIcon = ({ height = 30, width = 30 }: AddIconProps) => {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      color="red"
      className="bg-red"
      height={height}
      width={width}
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
        fillRule="nonzero"
        fill="#6B7280"
      />
    </svg>
  );
};

export default AddIcon;
