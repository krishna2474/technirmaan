type inputProps = {
  label: string;
};
export const Label = ({ label }: inputProps) => {
  return (
    <>
      <div className="w-full px-2 md:w-1/2 lg:w-1/3">
        <div className="">
          <label className="mb-[5px] block text-base font-medium text-dark text-white">
            {label}
          </label>
        </div>
      </div>
    </>
  );
};
